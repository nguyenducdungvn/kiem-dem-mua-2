/* =========================================================
   Scene3D kit · dựng bối cảnh 3D bằng code (Three.js r128), dùng chung các mùa.
   Tách từ js/scene3d.js của Mùa 1. Phần riêng của từng tập nằm ở tap-N/scene.js:

     Scene3D.register({
       views:   { tenKhongGian: { label: 'Tên hiện trên màn hình', build: (K) => ({ group, fog, amb, cam, spots, update, leave }) } },
       figures: { maNhanVat: { name, shirt, pants, hair, longHair, helmet, cap, vest, phone, laptop, nonla, lifejacket, stoop, lantern } },
       ambience: 'river' | 'building',
       torch: (S) => số nấc đèn pin 0–6   (không khai báo thì đèn luôn sáng đủ)
     });

   K là bộ công cụ: K.T (THREE), K.M, K.box, K.at, K.canvasTex, K.textTex, K.rnd, K.figure, K.dust,
   K.windowFrame, K.makeClock, K.room, K.wallTex, K.tileTex, K.doorTex, K.FONT, K.MONO,
   và trạng thái chạy: K.fx (Set hiệu ứng), K.fxStart, K.t, K.S (chỉ số), K.figures, K.shake(v),
   K.scene, K.ambient, K.camera, K.reduceMotion.
   API cho engine: Scene3D.init(), Scene3D.show(staging, isEnding), Scene3D.setStats(S), Scene3D.viewName(ten)
   ========================================================= */
(function () {
  'use strict';
  const T = window.THREE;
  const REG = { views: {}, figures: {}, ambience: 'building', torch: null };
  const API = {
    ok: false, init() {}, show() {}, setStats() {},
    register(o) { Object.assign(REG.views, o.views || {}); Object.assign(REG.figures, o.figures || {}); if (o.ambience) REG.ambience = o.ambience; if (o.torch) REG.torch = o.torch; },
    viewName(n) { return (REG.views[n] && REG.views[n].label) || ''; }
  };
  window.Scene3D = API;
  if (!T) { document.documentElement.classList.add('no3d'); return; }

  const FONT = "'Be Vietnam Pro', 'Noto Sans', Arial, sans-serif";
  const MONO = "'Roboto Mono', monospace";
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let renderer, scene, camera, clock, torch, torchTarget, ambient, redLight;
  let views = {}, cur = null, curName = '', fx = new Set(), dead = false;
  let torchLv = 6, sanity = 70, shake = 0, fxStart = 0, frameK = 0.17, tabMat = null, tabGroup = null, tabKey = '';
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  const figures = {};
  let labelLayer, fader;

  /* ---------------- tiện ích ---------------- */
  const M = (color, o = {}) => new T.MeshStandardMaterial(Object.assign({ color, roughness: 0.85, metalness: 0.05 }, o));
  const box = (w, h, d, mat) => new T.Mesh(new T.BoxGeometry(w, h, d), mat);
  const at = (o, x, y, z) => { o.position.set(x, y, z); return o; };
  function canvasTex(w, h, draw, repeat) {
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const g = c.getContext('2d'); draw(g, w, h);
    const tx = new T.CanvasTexture(c);
    tx.encoding = T.sRGBEncoding;
    tx.anisotropy = 4;
    if (repeat) { tx.wrapS = tx.wrapT = T.RepeatWrapping; tx.repeat.set(repeat[0], repeat[1]); }
    return tx;
  }
  function rnd(seed) { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; }

  /* ---------------- vật liệu đặc trưng nhà tập thể ---------------- */
  // Tường vôi vàng loang ẩm
  const wallTex = () => canvasTex(512, 512, (g, w, h) => {
    g.fillStyle = '#c4a463'; g.fillRect(0, 0, w, h);
    const r = rnd(7);
    for (let i = 0; i < 900; i++) {
      g.fillStyle = `rgba(${90 + r() * 60},${70 + r() * 50},${30 + r() * 30},${r() * 0.08})`;
      g.beginPath(); g.arc(r() * w, r() * h, r() * 40, 0, 7); g.fill();
    }
    const grd = g.createLinearGradient(0, h * 0.7, 0, h);
    grd.addColorStop(0, 'rgba(60,50,30,0)'); grd.addColorStop(1, 'rgba(50,45,30,0.55)');
    g.fillStyle = grd; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 8; i++) { g.fillStyle = 'rgba(235,225,200,0.5)'; g.fillRect(r() * w, r() * h, 20 + r() * 50, 8 + r() * 30); }
  }, [1, 1]);
  // Gạch hoa xi măng
  const tileTex = () => canvasTex(256, 256, (g, w) => {
    const s = w / 2;
    for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) {
      const x = i * s, y = j * s;
      g.fillStyle = '#d9cdb4'; g.fillRect(x, y, s, s);
      g.fillStyle = '#8c2f26';
      g.beginPath(); g.moveTo(x + s / 2, y + 8); g.lineTo(x + s - 8, y + s / 2); g.lineTo(x + s / 2, y + s - 8); g.lineTo(x + 8, y + s / 2); g.fill();
      g.fillStyle = '#d9cdb4'; g.beginPath(); g.arc(x + s / 2, y + s / 2, s * 0.22, 0, 7); g.fill();
      g.fillStyle = '#3c5a4a'; g.beginPath(); g.arc(x + s / 2, y + s / 2, s * 0.1, 0, 7); g.fill();
      ['#3c5a4a'].forEach((c) => { g.fillStyle = c; [[x, y], [x + s, y], [x, y + s], [x + s, y + s]].forEach(([a, b]) => { g.beginPath(); g.arc(a, b, s * 0.16, 0, 7); g.fill(); }); });
      g.strokeStyle = 'rgba(40,30,20,0.5)'; g.lineWidth = 2; g.strokeRect(x, y, s, s);
    }
    g.fillStyle = 'rgba(30,25,15,0.18)'; g.fillRect(0, 0, w, w);
  }, [3, 3]);
  // Cửa gỗ sơn xanh + số căn + mã phấn
  function doorTex(num, chalk) {
    return canvasTex(256, 512, (g, w, h) => {
      g.fillStyle = '#41685a'; g.fillRect(0, 0, w, h);
      g.strokeStyle = '#2c4a3f'; g.lineWidth = 10;
      g.strokeRect(24, 30, w - 48, h * 0.38); g.strokeRect(24, h * 0.48, w - 48, h * 0.45);
      const r = rnd(num.length * 13);
      for (let i = 0; i < 40; i++) { g.fillStyle = `rgba(200,190,160,${r() * 0.25})`; g.fillRect(r() * w, r() * h, 4 + r() * 30, 2 + r() * 6); }
      g.fillStyle = '#d8d0b8'; g.fillRect(w / 2 - 46, 60, 92, 46);
      g.fillStyle = '#1c1c1c'; g.font = `700 34px ${FONT}`; g.textAlign = 'center'; g.fillText(num, w / 2, 96);
      if (chalk) { g.fillStyle = 'rgba(245,245,240,0.9)'; g.font = `600 30px ${FONT}`; g.fillText(chalk, w / 2, h * 0.62); }
      g.beginPath(); g.fillStyle = '#b89a4a'; g.arc(w - 40, h * 0.55, 10, 0, 7); g.fill();
    });
  }
  function textTex(lines, o = {}) {
    const w = o.w || 1024, h = o.h || 512;
    return canvasTex(w, h, (g) => {
      g.fillStyle = o.bg || '#0d1a2a'; g.fillRect(0, 0, w, h);
      if (o.border) { g.strokeStyle = o.border; g.lineWidth = 12; g.strokeRect(10, 10, w - 20, h - 20); }
      g.textAlign = 'center'; g.textBaseline = 'middle';
      lines.forEach((ln, i) => {
        g.fillStyle = ln.c || '#fff'; g.font = `${ln.wt || 700} ${ln.s || 60}px ${ln.mono ? MONO : FONT}`;
        g.fillText(ln.t, w / 2, (h / (lines.length + 1)) * (i + 1));
      });
    });
  }

  /* ---------------- nhân vật (phong cách búp bê gỗ) ---------------- */
  function figure(o) {
    const g = new T.Group();
    const skin = M(o.skin || 0xd2a37c), shirt = M(o.shirt), pants = M(o.pants || 0x2a2a2e), hair = M(o.hair || 0x1a1410);
    const legL = at(box(0.14, 0.82, 0.16, pants), -0.09, 0.41, 0);
    const legR = at(box(0.14, 0.82, 0.16, pants), 0.09, 0.41, 0);
    const torso = at(box(0.42, 0.62, 0.24, shirt), 0, 1.13, 0);
    const armL = at(box(0.1, 0.6, 0.12, shirt), -0.27, 1.1, 0);
    const armR = at(box(0.1, 0.6, 0.12, shirt), 0.27, 1.1, 0);
    const head = at(new T.Mesh(new T.SphereGeometry(0.14, 20, 16), skin), 0, 1.6, 0);
    const hairM = at(new T.Mesh(new T.SphereGeometry(0.15, 20, 12, 0, Math.PI * 2, 0, Math.PI * 0.55), hair), 0, 1.62, -0.01);
    g.add(legL, legR, torso, armL, armR, head);
    if (!o.helmet) g.add(hairM);
    const eyeM = M(0x111111, { roughness: 0.3 });
    head.add(at(new T.Mesh(new T.SphereGeometry(0.018, 8, 6), eyeM), -0.05, 0.02, 0.125), at(new T.Mesh(new T.SphereGeometry(0.018, 8, 6), eyeM), 0.05, 0.02, 0.125));
    head.add(at(box(0.05, 0.008, 0.01, M(0x6a3a2a)), 0, -0.06, 0.13));
    if (o.longHair) g.add(at(box(0.26, 0.34, 0.08, hair), 0, 1.45, -0.11));
    if (o.helmet) {
      g.add(at(new T.Mesh(new T.SphereGeometry(0.165, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), M(0xf2f2ee, { roughness: 0.4 })), 0, 1.64, 0));
      g.add(at(new T.Mesh(new T.CylinderGeometry(0.19, 0.19, 0.015, 24), M(0xf2f2ee)), 0, 1.64, 0.03));
    }
    if (o.cap) {
      g.add(at(new T.Mesh(new T.CylinderGeometry(0.15, 0.16, 0.1, 20), M(0x4b5a32)), 0, 1.74, 0));
      g.add(at(box(0.2, 0.02, 0.12, M(0x3d4a28)), 0, 1.7, 0.14));
    }
    if (o.vest) g.add(at(box(0.44, 0.4, 0.26, M(0xe5f03a, { emissive: 0x3a3c00 })), 0, 1.18, 0));
    if (o.nonla) {
      g.add(at(new T.Mesh(new T.ConeGeometry(0.3, 0.2, 24, 1, true), M(0xd9c48e, { side: T.DoubleSide, roughness: 0.9 })), 0, 1.8, 0));
    }
    if (o.lifejacket) g.add(at(box(0.46, 0.44, 0.3, M(0xff6a1a, { emissive: 0x401400 })), 0, 1.16, 0));
    if (o.stoop) { torso.rotation.x = 0.18; head.position.z = 0.06; }
    if (o.lantern) {
      const lan = new T.Group();
      lan.add(at(box(0.1, 0.14, 0.1, M(0x222, { metalness: 0.5 })), 0, 0, 0));
      lan.add(at(new T.Mesh(new T.SphereGeometry(0.04, 10, 8), M(0x000, { emissive: 0xffb860, emissiveIntensity: 2 })), 0, 0, 0));
      lan.add(at(new T.PointLight(0xffb060, 0.9, 4, 1.6), 0, 0.05, 0.1));
      lan.position.set(-0.28, 0.78, 0.08); g.add(lan);
    }
    let prop = null;
    if (o.phone) {
      prop = at(box(0.07, 0.13, 0.01, M(0x111111, { emissive: 0x88b8ff, emissiveIntensity: 1.6 })), 0.22, 1.32, 0.22);
      const pl = at(new T.PointLight(0x9fc3ff, 0.6, 2.2), 0.22, 1.35, 0.35);
      g.add(prop, pl);
      armR.rotation.x = -1.1; armR.position.set(0.25, 1.22, 0.14);
    }
    if (o.laptop) {
      prop = at(box(0.34, 0.02, 0.24, M(0x333438)), 0, 1.0, 0.25);
      const scr = at(box(0.34, 0.22, 0.01, M(0x111, { emissive: 0xbfd8ff, emissiveIntensity: 1.2 })), 0, 1.11, 0.14);
      scr.rotation.x = -0.25;
      g.add(prop, scr, at(new T.PointLight(0xbfd8ff, 0.5, 2), 0, 1.2, 0.4));
      armL.rotation.x = armR.rotation.x = -0.9; armL.position.z = armR.position.z = 0.15;
    }
    g.userData = { torso, head, armL, armR, phase: Math.random() * 6, name: o.name, headY: 1.95 };
    g.traverse((m) => { if (m.isMesh) { m.castShadow = true; } });
    return g;
  }

  function makeClock() {
    const g = new T.Group();
    const wood = M(0x5a3a22, { roughness: 0.6 });
    g.add(box(0.34, 0.7, 0.12, wood));
    const face = at(new T.Mesh(new T.CircleGeometry(0.12, 32), M(0xefe6cf, { emissive: 0x332a10 })), 0, 0.17, 0.065);
    g.add(face);
    const glass = at(box(0.24, 0.32, 0.01, M(0x223, { transparent: true, opacity: 0.35 })), 0, -0.15, 0.065);
    g.add(glass);
    const pend = new T.Group(); pend.position.set(0, 0.02, 0.07);
    pend.add(at(box(0.01, 0.26, 0.01, M(0xb8963a, { metalness: 0.8, roughness: 0.3 })), 0, -0.13, 0));
    pend.add(at(new T.Mesh(new T.CylinderGeometry(0.04, 0.04, 0.01, 20), M(0xd8b04a, { metalness: 0.9, roughness: 0.25 })), 0, -0.27, 0).rotateX(Math.PI / 2));
    g.add(pend);
    g.userData.pend = pend;
    return g;
  }

  /* ---------------- dựng phòng ---------------- */
  function room(o) {
    const g = new T.Group();
    const wallM = M(0xffffff, { map: wallTex() });
    const floorM = M(0xffffff, { map: tileTex(), roughness: 0.7 });
    floorM.map.repeat.set(o.w / 0.8, o.d / 0.8);
    const floor = new T.Mesh(new T.PlaneGeometry(o.w, o.d), floorM);
    floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; g.add(floor);
    const ceil = new T.Mesh(new T.PlaneGeometry(o.w, o.d), M(0x8d877a));
    ceil.rotation.x = Math.PI / 2; ceil.position.y = o.h; g.add(ceil);
    const walls = {};
    const mk = (name, w, x, z, ry) => {
      const m = new T.Mesh(new T.PlaneGeometry(w, o.h), wallM);
      m.position.set(x, o.h / 2, z); m.rotation.y = ry; m.receiveShadow = true; walls[name] = m; g.add(m);
    };
    if (!o.skip || !o.skip.includes('N')) mk('N', o.w, 0, -o.d / 2, 0);
    if (!o.skip || !o.skip.includes('S')) mk('S', o.w, 0, o.d / 2, Math.PI);
    if (!o.skip || !o.skip.includes('W')) mk('W', o.d, -o.w / 2, 0, Math.PI / 2);
    if (!o.skip || !o.skip.includes('E')) mk('E', o.d, o.w / 2, 0, -Math.PI / 2);
    // chân tường sơn xanh
    const skirtM = M(0x5d7a68);
    [[o.w, 0, -o.d / 2 + 0.01, 0], [o.d, -o.w / 2 + 0.01, 0, Math.PI / 2]].forEach(([w, x, z, ry]) => {
      const s = new T.Mesh(new T.PlaneGeometry(w, 0.9), skirtM); s.position.set(x, 0.45, z); s.rotation.y = ry; g.add(s);
    });
    // bóng đèn tròn tắt
    const bulb = at(new T.Mesh(new T.SphereGeometry(0.06, 12, 10), M(0xddddcc, { emissive: 0x111100 })), 0, o.h - 0.3, 0);
    g.add(bulb, at(box(0.01, 0.3, 0.01, M(0x222222)), 0, o.h - 0.15, 0));
    g.userData.walls = walls;
    return g;
  }

  function windowFrame(w, h) {
    const g = new T.Group();
    const frameM = M(0x3d4c44);
    const glass = new T.Mesh(new T.PlaneGeometry(w, h), M(0x1b2d44, { emissive: 0x16263c, emissiveIntensity: 1 }));
    g.add(glass);
    for (let i = -2; i <= 2; i++) g.add(at(box(0.02, h, 0.03, M(0x2a2a2a, { metalness: 0.6 })), (w / 5) * i, 0, 0.03));
    g.add(at(box(w + 0.1, 0.06, 0.06, frameM), 0, h / 2, 0), at(box(w + 0.1, 0.06, 0.06, frameM), 0, -h / 2, 0));
    return g;
  }

  function dust(n, spread, y) {
    const geo = new T.BufferGeometry();
    const p = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { p[i * 3] = (Math.random() - 0.5) * spread; p[i * 3 + 1] = Math.random() * y; p[i * 3 + 2] = (Math.random() - 0.5) * spread; }
    geo.setAttribute('position', new T.BufferAttribute(p, 3));
    const pts = new T.Points(geo, new T.PointsMaterial({ color: 0xfff1d0, size: 0.018, transparent: true, opacity: 0.55, depthWrite: false }));
    pts.userData.spin = true;
    return pts;
  }

  /* ---------------- bộ công cụ đưa cho từng tập ---------------- */
  const K = {
    T, M, box, at, canvasTex, textTex, rnd, figure, dust, windowFrame, makeClock, room, wallTex, tileTex, doorTex,
    FONT, MONO, reduceMotion, figures, S: {}, t: 0,
    get fx() { return fx; }, get fxStart() { return fxStart; }, get scene() { return scene; },
    get ambient() { return ambient; }, get camera() { return camera; },
    shake(v) { shake = Math.max(shake, v); }
  };

  /* ---------------- vòng đời ---------------- */
  function init() {
    const canvas = document.getElementById('world');
    labelLayer = document.getElementById('labels');
    fader = document.getElementById('fader');
    try {
      renderer = new T.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    } catch (e) { document.documentElement.classList.add('no3d'); return; }
    if (!renderer.getContext()) { document.documentElement.classList.add('no3d'); return; }
    // điện thoại: pixel ratio thấp để chạy mượt
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth < 700 ? 1.25 : 1.5));
    renderer.outputEncoding = T.sRGBEncoding;
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = window.innerWidth > 700;
    scene = new T.Scene();
    scene.background = new T.Color(0x05070a);
    camera = new T.PerspectiveCamera(58, 1, 0.03, 240);
    scene.add(camera);
    ambient = new T.HemisphereLight(0x8899bb, 0x1a1410, 0.3); scene.add(ambient);
    torch = new T.SpotLight(0xffe4b8, 3.2, 20, 0.42, 0.5, 1.3);
    torch.position.set(0.18, -0.12, 0.05);
    torchTarget = new T.Object3D(); torchTarget.position.set(0, 0, -5);
    camera.add(torch, torchTarget); torch.target = torchTarget;
    redLight = new T.PointLight(0xff1a0a, 0, 14, 1.5); camera.add(redLight); redLight.position.set(0, 1, -1);
    // tablet trong tay người chơi (gắn vào camera, chữ đổi theo cảnh)
    tabMat = M(0x000, { emissive: 0xffffff, emissiveIntensity: 0.9 });
    const tabScreen = new T.Mesh(new T.PlaneGeometry(0.2, 0.125), tabMat);
    const tabFrame = at(box(0.215, 0.14, 0.008, M(0x111)), 0, 0, -0.006);
    tabGroup = new T.Group(); tabGroup.add(tabFrame, tabScreen, at(new T.PointLight(0x9fc3ff, 0.6, 2), 0, 0.05, 0.2));
    tabGroup.position.set(0.26, -0.07, -0.62); tabGroup.rotation.set(-0.2, -0.25, 0);
    tabGroup.visible = false; camera.add(tabGroup);
    // nhân vật của tập
    Object.keys(REG.figures).forEach((k) => {
      const f = figure(REG.figures[k]); f.visible = false; scene.add(f); figures[k] = f;
      const el = document.createElement('div'); el.className = 'label3d'; el.textContent = f.userData.name; el.hidden = true;
      labelLayer.appendChild(el); f.userData.label = el;
    });
    if (window.SFX && SFX.setAmbience) SFX.setAmbience(REG.ambience);
    clock = new T.Clock();
    window.addEventListener('resize', resize); resize();
    window.addEventListener('pointermove', (e) => { pointer.tx = (e.clientX / innerWidth) * 2 - 1; pointer.ty = -(e.clientY / innerHeight) * 2 + 1; });
    API.ok = true;
    document.documentElement.classList.add('has3d');
    loop();
  }

  function resize() {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // màn hình dọc: mở rộng góc nhìn để thấy đủ cảnh
    camera.fov = w < h ? 72 : 58;
    camera.updateProjectionMatrix();
  }

  function setView(name) {
    if (!REG.views[name]) return;
    if (cur && cur.leave) cur.leave();
    if (cur) scene.remove(cur.group);
    if (!views[name]) views[name] = REG.views[name].build(K);
    cur = views[name]; curName = name;
    scene.add(cur.group);
    scene.fog = new T.FogExp2(cur.fog[0], cur.fog[1]);
    scene.background = new T.Color(cur.fog[0]);
    ambient.intensity = cur.amb;
    camera.position.set(...cur.cam.pos);
    camera.lookAt(...cur.cam.look);
    if (cur.enter) cur.enter();
  }

  function show(st, isEnding) {
    if (!API.ok) return;
    st = st || {};
    const name = st.view || curName || Object.keys(REG.views)[0];
    const change = name !== curName;
    const apply = () => {
      if (change) setView(name);
      fx = new Set(st.fx || []);
      dead = !!isEnding;
      tabGroup.visible = fx.has('tablet') && !dead;
      if (st.tablet && JSON.stringify(st.tablet) !== tabKey) {
        tabKey = JSON.stringify(st.tablet);
        if (tabMat.emissiveMap) tabMat.emissiveMap.dispose();
        const tx = textTex(st.tablet, { bg: '#08121e', w: 1024, h: 640 });
        tabMat.map = tx; tabMat.emissiveMap = tx; tabMat.needsUpdate = true;
      }
      fxStart = clock.getElapsedTime();
      if (fx.has('shake')) shake = 0.05;
      const cast = isEnding ? [] : (st.cast || []);
      Object.keys(figures).forEach((k) => {
        const f = figures[k]; const on = cast.includes(k) && cur.spots && cur.spots[k];
        f.visible = !!on;
        if (on) { const [x, y, z, ry] = cur.spots[k]; f.position.set(x, y, z); f.rotation.y = ry; }
      });
      if (cur && cur.onShow) cur.onShow(st);
    };
    if (change && fader && !reduceMotion) {
      fader.classList.add('on');
      setTimeout(() => { apply(); fader.classList.remove('on'); }, 380);
    } else apply();
  }

  function setStats(S) {
    K.S = S; sanity = typeof S.TT === 'number' ? S.TT : 70;
    torchLv = REG.torch ? REG.torch(S) : (typeof S.PIN === 'number' ? S.PIN : 6);
  }

  const v3 = new T.Vector3();
  function loop() {
    requestAnimationFrame(loop);
    if (document.hidden) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.getElapsedTime(); K.t = t;
    pointer.x += (pointer.tx - pointer.x) * Math.min(1, dt * 4);
    pointer.y += (pointer.ty - pointer.y) * Math.min(1, dt * 4);
    if (cur) {
      // camera trôi nhẹ + nhìn theo con trỏ
      let c = cur.cam; const o = reduceMotion ? 0 : c.orbit;
      if (fx.has('menu') && cur.menuCam) c = cur.menuCam(t, innerWidth < innerHeight);
      // màn hình dọc: lùi camera dọc theo hướng nhìn để không mất nhân vật ở hai bên
      const pk = innerWidth < innerHeight ? (cur.portraitPull || 1.5) : 1;
      const px = c.look[0] + (c.pos[0] - c.look[0]) * pk, py = c.look[1] + (c.pos[1] - c.look[1]) * pk, pz = c.look[2] + (c.pos[2] - c.look[2]) * pk;
      camera.position.set(px + Math.sin(t * 0.15) * o * 6 + pointer.x * 0.08, py + Math.sin(t * 0.4) * 0.015, pz + Math.cos(t * 0.15) * o * 2);
      camera.lookAt(c.look[0] + pointer.x * 0.9, c.look[1] + pointer.y * 0.5, c.look[2]);
      // đẩy khung hình lên trên để chủ thể không bị khung lời kể che
      const W = innerWidth, H = innerHeight;
      const want = (document.body.classList.contains('view-only') || fx.has('menu')) ? 0 : (W < 760 ? 0.2 : 0.17);
      frameK += (want - frameK) * Math.min(1, dt * 3);
      camera.setViewOffset(W, H, 0, frameK * H, W, H);
      if (sanity < 40 && !reduceMotion) camera.rotation.z += Math.sin(t * 0.7) * 0.02;
      if (cur.sway && !reduceMotion) { camera.rotation.z += Math.sin(t * 0.9) * cur.sway; camera.position.y += Math.sin(t * 1.3) * cur.sway * 2; }
      if (shake > 0.001 && !reduceMotion) { camera.position.x += (Math.random() - 0.5) * shake; camera.position.y += (Math.random() - 0.5) * shake; shake *= 0.92; }
      if (cur.update) cur.update(t, dt);
    }
    // đèn pin: hướng theo con trỏ, yếu dần theo số nấc
    torchTarget.position.set(pointer.x * 2.2, pointer.y * 1.4, -5);
    const flick = torchLv <= 2 ? (Math.random() < 0.06 ? 0.2 : 1) : 1;
    torch.intensity = (0.7 + torchLv * 0.28) * flick * (dead ? 0.25 : 1) * (cur && cur.torchK !== undefined ? cur.torchK : 1);
    torch.angle = 0.3 + torchLv * 0.025;
    const alarm = fx.has('alarm') || fx.has('redlight');
    redLight.intensity = dead ? 1.6 + Math.sin(t * 2) * 0.6 : (alarm ? (Math.sin(t * 4) > 0.3 ? 0.5 : 0) : 0);
    // nhân vật thở nhẹ
    Object.values(figures).forEach((f) => {
      if (!f.visible) { f.userData.label.hidden = true; return; }
      const u = f.userData;
      u.torso.position.y = 1.13 + Math.sin(t * 1.6 + u.phase) * 0.006;
      u.head.position.y = 1.6 + Math.sin(t * 1.6 + u.phase) * 0.008;
      u.head.rotation.y = Math.sin(t * 0.5 + u.phase) * 0.25;
      v3.set(0, u.headY, 0); f.localToWorld(v3); v3.project(camera);
      const lbl = u.label;
      if (v3.z < 1 && Math.abs(v3.x) < 1.05 && Math.abs(v3.y) < 1.05) {
        lbl.hidden = false;
        lbl.style.transform = `translate(-50%,-100%) translate(${(v3.x * 0.5 + 0.5) * innerWidth}px,${(-v3.y * 0.5 + 0.5) * innerHeight}px)`;
      } else lbl.hidden = true;
    });
    // bụi bay
    if (cur) cur.group.children.forEach((c) => { if (c.userData.spin) c.rotation.y += dt * 0.02; });
    renderer.render(scene, camera);
  }

  API.init = init;
  API.show = show;
  API.setStats = setStats;
  API.kit = K;
})();
