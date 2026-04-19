import React, { useState } from 'react';
import { Star } from 'lucide-react';
import API from '../api/axios';
import Swal from 'sweetalert2';

const ReviewForm = ({ productId, onReviewAdded }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post("/reviews", { productId, rating, comment });
      Swal.fire("Great!", "Your review has been added.", "success");
      setComment("");
      if (onReviewAdded) onReviewAdded();
    } catch (error) {
      Swal.fire("Oops!", "Failed to post review. Have you purchased this?", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-bold mb-3">Leave a Review</h3>
      <div className="flex gap-2 mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className="p-1"
            style={{ color: rating >= star ? '#f59e0b' : '#d1d5db', cursor: 'pointer' }}
          >
            <Star fill={rating >= star ? '#f59e0b' : 'none'} stroke={rating >= star ? '#f59e0b' : 'currentColor'} />
          </button>
        ))}
      </div>
      <textarea
        className="w-full p-2 border rounded mb-3"
        rows="3"
        placeholder="Share your thoughts about this product..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
      ></textarea>
      <button
        type="submit"
        disabled={submitting}
        className="btn-primary"
      >
        {submitting ? 'Submitting...' : 'Post Review'}
      </button>
    </form>
  );
};

export default ReviewForm;
