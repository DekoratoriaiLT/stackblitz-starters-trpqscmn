import { ProductPageTemplate } from '../../../components/ProductPage/template';
export { generateMetadata } from './meta';

const productData = require('@/app/data/kolonos-liemuo/kolonos-liemuo.json').products;

const BASE_URL = 'https://www.dekoratoriai.lt';
const CATEGORY = 'kolonos-liemuo';

const getProduct = async (code: string) => {
  // Try both dot (1.50.100) and dash (1-50-100) formats
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

const generateProductJsonLd = (product: any) => {
  const imageUrl = `${BASE_URL}/images/produktai/${CATEGORY}/${product.code}.100.png`;
  const productUrl = `${BASE_URL}/produktai/${CATEGORY}/1-12-081`;
  const aggregateRating = calculateAggregateRating(product.reviews);

  const jsonLd: any = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    description: `${product.name} - Aukštos kokybės interjero dekoracijos produktai. ${product.sudetis || 'Poliuretanas'} dekoras.`,
    image: imageUrl,
    url: productUrl,
    brand: {
      '@type': 'Brand',
      name: 'Interjero ir Fasado Dekoratoriai',
    },
    sku: product.code,
    mpn: product.code,
  };

  if (aggregateRating) {
    jsonLd.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: aggregateRating.ratingValue,
      reviewCount: aggregateRating.reviewCount,
      bestRating: aggregateRating.bestRating,
      worstRating: aggregateRating.worstRating,
    };
  }

  if (product.reviews && product.reviews.length > 0) {
    jsonLd.review = product.reviews.map((review: any) => {
      const normalizedReviewRating = (review.rating / 2).toFixed(1);
      return {
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: normalizedReviewRating,
          bestRating: '5',
          worstRating: '1',
        },
        author: {
          '@type': 'Person',
          name: review.customerName,
        },
        datePublished: review.date,
        reviewBody: review.comment,
      };
    });
  }

  if (product.price) {
    jsonLd.offers = {
      '@type': 'Offer',
      price: product.price.toFixed(2),
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      url: productUrl,
      priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        .toISOString()
        .split('T')[0],
    };
  }

  return jsonLd;
};

export default async function Page() {
  // Try both code formats
  const product = await getProduct('1.12.081') || await getProduct('1-12-081');

  if (!product) {
    return <div>Produktas nerastas (1.12.081)</div>;
  }

  const structuredData = generateProductJsonLd(product);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ProductPageTemplate product={product} />
    </>
  );
}
