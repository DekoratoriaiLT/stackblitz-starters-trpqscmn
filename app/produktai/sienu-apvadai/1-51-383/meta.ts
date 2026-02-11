import type { Metadata } from 'next';

const productData = require('@/app/data/sienu-apvadai/sienu-apvadai.json').products;

const BASE_URL = 'https://www.dekoratoriai.lt';
const CATEGORY = 'sienu-apvadai';

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

export async function generateMetadata(): Promise<Metadata> {
  const product = getProduct('1-51-383');

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
