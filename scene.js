"use strict";

const REGL = require('regl');

import * as pointStars from './point-stars';
import * as star from './star';
import * as nebula from './nebula';
import * as copy from './copy';
import * as random from './random';

export default class Scene {

  constructor(canvas) {
    this.canvas = canvas;
    let regl = this.regl = REGL({ canvas: this.canvas });
    this.pointStarTexture = regl.texture();
    this.ping = regl.framebuffer({color: regl.texture(), depth: false, stencil: false, depthStencil: false});
    this.pong = regl.framebuffer({color: regl.texture(), depth: false, stencil: false, depthStencil: false});
    this.starRenderer = star.createRenderer(regl);
    this.nebulaRenderer = nebula.createRenderer(regl);
    this.copyRenderer = copy.createRenderer(regl);
    this.lastWidth = null;
    this.lastHeight = null;
    this.maxTextureSize = regl.limits.maxTextureSize;
  }

  render(props) {
    let ping = this.ping;
    let pong = this.pong;
    let regl = this.regl;

    let width = this.canvas.width;
    let height = this.canvas.height;
    let viewport = { x: 0, y: 0, width: width, height: height };
    let scale = props.shortScale ? Math.min(width, height) : Math.max(width, height);
    if (width !== this.lastWidth || height !== this.lastHeight) {
      ping.resize(width, height);
      pong.resize(width, height);
      this.lastWidth = width;
      this.lastHeight = height;
    }

    regl({ framebuffer: ping })( () => {
      regl.clear({color: [0,0,0,1]});
    });
    regl({ framebuffer: pong })( () => {
      regl.clear({color: [0,0,0,1]});
    });

    let rand = random.rand(props.seed, 0);
    if (props.renderPointStars) {
      let data = pointStars.generateTexture(width, height, 0.05, 0.125, rand.random.bind(rand));
      this.pointStarTexture({
        format: 'rgb',
        width: width,
        height: height,
        wrapS: 'clamp',
        wrapT: 'clamp',
        data: data
      });
      this.copyRenderer({
        source: this.pointStarTexture,
        destination: ping,
        viewport: viewport
      });
    }

    rand = random.rand(props.seed, 1000);
    let nebulaCount = 0;
    if (props.renderNebulae) nebulaCount = Math.round(rand.random() * 4 + 1);
    let nebulaOut = pingPong(ping, ping, pong, nebulaCount, (source, destination) => {
      this.nebulaRenderer({
        source: source,
        destination: destination,
        offset: [rand.random() * 100, rand.random() * 100],
        scale: (rand.random() * 2 + 1) / scale,
        color: [rand.random(), rand.random(), rand.random()],
        density: rand.random() * 0.2,
        falloff: rand.random() * 2.0 + 3.0,
        width: width,
        height: height,
        viewport: viewport
      });
    });

    rand = random.rand(props.seed, 2000);
    let starCount = 0;
    if (props.renderStars) starCount = Math.round(rand.random() * 8 + 1);
    let starOut = pingPong(nebulaOut, ping, pong, starCount, (source, destination) => {
      this.starRenderer({
        center: [rand.random(), rand.random()],
        coreRadius: rand.random() * 0.0,
        coreColor: [1,1,1],
        haloColor: [rand.random(), rand.random(), rand.random()],
        haloFalloff: rand.random() * 1024 + 32,
        resolution: [width, height],
        scale: scale,
        source: source,
        destination: destination,
        viewport: viewport
      });
    });

    rand = random.rand(props.seed, 3000);
    let sunOut = false;
    if (props.renderSun) {
      sunOut = starOut === pong ? ping : pong;
      this.starRenderer({
        center: [rand.random(), rand.random()],
        coreRadius: rand.random() * 0.025 + 0.025,
        coreColor: [1,1,1],
        haloColor: [rand.random(), rand.random(), rand.random()],
        haloFalloff: rand.random() * 32 + 32,
        resolution: [width, height],
        scale: scale,
        source: starOut,
        destination: sunOut,
        viewport: viewport
      })
    }

    this.copyRenderer({
      source: sunOut ? sunOut : starOut,
      destination: undefined,
      viewport: viewport
    });

  }

}

function pingPong(initial, alpha, beta, count, func) {
  // Bail if the render count is zero.
  if (count === 0) return initial;
  // Make sure the initial FBO is not the same as the first
  // output FBO.
  if (initial === alpha) {
    alpha = beta;
    beta = initial;
  }
  // Render to alpha using initial as the source.
  func(initial, alpha);
  // Keep track of how many times we've rendered. Currently one.
  let i = 1;
  // If there's only one render, we're already done.
  if (i === count) return alpha;
  // Keep going until we reach our render count.
  while (true) {
    // Render to beta using alpha as the source.
    func(alpha, beta);
    // If we've hit our count, we're done.
    i++;
    if (i === count) return beta;
    // Render to alpha using beta as the source.
    func(beta, alpha);
    // If we've hit our count, we're done.
    i++;
    if (i === count) return alpha;
  }
}
