/*
 * Swipe manager
 *
 * Copyright by Misha Panyushkin
 * Github repo: https://github.com/misha-panyushkin/_gesture
 * Follow:      https://github.com/misha-panyushkin
 *
 */


! function (w, $) {

    "use strict";

    if (!$ || !w) return;

    var document = w.document;

    var ROLLBACK_SHIFT_X = 25;
    var ROLLBACK_SHIFT_Y = 25;

    var _gesture = function (elem) {
        this.$target = $(elem || document);
        this.state = {};
    };

    _gesture.prototype = {
        /*
        * @param callback {Function} To be invoke each time event from the list occurred
        *                           [start,
        *                            movenone,  moveback,  moveup,  moveright,  movedown,  moveleft,
        *                            swipenone, swipeback, swipeup, swiperight, swipedown, swipeleft]
        * */
        listen: function (callback) {
            this.callback = callback || function () {};
            $(document).on("mousemove", {context:this}, this._whenEvent);
            this.$target.on("mousedown mouseup", {context:this}, this._whenEvent);
        },

        _preCallback: function () {
            switch (this.state.mode) {
                case "start":
                    break;
                case "move":
                    this.state.mode = this.state.mode + this._directionDetection();
                    break;
                case "stop":
                    this.state.mode = "swipe" + this._directionDetection();
                    break;
            }
            this.callback($.extend({}, this.state));
        },

        _horizontalDetection:   function (absX) {
            if (absX > ROLLBACK_SHIFT_X) {
                if (this.state.offsetX > 0) {
                    return "right";
                } else if (this.state.offsetX < 0) {
                    return "left";
                } else {
                    return "none";
                }
            } else {
                return "back";
            }
        },
        _verticalDetection:     function (absY) {
            if (absY > ROLLBACK_SHIFT_Y) {
                if (this.state.offsetY > 0) {
                    return "down";
                } else if (this.state.offsetY < 0) {
                    return "up";
                } else {
                    return "none";
                }
            } else {
                return "back";
            }
        },

        _directionDetection: function () {
            var absX = Math.abs(this.state.offsetX);
            var absY = Math.abs(this.state.offsetY);

            if (this.state.axis === "x") {
                return this._horizontalDetection(absX);
            } else if (this.state.axis === "y") {
                return this._verticalDetection(absY);
            } else {
                if (absX > absY) {
                    this.state.axis = "x";
                    return this._horizontalDetection(absX);
                } else if (absX < absY) {
                    this.state.axis = "y";
                    return this._verticalDetection(absY);
                } else {
                    return "none";
                }
            }
        },

        _whenEvent: function (event) {
            switch (event.type) {
                case "mousedown":
                    event.data.context.state            = {}; // Cleaning up.
                    event.data.context.state.catched    = true;
                    event.data.context.state.mode       = "start";
                    event.data.context.state.startX     = event.clientX;
                    event.data.context.state.startY     = event.clientY;
                    event.data.context._preCallback();
                    break;

                case "mousemove":
                    if (event.data.context.state.catched) {
                        event.data.context.state.mode       = "move";
                        event.data.context.state.offsetX    = event.clientX - event.data.context.state.startX;
                        event.data.context.state.offsetY    = event.clientY - event.data.context.state.startY;
                        event.data.context._preCallback();
                    }
                    break;

                case "mouseup":
                    event.data.context.state.catched    = false;
                    event.data.context.state.mode       = "stop";
                    event.data.context._preCallback();
                    break;
            }
        }
    };

    w._gesture = _gesture;

} (this, this.jQuery);