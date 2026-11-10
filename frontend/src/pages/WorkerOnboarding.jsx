/**
 * Worker Onboarding — Voice-first registration.
 *
 * Worker presses a button, speaks in Urdu/Roman Urdu.
 * Audio is sent to backend -> Gemini API -> structured profile extracted.
 * No typing required.
 */

import { useState } from "react";

export default function WorkerOnboarding() {
  const [isRecording, setIsRecording] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRecord = async () => {
    // TODO: Implement MediaRecorder API for voice capture
    // TODO: Send audio to /api/v1/auth/voice-register (backend -> Gemini)
    setLoading(true);
    // Simulated for now
    setTimeout(() => {
      setProfile({
        name: "Bilal Ahmed",
        trade: "Electrician",
        experience_years: 12,
        area_name: "G-9, Islamabad",
      });
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold mb-2">Create your profile</h2>
        <p className="urdu text-gray-600">اپنا پروفائل بنائیں</p>
      </div>

      {/* Big voice button */}
      <div className="flex flex-col items-center justify-center py-8">
        <button
          onClick={handleRecord}
          disabled={loading}
          className={`w-32 h-32 rounded-full flex items-center justify-center text-5xl transition ${
            isRecording ? "bg-red-500 animate-pulse" : "bg-brand"
          } text-white`}
        >
          {loading ? "⏳" : "🎙️"}
        </button>
        <p className="mt-4 text-gray-600">
          Press and speak
          <span className="block urdu">بٹن دبائیں اور بولیں</span>
        </p>
      </div>

      {/* Show extracted profile */}
      {profile && (
        <div className="bg-white rounded-xl shadow p-4 space-y-2">
          <h3 className="font-bold text-lg">{profile.name}</h3>
          <p>Trade: {profile.trade}</p>
          <p>Experience: {profile.experience_years} years</p>
          <p>Area: {profile.area_name}</p>
          <button className="w-full bg-accent text-brand font-bold py-3 rounded-xl mt-4">
            Confirm Profile
          </button>
        </div>
      )}
    </div>
  );
}
