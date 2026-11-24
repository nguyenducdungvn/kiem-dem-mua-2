/* =========================================================
   Âm thanh tự tạo bằng WebAudio, không cần file âm thanh (dùng chung các mùa).
   SFX.unlock() phải được gọi trong một lần bấm của người chơi.
   SFX.play('loa' | 'loa_click' | 'scrape' | 'scrape_far' | 'tick' | 'tickfast' |
            'heart' | 'thud' | 'door' | 'phone' | 'click' | 'sting' | 'warn' |
            'water' | 'oar' | 'bell' | 'crumble' | 'splash')
   SFX.setAmbience('building' | 'river'): tiếng nền ngẫu nhiên (kẽo kẹt nhà cũ hoặc nước vỗ bờ)
   ========================================================= */
(function () {
  'use strict';
  const AC = window.AudioContext || window.webkitAudioContext;
  let ctx = null, master = null, amb = null, noiseBuf = null;
  const MUTE_KEY = ((window.GAME_CONFIG && GAME_CONFIG.season && GAME_CONFIG.season.key) || 'kd') + '_mute';
  let muted = false, ambience = 'building';
  try { muted = localStorage.getItem(MUTE_KEY) === '1'; } catch (e) { /* bỏ qua */ }
  const loops = [];

  function unlock() {
    if (!AC) return;
    if (!ctx) {
      ctx = new AC();
      master = ctx.createGain(); master.gain.value = muted ? 0 : 0.9; master.connect(ctx.destination);
      noiseBuf = makeNoise();
      ambient();
    }
    if (ctx.state === 'suspended') ctx.resume();
  }

  function makeNoise() {
    const len = ctx.sampleRate * 3, b = ctx.createBuffer(1, len, ctx.sampleRate), d = b.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) { const w = Math.random() * 2 - 1; last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5; }
    return b;
  }
  function noise(dur, gainVal, freq, q, when, type) {
    const t = when || ctx.currentTime;
    const src = ctx.createBufferSource(); src.buffer = noiseBuf; src.loop = true;
    const f = ctx.createBiquadFilter(); f.type = type || 'bandpass'; f.frequency.value = freq; f.Q.value = q || 1;
    const g = ctx.createGain(); g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(gainVal, t + Math.min(0.08, dur / 4));
    g.gain.linearRampToValueAtTime(0, t + dur);
    src.connect(f).connect(g).connect(master);
    src.start(t, Math.random() * 2); src.stop(t + dur + 0.05);
    return { f, g, t };
  }
  function tone(freq, dur, gainVal, type, when, glideTo) {
    const t = when || ctx.currentTime;
    const o = ctx.createOscillator(); o.type = type || 'sine'; o.frequency.setValueAtTime(freq, t);
    if (glideTo) o.frequency.exponentialRampToValueAtTime(glideTo, t + dur);
    const g = ctx.createGain(); g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(gainVal, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(master); o.start(t); o.stop(t + dur + 0.05);
    return o;
  }

  function ambient() {
    const src = ctx.createBufferSource(); src.buffer = noiseBuf; src.loop = true;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 320;
    const g = ctx.createGain(); g.gain.value = 0.16;
    src.connect(lp).connect(g).connect(master); src.start();
    const hum = ctx.createOscillator(); hum.frequency.value = 50; const hg = ctx.createGain(); hg.gain.value = 0.025;
    hum.connect(hg).connect(master); hum.start();
    amb = { g };
    // tiếng nền ngẫu nhiên: kẽo kẹt nhà cũ, hoặc nước vỗ bờ
    setInterval(() => {
      if (!ctx || muted || mood === 'dawn') return;
      if (ambience === 'river') { if (Math.random() < 0.6) lap(0.05); } else if (Math.random() < 0.35) creak(0.04);
    }, 5000);
  }
  function creak(v) {
    const t = ctx.currentTime;
    const o = tone(90 + Math.random() * 60, 0.9, v, 'sawtooth', t, 70 + Math.random() * 40);
    return o;
  }

  function lap(v) {
    const t = ctx.currentTime;
    for (let i = 0; i < 3; i++) { const n = noise(0.9, v * (1 - i * 0.25), 500 + Math.random() * 300, 0.9, t + i * 0.55 + Math.random() * 0.2, 'lowpass'); n.f.frequency.linearRampToValueAtTime(220, n.t + 0.8); }
  }

  function clearLoops() { while (loops.length) clearInterval(loops.pop()); }

  const BANK = {
    click() { tone(1800, 0.04, 0.05, 'square'); },
    warn() { tone(880, 0.08, 0.06, 'square'); },
    sting() { const t = ctx.currentTime; [220, 233, 311].forEach((f, i) => tone(f, 2.2, 0.06, 'sawtooth', t + i * 0.02)); noise(1.6, 0.25, 300, 0.7, t); },
    loa_click() { const t = ctx.currentTime; tone(120, 0.06, 0.15, 'square', t); noise(0.5, 0.18, 2200, 3, t + 0.05); },
    loa() {
      // nhạc hiệu kèn méo qua loa phường
      BANK.loa_click();
      const t = ctx.currentTime + 0.6;
      const notes = [392, 523, 494, 440, 392, 330, 392];
      const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1400; bp.Q.value = 1.2;
      const ws = ctx.createWaveShaper(); const curve = new Float32Array(256);
      for (let i = 0; i < 256; i++) { const x = i / 128 - 1; curve[i] = Math.tanh(x * 3); } ws.curve = curve;
      const g = ctx.createGain(); g.gain.value = 0.12;
      bp.connect(ws).connect(g).connect(master);
      notes.forEach((f, i) => {
        const o = ctx.createOscillator(); o.type = 'sawtooth';
        const st = t + i * 0.42; o.frequency.setValueAtTime(f * 0.985, st); o.frequency.linearRampToValueAtTime(f * (0.97 + Math.random() * 0.02), st + 0.4);
        const og = ctx.createGain(); og.gain.setValueAtTime(0, st); og.gain.linearRampToValueAtTime(1, st + 0.05); og.gain.linearRampToValueAtTime(0, st + 0.4);
        o.connect(og).connect(bp); o.start(st); o.stop(st + 0.45);
      });
      noise(3.4, 0.05, 2500, 2, t);
    },
    scrape() { const t = ctx.currentTime; for (let i = 0; i < 3; i++) { const n = noise(1.3, 0.35, 180, 2, t + i * 1.1); n.f.frequency.linearRampToValueAtTime(420, n.t + 1.2); } },
    scrape_far() { const t = ctx.currentTime; const n = noise(1.6, 0.12, 160, 2, t + 0.3); n.f.frequency.linearRampToValueAtTime(300, n.t + 1.5); },
    tick() { clearLoops(); let k = 0; loops.push(setInterval(() => { if (k++ > 9) return clearLoops(); tone(k % 2 ? 2400 : 2000, 0.03, 0.06, 'square'); }, 520)); },
    tickfast() { clearLoops(); let k = 0; loops.push(setInterval(() => { if (k++ > 40) return clearLoops(); tone(2400, 0.025, 0.07, 'square'); }, 140)); },
    heart() { const t = ctx.currentTime; for (let i = 0; i < 6; i++) { tone(55, 0.18, 0.35, 'sine', t + i * 0.85); tone(50, 0.16, 0.25, 'sine', t + i * 0.85 + 0.22); } },
    thud() { const t = ctx.currentTime; tone(70, 0.5, 0.5, 'sine', t, 40); noise(0.35, 0.4, 400, 0.8, t, 'lowpass'); },
    door() { const t = ctx.currentTime; tone(140, 1.2, 0.07, 'sawtooth', t, 95); tone(210, 1.0, 0.04, 'triangle', t + 0.1, 150); },
    water() { lap(0.16); },
    splash() { const t = ctx.currentTime; noise(0.7, 0.4, 900, 0.7, t, 'lowpass'); tone(90, 0.4, 0.2, 'sine', t, 50); },
    oar() { const t = ctx.currentTime; for (let i = 0; i < 3; i++) { const n = noise(0.6, 0.18, 700, 1.2, t + i * 1.2); n.f.frequency.linearRampToValueAtTime(300, n.t + 0.55); tone(180, 0.25, 0.03, 'triangle', t + i * 1.2 + 0.5, 140); } },
    bell() { const t = ctx.currentTime; for (let i = 0; i < 3; i++) { [523, 1290, 2010].forEach((f, j) => tone(f, 2.4, 0.07 / (j + 1), 'sine', t + i * 1.4)); } },
    crumble() { const t = ctx.currentTime; tone(48, 1.6, 0.45, 'sine', t, 30); noise(2.2, 0.45, 260, 0.6, t, 'lowpass'); noise(1.2, 0.3, 900, 0.8, t + 0.9, 'lowpass'); },
    phone() { const t = ctx.currentTime; for (let i = 0; i < 3; i++) { tone(160, 0.35, 0.18, 'square', t + i * 0.6); } }
  };

  function play(name) {
    if (!ctx || muted || !BANK[name]) return;
    try { BANK[name](); } catch (e) { /* bỏ qua lỗi âm thanh */ }
  }
  /* ---------- Nhạc nền theo màn: night (đêm) · tense (căng thẳng) · dawn (bình minh) ---------- */
  let mood = null, moodNodes = [];
  const CHORDS = {
    night: [[110, 130.8, 164.8], [98, 116.5, 146.8]],          // La thứ, Sol thứ: trầm, lạnh
    tense: [[103.8, 110, 155.6], [116.5, 123.5, 174.6]],        // quãng nửa cung chồng nhau
    dawn: [[130.8, 164.8, 196], [146.8, 185, 220], [174.6, 220, 261.6]] // Đô trưởng, Rê trưởng, Fa trưởng
  };
  function setMood(name) {
    if (!ctx || name === mood) return;
    mood = name;
    const t = ctx.currentTime;
    moodNodes.forEach((n) => { try { n.g.gain.cancelScheduledValues(t); n.g.gain.setValueAtTime(n.g.gain.value, t); n.g.gain.linearRampToValueAtTime(0, t + 3); n.o.forEach((o) => o.stop(t + 3.2)); } catch (e) { /* bỏ qua */ } });
    moodNodes = [];
    if (amb) amb.g.gain.linearRampToValueAtTime(name === 'dawn' ? 0.05 : name === 'tense' ? 0.2 : 0.16, t + 3);
    const chords = CHORDS[name]; if (!chords) return;
    const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(name === 'dawn' ? 0.05 : 0.03, t + 4);
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = name === 'dawn' ? 1400 : 700;
    const lfo = ctx.createOscillator(); lfo.frequency.value = name === 'tense' ? 0.35 : 0.08;
    const lfoG = ctx.createGain(); lfoG.gain.value = name === 'dawn' ? 300 : 200; lfo.connect(lfoG).connect(lp.frequency);
    lp.connect(g).connect(master);
    const oscs = [lfo];
    const voices = chords[0].map(() => { const o = ctx.createOscillator(); o.type = name === 'dawn' ? 'triangle' : 'sawtooth'; o.connect(lp); o.start(); oscs.push(o); return o; });
    lfo.start();
    let step = 0;
    const apply = () => { const c = chords[step % chords.length]; voices.forEach((o, i) => o.frequency.setTargetAtTime(c[i] * (name === 'tense' ? 1 + Math.random() * 0.004 : 1), ctx.currentTime, 1.5)); step++; };
    apply();
    const iv = setInterval(() => { if (mood !== name) return clearInterval(iv); apply(); }, name === 'dawn' ? 6000 : 9000);
    moodNodes.push({ g, o: oscs });
  }

  function setMuted(m) {
    muted = m;
    try { localStorage.setItem(MUTE_KEY, m ? '1' : '0'); } catch (e) { /* bỏ qua */ }
    if (master) master.gain.value = m ? 0 : 0.9;
    if (m) clearLoops();
  }

  window.SFX = { unlock, play, setMuted, setMood, setAmbience: (a) => { ambience = a; }, isMuted: () => muted, stopLoops: clearLoops };
})();
