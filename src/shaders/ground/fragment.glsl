// Injected: noise + fbm prepended in JS

uniform vec3  uFogColor;
uniform float uFogNear;
uniform float uFogFar;

varying float vElevation;
varying vec3  vWorldPosition;
varying vec3  vNormal;

void main() {
  // Height-based texture zones
  vec3 mudColor   = vec3(0.165, 0.122, 0.071);  // #2a1f12 wet moss
  vec3 earthColor = vec3(0.290, 0.227, 0.157);  // #4a3a28 dry earth
  vec3 stoneColor = vec3(0.420, 0.353, 0.290);  // #6b5a4a stone

  float h = clamp(vElevation / 3.5, 0.0, 1.0);
  vec3 baseColor = mix(mudColor, earthColor, smoothstep(0.0, 0.4, h));
  baseColor       = mix(baseColor, stoneColor, smoothstep(0.4, 0.75, h));

  // Moss patches using noise
  float mossNoise = cnoise(vWorldPosition * 0.8 + vec3(0.0, 0.0, 10.0));
  float moss = smoothstep(0.1, 0.4, mossNoise);
  vec3 mossColor = vec3(0.18, 0.28, 0.13);
  baseColor = mix(baseColor, mossColor, moss * 0.45);

  // Diffuse lighting
  vec3 lightDir  = normalize(vec3(0.4, 0.8, 0.3));
  float diffuse  = max(dot(vNormal, lightDir), 0.0);
  vec3 color     = baseColor * (0.4 + diffuse * 0.6);

  // Fog
  float depth     = gl_FragCoord.z / gl_FragCoord.w;
  float fogFactor = clamp((uFogFar - depth) / (uFogFar - uFogNear), 0.0, 1.0);
  color = mix(uFogColor, color, fogFactor);

  gl_FragColor = vec4(color, 1.0);
}
