export default function Page() {
  return (
    <>
      <div className="mb-8 text-center">
        <h1 className="text-2xl sm:text-3xl lg:text-3xl font-serif text-white mb-2">
          History
        </h1>
        <p className="text-gray-400">
          View your search and interaction history
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-dark border border-gray-700 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Recent Activity
          </h2>
          <p className="text-gray-400">Your history will appear here</p>
        </div>
      </div>
    </>
  );
}
