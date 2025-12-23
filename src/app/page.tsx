export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            🛡️ AI Legal Clause Analyzer
          </h1>
          <p className="text-xl text-gray-600">
            Your digital lawyer for Terms & Conditions
          </p>
          <div className="mt-4 inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
            ⚡ Winter Bootcamp Hackathon 2025
          </div>
        </header>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            🚀 Project Status: Day 2, Hour 7
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <p className="font-semibold text-gray-900">Day 1 Complete (4/4 hours)</p>
                <p className="text-sm text-gray-600">Architecture & API foundation</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <p className="font-semibold text-gray-900">Hour 5-6: AI Classification</p>
                <p className="text-sm text-gray-600">GPT-4 + pattern-based risk detection</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔄</span>
              <div>
                <p className="font-semibold text-gray-900">Hour 7: RAG Pipeline</p>
                <p className="text-sm text-gray-600">Vector search + Plain English translation</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
            <div className="text-3xl mb-3">🔴</div>
            <h3 className="font-bold text-lg mb-2 text-red-900">Red Flags</h3>
            <p className="text-sm text-red-700">
              High-risk clauses that take away user rights
            </p>
          </div>
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
            <div className="text-3xl mb-3">🟡</div>
            <h3 className="font-bold text-lg mb-2 text-yellow-900">Yellow Flags</h3>
            <p className="text-sm text-yellow-700">
              Medium-risk clauses requiring attention
            </p>
          </div>
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
            <div className="text-3xl mb-3">🟢</div>
            <h3 className="font-bold text-lg mb-2 text-green-900">Green Flags</h3>
            <p className="text-sm text-green-700">
              Standard clauses with fair terms
            </p>
          </div>
        </div>

        <footer className="text-center text-gray-500 text-sm">
          <p>🔨 Day 2, Hour 7/12 • RAG pipeline with plain English translations ready</p>
          <p className="mt-2 text-xs">
            🧪 Try: POST <span className="font-mono">/api/search</span> with mode: ask, explain, enhanced
          </p>
        </footer>
      </div>
    </main>
  );
}
