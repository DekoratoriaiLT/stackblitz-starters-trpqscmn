"use client";

import React, { useState } from "react";

interface ProductInfoProps {
  name: string;
  category: string;
  details: Record<string, string>;
  url: string;
  code: string | null;
}

const normalizeKey = (value: string) =>
  value
    .toLocaleLowerCase("lt-LT")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const isPriceKey = (key: string) =>
  ["kaina", "price"].includes(normalizeKey(key));

const isBendingKey = (key: string) => {
  const normalized = normalizeKey(key);
  return (
    normalized.includes("lenkimo spindulys") ||
    normalized.includes("lenkimo radiusas")
  );
};

function formatPrice(value?: string): string {
  if (!value) return "";

  const cleaned = value.replace(/[€\s]/g, "").replace(",", ".");
  const parsed = Number.parseFloat(cleaned);

  return Number.isFinite(parsed)
    ? `${parsed.toLocaleString("lt-LT", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })} €`
    : value;
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  name,
  category,
  details,
  url,
  code,
}) => {
  const [showAllDetails, setShowAllDetails] = useState(true);

  const entries = Object.entries(details ?? {}).filter(
    ([key, value]) =>
      !isPriceKey(key) &&
      value !== undefined &&
      value !== null &&
      String(value).trim() !== ""
  );

  const price =
    details?.Kaina ??
    details?.kaina ??
    details?.price ??
    "";

  const featuredDetails = entries.slice(0, 3);

  return (
    <section className="w-full text-[#f5f5f7]">
      <div className="mb-5">
        <p className="mb-3 text-xs uppercase tracking-[0.18em] text-[#a1a1a6]">
          {category.replace(/-/g, " ")}
        </p>

        <h1 className="text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
          {name}
        </h1>

        {code && (
          <p className="mt-3 text-sm text-[#8e8e93]">
            Prekės kodas: {code}
          </p>
        )}
      </div>

      {price && (
        <div className="mb-7 border-b border-white/10 pb-6">
          <p className="text-3xl font-medium tracking-tight">
            {formatPrice(price)}
          </p>
        </div>
      )}

      {featuredDetails.length > 0 && (
        <div className="mb-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {featuredDetails.map(([key, value]) => (
            <div
              key={key}
              className="rounded-xl border border-white/[0.09] bg-[#191919] p-4"
            >
              <p className="mb-2 text-xs text-[#8e8e93]">{key}</p>
              <p className="text-sm font-medium text-[#f5f5f7]">
                {String(value)}
              </p>
            </div>
          ))}
        </div>
      )}

      {entries.length > 0 && (
        <div className="mb-7 overflow-hidden rounded-xl border border-white/[0.09] bg-[#191919]">
          <button
            type="button"
            onClick={() => setShowAllDetails((current) => !current)}
            aria-expanded={showAllDetails}
            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-white/[0.04]"
          >
            <span className="font-medium">Visos charakteristikos</span>

            <span className="flex items-center gap-2 text-sm text-[#a1a1a6]">
              {showAllDetails ? "Suskleisti" : "Rodyti"}
              <span
                className={`text-lg transition-transform duration-200 ${
                  showAllDetails ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              >
               ⌄
              </span>
            </span>
          </button>

          {showAllDetails && (
            <dl className="border-t border-white/[0.08] px-5">
              {entries.map(([key, value]) => {
                const bendingProperty = isBendingKey(key);

                return (
                  <div
                    key={key}
                    className="grid grid-cols-1 gap-1 border-b border-white/[0.07] py-4 last:border-b-0 sm:grid-cols-2 sm:gap-5"
                  >
                    <dt className="text-sm text-[#a1a1a6]">
                      {key}
                      {bendingProperty && (
                        <span className="mt-1 block text-xs text-[#8e8e93]">
                          Taikoma tik pasirinkus lankstų variantą
                        </span>
                      )}
                    </dt>

                    <dd className="text-sm font-medium text-[#f5f5f7] sm:text-right">
                      {String(value)}
                    </dd>
                  </div>
                );
              })}
            </dl>
          )}
        </div>
      )}

      <meta itemProp="url" content={url} />
    </section>
  );
};

export default ProductInfo;