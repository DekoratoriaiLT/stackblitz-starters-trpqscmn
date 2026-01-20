import { ProductGallery } from './ProductGallery';
import { ProductInfo } from './ProductInfo';
import { ProductFeatures } from './ProductFeatures';
import { AddToCartButton } from './AddToCartButton';
import ReviewsSection from './ReviewsSection';

const R2_BASE_URL =
  'https://pub-262c7ff9747743f0853580fc0debb426.r2.dev';

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

interface LubiniaiApvadaiTemplateProps {
  product: Product;
}

export function LubiniaiApvadaiTemplate({
  product,
}: LubiniaiApvadaiTemplateProps) {
  // Extract the code from URL if needed (e.g. 1-50-100)
  const urlCode =
    product.url?.split('/').filter(Boolean).pop() ?? null;

  // Resolve product code to ALWAYS be a string
  const resolvedProductCode: string =
    product.code ??
    (urlCode
      ? urlCode.replace(/-/g, '.')
      : product.name.replace(/\s+/g, '-'));

  // Optional: model path (safe string)
  const modelPath = `${R2_BASE_URL}/lubu-apvadai/${resolvedProductCode}.obj`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Breadcrumbs */}
      <div className="bg-slate-900/80 border-b border-slate-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <nav className="flex items-center space-x-3 text-sm">
            <a
              href="/"
              className="text-slate-400 hover:text-emerald-400 transition-colors font-medium"
            >
              Pagrindinis
            </a>
            <span className="text-slate-600">/</span>
            <a
              href="/produktai"
              className="text-slate-400 hover:text-emerald-400 transition-colors font-medium"
            >
              Produktai
            </a>
            <span className="text-slate-600">/</span>
            <a
              href="/produktai/lubu-apvadai"
              className="text-slate-400 hover:text-emerald-400 transition-colors font-medium"
            >
              Lubų apvadai
            </a>
            <span className="text-slate-600">/</span>
            <span className="text-white font-bold">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <ProductGallery
              productName={product.name}
              category={product.category}
            />
          </div>

          <div>
            <ProductInfo
              name={product.name}
              category={product.category}
              details={product.details}
              url={product.url}
            />

            <div className="mt-8">
              <AddToCartButton product={product} />
            </div>
          </div>
        </div>

        <div className="mb-16">
          <ProductFeatures
            flexibleAnalogExists={product.flexible_analog_exists}
            mountingInstructions={product.mounting_instructions}
          />
        </div>
      </div>

      {/* Reviews – FIXED */}
      <ReviewsSection
        key={`reviews-${resolvedProductCode}`}
        productCode={resolvedProductCode}
        category={product.category}
      />

      {/* Benefits */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-t border-slate-700/50 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center group">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-700/50 group-hover:border-emerald-400/50 transition-all duration-300 shadow-lg">
                <svg
                  className="w-10 h-10 text-emerald-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-white mb-2 text-lg">
                Nemokamas pristatymas
              </h3>
              <p className="text-slate-400">
                Užsakymams virš 1000 EUR
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-700/50 group-hover:border-blue-400/50 transition-all duration-300 shadow-lg">
                <svg
                  className="w-10 h-10 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-white mb-2 text-lg">
                Kokybės garantija
              </h3>
              <p className="text-slate-400">
                Aukščiausios kokybės medžiagos
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-700/50 group-hover:border-emerald-400/50 transition-all duration-300 shadow-lg">
                <svg
                  className="w-10 h-10 text-emerald-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-white mb-2 text-lg">
                Ekspertų pagalba
              </h3>
              <p className="text-slate-400">
                Profesionali konsultacija
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
