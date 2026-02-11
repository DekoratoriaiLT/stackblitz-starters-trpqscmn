"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ========================================================
   TYPES
   ======================================================== */
type Category = {
  id: number;
  title: string;
  img: string;
  href?: string;
};

/* ========================================================
   DATA
   ======================================================== */
const interieras: Category[] = [
  { id: 1,  title: "Lubų apvadai",            img: "/images/landing/lubu-apvadai.webp",            href: "/produktai/lubu-apvadai" },
  { id: 2,  title: "Sienų apvadai",           img: "/images/landing/sienu-apvadai.webp",           href: "/produktai/sienu-apvadai" },
  { id: 3,  title: "Grindų apvadai",          img: "/images/landing/grindu-apvadai.webp",          href: "/produktai/grindu-apvadai" },
  { id: 4,  title: "Rozetės",                 img: "/images/landing/rozetes.webp",                 href: "/produktai/rozetes" },
  { id: 5,  title: "Sienų plokštės",          img: "/images/landing/sienu-paneles.webp",           href: "/produktai/sienu-paneles" },
  { id: 6,  title: "Lubų panelės",            img: "/images/landing/lubu-paneles.webp",            href: "/produktai/lubu-paneles" },
  { id: 7,  title: "Piliastrai",              img: "/images/landing/piliastrai.webp",              href: "/produktai/piliastrai" },
  { id: 8,  title: "Kolonos",                 img: "/images/landing/kolonos.webp",                 href: "/produktai/kolonos" },
  { id: 9,  title: "Puskolonos",              img: "/images/landing/puskolonos.webp",              href: "/produktai/puskolonos" },
  { id: 10, title: "Arkiniai apvadai",        img: "/images/landing/arkiniai-apvadai.webp",        href: "/produktai/arkiniai-apvadai" },
  { id: 12, title: "Gembės",                  img: "/images/landing/gembes.webp",                  href: "/produktai/gembes" },
  { id: 13, title: "Židinio dekoracija",      img: "/images/landing/zidinio-dekoracija.webp",      href: "/produktai/zidinio-dekoracija" },
  { id: 14, title: "Nišos",                   img: "/images/landing/nisos.webp",                   href: "/produktai/nisos" },
  { id: 16, title: "Apvadų kampai",           img: "/images/landing/apvadu-kampai.webp",           href: "/produktai/apvadu-kampai" },
  { id: 18, title: "Ornamentai",              img: "/images/landing/ornamentai.webp",              href: "/produktai/ornamentai" },
  { id: 19, title: "Žiedai",                  img: "/images/landing/ziedai.webp",                  href: "/produktai/ziedai" },
  { id: 21, title: "Arkiniai elementai",      img: "/images/landing/arkiniai-elementai.webp",      href: "/produktai/arkiniai-elementai" },
  { id: 22, title: "Papildomi elementai",     img: "/images/landing/papildomi-elementai.webp",     href: "/produktai/papildomi-elementai" },
];

const fasadas: Category[] = [
  { id: 24, title: "Frizai",                      img: "/images/landing/frizai.webp",                      href: "/produktai/frizai" },
  { id: 25, title: "Architravai",                 img: "/images/landing/architravai.webp",                 href: "/produktai/architravai" },
  { id: 26, title: "Piliastrai",                  img: "/images/landing/piliastrai.webp",                  href: "/produktai/piliastrai" },
  { id: 27, title: "Kolonos",                     img: "/images/landing/kolonos.webp",                     href: "/produktai/kolonos" },
  { id: 28, title: "Puskolonos",                  img: "/images/landing/puskolonos.webp",                  href: "/produktai/puskolonos" },
  { id: 29, title: "Balustrai",                   img: "/images/landing/balustrai.webp",                   href: "/produktai/balustrai" },
  { id: 31, title: "Stulpo kepurė",               img: "/images/landing/stulpo-kepures.webp",               href: "/produktai/stulpo-kepure" },
  { id: 32, title: "Balustrados pagrindai",       img: "/images/landing/balustrados-pagrindai.webp",       href: "/produktai/balustrados-pagrindai" },
  { id: 33, title: "Balustrados porankiai",       img: "/images/landing/balustrados-porankiai.webp",       href: "/produktai/balustrados-porankiai" },
  { id: 34, title: "Langų juostos",               img: "/images/landing/lauko-palanges.webp",               href: "/produktai/lauko-palanges" },
  { id: 35, title: "Langų arkiniai rėmai",        img: "/images/landing/lango-arkiniai-remai.webp",        href: "/produktai/lango-arkiniai-remai" },
  { id: 36, title: "Riežamieji elementai",        img: "/images/landing/riejamieji-elementai.webp",        href: "/produktai/riejamieji-elementai" },
  { id: 37, title: "Lauko Palangės",              img: "/images/landing/palanges.webp",                    href: "/produktai/lauko-palanges" },
  { id: 38, title: "Pjedestalinės gembės",        img: "/images/landing/pjedestalines-gembes.webp",        href: "/produktai/pjedestalines-gembes" },
  { id: 39, title: "Langų Angokras",              img: "/images/landing/lango-soniniai-apvadai.webp",      href: "/produktai/lango-soniniai-apvadai" },
  { id: 42, title: "Fasado ornamentai",           img: "/images/landing/fasado-ornamentai.webp",           href: "/produktai/fasado-ornamentai" },
  { id: 43, title: "Rustikai",                    img: "/images/landing/rustikai.webp",                    href: "/produktai/rustikai" },
  { id: 45, title: "Fasado galiniai elementai",   img: "/images/landing/fasado-galiniai-elementai.webp",   href: "/produktai/fasado-galiniai-elementai" },
];

/* ========================================================
   CATEGORY CARD
   ======================================================== */
function CategoryCard({ category }: { category: Category }) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={category.href ?? "#"}
      className="group relative block rounded-xl overflow-hidden border border-[#2a2a2a] bg-[#111] transition-all duration-400
                 hover:border-emerald-500/40 hover:shadow-[0_8px_40px_rgba(16,185,129,0.15)]"
      style={{ transition: "border-color 0.35s, box-shadow 0.35s, transform 0.35s" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image area */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={category.img}
          alt={category.title}
          className="w-full h-full object-cover transition-all duration-500"
          style={{
            transform: hovered ? "scale(1.08)" : "scale(1)",
            filter: hovered ? "brightness(1.05)" : "brightness(0.75)",
          }}
        />

        {/* Bottom gradient overlay — always present, intensifies on hover */}
        <div
          className="absolute inset-0 transition-opacity duration-400"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%)",
            opacity: hovered ? 0.85 : 1,
          }}
        />

        {/* Emerald top-edge accent line — appears on hover */}
        <div
          className="absolute top-0 left-0 right-0 h-0.5 bg-emerald-500 transition-all duration-400"
          style={{ opacity: hovered ? 1 : 0 }}
        />
      </div>

      {/* Title strip */}
      <div className="px-4 py-3 flex items-center justify-between">
        <h3
          className="text-sm font-semibold text-gray-300 group-hover:text-white transition-colors duration-300 truncate"
          style={{ fontFamily: "'Karla', sans-serif" }}
        >
          {category.title}
        </h3>

        {/* Arrow icon — slides in on hover */}
        <svg
          className="w-4 h-4 text-emerald-400 transition-all duration-300"
          style={{
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateX(0)" : "translateX(-6px)",
          }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </a>
  );
}

/* ========================================================
   TAB PILL SWITCHER
   ======================================================== */
function TabSwitcher({
  activeTab,
  onTabChange,
}: {
  activeTab: "interjeras" | "fasadas";
  onTabChange: (t: "interjeras" | "fasadas") => void;
}) {
  const tabs = [
    { key: "interjeras" as const, label: "Interjeras" },
    { key: "fasadas" as const, label: "Fasadas" },
  ];

  return (
    <div className="inline-flex items-center bg-[#111] border border-[#2a2a2a] rounded-full p-1 gap-0.5">
      {tabs.map((tab) => {
        const active = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className="relative px-6 py-2 rounded-full text-sm font-semibold transition-colors duration-300 z-10"
            style={{
              color: active ? "#111" : "#9ca3af",
              fontFamily: "'Karla', sans-serif",
            }}
          >
            {/* Animated background pill */}
            {active && (
              <span className="absolute inset-0 rounded-full bg-emerald-500" style={{ zIndex: -1 }} />
            )}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

/* ========================================================
   PAGE INDICATOR DOTS
   ======================================================== */
function PageDots({
  total,
  current,
  onChange,
}: {
  total: number;
  current: number;
  onChange: (i: number) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onChange(i)}
          className="rounded-full transition-all duration-300"
          style={{
            width: i === current ? 24 : 8,
            height: 8,
            background: i === current ? "#10b981" : "rgba(255,255,255,0.2)",
          }}
        />
      ))}
    </div>
  );
}

/* ========================================================
   MAIN PAGE
   ======================================================== */
export default function ProduktaiPage() {
  const [activeTab, setActiveTab] = useState<"interjeras" | "fasadas">("interjeras");
  const [currentIndex, setCurrentIndex] = useState(0);

  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);

  const categories = activeTab === "interjeras" ? interieras : fasadas;
  const ITEMS = 6;
  const maxIndex = Math.max(0, Math.ceil(categories.length / ITEMS) - 1);

  /* ---- Animate page transition ---- */
  const animateToPage = useCallback(
    (newIndex: number) => {
      if (isAnimating.current || newIndex === currentIndex || newIndex < 0 || newIndex > maxIndex) return;
      isAnimating.current = true;

      if (gridRef.current) {
        gsap.to(gridRef.current, {
          opacity: 0,
          y: -24,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => {
            setCurrentIndex(newIndex);
            gsap.fromTo(
              gridRef.current,
              { opacity: 0, y: 24 },
              {
                opacity: 1,
                y: 0,
                duration: 0.4,
                ease: "power2.out",
                onComplete: () => { isAnimating.current = false; },
              }
            );
          },
        });
      }
    },
    [currentIndex, maxIndex]
  );

  /* ---- ScrollTrigger pin ---- */
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current!,
        start: "top top",
        end: () => `+=${(maxIndex + 1) * 100}%`,
        pin: true,
        pinSpacing: true,
        scrub: 0.5,
        onUpdate: (self) => {
          if (isAnimating.current) return;
          const idx = Math.min(
            Math.floor(self.progress * (maxIndex + 1)),
            maxIndex
          );
          if (idx !== currentIndex) animateToPage(idx);
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [maxIndex, currentIndex, animateToPage]);

  /* ---- Tab change resets page ---- */
  const handleTabChange = (tab: "interjeras" | "fasadas") => {
    setActiveTab(tab);
    setCurrentIndex(0);
  };

  /* ---- Visible slice ---- */
  const visible = categories.slice(currentIndex * ITEMS, (currentIndex + 1) * ITEMS);

  /* ========================================================
     RENDER
     ======================================================== */
  return (
    <section
      ref={sectionRef}
      className="h-screen relative overflow-hidden"
      style={{ background: "#0f1117" }}
    >
      {/* ---- Subtle ambient background ---- */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 30% 20%, rgba(16,185,129,0.06) 0%, transparent 70%), " +
            "radial-gradient(ellipse 60% 50% at 75% 75%, rgba(16,185,129,0.04) 0%, transparent 60%)",
        }}
      />

      {/* ---- Content wrapper ---- */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 py-16">
        {/* Header */}
        <div className="text-center mb-10">
          <h1
            className="text-4xl sm:text-5xl font-light text-white mb-3 tracking-tight"
            style={{ fontFamily: "'Karla', sans-serif" }}
          >
            Produktų kategorijos
          </h1>
          <p className="text-gray-500 text-base max-w-xl mx-auto">
            Naršykite mūsų aukštos kokybės statybinių ir apdailos medžiagų kolekciją
          </p>
        </div>

        {/* Tab switcher */}
        <div className="mb-8">
          <TabSwitcher activeTab={activeTab} onTabChange={handleTabChange} />
        </div>

        {/* Page dots */}
        <div className="mb-6">
          <PageDots total={maxIndex + 1} current={currentIndex} onChange={animateToPage} />
        </div>

        {/* Category grid */}
        <div
          ref={gridRef}
          className="w-full max-w-6xl"
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
            {visible.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        {currentIndex < maxIndex && (
          <div className="mt-8 flex flex-col items-center gap-1.5 animate-pulse">
            <span className="text-gray-600 text-xs tracking-widest uppercase">
              Scroll
            </span>
            <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        )}
      </div>
    </section>
  );
}