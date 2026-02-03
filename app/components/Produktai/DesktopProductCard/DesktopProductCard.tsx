// DesktopProductCard.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import styles from "./DesktopProductCard.module.css";
import ImageCarousel from "./ImageCarousel";
import ProductInfo from "./ProductInfo";
import ThreeDViewer from "./ThreeDViewer";
import NoImagePlaceholder from "./NoImagePlaceholder";
import MetreInputModal from "@/app/components/Produktai/MetreInputModal/MetreInputModal";
import SimpleQuantityModal from "@/app/components/Produktai/SimpleQuantityModal/SimpleQuantityModal";
import type { Product, DesktopCardProps } from "../Types/types";

/** Categories where the unit price is €/m and the metre modal should appear */
const PRICE_PER_METRE_CATEGORIES = new Set([
  "lubu-apvadai",
  "moulding",
  "grindjuostes",
  "grindu-apvadai",
]);

const DesktopCard: React.FC<DesktopCardProps> = ({
  product,
  onToggleExpand,
  onAddToCart,
}) => {
  const router = useRouter();
  const [show3DViewer, setShow3DViewer] = useState(false);

  // Two separate modal states - only one type of modal per product
  const [showMetreModal, setShowMetreModal] = useState(false);
  const [showSimpleModal, setShowSimpleModal] = useState(false);

  const images =
    product.images && product.images.length > 0 ? product.images : [];

  const handle3DView = () => setShow3DViewer(true);
  const close3DViewer = () => setShow3DViewer(false);

  const handleMoreInfo = () => {
    if (product.code && product.category) {
      const urlFriendlyCode = product.code.replace(/\./g, "-");
      const productUrl = `/produktai/${product.category}/${urlFriendlyCode}`;
      router.push(productUrl);
    } else if (product.url) {
      router.push(product.url);
    } else {
      console.warn(
        "Product missing code/category or URL - using expand fallback"
      );
      onToggleExpand();
    }
  };

  /* ===== Determine which modal to open ===== */
  const isPricePerMetre = PRICE_PER_METRE_CATEGORIES.has(product.category);

  const handleCartClick = () => {
    if (isPricePerMetre) {
      // Price-per-metre products (with flexible/rigid options) → metre-input modal
      setShowMetreModal(true);
    } else {
      // All other products → simple quantity modal
      setShowSimpleModal(true);
    }
  };

  /* ===== Metre modal confirm ===== */
  const handleMetreConfirm = (value: number | { rigid: number; flexible: number }) => {
    // MetreInputModal can return either a number (metre mode) or an object (flexible mode)
    if (typeof value === "number") {
      // Metre mode: each 2 m = 1 standard unit
      const units = value / 2;
      for (let i = 0; i < units; i++) onAddToCart();
    } else {
      // Flexible mode: add rigid + flexible counts
      for (let i = 0; i < value.rigid; i++) onAddToCart();
      for (let i = 0; i < value.flexible; i++) onAddToCart();
    }
    setShowMetreModal(false);
  };

  /* ===== Simple modal confirm ===== */
  const handleSimpleConfirm = (quantity: number) => {
    for (let i = 0; i < quantity; i++) {
      onAddToCart();
    }
    setShowSimpleModal(false);
  };

  /* ===== Shared price helper ===== */
  const productPrice =
    "price" in product && product.price ? product.price : 0;

  /* ===== No images fallback ===== */
  if (images.length === 0) {
    return (
      <div className={styles.card}>
        <NoImagePlaceholder product={product} />
        <ProductInfo product={product} />

        <div className={styles.buttonRow}>
          <button onClick={handleMoreInfo} className={styles.detailsBtn}>
            Daugiau informacijos
          </button>
          <button className={styles.cartBtn} onClick={handleCartClick}>
            <ShoppingCart size={20} />
          </button>
        </div>

        {/* Metre modal (for price-per-metre products with flexible/rigid options) */}
        <MetreInputModal
          isOpen={showMetreModal}
          onClose={() => setShowMetreModal(false)}
          onConfirm={handleMetreConfirm}
          productName={product.title}
          pricePerMetre={productPrice}
          mode={product.flexible_analog_exists ? "flexible" : "metre"}
        />

        {/* Simple quantity modal (for all other products) */}
        <SimpleQuantityModal
          isOpen={showSimpleModal}
          onClose={() => setShowSimpleModal(false)}
          onConfirm={handleSimpleConfirm}
          productName={product.title}
          productPrice={productPrice}
        />
      </div>
    );
  }

  /* ===== Main render ===== */
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        {!show3DViewer ? (
          <ImageCarousel
            productTitle={product.name}
            productCategory={product.category}
            onView3D={handle3DView}
          />
        ) : (
          <ThreeDViewer
            product={product}
            onClose={close3DViewer}
            isInline
          />
        )}
      </div>

      <ProductInfo product={product} />

      <div className={styles.buttonRow}>
        <button onClick={handleMoreInfo} className={styles.detailsBtn}>
          Daugiau informacijos
        </button>
        <button className={styles.cartBtn} onClick={handleCartClick}>
          <ShoppingCart size={20} />
        </button>
      </div>

      {/* Metre modal (for price-per-metre products with flexible/rigid options) */}
      <MetreInputModal
        isOpen={showMetreModal}
        onClose={() => setShowMetreModal(false)}
        onConfirm={handleMetreConfirm}
        productName={product.title}
        pricePerMetre={productPrice}
        mode={product.flexible_analog_exists ? "flexible" : "metre"}
      />

      {/* Simple quantity modal (for all other products) */}
      <SimpleQuantityModal
        isOpen={showSimpleModal}
        onClose={() => setShowSimpleModal(false)}
        onConfirm={handleSimpleConfirm}
        productName={product.title}
        productPrice={productPrice}
      />
    </div>
  );
};

export default DesktopCard;