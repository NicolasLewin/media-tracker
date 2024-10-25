import { useState } from 'react';
import { X } from 'lucide-react';

export const ReviewModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialReview = '',
  title
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSubmit: (review: string) => void;
  initialReview?: string;
  title: string;
}) => {
  const [review, setReview] = useState(initialReview);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(review);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white w-full h-full md:h-auto md:max-h-[90vh] md:w-3/4 md:rounded-lg p-6 relative overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Write a Review for {title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Write your review here..."
              required
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;