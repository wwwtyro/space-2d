"use strict";

var fs = require("fs");

var glm = require("gl-matrix");
var rng = require("rng");

var webgl = require("./webgl");

module.exports = function(canvas) {

    var gl,
        programStars,
        renderableStars,
        programNebula,
        renderableNebula,
        programSun,
        renderableSun;

    gl = canvas.getContext("webgl");
    gl.clearColor(0,0,0,1);
    gl.enable(gl.BLEND);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ZERO, gl.ONE);

    programStars = loadProgram(gl, fs.readFileSync(__dirname + "/stars.glsl", "utf8"));
    programNebula = loadProgram(gl, fs.readFileSync(__dirname + "/nebula.glsl", "utf8"));
    programSun = loadProgram(gl, fs.readFileSync(__dirname + "/sun.glsl", "utf8"));

    var position = [
        -1, -1, 0,
         1, -1, 0,
         1,  1, 0,
        -1, -1, 0,
         1,  1, 0,
        -1,  1, 0
    ];
    var attribs = webgl.buildAttribs(gl, {
        aPosition: 3
    });
    attribs.aPosition.buffer.set(new Float32Array(position));
    var count = position.length / 9;

    renderableStars = new webgl.Renderable(gl, programStars, attribs, count);
    renderableNebula = new webgl.Renderable(gl, programNebula, attribs, count);
    renderableSun = new webgl.Renderable(gl, programSun, attribs, count);

    this.render = function(opts) {
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT);
        var uRes = [canvas.width, canvas.height];
        var uRenderScale = Math.max(canvas.width, canvas.height);
        var rand = new rng.MT(parseInt(opts.seed, 36) + 0);
        if (opts.pointStars) {
            programStars.setUniform("uRenderScale", "1f", uRenderScale);
            programStars.setUniform("uDensity", "1f", rand.random() * 0.05);
            renderableStars.render();
        }
        var rand = new rng.MT(parseInt(opts.seed, 36) + 1000);
        while(opts.stars) {
            var uColor = [1,1,1];
            var uRadius = 0;
            var uPosition = [rand.random(), rand.random()];
            var uFalloff = rand.random() * 512 + 256;
            programSun.setUniform("uRes", "2fv", uRes);
            programSun.setUniform("uRenderScale", "1f", uRenderScale);
            programSun.setUniform("uPosition", "2fv", uPosition);
            programSun.setUniform("uRadius", "1f", uRadius);
            programSun.setUniform("uFalloff", "1f", uFalloff);
            programSun.setUniform("uColor", "3fv", uColor);
            renderableSun.render();
            if (rand.random() >= 0.8) {
                break;
            }
        }
        var rand = new rng.MT(parseInt(opts.seed, 36) + 2000);
        while(opts.nebulae) {
            var uColor = [rand.random(), rand.random(), rand.random()];
            var uOffset = [rand.random() * 2000 - 1000, rand.random() * 2000 - 1000];
            var uFalloff = rand.random() * 3.0 + 3.0;
            var uIntensity = rand.random() * 0.2 + 1.0;
            var uScale = rand.random() * 4;
            programNebula.setUniform("uRenderScale", "1f", uRenderScale);
            programNebula.setUniform("uColor", "3fv", uColor);
            programNebula.setUniform("uOffset", "2fv", uOffset);
            programNebula.setUniform("uFalloff", "1f", uFalloff);
            programNebula.setUniform("uIntensity", "1f", uIntensity);
            programNebula.setUniform("uScale", "1f", uScale);
            renderableNebula.render();
            if (rand.random() >= 0.75) {
                break
            }
        }
        var rand = new rng.MT(parseInt(opts.seed, 36) + 3000);
        if(opts.sun) {
            var uColor = [rand.random(), rand.random(), rand.random()];
            var uRadius = rand.random() * 0.025 + 0.025;
            var uPosition = [rand.random(), rand.random()];
            var uFalloff = rand.random() * 32 + 8;
            programSun.setUniform("uRes", "2fv", uRes)
            programSun.setUniform("uRenderScale", "1f", uRenderScale);
            programSun.setUniform("uPosition", "2fv", uPosition);
            programSun.setUniform("uRadius", "1f", uRadius);
            programSun.setUniform("uFalloff", "1f", uFalloff);
            programSun.setUniform("uColor", "3fv", uColor);
            renderableSun.render();
        }
    }

}

function loadProgram(gl, src) {
    var noise3D = fs.readFileSync(__dirname + "/classicnoise3D.glsl", "utf8");
    src = src.replace("__noise3d__", noise3D);
    src = src.split("__split__");
    return new webgl.Program(gl, src[0], src[1]);
}
