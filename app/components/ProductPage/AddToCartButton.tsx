"use client";

import { useCart } from "@/app/contexts/CartContext";
import { useEffect, useRef, useState } from "react";
import MetreInputModal from "@/app/components/Produktai/MetreInputModal/MetreInputModal";
import SimpleQuantityModal from "@/app/components/Produktai/SimpleQuantityModal/SimpleQuantityModal";
import { getExistingImagePaths } from "@/app/components/Produktai/ImagePath/getImagePath";
import gsap from "gsap";

const PRICE_PER_METRE_CATEGORIES = new Set([
  "lubu-apvadai",
  "moulding",
  "grindjuostes",
  "grindu-apvadai",
]);

interface Product {
  name: string;
  url: string;
  code: string | null;
  category: string;
  images?: Array<{ filename: string; url: string; local_path: string }> | null;
  details: Record<string, string>;
  flexible_analog_exists?: boolean;
}

interface AddToCartButtonProps {
  product: Product;
}

function getPrice(price: string | number | undefined): number {
  if (price === undefined || price === null || price === "") return 0;
  if (typeof price === "number") return price;

  const parsed = parseFloat(price.replace(/[€\s]/g, "").replace(",", "."));
  return Number.isFinite(parsed) ? parsed : 0;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [showMetreModal, setShowMetreModal] = useState(false);
  const [showSimpleModal, setShowSimpleModal] = useState(false);
  const [resolvedImages, setResolvedImages] = useState<string[]>([]);
  const [resolvedPrice, setResolvedPrice] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let cancelled = false;

    async function resolveProductData() {
      try {
        const paths = await getExistingImagePaths(
          product.name,
          product.category,
          undefined,
          5,
          false,
        );

        if (!cancelled) setResolvedImages(paths);
      } catch {
        if (!cancelled) setResolvedImages([]);
      }

      try {
        let dataModule;

        try {
          dataModule = await import(
            `@/app/data/${product.category}/${product.category}.json`
          );
        } catch {
          dataModule = await import(`@/app/data/${product.category}.json`);
        }

        const rawData = dataModule.default;
        const productsArray = rawData.products || rawData;

        if (Array.isArray(productsArray)) {
          const matched = productsArray.find((item: any) => {
            if (product.code && item.code === product.code) return true;
            return item.name === product.name;
          });

          if (matched && typeof matched.price === "number") {
            if (!cancelled) setResolvedPrice(matched.price);
            return;
          }
        }
      } catch {
        // Use the price stored in product details if the JSON lookup fails.
      }

      const fallbackPrice =
        product.details?.["Kaina"] || product.details?.["price"];

      if (!cancelled) setResolvedPrice(getPrice(fallbackPrice));
    }

    resolveProductData();

    return () => {
      cancelled = true;
    };
  }, [product.name, product.category, product.code, product.details]);

  useEffect(() => {
  const element = buttonRef.current;
  if (!element) return;

  const tween = gsap.fromTo(
    element,
    { opacity: 0, y: 10 },
    { opacity: 1, y: 0, duration: 0.5 }
  );

  return () => {
    tween.kill();
  };
}, []);

  const isPricePerMetre = PRICE_PER_METRE_CATEGORIES.has(product.category);
  const hasFlexibleAnalog = product.flexible_analog_exists === true;

  const handleAddToCart = () => {
    if (isAdding) return;

    if (isPricePerMetre) {
      setShowMetreModal(true);
    } else {
      setShowSimpleModal(true);
    }
  };

  const addDirectToCart = (
    isFlexible = false,
    quantity = 1,
  ) => {
    if (quantity <= 0) return;

    setIsAdding(true);

    const baseId = product.code || product.url;
    const uniqueId = hasFlexibleAnalog
      ? `${baseId}-${isFlexible ? "flexible" : "rigid"}`
      : baseId;

    const cartProduct = {
      id: uniqueId,
      title: isFlexible
        ? `${product.name} (Lankstus)`
        : hasFlexibleAnalog
          ? `${product.name} (Nelankstus)`
          : product.name,
      images: resolvedImages,
      img: resolvedImages[0] || "",
      description: product.category,
      category: product.category,
      price: resolvedPrice,
      ilgis: parseFloat(product.details?.["Ilgis"] || "0"),
      aukstis: parseFloat(
        product.details?.["Aukštis"] ||
          product.details?.["Aukstis"] ||
          "0",
      ),
      flexible_analog_exists: product.flexible_analog_exists,
      isFlexible,
      variant: hasFlexibleAnalog
        ? (isFlexible ? "lankstus" : "nelankstus") as
            | "lankstus"
            | "nelankstus"
        : undefined,
    };

    for (let i = 0; i < quantity; i += 1) {
      addToCart(cartProduct);
    }

    window.setTimeout(() => setIsAdding(false), 700);
  };

  const handleMetreConfirm = (
    value: number | { rigid: number; flexible: number },
  ) => {
    if (typeof value === "number") {
      addDirectToCart(false, value / 2);
    } else {
      if (value.rigid > 0) addDirectToCart(false, value.rigid);
      if (value.flexible > 0) addDirectToCart(true, value.flexible);
    }

    setShowMetreModal(false);
  };

  const handleSimpleConfirm = (quantity: number) => {
    addDirectToCart(false, quantity);
    setShowSimpleModal(false);
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleAddToCart}
        disabled={isAdding}
        className="group flex w-full items-center justify-center gap-3 rounded-2xl border border-white/15 bg-[#f5f5f7] px-6 py-4 font-semibold text-[#151515] shadow-[0_8px_30px_rgba(0,0,0,0.16)] transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_12px_35px_rgba(0,0,0,0.22)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
      >
        {isAdding ? (
          <>
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-black/20 border-t-black" />
            <span>Pridedama...</span>
          </>
        ) : (
          <>
            <span>Pridėti į krepšelį</span>
            <svg
              className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M5 12h14m-6-6 6 6-6 6"
              />
            </svg>
          </>
        )}
      </button>

      <MetreInputModal
        isOpen={showMetreModal}
        onClose={() => setShowMetreModal(false)}
        onConfirm={handleMetreConfirm}
        productName={product.name}
        pricePerMetre={resolvedPrice}
        mode={hasFlexibleAnalog ? "flexible" : "metre"}
      />

      <SimpleQuantityModal
        isOpen={showSimpleModal}
        onClose={() => setShowSimpleModal(false)}
        onConfirm={handleSimpleConfirm}
        productName={product.name}
        productPrice={resolvedPrice}
      />
    </>
  );
}