#!/usr/bin/env python3
"""
Fix noindex on all product pages.

ROOT CAUSE:
  In meta.ts, getProduct('1-50-100') looks up by product code.
  But the JSON stores codes as '1.50.100' (dots), not '1-50-100' (dashes).
  So product is never found → falls into the `if (!product)` branch → index: false.

SOLUTION:
  Rewrite every product's meta.ts to look up the code correctly,
  with a dot-format code (1.50.100) AND a dash fallback (1-50-100).
  Also rewrite page.tsx to match the same pattern.

Usage:
  python3 fix_all_product_pages.py app/produktai
  python3 fix_all_product_pages.py .   (if already inside app/produktai)
"""

import sys
import os
import json
import re
from pathlib import Path

BASE_URL = "https://www.dekoratoriai.lt"
SITE_NAME = "Interjero ir Fasado Dekoratoriai"


def folder_to_dot_code(folder_name: str) -> str:
    """1-50-100 → 1.50.100"""
    return folder_name.replace("-", ".")


def find_product_in_json(data_path: Path, dot_code: str, dash_code: str):
    """Try to find a product in the JSON by dot code, then dash code, then partial match."""
    if not data_path.exists():
        return None, None

    try:
        with open(data_path, encoding="utf-8") as f:
            raw = json.load(f)

        products = raw if isinstance(raw, list) else raw.get("products", [])

        # Try exact dot code first (1.50.100)
        for p in products:
            if p.get("code") == dot_code:
                return p, dot_code

        # Try dash code (1-50-100)
        for p in products:
            if p.get("code") == dash_code:
                return p, dash_code

        # Try case-insensitive partial
        for p in products:
            code = p.get("code", "")
            if code.replace(".", "-") == dash_code or code.replace("-", ".") == dot_code:
                return p, code

        return None, None

    except Exception as e:
        print(f"    ⚠ Could not read JSON {data_path}: {e}")
        return None, None


def build_meta_ts(category: str, dot_code: str, dash_code: str, product) -> str:
    """Build the complete meta.ts content."""

    product_name = product.get("name", f"{category} {dot_code}") if product else f"{category} {dot_code}"
    price_line = ""
    if product and product.get("price"):
        price_line = f" Kaina: €{product['price']:.2f}."

    return f"""import type {{ Metadata }} from 'next';

const productData = require('@/app/data/{category}/{category}.json').products;

const BASE_URL = '{BASE_URL}';
const CATEGORY = '{category}';

const getProduct = (code: string) => {{
  // Try dot format (1.50.100) first, then dash format (1-50-100)
  return (
    productData.find((p: any) => p.code === code) ||
    productData.find((p: any) => p.code === code.replace(/-/g, '.')) ||
    productData.find((p: any) => p.code === code.replace(/\\./g, '-'))
  );
}};

const calculateAggregateRating = (reviews?: any[]) => {{
  if (!reviews || reviews.length === 0) return null;
  const totalRating = reviews.reduce((sum: number, review: any) => sum + review.rating, 0);
  const averageRating = totalRating / reviews.length;
  const normalizedRating = averageRating / 2;
  return {{
    ratingValue: normalizedRating.toFixed(1),
    reviewCount: reviews.length,
    bestRating: '5',
    worstRating: '1',
  }};
}};

export async function generateMetadata(): Promise<Metadata> {{
  // Try both formats so the lookup never fails
  const product = getProduct('{dot_code}') || getProduct('{dash_code}');

  if (!product) {{
    // Fallback metadata — still indexable
    return {{
      title: '{product_name} | {SITE_NAME}',
      description: 'Aukštos kokybės poliuretano dekoracijos. Platus pasirinkimas, greitas pristatymas.',
      robots: {{
        index: true,
        follow: true,
      }},
      alternates: {{
        canonical: `${{BASE_URL}}/produktai/${{CATEGORY}}/{dash_code}`,
      }},
    }};
  }}

  const canonicalUrl = `${{BASE_URL}}/produktai/${{CATEGORY}}/{dash_code}`;
  const imageUrl = `${{BASE_URL}}/images/produktai/${{CATEGORY}}/${{product.code}}.100.png`;
  const aggregateRating = calculateAggregateRating(product.reviews);

  const description = `${{product.name}} - Aukštos kokybės interjero dekoracijos produktai. ${{product.sudetis || 'Poliuretanas'}} dekoras.${{product.price ? ` Kaina: €${{product.price.toFixed(2)}}` : ''}}`;

  const ratingText = aggregateRating
    ? ` | Įvertinimas: ${{aggregateRating.ratingValue}}/5 (${{aggregateRating.reviewCount}} atsiliepimai)`
    : '';

  return {{
    title: `${{product.name}}${{ratingText}} | {SITE_NAME}`,
    description,
    alternates: {{
      canonical: canonicalUrl,
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
          alt: product.name,
        }},
      ],
      type: 'website',
      siteName: '{SITE_NAME}',
    }},
    twitter: {{
      card: 'summary_large_image',
      title: `${{product.name}} - Aukštos kokybės interjero dekoracijos`,
      description,
      images: [imageUrl],
    }},
    robots: {{
      index: true,
      follow: true,
      googleBot: {{
        index: true,
        follow: true,
      }},
    }},
  }};
}}
"""


def build_page_tsx(category: str, dot_code: str, dash_code: str) -> str:
    """Build the complete page.tsx content."""

    # Compute relative path depth: produktai/category/product-code/page.tsx
    # → components is at ../../../components
    return f"""import {{ ProductPageTemplate }} from '../../../components/ProductPage/template';
export {{ generateMetadata }} from './meta';

const productData = require('@/app/data/{category}/{category}.json').products;

const BASE_URL = '{BASE_URL}';
const CATEGORY = '{category}';

const getProduct = async (code: string) => {{
  // Try both dot (1.50.100) and dash (1-50-100) formats
  return (
    productData.find((p: any) => p.code === code) ||
    productData.find((p: any) => p.code === code.replace(/-/g, '.')) ||
    productData.find((p: any) => p.code === code.replace(/\\./g, '-'))
  );
}};

const calculateAggregateRating = (reviews?: any[]) => {{
  if (!reviews || reviews.length === 0) return null;
  const totalRating = reviews.reduce((sum: number, review: any) => sum + review.rating, 0);
  const averageRating = totalRating / reviews.length;
  const normalizedRating = averageRating / 2;
  return {{
    ratingValue: normalizedRating.toFixed(1),
    reviewCount: reviews.length,
    bestRating: '5',
    worstRating: '1',
  }};
}};

const generateProductJsonLd = (product: any) => {{
  const imageUrl = `${{BASE_URL}}/images/produktai/${{CATEGORY}}/${{product.code}}.100.png`;
  const productUrl = `${{BASE_URL}}/produktai/${{CATEGORY}}/{dash_code}`;
  const aggregateRating = calculateAggregateRating(product.reviews);

  const jsonLd: any = {{
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    description: `${{product.name}} - Aukštos kokybės interjero dekoracijos produktai. ${{product.sudetis || 'Poliuretanas'}} dekoras.`,
    image: imageUrl,
    url: productUrl,
    brand: {{
      '@type': 'Brand',
      name: '{SITE_NAME}',
    }},
    sku: product.code,
    mpn: product.code,
  }};

  if (aggregateRating) {{
    jsonLd.aggregateRating = {{
      '@type': 'AggregateRating',
      ratingValue: aggregateRating.ratingValue,
      reviewCount: aggregateRating.reviewCount,
      bestRating: aggregateRating.bestRating,
      worstRating: aggregateRating.worstRating,
    }};
  }}

  if (product.reviews && product.reviews.length > 0) {{
    jsonLd.review = product.reviews.map((review: any) => {{
      const normalizedReviewRating = (review.rating / 2).toFixed(1);
      return {{
        '@type': 'Review',
        reviewRating: {{
          '@type': 'Rating',
          ratingValue: normalizedReviewRating,
          bestRating: '5',
          worstRating: '1',
        }},
        author: {{
          '@type': 'Person',
          name: review.customerName,
        }},
        datePublished: review.date,
        reviewBody: review.comment,
      }};
    }});
  }}

  if (product.price) {{
    jsonLd.offers = {{
      '@type': 'Offer',
      price: product.price.toFixed(2),
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      url: productUrl,
      priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        .toISOString()
        .split('T')[0],
    }};
  }}

  return jsonLd;
}};

export default async function Page() {{
  // Try both code formats
  const product = await getProduct('{dot_code}') || await getProduct('{dash_code}');

  if (!product) {{
    return <div>Produktas nerastas ({dot_code})</div>;
  }}

  const structuredData = generateProductJsonLd(product);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{{{ __html: JSON.stringify(structuredData) }}}}
      />
      <ProductPageTemplate product={{product}} />
    </>
  );
}}
"""


def find_data_json(produktai_dir: Path, category: str) -> Path:
    """Find the JSON data file for a category."""
    # Common patterns
    candidates = [
        produktai_dir.parent / "data" / category / f"{category}.json",
        produktai_dir.parent.parent / "data" / category / f"{category}.json",
        produktai_dir / ".." / ".." / "data" / category / f"{category}.json",
    ]
    for c in candidates:
        resolved = c.resolve()
        if resolved.exists():
            return resolved
    return None


def process_product(product_dir: Path, produktai_dir: Path, data_root: Path, dry_run: bool) -> str:
    """Process one product folder. Returns status string."""
    category = product_dir.parent.name
    folder_name = product_dir.name  # e.g. 1-50-100

    dot_code = folder_to_dot_code(folder_name)   # 1.50.100
    dash_code = folder_name                       # 1-50-100

    page_path = product_dir / "page.tsx"
    meta_path = product_dir / "meta.ts"

    if not page_path.exists():
        return "no_page"

    # Find the JSON data
    data_json = None
    for candidate in [
        data_root / category / f"{category}.json",
        produktai_dir.parent / "data" / category / f"{category}.json",
    ]:
        if candidate.exists():
            data_json = candidate
            break

    product, found_code = find_product_in_json(data_json, dot_code, dash_code) if data_json else (None, None)

    if not dry_run:
        # Write meta.ts
        meta_content = build_meta_ts(category, dot_code, dash_code, product)
        meta_path.write_text(meta_content, encoding="utf-8")

        # Write page.tsx
        page_content = build_page_tsx(category, dot_code, dash_code)
        page_path.write_text(page_content, encoding="utf-8")

    status = "fixed"
    if not product:
        status = "fixed_no_product_found"  # will use fallback metadata
    return status


def main():
    # ── Parse args ──
    if len(sys.argv) > 1:
        produktai_dir = Path(sys.argv[1]).resolve()
    else:
        cwd = Path.cwd()
        for candidate in [cwd / "app" / "produktai", cwd / "produktai", cwd]:
            if (candidate / ".." / ".." / "data").exists() or any(candidate.iterdir()):
                produktai_dir = candidate.resolve()
                break
        else:
            print("❌ Could not find produktai directory.")
            print("   Usage: python3 fix_all_product_pages.py app/produktai")
            sys.exit(1)

    # Find data root (app/data)
    data_root = None
    for candidate in [
        produktai_dir.parent / "data",
        produktai_dir.parent.parent / "data",
    ]:
        if candidate.exists():
            data_root = candidate.resolve()
            break

    print("🔧 Fix All Product Pages (noindex)")
    print("=" * 60)
    print(f"produktai dir : {produktai_dir}")
    print(f"data root     : {data_root or '⚠ NOT FOUND — products will use fallback metadata'}")
    print()

    # ── Collect all product dirs ──
    product_dirs = []
    for category_dir in sorted(produktai_dir.iterdir()):
        if not category_dir.is_dir() or category_dir.name.startswith('.'):
            continue
        for product_dir in sorted(category_dir.iterdir()):
            if not product_dir.is_dir() or product_dir.name.startswith('.'):
                continue
            if (product_dir / "page.tsx").exists():
                product_dirs.append(product_dir)

    if not product_dirs:
        print("⚠ No product pages found.")
        sys.exit(0)

    print(f"Found {len(product_dirs)} product pages")
    print("=" * 60)

    stats = {"fixed": 0, "fixed_no_product": 0, "no_page": 0, "error": 0}

    for product_dir in product_dirs:
        rel = product_dir.relative_to(produktai_dir)
        try:
            result = process_product(product_dir, produktai_dir, data_root or Path("/nonexistent"), dry_run=False)
            if result == "fixed":
                stats["fixed"] += 1
                print(f"  ✓ {rel}")
            elif result == "fixed_no_product_found":
                stats["fixed_no_product"] += 1
                print(f"  ✓ {rel}  ⚠ product not found in JSON — using fallback title")
            elif result == "no_page":
                stats["no_page"] += 1
        except Exception as e:
            stats["error"] += 1
            print(f"  ✗ {rel}  → ERROR: {e}")

    print()
    print("=" * 60)
    print("✅ DONE")
    print("=" * 60)
    print(f"  Fixed successfully:          {stats['fixed']}")
    print(f"  Fixed (fallback title):      {stats['fixed_no_product']}")
    print(f"  Errors:                      {stats['error']}")
    print()
    print("Next steps:")
    print("  1. npm run build  — check for TypeScript errors")
    print("  2. git add app/produktai")
    print("  3. git commit -m 'fix: resolve noindex on all product pages'")
    print("  4. git push")
    print("  5. Request re-indexing in Google Search Console")


if __name__ == "__main__":
    main()