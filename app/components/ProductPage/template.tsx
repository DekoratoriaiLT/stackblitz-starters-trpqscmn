'use client';

import { useEffect, useRef } from 'react';
import { ProductGallery } from './ProductGallery';
import { ProductInfo } from './ProductInfo';
import { ProductFeatures } from './ProductFeatures';
import { AddToCartButton } from './AddToCartButton';
import ReviewsSection from './ReviewsSection';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const R2_BASE_URL = 'https://pub-262c7ff9747743f0853580fc0debb426.r2.dev';

interface ImageData {
  filename: string;
  url: string;
  local_path: string;
}

interface Product {
  name: string;
  url: string;
  code: string | null;
  category: string;
  images: ImageData[];
  details: Record<string, string>;
  flexible_analog_exists: boolean;
  mounting_instructions: string;
}

interface ProductPageProps {
  product: Product;
}

export function ProductPageTemplate({ product }: ProductPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      gsap.from(headerRef.current, {
        y: -20,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
      });

      // Gallery animation
      gsap.from(galleryRef.current, {
        x: -50,
        opacity: 0,
        duration: 0.8,
        delay: 0.2,
        ease: 'power3.out',
      });

      // Info animation
      gsap.from(infoRef.current, {
        x: 50,
        opacity: 0,
        duration: 0.8,
        delay: 0.3,
        ease: 'power3.out',
      });

      // Features scroll animation
      gsap.from(featuresRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: featuresRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const urlCode = product.url?.split('/').filter(Boolean).pop() ?? null;
  const resolvedProductCode: string =
    product.code ?? (urlCode ? urlCode.replace(/-/g, '.') : product.name.replace(/\s+/g, '-'));

  return (
    <div ref={containerRef} className="min-h-screen bg-[#F5F5F0]">
      <div ref={headerRef} className="sticky top-0 z-50 bg-[#F5F5F0] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <a
              href={`/produktai/${product.category}`}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </a>
            <h1 className="text-lg font-medium text-gray-800">
              {product.category.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
            </h1>
            <div className="w-6"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div ref={galleryRef}>
            <ProductGallery
              productName={product.name}
              category={product.category}
              details={product.details}
            />
          </div>

          <div ref={infoRef}>
            <ProductInfo
              name={product.name}
              category={product.category}
              details={product.details}
              url={product.url}
              code={resolvedProductCode}
            />

            <div className="mt-8">
              <AddToCartButton product={product} />
            </div>
          </div>
        </div>

        <div ref={featuresRef} className="mb-16">
          <ProductFeatures
            flexibleAnalogExists={product.flexible_analog_exists}
            mountingInstructions={product.mounting_instructions}
          />
        </div>
      </div>

      <ReviewsSection
        key={`reviews-${resolvedProductCode}`}
        productCode={resolvedProductCode}
        category={product.category}
      />
    </div>
  );
}