'use client';

import { useState } from 'react';
import { Download, BarChart3, AlertTriangle, TrendingUp, FileText } from 'lucide-react';

interface AnalysisData {
  documentId?: string;
  source?: string;
  analyzedAt?: string;
  redFlags: any[];
  yellowFlags: any[];
  greenFlags: any[];
  totalClauses?: number;
  summary?: string;
}

interface RiskReportProps {
  data: AnalysisData;
}

export default function RiskReport({ data }: RiskReportProps) {
  const [showExport, setShowExport] = useState(false);

  // Calculate risk score (0-100)
  const calculateRiskScore = () => {
    const redWeight = 10;
    const yellowWeight = 5;
    const greenBonus = -2;

    const redCount = data.redFlags?.length || 0;
    const yellowCount = data.yellowFlags?.length || 0;
    const greenCount = data.greenFlags?.length || 0;
    const totalFlags = redCount + yellowCount + greenCount;

    if (totalFlags === 0) return 0;

    const rawScore = (redCount * redWeight) + (yellowCount * yellowWeight) + (greenCount * greenBonus);
    const normalizedScore = Math.max(0, Math.min(100, (rawScore / totalFlags) * 10));

    return Math.round(normalizedScore);
  };

  const riskScore = calculateRiskScore();

  // Risk level based on score
  const getRiskLevel = (score: number): { level: string; color: string; emoji: string } => {
    if (score >= 70) return { level: 'CRITICAL', color: 'red', emoji: '🚨' };
    if (score >= 50) return { level: 'HIGH', color: 'orange', emoji: '⚠️' };
    if (score >= 30) return { level: 'MEDIUM', color: 'yellow', emoji: '⚡' };
    if (score >= 15) return { level: 'LOW', color: 'blue', emoji: 'ℹ️' };
    return { level: 'SAFE', color: 'green', emoji: '✅' };
  };

  const riskInfo = getRiskLevel(riskScore);

  // Category breakdown
  const getCategoryBreakdown = () => {
    const categories: Record<string, { red: number; yellow: number; green: number }> = {};

    [...(data.redFlags || [])].forEach(flag => {
      const cat = flag.category || flag.type || 'other';
      if (!categories[cat]) categories[cat] = { red: 0, yellow: 0, green: 0 };
      categories[cat].red++;
    });

    [...(data.yellowFlags || [])].forEach(flag => {
      const cat = flag.category || flag.type || 'other';
      if (!categories[cat]) categories[cat] = { red: 0, yellow: 0, green: 0 };
      categories[cat].yellow++;
    });

    [...(data.greenFlags || [])].forEach(flag => {
      const cat = flag.category || flag.type || 'other';
      if (!categories[cat]) categories[cat] = { red: 0, yellow: 0, green: 0 };
      categories[cat].green++;
    });

    return categories;
  };

  const categoryBreakdown = getCategoryBreakdown();

  // Export report as JSON
  const exportReport = () => {
    const report = {
      ...data,
      riskScore,
      riskLevel: riskInfo.level,
      categoryBreakdown,
      generatedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `legal-analysis-report-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExport(false);
  };

  // Top concerns
  const getTopConcerns = () => {
    const concerns: string[] = [];
    data.redFlags?.forEach(flag => {
      if (flag.reason) concerns.push(flag.reason);
      if (flag.concerns) concerns.push(...flag.concerns);
    });
    return concerns.slice(0, 5);
  };

  const topConcerns = getTopConcerns();

  return (
    <div className="space-y-6">
      {/* Header with Export */}
      <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">📊 Risk Analysis Report</h2>
              <p className="text-sm text-gray-600">
                {data.source && `Source: ${data.source.substring(0, 50)}...`}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowExport(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>

        {data.analyzedAt && (
          <p className="text-xs text-gray-500">
            Analyzed: {new Date(data.analyzedAt).toLocaleString()}
          </p>
        )}
      </div>

      {/* Risk Score Card */}
      <div className={`bg-gradient-to-br from-${riskInfo.color}-50 to-${riskInfo.color}-100 rounded-lg shadow-lg p-8 border-2 border-${riskInfo.color}-200`}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">{riskInfo.emoji}</span>
              <div>
                <h3 className="text-3xl font-bold text-gray-900">{riskScore}/100</h3>
                <p className="text-lg font-semibold text-gray-700">Risk Score</p>
              </div>
            </div>
            <div className={`inline-block px-4 py-2 rounded-full bg-${riskInfo.color}-600 text-white font-bold text-sm`}>
              {riskInfo.level} RISK
            </div>
            <div className="mt-4 bg-white bg-opacity-50 rounded-full h-4 overflow-hidden">
              <div
                className={`h-full bg-${riskInfo.color}-600 transition-all duration-1000 ease-out`}
                style={{ width: `${riskScore}%` }}
              />
            </div>
          </div>
          <div className="text-right">
            <div className="text-6xl font-bold text-gray-900">{riskInfo.emoji}</div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4 border-2 border-gray-200">
          <div className="text-3xl font-bold text-gray-900">
            {(data.redFlags?.length || 0) + (data.yellowFlags?.length || 0) + (data.greenFlags?.length || 0)}
          </div>
          <div className="text-sm text-gray-600 mt-1">Total Clauses</div>
        </div>
        <div className="bg-red-50 rounded-lg shadow p-4 border-2 border-red-200">
          <div className="text-3xl font-bold text-red-600">{data.redFlags?.length || 0}</div>
          <div className="text-sm text-red-700 mt-1">Critical Issues</div>
        </div>
        <div className="bg-yellow-50 rounded-lg shadow p-4 border-2 border-yellow-200">
          <div className="text-3xl font-bold text-yellow-600">{data.yellowFlags?.length || 0}</div>
          <div className="text-sm text-yellow-700 mt-1">Warnings</div>
        </div>
        <div className="bg-green-50 rounded-lg shadow p-4 border-2 border-green-200">
          <div className="text-3xl font-bold text-green-600">{data.greenFlags?.length || 0}</div>
          <div className="text-sm text-green-700 mt-1">Safe Clauses</div>
        </div>
      </div>

      {/* Top Concerns */}
      {topConcerns.length > 0 && (
        <div className="bg-red-50 rounded-lg shadow-lg p-6 border-2 border-red-200">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <h3 className="text-xl font-bold text-red-900">⚠️ Top Concerns</h3>
          </div>
          <ul className="space-y-2">
            {topConcerns.map((concern, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-red-600 font-bold mt-0.5">{index + 1}.</span>
                <span className="text-red-800 text-sm">{concern}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Category Breakdown */}
      <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-900">📈 Category Breakdown</h3>
        </div>
        <div className="space-y-4">
          {Object.entries(categoryBreakdown).map(([category, counts]) => {
            const total = counts.red + counts.yellow + counts.green;
            const redPercent = (counts.red / total) * 100;
            const yellowPercent = (counts.yellow / total) * 100;
            const greenPercent = (counts.green / total) * 100;

            return (
              <div key={category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900 capitalize">{category.replace(/-/g, ' ')}</span>
                  <span className="text-sm text-gray-600">{total} clauses</span>
                </div>
                <div className="flex h-6 rounded-full overflow-hidden border border-gray-300">
                  {counts.red > 0 && (
                    <div
                      className="bg-red-500 flex items-center justify-center text-white text-xs font-semibold"
                      style={{ width: `${redPercent}%` }}
                      title={`${counts.red} red flags`}
                    >
                      {counts.red > 0 && redPercent > 15 && counts.red}
                    </div>
                  )}
                  {counts.yellow > 0 && (
                    <div
                      className="bg-yellow-500 flex items-center justify-center text-white text-xs font-semibold"
                      style={{ width: `${yellowPercent}%` }}
                      title={`${counts.yellow} yellow flags`}
                    >
                      {counts.yellow > 0 && yellowPercent > 15 && counts.yellow}
                    </div>
                  )}
                  {counts.green > 0 && (
                    <div
                      className="bg-green-500 flex items-center justify-center text-white text-xs font-semibold"
                      style={{ width: `${greenPercent}%` }}
                      title={`${counts.green} green flags`}
                    >
                      {counts.green > 0 && greenPercent > 15 && counts.green}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-blue-50 rounded-lg shadow-lg p-6 border-2 border-blue-200">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-bold text-blue-900">💡 Recommendations</h3>
        </div>
        <ul className="space-y-3">
          {riskScore >= 70 && (
            <>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span className="text-blue-900">
                  <strong>CRITICAL:</strong> Do not accept these terms without legal consultation
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span className="text-blue-900">Review all red flags carefully with a lawyer</span>
              </li>
            </>
          )}
          {riskScore >= 30 && riskScore < 70 && (
            <>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span className="text-blue-900">Read all red and yellow flags before accepting</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span className="text-blue-900">Consider negotiating problematic clauses if possible</span>
              </li>
            </>
          )}
          {riskScore < 30 && (
            <>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span className="text-blue-900">These terms appear relatively standard for the industry</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span className="text-blue-900">Still review any red flags noted above</span>
              </li>
            </>
          )}
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span className="text-blue-900">
              Keep a copy of these terms for your records
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span className="text-blue-900">
              Export this report using the button above for future reference
            </span>
          </li>
        </ul>
      </div>

      {/* Export Modal */}
      {showExport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">📥 Export Report</h3>
            <p className="text-gray-700 mb-6">
              Download your analysis report as a JSON file. This includes all flags, risk scores, and recommendations.
            </p>
            <div className="flex gap-3">
              <button
                onClick={exportReport}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                Download JSON
              </button>
              <button
                onClick={() => setShowExport(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
