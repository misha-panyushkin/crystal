! function (w, $) {
    "use strict";

    if (!w || !$) return;

    var view1 = $(".view1");
    var view2 = $(".view2");
    var view3 = $(".view3");
    var view4 = $(".view4");
    var view5 = $(".view5");

    var _view1 = new _bkgd(
        "http://www.jenography.net/wp-content/uploads/2011/06/nyc-from-flickr-use-this.jpg",
        view1.get(0),
        "#000"
    );
    _view1.center();

    var _view2 = new _bkgd(
        "http://beccasara.files.wordpress.com/2011/08/2011-07-31_18-08-12_109.jpg",
        view2.get(0),
        "#A02529"
    );
    _view2.center();

    var _view3 = new _bkgd(
        "http://s1.ibtimes.com/sites/www.ibtimes.com/files/styles/v2_article_large/public/2011/06/20/117153-yellow-cabs-in-manhattan.jpg",
        view3.get(0),
        "#1C6B15"
    );
    _view3.center();

    var _view4 = new _bkgd(
        "http://images-2.drive.com.au/2010/08/06/1753694/nyc-cabs_420-420x0.jpg",
        view4.get(0),
        "#1D6B6B"
    );
    _view4.center();

    var _view5 = new _bkgd(
        "http://static.panoramio.com/photos/large/48762052.jpg",
        view5.get(0),
        "#691167"
    );
    _view5.center();

    var action1 = new _action(view1.get(0)).setPosition({x:0,y:0,unitX:"%",unitY:"%"});
    var action2 = new _action(view2.get(0)).setPosition({x:0,y:-100,unitX:"%",unitY:"%"});
    var action3 = new _action(view3.get(0)).setPosition({x:100,y:0,unitX:"%",unitY:"%"});
    var action4 = new _action(view4.get(0)).setPosition({x:0,y:100,unitX:"%",unitY:"%"});
    var action5 = new _action(view5.get(0)).setPosition({x:-100,y:0,unitX:"%",unitY:"%"});

    var app_matrix = new _app_matrix([0, 1, 0,
                                      1, 1, 1,
                                      0, 1, 0], 3, 22);

    var gesture = new _gesture(window.document);
    gesture.listen(function (state) {

        var params = {};
        var swipe;
        var next_point;
        var next_point_shift = {x:0, y:0};
        var translate_callback = function () {};

        if (state.mode.indexOf("start") !== -1) {
            params = {x:0, y:0, speed:0, axis:state.axis};
        } else if (state.mode.indexOf("move") !== -1) {
            switch (state.axis) {
                case "x":
                    params = {x:state.offsetX, speed:0, axis:state.axis};
                    break;
                case "y":
                    params = {y:state.offsetY, speed:0, axis:state.axis};
                    break;
            }
        } else if (state.mode.indexOf("swipe") !== -1) {
            swipe = state.mode.split("swipe")[1];
            if (swipe !== "back" && swipe !== "none") {
                next_point = app_matrix.checkTranslateAvailability(swipe);
                console.log(next_point);
                if (next_point) {
                    app_matrix.setTranslatePoint(next_point);
                }
            }
            next_point_shift = app_matrix.getTranslatePointShift();
            translate_callback = function () {
                // todo Set always on every element but the app.matrix the same!
                app_matrix.setCurrent();
                this.setPosition(next_point_shift);
            };
            switch (state.axis) {
                case "x":
                case "y":
                    params = {speed:500, direct:1, axis:state.axis, callback: translate_callback};
                    break;
                default:
                    params = {speed:500, direct:1, axis:state.axis, callback: translate_callback};
                    break;
            }
            $.extend(params, next_point_shift);
        }
        action1.move(params);
        action2.move(params);
        action3.move(params);
        action4.move(params);
        action5.move(params);
        //console.log(state.mode);
    });

} (this, this.jQuery);