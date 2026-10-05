const spinnerSizes = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

export default function LoadingSpinner({ label = "Loading...", size = "md", className = "" }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex items-center justify-center gap-2 text-sm text-slate-500 ${className}`}
    >
      <span
        aria-hidden="true"
        className={`${spinnerSizes[size] || spinnerSizes.md} rounded-full border-2 border-slate-200 border-t-[#E8A33D] animate-spin motion-reduce:animate-none`}
      />
      <span>{label}</span>
    </div>
  );
}
