import type { Metadata } from 'next';

const productData = require('@/app/data/pedimentai/pedimentai.json').products;

const getProduct = (code: string) => {
  return productData.find((product: any) =>
    product.code === code
  );
};

export async function generateMetadata(): Promise<Metadata> {
  const product = getProduct('1.63.002');

  if (!product) {
    return {
      title: 'Product Not Found | Interjero ir Fasado Dekoratoriai',
      description: 'The requested product could not be found.'
    };
  }

  const canonicalUrl = `https://www.dekoratoriai.lt/produktai/pedimentai/${product.code}`;

  const description = `${product.name} - Premium interior decoration product. High-quality gypsum molding for professional interior design.`;

  return {
    title: `${product.name} - Premium Interior Decoration | Interjero ir Fasado Dekoratoriai`,
    description,
    alternates: {
      canonical: canonicalUrl
    },
    openGraph: {
      title: `${product.name} - Premium Interior Decoration`,
      description,
      url: canonicalUrl,
      images: [
        {
          url: product.images[0]?.url || '',
          width: 1200,
          height: 630
        }
      ]
    },
    robots: {
      index: true,
      follow: true
    }
  };
}
