import StatusBadge from "./StatusBadge";

// `role` = "customer" | "worker" controls which side's name is shown and which
// actions are offered (worker gets accept/reject/progress, customer gets cancel).
export default function BookingCard({ booking, role, onAction }) {
  const otherParty = role === "customer" ? booking.workerId : booking.userId;

  const nextActions = {
    PENDING: role === "worker" ? [["ACCEPTED", "Accept"], ["REJECTED", "Reject"]] : [],
    ACCEPTED: role === "worker" ? [["IN_PROGRESS", "Start job"]] : [],
    IN_PROGRESS: role === "worker" ? [["COMPLETED", "Mark completed"]] : [],
  };

  const actions = nextActions[booking.status] || [];

  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-medium text-slate-900">
            {role === "customer" ? otherParty?.name || "Worker" : otherParty?.name || "Customer"}
          </p>
          <p className="text-sm text-slate-500">{booking.categoryId?.name}</p>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      <div className="mt-3 text-sm text-slate-600 space-y-1">
        <p>
          📅 {booking.serviceDate} at {booking.serviceTime}
        </p>
        <p>📍 {booking.serviceAddress}</p>
        {booking.notes && <p>📝 {booking.notes}</p>}
      </div>

      {(actions.length > 0 || (role === "customer" && booking.status === "PENDING")) && (
        <div className="mt-3 flex gap-2 flex-wrap">
          {actions.map(([status, label]) => (
            <button
              key={status}
              onClick={() => onAction(booking._id, status)}
              className={status === "REJECTED" ? "btn-danger text-sm" : "btn-primary text-sm"}
            >
              {label}
            </button>
          ))}
          {role === "customer" && booking.status === "PENDING" && (
            <button onClick={() => onAction(booking._id, "CANCELLED")} className="btn-secondary text-sm">
              Cancel booking
            </button>
          )}
        </div>
      )}
    </div>
  );
}
