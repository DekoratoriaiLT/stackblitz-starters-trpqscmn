#!/usr/bin/env python3
"""
Script to:
1. Revert the category page.tsx files (undo the wrong changes)
2. Only update the template.tsx file (the actual fix needed)

The individual product pages (like 1-59-004/page.tsx) are already correct!
They just need the fixed template.tsx file.
"""

import os
import subprocess
from pathlib import Path

def run_command(cmd, cwd=None):
    """Run a shell command and return output"""
    try:
        result = subprocess.run(
            cmd, 
            shell=True, 
            cwd=cwd, 
            capture_output=True, 
            text=True
        )
        return result.returncode == 0, result.stdout, result.stderr
    except Exception as e:
        return False, "", str(e)

def revert_category_pages(project_root):
    """Revert all category page.tsx files using git"""
    print("Step 1: Reverting category page.tsx files...")
    print("=" * 60)
    
    cmd = "git checkout app/produktai/*/page.tsx"
    success, stdout, stderr = run_command(cmd, cwd=project_root)
    
    if success:
        print("✓ Successfully reverted category page.tsx files")
        if stdout:
            print(stdout)
    else:
        print("⚠ Warning: Git checkout failed")
        print(stderr)
        print("\nYou may need to manually run:")
        print("  git checkout app/produktai/*/page.tsx")
    
    print()

def create_template_file(project_root):
    """Create the corrected template.tsx file"""
    print("Step 2: Creating fixed template.tsx file...")
    print("=" * 60)
    
    template_path = project_root / "app" / "components" / "ProductPage" / "template.tsx"
    
    # Make sure directory exists
    template_path.parent.mkdir(parents=True, exist_ok=True)
    
    template_content = '''import { ProductGallery } from './ProductGallery';
import { ProductInfo } from './ProductInfo';
import { ProductFeatures } from './ProductFeatures';
import { AddToCartButton } from './AddToCartButton';
import ReviewsSection from './ReviewsSection';

const R2_BASE_URL =
  'https://pub-262c7ff9747743f0853580fc0debb426.r2.dev';

interface ImageData {
  filename: string;
  url: string;
  local_path: string;
}

interface Product {
  name: string;
  url: string;
  code: string | null;
  category: string;
  images: ImageData[];
  details: Record<string, string>;
  flexible_analog_exists: boolean;
  mounting_instructions: string;
}

interface ProductPageProps {
  product: Product;
}

export function ProductPageTemplate({
  product,
}: ProductPageProps) {
  // Extract the code from URL if needed (e.g. 1-50-100)
  const urlCode =
    product.url?.split('/').filter(Boolean).pop() ?? null;

  // Resolve product code to ALWAYS be a string
  const resolvedProductCode: string =
    product.code ??
    (urlCode
      ? urlCode.replace(/-/g, '.')
      : product.name.replace(/\\s+/g, '-'));

  // Optional: model path (safe string)
  const modelPath = `${R2_BASE_URL}/lubu-apvadai/${resolvedProductCode}.obj`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Breadcrumbs */}
      <div className="bg-slate-900/80 border-b border-slate-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <nav className="flex items-center space-x-3 text-sm">
            <a
              href="/"
              className="text-slate-400 hover:text-emerald-400 transition-colors font-medium"
            >
              Pagrindinis
            </a>
            <span className="text-slate-600">/</span>
            <a
              href="/produktai"
              className="text-slate-400 hover:text-emerald-400 transition-colors font-medium"
            >
              Produktai
            </a>
            <span className="text-slate-600">/</span>
            <a
              href={`/produktai/${product.category}`}
              className="text-slate-400 hover:text-emerald-400 transition-colors font-medium"
            >
              {product.category.replace(/-/g, ' ').replace(/\\b\\w/g, l => l.toUpperCase())}
            </a>
            <span className="text-slate-600">/</span>
            <span className="text-white font-bold">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <ProductGallery
              productName={product.name}
              category={product.category}
            />
          </div>

          <div>
            <ProductInfo
              name={product.name}
              category={product.category}
              details={product.details}
              url={product.url}
            />

            <div className="mt-8">
              <AddToCartButton product={product} />
            </div>
          </div>
        </div>

        <div className="mb-16">
          <ProductFeatures
            flexibleAnalogExists={product.flexible_analog_exists}
            mountingInstructions={product.mounting_instructions}
          />
        </div>
      </div>

      {/* Reviews – FIXED */}
      <ReviewsSection
        key={`reviews-${resolvedProductCode}`}
        productCode={resolvedProductCode}
        category={product.category}
      />

      {/* Benefits */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-t border-slate-700/50 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center group">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-700/50 group-hover:border-emerald-400/50 transition-all duration-300 shadow-lg">
                <svg
                  className="w-10 h-10 text-emerald-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-white mb-2 text-lg">
                Nemokamas pristatymas
              </h3>
              <p className="text-slate-400">
                Užsakymams virš 1000 EUR
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-700/50 group-hover:border-blue-400/50 transition-all duration-300 shadow-lg">
                <svg
                  className="w-10 h-10 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-white mb-2 text-lg">
                Kokybės garantija
              </h3>
              <p className="text-slate-400">
                Aukščiausios kokybės medžiagos
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-700/50 group-hover:border-emerald-400/50 transition-all duration-300 shadow-lg">
                <svg
                  className="w-10 h-10 text-emerald-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-white mb-2 text-lg">
                Ekspertų pagalba
              </h3>
              <p className="text-slate-400">
                Profesionali konsultacija
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
'''
    
    with open(template_path, 'w', encoding='utf-8') as f:
        f.write(template_content)
    
    print(f"✓ Created: {template_path}")
    print()

def show_summary():
    """Show summary of what was done"""
    print("=" * 60)
    print("✓ COMPLETE!")
    print("=" * 60)
    print()
    print("What was fixed:")
    print("  1. ✓ Reverted category page.tsx files (they keep 'use client')")
    print("  2. ✓ Created fixed template.tsx with ProductPageTemplate export")
    print()
    print("The individual product pages were already correct!")
    print("They just needed the fixed template.tsx file.")
    print()
    print("Next steps:")
    print("  1. Test the build: npm run build")
    print("  2. Check git status: git status")
    print("  3. Commit the template.tsx change:")
    print("     git add app/components/ProductPage/template.tsx")
    print("     git commit -m 'Fix ProductPageTemplate export'")
    print()

def main():
    # Find project root (look for package.json)
    current_dir = Path.cwd()
    project_root = current_dir
    
    # Try to find project root by looking for package.json
    while project_root != project_root.parent:
        if (project_root / "package.json").exists():
            break
        project_root = project_root.parent
    
    if not (project_root / "package.json").exists():
        project_root = current_dir
    
    print("🔧 Fix Product Template Script")
    print("=" * 60)
    print(f"Project root: {project_root}")
    print()
    
    # Step 1: Revert category pages
    revert_category_pages(project_root)
    
    # Step 2: Create template file
    create_template_file(project_root)
    
    # Show summary
    show_summary()

if __name__ == "__main__":
    main()