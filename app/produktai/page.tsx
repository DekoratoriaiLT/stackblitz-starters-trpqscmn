"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useLayoutEffect,
} from "react";
import Link from "next/link";
import gsap from "gsap";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";

/* ========================================================
   TYPES
======================================================== */

type Category = {
  id: number;
  title: string;
  img: string;
  href?: string;
};

type Tab = "interjeras" | "fasadas";

/* ========================================================
   DATA
======================================================== */

const interieras: Category[] = [
  {
    id: 1,
    title: "Lubų apvadai",
    img: "/images/landing/lubu-apvadai.webp",
    href: "/produktai/lubu-apvadai",
  },
  {
    id: 2,
    title: "Sienų apvadai",
    img: "/images/landing/sienu-apvadai.webp",
    href: "/produktai/sienu-apvadai",
  },
  {
    id: 3,
    title: "Grindų apvadai",
    img: "/images/landing/grindu-apvadai.webp",
    href: "/produktai/grindu-apvadai",
  },
  {
    id: 4,
    title: "Rozetės",
    img: "/images/landing/rozetes.webp",
    href: "/produktai/rozetes",
  },
  {
    id: 5,
    title: "Sienų plokštės",
    img: "/images/landing/sienu-paneles.webp",
    href: "/produktai/sienu-paneles",
  },
  {
    id: 6,
    title: "Lubų panelės",
    img: "/images/landing/lubu-paneles.webp",
    href: "/produktai/lubu-paneles",
  },
  {
    id: 7,
    title: "Piliastrai",
    img: "/images/landing/piliastrai.webp",
    href: "/produktai/piliastrai",
  },
  {
    id: 8,
    title: "Kolonos",
    img: "/images/landing/kolonos.webp",
    href: "/produktai/kolonos",
  },
  {
    id: 9,
    title: "Puskolonos",
    img: "/images/landing/puskolonos.webp",
    href: "/produktai/puskolonos",
  },
  {
    id: 10,
    title: "Arkiniai apvadai",
    img: "/images/landing/arkiniai-apvadai.webp",
    href: "/produktai/arkiniai-apvadai",
  },
  {
    id: 12,
    title: "Gembės",
    img: "/images/landing/gembes.webp",
    href: "/produktai/gembes",
  },
  {
    id: 13,
    title: "Židinio dekoracija",
    img: "/images/landing/zidinio-dekoracija.webp",
    href: "/produktai/zidinio-dekoracija",
  },
  {
    id: 14,
    title: "Nišos",
    img: "/images/landing/nisos.webp",
    href: "/produktai/nisos",
  },
  {
    id: 16,
    title: "Apvadų kampai",
    img: "/images/landing/apvadu-kampai.webp",
    href: "/produktai/apvadu-kampai",
  },
  {
    id: 18,
    title: "Ornamentai",
    img: "/images/landing/ornamentai.webp",
    href: "/produktai/ornamentai",
  },
  {
    id: 19,
    title: "Žiedai",
    img: "/images/landing/ziedai.webp",
    href: "/produktai/ziedai",
  },
  {
    id: 21,
    title: "Arkiniai elementai",
    img: "/images/landing/arkiniai-elementai.webp",
    href: "/produktai/arkiniai-elementai",
  },
  {
    id: 22,
    title: "Papildomi elementai",
    img: "/images/landing/papildomi-elementai.webp",
    href: "/produktai/papildomi-elementai",
  },
];

const fasadas: Category[] = [
  {
    id: 24,
    title: "Frizai",
    img: "/images/landing/frizai.webp",
    href: "/produktai/frizai",
  },
  {
    id: 25,
    title: "Architravai",
    img: "/images/landing/architravai.webp",
    href: "/produktai/architravai",
  },
  {
    id: 26,
    title: "Piliastrai",
    img: "/images/landing/piliastrai.webp",
    href: "/produktai/piliastrai",
  },
  {
    id: 27,
    title: "Kolonos",
    img: "/images/landing/kolonos.webp",
    href: "/produktai/kolonos",
  },
  {
    id: 28,
    title: "Puskolonos",
    img: "/images/landing/puskolonos.webp",
    href: "/produktai/puskolonos",
  },
  {
    id: 29,
    title: "Balustrai",
    img: "/images/landing/balustrai.webp",
    href: "/produktai/balustrai",
  },
  {
    id: 31,
    title: "Stulpo kepurė",
    img: "/images/landing/stulpo-kepures.webp",
    href: "/produktai/stulpo-kepure",
  },
  {
    id: 32,
    title: "Balustrados pagrindai",
    img: "/images/landing/balustrados-pagrindai.webp",
    href: "/produktai/balustrados-pagrindai",
  },
  {
    id: 33,
    title: "Balustrados porankiai",
    img: "/images/landing/balustrados-porankiai.webp",
    href: "/produktai/balustrados-porankiai",
  },
  {
    id: 34,
    title: "Langų juostos",
    img: "/images/landing/lauko-palanges.webp",
    href: "/produktai/lauko-palanges",
  },
  {
    id: 35,
    title: "Langų arkiniai rėmai",
    img: "/images/landing/lango-arkiniai-remai.webp",
    href: "/produktai/lango-arkiniai-remai",
  },
  {
    id: 36,
    title: "Riežamieji elementai",
    img: "/images/landing/riejamieji-elementai.webp",
    href: "/produktai/riejamieji-elementai",
  },
  {
    id: 37,
    title: "Lauko palangės",
    img: "/images/landing/lauko-palanges.webp",
    href: "/produktai/lauko-palanges",
  },
  {
    id: 38,
    title: "Pjedestalinės gembės",
    img: "/images/landing/pjedestalines-gembes.webp",
    href: "/produktai/pjedestalines-gembes",
  },
  {
    id: 39,
    title: "Langų angokraščiai",
    img: "/images/landing/lango-soniniai-apvadai.webp",
    href: "/produktai/lango-soniniai-apvadai",
  },
  {
    id: 42,
    title: "Fasado ornamentai",
    img: "/images/landing/fasado-ornamentai.webp",
    href: "/produktai/fasado-ornamentai",
  },
  {
    id: 43,
    title: "Rustikai",
    img: "/images/landing/rustikai.webp",
    href: "/produktai/rustikai",
  },
  {
    id: 45,
    title: "Fasado galiniai elementai",
    img: "/images/landing/fasado-galiniai-elementai.webp",
    href: "/produktai/fasado-galiniai-elementai",
  },
];

/* ========================================================
   STYLES
======================================================== */

const styles = {
  section: {
    position: "relative",
    minHeight: "100svh",
    overflow: "hidden",
    background: "#111111",
    color: "#f5f5f7",
  } as React.CSSProperties,

  ambient: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    background:
      "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.055), transparent 55%)",
  } as React.CSSProperties,

  content: {
    position: "relative",
    zIndex: 1,
    maxWidth: 1440,
    margin: "0 auto",
    padding: "clamp(5rem, 10vh, 8rem) clamp(1.25rem, 5vw, 5rem)",
  } as React.CSSProperties,

  eyebrow: {
    color: "#a1a1a6",
    fontSize: "0.75rem",
    fontWeight: 600,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    marginBottom: "1rem",
  } as React.CSSProperties,

  heading: {
    fontSize: "clamp(2.6rem, 5vw, 4.5rem)",
    fontWeight: 500,
    lineHeight: 1.05,
    letterSpacing: "-0.055em",
    margin: 0,
  } as React.CSSProperties,

  description: {
    color: "#a1a1a6",
    fontSize: "1rem",
    lineHeight: 1.7,
    maxWidth: 540,
    margin: "1.25rem auto 0",
  } as React.CSSProperties,

  tabTrack: {
    position: "relative",
    display: "inline-flex",
    padding: 4,
    gap: 4,
    borderRadius: 999,
    background: "rgba(255,255,255,0.055)",
    border: "1px solid rgba(255,255,255,0.09)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
  } as React.CSSProperties,

  tabButton: {
    position: "relative",
    zIndex: 1,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    minWidth: 140,
    padding: "0.8rem 1.4rem",
    border: 0,
    borderRadius: 999,
    background: "transparent",
    fontSize: "0.9rem",
    fontWeight: 500,
    cursor: "pointer",
    transition: "color 0.3s ease",
  } as React.CSSProperties,

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
    gap: "1rem",
  } as React.CSSProperties,

  card: {
    display: "block",
    minWidth: 0,
    color: "inherit",
    textDecoration: "none",
    overflow: "hidden",
    background: "#191919",
    border: "1px solid rgba(255,255,255,0.09)",
    borderRadius: 16,
    transition:
      "border-color 0.3s ease, background 0.3s ease, transform 0.3s ease",
  } as React.CSSProperties,

  imageArea: {
    position: "relative",
    aspectRatio: "0.88 / 1",
    overflow: "hidden",
    background: "#222222",
  } as React.CSSProperties,

  image: {
    display: "block",
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.55s cubic-bezier(0.2, 0.75, 0.25, 1)",
  } as React.CSSProperties,

  imageOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to top, rgba(0,0,0,0.55), transparent 55%)",
    pointerEvents: "none",
  } as React.CSSProperties,

  cardFooter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    minHeight: 66,
    padding: "1rem",
  } as React.CSSProperties,

  cardTitle: {
    margin: 0,
    fontSize: "0.9rem",
    lineHeight: 1.4,
    fontWeight: 500,
    color: "#e5e5e7",
  } as React.CSSProperties,

  arrow: {
    flexShrink: 0,
    color: "#a1a1a6",
    transition: "transform 0.3s ease, color 0.3s ease",
  } as React.CSSProperties,

  pagination: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  } as React.CSSProperties,

  dot: {
    height: 5,
    border: 0,
    borderRadius: 99,
    padding: 0,
    cursor: "pointer",
    transition:
      "width 0.35s ease, background 0.35s ease, opacity 0.35s ease",
  } as React.CSSProperties,
};

/* ========================================================
   CATEGORY CARD
======================================================== */

function CategoryCard({ category }: { category: Category }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={category.href ?? "/produktai"}
      style={styles.card}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      onMouseDown={(event) => {
        if (event.button === 0) {
          // Preserve the normal Next.js link behaviour.
        }
      }}
      className="product-category-card"
    >
      <div style={styles.imageArea}>
        <img
          src={category.img}
          alt={category.title}
          loading="lazy"
          style={{
            ...styles.image,
            transform: hovered ? "scale(1.055)" : "scale(1)",
          }}
        />

        <div style={styles.imageOverlay} />

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 2,
            background: "#f5f5f7",
            transform: hovered ? "scaleX(1)" : "scaleX(0)",
            transformOrigin: "left",
            transition: "transform 0.35s ease",
          }}
        />
      </div>

      <div style={styles.cardFooter}>
        <h3
          style={{
            ...styles.cardTitle,
            color: hovered ? "#ffffff" : "#d1d1d6",
            transition: "color 0.25s ease",
          }}
        >
          {category.title}
        </h3>

        <ArrowUpRight
          size={17}
          style={{
            ...styles.arrow,
            color: hovered ? "#ffffff" : "#77777e",
            transform: hovered
              ? "translate(2px, -2px)"
              : "translate(0, 0)",
          }}
        />
      </div>
    </Link>
  );
}

/* ========================================================
   ANIMATED TAB SWITCHER
======================================================== */

function TabSwitcher({
  activeTab,
  onTabChange,
}: {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}) {
  const tabs: { key: Tab; label: string }[] = [
    { key: "interjeras", label: "Interjeras" },
    { key: "fasadas", label: "Fasadas" },
  ];

  return (
    <div style={styles.tabTrack} role="tablist" aria-label="Produktų sritis">
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 4,
          bottom: 4,
          left: activeTab === "interjeras" ? 4 : "calc(50% + 0px)",
          width: "calc(50% - 4px)",
          borderRadius: 999,
          background: "#f5f5f7",
          boxShadow: "0 2px 8px rgba(0,0,0,0.16)",
          transition:
            "left 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      />

      {tabs.map((tab) => {
        const active = activeTab === tab.key;

        return (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onTabChange(tab.key)}
            style={{
              ...styles.tabButton,
              color: active ? "#171717" : "#a1a1a6",
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

/* ========================================================
   PAGINATION
======================================================== */

function PageDots({
  total,
  current,
  onChange,
}: {
  total: number;
  current: number;
  onChange: (index: number) => void;
}) {
  if (total <= 1) return null;

  return (
    <div style={styles.pagination} aria-label="Kategorijų puslapiai">
      {Array.from({ length: total }, (_, index) => (
        <button
          key={index}
          type="button"
          aria-label={`Rodyti kategorijų puslapį ${index + 1}`}
          aria-current={current === index ? "step" : undefined}
          onClick={() => onChange(index)}
          style={{
            ...styles.dot,
            width: current === index ? 24 : 6,
            background:
              current === index
                ? "#f5f5f7"
                : "rgba(255,255,255,0.25)",
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
  const [activeTab, setActiveTab] = useState<Tab>("interjeras");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const gridRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Timeline | null>(null);
  const transitionLock = useRef(false);

  const categories = activeTab === "interjeras" ? interieras : fasadas;
  const ITEMS = 6;
  const pageCount = Math.ceil(categories.length / ITEMS);
  const maxIndex = Math.max(0, pageCount - 1);

  const visible = categories.slice(
    currentIndex * ITEMS,
    (currentIndex + 1) * ITEMS,
  );

  /* --------------------------------------------------------
     PAGE TRANSITION
  -------------------------------------------------------- */

  const animateToPage = useCallback(
    (newIndex: number) => {
      if (
        transitionLock.current ||
        newIndex === currentIndex ||
        newIndex < 0 ||
        newIndex > maxIndex
      ) {
        return;
      }

      const grid = gridRef.current;

      if (!grid) {
        setCurrentIndex(newIndex);
        return;
      }

      transitionLock.current = true;
      setIsTransitioning(true);

      animationRef.current?.kill();

      animationRef.current = gsap.timeline({
        onComplete: () => {
          transitionLock.current = false;
          setIsTransitioning(false);
        },
      });

      animationRef.current
        .to(grid, {
          opacity: 0,
          y: -12,
          filter: "blur(4px)",
          duration: 0.22,
          ease: "power2.in",
        })
        .add(() => {
          setCurrentIndex(newIndex);
        })
        .set(grid, {
          y: 12,
          filter: "blur(4px)",
        })
        .to(grid, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.38,
          ease: "power3.out",
        });
    },
    [currentIndex, maxIndex],
  );

  /* --------------------------------------------------------
     TAB TRANSITION
  -------------------------------------------------------- */

  const handleTabChange = useCallback(
    (tab: Tab) => {
      if (tab === activeTab || transitionLock.current) return;

      const grid = gridRef.current;

      animationRef.current?.kill();

      transitionLock.current = true;
      setIsTransitioning(true);

      if (!grid) {
        setActiveTab(tab);
        setCurrentIndex(0);
        transitionLock.current = false;
        setIsTransitioning(false);
        return;
      }

      animationRef.current = gsap.timeline({
        onComplete: () => {
          transitionLock.current = false;
          setIsTransitioning(false);
        },
      });

      animationRef.current
        .to(grid, {
          opacity: 0,
          y: -16,
          scale: 0.99,
          filter: "blur(5px)",
          duration: 0.24,
          ease: "power2.in",
        })
        .add(() => {
          setActiveTab(tab);
          setCurrentIndex(0);
        })
        .set(grid, {
          y: 16,
          scale: 0.99,
          filter: "blur(5px)",
        })
        .to(grid, {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.48,
          ease: "power3.out",
        });
    },
    [activeTab],
  );

  /* --------------------------------------------------------
     RESET PAGE INDEX IF COLLECTION CHANGES
  -------------------------------------------------------- */

  useEffect(() => {
    setCurrentIndex((index) => Math.min(index, maxIndex));
  }, [maxIndex]);

  /* --------------------------------------------------------
     INITIAL ENTRANCE
  -------------------------------------------------------- */

  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        grid,
        {
          opacity: 0,
          y: 18,
          filter: "blur(5px)",
        },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.75,
          ease: "power3.out",
          delay: 0.1,
        },
      );
    }, grid);

    return () => context.revert();
  }, []);

  /* --------------------------------------------------------
     CLEAN UP
  -------------------------------------------------------- */

  useEffect(() => {
    return () => {
      animationRef.current?.kill();
    };
  }, []);

  /* --------------------------------------------------------
     RENDER
  -------------------------------------------------------- */

  return (
    <section style={styles.section}>
      <div style={styles.ambient} />

      <div style={styles.content}>
        <header
          style={{
            textAlign: "center",
            marginBottom: "2.75rem",
          }}
        >
          <p style={styles.eyebrow}>DekoratoriaiLT</p>

          <h1 style={styles.heading}>Produktų kategorijos</h1>

          <p style={styles.description}>
            Atraskite interjero ir fasado dekoratyvinius elementus,
            sukurtus išskirtinei architektūrai.
          </p>
        </header>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1.5rem",
            marginBottom: "2.5rem",
          }}
        >
          <TabSwitcher
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              color: "#a1a1a6",
              fontSize: "0.8rem",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#f5f5f7",
              }}
            />

            {activeTab === "interjeras"
              ? "Interjero dekoras"
              : "Fasado dekoras"}
          </div>
        </div>

        <div
          ref={gridRef}
          style={{
            opacity: 1,
            willChange: "opacity, transform, filter",
          }}
        >
          <div style={styles.grid} className="product-category-grid">
            {visible.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>

        <footer
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 20,
            marginTop: "2rem",
          }}
        >
          <span
            style={{
              color: "#77777e",
              fontSize: "0.8rem",
            }}
          >
            {String(currentIndex + 1).padStart(2, "0")} /{" "}
            {String(pageCount).padStart(2, "0")}
          </span>

          <PageDots
            total={pageCount}
            current={currentIndex}
            onChange={animateToPage}
          />

          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              aria-label="Ankstesnės kategorijos"
              disabled={currentIndex === 0 || isTransitioning}
              onClick={() => animateToPage(currentIndex - 1)}
              style={navigationButtonStyle(
                currentIndex === 0 || isTransitioning,
              )}
            >
              <ChevronLeft size={19} />
            </button>

            <button
              type="button"
              aria-label="Kitos kategorijos"
              disabled={currentIndex >= maxIndex || isTransitioning}
              onClick={() => animateToPage(currentIndex + 1)}
              style={navigationButtonStyle(
                currentIndex >= maxIndex || isTransitioning,
              )}
            >
              <ChevronRight size={19} />
            </button>
          </div>
        </footer>
      </div>

      <style jsx global>{`
        .product-category-grid {
          grid-template-columns: repeat(6, minmax(0, 1fr));
        }

        .product-category-card:hover {
          background: #202020 !important;
          border-color: rgba(255, 255, 255, 0.24) !important;
          transform: translateY(-3px);
        }

        .product-category-card:focus-visible {
          outline: 2px solid #f5f5f7;
          outline-offset: 4px;
        }

        @media (max-width: 1100px) {
          .product-category-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 600px) {
          .product-category-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 0.75rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .product-category-card,
          .product-category-card img {
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}

function navigationButtonStyle(disabled: boolean): React.CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    padding: 0,
    color: "#f5f5f7",
    background: "rgba(255,255,255,0.055)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "50%",
    cursor: disabled ? "default" : "pointer",
    opacity: disabled ? 0.3 : 1,
    transition: "opacity 0.25s ease, background 0.25s ease",
  };
}