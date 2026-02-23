"use client";

import { Elements } from "@stripe/react-stripe-js";
import CheckoutPage from "../components/Stripe/CheckoutPage";
import { Check } from "lucide-react";

export default function PaymentStep({
  stripePromise,
  cartTotal,
  addressState,
  customerDetails,
  handlePaymentSuccess,
  setCurrentStep
}: any) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-medium mb-6">Apmokėjimo duomenys</h2>

      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <Check className="w-5 h-5 text-green-600" />
          </div>
          <p>
            Pristatymas: {[
              addressState.line_1,
              addressState.city,
              addressState.postal_code
            ]
              .filter(Boolean)
              .join(", ")}
          </p>
        </div>
      </div>

      <Elements
        stripe={stripePromise}
        options={{
          mode: "payment",
          amount: Math.round(cartTotal * 100),
          currency: "eur"
        }}
      >
        <CheckoutPage
          amount={cartTotal}
          onSuccessfulPayment={handlePaymentSuccess}
          customerDetails={{
            name: customerDetails.name,
            email: customerDetails.email,
            phone: customerDetails.phone,
            address: addressState
          }}
        />
      </Elements>

      <div className="mt-6">
        <button
          onClick={() => setCurrentStep("address")}
          className="w-full border border-gray-300 text-gray-800 px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors"
        >
          Atgal į adresą
        </button>
      </div>
    </div>
  );
}
