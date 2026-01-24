'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';

interface MetreInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (metres: number) => void;
  productName: string;
  pricePerMetre: number;
}

export default function MetreInputModal({
  isOpen,
  onClose,
  onConfirm,
  productName,
  pricePerMetre,
}: MetreInputModalProps) {
  const [metres, setMetres] = useState<string>('2');
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    const numMetres = parseFloat(metres);

    if (isNaN(numMetres) || numMetres <= 0) {
      setError('Prašome įvesti teigiamą skaičių');
      return;
    }

    if (numMetres % 2 !== 0) {
      setError('Metražas turi būti kartotinis 2 (pvz., 2, 4, 6, 8...)');
      return;
    }

    onConfirm(numMetres);
    setMetres('2');
    setError('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMetres(e.target.value);
    setError('');
  };

  const totalPrice = (parseFloat(metres) || 0) * pricePerMetre;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Pasirinkite metražą
        </h2>

        <p className="text-gray-600 mb-6">{productName}</p>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kiek metrų?
          </label>
          <input
            type="number"
            value={metres}
            onChange={handleInputChange}
            step="2"
            min="2"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
            placeholder="Įveskite metrus (pvz., 2, 4, 6...)"
          />
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Kaina už metrą:</span>
            <span className="font-semibold">€{pricePerMetre.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Metrai:</span>
            <span className="font-semibold">{metres || 0} m</span>
          </div>
          <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between items-center">
            <span className="text-lg font-bold text-gray-900">Viso:</span>
            <span className="text-2xl font-bold text-emerald-600">
              €{totalPrice.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Atšaukti
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold rounded-lg shadow-lg transition-all"
          >
            Pridėti į krepšelį
          </button>
        </div>
      </div>
    </div>
  );
}