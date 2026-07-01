/* =================================================================
   Animated shader background — vanilla WebGL2 port of the 21st.dev
   "animated-shader-hero" canvas. All component content (headline,
   subtitle, buttons, trust badge) and mouse interaction are stripped:
   this renders ONLY the drifting warm-nebula background behind any
   element that contains <canvas id="areaShader">.

   The fragment shader is used verbatim — made by Matthias Hurrle
   (@atzedent). It reads just two uniforms: resolution and time.
   If WebGL2 is unavailable or the shader fails, the canvas is removed
   and the element's CSS gradient shows instead (graceful fallback).
   ================================================================= */
(function () {
  'use strict';

  var canvas = document.getElementById('areaShader');
  if (!canvas) return;
  var host = canvas.parentElement; // the .subhero band the canvas fills

  var gl = canvas.getContext('webgl2', { antialias: false, alpha: false, powerPreference: 'low-power' });
  if (!gl) { canvas.remove(); return; }

  var VERT = '#version 300 es\nprecision highp float;\nin vec4 position;\nvoid main(){gl_Position=position;}';

  var FRAG = `#version 300 es
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform float time;
#define FC gl_FragCoord.xy
#define T time
#define R resolution
#define MN min(R.x,R.y)
float rnd(vec2 p) {
  p=fract(p*vec2(12.9898,78.233));
  p+=dot(p,p+34.56);
  return fract(p.x*p.y);
}
float noise(in vec2 p) {
  vec2 i=floor(p), f=fract(p), u=f*f*(3.-2.*f);
  float
  a=rnd(i),
  b=rnd(i+vec2(1,0)),
  c=rnd(i+vec2(0,1)),
  d=rnd(i+1.);
  return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);
}
float fbm(vec2 p) {
  float t=.0, a=1.; mat2 m=mat2(1.,-.5,.2,1.2);
  for (int i=0; i<5; i++) {
    t+=a*noise(p);
    p*=2.*m;
    a*=.5;
  }
  return t;
}
float clouds(vec2 p) {
	float d=1., t=.0;
	for (float i=.0; i<3.; i++) {
		float a=d*fbm(i*10.+p.x*.2+.2*(1.+i)*p.y+d+i*i+p);
		t=mix(t,d,a);
		d=a;
		p*=2./(i+1.);
	}
	return t;
}
void main(void) {
	vec2 uv=(FC-.5*R)/MN,st=uv*vec2(2,1);
	vec3 col=vec3(0);
	float bg=clouds(vec2(st.x+T*.5,-st.y));
	uv*=1.-.3*(sin(T*.2)*.5+.5);
	for (float i=1.; i<12.; i++) {
		uv+=.1*cos(i*vec2(.1+.01*i, .8)+i*i+T*.5+.1*uv.x);
		vec2 p=uv;
		float d=length(p);
		col+=.00125/d*(cos(sin(i)*vec3(1,2,3))+1.);
		float b=noise(i+p+bg*1.731);
		col+=.002*b/length(max(p,vec2(b*p.x*.02,p.y)));
		col=mix(col,vec3(bg*.25,bg*.137,bg*.05),d);
	}
	O=vec4(col,1);
}`;

  function compile(type, src) {
    var sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      console.warn('shader-bg: compile error —', gl.getShaderInfoLog(sh));
      return null;
    }
    return sh;
  }

  var vs = compile(gl.VERTEX_SHADER, VERT);
  var fs = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) { canvas.remove(); return; }

  var prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.warn('shader-bg: link error —', gl.getProgramInfoLog(prog));
    canvas.remove();
    return;
  }
  gl.useProgram(prog);

  var buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]), gl.STATIC_DRAW);
  var loc = gl.getAttribLocation(prog, 'position');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  var uRes = gl.getUniformLocation(prog, 'resolution');
  var uTime = gl.getUniformLocation(prog, 'time');

  // The shader was authored for a ~16:9 full-screen hero. Rendering it at the
  // band's real extreme-wide aspect (≈6.8:1) pushes the nebula math past its
  // range and the far edges flatten to grey. So we render in a balanced 16:9
  // frame and let CSS stretch the bitmap to fill the short, wide band — the
  // nebula fills edge-to-edge and the corners stay space-dark, not grey.
  var ASPECT = 16 / 9;
  var dpr = Math.min(1.5, window.devicePixelRatio || 1); // background → keep it cheap
  function resize() {
    var logicalW = Math.min(1440, host.clientWidth || 1440);
    var rw = Math.max(1, Math.round(logicalW * dpr));
    var rh = Math.max(1, Math.round(rw / ASPECT));
    if (canvas.width !== rw || canvas.height !== rh) {
      canvas.width = rw; canvas.height = rh;
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  var raf = null, visible = true;
  function frame(now) {
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, now * 1e-3);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    raf = requestAnimationFrame(frame);
  }
  function start() { if (raf === null && visible) raf = requestAnimationFrame(frame); }
  function stop() { if (raf !== null) { cancelAnimationFrame(raf); raf = null; } }

  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else start(); });

  // only burn GPU while the band is on screen
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      es.forEach(function (en) { visible = en.isIntersecting; if (visible) start(); else stop(); });
    }, { threshold: 0 }).observe(host);
  }

  resize();
  start();
})();
