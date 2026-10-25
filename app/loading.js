import LoadingSpinner from "../components/LoadingSpinner";

export default function Loading() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center bg-[#F7F5F0] px-4">
      <LoadingSpinner label="Loading Getworkfy..." size="lg" />
    </main>
  );
}
