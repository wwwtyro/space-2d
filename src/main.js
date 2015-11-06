"use strict";

var qs = require("query-string");

var Scene = require("./space-2d.js");

window.onload = function() {

    var params = qs.parse(location.hash);

    var ControlsMenu = function() {
        this.seed = params.seed || generateRandomSeed();
        this.randomize = function() {
            this.seed = "" + generateRandomSeed();
            render();
        };
        this.pointStars = params.pointStars === undefined ? true : params.pointStars === "true";
        this.stars = params.stars === undefined ? true : params.stars === "true";
        this.sun = params.sun === undefined ? true : params.sun === "true";
        this.nebulae = params.nebulae === undefined ? true : params.nebulae === "true";
        this.shortScale = params.shortScale === undefined ? false : params.shortScale === "true";
        this.width = params.width || 1600;
        this.height = params.height || 900;
        this.render = function() {
            render();
        };
    };

    var menu = new ControlsMenu();
    var gui = new dat.GUI({
        autoPlace: false,
        width: 320
    });
    gui.add(menu, 'seed').name("Seed").listen().onFinishChange(render);
    gui.add(menu, 'randomize').name("Randomize seed");
    gui.add(menu, 'pointStars').name("Point stars").onChange(render);
    gui.add(menu, 'stars').name("Stars").onChange(render);
    gui.add(menu, 'sun').name("Sun").onChange(render);
    gui.add(menu, 'nebulae').name("Nebulae").onChange(render);
    gui.add(menu, 'shortScale').name("Short scale").onChange(render);
    gui.add(menu, 'width').name("Width").onFinishChange(render);
    gui.add(menu, 'height').name("Height").onFinishChange(render);
    gui.add(menu, 'render').name("Render");
    document.body.appendChild(gui.domElement);
    gui.domElement.style.position = "fixed";
    gui.domElement.style.left = "16px";
    gui.domElement.style.top = "16px";

    var canvas = document.getElementById("render-canvas");

    var scene = new Scene(canvas);

    render();

    function setQueryString() {
        var params = {
            seed: menu.seed,
            width: menu.width,
            height: menu.height,
            pointStars: menu.pointStars,
            stars: menu.stars,
            sun: menu.sun,
            nebulae: menu.nebulae,
            shortScale: menu.shortScale
        }
        location.hash = qs.stringify(params);
    }

    function reflow() {
        var ratio = canvas.width / canvas.height;
        var hspace = window.innerWidth - 368;
        var vspace = window.innerHeight - 32;
        var sratio = hspace/vspace;
        var cwidth = -1;
        var cheight = -1;
        var cleft = -1;
        if (ratio >= 1 && sratio < ratio) {
            cwidth = hspace;
            cheight = cwidth/ratio;
            cleft = 352;
        } else {
            cheight = vspace;
            cwidth = cheight * ratio;
            cleft = 352 + (hspace - cwidth) / 2.0;
        }
        canvas.style.width = Math.round(cwidth) + "px";
        canvas.style.height = Math.round(cheight) + "px";
        canvas.style.left = cleft + "px";
        canvas.style.display = "block";
    }

    function render() {
        canvas.width = menu.width;
        canvas.height = menu.height;
        reflow();
        scene.render({
            seed: menu.seed,
            pointStars: menu.pointStars,
            stars: menu.stars,
            sun: menu.sun,
            nebulae: menu.nebulae,
            shortScale: menu.shortScale
        });
        setQueryString();
    }

    window.onresize = reflow;
}

function generateRandomSeed() {
    return (Math.random() * 1000000000000000000).toString(36);
}
