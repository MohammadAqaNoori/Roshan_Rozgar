/**
 * Worker Dashboard — see incoming jobs, toggle availability.
 */

export default function WorkerDashboard() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">My Jobs</h2>

      {/* Availability toggle */}
      <div className="bg-white rounded-xl shadow p-4 flex items-center justify-between">
        <span className="font-medium">I am available now</span>
        <button className="w-14 h-8 bg-accent rounded-full relative">
          <span className="absolute top-1 right-1 w-6 h-6 bg-white rounded-full" />
        </button>
      </div>

      {/* Job list */}
      <div className="text-center py-8 text-gray-500">
        <p>No active jobs</p>
        <p className="urdu">کوئی کام نہیں ہے</p>
      </div>
    </div>
  );
}
