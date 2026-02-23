"use client";

export default function OrderSummary({ cartTotal, isBusinessUser, discountRate, formatPrice }: any) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
      <h3 className="text-xl font-medium text-gray-900 mb-6">Užsakymo santrauka</h3>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-gray-600">
          <span>Tarpinė suma</span>
          <span>{formatPrice(cartTotal)}</span>
        </div>

        {isBusinessUser && (
          <div className="flex justify-between text-teal-600 font-medium">
            <span>Verslo nuolaida ({discountRate}%)</span>
            <span>Pritaikyta</span>
          </div>
        )}

        <div className="flex justify-between text-gray-600">
          <span>Pristatymas</span>
          <span className="text-sm">Skaičiuojamas vėliau</span>
        </div>

        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between items-baseline">
            <span className="text-lg font-semibold text-gray-900">Viso</span>
            <span className="text-2xl font-bold text-gray-900">{formatPrice(cartTotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
