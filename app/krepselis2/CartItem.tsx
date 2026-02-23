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
  // Use the first image from the images array, fallback to img property if images array doesn't exist
  const imageUrl = item.images?.[0] || item.img;

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
            <h3 className="text-lg font-medium text-gray-900 line-clamp-2">
              {item.title}
            </h3>
            <button
              onClick={() => removeFromCart(item.id)}
              className="ml-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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
                {formatPrice(item.price * item.quantity)}
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