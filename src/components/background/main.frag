
varying vec2 vUvs;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_zoom;

float inverseLerp(float v, float minValue, float maxValue) {
  return (v - minValue) / (maxValue - minValue);
}

float remap(float v, float inMin, float inMax, float outMin, float outMax) {
  float t = inverseLerp(v, inMin, inMax);
  return mix(outMin, outMax, t);
}

// The MIT License
// Copyright © 2013 Inigo Quilez
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
// https://www.youtube.com/c/InigoQuilez
// https://iquilezles.org/
//
// https://www.shadertoy.com/view/Xsl3Dl
vec3 hash( vec3 p ) // replace this by something better
{
	p = vec3( dot(p,vec3(127.1,311.7, 74.7)),
            dot(p,vec3(269.5,183.3,246.1)),
            dot(p,vec3(113.5,271.9,124.6)));

	return -1.0 + 2.0*fract(sin(p)*43758.5453123);
}

float noise( in vec3 p )
{
  vec3 i = floor( p );
  vec3 f = fract( p );
	
	vec3 u = f*f*(3.0-2.0*f);

  return mix( mix( mix( dot( hash( i + vec3(0.0,0.0,0.0) ), f - vec3(0.0,0.0,0.0) ), 
                        dot( hash( i + vec3(1.0,0.0,0.0) ), f - vec3(1.0,0.0,0.0) ), u.x),
                   mix( dot( hash( i + vec3(0.0,1.0,0.0) ), f - vec3(0.0,1.0,0.0) ), 
                        dot( hash( i + vec3(1.0,1.0,0.0) ), f - vec3(1.0,1.0,0.0) ), u.x), u.y),
              mix( mix( dot( hash( i + vec3(0.0,0.0,1.0) ), f - vec3(0.0,0.0,1.0) ), 
                        dot( hash( i + vec3(1.0,0.0,1.0) ), f - vec3(1.0,0.0,1.0) ), u.x),
                   mix( dot( hash( i + vec3(0.0,1.0,1.0) ), f - vec3(0.0,1.0,1.0) ), 
                        dot( hash( i + vec3(1.0,1.0,1.0) ), f - vec3(1.0,1.0,1.0) ), u.x), u.y), u.z );
}

float fbm(vec3 p, int octaves, float persistence, float lacunarity) {
  float amplitude = 1.0;
  float frequency = 1.0;
  float total = 0.0;
  float normalization = 0.0;

  for (int i = 0; i < octaves; ++i) {
    float noiseValue = noise(p * frequency);
    total += noiseValue * amplitude;
    normalization += amplitude;
    amplitude *= persistence;
    frequency *= lacunarity;
  }

  total = smoothstep(-1.0, 1.0, total);

  return total;
}

vec3 generate_sky(vec2 pixelCoords) {
  vec3 color1 = vec3(1.0, 1.0, 1.0);
  vec3 color2 = vec3(1.0, 1.0, 1.0);
  return mix(
    color1,
    color2,
    smoothstep(0.5, 1., pixelCoords.y - 1.)
  );
}

vec3 draw_montains(
  vec3 backgroundColor,
  vec3 mountainColor,
  vec2 pixelCoords,
  float depth
) {
  float y = fbm(
    vec3(
        pixelCoords.x * 256. * hash(mountainColor)
      ) / 256.,
      2,
      .5,
      2.
  );

  vec3 fogColor = vec3(1.0, 1.0, 1.0);
  float fogFactor = smoothstep(0.0, 8000.0, depth);
  float heigthFactor = smoothstep(256., -300., pixelCoords.y);
  heigthFactor *= heigthFactor;
  fogFactor = mix(
    heigthFactor,
    fogFactor,
    fogFactor
  );

  mountainColor = mix(mountainColor, fogColor, fogFactor);

  float blur = smoothstep(0.0, 6300., depth) * 0.2;

  float sdfMountain = pixelCoords.y - y;

  vec3 color = mix(
    mountainColor,
    backgroundColor,
    smoothstep(0.0, blur, sdfMountain)
  );

  return color;
}

void main() {
  vec2 pixelCoords = gl_FragCoord.xy / u_resolution.xy;
  pixelCoords = pixelCoords * u_zoom - (u_zoom - 1.) / 2.;

  vec3 color = generate_sky(pixelCoords);

  vec2 timeOffset = vec2(
    u_time * .05, 0.
  );
  vec2 mountainCords = ((pixelCoords * 2. - 1.) - vec2(0.0, 2.1)) * 2. + timeOffset;
  color = draw_montains(color, vec3(0.89,0.992,1.), mountainCords, 6300.);

  mountainCords = ((pixelCoords * 2. - 1.) - vec2(0.0, 1.5)) * 1.5 + timeOffset;
  color = draw_montains(color, vec3(0.82,0.969,1.), mountainCords, 5000.);

  mountainCords = ((pixelCoords * 2. - 1.) - vec2(0.0, .7)) + timeOffset;
  color = draw_montains(color, vec3(0.753,0.969,1.), mountainCords, 2500.);

  mountainCords = ((pixelCoords * 2. - .1) - vec2(0.0, .0)) * .5 + timeOffset;
  color = draw_montains(color, vec3(0.58,0.969,1.), mountainCords, 1000.);

  mountainCords = ((pixelCoords * 2.) - vec2(0.0, -1.)) *.5 + timeOffset;
  color = draw_montains(color, vec3(0.2863, 0.9098, 1.0), mountainCords, .0);

  gl_FragColor = vec4(color, 1.0);
}




