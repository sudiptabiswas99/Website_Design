"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";

// ============================================================
//  WovenLightHero — text-free background.
//  The original "woven silk": 50,000 particles bound to a
//  torus-knot, rainbow-tinted, slowly rotating, and repelled
//  by the cursor (they spring back to their woven positions).
//
//  Hardened for Safari/WebKit:
//   • soft round point-sprite (no hard-square shimmer)
//   • scalar physics loop + squared-distance early-out (cheap)
//   • DPR capped at 1.5 (Retina fill-rate headroom)
//   • pointer events (trackpad / touch / pen) not just mousemove
//   • WebGL context-loss recovery (Safari drops it aggressively)
//   • render loop pauses when the tab is hidden
// ============================================================
export const WovenLightHero = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-white">
      <WovenCanvas />
    </div>
  );
};

const WovenCanvas = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const w = () => mount.clientWidth || window.innerWidth;
    const h = () => mount.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, w() / h(), 0.1, 1000);
    camera.position.z = 5.4; // a touch more margin so the whole knot is in frame

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance", // ask Safari for the better GPU
      failIfMajorPerformanceCaveat: false,
    });
    renderer.setClearColor(0xffffff, 1); // white canvas — NormalBlending composites over white
    renderer.setSize(w(), h());
    // Cap pixel ratio: a full-screen Retina canvas at DPR 2 is ~78% more
    // pixels to fill than 1.5 — Safari throttles hardest here on battery.
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    const canvas = renderer.domElement;
    mount.appendChild(canvas);

    const mouse = new THREE.Vector2(-10, -10); // offscreen until first move
    const clock = new THREE.Clock();

    // --- soft round sprite: kills the hard-square point shimmer in Safari ---
    const dotTex = (() => {
      const c = document.createElement("canvas");
      c.width = c.height = 64;
      const g = c.getContext("2d")!;
      const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      grd.addColorStop(0, "rgba(255,255,255,1)");
      grd.addColorStop(0.55, "rgba(255,255,255,0.95)"); // solid core so color reads on white
      grd.addColorStop(1, "rgba(255,255,255,0)"); // soft edge (no hard-square shimmer)
      g.fillStyle = grd;
      g.fillRect(0, 0, 64, 64);
      const t = new THREE.CanvasTexture(c);
      t.colorSpace = THREE.SRGBColorSpace;
      return t;
    })();

    // --- Woven Silk ---
    const particleCount = 50000;
    const positions = new Float32Array(particleCount * 3);
    const originalPositions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    const geometry = new THREE.BufferGeometry();
    const torusKnot = new THREE.TorusKnotGeometry(1.5, 0.5, 200, 32);
    const tkPos = torusKnot.attributes.position;

    // 50k particles map onto only ~6.6k knot vertices, so several land on
    // each vertex. A tiny jitter spreads the duplicates so the silk reads
    // as woven strands rather than hard-stacked points.
    const spread = 0.05;
    const color = new THREE.Color();
    for (let i = 0; i < particleCount; i++) {
      const vi = i % tkPos.count;
      const x = tkPos.getX(vi) + (Math.random() - 0.5) * spread;
      const y = tkPos.getY(vi) + (Math.random() - 0.5) * spread;
      const z = tkPos.getZ(vi) + (Math.random() - 0.5) * spread;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      originalPositions[i * 3] = x;
      originalPositions[i * 3 + 1] = y;
      originalPositions[i * 3 + 2] = z;

      // White background → vivid, mid-dark hues so each strand reads as color
      // (not washed out). NormalBlending paints them over white as-is.
      color.setHSL(Math.random(), 0.85, 0.42);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    const posAttr = new THREE.BufferAttribute(positions, 3);
    posAttr.setUsage(THREE.DynamicDrawUsage); // hint: updated every frame
    geometry.setAttribute("position", posAttr);
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.055,
      map: dotTex,
      vertexColors: true,
      blending: THREE.NormalBlending, // colored dots painted over white (Additive would vanish on white)
      transparent: true,
      opacity: 1.0,
      depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // --- pointer: covers trackpad / touch / pen, mapped to the canvas rect ---
    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };
    const onPointerLeave = () => mouse.set(-10, -10);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    canvas.addEventListener("pointerleave", onPointerLeave);

    // --- render loop: scalar math, no per-particle allocations ---
    const R = 1.5;
    const R2 = R * R;
    const render = () => {
      const elapsedTime = clock.getElapsedTime();
      const mx = mouse.x * 3, my = mouse.y * 3, mz = 0;

      for (let i = 0; i < particleCount; i++) {
        const ix = i * 3, iy = ix + 1, iz = ix + 2;
        const px = positions[ix], py = positions[iy], pz = positions[iz];
        let vx = velocities[ix], vy = velocities[iy], vz = velocities[iz];

        // repel from cursor (squared distance avoids 50k sqrt/frame)
        const dx = px - mx, dy = py - my, dz = pz - mz;
        const d2 = dx * dx + dy * dy + dz * dz;
        if (d2 < R2 && d2 > 1e-6) {
          const d = Math.sqrt(d2);
          const f = ((R - d) * 0.01) / d; // = normalize(dir) * force
          vx += dx * f; vy += dy * f; vz += dz * f;
        }

        // spring back to the woven position
        vx += (originalPositions[ix] - px) * 0.001;
        vy += (originalPositions[iy] - py) * 0.001;
        vz += (originalPositions[iz] - pz) * 0.001;

        // damping
        vx *= 0.95; vy *= 0.95; vz *= 0.95;

        positions[ix] = px + vx;
        positions[iy] = py + vy;
        positions[iz] = pz + vz;
        velocities[ix] = vx; velocities[iy] = vy; velocities[iz] = vz;
      }
      posAttr.needsUpdate = true;

      points.rotation.y = elapsedTime * 0.05;
      renderer.render(scene, camera);
    };

    // setAnimationLoop is three's recommended driver (handles teardown cleanly)
    renderer.setAnimationLoop(render);

    // --- pause when tab is hidden (saves battery; avoids Safari backgrounding jank) ---
    const onVisibility = () => {
      renderer.setAnimationLoop(document.hidden ? null : render);
    };
    document.addEventListener("visibilitychange", onVisibility);

    // --- WebGL context-loss recovery (Safari drops contexts under pressure) ---
    const onContextLost = (e: Event) => {
      e.preventDefault();
      renderer.setAnimationLoop(null);
    };
    const onContextRestored = () => {
      renderer.setAnimationLoop(render);
    };
    canvas.addEventListener("webglcontextlost", onContextLost, false);
    canvas.addEventListener("webglcontextrestored", onContextRestored, false);

    // --- resize (tracks the container) ---
    const handleResize = () => {
      camera.aspect = w() / h();
      camera.updateProjectionMatrix();
      renderer.setSize(w(), h());
    };
    const ro = new ResizeObserver(handleResize);
    ro.observe(mount);
    window.addEventListener("resize", handleResize);

    return () => {
      renderer.setAnimationLoop(null);
      ro.disconnect();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      geometry.dispose();
      material.dispose();
      dotTex.dispose();
      torusKnot.dispose();
      renderer.dispose();
      if (canvas.parentNode === mount) mount.removeChild(canvas);
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0" />;
};
