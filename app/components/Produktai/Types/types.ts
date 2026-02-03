// -------------------------------------------
// Types/types.ts
// -------------------------------------------

export interface ImageType {
  filename: string;
  local_path: string;
  url: string;
}

export interface ProductModel {
  filename: string;
  url: string;
  local_path: string;
}

/* ================= REVIEWS ================= */

export interface Review {
  reviewId: string;
  customerName: string;
  rating: number;
  title?: string; // Made optional since JSON doesn't show it
  comment: string;
  date: string;
  verified: boolean;
  helpful: number;
}

/* ================= RAW PRODUCT (JSON) ================= */

export interface ProductRaw {
  name: string;
  url: string;
  code: string | null;
  category: string;

  details?: Record<string, string>;

  images?: ImageType[] | string[];

  flexible_analog_exists?: boolean;
  model?: ProductModel;
  mounting_instructions?: string;

  sudetis?: string;
  price?: number | null;
  price_gbp?: string; // From your JSON
  reviews?: Review[];
}

/* ================= DIMENSIONS ================= */

/**
 * Canonical dimension model.
 * Different products may use different subsets.
 */
export interface ProductDimensions {
  Ilgis?: string;
  Plotis?: string;
  Aukštis?: string;
  Aukstis?: string; // Alternative spelling
  Skersmuo?: string;
  Storis?: string;
  Spindulys?: string;
  "Arkos Lenkimo Spindulys"?: string;
}

/* ================= FRONTEND PRODUCTS ================= */

interface ProductBase {
  id: string;
  name: string;
  title: string; // Display title
  url: string;
  code: string | null;
  category: string;
  images: string[];

  details: ProductDimensions;

  sudetis: string;
  papildoma_informacija?: string;
  reviews?: Review[];
  
  // Add these fields that are used in DesktopProductCard
  flexible_analog_exists?: boolean;
  model?: ProductModel;
  mounting_instructions?: string;
}

/* ---- With €/m ---- */
export interface ProductWithPricePerMetre extends ProductBase {
  hasPricePerMetre: true;
  price: number;
}

/* ---- Without €/m ---- */
export interface ProductWithoutPricePerMetre extends ProductBase {
  hasPricePerMetre: false;
  price?: never;
}

/* ---- Final product type ---- */
export type Product =
  | ProductWithPricePerMetre
  | ProductWithoutPricePerMetre;

/* ================= PAGE / UI ================= */

export interface PageData {
  title: string;
  dataFile: string;
  baseUrl: string;
  R2FolderName: string;
  FilterPanelCategories: string[];
  imageSuffixes?: string[];
  maxImages?: number;
  customFilterConfig?: Partial<FilterConfig>;
}

export interface FiltersType {
  priceRange: string;
  material: string;
  style: string;
}

export interface FilterConfig {
  priceRange: Array<{ value: string; label: string }>;
  material: Array<{ value: string; label: string }>;
  style: Array<{ value: string; label: string }>;
}

export interface DesktopCardProps {
  product: Product;
  onToggleExpand: () => void;
  onAddToCart: () => void;
}