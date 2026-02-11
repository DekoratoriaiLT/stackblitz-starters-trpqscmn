import type { Metadata } from 'next';

const productData = require('@/app/data/lubu-apvadai/lubu-apvadai.json').products;

const BASE_URL = 'https://www.dekoratoriai.lt';
const CATEGORY = 'lubu-apvadai';

const getProduct = (code: string) => {
  return productData.find((product: any) => product.code === code);
};

const calculateAggregateRating = (reviews?: any[]) => {
  if (!reviews || reviews.length === 0) return null;
  
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / reviews.length;
  // Divide by 2 to convert from 10-point to 5-point scale
  const normalizedRating = averageRating / 2;
  
  return {
    ratingValue: normalizedRating.toFixed(1),
    reviewCount: reviews.length,
    bestRating: "5",
    worstRating: "1"
  };
};

export const generateProductJsonLd = (product: any) => {
  const imageUrl = `${BASE_URL}/images/produktai/${CATEGORY}/${product.code}.100.png`;
  const productUrl = `${BASE_URL}/produktai/${CATEGORY}/${product.code}`;
  const aggregateRating = calculateAggregateRating(product.reviews);

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

  if (aggregateRating) {
    jsonLd.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": aggregateRating.ratingValue,
      "reviewCount": aggregateRating.reviewCount,
      "bestRating": aggregateRating.bestRating,
      "worstRating": aggregateRating.worstRating
    };
  }

  if (product.reviews && product.reviews.length > 0) {
    jsonLd.review = product.reviews.map((review: any) => {
      // Divide individual review rating by 2
      const normalizedReviewRating = (review.rating / 2).toFixed(1);
      
      return {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": normalizedReviewRating,
          "bestRating": "5",
          "worstRating": "1"
        },
        "author": {
          "@type": "Person",
          "name": review.customerName
        },
        "datePublished": review.date,
        "reviewBody": review.comment
      };
    });
  }

  if (product.price) {
    jsonLd.offers = {
      "@type": "Offer",
      "price": product.price.toFixed(2),
      "priceCurrency": "EUR",
      "availability": "https://schema.org/InStock",
      "url": productUrl,
      "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        .toISOString()
        .split('T')[0]
    };
  }

  return jsonLd;
};

// Generate and log JSON-LD
const product = getProduct('1.50.100');
if (product) {
  const jsonLd = generateProductJsonLd(product);
  
  console.log('\n========================================');
  console.log('PRODUCT JSON-LD STRUCTURED DATA');
  console.log('========================================');
  console.log('Product:', product.name);
  console.log('Code:', product.code);
  console.log('========================================\n');
  console.log(JSON.stringify(jsonLd, null, 2));
  console.log('\n========================================');
  console.log('Copy the JSON above and paste into:');
  console.log('https://search.google.com/test/rich-results');
  console.log('========================================\n');
}

export async function generateMetadata(): Promise<Metadata> {
  const product = getProduct('1.50.100');

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

  const canonicalUrl = `${BASE_URL}/produktai/${CATEGORY}/${product.code}`;
  const imageUrl = `${BASE_URL}/images/produktai/${CATEGORY}/${product.code}.100.png`;
  const aggregateRating = calculateAggregateRating(product.reviews);
  
  const description = `${product.name} - Aukštos kokybės interjero dekoracijos produktai. ${product.sudetis || 'Poliuretanas'} dekoras.${product.price ? ` Kaina: €${product.price.toFixed(2)}` : ''}`;

  const ratingText = aggregateRating 
    ? ` | Įvertinimas: ${aggregateRating.ratingValue}/5 (${aggregateRating.reviewCount} atsiliepimai)`
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
      type: 'website',
      siteName: 'Interjero ir Fasado Dekoratoriai'
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
}