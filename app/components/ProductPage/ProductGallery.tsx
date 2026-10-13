"use client";

import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { getExistingImagePaths } from "@/app/components/Produktai/ImagePath/getImagePath";
import { MeasurementOverlay } from "../Produktai/MeasurementOverlay/MeasurementOverlay";
import type { ProductDimensions } from "@/app/components/Produktai/Types/types";

interface ProductGalleryProps {
  productName: string;
  category: string;
  details?: ProductDimensions;
}

export function ProductGallery({
  productName,
  category,
  details,
}: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [imagePaths, setImagePaths] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadImages() {
      setLoading(true);
      setSelectedImage(0);
      setImagePaths([]);

      try {
        const paths = await getExistingImagePaths(
          productName,
          category,
          ["100", "20", "30", "40", "600"],
          10,
          false,
        );

        if (!cancelled) setImagePaths(paths);
      } catch (error) {
        console.error("[ProductGallery] Image loading failed:", error);
        if (!cancelled) setImagePaths([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadImages();

    return () => {
      cancelled = true;
    };
  }, [productName, category]);

  const uniqueImages = useMemo(
    () => imagePaths.filter((path, index, all) => all.indexOf(path) === index),
    [imagePaths],
  );

  const safeSelectedImage = Math.min(
    selectedImage,
    Math.max(0, uniqueImages.length - 1),
  );

  const selectedPath = uniqueImages[safeSelectedImage];

  const hasWhiteBackground = (path: string) => path.includes(".40.");

  const shouldShowMeasurements = (path: string) =>
    hasWhiteBackground(path) &&
    Boolean(details?.Plotis || details?.Aukštis || details?.Aukstis);

  return (
    <div className="space-y-4">
      <div
        className={`relative aspect-square overflow-hidden rounded-3xl border border-black/[0.06] shadow-[0_20px_60px_rgba(0,0,0,0.08)] ${
          selectedPath && hasWhiteBackground(selectedPath)
            ? "bg-white"
            : "bg-gradient-to-br from-[#f4f4f5] to-[#e8e8ea]"
        }`}
      >
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-black/10 border-t-black/70" />
          </div>
        ) : selectedPath ? (
          <div
            key={selectedPath}
            className="absolute inset-0 animate-[galleryFadeIn_350ms_ease-out]"
          >
            <Image
              src={selectedPath}
              alt={`${productName} – vaizdas ${safeSelectedImage + 1}`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain p-6 sm:p-10"
            />

            {shouldShowMeasurements(selectedPath) && (
              <MeasurementOverlay
                plotis={details?.Plotis}
                aukstis={details?.Aukštis || details?.Aukstis}
                show
              />
            )}
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-[#77777e]">
            <svg
              className="h-14 w-14"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16 8.6 11.4a2 2 0 0 1 2.8 0L16 16m-2-2 1.6-1.6a2 2 0 0 1 2.8 0L20 14m-6-6h.01M6 20h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Z"
              />
            </svg>
            <p className="text-sm font-medium">Vaizdų nėra</p>
          </div>
        )}

        {!loading && uniqueImages.length > 1 && (
          <div className="absolute bottom-4 right-4 rounded-full border border-black/10 bg-white/85 px-3 py-1.5 text-xs font-medium text-black/70 backdrop-blur-md">
            {safeSelectedImage + 1} / {uniqueImages.length}
          </div>
        )}
      </div>

      {uniqueImages.length > 1 && !loading && (
        <div className="flex gap-3 overflow-x-auto px-1 pb-2 pt-1">
          {uniqueImages.map((path, index) => {
            const selected = safeSelectedImage === index;

            return (
              <button
                key={path}
                type="button"
                aria-label={`Rodyti vaizdą ${index + 1}`}
                aria-pressed={selected}
                onClick={() => setSelectedImage(index)}
                className={`relative h-[76px] w-[76px] shrink-0 overflow-hidden rounded-2xl border transition duration-250 sm:h-[92px] sm:w-[92px] ${
                  selected
                    ? "border-[#222] ring-2 ring-black/10"
                    : "border-black/10 hover:border-black/30"
                } ${hasWhiteBackground(path) ? "bg-white" : "bg-[#f0f0f1]"}`}
              >
                <Image
                  src={path}
                  alt={`${productName} – miniatiūra ${index + 1}`}
                  fill
                  sizes="92px"
                  className="object-contain p-2"
                />
              </button>
            );
          })}
        </div>
      )}

      <style jsx global>{`
        @keyframes galleryFadeIn {
          from {
            opacity: 0;
            transform: scale(0.985);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-\\[galleryFadeIn_350ms_ease-out\\] {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}