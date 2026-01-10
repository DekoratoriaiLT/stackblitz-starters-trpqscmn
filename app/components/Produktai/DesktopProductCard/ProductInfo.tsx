"use client";

import React from "react";
import styles from "./DesktopProductCard.module.css";

/* 🔑 €/m products */
const PRICE_PER_METRE_CATEGORIES = new Set([
  "lubu-apvadai",
  "moulding",
  "grindjuostes",
  "grindu-apvadai",
]);

/* 🔵 Diameter + Height */
const DIAMETER_HEIGHT_CATEGORIES = new Set([
  "balustrai",
  "kolonos-liemuo",
]);

/* 🟢 Diameter + Width (thickness) */
const DIAMETER_WIDTH_CATEGORIES = new Set([
  "rozetes",
  "ziedas",
]);

interface Product {
  id: string;
  title: string;
  sudetis: string;
  category: string;
  price?: number | null;
  details: {
    Ilgis?: string;
    Plotis?: string;
    Aukštis?: string;
    Skersmuo?: string;
  };
}

interface ProductInfoProps {
  product: Product;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  const isPricePerMetre =
    PRICE_PER_METRE_CATEGORIES.has(product.category);

  const isDiameterHeight =
    DIAMETER_HEIGHT_CATEGORIES.has(product.category);

  const isDiameterWidth =
    DIAMETER_WIDTH_CATEGORIES.has(product.category);

  /* ================= PRICE ================= */

  let priceContent: React.ReactNode;

  if (product.price == null) {
    priceContent = (
      <span className={styles.contactPrice}>
        Kreipkitės dėl kainos
      </span>
    );
  } else if (isPricePerMetre && product.details.Ilgis) {
    const lengthMm = parseFloat(
      product.details.Ilgis.replace(/[^\d.,]/g, "").replace(",", ".")
    );

    if (Number.isFinite(lengthMm) && lengthMm > 0) {
      const lengthM = lengthMm / 1000;
      priceContent = <>€{(product.price / lengthM).toFixed(2)} / m</>;
    } else {
      priceContent = (
        <span className={styles.contactPrice}>
          Kreipkitės dėl kainos
        </span>
      );
    }
  } else {
    priceContent = <>€{product.price.toFixed(2)}</>;
  }

  /* ================= RENDER ================= */

  return (
    <div className={styles.infoBlock}>
      <p className={styles.article}>
        [ARTIKALIS: {product.id}]
      </p>

      <h1 className={styles.title}>{product.title}</h1>

      <p className={styles.price}>{priceContent}</p>

      <p className={styles.material}>
        Medžiaga: <strong>{product.sudetis}</strong>
      </p>

      {/* ===== DIAMETER + HEIGHT ===== */}
      {isDiameterHeight && (
        <>
          {product.details.Skersmuo && (
            <p className={styles.dimensions}>
              Skersmuo: <strong>{product.details.Skersmuo}</strong>
            </p>
          )}
          {product.details.Aukštis && (
            <p className={styles.dimensions}>
              Aukštis: <strong>{product.details.Aukštis}</strong>
            </p>
          )}
        </>
      )}

      {/* ===== DIAMETER + WIDTH ===== */}
      {isDiameterWidth && (
        <>
          {product.details.Skersmuo && (
            <p className={styles.dimensions}>
              Skersmuo: <strong>{product.details.Skersmuo}</strong>
            </p>
          )}
          {product.details.Plotis && (
            <p className={styles.dimensions}>
              Plotis: <strong>{product.details.Plotis}</strong>
            </p>
          )}
        </>
      )}

      {/* ===== LENGTH-BASED ===== */}
      {!isDiameterHeight && !isDiameterWidth && (
        <>
          {product.details.Ilgis && (
            <p className={styles.dimensions}>
              Ilgis: <strong>{product.details.Ilgis}</strong>
            </p>
          )}
          {product.details.Plotis && (
            <p className={styles.dimensions}>
              Plotis: <strong>{product.details.Plotis}</strong>
            </p>
          )}
          {product.details.Aukštis && (
            <p className={styles.dimensions}>
              Aukštis: <strong>{product.details.Aukštis}</strong>
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default ProductInfo;
