#!/usr/bin/env python3
"""
Update page.tsx and meta.ts files for all existing products
Updates proper JSON-LD structured data for each product page
"""

import json
import os
from pathlib import Path

# All categories mapping (folder name -> JSON file name)
CATEGORIES = {
    'apvadu-kampai': 'apvadu-kampai',
    'architravai': 'architravai',
    'arkiniai-elementai': 'arkiniai-elementai',
    'balustrados-pagrindai': 'balustrados-pagrindai',
    'balustrados-porankiai': 'balustrados-porankiai',
    'balustrai': 'balustrai',
    'bossage': 'bossage',
    'fasado-ornamentai': 'fasado-ornamentai',
    'footpiece': 'footpiece',
    'frizai': 'frizai',
    'gembes': 'gembes',
    'grindjuostes': 'grindjuostes',
    'kapiteliai': 'kapiteliai',
    'kolonos': 'kolonos',
    'kolonos-liemuo': 'kolonos-liemuo',
    'lango-angokrastai': 'lango-angokrastai',
    'lango-arkiniai-remai': 'lango-arkiniai-remai',
    'lauko-palanges': 'lauko-palanges',
    'lubu-apvadai': 'lubu-apvadai',
    'lubu-paneles': 'lubu-paneles',
    'nisos': 'nisos',
    'ornamentai': 'ornamentai',
    'pagrindai': 'pagrindai',
    'pedimentai': 'pedimentai',
    'piliastrai': 'piliastrai',
    'pjedestalines-gembes': 'pjedestalines-gembes',
    'platband': 'platband',
    'postcap': 'postcap',
    'puskolonos': 'puskolonos',
    'riejamieji-elementai': 'riejamieji-elementai',
    'rozetes': 'rozetes',
    'rustikai': 'rustikai',
    'sienu-apvadai': 'sienu-apvadai',
    'sienu-paneles': 'sienu-paneles',
    'stulpo-kepure': 'stulpo-kepure',
    'zidinio-dekoracija': 'zidinio-dekoracija',
    'ziedai': 'ziedai',
}

def get_template_component_name(category):
    """Convert category name to PascalCase template name"""
    parts = category.split('-')
    pascal = ''.join(word.capitalize() for word in parts)
    return f"{pascal}Template"


def generate_page_tsx(category, product_code):
    """Generate page.tsx content for a product"""
    template_name = get_template_component_name(category)
    json_file = CATEGORIES[category]
    
    return f"""import {{ {template_name} }} from '../../../components/ProductPage/template';
export {{ generateMetadata }} from './meta';

const productData = require('@/app/data/{category}/{json_file}.json').products;

const BASE_URL = 'https://www.dekoratoriai.lt';
const CATEGORY = '{category}';

const getProduct = async (productCode: string) => {{
  return productData.find((product: any) => product.code === productCode);
}};

const calculateAggregateRating = (reviews?: any[]) => {{
  if (!reviews || reviews.length === 0) return null;
  
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / reviews.length;
  // Divide by 2 to convert from 10-point to 5-point scale
  const normalizedRating = averageRating / 2;
  
  return {{
    ratingValue: normalizedRating.toFixed(1),
    reviewCount: reviews.length,
    bestRating: "5",
    worstRating: "1"
  }};
}};

const generateProductJsonLd = (product: any) => {{
  const imageUrl = `${{BASE_URL}}/images/produktai/${{CATEGORY}}/${{product.code}}.100.png`;
  const productUrl = `${{BASE_URL}}/produktai/${{CATEGORY}}/${{product.code}}`;
  const aggregateRating = calculateAggregateRating(product.reviews);

  const jsonLd: any = {{
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "description": `${{product.name}} - Aukštos kokybės interjero dekoracijos produktai. ${{product.sudetis || 'Poliuretanas'}} dekoras.`,
    "image": imageUrl,
    "url": productUrl,
    "brand": {{
      "@type": "Brand",
      "name": "Interjero ir Fasado Dekoratoriai"
    }},
    "sku": product.code,
    "mpn": product.code
  }};

  if (aggregateRating) {{
    jsonLd.aggregateRating = {{
      "@type": "AggregateRating",
      "ratingValue": aggregateRating.ratingValue,
      "reviewCount": aggregateRating.reviewCount,
      "bestRating": aggregateRating.bestRating,
      "worstRating": aggregateRating.worstRating
    }};
  }}

  if (product.reviews && product.reviews.length > 0) {{
    jsonLd.review = product.reviews.map((review: any) => {{
      // Divide individual review rating by 2
      const normalizedReviewRating = (review.rating / 2).toFixed(1);
      
      return {{
        "@type": "Review",
        "reviewRating": {{
          "@type": "Rating",
          "ratingValue": normalizedReviewRating,
          "bestRating": "5",
          "worstRating": "1"
        }},
        "author": {{
          "@type": "Person",
          "name": review.customerName
        }},
        "datePublished": review.date,
        "reviewBody": review.comment
      }};
    }});
  }}

  if (product.price) {{
    jsonLd.offers = {{
      "@type": "Offer",
      "price": product.price.toFixed(2),
      "priceCurrency": "EUR",
      "availability": "https://schema.org/InStock",
      "url": productUrl,
      "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        .toISOString()
        .split('T')[0]
    }};
  }}

  return jsonLd;
}};

export default async function Page() {{
  const product = await getProduct('{product_code}');
  
  if (!product) {{
    return <div>Product not found</div>;
  }}

  const structuredData = generateProductJsonLd(product);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{{{ __html: JSON.stringify(structuredData) }}}}
      />
      <{template_name} product={{product}} />
    </>
  );
}}
"""


def generate_meta_ts(category, product_code):
    """Generate meta.ts content for a product"""
    json_file = CATEGORIES[category]
    
    return f"""import type {{ Metadata }} from 'next';

const productData = require('@/app/data/{category}/{json_file}.json').products;

const BASE_URL = 'https://www.dekoratoriai.lt';
const CATEGORY = '{category}';

const getProduct = (code: string) => {{
  return productData.find((product: any) => product.code === code);
}};

const calculateAggregateRating = (reviews?: any[]) => {{
  if (!reviews || reviews.length === 0) return null;
  
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / reviews.length;
  // Divide by 2 to convert from 10-point to 5-point scale
  const normalizedRating = averageRating / 2;
  
  return {{
    ratingValue: normalizedRating.toFixed(1),
    reviewCount: reviews.length,
    bestRating: "5",
    worstRating: "1"
  }};
}};

export async function generateMetadata(): Promise<Metadata> {{
  const product = getProduct('{product_code}');

  if (!product) {{
    return {{
      title: 'Produktas nerastas | Interjero ir Fasado Dekoratoriai',
      description: 'Norimas produktas nebuvo rastas.',
      robots: {{
        index: false,
        follow: true
      }}
    }};
  }}

  const canonicalUrl = `${{BASE_URL}}/produktai/${{CATEGORY}}/${{product.code}}`;
  const imageUrl = `${{BASE_URL}}/images/produktai/${{CATEGORY}}/${{product.code}}.100.png`;
  const aggregateRating = calculateAggregateRating(product.reviews);
  
  const description = `${{product.name}} - Aukštos kokybės interjero dekoracijos produktai. ${{product.sudetis || 'Poliuretanas'}} dekoras.${{product.price ? ` Kaina: €${{product.price.toFixed(2)}}` : ''}}`;

  const ratingText = aggregateRating 
    ? ` | Įvertinimas: ${{aggregateRating.ratingValue}}/5 (${{aggregateRating.reviewCount}} atsiliepimai)`
    : '';

  return {{
    title: `${{product.name}}${{ratingText}} | Interjero ir Fasado Dekoratoriai`,
    description,
    alternates: {{
      canonical: canonicalUrl
    }},
    openGraph: {{
      title: `${{product.name}} - Aukštos kokybės interjero dekoracijos`,
      description,
      url: canonicalUrl,
      images: [
        {{
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: product.name
        }}
      ],
      type: 'website',
      siteName: 'Interjero ir Fasado Dekoratoriai'
    }},
    twitter: {{
      card: 'summary_large_image',
      title: `${{product.name}} - Aukštos kokybės interjero dekoracijos`,
      description,
      images: [imageUrl]
    }},
    robots: {{
      index: true,
      follow: true
    }}
  }};
}}
"""


def scan_and_update_products(pages_dir, dry_run=True):
    """Scan existing directory structure and update files"""
    
    total_updated = 0
    total_categories = 0
    
    # Iterate through each category folder
    for category in CATEGORIES.keys():
        category_path = os.path.join(pages_dir, category)
        
        if not os.path.exists(category_path) or not os.path.isdir(category_path):
            continue
        
        category_updated = 0
        
        # List all subdirectories (product codes)
        try:
            entries = os.listdir(category_path)
        except Exception as e:
            print(f"  ⚠️  Error reading category {category}: {e}")
            continue
        
        for entry in entries:
            product_dir = os.path.join(category_path, entry)
            
            # Skip if not a directory or if it's page.tsx (category page)
            if not os.path.isdir(product_dir) or entry == 'page.tsx':
                continue
            
            # The directory name is the product code
            product_code = entry
            
            # Check if page.tsx and meta.ts exist
            page_path = os.path.join(product_dir, 'page.tsx')
            meta_path = os.path.join(product_dir, 'meta.ts')
            
            if not os.path.exists(page_path) and not os.path.exists(meta_path):
                print(f"    ⚠️  Skipping {category}/{product_code} - no files found")
                continue
            
            if dry_run:
                print(f"    Would update: {category}/{product_code}/")
            else:
                # Generate and write page.tsx
                if os.path.exists(page_path):
                    page_content = generate_page_tsx(category, product_code)
                    with open(page_path, 'w', encoding='utf-8') as f:
                        f.write(page_content)
                
                # Generate and write meta.ts
                if os.path.exists(meta_path):
                    meta_content = generate_meta_ts(category, product_code)
                    with open(meta_path, 'w', encoding='utf-8') as f:
                        f.write(meta_content)
                
                print(f"    ✅ Updated: {category}/{product_code}/")
            
            category_updated += 1
            total_updated += 1
        
        if category_updated > 0:
            total_categories += 1
            if dry_run:
                print(f"\n📁 {category}: {category_updated} products")
            else:
                print(f"\n📁 {category}: {category_updated} products updated")
    
    return total_categories, total_updated


def main():
    import sys
    
    # Directories
    pages_dir = '/workspaces/stackblitz-starters-trpqscmn/app/produktai'
    
    # Check for alternative paths
    if not os.path.exists(pages_dir):
        pages_dir = './app/produktai'
    
    if not os.path.exists(pages_dir):
        pages_dir = './produktai'
    
    # Check for --run flag
    dry_run = '--run' not in sys.argv
    
    if dry_run:
        print("\n" + "="*70)
        print("  DRY RUN - PREVIEW MODE")
        print("="*70)
        print(f"\n📂 Pages directory: {pages_dir}")
        print("\nScanning existing files that would be updated...\n")
    else:
        print("\n" + "="*70)
        print("  UPDATING FILES")
        print("="*70)
        print(f"\n📂 Pages directory: {pages_dir}\n")
    
    categories, products = scan_and_update_products(pages_dir, dry_run)
    
    print("\n" + "="*70)
    if dry_run:
        print("  PREVIEW SUMMARY")
    else:
        print("  RESULTS")
    print("="*70)
    print(f"\n📊 Statistics:")
    print(f"  • Categories processed: {categories}")
    print(f"  • Products: {products}")
    print(f"  • Files that would be updated: {products * 2} (page.tsx + meta.ts)")
    
    if dry_run:
        print(f"\n⚠️  This is PREVIEW ONLY - no files updated!")
        print("\n" + "🔔 " + "="*66)
        print("  TO ACTUALLY UPDATE FILES, RUN:")
        print(f"  python {sys.argv[0]} --run")
        print("="*68)
    else:
        print(f"\n✅ Successfully updated all files!")
    
    print("\n")


if __name__ == "__main__":
    main()