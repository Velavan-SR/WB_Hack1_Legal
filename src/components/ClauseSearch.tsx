'use client';

import { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';

interface SearchResult {
  success: boolean;
  answer?: string;
  clause?: string;
  plainEnglish?: string;
  confidence?: number;
  relatedClauses?: any[];
  error?: string;
}

export default function ClauseSearch() {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<'ask' | 'explain' | 'enhanced' | 'simple'>('ask');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) {
      alert('Please enter a search query');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: query,
          mode: mode,
          limit: 3,
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: `Search failed: ${error}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  const exampleQueries = [
    'How do I cancel my subscription?',
    'What data do they collect about me?',
    'Are there any hidden fees?',
    'Can they change the terms without notice?',
    'What happens to my data if I delete my account?',
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Search className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">🔍 Search Clauses</h2>
        </div>
        <p className="text-gray-600 mb-4">
          Ask questions about terms & conditions in plain English
        </p>

        {/* Search Mode Selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Mode
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <button
              onClick={() => setMode('ask')}
              className={`py-2 px-3 rounded-lg text-sm transition ${
                mode === 'ask'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              💬 Ask
            </button>
            <button
              onClick={() => setMode('explain')}
              className={`py-2 px-3 rounded-lg text-sm transition ${
                mode === 'explain'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📖 Explain
            </button>
            <button
              onClick={() => setMode('enhanced')}
              className={`py-2 px-3 rounded-lg text-sm transition ${
                mode === 'enhanced'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ⚡ Enhanced
            </button>
            <button
              onClick={() => setMode('simple')}
              className={`py-2 px-3 rounded-lg text-sm transition ${
                mode === 'simple'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🎯 Simple
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {mode === 'ask' && 'Get answers with risk analysis'}
            {mode === 'explain' && 'Find & translate to plain English'}
            {mode === 'enhanced' && 'Deep search with multiple clauses'}
            {mode === 'simple' && 'Quick semantic search'}
          </p>
        </div>

        {/* Search Input */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., How do I cancel my subscription?"
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleSearch}
              disabled={loading || !query.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <Search className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Example Queries */}
        <div className="mb-4">
          <p className="text-xs text-gray-600 mb-2">Try these examples:</p>
          <div className="flex flex-wrap gap-2">
            {exampleQueries.map((example, index) => (
              <button
                key={index}
                onClick={() => setQuery(example)}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {result && !result.success && (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-semibold">❌ {result.error}</p>
        </div>
      )}

      {result && result.success && (
        <div className="space-y-4">
          {/* Answer */}
          {result.answer && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-6">
              <div className="flex items-start gap-3 mb-3">
                <Sparkles className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">Answer</h3>
                  <p className="text-gray-800 leading-relaxed">{result.answer}</p>
                  {result.confidence !== undefined && (
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-xs text-gray-600">Confidence:</span>
                      <div className="flex-1 max-w-xs bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${result.confidence * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-gray-700">
                        {Math.round(result.confidence * 100)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Original Clause */}
          {result.clause && (
            <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-2">📄 Original Clause</h3>
              <div className="bg-white rounded p-4 font-mono text-sm text-gray-700 border border-gray-300">
                {result.clause}
              </div>
            </div>
          )}

          {/* Plain English Translation */}
          {result.plainEnglish && (
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
              <h3 className="font-bold text-green-900 mb-2">💡 In Plain English</h3>
              <p className="text-gray-800 leading-relaxed">{result.plainEnglish}</p>
            </div>
          )}

          {/* Related Clauses */}
          {result.relatedClauses && result.relatedClauses.length > 0 && (
            <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-3">
                🔗 Related Clauses ({result.relatedClauses.length})
              </h3>
              <div className="space-y-3">
                {result.relatedClauses.map((clause: any, index: number) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-sm text-gray-700 font-mono">
                      {clause.text?.substring(0, 150)}
                      {clause.text?.length > 150 ? '...' : ''}
                    </p>
                    {clause.score && (
                      <div className="mt-2 text-xs text-gray-500">
                        Similarity: {Math.round(clause.score * 100)}%
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
