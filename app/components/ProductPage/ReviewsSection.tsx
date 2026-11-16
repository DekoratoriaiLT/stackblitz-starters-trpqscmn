"use client";

import React, { useEffect, useState } from 'react';
import { Star, MessageCircle, ThumbsUp, CheckCircle2, X } from 'lucide-react';

interface Review {
  reviewId: string;
  customerName: string;
  rating: number; // 10-point scale in the JSON (e.g. 9.5)
  title?: string;
  comment: string;
  date: string;
  verified: boolean;
  helpful: number;
}

/* What gets sent when someone writes a review. Rating is on the same 10-point scale as the JSON. */
export interface NewReviewPayload {
  productCode: string;
  category: string;
  customerName: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
}

interface ReviewsSectionProps {
  productCode: string;
  category: string;
  /**
   * Optional: send the new review to your backend / email / admin panel.
   * Reject (throw) to show an error to the user.
   */
  onSubmitReview?: (review: NewReviewPayload) => Promise<void> | void;
}

/* Converts a 10-point rating to a 5-star rating (divide by 2, round, clamp 1-5) */
const toStars = (rating: number) =>
  Math.min(5, Math.max(1, Math.round(rating / 2)));

/* ================= REVIEW FORM ================= */

interface ReviewFormProps {
  onSubmit: (data: {
    customerName: string;
    stars: number;
    title: string;
    comment: string;
  }) => Promise<void>;
  onClose: () => void;
}

const inputClass =
  'w-full rounded border border-white/15 bg-[#111111] px-3 py-2 text-sm text-[#f5f5f7] outline-none transition-colors placeholder:text-[#8e8e93] hover:border-white/30 focus:border-white/50';

const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit, onClose }) => {
  const [name, setName] = useState('');
  const [stars, setStars] = useState(0);
  const [hoverStars, setHoverStars] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Įveskite savo vardą.');
      return;
    }
    if (stars === 0) {
      setError('Pasirinkite įvertinimą žvaigždutėmis.');
      return;
    }
    if (comment.trim().length < 10) {
      setError('Atsiliepimas turi būti bent 10 simbolių.');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      await onSubmit({
        customerName: name.trim(),
        stars,
        title: title.trim(),
        comment: comment.trim(),
      });
      setSubmitted(true);
    } catch (err) {
      console.error('[ReviewsSection] Submit error:', err);
      setError('Nepavyko išsiųsti atsiliepimo. Bandykite dar kartą.');
    } finally {
      setSubmitting(false);
    }
  };

  /* ---- Thank-you state ---- */
  if (submitted) {
    return (
      <div className="mx-auto mb-12 max-w-2xl border border-white/[0.09] bg-[#191919] p-8 text-center">
        <CheckCircle2 size={40} className="mx-auto mb-4 text-white" />
        <h3 className="mb-3 text-2xl font-light">
          Dėkojame už jūsų atsiliepimą!
        </h3>
        <p className="mb-6 leading-relaxed text-[#c1c1c7]">
          Kai administratoriai patikrins, kad jūsų atsiliepimas yra tikras, jis
          bus pridėtas prie produkto atsiliepimų.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center bg-[#f5f5f7] px-8 py-3 text-[#111111] transition-colors hover:bg-white"
        >
          Uždaryti
        </button>
      </div>
    );
  }

  /* ---- Form state ---- */
  const shown = hoverStars || stars;

  return (
    <div className="mx-auto mb-12 max-w-2xl border border-white/[0.09] bg-[#191919] p-8 text-left">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-2xl font-light">Rašyti atsiliepimą</h3>
        <button
          type="button"
          onClick={onClose}
          aria-label="Uždaryti"
          className="text-[#a1a1a6] transition-colors hover:text-white"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div>
          <label htmlFor="review-name" className="mb-2 block text-sm text-[#a1a1a6]">
            Vardas
          </label>
          <input
            id="review-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={60}
            placeholder="Jūsų vardas"
            className={inputClass}
          />
        </div>

        <div>
          <span className="mb-2 block text-sm text-[#a1a1a6]">Įvertinimas</span>
          <div
            className="flex gap-1"
            onMouseLeave={() => setHoverStars(0)}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setStars(star)}
                onMouseEnter={() => setHoverStars(star)}
                aria-label={`${star} iš 5`}
                className="p-0.5"
              >
                <Star
                  size={28}
                  className={star <= shown ? 'text-white' : 'text-[#55555b]'}
                  fill={star <= shown ? 'currentColor' : 'none'}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="review-title" className="mb-2 block text-sm text-[#a1a1a6]">
            Antraštė (neprivaloma)
          </label>
          <input
            id="review-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            placeholder="Trumpai apie jūsų patirtį"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="review-comment" className="mb-2 block text-sm text-[#a1a1a6]">
            Atsiliepimas
          </label>
          <textarea
            id="review-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={1500}
            rows={5}
            placeholder="Papasakokite, ką manote apie produktą"
            className={inputClass}
          />
        </div>

        {error && (
          <p role="alert" className="text-sm text-[#ff8a8a]">
            {error}
          </p>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center bg-[#f5f5f7] px-8 py-3 text-[#111111] transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Siunčiama...' : 'Pateikti atsiliepimą'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center border border-white/15 px-8 py-3 text-[#f5f5f7] transition-colors hover:border-white/30"
          >
            Atšaukti
          </button>
        </div>
      </form>
    </div>
  );
};

/* ================= MAIN COMPONENT ================= */

const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  productCode,
  category,
  onSubmitReview,
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [votedIds, setVotedIds] = useState<string[]>([]);

  const [sortBy, setSortBy] = useState<
    'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful'
  >('newest');

  const votesKey = `reviews-helpful:${category}:${productCode}`;

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

  /* ================= REMEMBER WHICH REVIEWS THIS BROWSER LIKED ================= */
  useEffect(() => {
    try {
      const saved = localStorage.getItem(votesKey);
      setVotedIds(saved ? JSON.parse(saved) : []);
    } catch {
      setVotedIds([]);
    }
  }, [votesKey]);

  /* ================= HELPFUL (THUMBS UP) ================= */

  // Click once to add +1, click again to take it back.
  const toggleHelpful = (reviewId: string) => {
    const alreadyVoted = votedIds.includes(reviewId);

    setReviews((prev) =>
      prev.map((r) =>
        r.reviewId === reviewId
          ? { ...r, helpful: Math.max(0, r.helpful + (alreadyVoted ? -1 : 1)) }
          : r
      )
    );

    const next = alreadyVoted
      ? votedIds.filter((id) => id !== reviewId)
      : [...votedIds, reviewId];

    setVotedIds(next);

    try {
      localStorage.setItem(votesKey, JSON.stringify(next));
    } catch {
      /* storage unavailable - the count still updates for this visit */
    }
  };

  /* ================= SUBMIT NEW REVIEW ================= */

  // The review is NOT added to the list: it waits for admin verification.
  const handleSubmitReview = async (data: {
    customerName: string;
    stars: number;
    title: string;
    comment: string;
  }) => {
    const payload: NewReviewPayload = {
      productCode,
      category,
      customerName: data.customerName,
      rating: data.stars * 2, // back to the 10-point scale used in the JSON
      title: data.title,
      comment: data.comment,
      date: new Date().toISOString().slice(0, 10),
    };

    if (onSubmitReview) {
      await onSubmitReview(payload);
    } else {
      console.info('[ReviewsSection] New review (pending verification):', payload);
    }
  };

  /* ================= CALCULATIONS ================= */

  // Average on the 5-star scale (10-point rating / 2)
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating / 2, 0) / reviews.length
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
          className={star <= rating ? 'text-white' : 'text-[#55555b]'}
          fill={star <= rating ? 'currentColor' : 'none'}
        />
      ))}
    </div>
  );

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <section className="bg-[#111111] py-24 text-center text-[#f5f5f7]">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-white" />
      </section>
    );
  }

  /* ================= EMPTY ================= */

  if (reviews.length === 0) {
    return (
      <section className="bg-[#111111] py-24 text-[#f5f5f7]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-4xl font-light">
            Klientų atsiliepimai
          </h2>

          <p className="mb-8 text-[#a1a1a6]">
            Kol kas nėra atsiliepimų.
          </p>

          {showForm ? (
            <ReviewForm
              onSubmit={handleSubmitReview}
              onClose={() => setShowForm(false)}
            />
          ) : (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center bg-[#f5f5f7] px-8 py-3 text-[#111111] transition-colors hover:bg-white"
            >
              <MessageCircle size={18} className="mr-2" />
              Palikti atsiliepimą
            </button>
          )}
        </div>
      </section>
    );
  }

  /* ================= RENDER ================= */

  return (
    <section className="bg-[#111111] py-24 text-[#f5f5f7]">
      <div className="container mx-auto px-4">

        {/* HEADER */}

        <div className="mb-16 text-center">
          <h2 className="mb-6 text-4xl font-light">
            Klientų atsiliepimai
          </h2>

          <div className="mb-8 flex items-center justify-center">
            <div className="mr-3 flex">
              {renderStars(Math.round(averageRating), 24)}
            </div>

            <span className="text-2xl font-light">
              {averageRating.toFixed(1)}
            </span>

            <span className="ml-2 text-[#8e8e93]">
              ({reviews.length} atsiliepimai)
            </span>
          </div>

          {/* SORT */}

          <div className="mb-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <label className="text-sm text-[#a1a1a6]">
              Rūšiuoti:
            </label>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="rounded border border-white/15 bg-[#191919] px-3 py-2 text-sm text-[#f5f5f7] outline-none transition-colors hover:border-white/30 focus:border-white/50"
            >
              <option value="newest">Naujausi</option>
              <option value="oldest">Seniausi</option>
              <option value="highest">Aukščiausias</option>
              <option value="lowest">Žemiausias</option>
              <option value="helpful">Naudingiausi</option>
            </select>
          </div>

          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center bg-[#f5f5f7] px-8 py-3 text-[#111111] transition-colors hover:bg-white"
            >
              <MessageCircle size={18} className="mr-2" />
              Rašyti atsiliepimą
            </button>
          )}
        </div>

        {/* WRITE REVIEW FORM */}

        {showForm && (
          <ReviewForm
            onSubmit={handleSubmitReview}
            onClose={() => setShowForm(false)}
          />
        )}

        {/* REVIEWS */}

        <div className="mx-auto max-w-4xl space-y-6">
          {sortedReviews.map((review) => {
            const voted = votedIds.includes(review.reviewId);

            return (
              <div
                key={review.reviewId}
                className="border border-white/[0.09] bg-[#191919] p-8 transition-colors hover:border-white/20"
              >
                <div className="mb-4 flex flex-col space-y-2 md:flex-row md:justify-between md:space-y-0">

                  <div className="flex-1">
                    <div className="mb-2 flex items-center">
                      <span className="mr-3 text-lg font-medium text-[#f5f5f7]">
                        {review.customerName}
                      </span>

                      {review.verified && (
                        <span className="rounded border border-white/10 bg-white/[0.05] px-2 py-1 text-xs text-[#c7c7cc]">
                          Patvirtinta
                        </span>
                      )}
                    </div>

                    <span className="text-sm text-[#8e8e93]">
                      {formatDate(review.date)}
                    </span>
                  </div>

                  <div className="flex flex-col items-start md:items-end">
                    {renderStars(toStars(review.rating))}

                    <div className="mt-2 flex items-center">
                      <ThumbsUp
                        size={14}
                        className={`mr-1 ${voted ? 'text-white' : 'text-[#8e8e93]'}`}
                        fill={voted ? 'currentColor' : 'none'}
                      />
                      <span className="text-sm text-[#a1a1a6]">
                        {review.helpful}
                      </span>
                    </div>
                  </div>
                </div>

                {review.title && (
                  <h4 className="mb-3 text-xl font-medium text-[#f5f5f7]">
                    {review.title}
                  </h4>
                )}

                <p className="leading-relaxed text-[#c1c1c7]">
                  {review.comment}
                </p>

                <div className="mt-6 border-t border-white/[0.08] pt-4">
                  <button
                    type="button"
                    onClick={() => toggleHelpful(review.reviewId)}
                    aria-pressed={voted}
                    className={`flex items-center text-sm transition-colors hover:text-white ${
                      voted ? 'text-white' : 'text-[#a1a1a6]'
                    }`}
                  >
                    <ThumbsUp
                      size={14}
                      className="mr-2"
                      fill={voted ? 'currentColor' : 'none'}
                    />
                    {voted ? 'Ačiū, kad įvertinote' : 'Ar buvo naudinga?'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* RATING BREAKDOWN */}

        <div className="mx-auto mt-16 max-w-4xl border border-white/[0.09] bg-[#191919] p-8">
          <h3 className="mb-6 text-center text-2xl font-light">
            Įvertinimų pasiskirstymas
          </h3>

          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => {
              // Each review's 10-point rating is divided by 2 and rounded
              const count = reviews.filter(
                (r) => toStars(r.rating) === rating
              ).length;

              const percentage =
                reviews.length > 0
                  ? (count / reviews.length) * 100
                  : 0;

              return (
                <div key={rating} className="flex items-center">
                  <span className="w-8 text-sm text-[#a1a1a6]">
                    {rating}
                  </span>

                  <Star
                    size={16}
                    className="mx-2 text-white"
                    fill="currentColor"
                  />

                  <div className="mx-3 h-3 flex-1 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-3 rounded-full bg-[#f5f5f7] transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <span className="w-12 text-right text-sm text-[#a1a1a6]">
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