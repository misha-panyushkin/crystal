/*
 * Action manager
 *
 * Copyright by Misha Panyushkin
 * Github repo: https://github.com/misha-panyushkin/_action
 * Follow:      https://github.com/misha-panyushkin
 *
 */

! function (w, $) {

    "use strict";

    if (!w || !$) return;

    var _action = function (elem) {
        this.target = $(elem || document);
        this.position = {
            x:0,
            y:0,
            unitX:"%",
            unitY:"%"
        };
        this.speed = 0;
        this.offsetX = 0;
        this.offsetY = 0;
    };

    _action.prototype = {

        setPosition: function (pos) {
            this.position.x += pos.x ? parseFloat(pos.x) : 0;
            this.position.y += pos.y ? parseFloat(pos.y) : 0;
            // todo Possible conflict in units
            this.position.unitX = this.position.unitX || pos.unitX;
            this.position.unitY = this.position.unitX || pos.unitY;

            this.target.css("left", this.position.x + this.position.unitX);
            this.target.css("top",  this.position.y + this.position.unitY);

            return this;
        },

        move: function (params) {

            var style, matrix, shiftX, shiftY;

            if (this.inProcess) {
                this.inProcess = false;

                style = window.getComputedStyle(this.target.get(0));
                matrix = new WebKitCSSMatrix(style.webkitTransform);

                this.offsetX = matrix.m41;
                this.offsetY = matrix.m42;
            }

            /*
            if (this.offsetX === 0 && this.offsetY !== 0) {
                params.x = 0;
            } else if (this.offsetY === 0 && this.offsetX !== 0) {
                params.y = 0;
            }*/

            if (params.speed > 0) {
                this.setSpeed(params.speed);
                this.setListener(params.callback);
            } else if (params.speed === 0) {
                this.setSpeed(params.speed);
            }

            /*
            * Translate action support
            * */
            shiftX = (!params.direct ? this.offsetX : 0) + (params.x ? (parseFloat(params.x)) : 0);
            shiftY = (!params.direct ? this.offsetY : 0) + (params.y ? (parseFloat(params.y)) : 0);

            /*
             * Custom units support
             * */
            params.unitX = params.unitX || "px";
            params.unitY = params.unitY || "px";

            this.target.css("transform", "translate3d(" + shiftX + params.unitX + "," + shiftY + params.unitY + ",0)");
            return this;
        },

        setListener: function (callback) {
            var that     = this;
            var pre_callback = function () {
                that.inProcess = false;
                that.removeSpeed();
                that.removeTransform();
                callback && callback.bind && callback.call(that);
                that.target.off("webkitTransitionEnd", pre_callback);
            };
            this.inProcess = true;
            // todo Remove webkit transition on certain callback
            this.target.off("webkitTransitionEnd");
            this.target.on("webkitTransitionEnd", pre_callback);
        },

        setSpeed: function (speed) {
            this.speed = speed;
            this.target.css("transition", "all " + this.speed + "ms");
            return this;
        },

        removeSpeed: function () {
            this.speed = 0;
            this.target.css("transition", "");
            return this;
        },

        removeTransform: function () {
            this.offsetX = 0;
            this.offsetY = 0;
            this.target.css("transform", "");
            return this;
        }
    };

    w._action = _action;

} (this, this.jQuery);