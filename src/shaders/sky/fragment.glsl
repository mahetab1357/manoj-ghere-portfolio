uniform float uTime;     // drives animation
uniform float uPhase;    // 0=night, 1=dawn, 2=golden

varying vec3 vWorldPosition;

void main() {
  // Normalise Y into [-1,1] and then [0,1]
  float t = clamp(vWorldPosition.y * 0.04 + 0.5, 0.0, 1.0);

  // Phase lerp: night → orange dawn → gold sunrise
  float phase = clamp(uPhase, 0.0, 1.0);

  vec3 zenithNight  = vec3(0.016, 0.020, 0.063);   // #040816
  vec3 horizNight   = vec3(0.020, 0.016, 0.040);
  vec3 zenithDawn   = vec3(0.048, 0.016, 0.090);   // dark purple zenith
  vec3 horizDawn    = vec3(0.769, 0.376, 0.100);   // #c46019 horizon
  vec3 zenithGold   = vec3(0.090, 0.040, 0.020);
  vec3 horizGold    = vec3(0.988, 0.757, 0.224);   // #fcc139

  vec3 zenith = mix(mix(zenithNight, zenithDawn, phase), zenithGold, max(0.0, phase - 1.0));
  vec3 horiz  = mix(mix(horizNight,  horizDawn,  phase), horizGold,  max(0.0, phase - 1.0));
  vec3 sky    = mix(horiz, zenith, t);

  // Sun disc
  vec3 sunDir  = normalize(vec3(0.2, 0.08, -0.97));
  vec3 fragDir = normalize(vWorldPosition);
  float sunDot = dot(fragDir, sunDir);
  float sunDisc   = smoothstep(0.998, 1.0, sunDot);
  float sunHalo   = smoothstep(0.92,  0.998, sunDot) * 0.4 * phase;
  sky = mix(sky, vec3(1.0, 0.85, 0.55), sunHalo);
  sky = mix(sky, vec3(1.0, 0.98, 0.88), sunDisc);

  gl_FragColor = vec4(sky, 1.0);
}
