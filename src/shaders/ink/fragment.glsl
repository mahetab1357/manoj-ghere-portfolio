// Injected: noise + fbm prepended in JS

uniform float uTime;
uniform float uReveal;    // 0 → 1  (scroll driven)
uniform vec2  uResolution;

varying vec2 vUv;

vec2 domainWarp(vec2 p) {
  return p + 0.5 * vec2(
    cnoise(vec3(p.x * 1.2, p.y * 0.8 + uTime * 0.05, 0.0)),
    cnoise(vec3(p.x * 0.9 + 3.7, p.y * 1.1 + uTime * 0.04, 0.0))
  );
}

void main() {
  vec2 uv     = vUv;
  vec2 warped = domainWarp(uv * 2.5);
  float n     = cnoise(vec3(warped, uTime * 0.02));
  n           = n * 0.5 + 0.5;

  float inkMask = smoothstep(uReveal - 0.25, uReveal + 0.25, n);

  // Ink colour — very dark, slightly warm black
  vec3 inkColor = vec3(0.020, 0.018, 0.012);
  float alpha   = (1.0 - inkMask) * 0.92;

  gl_FragColor = vec4(inkColor, alpha);
}
