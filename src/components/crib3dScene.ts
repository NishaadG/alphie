import * as THREE from "three";

// Builds a tiny low-poly scene: Alphie (spheres + a sigma-pink pacifier),
// crib bars, and a spinning mobile. No external models or textures.
export function mountCrib(host: HTMLElement, night: boolean) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.set(0, 2.2, 7);
  camera.lookAt(0, 1, 0);

  const hemi = new THREE.HemisphereLight(0xffffff, 0xffd9c2, 1.2);
  const sun = new THREE.DirectionalLight(0xffffff, 1.4);
  sun.position.set(3, 6, 4);
  scene.add(hemi, sun);

  const mat = (color: number) => new THREE.MeshStandardMaterial({ color, roughness: 0.7, flatShading: true });
  const skin = mat(0xffd9c2);
  const ink = mat(0x5c4033);
  const berry = mat(0xa34063);

  const world = new THREE.Group();
  scene.add(world);

  // crib
  const wood = mat(0xf3e4d7);
  const base = new THREE.Mesh(new THREE.BoxGeometry(4, 0.2, 2.4), wood);
  world.add(base);
  const mattress = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.25, 2.2), mat(0xcfe6ff));
  mattress.position.y = 0.22;
  world.add(mattress);
  for (const z of [-1.15, 1.15]) {
    for (let i = 0; i <= 10; i++) {
      const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.3, 6), wood);
      bar.position.set(-1.9 + i * 0.38, 0.75, z);
      world.add(bar);
    }
    const rail = new THREE.Mesh(new THREE.BoxGeometry(4, 0.12, 0.12), berry);
    rail.position.set(0, 1.4, z);
    world.add(rail);
  }

  // Alphie
  const alphie = new THREE.Group();
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.62, 12, 10), mat(0xcfe6ff));
  body.scale.set(1, 0.9, 0.85);
  body.position.y = 0.85;
  const head = new THREE.Mesh(new THREE.IcosahedronGeometry(0.62, 1), skin);
  head.position.y = 1.85;
  const eyeGeo = new THREE.SphereGeometry(0.09, 8, 6);
  const eyeL = new THREE.Mesh(eyeGeo, ink);
  eyeL.position.set(-0.22, 1.92, 0.55);
  const eyeR = eyeL.clone();
  eyeR.position.x = 0.22;
  const paci = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.05, 6, 12), berry);
  paci.position.set(0, 1.65, 0.6);
  const curl = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.035, 6, 10, Math.PI * 1.5), ink);
  curl.position.set(0.05, 2.5, 0);
  curl.rotation.z = 0.6;
  const earGeo = new THREE.SphereGeometry(0.14, 8, 6);
  const earL = new THREE.Mesh(earGeo, skin);
  earL.position.set(-0.62, 1.85, 0);
  const earR = earL.clone();
  earR.position.x = 0.62;
  alphie.add(body, head, eyeL, eyeR, paci, curl, earL, earR);
  alphie.position.y = 0.3;
  world.add(alphie);

  // Beta the teddy
  const beta = new THREE.Group();
  const brown = mat(0x9b6b4a);
  const tb = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 6), brown);
  tb.position.y = 0.6;
  const th = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 6), brown);
  th.position.y = 1.0;
  for (const x of [-0.16, 0.16]) {
    const ear = new THREE.Mesh(new THREE.SphereGeometry(0.08, 6, 4), brown);
    ear.position.set(x, 1.18, 0);
    beta.add(ear);
  }
  beta.add(tb, th);
  beta.position.set(1.2, 0, 0.3);
  beta.rotation.y = -0.5;
  world.add(beta);

  // mobile
  const mobile = new THREE.Group();
  mobile.position.y = 3.6;
  const toyColors = [0xffd166, 0x2f9e6b, 0xd1495b, 0x7a5fc0, 0x5cc8ff];
  toyColors.forEach((c, i) => {
    const a = (i / toyColors.length) * Math.PI * 2;
    const len = 0.4 + (i % 3) * 0.25;
    const string = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, len, 4), ink);
    string.position.set(Math.cos(a) * 0.9, -len / 2, Math.sin(a) * 0.9);
    const toy = new THREE.Mesh(i % 2 ? new THREE.OctahedronGeometry(0.18) : new THREE.TetrahedronGeometry(0.22), mat(c));
    toy.position.set(Math.cos(a) * 0.9, -len - 0.15, Math.sin(a) * 0.9);
    mobile.add(string, toy);
  });
  const arm = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.03, 6, 24), berry);
  arm.rotation.x = Math.PI / 2;
  mobile.add(arm);
  world.add(mobile);

  // stars for night mode
  const starGeo = new THREE.BufferGeometry();
  const pts: number[] = [];
  for (let i = 0; i < 120; i++) pts.push((Math.random() - 0.5) * 16, Math.random() * 7, -4 - Math.random() * 4);
  starGeo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
  const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xfff1a8, size: 0.06 }));
  scene.add(stars);

  const setNight = (n: boolean) => {
    hemi.intensity = n ? 0.5 : 1.2;
    sun.intensity = n ? 0.4 : 1.4;
    sun.color.set(n ? 0x9fb4ff : 0xffffff);
    stars.visible = n;
  };
  setNight(night);

  // drag to spin
  let spin = 0.4;
  let vel = 0.004;
  let dragX: number | null = null;
  const el = renderer.domElement;
  el.style.touchAction = "pan-y";
  const down = (e: PointerEvent) => {
    dragX = e.clientX;
    el.setPointerCapture(e.pointerId);
  };
  const move = (e: PointerEvent) => {
    if (dragX === null) return;
    const dx = e.clientX - dragX;
    dragX = e.clientX;
    spin += dx * 0.01;
    vel = dx * 0.001;
  };
  const up = () => {
    dragX = null;
  };
  el.addEventListener("pointerdown", down);
  el.addEventListener("pointermove", move);
  el.addEventListener("pointerup", up);
  el.addEventListener("pointercancel", up);

  const resize = () => {
    const w = host.clientWidth;
    const h = host.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(host);
  resize();

  // Only render while visible on screen.
  let visible = true;
  const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
  io.observe(host);

  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const clock = new THREE.Clock();
  renderer.setAnimationLoop(() => {
    if (!visible) return;
    const t = clock.getElapsedTime();
    if (dragX === null && !reduced) {
      spin += vel;
      vel += (0.004 - vel) * 0.02;
    }
    world.rotation.y = spin;
    mobile.rotation.y = reduced ? 0 : t * 0.5;
    alphie.position.y = 0.3 + (reduced ? 0 : Math.sin(t * 2) * 0.04);
    head.rotation.z = reduced ? 0 : Math.sin(t * 1.3) * 0.08;
    renderer.render(scene, camera);
  });

  return {
    setNight,
    dispose() {
      renderer.setAnimationLoop(null);
      ro.disconnect();
      io.disconnect();
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh || o instanceof THREE.Points) {
          o.geometry.dispose();
          (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose());
        }
      });
      renderer.dispose();
      el.remove();
    },
  };
}
