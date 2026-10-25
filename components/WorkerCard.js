import Link from "next/link";
import DummyAvatar from "./DummyAvatar";
import Icon from "./Icon";

export default function WorkerCard({ worker, disabled = false, onDisabledClick }) {
  const wp = worker.workerProfile || worker;
  const account = worker.userId || worker;
  const name = account.name || "Service professional";
  const category = wp.serviceCategory || wp.category;
  const experience = wp.experienceYears ?? wp.experience ?? 0;
  const hourlyRate = wp.hourlyRate ?? wp.pricePerHour ?? wp.rate ?? null;
  const isAvailable = Boolean(wp.isAvailable ?? wp.availability?.isAvailable ?? true);
  const rating = wp.rating || null;
  const totalJobs = wp.totalJobs ?? wp.jobsDone ?? 0;
  const address = wp.address || account.customerProfile?.address || "";

  const content = (
    <div className="relative flex flex-col justify-between h-full w-full">
      {/* Top section: Avatar, Info & Rates */}
      <div className="flex items-start gap-4">
        {/* Avatar with status indicator */}
        <div className="relative shrink-0">
          {wp.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={wp.photoUrl}
              alt={`${name} - ${category?.name || "local service professional"}`}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-slate-100 shadow-sm"
            />
          ) : (
            <DummyAvatar name={name} size={64} className="rounded-2xl" />
          )}
          <span
            className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#3F7D5C] text-[10px] text-white shadow-sm"
            title="Verified Professional"
            aria-label="Verified"
          >
            ✓
          </span>
        </div>

        {/* Name, Category, Distance */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="font-semibold text-base text-[#101B2B] truncate group-hover:text-[#2E6E8E] transition-colors">
              {name}
            </h3>
            {hourlyRate && (
              <span className="shrink-0 font-display text-base font-semibold text-[#101B2B]">
                ₹{hourlyRate}
                <span className="text-xs font-normal text-slate-500">/hr</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mt-0.5">
            <span className="inline-flex items-center text-xs font-medium text-[#2E6E8E]">
              {category?.name || "Local service"}
            </span>
            {worker.distanceKm !== undefined && (
              <>
                <span className="text-slate-300 text-xs">·</span>
                <span className="inline-flex items-center gap-0.5 text-xs text-slate-500 whitespace-nowrap">
                  <Icon name="pin" size={13} className="text-[#2E6E8E]" />
                  {worker.distanceKm} km away
                </span>
              </>
            )}
          </div>

          {/* Quick tags: Rating, Jobs, Experience */}
          <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
            <span className="inline-flex items-center gap-1 rounded-md bg-[#FFF5E5] px-2 py-0.5 text-xs font-medium text-[#B87516]">
              <Icon name="star" size={12} className="text-[#E8A33D]" />
              {rating ? rating : "New"}
            </span>
            <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
              {experience} yrs exp
            </span>
            {totalJobs > 0 && (
              <span className="inline-flex items-center rounded-md bg-[#EAF3F7] px-2 py-0.5 text-xs font-medium text-[#2E6E8E]">
                {totalJobs} jobs
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Address & Availability footer */}
      <div className="mt-4 pt-3 border-t border-dashed border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1.5 min-w-0 pr-2">
          {address ? (
            <span className="truncate text-slate-500">{address}</span>
          ) : (
            <span className="flex items-center gap-1.5">
              <span
                className={`h-2 w-2 rounded-full ${
                  isAvailable ? "bg-emerald-500 animate-pulse" : "bg-slate-300"
                }`}
              />
              <span className={isAvailable ? "text-emerald-700 font-medium" : "text-slate-400"}>
                {isAvailable ? "Available for booking" : "Currently busy"}
              </span>
            </span>
          )}
        </div>

        <span className="shrink-0 font-medium text-[#101B2B] group-hover:text-[#2E6E8E] transition-colors flex items-center gap-1">
          Book <span aria-hidden="true">→</span>
        </span>
      </div>
    </div>
  );

  if (disabled) {
    return (
      <button
        type="button"
        onClick={onDisabledClick}
        className="group relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm opacity-60 cursor-not-allowed text-left w-full"
        aria-disabled="true"
      >
        {content}
      </button>
    );
  }

  return (
    <Link
      href={`/workers/${worker._id}`}
      className="group relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#CBD8E3] hover:shadow-md flex flex-col justify-between"
    >
      {content}
    </Link>
  );
}
