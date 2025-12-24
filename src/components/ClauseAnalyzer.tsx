'use client';

import { useState } from 'react';
import { AlertCircle, FileText, Link as LinkIcon, Upload } from 'lucide-react';

interface AnalysisResult {
  success: boolean;
  documentId?: string;
  redFlags?: any[];
  yellowFlags?: any[];
  greenFlags?: any[];
  summary?: string;
  error?: string;
}

export default function ClauseAnalyzer() {
  const [inputType, setInputType] = useState<'url' | 'text' | 'pdf'>('url');
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [mode, setMode] = useState<'ai' | 'pattern'>('ai');

  const handleAnalyze = async () => {
    if (!inputValue.trim()) {
      alert('Please enter a URL or text to analyze');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: inputValue,
          type: inputType,
          mode: mode,
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: `Failed to analyze: ${error}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Type Selector */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">📄 Analyze Terms & Conditions</h2>
        
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setInputType('url')}
            className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition ${
              inputType === 'url'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <LinkIcon className="w-4 h-4" />
            URL
          </button>
          <button
            onClick={() => setInputType('text')}
            className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition ${
              inputType === 'text'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            Text
          </button>
          <button
            onClick={() => setInputType('pdf')}
            className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition ${
              inputType === 'pdf'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Upload className="w-4 h-4" />
            PDF
          </button>
        </div>

        {/* Analysis Mode Selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Analysis Mode
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setMode('ai')}
              className={`flex-1 py-2 px-4 rounded-lg transition ${
                mode === 'ai'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🤖 AI-Powered
            </button>
            <button
              onClick={() => setMode('pattern')}
              className={`flex-1 py-2 px-4 rounded-lg transition ${
                mode === 'pattern'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ⚡ Pattern Match
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {mode === 'ai' ? 'Uses GPT-4 for deep analysis' : 'Fast regex-based detection'}
          </p>
        </div>

        {/* Input Field */}
        {inputType === 'url' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Terms & Conditions URL
            </label>
            <input
              type="url"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="https://example.com/terms"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        {inputType === 'text' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Paste Terms & Conditions Text
            </label>
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Paste your terms and conditions here..."
              rows={8}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            />
          </div>
        )}

        {inputType === 'pdf' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              PDF URL
            </label>
            <input
              type="url"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="https://example.com/terms.pdf"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter a publicly accessible PDF URL
            </p>
          </div>
        )}

        {/* Analyze Button */}
        <button
          onClick={handleAnalyze}
          disabled={loading || !inputValue.trim()}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Analyzing...
            </span>
          ) : (
            '🔍 Analyze Document'
          )}
        </button>
      </div>

      {/* Error Display */}
      {result && !result.success && (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 mb-1">Analysis Failed</h3>
              <p className="text-red-700 text-sm">{result.error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Success Display - Summary */}
      {result && result.success && (
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="text-2xl">✅</div>
            <div className="flex-1">
              <h3 className="font-semibold text-green-900 mb-2">Analysis Complete</h3>
              {result.summary && (
                <p className="text-green-800 text-sm mb-3">{result.summary}</p>
              )}
              <div className="flex gap-4 text-sm">
                <span className="text-red-700 font-semibold">
                  🔴 {result.redFlags?.length || 0} Red Flags
                </span>
                <span className="text-yellow-700 font-semibold">
                  🟡 {result.yellowFlags?.length || 0} Yellow Flags
                </span>
                <span className="text-green-700 font-semibold">
                  🟢 {result.greenFlags?.length || 0} Green Flags
                </span>
              </div>
              {result.documentId && (
                <p className="text-xs text-gray-600 mt-2">
                  Document ID: <code className="bg-gray-100 px-2 py-1 rounded">{result.documentId}</code>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
