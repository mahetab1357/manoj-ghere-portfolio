uniform vec3  uDepthColor;
uniform vec3  uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;
uniform vec3  uFogColor;
uniform float uFogNear;
uniform float uFogFar;
uniform float uTime;
uniform vec3  uLightDir;

varying float vElevation;
varying vec3  vWorldPosition;
varying vec3  vNormal;

void main() {
  // Base water color
  float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
  mixStrength = clamp(mixStrength, 0.0, 1.0);
  vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);

  // Fresnel effect
  vec3 viewDir = normalize(cameraPosition - vWorldPosition);
  float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 3.0);
  color = mix(color, vec3(0.6, 0.8, 0.9), fresnel * 0.35);

  // Specular highlight
  vec3 lightDir = normalize(uLightDir);
  vec3 halfVec  = normalize(lightDir + viewDir);
  float spec = pow(max(dot(vNormal, halfVec), 0.0), 64.0);
  color += vec3(1.0, 0.95, 0.8) * spec * 0.6;

  // Foam at peaks
  if (vElevation > 0.06) {
    float foam = smoothstep(0.06, 0.12, vElevation);
    color = mix(color, vec3(0.85, 0.9, 0.95), foam * 0.5);
  }

  // Fog
  float depth    = gl_FragCoord.z / gl_FragCoord.w;
  float fogFactor = clamp((uFogFar - depth) / (uFogFar - uFogNear), 0.0, 1.0);
  color = mix(uFogColor, color, fogFactor);

  gl_FragColor = vec4(color, 0.92);
}
