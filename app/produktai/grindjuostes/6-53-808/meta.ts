import type { Metadata } from 'next';

const productData = require('@/app/data/grindjuostes/grindjuostes.json').products;

const getProduct = (code: string) => {
  return productData.find((product: any) =>
    product.code === code
  );
};

export async function generateMetadata(): Promise<Metadata> {
  const product = getProduct('6.53.808');

  if (!product) {
    return {
      title: 'Product Not Found | Interjero ir Fasado Dekoratoriai',
      description: 'The requested product could not be found.'
    };
  }

  const canonicalUrl = `https://www.dekoratoriai.lt/produktai/grindu-apvadai/${product.code}`;

  const description = `${product.name} - Aukštos kokybės interjero dekoracijos product. High-quality gypsum molding for professional interior design.`;

  return {
    title: `${product.name} - Aukštos kokybės interjero dekoracijos | Interjero ir Fasado Dekoratoriai`,
    description,
    alternates: {
      canonical: canonicalUrl
    },
    openGraph: {
      title: `${product.name} - Aukštos kokybės interjero dekoracijos`,
      description,
      url: canonicalUrl,

    },
    robots: {
      index: true,
      follow: true
    }
  };
}
