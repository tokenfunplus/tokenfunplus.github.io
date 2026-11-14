(() => {
  'use strict';

  const coveVertex = `
    precision highp float;
    attribute vec2 a_uv;
    uniform float u_time;
    uniform float u_aspect;
    uniform vec2 u_pointer;
    varying vec3 v_normal;
    varying vec3 v_position;
    varying vec2 v_uv;

    vec3 surface(vec2 uv) {
      float u = uv.x * 6.2831853;
      float v = uv.y * 6.2831853;
      float t = u_time * 0.2;
      vec3 center = vec3(cos(u) * 1.5, sin(u) * 1.62, 0.32 * sin(2.0 * u + t));
      vec3 tangent = normalize(vec3(-1.5 * sin(u), 1.62 * cos(u), 0.64 * cos(2.0 * u + t)));
      vec3 radial = vec3(cos(u), sin(u), 0.0);
      radial = normalize(radial - tangent * dot(radial, tangent));
      vec3 binormal = normalize(cross(tangent, radial));
      float radius = 0.29 + 0.055 * sin(3.0 * u - t);
      return center + radius * (radial * cos(v) + binormal * sin(v));
    }
    vec3 rotate(vec3 p) {
      float x = 0.48 + u_pointer.y * 0.13;
      float y = 0.48 + sin(u_time * 0.1) * 0.18 + u_pointer.x * 0.2;
      float z = -0.45;
      p.yz = mat2(cos(x), -sin(x), sin(x), cos(x)) * p.yz;
      p.xz = mat2(cos(y), -sin(y), sin(y), cos(y)) * p.xz;
      p.xy = mat2(cos(z), -sin(z), sin(z), cos(z)) * p.xy;
      return p;
    }
    void main() {
      vec3 p = surface(a_uv);
      vec3 du = surface(a_uv + vec2(0.001, 0.0)) - p;
      vec3 dv = surface(a_uv + vec2(0.0, 0.001)) - p;
      v_normal = rotate(normalize(cross(du, dv)));
      v_position = rotate(p);
      v_uv = a_uv;
      vec3 view = v_position - vec3(0.0, 0.0, 5.7);
      gl_Position = vec4(view.x * 2.7 / u_aspect, view.y * 2.7,
        -1.01005 * view.z - 0.201005, -view.z);
    }
  `;

  const coveFragment = `
    precision highp float;
    uniform float u_time;
    varying vec3 v_normal;
    varying vec3 v_position;
    varying vec2 v_uv;
    void main() {
      vec3 n = normalize(v_normal);
      vec3 view = normalize(vec3(0.0, 0.0, 5.7) - v_position);
      vec3 reflection = reflect(-view, n);
      float fresnel = pow(1.0 - max(dot(n, view), 0.0), 2.7);
      float band = pow(0.5 + 0.5 * sin(reflection.y * 4.5 + reflection.x * 2.0), 14.0);
      float softbox = smoothstep(0.22, 0.42, reflection.y) * (1.0 - smoothstep(0.65, 0.94, reflection.y));
      float sheen = pow(max(dot(n, normalize(vec3(-0.6, 0.9, 1.0))), 0.0), 34.0);
      float rim = pow(max(dot(n, normalize(vec3(0.8, -0.3, 0.7))), 0.0), 14.0);
      float tint = 0.5 + 0.5 * sin(v_uv.x * 6.283 + reflection.z * 2.0 + u_time * 0.08);
      vec3 color = mix(vec3(0.035, 0.065, 0.105), vec3(0.11, 0.085, 0.18), tint);
      color *= 0.3 + max(dot(n, normalize(vec3(-0.3, 0.7, 1.0))), 0.0) * 0.7;
      color += band * vec3(0.45, 0.57, 0.68) * 0.8;
      color += softbox * vec3(0.36, 0.42, 0.5);
      color += sheen * vec3(0.72, 0.87, 1.0) * 0.8;
      color += rim * vec3(0.12, 0.08, 0.25);
      color += fresnel * vec3(0.12, 0.25, 0.36);
      color = pow(color, vec3(0.88));
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  const terrainVertex = `
    precision highp float;
    attribute vec2 a_uv;
    uniform float u_time;
    uniform float u_aspect;
    uniform vec2 u_pointer;
    varying float v_height;
    varying float v_side;
    varying float v_fade;
    void main() {
      float x = (a_uv.x - 0.5) * 8.0;
      float z = (a_uv.y - 0.5) * 8.0;
      float t = u_time * 0.16;
      float wave = sin(x * 1.9 + z * 0.8 + t) * cos(z * 1.4 - t) * 0.22;
      float hills = exp(-pow(x + 1.8 + 0.35 * sin(z + t), 2.0) * 0.6) * 1.1;
      hills += exp(-pow(x - 1.7 + 0.4 * cos(z - t), 2.0) * 0.8) * 0.85;
      float y = hills + wave - 0.45;
      float angle = -0.12 + u_pointer.x * 0.12;
      vec3 p = vec3(x, y, z);
      p.xz = mat2(cos(angle), -sin(angle), sin(angle), cos(angle)) * p.xz;
      vec3 eye = vec3(0.0, 3.5 + u_pointer.y * 0.25, 6.0);
      vec3 q = p - eye;
      vec3 view = vec3(q.x, q.y * 0.864 - q.z * 0.504, q.y * 0.504 + q.z * 0.864);
      gl_Position = vec4(view.x * 1.9 / u_aspect, view.y * 1.9,
        -1.01005 * view.z - 0.201005, -view.z);
      gl_PointSize = 1.5;
      v_height = hills;
      v_side = a_uv.x;
      v_fade = (1.0 - smoothstep(2.7, 4.0, abs(x))) * (1.0 - smoothstep(2.7, 4.0, abs(z)));
    }
  `;

  const terrainFragment = `
    precision mediump float;
    uniform float u_pass;
    uniform float u_theme;
    varying float v_height;
    varying float v_side;
    varying float v_fade;
    void main() {
      vec3 left = vec3(0.28, 0.84, 0.66);
      vec3 right = vec3(0.97, 0.72, 0.3);
      if (u_theme > 0.5 && u_theme < 1.5) {
        left = vec3(0.3, 0.66, 1.0); right = vec3(0.67, 0.83, 1.0);
      } else if (u_theme > 1.5) {
        left = vec3(1.0, 0.55, 0.18); right = vec3(1.0, 0.82, 0.4);
      }
      vec3 color = mix(left, right, smoothstep(0.35, 0.65, v_side));
      color *= 0.65 + v_height * 0.55;
      float alpha = v_fade * (u_pass < 0.5 ? 0.045 : 0.52);
      gl_FragColor = vec4(color, alpha);
    }
  `;

  function compile(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const message = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error(message || 'WebGL shader compilation failed.');
    }
    return shader;
  }

  function createResources(gl, kind) {
    const program = gl.createProgram();
    const vertex = compile(gl, gl.VERTEX_SHADER, kind === 'cove' ? coveVertex : terrainVertex);
    const fragment = compile(gl, gl.FRAGMENT_SHADER, kind === 'cove' ? coveFragment : terrainFragment);
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) || 'WebGL program linking failed.');

    const columns = kind === 'cove' ? 144 : 88;
    const rows = kind === 'cove' ? 32 : 60;
    const vertices = [];
    const triangles = [];
    const lines = [];
    for (let y = 0; y <= rows; y += 1) {
      for (let x = 0; x <= columns; x += 1) {
        vertices.push(x / columns, y / rows);
        if (x < columns && y < rows) {
          const a = y * (columns + 1) + x;
          const b = a + columns + 1;
          triangles.push(a, a + 1, b, a + 1, b + 1, b);
          lines.push(a, a + 1, a, b);
        }
      }
    }
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    const triangleBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(triangles), gl.STATIC_DRAW);
    const lineBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, lineBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(lines), gl.STATIC_DRAW);
    return {
      program, vertexBuffer, triangleBuffer, lineBuffer,
      triangleCount: triangles.length, lineCount: lines.length,
      attribute: gl.getAttribLocation(program, 'a_uv'),
      uniforms: Object.fromEntries(['time', 'aspect', 'pointer', 'pass', 'theme'].map((name) => [name, gl.getUniformLocation(program, `u_${name}`)])),
    };
  }

  document.querySelectorAll('[data-scene]').forEach((element) => {
    const canvas = element.querySelector('canvas');
    const toggle = element.querySelector('[data-motion-toggle]');
    const kind = element.dataset.scene;
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    let gl;
    let resources;
    let frame = 0;
    let visible = false;
    let lost = false;
    let paused = reducedMotion.matches || navigator.connection?.saveData === true;
    let lastFrame = 0;
    let time = 4.5;
    let theme = 0;
    const pointer = [0, 0];
    const target = [0, 0];

    function updateButton() {
      if (!toggle || element.dataset.renderer !== 'webgl') return;
      toggle.hidden = false;
      toggle.textContent = paused ? 'Play motion ↗' : 'Pause motion Ⅱ';
      toggle.setAttribute('aria-pressed', String(paused));
    }

    function stop() {
      cancelAnimationFrame(frame);
      frame = 0;
      lastFrame = 0;
    }

    function resize() {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const pixelRatio = Math.min(devicePixelRatio || 1, innerWidth < 700 ? 1 : 1.4, 1600 / Math.max(width, 1));
      const nextWidth = Math.max(1, Math.round(width * pixelRatio));
      const nextHeight = Math.max(1, Math.round(height * pixelRatio));
      if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
        canvas.width = nextWidth;
        canvas.height = nextHeight;
      }
    }

    function draw() {
      if (!gl || lost || !resources) return;
      resize();
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.useProgram(resources.program);
      gl.bindBuffer(gl.ARRAY_BUFFER, resources.vertexBuffer);
      gl.enableVertexAttribArray(resources.attribute);
      gl.vertexAttribPointer(resources.attribute, 2, gl.FLOAT, false, 0, 0);
      gl.uniform1f(resources.uniforms.time, time);
      gl.uniform1f(resources.uniforms.aspect, canvas.width / canvas.height);
      gl.uniform2f(resources.uniforms.pointer, pointer[0], pointer[1]);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, resources.triangleBuffer);
      if (kind === 'cove') {
        gl.enable(gl.DEPTH_TEST);
        gl.disable(gl.BLEND);
        gl.drawElements(gl.TRIANGLES, resources.triangleCount, gl.UNSIGNED_SHORT, 0);
      } else {
        gl.disable(gl.DEPTH_TEST);
        gl.enable(gl.BLEND);
        gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        gl.uniform1f(resources.uniforms.theme, theme);
        gl.uniform1f(resources.uniforms.pass, 0);
        gl.drawElements(gl.TRIANGLES, resources.triangleCount, gl.UNSIGNED_SHORT, 0);
        gl.uniform1f(resources.uniforms.pass, 1);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, resources.lineBuffer);
        gl.drawElements(gl.LINES, resources.lineCount, gl.UNSIGNED_SHORT, 0);
      }
      element.classList.add('webgl-ready');
    }

    function animate(timestamp) {
      frame = 0;
      if (paused || !visible || document.hidden || lost) return;
      const interval = innerWidth < 700 ? 1000 / 30 : 1000 / 45;
      if (!lastFrame || timestamp - lastFrame >= interval) {
        const delta = lastFrame ? Math.min((timestamp - lastFrame) / 1000, 0.06) : 0;
        time += delta;
        lastFrame = timestamp;
        pointer[0] += (target[0] - pointer[0]) * 0.07;
        pointer[1] += (target[1] - pointer[1]) * 0.07;
        draw();
      }
      frame = requestAnimationFrame(animate);
    }

    function start() {
      if (!frame && !paused && visible && !document.hidden && !lost) frame = requestAnimationFrame(animate);
    }

    function initialize() {
      try {
        gl = canvas.getContext('webgl', { alpha: true, antialias: true, powerPreference: 'low-power', premultipliedAlpha: false });
        if (!gl) throw new Error('WebGL is unavailable.');
        resources = createResources(gl, kind);
        lost = false;
        element.dataset.renderer = 'webgl';
        updateButton();
        draw();
        start();
      } catch {
        element.dataset.renderer = 'fallback';
        element.classList.remove('webgl-ready');
        if (toggle) toggle.hidden = true;
      }
    }

    canvas.addEventListener('webglcontextlost', (event) => {
      event.preventDefault();
      lost = true;
      stop();
      element.classList.remove('webgl-ready');
      element.dataset.renderer = 'fallback';
      if (toggle) toggle.hidden = true;
    });
    canvas.addEventListener('webglcontextrestored', initialize);
    element.addEventListener('pointermove', (event) => {
      if (event.pointerType === 'touch' || paused) return;
      const rect = element.getBoundingClientRect();
      target[0] = (event.clientX - rect.left) / rect.width * 2 - 1;
      target[1] = (event.clientY - rect.top) / rect.height * 2 - 1;
    }, { passive: true });
    element.addEventListener('pointerleave', () => { target[0] = 0; target[1] = 0; });
    toggle?.addEventListener('click', () => {
      paused = !paused;
      updateButton();
      if (paused) stop(); else start();
    });
    reducedMotion.addEventListener('change', (event) => {
      paused = event.matches;
      updateButton();
      if (paused) stop(); else start();
    });
    document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else start(); });
    document.addEventListener('product-theme-change', (event) => {
      theme = event.detail;
      if (paused || !visible) draw();
    });
    new ResizeObserver(() => { if (paused) draw(); }).observe(element);
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start(); else stop();
    }, { threshold: 0.01 }).observe(element);
    initialize();
  });
})();
