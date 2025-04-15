"use client";
import { useEffect, useRef, useState } from "react";
import { SidebarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/provider/sidebar";

export const SidebarMobileToggle = () => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { isOpen, toggleSidebar } = useSidebar();

  const [offsetY, setOffsetY] = useState(0);
  const [maxY, setMaxY] = useState(0);
  const dragRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const startY = useRef(0);
  const lastPointerY = useRef(0);
  // TO DIFF DRAG AND CLICK
  const pointerDownPos = useRef<{ x: number; y: number } | null>(null);
  const clickHandled = useRef(false);

  // UPDATE measurements on mount and on resize.
  useEffect(() => {
    const updateDimensions = () => {
      setMaxY(window.innerHeight);
      if (dragRef.current) {
        const elementHeight = dragRef.current.offsetHeight;
        setOffsetY((prev) => clampOffsetY(prev, elementHeight));
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // GET persisted vertical offset.
  useEffect(() => {
    const storedY = localStorage.getItem("sidebarToggleOffsetY");
    if (storedY && dragRef.current) {
      const elementHeight = dragRef.current.offsetHeight;
      const parsedY = parseFloat(storedY);
      setOffsetY(clampOffsetY(parsedY, elementHeight));
    }
  }, []);

  // PERSIST the vertical offset.
  const persistOffset = (newY: number) => {
    localStorage.setItem("sidebarToggleOffsetY", newY.toString());
  };

  // KEEP OFFSET within viewport height.
  const clampOffsetY = (value: number, elementHeight: number) => {
    const max =
      typeof window !== "undefined" ? window.innerHeight - elementHeight : 0;
    return Math.min(Math.max(0, value), max);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    pointerDownPos.current = { x: e.clientX, y: e.clientY };
    lastPointerY.current = e.clientY;
    if (dragRef.current) {
      dragRef.current.setAttribute("aria-grabbed", "true");
      dragRef.current.setPointerCapture(e.pointerId);
    }
    startY.current = e.clientY - offsetY;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;

    const elementHeight = dragRef.current?.offsetHeight || 0;
    const newY = e.clientY - startY.current;
    const clampedY = clampOffsetY(newY, elementHeight);
    setOffsetY(clampedY);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = false;
    if (dragRef.current) {
      dragRef.current.setAttribute("aria-grabbed", "false");
      dragRef.current.releasePointerCapture(e.pointerId);
    }
    // DETERMINE the pointer movement distance.
    let distance = 0;
    if (pointerDownPos.current) {
      const dx = e.clientX - pointerDownPos.current.x;
      const dy = e.clientY - pointerDownPos.current.y;
      distance = Math.sqrt(dx * dx + dy * dy);
    }
    // When Threshold (in pixels) is below, the action is considered a click.
    const CLICK_THRESHOLD = 5;
    if (distance < CLICK_THRESHOLD) {
      clickHandled.current = true;

      toggleSidebar();

      // FOCUS THE FIRST MENU WHEN OPENING.
      if (!isOpen) {
        setTimeout(() => {
          const firstMenuItem = document.querySelector(
            '[role="menuitem"]',
          ) as HTMLElement;
          if (firstMenuItem) firstMenuItem.focus();
        }, 100);
      }
      // Reset flag in next tick.
      setTimeout(() => (clickHandled.current = false), 0);
    } else {
      persistOffset(offsetY);
    }
    pointerDownPos.current = null;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const step = 10;
    const elementHeight = dragRef.current?.offsetHeight || 0;

    if (e.key === "ArrowUp") {
      const newY = clampOffsetY(offsetY - step, elementHeight);
      setOffsetY(newY);
      persistOffset(newY);
      e.preventDefault();
    } else if (e.key === "ArrowDown") {
      const newY = clampOffsetY(offsetY + step, elementHeight);
      setOffsetY(newY);
      persistOffset(newY);
      e.preventDefault();
    }
  };

  // TOGGLE sidebar
  const handleToggle = () => {
    if (clickHandled.current) return;
    toggleSidebar();

    if (!isOpen) {
      setTimeout(() => {
        const firstMenuItem = document.querySelector(
          '[role="menuitem"]',
        ) as HTMLElement;
        if (firstMenuItem) firstMenuItem.focus();
      }, 100);
    }
  };

  return (
    <div
      ref={dragRef}
      className="fixed right-0 z-50 cursor-grab rounded-l-lg bg-green-500 p-2 select-none active:cursor-grabbing"
      style={{ top: `${offsetY}px` }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="slider"
      aria-valuemin={0}
      aria-valuemax={maxY}
      aria-valuenow={offsetY}
      aria-roledescription="Draggable sidebar toggle; use up and down arrow keys to reposition."
    >
      {/* FOR SCREEN READERS */}
      <span className="sr-only">
        Drag vertically to reposition the sidebar toggle. Currently at {offsetY}
        pixels from the top.
      </span>

      <Button
        ref={buttonRef}
        size="icon"
        variant="ghost"
        onClick={handleToggle}
        className="aspect-square bg-zinc-800 shadow-sm"
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        aria-expanded={isOpen}
      >
        <SidebarIcon />
      </Button>
    </div>
  );
};
