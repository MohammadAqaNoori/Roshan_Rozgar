/**
 * Worker Discovery — map + list of nearby available workers.
 * Uses Leaflet + OpenStreetMap (no API key needed).
 */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function WorkerDiscovery() {
  const [workers, setWorkers] = useState([]);

  useEffect(() => {
    // TODO: GET /api/v1/workers/nearby?lat=...&lng=...
    // For now, simulate
    setWorkers([
      { id: 1, name: "Bilal Ahmed", trade: "Electrician", area: "G-9", distance_km: 1.2, rating_avg: 4.7 },
      { id: 2, name: "Riaz Hussain", trade: "Plumber", area: "F-7", distance_km: 2.8, rating_avg: 4.5 },
      { id: 4, name: "Naveed Anwar", trade: "Carpenter", area: "Saddar", distance_km: 4.1, rating_avg: 4.8 },
    ]);
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Workers near you</h2>

      {/* TODO: Leaflet map showing worker pins */}
      <div className="bg-gray-200 rounded-xl h-48 flex items-center justify-center text-gray-500">
        Map will render here
      </div>

      {/* Worker list */}
      <div className="space-y-3">
        {workers.map((w) => (
          <Link
            key={w.id}
            to={`/job/new?worker=${w.id}`}
            className="block bg-white shadow rounded-xl p-4 hover:border-brand hover:border-2 transition"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold">{w.name}</p>
                <p className="text-sm text-gray-500">{w.trade}</p>
                <p className="text-sm text-gray-500">
                  {w.area} • {w.distance_km} km away
                </p>
              </div>
              <div className="text-right">
                <p className="text-accent-dark font-bold">★ {w.rating_avg}</p>
                <p className="text-xs text-gray-400">Available</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
