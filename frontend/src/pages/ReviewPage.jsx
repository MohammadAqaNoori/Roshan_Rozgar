/**
 * Review Page — voice-first review capture for trust building.
 * Customer taps stars, optionally speaks a review.
 */

import { useState } from "react";

export default function ReviewPage() {
  const [rating, setRating] = useState(0);
  const [recording, setRecording] = useState(false);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">How was the work?</h2>
      <p className="urdu text-gray-600">کام کیسا تھا؟</p>

      {/* Star rating */}
      <div className="flex justify-center gap-2 py-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            className={`text-4xl transition ${
              star <= rating ? "text-accent" : "text-gray-300"
            }`}
          >
            ★
          </button>
        ))}
      </div>

      {/* Voice review */}
      <div className="flex flex-col items-center py-4">
        <button
          onClick={() => setRecording(!recording)}
          className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl text-white transition ${
            recording ? "bg-red-500 animate-pulse" : "bg-brand"
          }`}
        >
          🎙️
        </button>
        <p className="mt-3 text-gray-600">
          {recording ? "Tap to stop" : "Speak your review"}
          <span className="block urdu">
            {recording ? "روکنے کے لیے دبائیں" : "اپنی رائے بولیں"}
          </span>
        </p>
      </div>

      {/* Submit */}
      <button
        disabled={rating === 0}
        className="w-full bg-accent text-brand font-bold py-4 rounded-xl disabled:opacity-50"
      >
        Submit Review
        <span className="block text-sm font-normal urdu">جمع کریں</span>
      </button>
    </div>
  );
}
