// DesktopProductCard.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import styles from "./DesktopProductCard.module.css";
import ImageCarousel from "./ImageCarousel";
import ProductInfo from "./ProductInfo";
import ThreeDViewer from "./ThreeDViewer";
import NoImagePlaceholder from "./NoImagePlaceholder";
import MetreInputModal from "@/app/components/Produktai/MetreInputModal/MetreInputModal";
import SimpleQuantityModal from "@/app/components/Produktai/SimpleQuantityModal/SimpleQuantityModal";
import { useCart } from "@/app/contexts/CartContext";
import type { Product } from "../Types/types";

/** Categories where the unit price is €/m and the metre modal should appear */
const PRICE_PER_METRE_CATEGORIES = new Set([
  "lubu-apvadai",
  "moulding",
  "grindjuostes",
  "grindu-apvadai",
]);

interface DesktopCardProps {
  product: Product;
  onAddToCart?: () => void; // kept for back-compat but no longer used
}

const DesktopCard: React.FC<DesktopCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [show3DViewer, setShow3DViewer] = useState(false);
  const [showMetreModal, setShowMetreModal] = useState(false);
  const [showSimpleModal, setShowSimpleModal] = useState(false);

  const images =
    product.images && product.images.length > 0 ? product.images : [];

  const handle3DView = () => setShow3DViewer(true);
  const close3DViewer = () => setShow3DViewer(false);

  // Generate the product URL
  const getProductUrl = () => {
    if (product.code && product.category) {
      const urlFriendlyCode = product.code.replace(/\./g, "-");
      return `/produktai/${product.category}/${urlFriendlyCode}`;
    } else if (product.url) {
      return product.url;
    }
    return null;
  };

  const productUrl = getProductUrl();

  const isPricePerMetre = PRICE_PER_METRE_CATEGORIES.has(product.category);
  const hasFlexibleAnalog = product.flexible_analog_exists === true;

  const handleCartClick = () => {
    if (isPricePerMetre) {
      setShowMetreModal(true);
    } else {
      setShowSimpleModal(true);
    }
  };

  const productPrice =
    "price" in product && product.price ? product.price : 0;

  /** Push a single cart item (rigid or flexible) */
  const pushToCart = (isFlexible: boolean, quantity: number) => {
    const baseId = product.code || product.id;
    const uniqueId = hasFlexibleAnalog
      ? isFlexible
        ? `${baseId}-flexible`
        : `${baseId}-rigid`
      : baseId;

    const cartProduct = {
      id: uniqueId,
      title: isFlexible
        ? `${product.title} (Lankstus)`
        : hasFlexibleAnalog
          ? `${product.title} (Nelankstus)`
          : product.title,
      images: product.images as string[],
      img: (product.images as string[])[0] || '',
      price: productPrice,
      category: product.category,
      description: product.category,
      ilgis: parseFloat(product.details?.Ilgis || '0'),
      aukstis: parseFloat(product.details?.Aukštis || product.details?.Aukstis || '0'),
      flexible_analog_exists: product.flexible_analog_exists,
      isFlexible,
      variant: hasFlexibleAnalog
        ? (isFlexible ? 'lankstus' : 'nelankstus')
        : undefined,
    } as any;

    for (let i = 0; i < quantity; i++) {
      addToCart(cartProduct);
    }
  };

  /* ===== Metre modal confirm ===== */
  const handleMetreConfirm = (value: number | { rigid: number; flexible: number }) => {
    if (typeof value === "number") {
      const units = value / 2;
      pushToCart(false, units);
    } else {
      if (value.rigid > 0) pushToCart(false, value.rigid);
      if (value.flexible > 0) pushToCart(true, value.flexible);
    }
    setShowMetreModal(false);
  };

  /* ===== Simple modal confirm ===== */
  const handleSimpleConfirm = (quantity: number) => {
    pushToCart(false, quantity);
    setShowSimpleModal(false);
  };

  /* ===== No images fallback ===== */
  if (images.length === 0) {
    return (
      <div className={styles.card}>
        <NoImagePlaceholder product={product} />
        <ProductInfo product={product} />

        <div className={styles.buttonRow}>
          {productUrl ? (
            <Link
              href={productUrl}
              className={styles.detailsBtn}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none'
              }}
            >
              Daugiau informacijos
            </Link>
          ) : (
            <button className={styles.detailsBtn} disabled>
              Daugiau informacijos
            </button>
          )}
          <button className={styles.cartBtn} onClick={handleCartClick}>
            <ShoppingCart size={20} />
          </button>
        </div>

        <MetreInputModal
          isOpen={showMetreModal}
          onClose={() => setShowMetreModal(false)}
          onConfirm={handleMetreConfirm}
          productName={product.title}
          pricePerMetre={productPrice}
          mode={hasFlexibleAnalog ? "flexible" : "metre"}
        />

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
            details={product.details}
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
        {productUrl ? (
          <Link
            href={productUrl}
            className={styles.detailsBtn}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none'
            }}
          >
            Daugiau informacijos
          </Link>
        ) : (
          <button className={styles.detailsBtn} disabled>
            Daugiau informacijos
          </button>
        )}
        <button className={styles.cartBtn} onClick={handleCartClick}>
          <ShoppingCart size={20} />
        </button>
      </div>

      <MetreInputModal
        isOpen={showMetreModal}
        onClose={() => setShowMetreModal(false)}
        onConfirm={handleMetreConfirm}
        productName={product.title}
        pricePerMetre={productPrice}
        mode={hasFlexibleAnalog ? "flexible" : "metre"}
      />

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