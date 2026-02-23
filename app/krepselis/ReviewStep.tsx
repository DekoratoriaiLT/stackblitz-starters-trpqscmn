"use client";

import Image from "next/image";
import { ShoppingBag, Loader2, MapPin, User, Mail, Phone } from "lucide-react";

interface ReviewStepProps {
  cart: any[];
  cartTotal: number;
  customerDetails: { name: string; email: string; phone: string };
  addressState: {
    line_1: string;
    line_2: string;
    city: string;
    postal_code: string;
    country: string;
  };
  formatPrice: (price: number) => string;
  onPlaceOrder: () => Promise<void>;
  isSubmitting: boolean;
  setCurrentStep: (step: string) => void;
}

export default function ReviewStep({
  cart,
  cartTotal,
  customerDetails,
  addressState,
  formatPrice,
  onPlaceOrder,
  isSubmitting,
  setCurrentStep
}: ReviewStepProps) {
  const addressLine = [
    addressState.line_1,
    addressState.line_2,
    addressState.city,
    addressState.postal_code,
    addressState.country
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-medium mb-6">Peržiūrėkite savo užsakymą</h2>

      {/* CONTACT INFO */}
      <div className="mb-6 p-4 bg-gray-50 rounded-xl space-y-2">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Kontaktiniai duomenys
        </h3>

        <div className="flex items-center gap-3 text-gray-700">
          <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span>{customerDetails.name}</span>
        </div>

        <div className="flex items-center gap-3 text-gray-700">
          <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span>{customerDetails.email}</span>
        </div>

        {customerDetails.phone && (
          <div className="flex items-center gap-3 text-gray-700">
            <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span>{customerDetails.phone}</span>
          </div>
        )}

        <div className="flex items-start gap-3 text-gray-700">
          <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
          <span>{addressLine}</span>
        </div>
      </div>

      {/* ITEMS */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Užsakymo prekės
        </h3>

        <div className="space-y-4">
          {cart.map((item: any) => (
            <div key={item.id} className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                {item.images?.[0] || item.img ? (
                  <Image
                    src={item.images?.[0] || item.img}
                    alt={item.title}
                    width={56}
                    height={56}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 text-gray-300" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{item.title}</p>
                <p className="text-sm text-gray-500">Kiekis: {item.quantity}</p>
              </div>

              <p className="font-semibold text-gray-900 whitespace-nowrap">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* TOTAL */}
      <div className="border-t border-gray-200 pt-4 mb-6">
        <div className="flex justify-between text-lg font-semibold">
          <span>Viso</span>
          <span>{formatPrice(cartTotal)}</span>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Apmokėjimas bus susitartas po užsakymo patvirtinimo
        </p>
      </div>

      {/* BUTTONS */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setCurrentStep("address")}
          disabled={isSubmitting}
          className="flex-1 px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-40"
        >
          Atgal
        </button>

        <button
          type="button"
          onClick={onPlaceOrder}
          disabled={isSubmitting}
          className="flex-1 bg-slate-900 text-white px-6 py-3 rounded-xl hover:bg-slate-800
                     transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Siunčiama...
            </>
          ) : (
            "Pateikti užsakymą"
          )}
        </button>
      </div>
    </div>
  );
}