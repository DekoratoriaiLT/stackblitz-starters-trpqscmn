'use client';

import React, { useEffect, useState } from 'react';
import { Star, MessageCircle, ThumbsUp } from 'lucide-react';

interface Review {
  reviewId: string;
  customerName: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
  helpful: number;
}

interface ReviewsSectionProps {
  productCode: string;
  category: string;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ 
  productCode,
  category 
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<
    'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful'
  >('newest');

  /* ================= LOAD REVIEWS DYNAMICALLY ================= */
  useEffect(() => {
    const loadReviews = async () => {
      console.log('[ReviewsSection] Component mounted with:', { productCode, category });
      
      if (!productCode || !category) {
        console.warn('[ReviewsSection] Missing productCode or category', {
          productCode,
          category,
        });
        setLoading(false);
        return;
      }

      try {
        console.log(`[ReviewsSection] Attempting to load data for product: ${productCode}, category: ${category}`);
        
        // Try to dynamically import the category JSON file
        let productData;
        try {
          const dataModule = await import(`@/app/data/${category}/${category}.json`);
          productData = dataModule.default;
        } catch (importError) {
          console.warn(`[ReviewsSection] Could not load ${category}/${category}.json, trying alternative paths...`);
          
          // Fallback: try loading from root data folder
          try {
            const fallbackModule = await import(`@/app/data/${category}.json`);
            productData = fallbackModule.default;
          } catch (fallbackError) {
            console.error('[ReviewsSection] Could not load product data from any path');
            setReviews([]);
            setLoading(false);
            return;
          }
        }

        console.log('[ReviewsSection] Loaded product data:', productData);
        console.log('[ReviewsSection] Product data keys:', Object.keys(productData));
        console.log('[ReviewsSection] Products array length:', productData.products?.length);

        // Handle different JSON structures
        let productsArray = productData.products || productData;
        
        if (!Array.isArray(productsArray)) {
          console.error('[ReviewsSection] Products data is not an array', productsArray);
          setReviews([]);
          setLoading(false);
          return;
        }

        console.log('[ReviewsSection] Products array:', productsArray);
        console.log('[ReviewsSection] Looking for productCode:', productCode);
        console.log('[ReviewsSection] All product codes in array:', productsArray.map((p: any) => p.code || p.id));

        // Find the product by code
        const product = productsArray.find(
          (p: any) => p.code === productCode || p.id === productCode
        );

        console.log('[ReviewsSection] Found product:', product);
        console.log('[ReviewsSection] Product has reviews?', product?.reviews);
        console.log('[ReviewsSection] Reviews is array?', Array.isArray(product?.reviews));
        console.log('[ReviewsSection] Reviews length:', product?.reviews?.length);

        if (product?.reviews && Array.isArray(product.reviews)) {
          setReviews(product.reviews);
          console.log('[ReviewsSection] Set reviews:', product.reviews);
        } else {
          console.log('[ReviewsSection] No reviews found for product:', productCode);
          setReviews([]);
        }
      } catch (error) {
        console.error('[ReviewsSection] Error loading reviews:', error);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [productCode, category]);

  /* ================= DERIVED DATA ================= */
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'oldest':
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case 'highest':
        return b.rating - a.rating;
      case 'lowest':
        return a.rating - b.rating;
      case 'helpful':
        return b.helpful - a.helpful;
      default:
        return 0;
    }
  });

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('lt-LT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const renderStarRating = (rating: number, size = 18) => (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={star <= rating ? 'text-teal-500' : 'text-gray-300'}
          fill={star <= rating ? 'currentColor' : 'none'}
        />
      ))}
    </div>
  );

  /* ================= LOADING STATE ================= */
  if (loading) {
    return (
      <section className="py-12 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
        </div>
      </section>
    );
  }

  /* ================= EMPTY STATE ================= */
  if (reviews.length === 0) {
    console.log('[ReviewsSection] Rendering empty state for:', { productCode, category });
    return (
      <section className="py-12 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <h2 className="text-2xl font-bold mb-3">Klientų atsiliepimai</h2>
          <p className="text-gray-600 mb-6">
            Kol kas nėra atsiliepimų apie šį produktą.
          </p>
          <p className="text-xs text-gray-400 mb-4">
            Produkto kodas: {productCode} | Kategorija: {category}
          </p>
          <button className="bg-slate-800 text-white py-2.5 px-6 rounded-lg hover:bg-slate-700 transition-colors inline-flex items-center gap-2 text-sm">
            <MessageCircle size={16} />
            Būkite pirmas parašęs atsiliepimą
          </button>
        </div>
      </section>
    );
  }

  /* ================= RENDER ================= */
  return (
    <section className="py-12 bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Klientų atsiliepimai
        </h2>

        {/* Average Rating */}
        <div className="flex items-center justify-center gap-3 mb-6">
          {renderStarRating(Math.round(averageRating), 22)}
          <span className="text-xl font-semibold">
            {averageRating.toFixed(1)}
          </span>
          <span className="text-gray-500 text-sm">
            ({reviews.length} {reviews.length === 1 ? 'atsiliepimas' : 'atsiliepimai'})
          </span>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600 font-medium">
              Rūšiuoti:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
            >
              <option value="newest">Naujausi</option>
              <option value="oldest">Seniausi</option>
              <option value="highest">Aukščiausias</option>
              <option value="lowest">Žemiausias</option>
              <option value="helpful">Naudingiausi</option>
            </select>
          </div>

          <button className="bg-slate-800 text-white py-2 px-5 rounded-lg hover:bg-slate-700 transition-colors inline-flex items-center gap-2 text-sm">
            <MessageCircle size={16} />
            Parašyti atsiliepimą
          </button>
        </div>

        {/* Reviews List */}
        <div className="max-w-4xl mx-auto space-y-4">
          {sortedReviews.map((review) => (
            <div
              key={review.reviewId}
              className="bg-white rounded-lg p-5 shadow-sm border border-gray-200"
            >
              <div className="flex justify-between mb-2">
                <div>
                  <strong>{review.customerName}</strong>
                  {review.verified && (
                    <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                      Patvirtintas
                    </span>
                  )}
                  <div className="text-xs text-gray-500">
                    {formatDate(review.date)}
                  </div>
                </div>
                <div className="text-right">
                  {renderStarRating(review.rating, 16)}
                  <div className="flex items-center gap-1 text-xs text-gray-500 justify-end">
                    <ThumbsUp size={12} />
                    {review.helpful}
                  </div>
                </div>
              </div>

              <h4 className="font-semibold mb-1">{review.title}</h4>
              <p className="text-sm text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;