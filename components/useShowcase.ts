"use client";
import { useCallback, useEffect, useRef, useState } from "react";

export function useShowcase(count: number) {
  const [step, setStep] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [touching, setTouching] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(true);
  const [visible, setVisible] = useState(false);
  const [hidden, setHidden] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const lastInteraction = useRef(0);
  const index = ((step % count) + count) % count;
  const interact = useCallback(() => { lastInteraction.current = Date.now(); }, []);
  const go = useCallback((delta: number) => { interact(); setStep(s => s + delta); }, [interact]);
  const select = (next: number) => {
    let delta = (next - index + count) % count;
    if (delta > count / 2) delta -= count;
    go(delta);
  };
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    const visibility = () => setHidden(document.hidden);
    update(); visibility();
    media.addEventListener("change", update);
    document.addEventListener("visibilitychange", visibility);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.25 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => { observer.disconnect(); media.removeEventListener("change", update); document.removeEventListener("visibilitychange", visibility); };
  }, []);
  const auto = !hovered && !focused && !touching && !paused && !reduced && visible && !hidden;
  useEffect(() => {
    if (!auto || count < 2) return;
    const timer = window.setTimeout(() => setStep(s => s + 1), Math.max(3600, 5000 - (Date.now() - lastInteraction.current)));
    return () => window.clearTimeout(timer);
  }, [auto, step, count]);
  return { index, step, go, select, sectionRef, setHovered, setFocused, setTouching, paused, setPaused, reduced, auto, interact };
}
