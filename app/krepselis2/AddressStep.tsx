"use client";

import React, { useEffect, ChangeEvent, useRef } from "react";
import { AddressFinder } from "@ideal-postcodes/address-finder";
import { AnyAddress } from "@ideal-postcodes/jsutil";
import { normalizeCountryCode } from "./address";

/**
 * Safely read optional fields from AnyAddress (prevents ALL TS errors).
 */
const getField = (obj: unknown, key: string): string | undefined => {
  if (obj && typeof obj === "object" && key in (obj as any)) {
    return (obj as any)[key];
  }
  return undefined;
};

interface AddressState {
  line_1: string;
  line_2: string;
  city: string;
  postal_code: string;
  country: string;
}

interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
}

interface AddressStepProps {
  addressState: AddressState;
  setAddressState: (value: AddressState) => void;
  customerDetails: CustomerDetails;
  handleCustomerInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  setCurrentStep: (step: string) => void;
}

export default function AddressStep({
  addressState,
  setAddressState,
  customerDetails,
  handleCustomerInputChange,
  setCurrentStep
}: AddressStepProps) {

  const shouldInit = useRef(true);

  useEffect(() => {
    if (!shouldInit.current) return;
    shouldInit.current = false;

    const apiKey = process.env.NEXT_PUBLIC_IDEAL_POSTCODES_API_KEY;
    if (!apiKey) {
      console.error("Missing NEXT_PUBLIC_IDEAL_POSTCODES_API_KEY");
      return;
    }

    const input = document.querySelector("#searchField");
    if (!input) {
      console.warn("searchField missing, retrying…");
      setTimeout(() => (shouldInit.current = true), 60);
      return;
    }

    AddressFinder.watch({
      apiKey,
      inputField: "#searchField",

      onAddressRetrieved: (address: AnyAddress) => {

        const line_1 =
          getField(address, "line_1") ??
          "";

        const line_2 =
          getField(address, "line_2") ??
          "";

        const city =
          getField(address, "post_town") ??
          getField(address, "city") ??
          getField(address, "town") ??
          getField(address, "place_name") ??
          "";

        const postal =
          getField(address, "postcode") ??
          getField(address, "postal_code") ??
          getField(address, "zip") ??
          getField(address, "zip_code") ??
          "";

        const country = normalizeCountryCode(
          getField(address, "country") ??
          getField(address, "country_name") ??
          ""
        );

        setAddressState({
          line_1,
          line_2,
          city,
          postal_code: postal,
          country,
        });
      }
    });
  }, [setAddressState]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">

      <h2 className="text-xl font-medium mb-4">Pristatymo adresas</h2>

      {/* SEARCH */}
      <input
        id="searchField"
        placeholder="Pradėkite rašyti adresą..."
        className="mb-4 bg-transparent border border-gray-300 rounded-lg py-3 px-4 w-full
                   text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-black"
      />

      <div className="space-y-4">

        {/* ADDRESS ROW 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adresas 1 *
            </label>
            <input
              id="line_1"
              value={addressState.line_1}
              onChange={(e) =>
                setAddressState({ ...addressState, line_1: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg
                         focus:ring-2 focus:ring-black text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adresas 2
            </label>
            <input
              id="line_2"
              value={addressState.line_2}
              onChange={(e) =>
                setAddressState({ ...addressState, line_2: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg
                         focus:ring-2 focus:ring-black text-black"
            />
          </div>
        </div>

        {/* ADDRESS ROW 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Miestas *
            </label>
            <input
              id="city"
              value={addressState.city}
              onChange={(e) =>
                setAddressState({ ...addressState, city: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg
                         focus:ring-2 focus:ring-black text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pašto kodas *
            </label>
            <input
              id="postal_code"
              value={addressState.postal_code}
              onChange={(e) =>
                setAddressState({ ...addressState, postal_code: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg
                         focus:ring-2 focus:ring-black text-black"
            />
          </div>
        </div>

        {/* COUNTRY */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Šalis *
          </label>
          <input
            id="country"
            value={addressState.country}
            onChange={(e) =>
              setAddressState({
                ...addressState,
                country: normalizeCountryCode(e.target.value),
              })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg
                       focus:ring-2 focus:ring-black text-black"
          />
        </div>
      </div>

      {/* BUTTONS */}
      <div className="mt-6 flex gap-3">

        <button
          type="button"
          onClick={() => setCurrentStep("cart")}
          className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100
                     transition-colors"
        >
          Atgal į krepšelį
        </button>

        <button
          type="button"
          onClick={() => setCurrentStep("payment")}
          className="flex-1 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800
                     transition-colors"
        >
          Tęsti į apmokėjimą
        </button>

      </div>
    </div>
  );
}
