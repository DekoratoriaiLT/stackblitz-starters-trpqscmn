"use client";
import Image from "next/image";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";

export default function CartItem({
  item,
  removeFromCart,
  updateQuantity,
  formatPrice,
  isBusinessUser
}: any) {
  const imageUrl = item.images?.[0] || item.img;

  const isFlexible = item.isFlexible === true || item.variant === 'lankstus';
  const isRigid = item.variant === 'nelankstus';
  const hasVariant = item.flexible_analog_exists || item.variant;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex gap-6">
        {/* Product Image */}
        <div className="relative w-32 h-32 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={item.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-gray-300" />
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1 min-w-0 mr-4">
              <h3 className="text-lg font-medium text-gray-900 line-clamp-2">
                {item.title}
              </h3>

              {/* Variant badge */}
              {hasVariant && (
                <span
                  className={`inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${isFlexible
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                >
                  {isFlexible ? (
                    <>
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6c0 0 4-2 8 0s8 0 8 0M4 12c0 0 4-2 8 0s8 0 8 0M4 18c0 0 4-2 8 0s8 0 8 0" />
                      </svg>
                      Lankstus
                    </>
                  ) : isRigid ? (
                    <>
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                      Nelankstus
                    </>
                  ) : null}
                </span>
              )}

              {/* Length info if available */}
              {item.ilgis > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  Ilgis: {item.ilgis} mm · {(item.ilgis / 1000).toFixed(1)} m vienetas
                </p>
              )}
            </div>

            <button
              onClick={() => removeFromCart(item.id)}
              className="ml-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center justify-between">
            {/* Quantity Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>

              <span className="w-12 text-center font-medium">{item.quantity}</span>

              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Price */}
            <div className="text-right">
              {isBusinessUser && item.originalPrice && item.originalPrice !== item.price && (
                <div className="text-sm text-gray-400 line-through">
                  {formatPrice(item.originalPrice * item.quantity)}
                </div>
              )}

              <div className="text-xl font-semibold text-gray-900">
                {formatPrice((item.price || 0) * item.quantity)}
              </div>

              {isBusinessUser && item.businessDiscount && (
                <div className="text-xs text-teal-600 font-medium">
                  -{item.businessDiscount}% nuolaida
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}