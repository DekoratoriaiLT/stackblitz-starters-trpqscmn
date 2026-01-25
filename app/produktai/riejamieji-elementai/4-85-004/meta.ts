import type { Metadata } from 'next';

const productData = require('@/app/data/riejamieji-elementai/riejamieji-elementai.json').products;

const getProduct = (code: string) => {
  return productData.find((product: any) =>
    product.code === code
  );
};

export async function generateMetadata(): Promise<Metadata> {
  const product = getProduct('4.85.004');

  if (!product) {
    return {
      title: 'Product Not Found | Interjero ir Fasado Dekoratoriai',
      description: 'The requested product could not be found.'
    };
  }

  const canonicalUrl = `https://www.dekoratoriai.lt/produktai/riejamieji-elementai/${product.code}`;

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
