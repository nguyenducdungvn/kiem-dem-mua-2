/* =========================================================
   Tập 1 · Bãi Bồi · không gian 3D (dựng bằng code qua Scene3D kit)
   Không gian: ben (bến đò, bãi đất, ba cây gạo, sông) · song (trên đò giữa sông)
               truong (lớp học điểm trường) · tram (chòi trạm, bàn biên bản)
   Mực nước trên sông lấy từ chỉ số MN của người chơi.
   ========================================================= */
(function () {
  'use strict';
  if (!window.Scene3D || !window.THREE) return;
  const K0 = Scene3D.kit;
  if (!K0) return;
  const T = THREE;

  /* ---------- vật liệu, đồ vật dùng chung ---------- */
  function waterTex(K) {
    return K.canvasTex(256, 256, (g, w, h) => {
      g.fillStyle = '#0a1a22'; g.fillRect(0, 0, w, h);
      const r = K.rnd(5);
      for (let i = 0; i < 160; i++) { g.strokeStyle = `rgba(120,170,190,${0.04 + r() * 0.08})`; g.lineWidth = 1 + r() * 2; const x = r() * w, y = r() * h; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 20 + r() * 50, y + (r() - 0.5) * 4); g.stroke(); }
    }, [14, 14]);
  }
  function mudTex(K) {
    return K.canvasTex(256, 256, (g, w, h) => {
      g.fillStyle = '#4a3a26'; g.fillRect(0, 0, w, h);
      const r = K.rnd(9);
      for (let i = 0; i < 500; i++) { g.fillStyle = `rgba(${30 + r() * 50},${25 + r() * 35},${15 + r() * 20},${r() * 0.35})`; g.beginPath(); g.arc(r() * w, r() * h, r() * 10, 0, 7); g.fill(); }
      for (let i = 0; i < 60; i++) { g.strokeStyle = 'rgba(90,120,60,0.35)'; g.lineWidth = 1.5; const x = r() * w, y = r() * h; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (r() - 0.5) * 6, y - 8 - r() * 10); g.stroke(); }
    }, [10, 10]);
  }
  function makeWater(K, size, seg) {
    const geo = new T.PlaneGeometry(size, size, seg, seg);
    const mat = K.M(0xffffff, { map: waterTex(K), roughness: 0.25, metalness: 0.55, emissive: 0x06141b, emissiveIntensity: 1 });
    const m = new T.Mesh(geo, mat); m.rotation.x = -Math.PI / 2; m.receiveShadow = true;
    const base = geo.attributes.position.array.slice();
    m.userData.ripple = (t, amp, flow) => {
      const p = geo.attributes.position.array;
      for (let i = 0; i < p.length; i += 3) { const x = base[i], y = base[i + 1]; p[i + 2] = amp * (Math.sin(x * 0.55 + t * 1.3) * 0.6 + Math.sin(y * 0.8 - t * 1.1 + x * 0.2) * 0.4); }
      geo.attributes.position.needsUpdate = true; geo.computeVertexNormals();
      mat.map.offset.x = (mat.map.offset.x + flow) % 1;
    };
    return m;
  }
  function stake(K, h) {
    const g = new T.Group();
    const bam = K.M(0x9a8a4a, { roughness: 0.8 });
    g.add(K.at(new T.Mesh(new T.CylinderGeometry(0.045, 0.05, h, 8), bam), 0, h / 2, 0));
    for (let i = 1; i < h / 0.4; i++) g.add(K.at(new T.Mesh(new T.CylinderGeometry(0.055, 0.055, 0.03, 8), K.M(0x7a6a32)), 0, i * 0.4, 0));
    g.add(K.at(K.box(0.14, 0.05, 0.02, K.M(0xc0392b)), 0, h - 0.15, 0.05));
    return g;
  }
  function stiltHouse(K, o) {
    const g = new T.Group();
    const wood = K.M(o.wood || 0x5a4430, { roughness: 0.9 });
    const tin = K.M(o.tin || 0x6f7a7c, { metalness: 0.6, roughness: 0.5 });
    [[-1.4, -1.1], [1.4, -1.1], [-1.4, 1.1], [1.4, 1.1]].forEach(([x, z]) => g.add(K.at(K.box(0.12, 1.4, 0.12, wood), x, 0.7, z)));
    g.add(K.at(K.box(3.2, 0.12, 2.6, wood), 0, 1.4, 0));
    g.add(K.at(K.box(3.0, 1.7, 2.4, K.M(o.wall || 0x7a6346, { roughness: 0.95 })), 0, 2.3, 0));
    const r1 = K.at(K.box(3.6, 0.05, 1.6, tin), 0, 3.45, -0.62); r1.rotation.x = -0.55; g.add(r1);
    const r2 = K.at(K.box(3.6, 0.05, 1.6, tin), 0, 3.45, 0.62); r2.rotation.x = 0.55; g.add(r2);
    const win = K.at(new T.Mesh(new T.PlaneGeometry(0.7, 0.6), K.M(0x000, { emissive: o.lit ? 0xffb050 : 0x0b1218, emissiveIntensity: o.lit ? 1.4 : 1 })), 0.6, 2.4, 1.21);
    g.add(win);
    let lamp = null;
    if (o.lit) { lamp = K.at(new T.PointLight(0xffa850, 0.8, 7, 1.8), 0.6, 2.4, 1.8); g.add(lamp); }
    if (o.sign) {
      const tx = K.canvasTex(512, 128, (c, w, h) => { c.clearRect(0, 0, w, h); c.fillStyle = 'rgba(235,235,225,0.85)'; c.font = `600 40px ${K.FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(o.sign, w / 2, h / 2); });
      const sg = K.at(new T.Mesh(new T.PlaneGeometry(2.6, 0.65), K.M(0xffffff, { map: tx, transparent: true })), 0, 3.32, 0.93); sg.rotation.x = -(Math.PI / 2 - 0.55); g.add(sg);
    }
    g.userData = { win, lamp };
    return g;
  }
  function boat(K, len) {
    const g = new T.Group();
    const wood = K.M(0x4a3524, { roughness: 0.85 });
    const L = len || 4.2;
    g.add(K.at(K.box(1.1, 0.35, L * 0.7, wood), 0, 0.12, 0));
    const bow = K.at(new T.Mesh(new T.ConeGeometry(0.62, L * 0.18, 4), wood), 0, 0.14, -L * 0.44); bow.rotation.x = -Math.PI / 2; bow.rotation.y = Math.PI / 4; bow.scale.set(1, 1, 0.45); g.add(bow);
    const st = K.at(new T.Mesh(new T.ConeGeometry(0.62, L * 0.18, 4), wood), 0, 0.14, L * 0.44); st.rotation.x = Math.PI / 2; st.rotation.y = Math.PI / 4; st.scale.set(1, 1, 0.45); g.add(st);
    g.add(K.at(K.box(1.0, 0.05, L * 0.66, K.M(0x2a1c12)), 0, 0.27, 0));
    g.add(K.at(K.box(0.05, 0.05, 2.4, K.M(0x7a5634)), 0.62, 0.9, L * 0.3).rotateX(0.9));
    return g;
  }
  function kapok(K, h, seed) {
    const g = new T.Group();
    const bark = K.M(0x6b5a48, { roughness: 0.95 });
    g.add(K.at(new T.Mesh(new T.CylinderGeometry(0.35, 0.6, h, 10), bark), 0, h / 2, 0));
    const r = K.rnd(seed);
    const flowers = [];
    for (let i = 0; i < 6; i++) {
      const y = h * (0.45 + i * 0.09), a = r() * 6.28, len = 2 + r() * 2.6;
      const br = K.at(new T.Mesh(new T.CylinderGeometry(0.06, 0.12, len, 6), bark), Math.cos(a) * len / 2, y, Math.sin(a) * len / 2);
      br.rotation.z = Math.PI / 2 - 0.45; br.rotation.y = -a; br.position.y += len * 0.2; g.add(br);
      for (let j = 0; j < 12; j++) { const d = len * (0.4 + r() * 0.6); flowers.push(Math.cos(a) * d + (r() - 0.5) * 0.6, y + 0.2 + r() * 0.5, Math.sin(a) * d + (r() - 0.5) * 0.6); }
    }
    const fg = new T.BufferGeometry(); fg.setAttribute('position', new T.Float32BufferAttribute(flowers, 3));
    g.add(new T.Points(fg, new T.PointsMaterial({ color: 0xd8432e, size: 0.42 })));
    return g;
  }
  function glowBall(K, color, r) {
    return new T.Mesh(new T.SphereGeometry(r || 0.18, 12, 10), new T.MeshBasicMaterial({ color, fog: false }));
  }

  /* ================= BẾN ĐÒ ================= */
  function buildBen(K) {
    const g = new T.Group();
    // bãi đất
    const land = new T.Mesh(new T.PlaneGeometry(90, 40), K.M(0xffffff, { map: mudTex(K), roughness: 1 }));
    land.rotation.x = -Math.PI / 2; land.position.set(0, 0, 19.5); land.receiveShadow = true; g.add(land);
    const slope = K.at(K.box(90, 1.4, 3, K.M(0x3a2c1c, { roughness: 1 })), 0, -0.55, 0.2); slope.rotation.x = 0.5; g.add(slope);
    // sông
    const water = makeWater(K, 260, 70); water.position.set(0, -0.6, -60); g.add(water);
    // vệt trăng trên mặt nước
    const moonPath = K.at(new T.Mesh(new T.PlaneGeometry(2.2, 80), new T.MeshBasicMaterial({ color: 0x9fb8c8, transparent: true, opacity: 0.12, depthWrite: false })), 6, -0.5, -45);
    moonPath.rotation.x = -Math.PI / 2; g.add(moonPath);
    const moon = new T.DirectionalLight(0x9db4ff, 0.6); moon.position.set(20, 30, -40); moon.castShadow = true; g.add(moon);
    const moonDisc = K.at(glowBall(K, 0xdfe8ff, 2.2), 40, 38, -150); g.add(moonDisc);
    // bờ bên kia + đèn bến Cồn Bồi
    g.add(K.at(K.box(400, 3, 20, K.M(0x0a0f10, { roughness: 1 })), 0, 0.5, -140));
    const farLamp = K.at(glowBall(K, 0xffc070, 0.5), 10, 3.2, -128); g.add(farLamp);
    const farLight = K.at(new T.PointLight(0xffb060, 0, 30, 1.5), 10, 4, -125); g.add(farLight);
    // mười bốn cọc tre quanh thửa 112
    const poly = [[-6, 2], [-6.4, 5], [-5.8, 8], [-3, 9.4], [0, 9.6], [3, 9.4], [5.8, 8.4], [6.4, 5], [6.2, 2], [4.6, 0.2], [2, -0.4], [-1, -0.5], [-3.2, -0.3], [-5.2, -0.4]];
    const stakes = poly.map(([x, z], i) => { const s = stake(K, 1.6); s.position.set(x, 0, z); s.userData.home = [x, z]; s.userData.n = i + 1; g.add(s); return s; });
    // số trên cọc (cọc 3) không cần chữ; cọc 7 là góc tây nam: chỉ số 13 trong mảng (cọc gần mép nước)
    const s7 = stakes[13]; // góc tây nam sát nước
    const lean1 = stakes[11], lean2 = stakes[12];
    const s7new = stake(K, 1.6); g.add(s7new);
    // dây đo căng giữa các cọc
    const rope = new T.Line(new T.BufferGeometry().setFromPoints(poly.concat([poly[0]]).map(([x, z]) => new T.Vector3(x, 1.0, z))), new T.LineBasicMaterial({ color: 0xd8c8a0, transparent: true, opacity: 0.45 }));
    g.add(rope);
    // nhà sàn mái tôn
    const h9 = stiltHouse(K, { lit: false, sign: 'Đừng đo khi nước đứng' }); h9.position.set(-12, 0, 6); h9.rotation.y = 0.35; g.add(h9);
    const h2 = stiltHouse(K, { lit: true, wall: 0x6a5a40 }); h2.position.set(13, 0, 9); h2.rotation.y = -0.5; g.add(h2);
    const tram = stiltHouse(K, { lit: true, wall: 0x56624e, tin: 0x5a6466 }); tram.scale.setScalar(0.7); tram.position.set(7.5, 0, 3); tram.rotation.y = -0.2; g.add(tram);
    // điểm trường + cột cờ
    const school = new T.Group();
    school.add(K.at(K.box(9, 3, 4, K.M(0xb8a878, { map: K.wallTex() })), 0, 1.5, 0));
    const sr = K.at(K.box(9.6, 0.06, 2.6, K.M(0x7a8688, { metalness: 0.6, roughness: 0.5 })), 0, 3.4, -1.0); sr.rotation.x = -0.4; school.add(sr);
    const sr2 = K.at(K.box(9.6, 0.06, 2.6, K.M(0x7a8688, { metalness: 0.6, roughness: 0.5 })), 0, 3.4, 1.0); sr2.rotation.x = 0.4; school.add(sr2);
    school.add(K.at(new T.Mesh(new T.CylinderGeometry(0.05, 0.05, 7, 6), K.M(0x6a6a6a, { metalness: 0.6 })), 5.5, 3.5, 1.5));
    school.position.set(-20, 0, 16); school.rotation.y = 0.6; g.add(school);
    // ba cây gạo cổ
    const trees = [kapok(K, 11, 3), kapok(K, 12, 7), kapok(K, 10.5, 11)];
    trees[0].position.set(9, 0, 1.0); trees[1].position.set(-13, 0, 4); trees[2].position.set(-12, 0, 12);
    trees.forEach((t) => g.add(t));
    const treeRim = new T.PointLight(0xbfd0ff, 0, 30, 1.5); treeRim.position.set(0, 14, 6); g.add(treeRim);
    // đò của bà Tư
    const ferry = boat(K, 4.6); ferry.position.set(2.8, -0.45, -1.8); ferry.rotation.y = 1.25; g.add(ferry);
    // xuồng ma có đèn bão + người đội nón lá
    const ghost = new T.Group();
    ghost.add(boat(K, 2.8));
    const gf = K.figure({ name: '', shirt: 0x3a3a36, pants: 0x1a1a1a, nonla: true, stoop: true, lantern: true });
    gf.position.set(0, 0.2, 0.2); gf.userData.label = null; ghost.add(gf);
    const gl = K.at(new T.PointLight(0xffa040, 1.6, 14, 1.6), 0, 1.4, 0.6); ghost.add(gl);
    ghost.position.set(-2, -0.4, -26); ghost.rotation.y = 0.3; ghost.visible = false; g.add(ghost);
    // ngôi nhà chỉ hiện lúc nước ròng
    const house = stiltHouse(K, { lit: true, wall: 0x5c4a36, tin: 0x5f6a6a });
    house.scale.setScalar(1.35); house.position.set(-8, -6, -21); house.rotation.y = 0.35; g.add(house);
    // ánh đèn làng cũ dưới nước
    const under = new T.Group();
    for (let i = 0; i < 9; i++) { const b = glowBall(K, 0xffb050, 0.12); b.position.set(-30 + i * 7 + Math.sin(i) * 2, -1.6, -18 - (i % 3) * 8); under.add(b); }
    under.visible = false; g.add(under);
    const dst = K.dust(300, 30, 6); dst.position.set(0, 0, 4); g.add(dst);

    const CAMS = {
      base: { pos: [0.6, 1.75, 8.5], look: [-0.5, 0.7, -6], orbit: 0.03 },
      sau: { pos: [0.2, 1.6, 6.4], look: [-1.4, 1.2, 2.4], orbit: 0.01 },
      school: { pos: [-9, 2.2, 11], look: [-2, 0.4, -22], orbit: 0.02 },
      trees: { pos: [6, 3, 22], look: [-6, 4, 4], orbit: 0.02 },
      ebb: { pos: [2.5, 2.2, 8.5], look: [-6, 1.2, -20], orbit: 0.02 },
      wide: { pos: [8, 6, 22], look: [-3, 1, -14], orbit: 0.04 }
    };
    const view = {
      group: g, fog: [0x061014, 0.024], amb: 0.32,
      cam: Object.assign({}, CAMS.base),
      spots: { quy: [1.4, 0, 2.6, -0.3], sau: [-1.6, 0, 3.4, 0.5], tu: [2.4, -0.15, -1.6, 0.3], lanh: [-0.6, 0, 1.4, 0.2] },
      menuCam(t, portrait) {
        const a = K.reduceMotion ? 0.4 : 0.4 + Math.sin(t * 0.05) * 0.3;
        return { pos: [Math.sin(a) * 26, 6.5, 6 + Math.cos(a) * 20], look: [portrait ? -2 : -9, portrait ? 1.2 : 2.6, -10], orbit: 0 };
      },
      onShow() {
        const fx = K.fx;
        const c = fx.has('wide') ? CAMS.wide : fx.has('closeup_sau') ? CAMS.sau : fx.has('from_school') ? CAMS.school : fx.has('trees') ? CAMS.trees : fx.has('house') ? CAMS.ebb : CAMS.base;
        Object.assign(view.cam, c);
        if (fx.has('from_school')) { const l = K.figures.lanh; if (l) { l.position.set(-6, 0, 6); l.rotation.y = 2.6; } }
        if (fx.has('tu_wade')) { const tu = K.figures.tu; if (tu) { tu.position.set(-6.5, -0.9, -6); tu.rotation.y = 0.4; } }
        if (fx.has('trees')) { const q = K.figures.quy; if (q) { q.position.set(-3.2, 0, 2.2); q.rotation.y = 0.6; } }
        if (fx.has('house')) { const s = K.figures.sau, q = K.figures.quy, tu = K.figures.tu; if (s) { s.position.set(-3.4, 0, 3.4); s.rotation.y = Math.PI - 0.5; } if (q) { q.position.set(2.8, 0, 3.6); q.rotation.y = Math.PI + 0.4; } if (tu) { tu.rotation.y = Math.PI + 0.4; } }
      },
      update(t, dt) {
        const fx = K.fx, el = t - K.fxStart;
        const mn = typeof K.S.MN === 'number' ? K.S.MN : 2;
        let wy = -0.75 + mn * 0.05 - (fx.has('ebb') ? 0.55 : 0);
        if (fx.has('flood')) wy = -0.4 + Math.min(1.8, el * 0.22);
        water.position.y += (wy - water.position.y) * Math.min(1, dt * 0.8);
        const still = fx.has('still');
        water.userData.ripple(t, still ? 0 : 0.06, still ? 0 : (fx.has('flow') || fx.has('ebb') ? 0.0012 : 0.0005));
        moonPath.position.y = water.position.y + 0.02;
        moonPath.material.opacity = still ? 0.22 : 0.1 + Math.sin(t * 2) * 0.03;
        // đèn bờ bên kia
        const ghostOn = fx.has('ghostboat');
        const farOn = (fx.has('farlamp') || fx.has('farlamp_back') || fx.has('menu')) && !(ghostOn && !fx.has('farlamp_back'));
        const fk = fx.has('farlamp_back') ? Math.min(1, Math.max(0, (el - 3) / 2)) : farOn ? 1 : 0;
        farLamp.material.color.setRGB(0.08 + fk * 0.92, 0.06 + fk * 0.69, 0.04 + fk * 0.4);
        farLight.intensity = fk * 1.2;
        // cọc mốc
        const lost = fx.has('stakes_lost') || fx.has('stake7_gps') || fx.has('stake7_ok') || fx.has('stake7_mid') || fx.has('still');
        s7.visible = !lost;
        lean1.rotation.set(lost ? 0.5 : 0, 0, lost ? -0.3 : 0); lean1.position.set(lean1.userData.home[0] - (lost ? 1 : 0), lost ? -0.5 : 0, lean1.userData.home[1] - (lost ? 2.5 : 0));
        lean2.rotation.set(lost ? 0.7 : 0, 0, lost ? 0.4 : 0); lean2.position.set(lean2.userData.home[0] + (lost ? 0.6 : 0), lost ? -0.6 : 0, lean2.userData.home[1] - (lost ? 3.2 : 0));
        s7new.visible = fx.has('stake7_gps') || fx.has('stake7_ok') || fx.has('stake7_mid');
        if (fx.has('stake7_ok')) { s7new.position.set(-5.2, 0, -0.5); s7new.rotation.set(0, 0, 0); }
        if (fx.has('stake7_gps')) { s7new.position.set(-4.2, 0, 1.4); s7new.rotation.set(-0.22 - Math.sin(t * 0.7) * 0.03, 0, 0.05); }
        if (fx.has('stake7_mid')) { s7new.position.set(-3.6, water.position.y - 0.8, -8.5); s7new.rotation.set(0, 0, 0); }
        // xuồng ma
        ghost.visible = ghostOn;
        if (ghostOn) {
          const sink = fx.has('sinking') ? Math.min(3, Math.max(0, el - 1.2) * 0.6) : 0;
          ghost.position.y = water.position.y + 0.15 + Math.sin(t * 1.2) * 0.05 - sink;
          ghost.rotation.z = Math.sin(t * 0.9) * 0.04;
          gl.intensity = (1.4 + Math.sin(t * 9) * 0.2) * (sink > 2.2 ? 0 : 1);
          gf.rotation.y = Math.sin(t * 0.5) * 0.3;
          gf.userData.armR.rotation.x = fx.has('sinking') ? 0 : -2.2 + Math.sin(t * 3) * 0.5;
        }
        // nhà hiện lúc nước ròng
        const showHouse = fx.has('house');
        const hy = showHouse ? Math.min(0, -5 + Math.max(0, el - 0.5) * 1.1) + water.position.y + 0.3 : -6;
        house.position.y += (hy - house.position.y) * Math.min(1, dt * (showHouse ? 3 : 1));
        const hlamp = house.userData.lamp, dark = fx.has('house_dark');
        if (hlamp) hlamp.intensity = dark ? 0 : 0.9 + Math.sin(t * 7) * 0.12 + (Math.random() < 0.01 ? -0.6 : 0);
        house.userData.win.material.emissiveIntensity = dark ? 0.05 : 1.4;
        under.visible = fx.has('underlights');
        under.children.forEach((b, i) => { b.position.y = water.position.y - 1 + Math.sin(t + i) * 0.1; });
        treeRim.intensity = fx.has('trees') ? 1.4 : 0.2;
        const dark2 = fx.has('village_dark');
        [h2, tram].forEach((h) => { if (h.userData.lamp) h.userData.lamp.intensity = dark2 ? 0 : 0.7 + Math.sin(t * 11 + h.position.x) * 0.08; });
        ferry.position.y = water.position.y + 0.15 + Math.sin(t * 1.1) * 0.03;
        ferry.rotation.z = Math.sin(t * 0.8) * 0.02;
        const tu = K.figures.tu;
        if (tu && tu.visible && !fx.has('tu_wade')) tu.position.y = ferry.position.y + 0.18;
        if (tu && tu.visible && fx.has('tu_wade')) tu.position.y = water.position.y - 0.55;
      }
    };
    return view;
  }

  /* ================= TRÊN ĐÒ GIỮA SÔNG ================= */
  function buildSong(K) {
    const g = new T.Group();
    const water = makeWater(K, 240, 60); water.position.set(0, 0, -40); g.add(water);
    const hull = boat(K, 5); hull.position.set(0, -0.05, -0.6); g.add(hull);
    const moon = new T.DirectionalLight(0x9db4ff, 0.6); moon.position.set(-20, 30, -30); g.add(moon);
    g.add(K.at(glowBall(K, 0xdfe8ff, 2.4), 34, 30, -150));
    const moonPath = K.at(new T.Mesh(new T.PlaneGeometry(2.6, 120), new T.MeshBasicMaterial({ color: 0x9fb8c8, transparent: true, opacity: 0.12, depthWrite: false })), -8, 0.02, -70);
    moonPath.rotation.x = -Math.PI / 2; g.add(moonPath);
    // bờ Cồn Lở phía trước: dải đất tối, đèn nhà
    g.add(K.at(K.box(300, 2, 10, K.M(0x0b1110)), 0, 0.2, -70));
    const lights = new T.Group();
    for (let i = 0; i < 10; i++) { const b = glowBall(K, 0xffb860, 0.16); b.position.set(-40 + i * 9 + Math.sin(i * 3) * 3, 1.8 + (i % 2) * 0.4, -66); lights.add(b); }
    g.add(lights);
    [[-12, 13], [6, 11], [22, 12]].forEach(([x, h], i) => { const k = kapok(K, h, 3 + i * 4); k.position.set(x, 0, -72); g.add(k); });
    const farLamp = K.at(glowBall(K, 0xffc070, 0.5), 14, 2.4, -60); g.add(farLamp);
    // áo phao bà Tư
    const jacket = K.box(0.46, 0.44, 0.3, K.M(0xff6a1a, { emissive: 0x401400 })); jacket.visible = false;
    // xuồng ma (cho kết thúc Giữa dòng)
    const ghost = new T.Group(); ghost.add(boat(K, 2.8));
    const gf = K.figure({ name: '', shirt: 0x3a3a36, pants: 0x1a1a1a, nonla: true, stoop: true, lantern: true }); gf.position.set(0, 0.2, 0); ghost.add(gf);
    ghost.add(K.at(new T.PointLight(0xffa040, 1.6, 12, 1.6), 0, 1.4, 0.6));
    ghost.position.set(0.6, 0, -6); ghost.rotation.y = Math.PI; ghost.visible = false; g.add(ghost);
    return {
      group: g, fog: [0x061014, 0.02], amb: 0.3, sway: 0.006,
      cam: { pos: [0, 1.35, 2.1], look: [0, 1.0, -8], orbit: 0.005 },
      spots: { tu: [0, 0.22, -1.7, 0] },
      update(t) {
        const fx = K.fx;
        water.userData.ripple(t, 0.07, 0.0006);
        hull.position.y = Math.sin(t * 1.3) * 0.04; hull.rotation.z = Math.sin(t * 0.9) * 0.02;
        const tu = K.figures.tu;
        if (tu && tu.visible) {
          tu.position.y = 0.22 + hull.position.y;
          tu.userData.armL.rotation.x = -0.6 + Math.sin(t * 1.2) * 0.5; tu.userData.armR.rotation.x = -0.6 + Math.sin(t * 1.2) * 0.5;
          if (jacket.parent !== tu) tu.add(K.at(jacket, 0, 1.16, 0));
          jacket.visible = fx.has('tujacket');
        }
        lights.visible = !fx.has('village_dark');
        farLamp.visible = fx.has('farlamp') || fx.has('village_dark');
        ghost.visible = fx.has('ghostboat');
        if (ghost.visible) ghost.position.y = Math.sin(t * 1.2) * 0.05;
      }
    };
  }

  /* ================= LỚP HỌC ĐIỂM TRƯỜNG ================= */
  function boardTex(K, wiped) {
    return K.canvasTex(1024, 512, (c, w, h) => {
      c.fillStyle = '#1f3a2e'; c.fillRect(0, 0, w, h);
      const r = K.rnd(4);
      for (let i = 0; i < 300; i++) { c.fillStyle = `rgba(230,230,220,${r() * 0.05})`; c.fillRect(r() * w, r() * h, r() * 60, r() * 4); }
      c.strokeStyle = 'rgba(240,240,230,0.85)'; c.fillStyle = 'rgba(240,240,230,0.9)'; c.lineWidth = 4; c.lineCap = 'round';
      c.font = `600 36px ${K.FONT}`; c.fillText('Bài 12. Quê em bên sông', 40, 60);
      if (!wiped) {
        // dòng sông
        c.beginPath(); c.moveTo(20, 230); c.bezierCurveTo(300, 190, 600, 270, 1004, 220); c.stroke();
        c.beginPath(); c.moveTo(20, 300); c.bezierCurveTo(300, 270, 650, 330, 1004, 300); c.stroke();
        for (let i = 0; i < 6; i++) { c.beginPath(); c.moveTo(120 + i * 150, 262); c.quadraticCurveTo(140 + i * 150, 250, 160 + i * 150, 262); c.stroke(); }
        // nhà
        [[120, 400], [260, 420], [620, 410], [820, 400]].forEach(([x, y]) => { c.strokeRect(x, y, 60, 40); c.beginPath(); c.moveTo(x - 8, y); c.lineTo(x + 30, y - 30); c.lineTo(x + 68, y); c.stroke(); });
        // ba cây gạo
        [[420, 440], [720, 470], [930, 450]].forEach(([x, y]) => { c.beginPath(); c.moveTo(x, y); c.lineTo(x, y - 90); c.moveTo(x, y - 60); c.lineTo(x - 30, y - 80); c.moveTo(x, y - 70); c.lineTo(x + 32, y - 92); c.stroke(); for (let k = 0; k < 6; k++) { c.beginPath(); c.arc(x - 30 + k * 12, y - 92 - (k % 2) * 10, 5, 0, 7); c.stroke(); } });
        c.font = `500 24px ${K.FONT}`; c.fillText('cây gạo', 380, 490);
      } else {
        c.fillStyle = 'rgba(40,70,60,1)'; c.fillRect(0, 90, w, h);
        const gr = c.createLinearGradient(0, 200, 0, 330); gr.addColorStop(0, 'rgba(10,30,26,0)'); gr.addColorStop(0.5, 'rgba(10,30,26,0.8)'); gr.addColorStop(1, 'rgba(10,30,26,0)'); c.fillStyle = gr; c.fillRect(0, 200, w, 130);
        c.strokeStyle = 'rgba(240,240,230,0.85)'; c.fillStyle = 'rgba(240,240,230,0.9)';
      }
      // nhà bà Tư giữa sông: luôn còn
      c.strokeRect(470, 230, 50, 34); c.beginPath(); c.moveTo(462, 230); c.lineTo(495, 205); c.lineTo(528, 230); c.stroke();
      c.font = `500 26px ${K.FONT}`; c.fillText('nhà bà Tư đò', 540, 200);
      c.beginPath(); c.moveTo(560, 206); c.lineTo(525, 226); c.stroke();
    });
  }
  function buildTruong(K) {
    const W = 6.4, D = 5.2, H = 3.2;
    const g = new T.Group();
    const r = K.room({ w: W, d: D, h: H }); g.add(r);
    const board = K.at(new T.Mesh(new T.PlaneGeometry(3.4, 1.7), K.M(0xffffff, { map: boardTex(K, false) })), 0, 1.75, -D / 2 + 0.03); g.add(board);
    let wipedTex = null;
    g.add(K.at(K.box(3.6, 0.08, 0.1, K.M(0x5a3a22)), 0, 0.88, -D / 2 + 0.06));
    const deskM = K.M(0x6b4a2c, { roughness: 0.8 }), benchM = K.M(0x5a3a22);
    const rows = [4, 4, 3, 3]; let n = 0;
    rows.forEach((cnt, ri) => { for (let i = 0; i < cnt; i++) { const x = (i - (cnt - 1) / 2) * 1.35, z = -0.9 + ri * 0.95; g.add(K.at(K.box(1.0, 0.06, 0.42, deskM), x, 0.58, z)); g.add(K.at(K.box(0.06, 0.58, 0.4, deskM), x - 0.45, 0.29, z)); g.add(K.at(K.box(0.06, 0.58, 0.4, deskM), x + 0.45, 0.29, z)); g.add(K.at(K.box(1.0, 0.05, 0.24, benchM), x, 0.34, z + 0.38)); n++; } });
    const win = K.windowFrame(1.2, 1.2); win.position.set(-W / 2 + 0.02, 1.7, 0.2); win.rotation.y = Math.PI / 2; g.add(win);
    const moon = new T.SpotLight(0x8fa8ff, 1.3, 10, 0.7, 0.8, 1); moon.position.set(-W / 2 - 1.5, 2.6, 0.2); moon.target.position.set(1, 0, -1); g.add(moon, moon.target);
    const lampL = K.at(new T.PointLight(0xdfeaff, 0.9, 6, 1.6), 0.4, 1.6, -1.2); g.add(lampL);
    const dst = K.dust(200, 5, H); g.add(dst);
    return {
      group: g, fog: [0x070a0c, 0.09], amb: 0.16,
      cam: { pos: [1.4, 1.7, 2.4], look: [-0.2, 1.5, -2.6], orbit: 0.015 },
      spots: { lanh: [1.9, 0, -1.6, -0.6] },
      update(t) {
        const want = K.fx.has('board_wiped');
        if (want && !wipedTex) wipedTex = boardTex(K, true);
        const tex = want ? wipedTex : board.userData.orig || (board.userData.orig = board.material.map);
        if (board.material.map !== tex) { board.material.map = tex; board.material.needsUpdate = true; }
        lampL.intensity = 0.8 + Math.sin(t * 5) * 0.05;
      }
    };
  }

  /* ================= CHÒI TRẠM: BIÊN BẢN 2007 ================= */
  function bienBanTex(K) {
    return K.canvasTex(512, 720, (c, w, h) => {
      c.fillStyle = '#e8dcbc'; c.fillRect(0, 0, w, h);
      const r = K.rnd(2);
      for (let i = 0; i < 120; i++) { c.fillStyle = `rgba(120,90,40,${r() * 0.08})`; c.beginPath(); c.arc(r() * w, r() * h, r() * 30, 0, 7); c.fill(); }
      c.fillStyle = '#3a3a5a'; c.textAlign = 'center';
      c.font = `700 26px ${K.FONT}`; c.fillText('Biên bản sạt lở', w / 2, 70);
      c.font = `500 18px ${K.FONT}`; c.fillText('Ngày 23 tháng 10 năm 2007', w / 2, 102);
      c.textAlign = 'left'; c.font = `400 18px ${K.FONT}`;
      ['Hộ: Nguyễn Thị Tư', 'Thửa: 112-cũ, bến đò Cồn Lở', 'Diện tích bị sạt lở: 311,0 m²', 'Đề nghị bồi thường, hỗ trợ', 'theo quy định.'].forEach((l, i) => c.fillText(l, 40, 170 + i * 38));
      c.strokeStyle = 'rgba(160,40,40,0.7)'; c.lineWidth = 4; c.beginPath(); c.arc(130, 560, 62, 0, 7); c.stroke();
      c.font = `600 14px ${K.FONT}`; c.fillStyle = 'rgba(160,40,40,0.8)'; c.textAlign = 'center'; c.fillText('UBND xã Cồn Lở', 130, 565);
      c.fillStyle = '#3a3a5a'; c.font = `500 17px ${K.FONT}`; c.fillText('Người đo', 380, 470);
      c.strokeStyle = '#6a2fa0'; c.lineWidth = 3; c.beginPath(); c.moveTo(320, 540); c.bezierCurveTo(350, 490, 380, 600, 410, 520); c.bezierCurveTo(430, 480, 450, 560, 470, 530); c.stroke();
      c.fillStyle = '#6a2fa0'; c.font = `italic 600 22px ${K.FONT}`; c.fillText('Người giữ sổ', 390, 600);
    });
  }
  function buildTram(K) {
    const W = 3.4, D = 3.2, H = 2.6;
    const g = new T.Group();
    const r = K.room({ w: W, d: D, h: H }); g.add(r);
    const table = K.at(K.box(1.6, 0.06, 0.9, K.M(0x5b3e26)), 0, 0.78, -0.4); g.add(table);
    [[-0.75, -0.8], [0.75, -0.8], [-0.75, 0], [0.75, 0]].forEach(([x, z]) => g.add(K.at(K.box(0.05, 0.78, 0.05, K.M(0x4a2e1a)), x, 0.39, z)));
    const paper = K.at(new T.Mesh(new T.PlaneGeometry(0.42, 0.59), K.M(0xffffff, { map: bienBanTex(K), roughness: 0.9 })), 0.05, 0.815, -0.35); paper.rotation.x = -Math.PI / 2; paper.rotation.z = 0.08; g.add(paper);
    g.add(K.at(K.box(0.3, 0.02, 0.4, K.M(0xd8ccb0)), -0.5, 0.82, -0.5).rotateY(0.3));
    const lamp = K.at(new T.PointLight(0xffb050, 1.4, 4, 1.6), -0.5, 1.2, -0.6); g.add(lamp);
    const glass = K.at(new T.Mesh(new T.CylinderGeometry(0.06, 0.08, 0.2, 12), K.M(0xffd38a, { emissive: 0xffa040, emissiveIntensity: 1.2, transparent: true, opacity: 0.8 })), -0.5, 0.92, -0.6); g.add(glass);
    const tide = K.at(new T.Mesh(new T.PlaneGeometry(0.6, 0.8), K.M(0xe8dcbc, { roughness: 1 })), 1.0, 1.6, -D / 2 + 0.02); g.add(tide);
    return {
      group: g, fog: [0x0a0806, 0.08], amb: 0.16,
      cam: { pos: [0.15, 1.75, 0.75], look: [0.05, 0.75, -0.45], orbit: 0.004 },
      spots: { quy: [0.9, 0, -1.15, -0.4] },
      update(t) { lamp.intensity = 1.3 + Math.sin(t * 8) * 0.08 + (Math.random() < 0.01 ? -0.6 : 0); }
    };
  }

  Scene3D.register({
    ambience: 'river',
    torch: (S) => (S.TT < 30 ? 3 : 6),
    views: {
      ben: { label: 'Bến đò Cồn Lở', build: buildBen },
      song: { label: 'Giữa sông', build: buildSong },
      truong: { label: 'Điểm trường Cồn Lở', build: buildTruong },
      tram: { label: 'Chòi trạm', build: buildTram }
    },
    figures: {
      tu: { name: 'Bà Tư', shirt: 0x5a4a6a, pants: 0x1d1d22, hair: 0xb8b2a6, nonla: true, stoop: true, skin: 0xc89670 },
      sau: { name: 'Anh Sáu', shirt: 0xeeeeea, pants: 0x2a3550, phone: true },
      lanh: { name: 'Cô Lành', shirt: 0x9fc0d8, pants: 0x2a2a30, longHair: true, lantern: true },
      quy: { name: 'Anh Quý', shirt: 0x8a7a4a, pants: 0x3a3a2e, cap: true, lantern: true }
    }
  });
})();
