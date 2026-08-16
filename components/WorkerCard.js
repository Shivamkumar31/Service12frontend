import Link from "next/link";
import DummyAvatar from "./DummyAvatar";

export default function WorkerCard({ worker }) {
  const wp = worker.workerProfile || {};
  return (
    <Link href={`/workers/${worker._id}`} className="card flex gap-4 hover:shadow-md transition-shadow">
      {wp.photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={wp.photoUrl} alt={worker.name} className="w-16 h-16 rounded-full object-cover" />
      ) : (
        <DummyAvatar name={worker.name} size={64} />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-slate-900 truncate">{worker.name}</h3>
          {worker.distanceKm !== undefined && (
            <span className="text-xs text-slate-500 whitespace-nowrap ml-2">
              {worker.distanceKm} km
            </span>
          )}
        </div>
        <p className="text-sm text-slate-500">{wp.category?.name || "Service provider"}</p>
        <p className="text-sm text-slate-600 mt-1">{wp.experience || 0} yrs experience</p>
        <p className="text-xs text-slate-400 mt-1 truncate">{worker.address}</p>
      </div>
    </Link>
  );
}
