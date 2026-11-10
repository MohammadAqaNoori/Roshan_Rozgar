/**
 * Customer Home — voice-based job request.
 * Customer speaks their problem, AI extracts job details.
 */

import { useState } from "react";
import { Link } from "react-router-dom";

export default function CustomerHome() {
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRecord = async () => {
    setLoading(true);
    // TODO: MediaRecorder -> send to /api/v1/jobs/voice-create -> Gemini extracts job
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">What do you need?</h2>
      <p className="urdu text-gray-600">آپ کو کیا چاہیے؟</p>

      {/* Voice button */}
      <div className="flex flex-col items-center justify-center py-8">
        <button
          onClick={handleRecord}
          disabled={loading}
          className="w-32 h-32 rounded-full bg-brand text-white text-5xl flex items-center justify-center transition hover:bg-brand-light"
        >
          {loading ? "⏳" : "🎙️"}
        </button>
        <p className="mt-4 text-gray-600">
          Describe your problem
          <span className="block urdu">اپنا مسئلہ بتائیں</span>
        </p>
      </div>

      {/* Quick trade buttons */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { en: "Electrician", ur: "بجلی والا" },
          { en: "Plumber", ur: "پلمبر" },
          { en: "AC Repair", ur: "اے سی" },
          { en: "Carpenter", ur: "ترکھان" },
          { en: "Mechanic", ur: "مکینک" },
          { en: "Painter", ur: "پینٹر" },
        ].map((trade) => (
          <Link
            key={trade.en}
            to="/customer/find"
            className="bg-white shadow rounded-xl p-4 text-center hover:border-brand hover:border-2 transition"
          >
            <p className="font-medium">{trade.en}</p>
            <p className="urdu text-sm text-gray-500">{trade.ur}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
