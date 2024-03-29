"use client";

import {
  ChevronsLeft,
  MenuIcon,
  Plus,
  PlusCircle,
  Search,
  Settings,
  Trash,
} from "lucide-react";
import {
  ElementRef,
  MouseEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useMediaQuery } from "usehooks-ts";
import { useParams, usePathname } from "next/navigation";
import { call, cn } from "@/lib";
import { UserItem } from "./items/user-item";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { MenuItem } from "./items/menu-item";
import { toast } from "sonner";
import { DocumentList } from "./document-list";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Trashbox } from "./trashbox";
import { useSearch } from "@/hooks/use-search";
import { useSettings } from "@/hooks/use-settings";
import { Navbar } from "@/app/(main)/_components/navbar";

export const Navigation = () => {
  const onOpen = useSearch((s) => s.onOpen);
  const openSettings = useSettings((s) => s.onOpen);
  const createDoc = useMutation(api.documents.create);
  const mobile = useMediaQuery("(max-width: 768px)");
  const pathname = usePathname();
  const { documentId } = useParams();

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

  const resetWidth = useCallback(() => {
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
  }, [mobile, refsAssigned]);

  const collapse = useCallback(() => {
    if (!refsAssigned) return;
    setCollapsed(true);
    setResetting(true);

    sidebarRef.current.style.width = "0";
    navbarRef.current.style.setProperty("width", "100%");
    navbarRef.current.style.setProperty("left", "0");
    setTimeout(() => setResetting(false), 300);
  }, [refsAssigned]);

  useEffect(() => {
    if (mobile) {
      collapse();
    } else {
      resetWidth();
    }
  }, [collapse, mobile, resetWidth]);

  useEffect(() => {
    if (mobile) {
      collapse();
    }
  }, [pathname, mobile, collapse]);

  const handleCreateDoc = () => {
    toast.promise(createDoc({ title: "Untitled" }), {
      loading: "Creating a new note...",
      success: "New note created!",
      error: "Note was note created",
    });
  };

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
        <div>
          <UserItem />
          <MenuItem label="Search" search icon={Search} onClick={onOpen} />
          <MenuItem label="Settings" icon={Settings} onClick={openSettings} />
          <MenuItem
            onClick={handleCreateDoc}
            label="New page"
            icon={PlusCircle}
          />
        </div>
        <div className="mt-4">
          <DocumentList />
          <MenuItem label="Add a page" icon={Plus} onClick={handleCreateDoc} />
          <Popover>
            <PopoverTrigger className="w-full mt-4">
              <MenuItem label="Trash" icon={Trash} />
            </PopoverTrigger>
            <PopoverContent
              className="p-0 w-72"
              side={mobile ? "bottom" : "right"}
            >
              <Trashbox />
            </PopoverContent>
          </Popover>
        </div>
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
        {documentId ? (
          <Navbar collapsed={collapsed} onWidthReset={resetWidth} />
        ) : (
          <nav className="bg-transparent px-3 py-2 w-full">
            {collapsed && (
              <MenuIcon
                className="h-6 w-6 text-muted-foreground"
                onClick={resetWidth}
                role="button"
              />
            )}
          </nav>
        )}
      </div>
    </>
  );
};
