import { KolonosLiemuoTemplate } from '../../../components/ProductPage/template';
export { generateMetadata } from './meta';

const productData = require('@/app/data/kolonos-liemuo/kolonos-liemuo.json').products;

const BASE_URL = 'https://www.dekoratoriai.lt';
const CATEGORY = 'kolonos-liemuo';

const getProduct = async (productCode: string) => {
  return productData.find((product: any) => product.code === productCode);
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

export default async function Page() {
  const product = await getProduct('4-16-301');
  
  if (!product) {
    return <div>Product not found</div>;
  }

  const structuredData = generateProductJsonLd(product);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <KolonosLiemuoTemplate product={product} />
    </>
  );
}
