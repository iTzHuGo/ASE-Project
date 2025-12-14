
// src/hooks/useHorizontalScroll.js
import { useEffect, useRef, useState, useCallback } from "react";

export default function useHorizontalScroll({ amount = 600 } = {}) {
  const ref = useRef(null);
  const [canScrollBack, setCanScrollBack] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateEdges = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const maxLeft = el.scrollWidth - el.clientWidth;
    setCanScrollBack(el.scrollLeft > 0);
    setCanScrollNext(el.scrollLeft < maxLeft - 1);
  }, []);

  const scrollByAmount = useCallback(
    (dir) => {
      const el = ref.current;
      if (!el) return;
      el.scrollBy({
        left: dir === "next" ? amount : -amount,
        behavior: "smooth",
      });
      setTimeout(updateEdges, 200);
    },
    [amount, updateEdges]
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    updateEdges();

    const onScroll = () => updateEdges();
    el.addEventListener("scroll", onScroll, { passive: true });

    const onKeyDown = (e) => {
      if (e.key === "ArrowRight") scrollByAmount("next");
      if (e.key === "ArrowLeft") scrollByAmount("back");
    };
    el.addEventListener("keydown", onKeyDown);

    const onResize = () => updateEdges();
    window.addEventListener("resize", onResize);

    return () => {
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, [scrollByAmount, updateEdges]);

  return { ref, canScrollBack, canScrollNext, scrollByAmount };
}
