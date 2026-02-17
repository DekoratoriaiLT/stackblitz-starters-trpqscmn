import type { Metadata } from 'next';

const productData = require('@/app/data/sienu-apvadai/sienu-apvadai.json').products;

const BASE_URL = 'https://www.dekoratoriai.lt';
const CATEGORY = 'sienu-apvadai';

const getProduct = (code: string) => {
  // Try dot format (1.50.100) first, then dash format (1-50-100)
  return (
    productData.find((p: any) => p.code === code) ||
    productData.find((p: any) => p.code === code.replace(/-/g, '.')) ||
    productData.find((p: any) => p.code === code.replace(/\./g, '-'))
  );
};

const calculateAggregateRating = (reviews?: any[]) => {
  if (!reviews || reviews.length === 0) return null;
  const totalRating = reviews.reduce((sum: number, review: any) => sum + review.rating, 0);
  const averageRating = totalRating / reviews.length;
  const normalizedRating = averageRating / 2;
  return {
    ratingValue: normalizedRating.toFixed(1),
    reviewCount: reviews.length,
    bestRating: '5',
    worstRating: '1',
  };
};

export async function generateMetadata(): Promise<Metadata> {
  // Try both formats so the lookup never fails
  const product = getProduct('1.51.362') || getProduct('1-51-362');

  if (!product) {
    // Fallback metadata — still indexable
    return {
      title: 'Sienos Apvadas 1.51.362 | Interjero ir Fasado Dekoratoriai',
      description: 'Aukštos kokybės poliuretano dekoracijos. Platus pasirinkimas, greitas pristatymas.',
      robots: {
        index: true,
        follow: true,
      },
      alternates: {
        canonical: `${BASE_URL}/produktai/${CATEGORY}/1-51-362`,
      },
    };
  }

  const canonicalUrl = `${BASE_URL}/produktai/${CATEGORY}/1-51-362`;
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
      canonical: canonicalUrl,
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
          alt: product.name,
        },
      ],
      type: 'website',
      siteName: 'Interjero ir Fasado Dekoratoriai',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} - Aukštos kokybės interjero dekoracijos`,
      description,
      images: [imageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}
