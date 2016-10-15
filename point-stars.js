"use strict";

export function generateTexture(regl, size) {
  return regl.texture({
    format: 'luminance alpha',
    width: size,
    height: size,
    wrap: 'repeat',
    wrapS: 'repeat',
    wrapT: 'repeat',
    data: new Uint8Array(size * size * 2).map(function() {
      return Math.random() * 255;
    })
  });
}

export function createRenderer(regl) {
  return regl({
    vert: `
      precision highp float;
      attribute vec2 position;
      attribute vec2 uv;
      varying vec2 vUV;
      void main() {
        gl_Position = vec4(position, 0, 1);
        vUV = uv;
      }
    `,
    frag: `
      precision highp float;
      uniform sampler2D texture;
      uniform float size, density, brightness;
      varying vec2 vUV;
      void main() {
        vec2 p = texture2D(texture, gl_FragCoord.xy/vec2(size, size)).ba;
        float c = step(1.0 - density, p.x) * log(1.0 - p.y) * -brightness;
        gl_FragColor = vec4(c,c,c, 1);
      }
    `,
    attributes: {
      position: regl.buffer([-1, -1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1]),
      uv: regl.buffer([0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1])
    },
    uniforms: {
      texture: regl.prop('texture'),
      size: regl.prop('size'),
      density: regl.prop('density'),
      brightness: regl.prop('brightness')
    },
    framebuffer: regl.prop('destination'),
    depth: {enable: false},
    viewport: regl.prop('viewport'),
    count: 6
  });
}
