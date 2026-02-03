'use client';

import React, { useState } from 'react';
import { X, Minus, Plus, ShoppingCart, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SimpleQuantityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (quantity: number) => void;
  productName: string;
  productPrice?: number;
}

export default function SimpleQuantityModal({
  isOpen,
  onClose,
  onConfirm,
  productName,
  productPrice,
}: SimpleQuantityModalProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(quantity);
    setQuantity(1); // Reset for next time
  };

  const handleGoToBasket = () => {
    onConfirm(quantity);
    setQuantity(1);
    router.push('/krepselis');
  };

  const totalPrice = productPrice ? productPrice * quantity : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Pridėti į krepšelį
          </h2>
          <p className="text-gray-600 text-sm">{productName}</p>
        </div>

        {/* Quantity selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Pasirinkite kiekį
          </label>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              disabled={quantity <= 1}
              className="w-12 h-12 rounded-lg border border-gray-300 bg-gray-50 flex items-center justify-center
                         hover:border-emerald-500 hover:bg-emerald-50 transition-colors
                         disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Minus size={20} className="text-gray-700" />
            </button>

            <div className="w-20 text-center">
              <span className="text-3xl font-bold text-gray-900">{quantity}</span>
            </div>

            <button
              onClick={() => setQuantity((prev) => Math.min(100, prev + 1))}
              disabled={quantity >= 100}
              className="w-12 h-12 rounded-lg border border-gray-300 bg-gray-50 flex items-center justify-center
                         hover:border-emerald-500 hover:bg-emerald-50 transition-colors
                         disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Plus size={20} className="text-gray-700" />
            </button>
          </div>
        </div>

        {/* Price summary */}
        {productPrice && productPrice > 0 && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
              <span>Kaina už vienetą</span>
              <span className="font-semibold">€{productPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
              <span>Kiekis</span>
              <span className="font-semibold">{quantity} vnt</span>
            </div>
            <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">Viso:</span>
              <span className="text-2xl font-bold text-emerald-600">
                €{totalPrice.toFixed(2)}
              </span>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleConfirm}
            className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold rounded-lg shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <ShoppingCart size={20} />
            Pridėti į krepšelį
          </button>

          <button
            onClick={handleGoToBasket}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-lg shadow-lg transition-all flex items-center justify-center gap-2"
          >
            Pirkti dabar
            <ArrowRight size={20} />
          </button>

          <button
            onClick={onClose}
            className="w-full px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Tęsti apsipirkimą
          </button>
        </div>
      </div>
    </div>
  );
}