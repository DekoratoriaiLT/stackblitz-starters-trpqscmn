import { LubiniaiApvadaiTemplate } from '../../../components/ProductPage/template';

export { generateMetadata } from './meta';

const productData = require('@/app/data/ornamentai/ornamentai.json').products;

const getProduct = async (productCode: string) => {
  return productData.find((product: any) =>
    product.code === productCode
  );
};

const getStructuredData = (product: any) => {
  const canonicalUrl = `https://www.dekoratoriai.lt/produktai/ornamentai/${product.code}`;
  const description = `${product.name} - Aukštos kokybės interjero dekoracijos product with high-quality gypsum molding.`;

  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    description,
    
    url: canonicalUrl,
    brand: {
      "@type": "Brand",
      name: "Interjero ir Fasado Dekoratoriai"
    },
    sku: product.code,
    mpn: product.code,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock"
    }
  };

  return [productSchema];
};

export default async function Page() {
  const product = await getProduct('1.60.501');

  if (!product) {
    return <div>Product not found</div>;
  }

  const structuredData = getStructuredData(product);

  return (
    <>
      {structuredData.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <LubiniaiApvadaiTemplate product={product} />
    </>
  );
}
