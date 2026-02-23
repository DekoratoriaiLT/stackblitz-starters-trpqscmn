'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface ProductInfoProps {
  name: string;
  category: string;
  details: Record<string, string>;
  url: string;
  code: string;
}

export function ProductInfo({ name, category, details, url, code }: ProductInfoProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const priceRef = useRef<HTMLDivElement>(null);
  const specsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const elements = [titleRef.current, priceRef.current, specsRef.current].filter(Boolean);

    gsap.fromTo(
      elements,
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
      }
    );
  }, []);

  // Extract price from details
  const price = details?.['Kaina'] || details?.['price'] || null;
  const priceValue = price
    ? typeof price === 'string'
      ? parseFloat(price.replace(/[€\s,]/g, '.'))
      : price
    : null;

  return (
    <div className="space-y-8">
      {/* Product Title */}
      <div>
        <h1 ref={titleRef} className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 leading-tight">
          {name}
        </h1>
        {code && (
          <div className="inline-block bg-gray-200 text-gray-700 text-sm font-medium px-4 py-1.5 rounded-full">
            {code}
          </div>
        )}
      </div>

      {/* Price */}
      {priceValue && (
        <div ref={priceRef} className="flex items-baseline gap-4">
          <span className="text-4xl font-bold text-gray-900">€{priceValue.toFixed(2)}</span>
          {/* Optional: show original price if there's a discount */}
        </div>
      )}

      {/* Specifications */}
      <div ref={specsRef} className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Techninės charakteristikos</h2>

        <div className="grid grid-cols-3 gap-4">
          {Object.entries(details)
            .filter(([key]) => !['Kaina', 'price'].includes(key))
            .slice(0, 3)
            .map(([key, value], idx) => (
              <div key={idx} className="text-center">
                <p className="text-sm text-gray-500 mb-1">{key}</p>
                <p className="text-lg font-semibold text-gray-900">{value}</p>
              </div>
            ))}
        </div>

        {/* Full specs accordion */}
        {Object.keys(details).length > 4 && (
          <details className="mt-6 group">
            <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors list-none flex items-center justify-between py-3 border-t border-gray-200">
              <span>Visos charakteristikos</span>
              <svg
                className="w-5 h-5 transform transition-transform group-open:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="mt-4 space-y-3 pb-4">
              {Object.entries(details)
                .filter(([key]) => !['Kaina', 'price'].includes(key))
                .map(([key, value], idx) => (
                  <div key={idx} className="flex justify-between text-sm border-b border-gray-100 pb-2">
                    <span className="text-gray-600">{key}</span>
                    <span className="font-medium text-gray-900">{value}</span>
                  </div>
                ))}
            </div>
          </details>
        )}
      </div>
    </div>
  );
}