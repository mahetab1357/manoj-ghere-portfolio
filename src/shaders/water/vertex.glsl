// Injected: noise functions (prepended in JS before this shader)

uniform float uTime;
uniform float uBigWavesElevation;
uniform vec2  uBigWavesFrequency;
uniform float uBigWavesSpeed;
uniform float uSmallWavesElevation;
uniform float uSmallWavesFrequency;
uniform float uSmallWavesSpeed;
uniform float uSmallIterations;

varying float vElevation;
varying vec3  vWorldPosition;
varying vec3  vNormal;

void main() {
  vec4 modelPos = modelMatrix * vec4(position, 1.0);

  // Big waves
  float elev = sin(modelPos.x * uBigWavesFrequency.x + uTime * uBigWavesSpeed)
             * sin(modelPos.z * uBigWavesFrequency.y + uTime * uBigWavesSpeed)
             * uBigWavesElevation;

  // Small turbulent waves
  for (float i = 1.0; i <= 4.0; i++) {
    if (i > uSmallIterations) break;
    elev -= abs(cnoise(vec3(
      modelPos.xz * uSmallWavesFrequency * i,
      uTime * uSmallWavesSpeed
    ))) * uSmallWavesElevation / i;
  }

  modelPos.y += elev;

  // Approximate normal from finite differences
  float delta = 0.02;
  float hx = sin((modelPos.x + delta) * uBigWavesFrequency.x + uTime * uBigWavesSpeed)
           * sin(modelPos.z               * uBigWavesFrequency.y + uTime * uBigWavesSpeed)
           * uBigWavesElevation;
  float hz = sin(modelPos.x               * uBigWavesFrequency.x + uTime * uBigWavesSpeed)
           * sin((modelPos.z + delta) * uBigWavesFrequency.y + uTime * uBigWavesSpeed)
           * uBigWavesElevation;
  vNormal = normalize(vec3(-(hx - elev) / delta, 1.0, -(hz - elev) / delta));

  vElevation    = elev;
  vWorldPosition = modelPos.xyz;

  gl_Position = projectionMatrix * viewMatrix * modelPos;
}
