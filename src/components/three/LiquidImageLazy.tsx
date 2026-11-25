"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { isLowPower } from "@/lib/perf";
import { prefersReducedMotion } from "@/lib/ui";

const LiquidImage = dynamic(() => import("@/components/three/LiquidImage"), { ssr: false });

/** Plain <img> first; the WebGL surface mounts only near the viewport, never on phones. */
export default function LiquidImageLazy({ src }: { src: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || isLowPower() || prefersReducedMotion()) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setLive(true);
        io.disconnect();
      },
      { rootMargin: "400px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="absolute inset-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      {live && <LiquidImage src={src} />}
    </div>
  );
}