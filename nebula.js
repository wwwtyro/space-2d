"use strict";

const vec2 = require('gl-vec2');

export function generateNoiseTexture(regl, rng, size) {
  let l = size * size * 2;
  let array = new Uint8Array(l);
  for (let i = 0; i < l; i++) {
    let r = vec2.random([]);
    array[i * 2 + 0] = Math.round(0.5 * (1.0 + r[0]) * 255);
    array[i * 2 + 1] = Math.round(0.5 * (1.0 + r[1]) * 255);
  }
  return regl.texture({
    format: 'luminance alpha',
    width: size,
    height: size,
    wrapS: 'repeat',
    wrapT: 'repeat',
    data: array
  });
}

export function createRenderer(regl) {
  let pgWidth = 256;
  let pgTexture = generateNoiseTexture(regl, null, pgWidth);

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
      uniform sampler2D source, tNoise;
      uniform vec3 color;
      uniform vec2 offset;
      uniform float scale, density, falloff, tNoiseSize;
      varying vec2 vUV;

      float smootherstep(float a, float b, float r) {
          r = clamp(r, 0.0, 1.0);
          r = r * r * r * (r * (6.0 * r - 15.0) + 10.0);
          return mix(a, b, r);
      }

      float perlin_2d(vec2 p) {
          vec2 p0 = floor(p);
          vec2 p1 = p0 + vec2(1, 0);
          vec2 p2 = p0 + vec2(1, 1);
          vec2 p3 = p0 + vec2(0, 1);
          vec2 d0 = texture2D(tNoise, p0/tNoiseSize).ba;
          vec2 d1 = texture2D(tNoise, p1/tNoiseSize).ba;
          vec2 d2 = texture2D(tNoise, p2/tNoiseSize).ba;
          vec2 d3 = texture2D(tNoise, p3/tNoiseSize).ba;
          d0 = 2.0 * d0 - 1.0;
          d1 = 2.0 * d1 - 1.0;
          d2 = 2.0 * d2 - 1.0;
          d3 = 2.0 * d3 - 1.0;
          vec2 p0p = p - p0;
          vec2 p1p = p - p1;
          vec2 p2p = p - p2;
          vec2 p3p = p - p3;
          float dp0 = dot(d0, p0p);
          float dp1 = dot(d1, p1p);
          float dp2 = dot(d2, p2p);
          float dp3 = dot(d3, p3p);
          float fx = p.x - p0.x;
          float fy = p.y - p0.y;
          float m01 = smootherstep(dp0, dp1, fx);
          float m32 = smootherstep(dp3, dp2, fx);
          float m01m32 = smootherstep(m01, m32, fy);
          return m01m32;
      }

      float normalnoise(vec2 p) {
          return perlin_2d(p) * 0.5 + 0.5;
      }

      float noise(vec2 p) {
          p += offset;
          const int steps = 5;
          float scale = pow(2.0, float(steps));
          float displace = 0.0;
          for (int i = 0; i < steps; i++) {
              displace = normalnoise(p * scale + displace);
              scale *= 0.5;
          }
          return normalnoise(p + displace);
      }

      void main() {
        vec4 p = texture2D(source, vUV);
        float n = noise(gl_FragCoord.xy * scale * 1.0);
        n = pow(n + density, falloff);
        gl_FragColor = vec4(mix(p.rgb, color, n), 1);
      }
    `,
    attributes: {
      position: regl.buffer([-1, -1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1]),
      uv: regl.buffer([0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1])
    },
    uniforms: {
      source: regl.prop('source'),
      offset: regl.prop('offset'),
      scale: regl.prop('scale'),
      falloff: regl.prop('falloff'),
      color: regl.prop('color'),
      density: regl.prop('density'),
      tNoise: pgTexture,
      tNoiseSize: pgWidth
    },
    framebuffer: regl.prop('destination'),
    viewport: regl.prop('viewport'),
    count: 6
  });
}
