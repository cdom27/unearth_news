"use client";

import React, { ReactNode, useState, useEffect, ReactElement } from "react";
import { createPortal } from "react-dom";

const tooltipVariants: Record<string, string> = {
  default: "text-clay-900 bg-brand-500 text-lg font-semibold",
};

interface TooltipChildProps {
  onMouseEnter?: React.MouseEventHandler<HTMLElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLElement>;
  onMouseMove?: React.MouseEventHandler<HTMLElement>;
  [key: string]: unknown;
}

interface TooltipProps {
  variant?: keyof typeof tooltipVariants;
  content: ReactNode;
  children: ReactElement<TooltipChildProps>;
  className?: string;
}

export default function Tooltip({
  variant = "default",
  content,
  children,
  className = "",
}: TooltipProps) {
  const variantClasses = tooltipVariants[variant];
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timeoutId);
  }, []);

  const childProps = children.props as TooltipChildProps;

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    setIsVisible(true);
    setPosition({ x: e.clientX, y: e.clientY });
    if (childProps.onMouseEnter) {
      childProps.onMouseEnter(e);
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    setIsVisible(false);
    if (childProps.onMouseLeave) {
      childProps.onMouseLeave(e);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    setPosition({ x: e.clientX, y: e.clientY });
    if (childProps.onMouseMove) {
      childProps.onMouseMove(e);
    }
  };

  const clonedChild = React.cloneElement(
    children as React.ReactElement<TooltipChildProps>,
    {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onMouseMove: handleMouseMove,
    },
  );

  return (
    <>
      {clonedChild}
      {mounted &&
        isVisible &&
        createPortal(
          <div
            className={`fixed pointer-events-none z-50 rounded-full py-1.5 px-3.5 shadow-md transition-all duration-250 ease-out ${variantClasses} ${className}`.trim()}
            style={{
              top: position.y - 5,
              left: position.x + 5,
              transform: "translate(0, -100%)",
            }}
          >
            {content}
          </div>,
          document.body,
        )}
    </>
  );
}
