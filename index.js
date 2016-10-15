"use strict";

import React from 'react';
import ReactDOM from 'react-dom';
import GUI from './gui';
import Scene from './scene';
import * as random from './random';

let canvas = document.getElementById('render-canvas');
canvas.width = window.innerWidth - (300 + 16 + 16 + 16);;
canvas.height = window.innerHeight - (16 + 16);

let scene = new Scene(canvas);

let props = {
  renderPointStars: true,
  renderStars: true,
  renderSun: true,
  renderNebulae: true,
  shortScale: false,
  seed: random.generateRandomSeed()
};

reflow(canvas.width, canvas.height);
scene.render(props);

ReactDOM.render(
  <GUI
    seed={props.seed}
    onFinishChangeSeed={onFinishChangeSeed}
    maxTextureSize={scene.maxTextureSize}
    width={canvas.width}
    onFinishChangeWidth={onFinishChangeWidth}
    height={canvas.height}
    onFinishChangeHeight={onFinishChangeHeight}
    renderPointStars={props.renderPointStars}
    onChangeRenderPointStars={onChangeRenderPointStars}
    renderStars={props.renderStars}
    onChangeRenderStars={onChangeRenderStars}
    renderSun={props.renderSun}
    onChangeRenderSun={onChangeRenderSun}
    renderNebulae={props.renderNebulae}
    onChangeRenderNebulae={onChangeRenderNebulae}
    shortScale={props.shortScale}
    onChangeShortScale={onChangeShortScale}
  />,
  document.getElementById('gui')
);

function resize(width, height) {
  if (width === undefined) width = canvas.width;
  if (height === undefined) height = canvas.height;
  canvas.width = width;
  canvas.height = height;
  reflow(width, height);
  scene.render(props);
}

function reflow(width, height) {
  let wAvailable = window.innerWidth - (300 + 16 + 16 + 16);
  let hAvailable = window.innerHeight - (16 + 16);
  if (width/height > wAvailable/hAvailable) {
    canvas.style.left = 300 + 16 + 16 + 'px';
    canvas.style.width = wAvailable + 'px';
    let hComputed = (height/width) * wAvailable;
    canvas.style.height = hComputed + 'px';
  } else {
    canvas.style.height = hAvailable + 'px';
    let wComputed = (width/height) * hAvailable;
    let wCenter = 300 + 16 + 16 + wAvailable * 0.5;
    canvas.style.left = wCenter - (wComputed * 0.5) + 'px';
    canvas.style.width = wComputed + 'px';
  }
  canvas.style.top = 16 + 'px';
}

window.onresize = function() {
  reflow(canvas.width, canvas.height);
};

function onFinishChangeSeed(value) {
  props.seed = value;
  scene.render(props);
}

function onFinishChangeWidth(width) {
  if (width === canvas.width) return;
  resize(Math.round(width), undefined);
}

function onFinishChangeHeight(height) {
  if (height === canvas.height) return;
  resize(undefined, Math.round(height));
}

function onChangeRenderPointStars(value) {
  props.renderPointStars = value;
  scene.render(props);
}

function onChangeRenderStars(value) {
  props.renderStars = value;
  scene.render(props);
}

function onChangeRenderSun(value) {
  props.renderSun = value;
  scene.render(props);
}

function onChangeRenderNebulae(value) {
  props.renderNebulae = value;
  scene.render(props);
}

function onChangeShortScale(value) {
  props.shortScale = value;
  scene.render(props);
}
