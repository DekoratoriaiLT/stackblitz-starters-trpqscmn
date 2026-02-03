'use client';

import React, { useState } from 'react';
import { X, Minus, Plus } from 'lucide-react';

interface MetreInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** metre mode: passes a number (metres). flexible mode: passes { rigid, flexible } */
  onConfirm: (value: number | { rigid: number; flexible: number }) => void;
  productName: string;
  pricePerMetre: number;
  /** "metre" = stepper in 2 m steps | "flexible" = rigid + bendy steppers */
  mode?: 'metre' | 'flexible';
}

export default function MetreInputModal({
  isOpen,
  onClose,
  onConfirm,
  productName,
  pricePerMetre,
  mode = 'metre',
}: MetreInputModalProps) {
  /* ===== Metre mode state (steps by 2) ===== */
  const [metres, setMetres] = useState<number>(2); // minimum 2 m

  /* ===== Flexible mode state ===== */
  const [rigidCount, setRigidCount] = useState(1);
  const [flexibleCount, setFlexibleCount] = useState(0);

  if (!isOpen) return null;

  /* ===== Shared stepper component ===== */
  const Stepper = ({
    label,
    count,
    onDec,
    onInc,
    disableDec,
    disableInc,
  }: {
    label: string;
    count: number;
    onDec: () => void;
    onInc: () => void;
    disableDec?: boolean;
    disableInc?: boolean;
  }) => (
    <div className="flex items-center justify-between">
      <span className="text-gray-700 font-medium text-sm">{label}</span>
      <div className="flex items-center gap-3">
        <button
          onClick={onDec}
          disabled={disableDec}
          className="w-9 h-9 rounded-lg border border-gray-300 bg-gray-50 flex items-center justify-center
                     hover:border-emerald-500 hover:bg-emerald-50 transition-colors
                     disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Minus size={16} className="text-gray-700" />
        </button>
        <div className="w-10 text-center">
          <span className="text-xl font-bold text-gray-900">{count}</span>
        </div>
        <button
          onClick={onInc}
          disabled={disableInc}
          className="w-9 h-9 rounded-lg border border-gray-300 bg-gray-50 flex items-center justify-center
                     hover:border-emerald-500 hover:bg-emerald-50 transition-colors
                     disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Plus size={16} className="text-gray-700" />
        </button>
      </div>
    </div>
  );

  /* ============================================================
     METRE MODE
     ============================================================ */
  if (mode === 'metre') {
    // Calculate total metres (quantity * 2m per unit)
    const totalMetres = metres;
    const units = metres / 2; // Number of 2m units
    const totalPrice = units * pricePerMetre;

    const handleMetreConfirm = () => {
      onConfirm(metres);
      setMetres(2); // reset for next open
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>

          {/* Header */}
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Pasirinkite metražą
          </h2>
          <p className="text-gray-500 mb-6">{productName}</p>

          {/* Metre stepper (steps by 2) */}
          <div className="mb-6">
            <Stepper
              label="Metrai (žingsnis = 2 m)"
              count={metres}
              onDec={() => setMetres((prev) => Math.max(2, prev - 2))}
              onInc={() => setMetres((prev) => Math.min(100, prev + 2))}
              disableDec={metres <= 2}
              disableInc={metres >= 100}
            />
          </div>

          {/* Price summary */}
          {pricePerMetre > 0 && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center text-sm text-gray-600 mb-1">
                <span>Kaina už 1 vienetą (2 m)</span>
                <span className="font-semibold">€{pricePerMetre.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-600 mb-1">
                <span>Pasirinkta metrų</span>
                <span className="font-semibold">{totalMetres} m</span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-600 mb-1">
                <span>Vienetų (po 2 m)</span>
                <span className="font-semibold">{units} vnt</span>
              </div>
              <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Viso:</span>
                <span className="text-2xl font-bold text-emerald-600">
                  €{totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Atšaukti
            </button>
            <button
              onClick={handleMetreConfirm}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold rounded-lg shadow-lg transition-all"
            >
              Pridėti į krepšelį
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ============================================================
     FLEXIBLE MODE (rigid + bendy)
     ============================================================ */
  const canConfirm = rigidCount + flexibleCount > 0;
  const totalUnits = rigidCount + flexibleCount;
  const totalPrice = totalUnits * pricePerMetre;

  const handleFlexConfirm = () => {
    onConfirm({ rigid: rigidCount, flexible: flexibleCount });
    setRigidCount(1);
    setFlexibleCount(0);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-900 mb-1">
          Yra lankstus analogas
        </h2>
        <p className="text-gray-500 mb-2">{productName}</p>
        <p className="text-xs text-gray-500 mb-6">Kiekvienas vienetas = 2 m</p>

        {/* Steppers */}
        <div className="flex flex-col gap-4 mb-6">
          <Stepper
            label="Nelankstus (vnt)"
            count={rigidCount}
            onDec={() => setRigidCount((prev) => Math.max(0, prev - 1))}
            onInc={() => setRigidCount((prev) => Math.min(20, prev + 1))}
            disableDec={rigidCount <= 0}
            disableInc={rigidCount >= 20}
          />
          <div className="border-t border-gray-200" />
          <Stepper
            label="Lankstus (vnt)"
            count={flexibleCount}
            onDec={() => setFlexibleCount((prev) => Math.max(0, prev - 1))}
            onInc={() => setFlexibleCount((prev) => Math.min(20, prev + 1))}
            disableDec={flexibleCount <= 0}
            disableInc={flexibleCount >= 20}
          />
        </div>

        {/* Price summary */}
        {pricePerMetre > 0 && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center text-sm text-gray-600 mb-1">
              <span>Kaina už 1 vienetą (2 m)</span>
              <span className="font-semibold">€{pricePerMetre.toFixed(2)}</span>
            </div>
            {rigidCount > 0 && (
              <div className="flex justify-between items-center text-sm text-gray-600 mb-1">
                <span>Nelankstus: {rigidCount} vnt × 2m = {rigidCount * 2}m</span>
                <span className="font-semibold">€{(pricePerMetre * rigidCount).toFixed(2)}</span>
              </div>
            )}
            {flexibleCount > 0 && (
              <div className="flex justify-between items-center text-sm text-gray-600 mb-1">
                <span>Lankstus: {flexibleCount} vnt × 2m = {flexibleCount * 2}m</span>
                <span className="font-semibold">€{(pricePerMetre * flexibleCount).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between items-center text-sm text-gray-600 mb-1">
              <span>Iš viso: {totalUnits} vnt = {totalUnits * 2}m</span>
              <span className="font-semibold text-emerald-600">{totalUnits} vnt</span>
            </div>
            <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">Viso:</span>
              <span className="text-2xl font-bold text-emerald-600">
                €{totalPrice.toFixed(2)}
              </span>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Atšaukti
          </button>
          <button
            onClick={handleFlexConfirm}
            disabled={!canConfirm}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold rounded-lg shadow-lg transition-all
                       disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
          >
            Pridėti į krepšelį
          </button>
        </div>
      </div>
    </div>
  );
}