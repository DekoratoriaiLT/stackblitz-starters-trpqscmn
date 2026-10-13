"use client";

import React from "react";

interface ProductFeaturesProps {
  flexibleAnalogExists: boolean;
}

const ProductFeatures: React.FC<ProductFeaturesProps> = ({
  flexibleAnalogExists,
}) => {
  const features = [
    {
      title: "Aukščiausia kokybė",
      description:
        "Pagaminta iš aukštos kokybės medžiagų, užtikrinančių ilgaamžiškumą.",
    },
    {
      title: "Paprastas montavimas",
      description:
        "Gaminys sukurtas patogiam pritaikymui prie jūsų interjero.",
    },
    {
      title: flexibleAnalogExists ? "Lankstus variantas" : "Standus dizainas",
      description: flexibleAnalogExists
        ? "Galima pasirinkti lankstų variantą lenktiems paviršiams."
        : "Standus profilis tiesiems paviršiams ir įprastoms apdailos vietoms.",
    },
    {
      title: "Patogus pristatymas",
      description:
        "Standartinis 2000 mm ilgis, paruoštas transportavimui ir montavimui.",
    },
  ];

  return (
    <section className="bg-[#111111] py-12 text-[#f5f5f7] sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#a1a1a6]">
            Produkto privalumai
          </p>

          <h2 className="text-2xl font-medium tracking-tight sm:text-3xl">
            Kodėl verta rinktis šį gaminį?
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <article
              key={feature.title}
              className="rounded-xl border border-white/[0.09] bg-[#191919] p-6 transition-colors duration-300 hover:border-white/20"
            >
              <span className="mb-5 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-sm text-[#c7c7cc]">
                {String(index + 1).padStart(2, "0")}
              </span>

              <h3 className="mb-3 text-base font-medium">
                {feature.title}
              </h3>

              <p className="text-sm leading-6 text-[#a1a1a6]">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductFeatures;