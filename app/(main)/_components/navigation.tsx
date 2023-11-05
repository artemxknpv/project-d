"use client";

import { ChevronsLeft, MenuIcon } from "lucide-react";
import {
  ElementRef,
  MouseEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import { useMediaQuery } from "usehooks-ts";
import { usePathname } from "next/navigation";
import { call, cn } from "@/lib";
import { UserItem } from "@/app/(main)/_components/items/user-item";

export const Navigation = () => {
  const mobile = useMediaQuery("(max-width: 768px)");
  const pathname = usePathname();

  const isResizingRef = useRef(false);
  const sidebarRef = useRef<ElementRef<"aside">>(null);
  const navbarRef = useRef<ElementRef<"div">>(null);
  const [resetting, setResetting] = useState(false);
  const [collapsed, setCollapsed] = useState(mobile);

  const refsAssigned = sidebarRef.current && navbarRef.current;

  const handleMouseDown: MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation();
    e.preventDefault();

    isResizingRef.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizingRef.current) return;

    const newWidth = call(() => {
      if (e.clientX < 240) return 240;
      if (e.clientX > 480) return 480;
      return e.clientX;
    });

    if (refsAssigned) {
      sidebarRef.current.style.width = `${newWidth}px`;
      navbarRef.current.style.setProperty("left", `${newWidth}px`);
      navbarRef.current.style.setProperty(
        "width",
        `calc(100% - ${newWidth}px)`,
      );
    }
  };

  const handleMouseUp = () => {
    isResizingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const resetWidth = () => {
    if (!refsAssigned) return;
    setCollapsed(false);
    setResetting(true);
    sidebarRef.current.style.width = call(() => {
      if (mobile) return "100%";
      return "240px";
    });
    navbarRef.current.style.setProperty(
      "width",
      mobile ? "0" : `calc(100% - 240px)`,
    );
    navbarRef.current.style.setProperty("left", mobile ? "100%" : "240px");
    setTimeout(() => setResetting(false), 300);
  };

  const collapse = () => {
    if (!refsAssigned) return;
    setCollapsed(true);
    setResetting(true);

    sidebarRef.current.style.width = "0";
    navbarRef.current.style.setProperty("width", "100%");
    navbarRef.current.style.setProperty("left", "0");
    setTimeout(() => setResetting(false), 300);
  };

  useEffect(() => {
    if (mobile) {
      collapse();
    } else {
      resetWidth();
    }
  }, [mobile]);

  useEffect(() => {
    if (mobile) {
      collapse();
    }
  }, [pathname, mobile]);

  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          "group/sidebar h-full bg-secondary overflow-y-auto relative flex flex-col w-60 z-[99999]",
          {
            "transition-all ease-in-out duration-300": resetting,
            "w-0": mobile,
          },
        )}
      >
        <div
          role="button"
          onClick={collapse}
          className={cn(
            "h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition",
            { "opacity-100": mobile },
          )}
        >
          <ChevronsLeft className="h-6 w-6" />
        </div>
        <UserItem />
        <div className="overflow-hidden text-clip">Documents</div>
        <div
          onMouseDown={handleMouseDown}
          onClick={resetWidth}
          className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0"
        />
      </aside>
      <div
        ref={navbarRef}
        className={cn("absolute top-0 z-[9999] left-60 w-[calc(100%-240px)]", {
          "transition-all ease-in-out duration-300": resetting,
          "left-0 w-full": mobile,
        })}
      >
        <nav className="bg-transparent px-3 py-2 w-full">
          {collapsed && (
            <MenuIcon
              className="h-6 w-6 text-muted-foreground"
              onClick={resetWidth}
              role="button"
            />
          )}
        </nav>
      </div>
    </>
  );
};
