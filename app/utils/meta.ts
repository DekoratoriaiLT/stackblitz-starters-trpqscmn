import type { Metadata } from 'next';
import path from 'path';

interface ProductReview {
  reviewId: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
  helpful: number;
}

interface ProductDetails {
  Ilgis?: string;
  Plotis?: string;
  Aukštis?: string;
  Aukstis?: string;
  Skersmuo?: string;
  Storis?: string;
  Spindulys?: string;
  "Arkos Lenkimo Spindulys"?: string;
  "Išgaubto lenkimo spindulys"?: string;
  "Įgaubto lenkimo spindulys"?: string;
}

interface Product {
  name: string;
  code: string;
  category: string;
  url?: string;
  price?: number;
  sudetis?: string;
  details?: ProductDetails;
  reviews?: ProductReview[];
  mounting_instructions?: string;
  flexible_analog_exists?: boolean;
  model?: {
    filename?: string;
    url?: string;
    local_path?: string;
  };
}

const BASE_URL = 'https://www.dekoratoriai.lt';

/**
 * Get product data from the appropriate JSON file
 */
export const getProductData = (category: string, productCode: string): Product | null => {
  try {
    // Dynamically import the category data file
    const categoryData = require(`@/app/data/${category}/${category}.json`);
    
    // Handle both array and object with products array
    const products = Array.isArray(categoryData) 
      ? categoryData 
      : categoryData.products || [];
    
    // Find the product by code
    const product = products.find((p: Product) => p.code === productCode);
    
    return product || null;
  } catch (error) {
    console.error(`Error loading product data for ${category}/${productCode}:`, error);
    return null;
  }
};

/**
 * Calculate aggregate rating from reviews
 */
const getAggregateRating = (reviews?: ProductReview[]) => {
  if (!reviews || reviews.length === 0) {
    return null;
  }

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / reviews.length;

  return {
    ratingValue: averageRating.toFixed(1),
    reviewCount: reviews.length,
    bestRating: "10",
    worstRating: "1"
  };
};

/**
 * Generate product image URL
 */
const getProductImageUrl = (category: string, productCode: string): string => {
  return `${BASE_URL}/images/produktai/${category}/${productCode}.100.png`;
};

/**
 * Generate JSON-LD structured data for product
 */
export const generateProductJsonLd = (product: Product, category: string) => {
  const imageUrl = getProductImageUrl(category, product.code);
  const productUrl = `${BASE_URL}/produktai/${category}/${product.code}`;
  const aggregateRating = getAggregateRating(product.reviews);

  const jsonLd: any = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "description": `${product.name} - Aukštos kokybės interjero dekoracijos produktai. ${product.sudetis || 'Poliuretanas'} dekoras.`,
    "image": imageUrl,
    "url": productUrl,
    "brand": {
      "@type": "Brand",
      "name": "Interjero ir Fasado Dekoratoriai"
    },
    "sku": product.code,
    "mpn": product.code
  };

  // Add aggregate rating if reviews exist
  if (aggregateRating) {
    jsonLd.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": aggregateRating.ratingValue,
      "reviewCount": aggregateRating.reviewCount,
      "bestRating": aggregateRating.bestRating,
      "worstRating": aggregateRating.worstRating
    };
  }

  // Add reviews if they exist
  if (product.reviews && product.reviews.length > 0) {
    jsonLd.review = product.reviews.map(review => ({
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.rating.toString(),
        "bestRating": "10",
        "worstRating": "1"
      },
      "author": {
        "@type": "Person",
        "name": review.customerName
      },
      "datePublished": review.date,
      "reviewBody": review.comment
    }));
  }

  // Add offers section with price if available
  if (product.price) {
    jsonLd.offers = {
      "@type": "Offer",
      "price": product.price.toFixed(2),
      "priceCurrency": "EUR",
      "availability": "https://schema.org/InStock",
      "url": productUrl,
      "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
    };
  }

  return jsonLd;
};

/**
 * Generate metadata for a product page
 */
export const generateProductMetadata = (
  category: string,
  productCode: string
): Metadata => {
  const product = getProductData(category, productCode);

  if (!product) {
    return {
      title: 'Produktas nerastas | Interjero ir Fasado Dekoratoriai',
      description: 'Norimas produktas nebuvo rastas.',
      robots: {
        index: false,
        follow: true
      }
    };
  }

  const canonicalUrl = `${BASE_URL}/produktai/${category}/${product.code}`;
  const imageUrl = getProductImageUrl(category, product.code);
  
  const description = `${product.name} - Aukštos kokybės interjero dekoracijos produktai. ${product.sudetis || 'Poliuretanas'} dekoras. ${product.price ? `Kaina: €${product.price.toFixed(2)}` : ''}`;

  const aggregateRating = getAggregateRating(product.reviews);
  const ratingText = aggregateRating 
    ? ` | Įvertinimas: ${aggregateRating.ratingValue}/10 (${aggregateRating.reviewCount} atsiliepimai)`
    : '';

  return {
    title: `${product.name}${ratingText} | Interjero ir Fasado Dekoratoriai`,
    description,
    alternates: {
      canonical: canonicalUrl
    },
    openGraph: {
      title: `${product.name} - Aukštos kokybės interjero dekoracijos`,
      description,
      url: canonicalUrl,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: product.name
        }
      ],
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} - Aukštos kokybės interjero dekoracijos`,
      description,
      images: [imageUrl]
    },
    robots: {
      index: true,
      follow: true
    }
  };
};