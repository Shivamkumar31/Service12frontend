export default function ErrorText({ children }) {
  if (!children) return null;
  return (
    <p
      role="alert"
      className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-3 py-2 mt-2"
    >
      {children}
    </p>
  );
}
