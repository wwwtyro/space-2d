"use strict";

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
      uniform sampler2D source;
      varying vec2 vUV;
      void main() {
        gl_FragColor = texture2D(source, vUV);
      }
    `,
    attributes: {
      position: regl.buffer([-1, -1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1]),
      uv: regl.buffer([0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1])
    },
    uniforms: {
      source: regl.prop('source'),
    },
    framebuffer: regl.prop('destination'),
    viewport: regl.prop('viewport'),
    count: 6
  });
}
