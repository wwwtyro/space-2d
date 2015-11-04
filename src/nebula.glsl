#version 100
precision highp float;

attribute vec3 aPosition;

void main() {
    gl_Position = vec4(aPosition, 1);
}


__split__


#version 100
precision highp float;

uniform float uFalloff;
uniform float uIntensity;
uniform float uScale;
uniform float uRenderScale;
uniform vec3 uColor;
uniform vec2 uOffset;

__noise3d__

float noise(vec2 p) {
    return cnoise(vec3(p, 0)) * 0.5 + 0.5;
}

float nebula(vec2 p) {
    const int steps = 5;
    float scale = pow(2.0, float(steps));
    vec2 displace;
    for (int i = 0; i < steps; i++) {
        displace = vec2(noise(p.xy * scale + displace), noise(p.yx * scale + displace));
        scale *= 0.5;
    }
    return noise(p * scale + displace);
}

void main() {
    vec2 p = gl_FragCoord.xy/uRenderScale + uOffset;
    float c = min(1.0, nebula(p * uScale) * uIntensity);
    c = pow(c, uFalloff);
    gl_FragColor = vec4(uColor, c);
}
