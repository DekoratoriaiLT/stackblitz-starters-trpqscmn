"use client";

import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

export type FiltersType = {
  priceRange: string;
  material: string;
  style: string;
};

export type FilterPanelProps = {
  open: boolean;
  onClose: () => void;
  filters: FiltersType;
  onFilterChange: (key: keyof FiltersType, value: string) => void;
  filterConfig: {
    priceRange: { value: string; label: string }[];
    material: { value: string; label: string }[];
    style: { value: string; label: string }[];
  };
};

export default function FilterPanel({
  open,
  onClose,
  filters,
  onFilterChange,
  filterConfig,
}: FilterPanelProps) {
  // ✅ Hooks must ALWAYS be at the top
  const [navbarHeight, setNavbarHeight] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const nav = document.querySelector("nav");
    if (nav) setNavbarHeight(nav.offsetHeight);
  }, []);

  useEffect(() => {
    if (!open) return; // optional optimization

    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose]);

  // ✅ Early return AFTER hooks
  if (!open) return null;

  const resetFilters = () => {
    onFilterChange("priceRange", "all");
    onFilterChange("material", "all");
    onFilterChange("style", "all");
  };

  return (
    <div className="fixed inset-0 z-40 bg-black/50">
      <div
        ref={panelRef}
        className="bg-white w-80 p-6 overflow-y-auto shadow-xl animate-slide-left fixed right-0 z-50"
        style={{
          top: navbarHeight,
          height: `calc(100vh - ${navbarHeight}px)`,
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold">Filtrai</h3>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Price */}
        <div className="mb-6">
          <label className="font-semibold block mb-2">Kaina</label>
          <select
            value={filters.priceRange}
            onChange={(e) => onFilterChange("priceRange", e.target.value)}
            className="w-full border rounded-lg p-2"
          >
            {filterConfig.priceRange.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Material */}
        <div className="mb-6">
          <label className="font-semibold block mb-2">Medžiaga</label>
          <select
            value={filters.material}
            onChange={(e) => onFilterChange("material", e.target.value)}
            className="w-full border rounded-lg p-2"
          >
            {filterConfig.material.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Style */}
        <div className="mb-6">
          <label className="font-semibold block mb-2">Stilius</label>
          <select
            value={filters.style}
            onChange={(e) => onFilterChange("style", e.target.value)}
            className="w-full border rounded-lg p-2"
          >
            {filterConfig.style.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={resetFilters}
          className="w-full bg-red-500 text-white py-3 rounded-lg mt-4 hover:bg-red-600 transition"
        >
          Išvalyti filtrus
        </button>
      </div>
    </div>
  );
}
