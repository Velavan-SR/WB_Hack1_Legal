'use client';

import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface Flag {
  text: string;
  type?: string;
  reason?: string;
  severity?: string;
  category?: string;
  riskLevel?: string;
}

interface RiskDisplayProps {
  redFlags: Flag[];
  yellowFlags: Flag[];
  greenFlags: Flag[];
}

export default function RiskDisplay({ redFlags, yellowFlags, greenFlags }: RiskDisplayProps) {
  if (!redFlags?.length && !yellowFlags?.length && !greenFlags?.length) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Red Flags - High Risk */}
      {redFlags && redFlags.length > 0 && (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <XCircle className="w-7 h-7 text-red-600" />
            <div>
              <h3 className="text-xl font-bold text-red-900">
                🔴 Red Flags ({redFlags.length})
              </h3>
              <p className="text-sm text-red-700">High-risk clauses that require attention</p>
            </div>
          </div>
          <div className="space-y-3">
            {redFlags.map((flag, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-4 border-l-4 border-red-500 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl flex-shrink-0">⚠️</div>
                  <div className="flex-1">
                    {flag.type && (
                      <div className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded mb-2">
                        {flag.type}
                      </div>
                    )}
                    <p className="text-gray-800 text-sm mb-2 font-mono">
                      &quot;{flag.text.substring(0, 200)}
                      {flag.text.length > 200 ? '...' : ''}&quot;
                    </p>
                    {flag.reason && (
                      <div className="bg-red-50 rounded p-2 mt-2">
                        <p className="text-red-900 text-sm font-semibold">Why this is risky:</p>
                        <p className="text-red-800 text-sm">{flag.reason}</p>
                      </div>
                    )}
                    {flag.category && (
                      <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded mt-2">
                        Category: {flag.category}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Yellow Flags - Medium Risk */}
      {yellowFlags && yellowFlags.length > 0 && (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-7 h-7 text-yellow-600" />
            <div>
              <h3 className="text-xl font-bold text-yellow-900">
                🟡 Yellow Flags ({yellowFlags.length})
              </h3>
              <p className="text-sm text-yellow-700">Moderate concerns worth reviewing</p>
            </div>
          </div>
          <div className="space-y-3">
            {yellowFlags.map((flag, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-4 border-l-4 border-yellow-500 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl flex-shrink-0">⚡</div>
                  <div className="flex-1">
                    {flag.type && (
                      <div className="inline-block bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded mb-2">
                        {flag.type}
                      </div>
                    )}
                    <p className="text-gray-800 text-sm mb-2 font-mono">
                      &quot;{flag.text.substring(0, 200)}
                      {flag.text.length > 200 ? '...' : ''}&quot;
                    </p>
                    {flag.reason && (
                      <div className="bg-yellow-50 rounded p-2 mt-2">
                        <p className="text-yellow-900 text-sm font-semibold">Note:</p>
                        <p className="text-yellow-800 text-sm">{flag.reason}</p>
                      </div>
                    )}
                    {flag.category && (
                      <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded mt-2">
                        Category: {flag.category}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Green Flags - Low Risk */}
      {greenFlags && greenFlags.length > 0 && (
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-7 h-7 text-green-600" />
            <div>
              <h3 className="text-xl font-bold text-green-900">
                🟢 Green Flags ({greenFlags.length})
              </h3>
              <p className="text-sm text-green-700">Consumer-friendly clauses</p>
            </div>
          </div>
          <div className="space-y-3">
            {greenFlags.map((flag, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-4 border-l-4 border-green-500 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl flex-shrink-0">✅</div>
                  <div className="flex-1">
                    {flag.type && (
                      <div className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded mb-2">
                        {flag.type}
                      </div>
                    )}
                    <p className="text-gray-800 text-sm mb-2 font-mono">
                      &quot;{flag.text.substring(0, 200)}
                      {flag.text.length > 200 ? '...' : ''}&quot;
                    </p>
                    {flag.reason && (
                      <div className="bg-green-50 rounded p-2 mt-2">
                        <p className="text-green-900 text-sm font-semibold">Why this is good:</p>
                        <p className="text-green-800 text-sm">{flag.reason}</p>
                      </div>
                    )}
                    {flag.category && (
                      <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded mt-2">
                        Category: {flag.category}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Risk Score Summary */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6 border-2 border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-3">📊 Risk Summary</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">{redFlags.length}</div>
            <div className="text-sm text-gray-600">High Risk</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600">{yellowFlags.length}</div>
            <div className="text-sm text-gray-600">Medium Risk</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{greenFlags.length}</div>
            <div className="text-sm text-gray-600">Consumer-Friendly</div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-300">
          <p className="text-sm text-gray-700 text-center">
            {redFlags.length > 3
              ? '🚨 High risk document - Review carefully before accepting'
              : redFlags.length > 0
              ? '⚠️ Some concerning clauses found - Read the red flags'
              : '✅ Relatively safe terms - Standard industry clauses'}
          </p>
        </div>
      </div>
    </div>
  );
}
