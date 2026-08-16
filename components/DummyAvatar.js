// Placeholder image used everywhere a real photo isn't available yet.
// Swap the src for real Cloudinary photoUrl once uploads are wired up per-page.
export default function DummyAvatar({ name = "?", size = 64, className = "" }) {
  const initial = name?.trim()?.[0]?.toUpperCase() || "?";
  return (
    <div
      className={`flex items-center justify-center rounded-full bg-brand-100 text-brand-700 font-semibold ${className}`}
      style={{ width: size, height: size, fontSize: size / 2.5 }}
    >
      {initial}
    </div>
  );
}
