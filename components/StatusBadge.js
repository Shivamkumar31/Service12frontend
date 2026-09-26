const STYLES = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  suspended: "bg-slate-200 text-slate-700",
  accepted: "bg-blue-100 text-blue-800",
  in_progress: "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-slate-200 text-slate-700",
  verified: "bg-green-100 text-green-800",
};

const LABELS = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  suspended: "Suspended",
  accepted: "Accepted",
  in_progress: "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
  verified: "Verified",
};

export default function StatusBadge({ status }) {
  const key = String(status || "").trim().toLowerCase().replace(/\s+/g, "_");
  return (
    <span className={`badge whitespace-nowrap ${STYLES[key] || "bg-slate-100 text-slate-700"}`}>
      {LABELS[key] || "Unknown status"}
    </span>
  );
}
