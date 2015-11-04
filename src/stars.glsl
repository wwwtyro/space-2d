#version 100
precision highp float;

attribute vec3 aPosition;

void main() {
    gl_Position = vec4(aPosition, 1);
}


__split__


#version 100
precision highp float;

uniform float uDensity;
uniform float uRenderScale;

float qnoise(vec2 p) {
    return fract(sin(dot(p.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

float exprand(vec2 p) {
    float u = qnoise(p);
    return log(1.0 - u)/(-2.0 * 3.14159);
}

float noise(vec2 p) {
    return qnoise(p) * 0.5 + 0.5;
}

void main() {
    vec2 p = gl_FragCoord.xy/uRenderScale;
    float c = 0.0;
    if (qnoise(p*2.0+11.0) < uDensity) {
        c = exprand(p);
    }
    gl_FragColor = vec4(1,1,1, c);

}
