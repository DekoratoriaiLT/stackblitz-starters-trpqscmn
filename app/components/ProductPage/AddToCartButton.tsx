'use client';
import { useCart } from '@/app/contexts/CartContext';
import { useState } from 'react';
import MetreInputModal from '@/app/components/Produktai/MetreInputModal/MetreInputModal';
import SimpleQuantityModal from '@/app/components/Produktai/SimpleQuantityModal/SimpleQuantityModal';

const R2_BASE_URL = "https://pub-262c7ff9747743f0853580fc0debb426.r2.dev";

// Categories where the unit price is €/m and the metre modal should appear
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
  images: Array<{ filename: string; url: string; local_path: string }>;
  details: Record<string, string>;
  flexible_analog_exists?: boolean;
}

interface AddToCartButtonProps {
  product: Product;
}

// Helper function to safely get price
function getPrice(price: string | number | undefined): number {
  if (!price) return 0;
  
  // If it's already a number, return it
  if (typeof price === 'number') return price;
  
  // If it's a string, parse it (handle comma decimal separator)
  const cleaned = price.replace(/[€\s]/g, '').replace(',', '.');
  const parsed = parseFloat(cleaned);
  
  return isNaN(parsed) ? 0 : parsed;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  
  // Modal states - only one type of modal per product
  const [showMetreModal, setShowMetreModal] = useState(false);
  const [showSimpleModal, setShowSimpleModal] = useState(false);

  // Determine which modal to show
  const isPricePerMetre = PRICE_PER_METRE_CATEGORIES.has(product.category);
  const hasFlexibleAnalog = product.flexible_analog_exists === true;

  const handleAddToCart = () => {
    if (isPricePerMetre) {
      // Price-per-metre products (with flexible/rigid options) → metre modal
      setShowMetreModal(true);
    } else {
      // All other products → simple quantity modal
      setShowSimpleModal(true);
    }
  };

  const addDirectToCart = (isFlexible: boolean = false, quantity: number = 1) => {
    setIsAdding(true);
    
    // Convert R2 image URLs with category path
    const r2Images = product.images.map(img => {
      const filename = img.local_path.split('/').pop() || img.filename;
      return `${R2_BASE_URL}/${product.category}/${filename}`;
    });
    
    // Create unique ID for flexible vs rigid products
    const baseId = product.code || product.url;
    let uniqueId = baseId;
    
    if (hasFlexibleAnalog) {
      // For products with flexible analogs, add suffix to both variants
      uniqueId = isFlexible ? `${baseId}-flexible` : `${baseId}-rigid`;
    }
    
    // Transform product data to match cart Product interface
    const cartProduct = {
      id: uniqueId,
      title: product.name,
      images: r2Images,
      img: r2Images[0] || '',
      description: product.category,
      category: product.category,
      price: getPrice(product.details?.['Kaina'] || product.details?.['price']),
      ilgis: parseFloat(product.details?.['Ilgis'] || '0'),
      aukstis: parseFloat(product.details?.['Aukštis'] || '0'),
      flexible_analog_exists: product.flexible_analog_exists,
      isFlexible: isFlexible,
    };

    // Add the specified quantity
    for (let i = 0; i < quantity; i++) {
      addToCart(cartProduct);
    }

    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  // Handle metre modal confirm
  const handleMetreConfirm = (value: number | { rigid: number; flexible: number }) => {
    if (typeof value === "number") {
      // Metre mode: each 2 m = 1 standard unit
      const units = value / 2;
      addDirectToCart(false, units);
    } else {
      // Flexible mode: add rigid + flexible counts
      if (value.rigid > 0) {
        addDirectToCart(false, value.rigid);
      }
      if (value.flexible > 0) {
        addDirectToCart(true, value.flexible);
      }
    }
    setShowMetreModal(false);
  };

  // Handle simple modal confirm
  const handleSimpleConfirm = (quantity: number) => {
    addDirectToCart(false, quantity);
    setShowSimpleModal(false);
  };

  const productPrice = getPrice(product.details?.['Kaina'] || product.details?.['price']);

  return (
    <>
      <button
        onClick={handleAddToCart}
        disabled={isAdding}
        className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-emerald-500/30 transition-all duration-300 transform hover:scale-105 hover:shadow-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3"
      >
        {isAdding ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Pridedama...</span>
          </>
        ) : (
          <>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Pridėti į krepšelį</span>
          </>
        )}
      </button>

      {/* Metre modal (for price-per-metre products with flexible/rigid options) */}
      <MetreInputModal
        isOpen={showMetreModal}
        onClose={() => setShowMetreModal(false)}
        onConfirm={handleMetreConfirm}
        productName={product.name}
        pricePerMetre={productPrice}
        mode={hasFlexibleAnalog ? "flexible" : "metre"}
      />

      {/* Simple quantity modal (for all other products) */}
      <SimpleQuantityModal
        isOpen={showSimpleModal}
        onClose={() => setShowSimpleModal(false)}
        onConfirm={handleSimpleConfirm}
        productName={product.name}
        productPrice={productPrice}
      />
    </>
  );
}