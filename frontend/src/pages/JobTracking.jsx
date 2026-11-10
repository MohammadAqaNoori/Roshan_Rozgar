/**
 * Job Tracking — booking status and worker details after confirmation.
 */

export default function JobTracking() {
  // TODO: Fetch job from /api/v1/jobs/:id
  const job = {
    id: 1,
    status: "confirmed",
    worker: { name: "Bilal Ahmed", trade: "Electrician", rating_avg: 4.7 },
    agreed_price: 1500,
    area_name: "G-9, Islamabad",
  };

  const statusLabel = {
    confirmed: { en: "Confirmed", ur: "تصدیق ہو گئی", color: "bg-green-100 text-green-800" },
    in_progress: { en: "In Progress", ur: "کام جاری ہے", color: "bg-yellow-100 text-yellow-800" },
    completed: { en: "Completed", ur: "مکمل", color: "bg-brand text-white" },
  };

  const { en, ur, color } = statusLabel[job.status] || {};

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Job Status</h2>

      {/* Status badge */}
      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${color}`}>
        {en} — <span className="urdu ml-1">{ur}</span>
      </div>

      {/* Worker card */}
      <div className="bg-white rounded-xl shadow p-4 space-y-2">
        <p className="text-lg font-bold">{job.worker.name}</p>
        <p className="text-gray-600">{job.worker.trade}</p>
        <p className="text-accent-dark font-bold">★ {job.worker.rating_avg}</p>
        <hr />
        <p className="font-medium">
          Agreed price: <span className="text-brand">PKR {job.agreed_price}</span>
        </p>
        <p className="text-sm text-gray-500">{job.area_name}</p>
      </div>

      {/* Action buttons */}
      <div className="space-y-3">
        {job.status === "in_progress" && (
          <button className="w-full bg-brand text-white font-bold py-4 rounded-xl">
            Mark as Completed
            <span className="block text-sm font-normal urdu">مکمل کریں</span>
          </button>
        )}
        {job.status === "completed" && (
          <a href="/job/1/review" className="block w-full bg-accent text-brand font-bold py-4 rounded-xl text-center">
            Leave a Review
            <span className="block text-sm font-normal urdu">رائے دیں</span>
          </a>
        )}
      </div>
    </div>
  );
}
