/* =========================================================
   Tập 2 · Chợ Sớm · không gian 3D (dựng bằng code qua Scene3D kit)
   Không gian: trungtam (phòng hồ sơ Trung tâm) · nhalong (nhà lồng chợ, 24 bóng đèn tròn)
               sap47 (sạp cá của mẹ Mi) · bql (phòng ban quản lý trên gác lửng)
   Sổ nợ hiện trong cảnh: mỗi nấc âm tắt hai bóng đèn trong nhà lồng, từ cuối chợ vào.
   ========================================================= */
(function () {
  'use strict';
  if (!window.Scene3D || !window.THREE) return;
  const K0 = Scene3D.kit;
  if (!K0) return;
  const T = THREE;

  /* ---------- vật liệu, đồ vật dùng chung ---------- */
  function concreteTex(K) {
    return K.canvasTex(256, 256, (g, w, h) => {
      g.fillStyle = '#3a3a36'; g.fillRect(0, 0, w, h);
      const r = K.rnd(21);
      for (let i = 0; i < 700; i++) { g.fillStyle = `rgba(${70 + r() * 50},${70 + r() * 45},${60 + r() * 40},${r() * 0.18})`; g.fillRect(r() * w, r() * h, 1 + r() * 3, 1 + r() * 3); }
      for (let i = 0; i < 14; i++) { g.fillStyle = `rgba(10,14,16,${0.15 + r() * 0.2})`; g.beginPath(); g.ellipse(r() * w, r() * h, 10 + r() * 30, 6 + r() * 16, r() * 3, 0, 7); g.fill(); }
      g.strokeStyle = 'rgba(20,20,18,0.5)'; g.lineWidth = 2; g.strokeRect(0, 0, w, h);
    }, [9, 27]);
  }
  function tinTex(K) {
    return K.canvasTex(256, 64, (g, w, h) => {
      for (let x = 0; x < w; x += 16) { const gr = g.createLinearGradient(x, 0, x + 16, 0); gr.addColorStop(0, '#4f5759'); gr.addColorStop(0.5, '#7d878a'); gr.addColorStop(1, '#4a5153'); g.fillStyle = gr; g.fillRect(x, 0, 16, h); }
      const r = K.rnd(4);
      for (let i = 0; i < 40; i++) { g.fillStyle = `rgba(120,60,20,${r() * 0.35})`; g.fillRect(r() * w, r() * h, 2 + r() * 10, 1 + r() * 6); }
    }, [10, 30]);
  }
  function tileTex(K) {
    return K.canvasTex(128, 128, (g, w) => {
      g.fillStyle = '#d8d8cf'; g.fillRect(0, 0, w, w);
      g.strokeStyle = '#9a9a90'; g.lineWidth = 2;
      for (let i = 0; i <= 4; i++) { g.beginPath(); g.moveTo(i * 32, 0); g.lineTo(i * 32, w); g.stroke(); g.beginPath(); g.moveTo(0, i * 32); g.lineTo(w, i * 32); g.stroke(); }
      const r = K.rnd(8);
      for (let i = 0; i < 30; i++) { g.fillStyle = `rgba(120,100,60,${r() * 0.2})`; g.fillRect(r() * w, r() * w, 4 + r() * 12, 2 + r() * 8); }
    }, [3, 1]);
  }
  function plate(K, text, o = {}) {
    const tx = K.canvasTex(256, 128, (g, w, h) => {
      g.fillStyle = o.bg || '#e8dcbc'; g.fillRect(0, 0, w, h);
      g.strokeStyle = o.fg || '#2a251c'; g.lineWidth = 6; g.strokeRect(6, 6, w - 12, h - 12);
      g.fillStyle = o.fg || '#2a251c'; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.font = `700 ${o.size || 70}px ${o.mono ? K.MONO : K.FONT}`; g.fillText(text, w / 2, h / 2 + 4);
    });
    return new T.Mesh(new T.PlaneGeometry(o.w || 0.42, o.h || 0.21), K.M(0xffffff, { map: tx, roughness: 0.9 }));
  }
  function bulbMesh(K) {
    const mat = K.M(0x222018, { emissive: 0xffc670, emissiveIntensity: 1.3, roughness: 0.4 });
    const g = new T.Group();
    const b = new T.Mesh(new T.SphereGeometry(0.085, 14, 10), mat); g.add(b);
    g.add(K.at(new T.Mesh(new T.CylinderGeometry(0.035, 0.035, 0.07, 10), K.M(0x3a3a3a, { metalness: 0.6 })), 0, 0.1, 0));
    g.userData.mat = mat;
    return g;
  }
  // Một sạp chợ, mặt quầy quay về +z (cục bộ). kind: vai | rau | ca | kho | trong
  function stall(K, n, kind, mats, seed) {
    const g = new T.Group();
    const r = K.rnd(seed || n);
    g.add(K.at(K.box(2.1, 0.9, 0.7, kind === 'ca' ? mats.tile : mats.wood), 0, 0.45, 0.3));
    g.add(K.at(K.box(2.2, 0.05, 0.8, mats.top), 0, 0.92, 0.3));
    g.add(K.at(K.box(2.1, 0.7, 0.6, mats.dark), 0, 0.35, -0.45));
    [-1.05, 1.05].forEach((x) => g.add(K.at(K.box(0.07, 2.4, 0.07, mats.post), x, 1.2, -0.7)));
    const aw = K.at(K.box(2.3, 0.04, 1.5, mats.awning), 0, 2.35, -0.05); aw.rotation.x = 0.18; g.add(aw);
    const p = plate(K, String(n), { mono: true, size: 78 }); p.position.set(0, 0.7, 0.66); g.add(p);
    if (kind === 'vai') for (let i = 0; i < 7; i++) { const c = K.at(new T.Mesh(new T.CylinderGeometry(0.09, 0.09, 0.9, 10), K.M([0x8a2a3a, 0x2a5a8a, 0xd8b04a, 0x3a7a4a, 0xa86a3a, 0x6a3a7a, 0xe8e0d0][i])), -0.8 + i * 0.26, 1.04, 0.25); c.rotation.x = Math.PI / 2; g.add(c); }
    if (kind === 'rau') for (let i = 0; i < 4; i++) { g.add(K.at(new T.Mesh(new T.CylinderGeometry(0.22, 0.18, 0.2, 12), mats.basket), -0.7 + i * 0.46, 1.04, 0.3)); g.add(K.at(new T.Mesh(new T.SphereGeometry(0.17, 8, 6), K.M(0x3f7a32)), -0.7 + i * 0.46, 1.15, 0.3)); }
    if (kind === 'ca' || kind === 'kho') for (let i = 0; i < 3; i++) g.add(K.at(K.box(0.5, 0.32, 0.36, mats.foam), -0.6 + i * 0.6, 0.86 + (r() < 0.3 ? 0.32 : 0), -0.45));
    if (kind === 'trong') g.add(K.at(K.box(1.6, 0.03, 0.6, K.M(0x2a2a28, { roughness: 1 })), 0, 0.95, 0.3));
    return g;
  }
  function stool(K, mat) {
    const g = new T.Group();
    g.add(K.at(new T.Mesh(new T.CylinderGeometry(0.17, 0.17, 0.04, 14), mat), 0, 0.42, 0));
    [[-0.11, -0.11], [0.11, -0.11], [-0.11, 0.11], [0.11, 0.11]].forEach(([x, z]) => g.add(K.at(K.box(0.03, 0.42, 0.03, mat), x, 0.21, z)));
    return g;
  }
  function oilLamp(K) {
    const g = new T.Group();
    g.add(K.at(new T.Mesh(new T.CylinderGeometry(0.07, 0.09, 0.06, 12), K.M(0x5a4a2a, { metalness: 0.5 })), 0, 0.03, 0));
    const glass = K.at(new T.Mesh(new T.CylinderGeometry(0.045, 0.065, 0.2, 12), K.M(0xffd38a, { emissive: 0xff9a30, emissiveIntensity: 1.6, transparent: true, opacity: 0.85 })), 0, 0.16, 0);
    g.add(glass); g.userData.glass = glass;
    return g;
  }

  /* ================= PHÒNG HỒ SƠ TRUNG TÂM ================= */
  function photocopyTex(K) {
    return K.canvasTex(512, 700, (c, w, h) => {
      c.fillStyle = '#d9d6cc'; c.fillRect(0, 0, w, h);
      const r = K.rnd(17);
      for (let i = 0; i < 400; i++) { c.fillStyle = `rgba(40,40,40,${r() * 0.12})`; c.fillRect(r() * w, r() * h, 1 + r() * 2, 1 + r() * 2); }
      c.strokeStyle = 'rgba(60,60,60,0.25)'; for (let y = 90; y < h; y += 44) { c.beginPath(); c.moveTo(30, y); c.lineTo(w - 30, y); c.stroke(); }
      c.fillStyle = '#26334a'; c.font = `italic 500 24px ${K.FONT}`;
      ['Sáu thịt · thiếu 200 nghìn', 'Tư rau · thiếu 3 bó hành', 'Lan cá · mượn 4 triệu', 'Út bún · thiếu một lời xin lỗi', 'Bảy đồ khô · trả rồi'].forEach((l, i) => c.fillText(l, 40, 80 + i * 44 + (i > 2 ? 44 : 0)));
      c.fillStyle = '#6a2fa0'; c.font = `italic 600 25px ${K.FONT}`;
      c.fillText('Sạp 47 · nợ một lời hứa ·', 40, 80 + 3 * 44);
      c.fillText('đã ký nhận thay. Người giữ sổ', 60, 80 + 6.4 * 44);
      c.strokeStyle = '#6a2fa0'; c.lineWidth = 3; c.beginPath(); c.moveTo(300, 380); c.bezierCurveTo(340, 340, 380, 420, 440, 370); c.stroke();
    });
  }
  function buildTrungtam(K) {
    const W = 4.4, D = 3.8, H = 2.8;
    const g = new T.Group();
    g.add(K.room({ w: W, d: D, h: H }));
    // kệ hồ sơ
    const steel = K.M(0x6a6e70, { metalness: 0.6, roughness: 0.5 });
    const cols = [0x2f4f7a, 0x3a6a4a, 0xc8a040, 0x8a3a2a, 0x4a4a6a];
    const r = K.rnd(5);
    [-1.3, 0.2].forEach((sx) => {
      [0.1, 0.65, 1.2, 1.75].forEach((y) => g.add(K.at(K.box(1.3, 0.03, 0.4, steel), sx, y, -D / 2 + 0.25)));
      [-0.64, 0.64].forEach((dx) => g.add(K.at(K.box(0.03, 2.1, 0.4, steel), sx + dx, 1.05, -D / 2 + 0.25)));
      [0.1, 0.65, 1.2].forEach((y) => { for (let i = 0; i < 9; i++) g.add(K.at(K.box(0.11, 0.42, 0.32, K.M(cols[Math.floor(r() * cols.length)])), sx - 0.55 + i * 0.137, y + 0.23, -D / 2 + 0.25)); });
    });
    // bàn và bìa hồ sơ mở
    const wood = K.M(0x5b3e26);
    g.add(K.at(K.box(1.5, 0.05, 0.8, wood), 0.3, 0.76, -0.4));
    [[-0.4, -0.75], [1.0, -0.75], [-0.4, -0.05], [1.0, -0.05]].forEach(([x, z]) => g.add(K.at(K.box(0.05, 0.76, 0.05, wood), x, 0.38, z)));
    const folder = K.at(K.box(0.62, 0.02, 0.44, K.M(0x2f4f7a)), 0.25, 0.79, -0.35); folder.rotation.y = 0.12; g.add(folder);
    const copy = K.at(new T.Mesh(new T.PlaneGeometry(0.29, 0.4), K.M(0xffffff, { map: photocopyTex(K), roughness: 0.95 })), 0.34, 0.805, -0.33); copy.rotation.x = -Math.PI / 2; copy.rotation.z = 0.1; g.add(copy);
    // đèn bàn
    const lampG = new T.Group();
    lampG.add(K.at(new T.Mesh(new T.CylinderGeometry(0.08, 0.1, 0.03, 14), K.M(0x222)), 0, 0, 0));
    lampG.add(K.at(K.box(0.02, 0.42, 0.02, K.M(0x222)), 0, 0.21, 0));
    const shade = K.at(new T.Mesh(new T.ConeGeometry(0.11, 0.14, 16, 1, true), K.M(0x2a5a3a, { side: T.DoubleSide })), 0.06, 0.42, 0.05); shade.rotation.z = -0.5; lampG.add(shade);
    lampG.add(K.at(new T.PointLight(0xffd8a0, 1.3, 3.2, 1.6), 0.12, 0.34, 0.08));
    lampG.position.set(-0.25, 0.79, -0.6); g.add(lampG);
    // đèn tuýp lạnh
    g.add(K.at(new T.Mesh(new T.BoxGeometry(1.2, 0.04, 0.06), new T.MeshBasicMaterial({ color: 0xdfeaff })), 0, H - 0.05, 0));
    g.add(K.at(new T.PointLight(0xcfe0ff, 0.5, 6, 1.4), 0, H - 0.3, 0));
    // cửa sổ: hoàng hôn
    const sky = K.canvasTex(256, 256, (c, w, h) => { const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#2a3a5a'); gr.addColorStop(0.6, '#c8704a'); gr.addColorStop(1, '#f0b070'); c.fillStyle = gr; c.fillRect(0, 0, w, h); });
    const win = K.windowFrame(1.0, 0.9); win.position.set(-W / 2 + 0.02, 1.6, 0.4); win.rotation.y = Math.PI / 2; g.add(win);
    const skyM = K.at(new T.Mesh(new T.PlaneGeometry(0.98, 0.88), new T.MeshBasicMaterial({ map: sky })), -W / 2 + 0.035, 1.6, 0.4); skyM.rotation.y = Math.PI / 2; g.add(skyM);
    g.add(K.dust(120, 4, H));
    return {
      group: g, fog: [0x0a0c10, 0.06], amb: 0.28,
      cam: { pos: [0.55, 1.55, 1.35], look: [0.2, 0.85, -0.55], orbit: 0.005 },
      spots: {}
    };
  }

  /* ================= NHÀ LỒNG CHỢ ================= */
  function buildNhalong(K) {
    const g = new T.Group();
    const mats = {
      wood: K.M(0x6b4a2c, { roughness: 0.85 }), tile: K.M(0xffffff, { map: tileTex(K), roughness: 0.5 }),
      top: K.M(0x8a8c88, { metalness: 0.5, roughness: 0.4 }), dark: K.M(0x3a2a1c), post: K.M(0x3d5a4a, { metalness: 0.4 }),
      awning: K.M(0x5f6a6c, { metalness: 0.5, roughness: 0.5 }), basket: K.M(0x9a7a4a, { roughness: 1 }), foam: K.M(0xeeeeea, { roughness: 1 })
    };
    // nền xi măng
    const floor = new T.Mesh(new T.PlaneGeometry(18, 62), K.M(0xffffff, { map: concreteTex(K), roughness: 0.55, metalness: 0.15 }));
    floor.rotation.x = -Math.PI / 2; floor.position.set(0, 0, -16); floor.receiveShadow = true; g.add(floor);
    // mái tôn hai nửa (sống mái chạy dọc chợ)
    const tin = K.M(0xffffff, { map: tinTex(K), metalness: 0.5, roughness: 0.55, side: T.DoubleSide });
    const roofL = K.at(K.box(8.9, 0.05, 54, tin), -4.2, 7.3, -19); roofL.rotation.z = 0.3; g.add(roofL);
    const roofR = K.at(K.box(8.9, 0.05, 54, tin), 4.2, 7.3, -19); roofR.rotation.z = -0.3; g.add(roofR);
    // khung sắt: cột, vì kèo
    const steel = K.M(0x3d5a4a, { metalness: 0.45, roughness: 0.6 });
    for (let z = 6; z >= -44; z -= 6) {
      [-7.6, 7.6].forEach((x) => g.add(K.at(K.box(0.22, 6.1, 0.22, steel), x, 3.05, z)));
      const beam = K.at(K.box(15.4, 0.16, 0.12, steel), 0, 6.05, z); g.add(beam);
      [-1, 1].forEach((s) => { const raf = K.at(K.box(8.1, 0.12, 0.1, steel), s * 3.9, 7.25, z); raf.rotation.z = -s * 0.3; g.add(raf); });
    }
    // tường bao tối hai bên và cuối chợ
    const wallM = K.M(0x1a1c1c, { roughness: 1 });
    [-8, 8].forEach((x) => { const w = K.at(new T.Mesh(new T.PlaneGeometry(56, 6), wallM), x, 3, -19); w.rotation.y = x < 0 ? Math.PI / 2 : -Math.PI / 2; g.add(w); });
    g.add(K.at(new T.Mesh(new T.PlaneGeometry(16, 8), wallM), 0, 4, -46));
    // cổng chợ: tường hai bên, cửa sắt cuốn đã kéo lên, bảng tên
    const gateM = K.M(0x5a5048, { roughness: 0.9 });
    [[-5.5, 5], [5.5, 5]].forEach(([x, w]) => { const m = K.at(new T.Mesh(new T.PlaneGeometry(w, 6), gateM), x, 3, 7.5); m.rotation.y = Math.PI; g.add(m); const m2 = m.clone(); m2.rotation.y = 0; m2.position.z = 7.52; g.add(m2); });
    const lintel = K.at(K.box(6, 2, 0.3, gateM), 0, 5, 7.5); g.add(lintel);
    const shutterTex = K.canvasTex(64, 128, (c, w, h) => { for (let y = 0; y < h; y += 8) { c.fillStyle = y % 16 ? '#6a6e70' : '#4a4e50'; c.fillRect(0, y, w, 8); } }, [6, 1]);
    g.add(K.at(new T.Mesh(new T.CylinderGeometry(0.35, 0.35, 6, 14), K.M(0xffffff, { map: shutterTex, metalness: 0.6, roughness: 0.4 })), 0, 3.75, 7.7).rotateZ(Math.PI / 2));
    const signTex = K.canvasTex(1024, 256, (c, w, h) => { c.fillStyle = '#1f3a5a'; c.fillRect(0, 0, w, h); c.strokeStyle = '#d8c070'; c.lineWidth = 10; c.strokeRect(12, 12, w - 24, h - 24); c.fillStyle = '#f0e0a0'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = `700 110px ${K.FONT}`; c.fillText('Chợ Sớm', w / 2, h / 2 - 10); c.font = `500 40px ${K.FONT}`; c.fillText('thị trấn Phú Cầu · từ 1967', w / 2, h - 46); });
    g.add(K.at(new T.Mesh(new T.PlaneGeometry(4.2, 1.05), K.M(0xffffff, { map: signTex, emissive: 0x111111 })), 0, 5.2, 7.68));
    const outside = K.at(new T.Mesh(new T.PlaneGeometry(30, 14), K.M(0x22201c, { roughness: 1 })), 0, -0.01, 14); outside.rotation.x = -Math.PI / 2; g.add(outside);
    // hai dãy sạp: trái (dãy B, số 44 trở đi), phải (dãy A, số 10 trở đi). Dãy cuối đã dỡ.
    const kinds = ['kho', 'rau', 'ca', 'kho', 'rau', 'vai', 'kho', 'ca', 'rau'];
    let s47 = null;
    for (let i = 0; i < 16; i++) {
      const z = 4 - i * 2.4;
      const nL = 44 + i, nR = 10 + i;
      const L = stall(K, nL, nL === 47 ? 'ca' : kinds[i % kinds.length], mats, nL * 7); L.position.set(-3.6, 0, z); L.rotation.y = Math.PI / 2; g.add(L);
      if (nL === 47) s47 = L;
      const R = stall(K, nR, i === 0 ? 'vai' : kinds[(i + 4) % kinds.length], mats, nR * 11); R.position.set(3.6, 0, z); R.rotation.y = -Math.PI / 2; g.add(R);
    }
    // vết chân bàn hình vuông ở dãy cuối đã dỡ
    const markM = K.M(0x1c1c1a, { roughness: 1 });
    for (let i = 0; i < 4; i++) [-3.6, 3.6].forEach((x) => { const m = K.at(new T.Mesh(new T.PlaneGeometry(1.4, 2.0), markM), x, 0.005, -36 - i * 2.4); m.rotation.x = -Math.PI / 2; g.add(m); });
    // đèn riêng của sạp 47 (luôn sáng)
    const b47 = bulbMesh(K); b47.position.set(-3.3, 2.1, 4 - 3 * 2.4); g.add(b47);
    g.add(K.at(K.box(0.008, 2.0, 0.008, K.M(0x111)), -3.3, 3.2, 4 - 3 * 2.4));
    const l47 = K.at(new T.PointLight(0xffc070, 1.2, 5, 1.6), -3.0, 2.0, 4 - 3 * 2.4); g.add(l47);
    // 24 bóng đèn tròn dọc lối đi
    const bulbs = [], cords = new T.Group();
    for (let i = 0; i < 24; i++) {
      const b = bulbMesh(K); b.position.set(0, 4.5, 4.5 - i * 2); g.add(b); bulbs.push(b);
      cords.add(K.at(K.box(0.008, 2.9, 0.008, K.M(0x111)), 0, 6.0, 4.5 - i * 2));
    }
    g.add(cords);
    const lights = [1, 5, 9, 13, 17, 21].map((i) => { const l = new T.PointLight(0xffc27a, 1.1, 13, 1.5); l.position.set(0, 4.3, 4.5 - i * 2); g.add(l); return l; });
    // ánh trăng lọt qua mái, ánh tím
    const moon = new T.DirectionalLight(0x8fa8d8, 0.25); moon.position.set(-10, 20, 4); g.add(moon);
    const purple = K.at(new T.PointLight(0x9a5aff, 0, 8, 1.5), 1.2, 2.2, 5.2); g.add(purple);
    // dãy cuối: ba ngọn đèn dầu của ba lô mực tím, nồi chè
    const ghosts = new T.Group();
    const stoolM = K.M(0x2f5f8a, { roughness: 0.7 });
    const lamps = [-2.2, 0, 2.2].map((x, i) => { const s = stool(K, stoolM); s.position.set(x, 0, -40 - (i % 2) * 1.2); ghosts.add(s); const l = oilLamp(K); l.position.set(x, 0.44, -40 - (i % 2) * 1.2); ghosts.add(l); return l; });
    const ghostLight = K.at(new T.PointLight(0xff9a40, 0, 12, 1.6), 0, 1.2, -40.5); ghosts.add(ghostLight);
    ghosts.visible = false; g.add(ghosts);
    const che = new T.Group();
    const cs = stool(K, K.M(0xb03a2a, { roughness: 0.7 })); che.add(cs);
    che.add(K.at(new T.Mesh(new T.CylinderGeometry(0.2, 0.17, 0.24, 16), K.M(0x9a9a98, { metalness: 0.7, roughness: 0.3 })), 0.45, 0.12, 0));
    che.add(K.at(new T.Mesh(new T.CylinderGeometry(0.07, 0.04, 0.05, 12), K.M(0xf0f0e8)), 0, 0.47, 0.05));
    const steamGeo = new T.BufferGeometry(); const sp = []; for (let i = 0; i < 40; i++) sp.push(0.45 + (Math.random() - 0.5) * 0.25, 0.25 + Math.random() * 0.9, (Math.random() - 0.5) * 0.25);
    steamGeo.setAttribute('position', new T.Float32BufferAttribute(sp, 3));
    che.add(new T.Points(steamGeo, new T.PointsMaterial({ color: 0xffffff, size: 0.05, transparent: true, opacity: 0.4, depthWrite: false })));
    che.add(K.at(new T.PointLight(0xffb070, 0.5, 4, 1.8), 0.3, 0.9, 0.4));
    che.position.set(-1.2, 0, -37.5); che.visible = false; g.add(che);
    const dst = K.dust(400, 16, 6); dst.position.set(0, 0, -10); g.add(dst);

    const CAMS = {
      base: { pos: [0, 1.7, 6.5], look: [0, 1.5, -20], orbit: 0.02 },
      gate: { pos: [0.4, 1.8, 12], look: [0, 2.6, -12], orbit: 0.01 },
      far: { pos: [0.3, 1.7, -6], look: [0, 1.3, -42], orbit: 0.015 },
      deep: { pos: [0.2, 1.6, -28], look: [0, 0.9, -44], orbit: 0.01 },
      close_mi: { pos: [1.4, 1.6, 0.6], look: [-2.0, 1.1, -3.4], orbit: 0.006 },
      close_hai: { pos: [-0.5, 1.65, 7.0], look: [2.4, 1.05, 3.2], orbit: 0.006 },
      hue: { pos: [0.4, 4.6, -1], look: [0.4, 0.8, -14.5], orbit: 0.006 },
      wide: { pos: [5.4, 6.0, 9], look: [0, 1.2, -20], orbit: 0.03 }
    };
    const view = {
      group: g, fog: [0x07090b, 0.03], amb: 0.22, portraitPull: 1.3,
      cam: Object.assign({}, CAMS.base),
      spots: { toan: [0.9, 0, 2.8, -0.3], hai: [2.3, 0, 3.4, -1.25], mi: [-1.3, 0, -1.8, 0.6], hue: [0.4, 0, -14.5, 0.1] },
      menuCam(t, portrait) {
        const a = K.reduceMotion ? 0 : Math.sin(t * 0.04) * 0.5;
        return { pos: [Math.sin(a) * 3, 3.0, 5.2 + Math.cos(a) * 0.8], look: [portrait ? 0 : -1.2, portrait ? 1.4 : 2.0, -18], orbit: 0 };
      },
      onShow() {
        const fx = K.fx;
        const c = fx.has('wide') ? CAMS.wide : fx.has('gate') ? CAMS.gate : fx.has('deep') ? CAMS.deep : fx.has('far') ? CAMS.far : fx.has('close_mi') ? CAMS.close_mi : fx.has('close_hai') ? CAMS.close_hai : fx.has('hue') ? CAMS.hue : CAMS.base;
        Object.assign(view.cam, c);
        const f = K.figures;
        if (fx.has('gate')) { if (f.toan) { f.toan.position.set(1.3, 0, 5.4); f.toan.rotation.y = 0.15; } if (f.hai) { f.hai.position.set(2.4, 0, 3.4); f.hai.rotation.y = -1.0; } }
        if (fx.has('far') && f.toan) { f.toan.position.set(0.9, 0, -11); f.toan.rotation.y = Math.PI - 0.25; }
        if (fx.has('close_hai')) { if (f.toan) { f.toan.position.set(1.1, 0, 3.6); f.toan.rotation.y = 0.7; } if (f.mi) { f.mi.position.set(-1.6, 0, 1.4); f.mi.rotation.y = 1.4; } }
        if (fx.has('mi_far') && f.mi) { f.mi.position.set(-2.0, 0, -6.5); f.mi.rotation.y = 0.9; }
      },
      update(t, dt) {
        const fx = K.fx, el = t - K.fxStart;
        const sn = typeof K.S.SN === 'number' ? K.S.SN : 0;
        let off = Math.max(0, Math.min(24, -sn * 2));
        if (fx.has('blackout')) off = 24;
        if (fx.has('menu')) off = 0;
        const warm = 1.25 + Math.max(0, sn) * 0.06;
        bulbs.forEach((b, i) => {
          const isOff = i >= 24 - off;
          const flick = (!isOff && i >= 24 - off - 2 && Math.random() < 0.04) ? 0.3 : 1;
          b.userData.mat.emissiveIntensity = isOff ? 0.02 : warm * flick;
        });
        lights.forEach((l, k) => { const i = [1, 5, 9, 13, 17, 21][k]; l.intensity = i >= 24 - off ? 0 : 0.9 + Math.max(0, sn) * 0.05; });
        // đèn sạp 47 luôn sáng
        b47.userData.mat.emissiveIntensity = 1.4 + Math.sin(t * 6) * 0.05;
        l47.intensity = 1.1 + Math.sin(t * 6) * 0.05;
        // đèn dầu dãy cuối
        const gOn = fx.has('ghostlamps');
        ghosts.visible = gOn;
        if (gOn) {
          const k = Math.min(1, Math.max(0, (el - 0.8) / 1.5));
          ghostLight.intensity = k * (1.6 + Math.sin(t * 9) * 0.25);
          lamps.forEach((l, i) => { l.userData.glass.material.emissiveIntensity = k * (1.5 + Math.sin(t * 8 + i) * 0.3); });
        }
        che.visible = fx.has('che');
        if (che.visible) { const a = steamGeo.attributes.position.array; for (let i = 1; i < a.length; i += 3) { a[i] += dt * 0.22; if (a[i] > 1.2) a[i] = 0.25; } steamGeo.attributes.position.needsUpdate = true; }
        purple.intensity = fx.has('purple') ? 0.7 + Math.sin(t * 2.2) * 0.25 : 0;
      }
    };
    return view;
  }

  /* ================= SẠP 47 ================= */
  function dialTex(K) {
    return K.canvasTex(256, 256, (c, w) => {
      c.fillStyle = '#f2ece0'; c.beginPath(); c.arc(w / 2, w / 2, w / 2 - 6, 0, 7); c.fill();
      c.strokeStyle = '#2a2a2a'; c.lineWidth = 6; c.stroke();
      c.lineWidth = 3;
      for (let i = 0; i < 40; i++) { const a = -Math.PI / 2 + i / 40 * Math.PI * 2, r1 = w / 2 - 14, r2 = i % 5 ? w / 2 - 26 : w / 2 - 38; c.beginPath(); c.moveTo(w / 2 + Math.cos(a) * r1, w / 2 + Math.sin(a) * r1); c.lineTo(w / 2 + Math.cos(a) * r2, w / 2 + Math.sin(a) * r2); c.stroke(); }
      c.fillStyle = '#2a2a2a'; c.font = `700 30px ${K.MONO}`; c.textAlign = 'center'; c.fillText('0', w / 2, 72); c.font = `600 22px ${K.FONT}`; c.fillText('kg', w / 2, w / 2 + 60);
    });
  }
  function buildSap47(K) {
    const g = new T.Group();
    const floor = new T.Mesh(new T.PlaneGeometry(14, 14), K.M(0xffffff, { map: concreteTex(K), roughness: 0.5, metalness: 0.15 }));
    floor.rotation.x = -Math.PI / 2; floor.position.z = -3; g.add(floor);
    // quầy gạch men
    const tile = K.M(0xffffff, { map: tileTex(K), roughness: 0.45 });
    g.add(K.at(K.box(2.5, 0.95, 0.8, tile), 0, 0.475, 0));
    g.add(K.at(K.box(2.6, 0.06, 0.9, K.M(0x9a9c98, { metalness: 0.6, roughness: 0.3 })), 0, 0.98, 0));
    const pl = plate(K, '47', { mono: true, size: 84, w: 0.5, h: 0.25 }); pl.position.set(-0.75, 0.66, 0.41); g.add(pl);
    const nm = plate(K, 'Lan · cá đồng', { size: 40, w: 0.8, h: 0.2, bg: '#f4f0e4', fg: '#1f4a6a' }); nm.position.set(0.55, 0.7, 0.41); g.add(nm);
    // phía sau: kệ, thùng xốp, ghế
    const dark = K.M(0x3a2a1c);
    g.add(K.at(K.box(2.5, 0.75, 0.6, dark), 0, 0.375, -1.0));
    const foam = K.M(0xeeeeea, { roughness: 1 });
    [[-0.8, 0.92, -1.0], [-0.8, 1.26, -1.0], [0.1, 0.92, -1.05], [0.85, 0.92, -0.95]].forEach(([x, y, z]) => g.add(K.at(K.box(0.55, 0.34, 0.4, foam), x, y, z)));
    const st = stool(K, K.M(0x2f5f8a)); st.position.set(0.3, 0, -0.55); g.add(st);
    // cột, mái che
    const post = K.M(0x3d5a4a, { metalness: 0.4 });
    [-1.25, 1.25].forEach((x) => g.add(K.at(K.box(0.08, 2.6, 0.08, post), x, 1.3, -1.35)));
    const aw = K.at(K.box(2.8, 0.04, 1.9, K.M(0x5f6a6c, { metalness: 0.5, roughness: 0.5 })), 0, 2.6, -0.4); aw.rotation.x = 0.16; g.add(aw);
    // công tắc trên cột
    g.add(K.at(K.box(0.08, 0.12, 0.03, K.M(0xe8e4d8)), 1.25, 1.4, -1.3));
    // cân đồng hồ
    const scale = new T.Group();
    scale.add(K.at(new T.Mesh(new T.CylinderGeometry(0.2, 0.2, 0.025, 20), K.M(0xb8bab6, { metalness: 0.7, roughness: 0.3 })), 0, 0.27, 0));
    scale.add(K.at(K.box(0.3, 0.22, 0.26, K.M(0xb03a2a)), 0, 0.11, 0));
    const dial = K.at(new T.Mesh(new T.CircleGeometry(0.12, 24), K.M(0xffffff, { map: dialTex(K) })), 0, 0.13, 0.131); scale.add(dial);
    const needle = new T.Group(); needle.position.set(0, 0.13, 0.135);
    needle.add(K.at(K.box(0.006, 0.1, 0.004, K.M(0xc01818, { emissive: 0x400000 })), 0, 0.045, 0)); scale.add(needle);
    scale.position.set(0.7, 1.01, 0.05); g.add(scale);
    // bóng đèn tròn trên quầy
    const bulb = bulbMesh(K); g.add(bulb);
    const cord = K.at(K.box(0.008, 1.6, 0.008, K.M(0x111)), 0, 0, 0); g.add(cord);
    const light = new T.PointLight(0xffc070, 1.5, 6, 1.5); g.add(light);
    const pivot = new T.Vector3(0, 3.9, 0.05), len = 1.7;
    // nền chợ tối phía sau: vài sạp, vài bóng đèn xa
    for (let i = 0; i < 5; i++) {
      const s = K.at(K.box(2.2, 0.9, 0.7, K.M(0x2a2420)), -6 + i * 3, 0.45, -6 - (i % 2) * 1.5); g.add(s);
      const fb = bulbMesh(K); fb.position.set(-6 + i * 3, 3.4, -5.5); fb.userData.mat.emissiveIntensity = 0.5; g.add(fb);
    }
    g.add(K.dust(160, 6, 3));
    return {
      group: g, fog: [0x07090b, 0.08], amb: 0.14, portraitPull: 1.35,
      cam: { pos: [0.3, 1.75, 4.6], look: [0, 1.45, -0.4], orbit: 0.006 },
      spots: { mi: [-1.85, 0, 0.75, 0.6], toan: [1.9, 0, 0.9, -0.55] },
      update(t) {
        const fx = K.fx, el = t - K.fxStart;
        let ang = 0;
        if (fx.has('swing') && !K.reduceMotion) ang = Math.sin(el * 4.2) * 0.45 * Math.exp(-el * 0.25);
        else if (!K.reduceMotion) ang = Math.sin(t * 0.8) * 0.02;
        const bx = pivot.x + Math.sin(ang) * len, by = pivot.y - Math.cos(ang) * len;
        bulb.position.set(bx, by, pivot.z);
        cord.position.set((pivot.x + bx) / 2, (pivot.y + by) / 2, pivot.z); cord.rotation.z = ang;
        light.position.set(bx, by - 0.1, pivot.z + 0.15);
        let lv = 1.5 + Math.sin(t * 6) * 0.05;
        if (fx.has('soft')) lv = 1.0 + Math.sin(t * 2) * 0.04;
        if (fx.has('lamp_relight')) lv = el < 1.3 ? 0 : 2.3 + Math.sin(t * 9) * 0.1;
        if (fx.has('owner')) lv = 2.0;
        light.intensity = lv; bulb.userData.mat.emissiveIntensity = lv === 0 ? 0.02 : lv * 0.95;
        needle.rotation.z = fx.has('owner') ? -Math.sin(t * 0.7) * 0.5 : fx.has('swing') ? -Math.abs(Math.sin(el * 5)) * 0.6 * Math.exp(-el * 0.4) : 0;
      }
    };
  }

  /* ================= PHÒNG BAN QUẢN LÝ ================= */
  function mapTex(K) {
    return K.canvasTex(1024, 640, (c, w, h) => {
      c.fillStyle = '#e6dab8'; c.fillRect(0, 0, w, h);
      c.fillStyle = '#2a251c'; c.font = `700 40px ${K.FONT}`; c.fillText('Sơ đồ chợ Sớm · 1998', 40, 64);
      const cw = 28, ch = 52;
      for (let r = 0; r < 6; r++) {
        c.font = `700 30px ${K.FONT}`; c.fillText('ABCDEF'[r], 20, 140 + r * 80);
        for (let i = 0; i < 31; i++) { c.strokeStyle = '#6a5a3a'; c.lineWidth = 2; c.strokeRect(60 + i * cw, 100 + r * 80, cw, ch); }
      }
      c.fillStyle = 'rgba(200,140,40,0.6)'; c.fillRect(60 + 15 * cw, 180, cw, ch);
      c.strokeStyle = '#6a5a3a'; for (let k = 0; k < 2; k++) { const x = 60 + (25 + k) * cw, y = 100 + 3 * 80; c.beginPath(); c.moveTo(x, y + ch); c.lineTo(x + cw, y); c.stroke(); }
      c.fillStyle = '#2a251c'; c.font = `500 26px ${K.FONT}`; c.fillText('186 ô', 60, 600);
    });
  }
  function ledgerTex(K) {
    return K.canvasTex(1024, 640, (c, w, h) => {
      c.fillStyle = '#f0e8d4'; c.fillRect(0, 0, w, h);
      c.fillStyle = 'rgba(0,0,0,0.12)'; c.fillRect(w / 2 - 6, 0, 12, h);
      c.strokeStyle = 'rgba(150,120,80,0.35)'; for (let y = 80; y < h; y += 40) { c.beginPath(); c.moveTo(20, y); c.lineTo(w - 20, y); c.stroke(); }
      c.fillStyle = '#26334a'; c.font = `500 26px ${K.FONT}`;
      ['Lô 180 · gạo · Tám', 'Lô 181 · bún · Út', 'Lô 182 · thịt · Sáu', 'Lô 183 · cá · Ba', 'Lô 184 · rau · Chín', 'Lô 185 · vải · Năm', 'Lô 186 · đồ khô · Bảy'].forEach((l, i) => c.fillText(l, 36, 72 + i * 40));
      c.fillStyle = '#6a2fa0'; c.font = `italic 600 27px ${K.FONT}`;
      ['Lô 187 · cân thuê', 'Lô 188 · chè đậu trắng', 'Lô 189 · đèn dầu'].forEach((l, i) => { c.fillText(l, w / 2 + 30, 72 + i * 40); c.font = `italic 500 20px ${K.FONT}`; c.fillText('ký nhận: Người giữ sổ', w / 2 + 300, 72 + i * 40); c.font = `italic 600 27px ${K.FONT}`; });
      c.fillStyle = '#8a2a1c'; c.font = `700 30px ${K.FONT}`; c.fillText('Tổng: 186 dòng · khớp sơ đồ', w / 2 + 30, 72 + 5 * 40);
    });
  }
  function buildBql(K) {
    const W = 5.2, D = 4.2, H = 2.9;
    const g = new T.Group();
    g.add(K.room({ w: W, d: D, h: H }));
    const wood = K.M(0x5b3e26);
    g.add(K.at(K.box(1.7, 0.06, 0.85, wood), 0, 0.76, -1.15));
    [[-0.8, -1.5], [0.8, -1.5], [-0.8, -0.8], [0.8, -0.8]].forEach(([x, z]) => g.add(K.at(K.box(0.06, 0.76, 0.06, wood), x, 0.38, z)));
    const book = K.at(new T.Mesh(new T.PlaneGeometry(0.8, 0.5), K.M(0xffffff, { map: ledgerTex(K), roughness: 0.95 })), -0.05, 0.795, -1.1); book.rotation.x = -Math.PI / 2; g.add(book);
    g.add(K.at(K.box(0.84, 0.03, 0.54, K.M(0x8a2a1c)), -0.05, 0.78, -1.1));
    const map = K.at(new T.Mesh(new T.PlaneGeometry(2.2, 1.38), K.M(0xffffff, { map: mapTex(K), roughness: 1 })), -0.7, 1.72, -D / 2 + 0.02); g.add(map);
    const ve = K.canvasTex(512, 320, (c, w, h) => { c.fillStyle = '#e8d8a8'; c.fillRect(0, 0, w, h); c.strokeStyle = '#8a2a1c'; c.lineWidth = 8; c.strokeRect(14, 14, w - 28, h - 28); c.fillStyle = '#5a2a1c'; c.textAlign = 'center'; c.font = `700 38px ${K.FONT}`; c.fillText('Vé thu phí · 1975', w / 2, 92); c.font = `500 30px ${K.FONT}`; c.fillText('Cân của chợ thì đừng', w / 2, 180); c.fillText('cân lại bằng tay.', w / 2, 226); });
    g.add(K.at(K.box(0.56, 0.38, 0.03, K.M(0x3a2414)), 1.45, 1.8, -D / 2 + 0.02));
    g.add(K.at(new T.Mesh(new T.PlaneGeometry(0.48, 0.3), K.M(0xffffff, { map: ve })), 1.45, 1.8, -D / 2 + 0.04));
    // quạt trần
    const fan = new T.Group();
    fan.add(K.at(new T.Mesh(new T.CylinderGeometry(0.08, 0.08, 0.1, 12), K.M(0x8a8a80, { metalness: 0.5 })), 0, 0, 0));
    for (let i = 0; i < 3; i++) { const b = K.at(K.box(0.62, 0.012, 0.12, K.M(0x6a5a40)), 0, -0.03, 0); b.position.x = Math.cos(i * 2.094) * 0.36; b.position.z = Math.sin(i * 2.094) * 0.36; b.rotation.y = -i * 2.094; fan.add(b); }
    fan.position.set(0, H - 0.35, -0.5); g.add(fan);
    g.add(K.at(K.box(0.015, 0.3, 0.015, K.M(0x222)), 0, H - 0.15, -0.5));
    // cửa kính nhìn xuống nhà lồng: những chấm đèn ấm
    const win = K.windowFrame(1.4, 1.0); win.position.set(-W / 2 + 0.02, 1.6, 0.3); win.rotation.y = Math.PI / 2; g.add(win);
    const hall = K.canvasTex(256, 192, (c, w, h) => { c.fillStyle = '#05070a'; c.fillRect(0, 0, w, h); for (let i = 0; i < 12; i++) { const x = 30 + i * 18, y = 70 + i * 4; c.fillStyle = `rgba(255,200,120,${0.9 - i * 0.06})`; c.beginPath(); c.arc(x, y, 3 - i * 0.15, 0, 7); c.fill(); } });
    const hm = K.at(new T.Mesh(new T.PlaneGeometry(1.38, 0.98), new T.MeshBasicMaterial({ map: hall })), -W / 2 + 0.035, 1.6, 0.3); hm.rotation.y = Math.PI / 2; g.add(hm);
    const lamp = K.at(new T.PointLight(0xfff0d0, 1.0, 6, 1.4), 0.2, 2.2, -0.6); g.add(lamp);
    g.add(K.dust(140, 4, H));
    return {
      group: g, fog: [0x0a0806, 0.06], amb: 0.24, portraitPull: 1.25,
      cam: { pos: [0.55, 1.75, 1.3], look: [-0.25, 1.05, -1.55], orbit: 0.005 },
      spots: { toan: [1.5, 0, -1.55, -0.3] },
      update(t, dt) {
        fan.rotation.y += dt * (K.fx.has('fan') ? 2.4 : 0);
        lamp.intensity = 0.95 + Math.sin(t * 7) * 0.04;
      }
    };
  }

  Scene3D.register({
    ambience: 'market',
    torch: (S) => (S.TT < 30 ? 3 : 6),
    views: {
      trungtam: { label: 'Phòng hồ sơ · Trung tâm', build: buildTrungtam },
      nhalong: { label: 'Nhà lồng chợ Sớm', build: buildNhalong },
      sap47: { label: 'Sạp 47', build: buildSap47 },
      bql: { label: 'Phòng ban quản lý chợ', build: buildBql }
    },
    figures: {
      hai: { name: 'Bà Hai', shirt: 0x7a3040, pants: 0x1d1d22, hair: 0xb8b2a6, stoop: true, skin: 0xc89670 },
      toan: { name: 'Anh Toàn', shirt: 0x7a98b8, pants: 0x2a2a30 },
      mi: { name: 'Mi', shirt: 0x2fa860, pants: 0x222226, helmet: true, phone: true },
      hue: { name: 'Bà Huệ', shirt: 0x5a7050, pants: 0x1d1d22, hair: 0xc8c2b6, stoop: true, skin: 0xc89670 }
    }
  });
})();
