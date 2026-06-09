// Injected: noise + fbm functions prepended in JS

uniform float uTime;
uniform float uDisplacement;

varying float vElevation;
varying vec3  vWorldPosition;
varying vec3  vNormal;

void main() {
  vec4 modelPos = modelMatrix * vec4(position, 1.0);

  float elev = fbm(vec3(modelPos.xz * 0.4, 0.0)) * uDisplacement;
  modelPos.y += elev;

  // Normal approximation
  float d   = 0.05;
  float hpx = fbm(vec3((modelPos.x + d) * 0.4, modelPos.z * 0.4, 0.0)) * uDisplacement;
  float hpz = fbm(vec3(modelPos.x * 0.4, (modelPos.z + d) * 0.4, 0.0)) * uDisplacement;
  vNormal = normalize(vec3(-(hpx - elev) / d, 1.0, -(hpz - elev) / d));

  vElevation     = elev;
  vWorldPosition = modelPos.xyz;

  gl_Position = projectionMatrix * viewMatrix * modelPos;
}
