import Link from "next/link";
import DummyAvatar from "./DummyAvatar";

export default function WorkerCard({ worker, disabled = false, onDisabledClick }) {
  const wp = worker.workerProfile || worker;
  const account = worker.userId || worker;
  const name = account.name || "Service professional";
  const category = wp.serviceCategory || wp.category;
  const experience = wp.experienceYears ?? wp.experience ?? 0;
  const content = (
    <>
      {wp.photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={wp.photoUrl}
          alt={`${name} - ${category?.name || "local service professional"}`}
          className="w-16 h-16 rounded-full object-cover"
        />
      ) : (
        <DummyAvatar name={name} size={64} />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-slate-900 truncate">{name}</h3>
          {worker.distanceKm !== undefined && (
            <span className="text-xs text-slate-500 whitespace-nowrap ml-2">
              {worker.distanceKm} km
            </span>
          )}
        </div>
        <p className="text-sm text-slate-500">{category?.name || "Service provider"}</p>
        <p className="text-sm text-slate-600 mt-1">{experience} yrs experience</p>
        <p className="text-xs text-slate-400 mt-1 truncate">{wp.address || account.customerProfile?.address}</p>
      </div>
    </>
  );

  if (disabled) {
    return (
      <button
        type="button"
        onClick={onDisabledClick}
        className="card flex w-full cursor-not-allowed gap-4 text-left opacity-60"
        aria-disabled="true"
      >
        {content}
      </button>
    );
  }

  return <Link href={`/workers/${worker._id}`} className="card flex gap-4 hover:shadow-md transition-shadow">{content}</Link>;
}
