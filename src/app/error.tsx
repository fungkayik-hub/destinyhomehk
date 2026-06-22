"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-xl mx-auto py-20 px-4 text-center">
      <h2 className="font-display text-2xl font-bold text-destiny-purple mb-4">
        頁面載入失敗
      </h2>
      <p className="text-destiny-purple/70 mb-6 text-sm">
        {error.message || "發生未知錯誤，請重新整理頁面。"}
      </p>
      <button type="button" onClick={reset} className="btn-primary">
        重新載入
      </button>
    </div>
  );
}
