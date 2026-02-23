"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

import { useCart } from "../contexts/CartContext";
import { useBusinessAuth } from "../contexts/BusinessAuthContext";

import CartItem from "./CartItem";
import OrderSummary from "./OrderSummary";
import StepIndicator from "./StepIndicator";
import BusinessBanner from "./BusinessBanner";
import AddressStep from "./AddressStep";
import PaymentStep from "./PaymentStep";
import ConfirmationStep from "./ConfirmationStep";

import { loadStripe } from "@stripe/stripe-js";
import { ShoppingCart, ShoppingBag } from "lucide-react";

import { database } from "../firebase";
import { ref, push } from "firebase/database";

// Stripe key check
if (!process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY) {
  throw new Error("Missing Stripe public key");
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function Page() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    cartCount
  } = useCart();

  const { isBusinessMode, businessAccount, discountRate } = useBusinessAuth();

  const [isMounted, setIsMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState("cart");

  const [orderNumber, setOrderNumber] = useState("");
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const [addressState, setAddressState] = useState({
    line_1: "",
    line_2: "",
    city: "",
    postal_code: "",
    country: "Lithuania"
  });

  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    email: "",
    phone: ""
  });

  // Prevent hydration mismatch
  useEffect(() => setIsMounted(true), []);

  const formatPrice = (price: number | undefined) =>
    `€${price?.toFixed(2)}`;

  /**
   * Called after successful Stripe payment
   */
  const handlePaymentSuccess = async (paymentIntent: any) => {
    const orderNum = "ORD-" + Date.now();
    setOrderNumber(orderNum);

    // Optionally save order to Firebase
    try {
      await push(ref(database, "orders"), {
        orderNumber: orderNum,
        customerDetails,
        addressState,
        cart,
        total: cartTotal,
        createdAt: Date.now(),
        paymentIntentId: paymentIntent?.id ?? null
      });
    } catch (err) {
      console.error("Failed to save order:", err);
    }

    setCurrentStep("confirmation");
  };

  if (!isMounted) return null;

  // -------------------------------------------------
  // EMPTY CART SCREEN
  // -------------------------------------------------
  if (cart.length === 0 && currentStep === "cart") {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
            <ShoppingCart className="w-12 h-12 text-gray-400" />
          </div>

          <h2 className="text-3xl font-light text-gray-900 mb-4">
            Jūsų krepšelis tuščias
          </h2>

          <Link
            href="/produktai"
            className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl hover:bg-slate-800 transition-all"
          >
            <ShoppingBag className="w-5 h-5" />
            Žiūrėti produktus
          </Link>
        </div>
      </div>
    );
  }

  // -------------------------------------------------
  // MAIN CHECKOUT LAYOUT
  // -------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">

        {/* STEP TITLE */}
        <h1 className="text-4xl font-light text-gray-900 mb-2">
          {currentStep === "cart"
            ? "Krepšelis"
            : currentStep === "address"
            ? "Pristatymo informacija"
            : currentStep === "payment"
            ? "Apmokėjimo duomenys"
            : "Užsakymo patvirtinimas"}
        </h1>

        <StepIndicator currentStep={currentStep} />

        {/* BUSINESS BANNER */}
        {isBusinessMode &&
          businessAccount &&
          currentStep === "cart" && (
            <BusinessBanner
              businessAccount={businessAccount}
              discountRate={discountRate}
            />
          )}

        {/* CONTENT GRID */}
        <div className="grid lg:grid-cols-3 gap-8">

          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-8">

            {/* CART STEP */}
            {currentStep === "cart" && (
              <>
                {cart.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    removeFromCart={removeFromCart}
                    updateQuantity={updateQuantity}
                    isBusinessUser={isBusinessMode}
                    formatPrice={formatPrice}
                  />
                ))}

                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => setCurrentStep("address")}
                    className="w-full bg-slate-900 text-white py-4 rounded-xl hover:bg-slate-800"
                  >
                    Pereiti prie užsakymo
                  </button>

                  <button
                    onClick={clearCart}
                    className="w-full py-3 text-red-600 hover:bg-red-50 rounded-xl"
                  >
                    Išvalyti krepšelį
                  </button>
                </div>
              </>
            )}

            {/* ADDRESS STEP */}
            {currentStep === "address" && (
              <AddressStep
                addressState={addressState}
                setAddressState={setAddressState}
                customerDetails={customerDetails}
                handleCustomerInputChange={(e) =>
                  setCustomerDetails({
                    ...customerDetails,
                    [e.target.name]: e.target.value
                  })
                }
                setCurrentStep={setCurrentStep}
              />
            )}

            {/* PAYMENT STEP */}
            {currentStep === "payment" && (
              <PaymentStep
                stripePromise={stripePromise}
                cartTotal={cartTotal}
                addressState={addressState}
                customerDetails={customerDetails}
                handlePaymentSuccess={handlePaymentSuccess}
                setCurrentStep={setCurrentStep}
              />
            )}

            {/* CONFIRMATION STEP */}
            {currentStep === "confirmation" && (
              <ConfirmationStep
                orderNumber={orderNumber}
                emailError={emailError}
                isEmailSending={isEmailSending}
                cart={cart}
                customerDetails={customerDetails}
                cartTotal={cartTotal}
                formatPrice={formatPrice}
              />
            )}
          </div>

          {/* RIGHT SIDE */}
          <div className="lg:col-span-1">
            {currentStep !== "confirmation" && (
              <OrderSummary
                cartTotal={cartTotal}
                isBusinessUser={isBusinessMode}
                discountRate={discountRate}
                formatPrice={formatPrice}
              />
            )}
          </div>

        </div>
      </div>
    </div>
  );
}