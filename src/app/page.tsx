'use client';

import { useState } from 'react';
import ClauseAnalyzer from '@/components/ClauseAnalyzer';
import RiskDisplay from '@/components/RiskDisplay';
import RiskReport from '@/components/RiskReport';
import ClauseSearch from '@/components/ClauseSearch';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'analyze' | 'search'>('analyze');
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [showReport, setShowReport] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
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

        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            🚀 Project Status: Day 3, Hour 10
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <p className="font-semibold text-gray-900">Day 1-2 Complete (8/12 hours)</p>
                <p className="text-sm text-gray-600">Full AI backend with RAG + Function calling</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <p className="font-semibold text-gray-900">Hour 9: Interactive UI</p>
                <p className="text-sm text-gray-600">React components with Tailwind CSS</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔄</span>
              <div>
                <p className="font-semibold text-gray-900">Hour 10: Risk Report Dashboard</p>
                <p className="text-sm text-gray-600">Analytics, scoring, and export functionality</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('analyze')}
            className={`flex-1 py-4 px-6 rounded-lg font-semibold transition ${
              activeTab === 'analyze'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
            }`}
          >
            📄 Analyze Document
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`flex-1 py-4 px-6 rounded-lg font-semibold transition ${
              activeTab === 'search'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
            }`}
          >
            🔍 Search Clauses
          </button>
        </div>

        {/* Main Content Area */}
        {activeTab === 'analyze' && (
          <div>
            <ClauseAnalyzer onResultChange={setAnalysisResult} />
            {analysisResult && analysisResult.success && !showReport && (
              <div className="mt-6 space-y-6">
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowReport(true)}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition shadow-lg"
                  >
                    📊 View Full Report
                  </button>
                </div>
                <RiskDisplay
                  redFlags={analysisResult.redFlags || []}
                  yellowFlags={analysisResult.yellowFlags || []}
                  greenFlags={analysisResult.greenFlags || []}
                />
              </div>
            )}
            {analysisResult && analysisResult.success && showReport && (
              <div className="mt-6 space-y-6">
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowReport(false)}
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition"
                  >
                    ← Back to Flags
                  </button>
                </div>
                <RiskReport
                  data={{
                    ...analysisResult,
                    analyzedAt: new Date().toISOString(),
                  }}
                />
              </div>
            )}
          </div>
        )}

        {activeTab === 'search' && (
          <div>
            <ClauseSearch />
          </div>
        )}

        {/* Feature Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-8 mb-8">
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
