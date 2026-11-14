import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  FileSpreadsheet, 
  Database, 
  CheckCircle2, 
} from 'lucide-react';
import { AuditReport, ThreatActor, InfrastructureItem } from '../../types';
import { dbService } from '../../services/db';
import { useToast } from '../ui/Toast';

interface ReportsViewProps {
  reports: AuditReport[];
  actors?: ThreatActor[];
  infrastructure?: InfrastructureItem[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  reports = [],
  actors = [],
  infrastructure = []
}) => {
  const { showToast } = useToast();
  const [selectedReport] = useState<AuditReport>(reports[0] || null);

  // CSV Exporter for Actors
  const exportActorsCsv = () => {
    const headers = ['ID', 'Handle', 'RealNameCandidate', 'Category', 'ConfidenceScore', 'Location', 'Timezone', 'LastSeen', 'Notes'];
    const rows = actors.map(a => [
      a.id,
      `"${a.handle}"`,
      `"${a.realNameCandidate || ''}"`,
      `"${a.category}"`,
      a.confidenceScore,
      `"${a.locationCandidate}"`,
      `"${a.timezoneEstimate}"`,
      `"${a.lastSeen}"`,
      `"${(a.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `TraceNet_Actors_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('success', 'CSV Exported', 'Actor profiles exported to CSV file.');
  };

  // CSV Exporter for Infrastructure
  const exportInfraCsv = () => {
    const headers = ['ID', 'ActorHandle', 'OnionAddress', 'ClearnetDomain', 'IPAddress', 'HostingProvider', 'Country', 'DiscoveredVia', 'Status'];
    const rows = infrastructure.map(i => [
      i.id,
      `"${i.actorHandle}"`,
      `"${i.onionAddress}"`,
      `"${i.clearnetDomain}"`,
      `"${i.ipAddress}"`,
      `"${i.hostingProvider}"`,
      `"${i.country}"`,
      `"${i.discoveredVia}"`,
      `"${i.status}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `TraceNet_ServerClues_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('success', 'CSV Exported', 'Server clues exported to CSV file.');
  };

  // JSON Full Database Dump
  const exportJsonDump = () => {
    const jsonStr = dbService.exportDatabaseDump();
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(jsonStr);
    const link = document.createElement('a');
    link.setAttribute('href', dataUri);
    link.setAttribute('download', `TraceNet_DB_Dump_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('success', 'JSON Dump Exported', 'Full database dump downloaded.');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 md:p-10 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-black/15 border border-white/20 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#19232B]" />
            <h1 className="text-xl font-bold text-[#19232B]">
              Reports &amp; Export
            </h1>
          </div>
          <p className="text-xs text-white/80 mt-1 max-w-2xl leading-relaxed">
            Generate summary reports, evidence summaries, and download structured data (PDF/Print, CSV, and full JSON database backups).
          </p>
        </div>

        {/* Quick Exporters */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0 text-xs">
          <button
            onClick={exportActorsCsv}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#1E262C] hover:bg-[#2B353D] text-white rounded-full text-xs font-bold transition-all shadow-md"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#3FB950]" />
            <span>Actors CSV</span>
          </button>

          <button
            onClick={exportInfraCsv}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#1E262C] hover:bg-[#2B353D] text-white rounded-full text-xs font-bold transition-all shadow-md"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-white" />
            <span>Servers CSV</span>
          </button>

          <button
            onClick={exportJsonDump}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#1E262C] hover:bg-[#2B353D] text-white rounded-full text-xs font-bold transition-all shadow-md"
          >
            <Database className="w-3.5 h-3.5 text-white" />
            <span>JSON Backup</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-5 py-2 bg-white hover:bg-slate-100 text-slate-900 rounded-full text-xs font-bold transition-all shadow-md"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report / PDF</span>
          </button>
        </div>
      </div>

      {/* Main Dossier Viewer */}
      {selectedReport && (
        <div className="rounded-2xl bg-black/15 border border-white/20 backdrop-blur-md p-6 space-y-6 text-white print:bg-white print:text-black print:p-0 print:border-none shadow-lg">
          {/* Dossier Letterhead */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/15 print:border-slate-300 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-0.5 rounded-full bg-[#1E262C] text-white">
                  INVESTIGATION SUMMARY REPORT
                </span>
              </div>
              <h2 className="text-xl font-bold text-white print:text-black mt-1">
                {selectedReport.title}
              </h2>
              <div className="text-xs text-white/80 font-mono">
                Target: <strong className="text-white print:text-blue-700">{selectedReport.targetService}</strong> &bull; Generated: {selectedReport.generatedAt}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-black/20 border border-white/15 print:bg-slate-100 print:border-slate-300 text-right shrink-0">
              <div className="text-[11px] text-white/80 font-bold uppercase tracking-wider">Match Strength:</div>
              <div className="text-2xl font-bold text-white print:text-blue-700">{selectedReport.overallConfidence}%</div>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              1. Executive Summary
            </h3>
            <p className="text-xs text-white/90 print:text-slate-800 leading-relaxed bg-black/20 print:bg-slate-50 p-4 rounded-xl border border-white/15">
              {selectedReport.executiveSummary}
            </p>
          </div>

          {/* Leaked Clearnet Artifacts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-black/20 print:bg-slate-50 border border-white/15 space-y-2">
              <div className="text-[#E76F51] font-bold text-xs uppercase tracking-wider">[!] Discovered Server IP Addresses:</div>
              <ul className="space-y-1.5">
                {selectedReport.leakedClearnetIps.map((ip, idx) => (
                  <li key={idx} className="p-2.5 rounded-lg bg-black/30 print:bg-white text-white font-bold font-mono border border-white/10">
                    {ip} &bull; Frankfurt ASN 48219 (Pecan Hosting Ltd)
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-black/20 print:bg-slate-50 border border-white/15 space-y-2">
              <div className="text-[#F4A261] font-bold text-xs uppercase tracking-wider">[!] Linked Clearnet Domain Names:</div>
              <ul className="space-y-1.5">
                {selectedReport.leakedDomains.map((dom, idx) => (
                  <li key={idx} className="p-2.5 rounded-lg bg-black/30 print:bg-white text-white font-bold font-mono border border-white/10">
                    {dom} (Matched via Certificate Names)
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Detailed Misconfiguration Findings Matrix */}
          <div className="space-y-3 text-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              2. Audit Matrix (7 Live Demos Evaluated)
            </h3>
            <div className="overflow-x-auto rounded-xl border border-white/15 bg-black/20">
              <table className="w-full text-left text-xs print:bg-white">
                <thead className="bg-[#1E262C] print:bg-slate-200 text-white/80 print:text-black border-b border-white/15 text-[11px] font-semibold">
                  <tr>
                    <th className="p-3">Topic</th>
                    <th className="p-3">Severity</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Finding Summary</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 print:divide-slate-300 text-white/90 print:text-black">
                  {selectedReport.modulesEvaluated.map((m, idx) => (
                    <tr key={idx} className="hover:bg-white/5">
                      <td className="p-3 font-semibold text-white print:text-black">{m.name}</td>
                      <td className="p-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          m.severity === 'CRITICAL' ? 'bg-[#E76F51] text-white' : 'bg-[#F4A261] text-slate-900'
                        }`}>
                          {m.severity}
                        </span>
                      </td>
                      <td className="p-3 text-[#E76F51] font-bold">{m.status}</td>
                      <td className="p-3 text-white/80 print:text-slate-700">{m.summary}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Hardened Remediation Recommendations */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              3. Recommended Action Plan
            </h3>
            <div className="p-4 rounded-xl bg-black/20 print:bg-slate-50 border border-white/15 space-y-2 text-xs text-white/90 print:text-slate-800">
              {selectedReport.mitigationPlan.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#3FB950] shrink-0 mt-0.5" />
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

