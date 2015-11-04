#version 100
precision highp float;

attribute vec3 aPosition;

void main() {
    gl_Position = vec4(aPosition, 1);
}


__split__


#version 100
precision highp float;

uniform float uRadius;
uniform float uFalloff;
uniform float uRenderScale;
uniform vec2 uPosition;
uniform vec2 uRes;
uniform vec3 uColor;

void main() {
    float d = length(gl_FragCoord.xy - uPosition * uRes) / uRenderScale;
    float i = exp(-(d - uRadius) * uFalloff);
    float c = min(1.0, i);
    gl_FragColor = vec4(uColor + i * 0.5, c);
}
