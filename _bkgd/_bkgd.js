/*
 * Background manager
 *
 * Copyright by Misha Panyushkin
 * Github repo: https://github.com/misha-panyushkin/_bkgd
 * Follow:      https://github.com/misha-panyushkin
 *
 */

! function (w, $) {

    "use strict";

    if (!$ || !w) return;

    var document = w.document;

    var _bkgd = function (url, elem, color) {

        var defer = $.Deferred();

        var that = this;

        this.$frame = $((elem instanceof w.HTMLDocument || elem instanceof w.HTMLElement) ? elem : document.documentElement);

        this.$frame.css({
            backgroundColor: color || "#000",
            width: "100%",
            height: "100%"
        });

        this.src = url;

        this.$image  = $("<img/>").attr("src", url);

        if (this.$image.get(0).complete) {
            defer.resolve(this.$image.get(0));
        } else {
            this.$image.get(0).onload = function (event) {
                defer.resolve(this, event);
            };
        }

        this.promise = defer.promise();

        this.couple = ["auto", "auto"];

        this.matchSwitch = function (aspect) {
            if (aspect.matches) {
                that.$frame.css("backgroundSize", that.couple.slice(0).reverse().join(" ") );
            } else {
                that.$frame.css("backgroundSize", that.couple.join(" "));
            }
        };

        this.centerMatchSwitch = function (aspect) {
            if (aspect.matches) {
                that.couple = ["auto", "auto"];
                if (that.ratio >= 1) {
                    that.couple[0] = "100%";
                } else {
                    that.couple[1] = "100%";
                }
                that.matchSwitch(that.aspect);
            } else {
                that.couple = ["", ""];
                that.$frame.css("backgroundSize", "");
            }
        };
    };

    _bkgd.prototype = {

        pave: function () {
            var that = this;

            this.clean();
            this.promise.done(function () {
                that.$frame.css({
                    backgroundImage:    "url('" + that.src + "')",
                    backgroundRepeat:   "repeat",
                    backgroundPosition: "left top",
                    backgroundSize:     "auto"
                });
            });

            return this;
        },

        scratch: function () {
            var that = this;

            this.clean();
            this.promise.done(function () {
                that.$frame.css({
                    backgroundImage:    "url('" + that.src + "')",
                    backgroundRepeat:   "no-repeat",
                    backgroundPosition: "left top",
                    backgroundSize:     "100% auto"
                });
            });

            return this;
        },

        always: function (isCenter) {
            var that = this;

            this.clean();
            this.promise.done(function (img) {
                that.$frame.css("backgroundPosition", isCenter ? "50% 50%" : "left top");

                that.$frame.css({
                    backgroundImage:    "url('" + that.src + "')",
                    backgroundRepeat:   "no-repeat"
                });

                that.ratio  = img.width/img.height;

                that.aspect = w.matchMedia("(" + (that.ratio >= 1 ? "min" : "max") + "-aspect-ratio:" + img.width + "/" + img.height + ")");

                if (isCenter ? that.ratio >= 1 : that.ratio < 1) {
                    that.couple[0] = "100%";
                } else {
                    that.couple[1] = "100%";
                }


                if (isCenter) {
                    that.outside_aspect = w.matchMedia("(max-width:" + img.width + "px) and (max-height:" + img.height + "px) , (max-width:" + img.width + "px) , (max-height:" + img.height + "px)");
                    that.centerMatchSwitch(that.outside_aspect);
                    that.outside_aspect.addListener(that.centerMatchSwitch);
                }

                that.matchSwitch(that.aspect);
                that.aspect.addListener(that.matchSwitch);
            });

            return this;
        },

        center: function () {
            this.always("center");
        },

        clean: function () {
            this.$frame.css({
                backgroundImage:    "",
                backgroundRepeat:   "",
                backgroundPosition: "",
                backgroundSize:     ""
            });

            this.couple = ["auto", "auto"];
            this.aspect && this.aspect.removeListener(this.matchSwitch);
            this.outside_aspect && this.outside_aspect.removeListener(this.centerMatchSwitch);

            return this;
        }
    };

    w._bkgd = _bkgd;

} (this, this.jQuery);