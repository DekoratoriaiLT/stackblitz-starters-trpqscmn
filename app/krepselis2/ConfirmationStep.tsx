"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, Loader2, ShoppingBag } from "lucide-react";

export default function ConfirmationStep({
  orderNumber,
  cart,
  customerDetails,
  emailError,
  isEmailSending,
  formatPrice,
  cartTotal
}: any) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>

        <h2 className="text-2xl font-medium text-gray-900">
          Užsakymas patvirtintas!
        </h2>

        <p className="text-gray-600 mt-2">Dėkojame už jūsų užsakymą</p>
        <p className="text-sm font-medium mt-1">
          Užsakymo numeris: {orderNumber}
        </p>

        {isEmailSending ? (
          <div className="mt-4 flex items-center justify-center text-gray-600">
            <Loader2 className="animate-spin w-5 h-5 mr-2" />
            Siunčiamas patvirtinimo el. laiškas...
          </div>
        ) : (
          <p className="text-sm text-gray-600 mt-2">
            {emailError ? (
              <span className="text-amber-600">{emailError}</span>
            ) : (
              "Patvirtinimo el. laiškas išsiųstas"
            )}
          </p>
        )}
      </div>

      {/* Order Items */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="font-medium mb-4">Užsakymo detalės</h3>

        <div className="space-y-4">
          {cart.map((item: any) => (
            <div key={item.id} className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden mr-3">
                  {item.img ? (
                    <Image
                      src={item.img}
                      alt={item.title}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex justify-center items-center">
                      <ShoppingBag className="w-6 h-6 text-gray-300" />
                    </div>
                  )}
                </div>

                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-gray-500 text-sm">Kiekis: {item.quantity}</p>
                </div>
              </div>

              <p className="font-medium">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 mt-6 pt-4">
          <div className="flex justify-between font-medium text-lg mt-2 pt-2 border-t">
            <span>Viso</span>
            <span>{formatPrice(cartTotal)}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-8">
        <div>
          <p className="text-sm text-gray-600">Patvirtinimo el. laiškas išsiųstas:</p>
          <p className="font-medium">{customerDetails.email}</p>
        </div>

        <Link
          href="/produktai"
          className="bg-slate-900 text-white px-6 py-3 rounded-xl hover:bg-slate-800 transition-colors inline-block"
        >
          Tęsti apsipirkimą
        </Link>
      </div>
    </div>
  );
}
