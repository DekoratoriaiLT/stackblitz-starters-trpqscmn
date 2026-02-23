'use client';

import { useCart } from '@/app/contexts/CartContext';
import { useState, useRef, useEffect } from 'react';
import MetreInputModal from '@/app/components/Produktai/MetreInputModal/MetreInputModal';
import SimpleQuantityModal from '@/app/components/Produktai/SimpleQuantityModal/SimpleQuantityModal';
import { getExistingImagePaths } from '@/app/components/Produktai/ImagePath/getImagePath';
import gsap from 'gsap';

const PRICE_PER_METRE_CATEGORIES = new Set(['lubu-apvadai', 'moulding', 'grindjuostes', 'grindu-apvadai']);

interface Product {
  name: string;
  url: string;
  code: string | null;
  category: string;
  images: Array<{ filename: string; url: string; local_path: string }> | null | undefined;
  details: Record<string, string>;
  flexible_analog_exists?: boolean;
}

interface AddToCartButtonProps {
  product: Product;
}

function getPrice(price: string | number | undefined): number {
  if (!price) return 0;
  if (typeof price === 'number') return price;
  const cleaned = price.replace(/[€\s]/g, '').replace(',', '.');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [showMetreModal, setShowMetreModal] = useState(false);
  const [showSimpleModal, setShowSimpleModal] = useState(false);
  const [resolvedImages, setResolvedImages] = useState<string[]>([]);
  const [resolvedPrice, setResolvedPrice] = useState<number>(0);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // On mount: resolve images + price the same way MainContent does
  useEffect(() => {
    async function resolveProductData() {
      // 1. Resolve images via getExistingImagePaths (same as MainContent)
      const paths = await getExistingImagePaths(
        product.name,
        product.category,
        undefined,
        5,
        false
      );
      setResolvedImages(paths);

      // 2. Load price from the category JSON (same pattern as MainContent)
      try {
        let dataModule;
        try {
          dataModule = await import(`@/app/data/${product.category}/${product.category}.json`);
        } catch {
          dataModule = await import(`@/app/data/${product.category}.json`);
        }

        const rawData = dataModule.default;
        const productsArray: any[] = rawData.products || rawData;

        if (Array.isArray(productsArray)) {
          const matched = productsArray.find((p: any) => {
            if (product.code && p.code === product.code) return true;
            if (p.name === product.name) return true;
            return false;
          });

          if (matched && typeof matched.price === 'number') {
            setResolvedPrice(matched.price);
            return;
          }
        }
      } catch {
        // fall through to details fallback
      }

      // 3. Fallback: parse price from product.details
      const detailPrice = product.details?.['Kaina'] || product.details?.['price'];
      setResolvedPrice(getPrice(detailPrice));
    }

    resolveProductData();
  }, [product.name, product.category, product.code, product.details]);

  useEffect(() => {
    if (buttonRef.current) {
      gsap.fromTo(
        buttonRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, delay: 0.5, ease: 'power3.out' }
      );
    }
  }, []);

  const isPricePerMetre = PRICE_PER_METRE_CATEGORIES.has(product.category);
  const hasFlexibleAnalog = product.flexible_analog_exists === true;

  const handleAddToCart = () => {
    if (isPricePerMetre) {
      setShowMetreModal(true);
    } else {
      setShowSimpleModal(true);
    }
  };

  const addDirectToCart = (isFlexible: boolean = false, quantity: number = 1) => {
    setIsAdding(true);

    const baseId = product.code || product.url;
    const uniqueId = hasFlexibleAnalog
      ? isFlexible ? `${baseId}-flexible` : `${baseId}-rigid`
      : baseId;

    const cartProduct = {
      id: uniqueId,
      title: isFlexible
        ? `${product.name} (Lankstus)`
        : hasFlexibleAnalog
        ? `${product.name} (Nelankstus)`
        : product.name,
      images: resolvedImages,
      img: resolvedImages[0] || '',
      description: product.category,
      category: product.category,
      price: resolvedPrice,
      ilgis: parseFloat(product.details?.['Ilgis'] || '0'),
      aukstis: parseFloat(product.details?.['Aukštis'] || product.details?.['Aukstis'] || '0'),
      flexible_analog_exists: product.flexible_analog_exists,
      isFlexible,
      variant: hasFlexibleAnalog
        ? (isFlexible ? 'lankstus' : 'nelankstus') as 'lankstus' | 'nelankstus'
        : undefined,
    };

    for (let i = 0; i < quantity; i++) {
      addToCart(cartProduct);
    }

    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  const handleMetreConfirm = (value: number | { rigid: number; flexible: number }) => {
    if (typeof value === 'number') {
      const units = value / 2;
      addDirectToCart(false, units);
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
        onClick={handleAddToCart}
        disabled={isAdding}
        className="w-full bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white font-bold py-5 px-8 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl"
      >
        {isAdding ? (
          <>
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Pridedama...</span>
          </>
        ) : (
          <span className="text-lg">Pridėti į krepšelį</span>
        )}
      </button>

      <MetreInputModal
        isOpen={showMetreModal}
        onClose={() => setShowMetreModal(false)}
        onConfirm={handleMetreConfirm}
        productName={product.name}
        pricePerMetre={resolvedPrice}
        mode={hasFlexibleAnalog ? 'flexible' : 'metre'}
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