"use strict";

export function generateTexture(width, height, density, brightness, prng) {
  // Determine the number of stars we're going to render.
  let count = Math.round(width * height * density);
  // Create a byte array for our texture.
  let data = new Uint8Array(width * height * 3);
  // For each star...
  for (let i = 0; i < count; i++) {
    // Select a random position.
    let r = Math.floor(prng() * width * height);
    // Select an intensity from an exponential distribution.
    let c = Math.round(255 * Math.log(1 - prng()) * -brightness);
    // Set a greyscale color with the intensity we chose at the pixel we selected.
    data[r * 3 + 0] = c;
    data[r * 3 + 1] = c;
    data[r * 3 + 2] = c;
  }
  // Return the texture byte array.
  return data;
}
