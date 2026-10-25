const DEMO_UPI_ID = "getworkfy-demo@upi";

function getBookingAmount(booking) {
  const value =
    booking?.amount ??
    booking?.totalAmount ??
    booking?.price ??
    booking?.total ??
    booking?.payment?.amount;

  return typeof value === "number" || (typeof value === "string" && value.trim())
    ? value
    : null;
}

export default function PaymentInstructions({ booking, compact = false }) {
  const amount = getBookingAmount(booking);

  return (
    <section
      className={`rounded-2xl border border-[#E8A33D]/30 bg-[#FFF9EF] ${
        compact ? "p-4" : "p-5 sm:p-6"
      }`}
      aria-labelledby="payment-instructions-title"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#B87516]">
            Temporary payment option
          </p>
          <h2 id="payment-instructions-title" className="mt-1 font-display text-xl text-[#101B2B]">
            Pay by UPI QR
          </h2>
        </div>
        <span className="rounded-full border border-[#E8A33D]/40 bg-white px-2.5 py-1 text-[11px] font-semibold text-[#8A5A12]">
          Demo setup
        </span>
      </div>

      <div className={`mt-4 flex ${compact ? "flex-row" : "flex-col sm:flex-row"} items-center gap-4`}>
        <div className="shrink-0 rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
          <img
            src="/demo-upi-qr.svg"
            alt="Demo UPI QR code placeholder"
            className="h-28 w-28"
          />
        </div>
        <div className="min-w-0 text-sm text-slate-600">
          <p className="font-medium text-[#101B2B]">
            {amount !== null ? `Amount: ₹${amount}` : "Amount: To be confirmed"}
          </p>
          <p className="mt-1">
            Scan with a UPI app and use this temporary destination:
          </p>
          <p className="mt-2 break-all rounded-lg bg-white px-3 py-2 font-mono text-xs text-[#101B2B]">
            {DEMO_UPI_ID}
          </p>
        </div>
      </div>

      <p className="mt-4 border-t border-[#E8A33D]/20 pt-3 text-xs leading-relaxed text-[#8A5A12]">
        This is a temporary display-only setup. Do not send real money to this demo QR.
        Payment verification will be added after the backend and payment provider are connected.
      </p>
    </section>
  );
}
