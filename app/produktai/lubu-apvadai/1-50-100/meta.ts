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
  
  return {
    ratingValue: averageRating.toFixed(1),
    reviewCount: reviews.length,
    bestRating: "10",
    worstRating: "1"
  };
};

const generateProductJsonLd = (product: any) => {
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
    jsonLd.review = product.reviews.map((review: any) => ({
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

  // Add offers section with price
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
    ? ` | Įvertinimas: ${aggregateRating.ratingValue}/10 (${aggregateRating.reviewCount} atsiliepimai)`
    : '';

  // Generate JSON-LD
  const jsonLd = generateProductJsonLd(product);

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
    },
    other: {
      'product:price:amount': product.price?.toFixed(2),
      'product:price:currency': 'EUR',
      'jsonld': JSON.stringify(jsonLd)
    }
  };
}