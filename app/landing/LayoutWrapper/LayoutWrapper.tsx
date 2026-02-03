"use client";

import { ReactNode, useEffect } from "react";

interface LayoutWrapperProps {
  children: ReactNode;
}

/**
 * LayoutWrapper component to prevent horizontal scrolling
 * and ensure all content stays within viewport bounds
 */
export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  useEffect(() => {
    // Add overflow-x hidden to html and body elements
    document.documentElement.style.overflowX = 'hidden';
    document.documentElement.style.maxWidth = '100vw';
    document.body.style.overflowX = 'hidden';
    document.body.style.maxWidth = '100vw';

    // Cleanup function to restore original styles
    return () => {
      document.documentElement.style.overflowX = '';
      document.documentElement.style.maxWidth = '';
      document.body.style.overflowX = '';
      document.body.style.maxWidth = '';
    };
  }, []);

  return (
    <div className="overflow-x-hidden w-full max-w-[100vw] relative">
      {children}
    </div>
  );
}