"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { X, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarContextType {
  isOpen: boolean;
  toggleSidebar: () => void;
  isMobile: boolean;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

interface SidebarProviderProps {
  children: ReactNode;
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      setIsOpen(window.innerWidth >= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <SidebarContext.Provider value={{ isOpen, toggleSidebar, isMobile }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isOpen, toggleSidebar, isMobile } = useSidebar();
  return (
    <>
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50"
          onClick={toggleSidebar}
        >
          {isOpen ? <X /> : <Menu />}
        </Button>
      )}
      <div
        className={cn(
          "bg-background border-r transition-all duration-300 z-40 overflow-y-auto",
          isMobile
            ? isOpen
              ? "w-64 fixed inset-y-0 left-0"
              : "w-0"
            : isOpen
            ? "w-64"
            : "w-0",
          isMobile && !isOpen ? "-translate-x-full" : "translate-x-0"
        )}
      >
        <div className="h-full py-4">{children}</div>
      </div>
    </>
  );
};

export const SidebarHeader: React.FC<{ children: ReactNode }> = ({
  children,
}) => <div className="p-4 border-b">{children}</div>;

export const SidebarMenu: React.FC<{ children: ReactNode }> = ({
  children,
}) => <nav className="mt-4">{children}</nav>;

export const SidebarMenuItem: React.FC<{ children: ReactNode }> = ({
  children,
}) => <div className="mb-2">{children}</div>;

export const SidebarMenuButton: React.FC<{
  children: ReactNode;
  isActive?: boolean;
  asChild?: boolean;
  onClick?: () => void;
  className?: string;
}> = ({ children, isActive = false, asChild = false, onClick, className }) => {
  const Comp = asChild ? React.Fragment : "button";
  const props = asChild
    ? {}
    : {
        className: cn(
          "w-full text-left px-4 py-2 rounded",
          isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent",
          className
        ),
        onClick,
      };

  return <Comp {...props}>{children}</Comp>;
};

export const SidebarContent: React.FC<{ children: ReactNode }> = ({
  children,
}) => <div className="p-4">{children}</div>;

export const SidebarGroup: React.FC<{ children: ReactNode }> = ({
  children,
}) => <div className="mb-4">{children}</div>;

export const SidebarGroupLabel: React.FC<{ children: ReactNode }> = ({
  children,
}) => (
  <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
    {children}
  </h3>
);

export const SidebarGroupContent: React.FC<{ children: ReactNode }> = ({
  children,
}) => <div>{children}</div>;
