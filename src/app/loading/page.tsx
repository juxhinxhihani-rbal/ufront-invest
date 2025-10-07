// Simple loading spinner without context dependencies
function SimpleLoadingSpinner({ size = "large" }: { size?: string }) {
  const sizeClass = size === "large" ? "h-12 w-12" : "h-8 w-8";
  return (
    <div className="flex items-center justify-center">
      <div className={`animate-spin rounded-full ${sizeClass} border-b-2 border-blue-600`}></div>
    </div>
  );
}

export default function ConfigLoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8">
        <SimpleLoadingSpinner size="large" />
        <h1 className="mt-6 text-xl font-semibold text-gray-800">
          Loading Configuration
        </h1>
        <p className="mt-2 text-gray-600">
          Please wait while we initialize the application settings...
        </p>
        <div className="mt-4 text-sm text-gray-500">
          This may take a few moments on first load.
        </div>
      </div>
    </div>
  );
}
