"use strict";

const rng = require('rng');

export function generateRandomSeed() {
    return (Math.random() * 1000000000000000000).toString(36);
}

export function hashcode(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        var char = str.charCodeAt(i)
        hash += (i + 1) * char;
    }
    return hash;
}

export function rand(seed, offset) {
  return new rng.MT(hashcode(seed) + offset);
}
