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
  category,
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const [sortBy, setSortBy] = useState<
    'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful'
  >('newest');

  /* ================= LOAD REVIEWS ================= */
  useEffect(() => {
    const loadReviews = async () => {
      if (!productCode || !category) {
        setLoading(false);
        return;
      }

      try {
        let productData;

        try {
          const module = await import(
            `@/app/data/${category}/${category}.json`
          );
          productData = module.default;
        } catch {
          const fallback = await import(`@/app/data/${category}.json`);
          productData = fallback.default;
        }

        const productsArray = productData.products || productData;

        if (!Array.isArray(productsArray)) {
          setReviews([]);
          setLoading(false);
          return;
        }

        const product = productsArray.find(
          (p: any) => p.code === productCode || p.id === productCode
        );

        if (product?.reviews && Array.isArray(product.reviews)) {
          setReviews(product.reviews);
        } else {
          setReviews([]);
        }
      } catch (err) {
        console.error('[ReviewsSection] Load error:', err);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [productCode, category]);

  /* ================= CALCULATIONS ================= */

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

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('lt-LT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  /* ================= STARS ================= */

  const renderStars = (rating: number, size = 18) => (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={star <= rating ? 'text-black' : 'text-gray-300'}
          fill={star <= rating ? 'currentColor' : 'none'}
        />
      ))}
    </div>
  );

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <section className="py-24 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto" />
      </section>
    );
  }

  /* ================= EMPTY ================= */

  if (reviews.length === 0) {
    return (
      <section className="py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-light mb-6">
            Klientų atsiliepimai
          </h2>

          <p className="text-gray-600 mb-8">
            Kol kas nėra atsiliepimų.
          </p>

          <button className="bg-black text-white py-3 px-8 hover:bg-gray-800 transition-colors inline-flex items-center">
            <MessageCircle size={18} className="mr-2" />
            Palikti atsiliepimą
          </button>
        </div>
      </section>
    );
  }

  /* ================= RENDER ================= */

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">

        {/* HEADER */}

        <div className="text-center mb-16">
          <h2 className="text-4xl font-light mb-6">
            Klientų atsiliepimai
          </h2>

          <div className="flex items-center justify-center mb-8">
            <div className="flex mr-3">
              {renderStars(Math.round(averageRating), 24)}
            </div>

            <span className="text-2xl font-light">
              {averageRating.toFixed(1)}
            </span>

            <span className="text-gray-500 ml-2">
              ({reviews.length} atsiliepimai)
            </span>
          </div>

          {/* SORT */}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <label className="text-sm text-gray-600">
              Rūšiuoti:
            </label>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="newest">Naujausi</option>
              <option value="oldest">Seniausi</option>
              <option value="highest">Aukščiausias</option>
              <option value="lowest">Žemiausias</option>
              <option value="helpful">Naudingiausi</option>
            </select>
          </div>

          <button className="bg-black text-white py-3 px-8 hover:bg-gray-800 transition-colors inline-flex items-center">
            <MessageCircle size={18} className="mr-2" />
            Rašyti atsiliepimą
          </button>
        </div>

        {/* REVIEWS */}

        <div className="max-w-4xl mx-auto space-y-6">

          {sortedReviews.map((review) => (
            <div
              key={review.reviewId}
              className="bg-gray-100 p-8"
            >
              <div className="flex flex-col md:flex-row md:justify-between mb-4 space-y-2 md:space-y-0">

                <div className="flex-1">

                  <div className="flex items-center mb-2">
                    <span className="font-medium text-lg mr-3">
                      {review.customerName}
                    </span>

                    {review.verified && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        Patvirtinta
                      </span>
                    )}
                  </div>

                  <span className="text-gray-500 text-sm">
                    {formatDate(review.date)}
                  </span>
                </div>

                <div className="flex flex-col items-start md:items-end">

                  {renderStars(review.rating)}

                  <div className="flex items-center mt-2">
                    <ThumbsUp size={14} className="text-gray-400 mr-1" />
                    <span className="text-sm text-gray-500">
                      {review.helpful}
                    </span>
                  </div>

                </div>
              </div>

              <h4 className="font-medium text-xl mb-3">
                {review.title}
              </h4>

              <p className="text-gray-600 leading-relaxed">
                {review.comment}
              </p>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <button className="text-sm text-gray-600 hover:text-black transition-colors flex items-center">
                  <ThumbsUp size={14} className="mr-2" />
                  Ar buvo naudinga?
                </button>
              </div>
            </div>
          ))}

        </div>

        {/* RATING BREAKDOWN */}

        <div className="max-w-4xl mx-auto mt-16 bg-gray-100 p-8">

          <h3 className="text-2xl font-light mb-6 text-center">
            Įvertinimų pasiskirstymas
          </h3>

          <div className="space-y-3">

            {[5, 4, 3, 2, 1].map((rating) => {
              const count = reviews.filter(
                (r) => r.rating === rating
              ).length;

              const percentage =
                reviews.length > 0
                  ? (count / reviews.length) * 100
                  : 0;

              return (
                <div
                  key={rating}
                  className="flex items-center"
                >
                  <span className="text-sm w-8">
                    {rating}
                  </span>

                  <Star
                    size={16}
                    className="text-black mx-2"
                    fill="currentColor"
                  />

                  <div className="flex-1 bg-gray-200 rounded-full h-3 mx-3">

                    <div
                      className="bg-black h-3 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />

                  </div>

                  <span className="text-sm w-12 text-right">
                    {count}
                  </span>
                </div>
              );
            })}

          </div>

        </div>

      </div>
    </section>
  );
};

export default ReviewsSection;
