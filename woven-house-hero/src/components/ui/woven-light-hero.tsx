"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// ============================================================
//  WovenLightHero — text-free, fully interactive.
//  The house is drawn as woven light: a glowing wireframe laced
//  with luminous, color-coded plumbing and a particle "silk".
//  Hover to disturb the weave (it springs back); the whole
//  structure parallax-tilts toward your cursor. Drag to orbit.
// ============================================================
export const WovenLightHero = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      <HouseCanvas />
      {/* cinematic vignette (part of the design, not text) */}
      <div className="pointer-events-none absolute inset-0 z-[5] bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.65)_100%)]" />
    </div>
  );
};

const HouseCanvas = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = () => mount.clientWidth || window.innerWidth;
    const H = () => mount.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(46, W() / H(), 0.1, 1000);
    camera.position.set(36, 23, 44);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W(), H());
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.minDistance = 24;
    controls.maxDistance = 90;
    controls.maxPolarAngle = Math.PI * 0.49;
    controls.autoRotate = false; // the group spins itself + parallax handles motion
    controls.target.set(0, 12.5, 0);

    // ---- soft round sprite for particles ----
    const dotTex = (() => {
      const c = document.createElement("canvas");
      c.width = c.height = 64;
      const g = c.getContext("2d")!;
      const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      grd.addColorStop(0, "rgba(255,255,255,1)");
      grd.addColorStop(0.35, "rgba(255,255,255,0.85)");
      grd.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = grd;
      g.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(c);
    })();

    // ---- geometry constants (feet-ish) ----
    const Y = { base: 0, f1: 8, f2: 16, ceil: 24, ridge: 31 };
    const SX = 5, SZ = 5; // soil/vent stack location

    const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

    const C = {
      cold: new THREE.Color("#3b9bff"),
      hot: new THREE.Color("#ff5a5a"),
      drain: new THREE.Color("#e6ad55"),
      vent: new THREE.Color("#a9b8cc"),
      frame: new THREE.Color("#7fc4ff"),
    };

    const house = new THREE.Group();
    house.position.y = 0;
    scene.add(house);

    // ---------- glowing pipe builder ----------
    const glowPipe = (a: THREE.Vector3, b: THREE.Vector3, r: number, color: THREE.Color) => {
      const dir = new THREE.Vector3().subVectors(b, a);
      const len = dir.length();
      if (len < 1e-4) return;
      const geo = new THREE.CylinderGeometry(r, r, len, 12, 1, true);
      const mat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      const m = new THREE.Mesh(geo, mat);
      m.position.copy(a).add(b).multiplyScalar(0.5);
      m.quaternion.setFromUnitVectors(V(0, 1, 0), dir.normalize());
      house.add(m);
    };
    const glowRun = (pts: THREE.Vector3[], r: number, color: THREE.Color) => {
      for (let i = 0; i < pts.length - 1; i++) glowPipe(pts[i], pts[i + 1], r, color);
    };

    // ---------- plumbing routes (also feed the particle weave) ----------
    type Path = { pts: THREE.Vector3[]; r: number; color: THREE.Color };
    const paths: Path[] = [];
    const P = (pts: THREE.Vector3[], r: number, color: THREE.Color) => {
      paths.push({ pts, r, color });
      glowRun(pts, r, color);
    };

    // soil / waste stack + building drain + vent
    const stackBottom = V(SX, Y.base + 0.6, SZ);
    const ventSplit = V(SX, Y.f2 + 3, SZ);
    const ventTop = V(SX, Y.ridge + 2, SZ);
    P([stackBottom, ventSplit], 0.34, C.drain);
    P([ventSplit, ventTop], 0.28, C.vent);
    P(
      [stackBottom, V(SX, Y.base + 0.5, SZ), V(SX, Y.base + 0.5, -10), V(SX, Y.base + 0.4, -22)],
      0.34,
      C.drain
    );

    // branch drains for both bath floors
    const branch = (fx: number, fz: number, fy: number) => {
      P(
        [V(fx, fy + 0.6, fz), V(fx, fy + 0.2, fz), V(fx, fy + 0.2, fz + 0.5), V(fx, fy + 0.5, fz + 0.5)],
        0.16,
        C.drain
      );
      P([V(fx, fy + 0.5, fz + 0.5), V(SX, fy + 0.4, fz + 0.5), V(SX, fy + 0.4, SZ)], 0.2, C.drain);
    };
    [Y.f1, Y.f2].forEach((fy) => {
      branch(7.5, 9, fy); // tub
      branch(2.5, 6, fy); // toilet
      branch(7.5, 3, fy); // lav
    });
    P([V(-7, Y.f1 + 0.5, 8), V(SX, Y.f1 + 0.2, 8), V(SX, Y.f1 + 0.2, SZ)], 0.2, C.drain); // kitchen

    // cold supply: street main -> riser -> fixtures
    const CX = -6, CZ = 4;
    P([V(CX, 1, -22), V(CX, 1, -13), V(CX, 1, CZ), V(CX, Y.f2 + 1, CZ)], 0.13, C.cold);
    P([V(CX, 1, CZ), V(CX, 1, -6), V(CX, Y.base + 5, -6)], 0.13, C.cold); // to heater
    const coldBranch = (fy: number, targets: [number, number][]) =>
      targets.forEach(([x, z]) =>
        P([V(CX, fy + 1, CZ), V(x, fy + 1, CZ), V(x, fy + 1, z)], 0.1, C.cold)
      );
    coldBranch(Y.f2, [[7.5, 3], [7.5, 9], [2.5, 6]]);
    coldBranch(Y.f1, [[7.5, 3], [7.5, 9], [2.5, 6], [-7, 8]]);

    // hot supply: heater -> riser -> fixtures
    const HX = -7.4, HZ = 4;
    P(
      [V(-6, Y.base + 5.2, -6), V(HX, Y.base + 5.2, -6), V(HX, Y.base + 5.2, HZ), V(HX, Y.f2 + 1, HZ)],
      0.12,
      C.hot
    );
    const hotBranch = (fy: number, targets: [number, number][]) =>
      targets.forEach(([x, z]) =>
        P([V(HX, fy + 1, HZ), V(x, fy + 1, HZ), V(x, fy + 1, z)], 0.09, C.hot)
      );
    hotBranch(Y.f2, [[7.6, 3], [7.6, 9]]);
    hotBranch(Y.f1, [[7.6, 3], [7.6, 9], [-7.1, 8]]);

    // ---------- glowing structural wireframe ----------
    const lineMat = new THREE.LineBasicMaterial({
      color: C.frame,
      transparent: true,
      opacity: 0.42,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const linePts: number[] = [];
    const edge = (a: THREE.Vector3, b: THREE.Vector3) => linePts.push(a.x, a.y, a.z, b.x, b.y, b.z);
    const loop = (corners: THREE.Vector3[]) => {
      for (let i = 0; i < corners.length; i++) edge(corners[i], corners[(i + 1) % corners.length]);
    };
    const hw = 11, hd = 13;
    [Y.base, Y.f1, Y.f2, Y.ceil].forEach((y) =>
      loop([V(-hw, y, -hd), V(hw, y, -hd), V(hw, y, hd), V(-hw, y, hd)])
    );
    [[-hw, -hd], [hw, -hd], [hw, hd], [-hw, hd]].forEach(([x, z]) =>
      edge(V(x, Y.base, z), V(x, Y.ceil, z))
    );
    // gable roof
    edge(V(0, Y.ridge, hd), V(0, Y.ridge, -hd)); // ridge
    [hd, -hd].forEach((z) => {
      edge(V(-hw, Y.ceil, z), V(0, Y.ridge, z));
      edge(V(hw, Y.ceil, z), V(0, Y.ridge, z));
    });

    // fixtures as faint wire boxes
    const fixtureBox = (cx: number, cy: number, cz: number, w: number, h: number, d: number) => {
      const x0 = cx - w / 2, x1 = cx + w / 2, y0 = cy, y1 = cy + h, z0 = cz - d / 2, z1 = cz + d / 2;
      const c = [
        V(x0, y0, z0), V(x1, y0, z0), V(x1, y0, z1), V(x0, y0, z1),
        V(x0, y1, z0), V(x1, y1, z0), V(x1, y1, z1), V(x0, y1, z1),
      ];
      loop([c[0], c[1], c[2], c[3]]);
      loop([c[4], c[5], c[6], c[7]]);
      for (let i = 0; i < 4; i++) edge(c[i], c[i + 4]);
    };
    [Y.f1, Y.f2].forEach((fy) => {
      fixtureBox(2.5, fy, 6, 1.5, 1.6, 1.4); // toilet
      fixtureBox(7.5, fy, 9, 4.2, 1.4, 2.4); // tub
      fixtureBox(7.5, fy, 3, 1.4, 2.6, 1.4); // lav
    });
    fixtureBox(-7, Y.f1, 8, 1.6, 2.6, 1.6); // kitchen sink
    fixtureBox(-6, Y.base, -6.75, 3, 5.2, 3); // water heater

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(linePts, 3));
    house.add(new THREE.LineSegments(lineGeo, lineMat));

    // ---------- particle weave ----------
    const wPos: number[] = [];
    const wCol: number[] = [];
    const pushPt = (p: THREE.Vector3, col: THREE.Color, lightJitter: number) => {
      const c = col.clone();
      const hsl = { h: 0, s: 0, l: 0 };
      c.getHSL(hsl);
      c.setHSL(hsl.h, hsl.s, Math.min(1, hsl.l + (Math.random() - 0.5) * lightJitter));
      wPos.push(p.x, p.y, p.z);
      wCol.push(c.r, c.g, c.b);
    };
    paths.forEach(({ pts, color }) => {
      for (let i = 0; i < pts.length - 1; i++) {
        const a = pts[i], b = pts[i + 1];
        const len = a.distanceTo(b);
        const n = Math.max(3, Math.floor(len * 16));
        for (let k = 0; k <= n; k++) {
          const p = new THREE.Vector3().lerpVectors(a, b, k / n);
          p.x += (Math.random() - 0.5) * 0.14;
          p.y += (Math.random() - 0.5) * 0.14;
          p.z += (Math.random() - 0.5) * 0.14;
          pushPt(p, color, 0.3);
        }
      }
    });
    for (let i = 0; i < linePts.length; i += 6) {
      const a = V(linePts[i], linePts[i + 1], linePts[i + 2]);
      const b = V(linePts[i + 3], linePts[i + 4], linePts[i + 5]);
      const len = a.distanceTo(b);
      const n = Math.max(2, Math.floor(len * 2.6));
      for (let k = 0; k <= n; k++) {
        const p = new THREE.Vector3().lerpVectors(a, b, k / n);
        p.x += (Math.random() - 0.5) * 0.1;
        p.y += (Math.random() - 0.5) * 0.1;
        p.z += (Math.random() - 0.5) * 0.1;
        pushPt(p, C.frame, 0.25);
      }
    }
    // stray silk halo
    for (let i = 0; i < 5000; i++) {
      const p = V((Math.random() - 0.5) * 32, Math.random() * 33, (Math.random() - 0.5) * 36);
      const c = new THREE.Color().setHSL(Math.random(), 0.7, 0.55);
      wPos.push(p.x, p.y, p.z);
      wCol.push(c.r, c.g, c.b);
    }

    const count = wPos.length / 3;
    const positions = new Float32Array(wPos);
    const original = Float32Array.from(positions);
    const velocities = new Float32Array(count * 3);
    const colors = new Float32Array(wCol);

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const pMat = new THREE.PointsMaterial({
      size: 0.28,
      map: dotTex,
      vertexColors: true,
      transparent: true,
      opacity: 1.0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    const points = new THREE.Points(pGeo, pMat);
    house.add(points);

    // ---------- pointer state ----------
    const pointer = new THREE.Vector2(0, 0);
    const targetTilt = new THREE.Vector2(0, 0);
    let pointerActive = false;
    const raycaster = new THREE.Raycaster();
    const dragPlane = new THREE.Plane();
    const planeNormal = new THREE.Vector3();
    const worldPointer = new THREE.Vector3(9999, 9999, 9999);

    const onMove = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      targetTilt.set(pointer.x, pointer.y);
      pointerActive = true;
    };
    const onLeave = () => {
      pointerActive = false;
      targetTilt.set(0, 0);
    };
    renderer.domElement.addEventListener("pointermove", onMove);
    renderer.domElement.addEventListener("pointerleave", onLeave);

    // ---------- render loop ----------
    let raf = 0;
    const clock = new THREE.Clock();
    const tmpInv = new THREE.Matrix4();
    const localPointer = new THREE.Vector3();
    const lerp = THREE.MathUtils.lerp;

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // --- motion: idle spin + parallax tilt toward cursor ---
      house.rotation.y += 0.0016;
      house.rotation.x = lerp(house.rotation.x, -targetTilt.y * 0.14, 0.05);
      house.rotation.z = lerp(house.rotation.z, targetTilt.x * 0.10, 0.05);
      house.updateWorldMatrix(true, false);

      // gentle twinkle
      pMat.size = 0.26 + Math.sin(t * 1.4) * 0.035;

      // --- world-space pointer on a camera-facing plane through center ---
      if (pointerActive) {
        camera.getWorldDirection(planeNormal);
        dragPlane.setFromNormalAndCoplanarPoint(planeNormal, controls.target);
        raycaster.setFromCamera(pointer, camera);
        if (!raycaster.ray.intersectPlane(dragPlane, worldPointer)) {
          worldPointer.set(9999, 9999, 9999);
        }
      } else {
        worldPointer.set(9999, 9999, 9999);
      }

      // pointer is world-space; particles live in house-local space
      tmpInv.copy(house.matrixWorld).invert();
      localPointer.copy(worldPointer).applyMatrix4(tmpInv);
      const mx = localPointer.x, my = localPointer.y, mz = localPointer.z;

      const R = 5.2, R2 = R * R;
      for (let i = 0; i < count; i++) {
        const ix = i * 3, iy = ix + 1, iz = ix + 2;

        // spring back to origin
        velocities[ix] += (original[ix] - positions[ix]) * 0.011;
        velocities[iy] += (original[iy] - positions[iy]) * 0.011;
        velocities[iz] += (original[iz] - positions[iz]) * 0.011;

        // repel from cursor
        const dx = positions[ix] - mx;
        const dy = positions[iy] - my;
        const dz = positions[iz] - mz;
        const d2 = dx * dx + dy * dy + dz * dz;
        if (d2 < R2) {
          const d = Math.sqrt(d2) + 0.001;
          const f = ((R - d) / R) * 0.45 / d;
          velocities[ix] += dx * f;
          velocities[iy] += dy * f;
          velocities[iz] += dz * f;
        }

        // damp + integrate
        velocities[ix] *= 0.91;
        velocities[iy] *= 0.91;
        velocities[iz] *= 0.91;
        positions[ix] += velocities[ix];
        positions[iy] += velocities[iy];
        positions[iz] += velocities[iz];
      }
      pGeo.attributes.position.needsUpdate = true;

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // ---------- resize ----------
    const onResize = () => {
      camera.aspect = W() / H();
      camera.updateProjectionMatrix();
      renderer.setSize(W(), H());
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);
    window.addEventListener("resize", onResize);

    // ---------- cleanup ----------
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", onResize);
      renderer.domElement.removeEventListener("pointermove", onMove);
      renderer.domElement.removeEventListener("pointerleave", onLeave);
      controls.dispose();
      renderer.dispose();
      dotTex.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0" />;
};
