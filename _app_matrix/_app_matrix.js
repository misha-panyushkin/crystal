/*
 * Application matrix manager
 *
 * Copyright by Misha Panyushkin
 * Github repo: https://github.com/misha-panyushkin/_app_matrix
 * Follow:      https://github.com/misha-panyushkin
 *
 */


! function (w, $) {

    "use strict";

    if (!$ || !w) return;

    var _app_matrix = function (matrix, columns, start_point) {
        if (!matrix || !start_point) return;
        this.matrix = matrix;
        this.columns = columns;
        this.current = start_point.toString().split("");
    };

    _app_matrix.prototype = {

        /*
         * @param point {Number} The translate point position
         * */
        getTranslatePointShift: function (point) {

            point = point ? point.toString().split("") : this.getTranslatePoint();

            var coord = {
                unitX: "%",
                unitY: "%"
            };
            var diff = [];
            diff[0] = point[0] - (this.current)[0];
            diff[1] = point[1] - (this.current)[1];
            /*
            * No diagonal translate support.
            * */
            /*
             if (diff[0] === 0) {
                if (diff[1] < 0) {
                    coord.x = 100;
                } else if (diff[1] > 0) {
                    coord.x = -100;
                }
                coord.unitX = "%";
            } else if (diff[1] === 0) {
                if (diff[0] < 0) {
                    coord.y = 100;
                } else if (diff[0] > 0) {
                    coord.y = -100;
                }
                coord.unitY = "%";
            }
            */

            coord.x = -100*diff[1];
            coord.y = -100*diff[0];

            return coord;
        },

        /*
         * @param direction {String} The translate direction on of ["up", "right", "down", "left"]
         * */
        checkTranslateAvailability: function (direction) {
            var pos = this.getPosition(direction);
            return this.checkPosition(pos.join(""));
        },
         /*
         * @param direction {String} The translate direction on of ["up", "right", "down", "left"]
         * */
        getPosition: function (direction) {
            var pos = (this.translate_point || this.current).slice();
            switch (direction) {
                case "up":
                    ++pos[0];
                    break;
                case "right":
                    pos[1] && --pos[1];
                    break;
                case "down":
                    pos[0] && --pos[0];
                    break;
                case "left":
                    ++pos[1];
                    break;
                default:
                    // todo Return current position
                    break;
            }
            return pos;
        },
        /*
         * @param next_point {Number} The matrix element position
         * @return The next point position or 0 (if its unavailable or current position).
         * */
        checkPosition: function (point) {
            var next = point.toString().split("");
            var elem = this.matrix[(next[0]-1)*this.columns + parseInt(next[1]) - 1];
            if (elem === 1) {
                return point;
            } else if (elem === 2) {
                return 0;
            } else {
                return 0;
            }
        },

        /*
         * @param next_point {Number} The matrix element position
         * */
        setCurrent: function (next_point) {
            this.current = next_point ? next_point.toString().split("") : this.getTranslatePoint();
            this.removeTranslatePoint();
        },

        /*
         * @param translate_point {Number} The point is translating to
         * */
            setTranslatePoint: function (translate_point) {
            this.translate_point = translate_point.toString().split("");
        },

        getTranslatePoint: function () {
            return this.translate_point || this.current;
        },

        removeTranslatePoint: function () {
            this.translate_point = null;
        }

    };

    w._app_matrix = _app_matrix;

} (this, this.jQuery);