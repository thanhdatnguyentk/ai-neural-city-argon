'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Copy,
  Check,
  Download,
  Layers,
  Terminal,
  GitBranch,
  Gauge,
  Cpu,
  Sparkles,
} from 'lucide-react';
import {
  STACK_CATALOG,
  StackSelectionMap,
  DEFAULT_STACK_SELECTIONS,
} from '../data/stack-catalog';
import { generateBoilerplateBundle } from '../lib/boilerplate-generator';
import { useLanguage } from '../context/LanguageContext';
import type { DistrictId } from '../data/districts';

export type StackPreviewTab = 'docker' | 'makefile' | 'mermaid' | 'sla';

export interface StackBuilderModalProps {
  isOpen: boolean;
  isNight: boolean;
  selections: StackSelectionMap;
  onUpdateSelection: (districtId: DistrictId, optionId: string) => void;
  onResetDefaults: () => void;
  onClose: () => void;
}

export const StackBuilderModal: React.FC<StackBuilderModalProps> = ({
  isOpen,
  isNight,
  selections,
  onUpdateSelection,
  onResetDefaults,
  onClose,
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<StackPreviewTab>('docker');
  const [copied, setCopied] = useState<boolean>(false);

  const bundle = useMemo(
    () => generateBoilerplateBundle(selections || DEFAULT_STACK_SELECTIONS),
    [selections]
  );

  if (!isOpen) return null;

  const currentCodeContent =
    activeTab === 'docker'
      ? bundle.dockerComposeYaml
      : activeTab === 'makefile'
      ? bundle.makefile
      : activeTab === 'mermaid'
      ? bundle.mermaidDiagram
      : bundle.slaEstimate.markdownReport;

  const currentFileName =
    activeTab === 'docker'
      ? 'docker-compose.yml'
      : activeTab === 'makefile'
      ? 'Makefile'
      : activeTab === 'mermaid'
      ? 'architecture.mmd'
      : 'SLA_SIZING_REPORT.md';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentCodeContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore clipboard error
    }
  };

  const handleDownloadSingleFile = () => {
    const blob = new Blob([currentCodeContent], {
      type: 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadFullBundle = () => {
    const bundleScript = `#!/usr/bin/env bash
# ============================================================================
# AI NEURAL CITY — SELF-EXTRACTING PRODUCTION BOILERPLATE BUNDLE
# Run: bash ai-neural-city-stack-bundle.sh
# ============================================================================
set -e

mkdir -p ai-neural-city-stack
cd ai-neural-city-stack

cat << 'EOF_DOCKER' > docker-compose.yml
${bundle.dockerComposeYaml}
EOF_DOCKER

cat << 'EOF_MAKEFILE' > Makefile
${bundle.makefile}
EOF_MAKEFILE

cat << 'EOF_MERMAID' > architecture.mmd
${bundle.mermaidDiagram}
EOF_MERMAID

cat << 'EOF_SLA' > SLA_SIZING_REPORT.md
${bundle.slaEstimate.markdownReport}
EOF_SLA

echo "✅ Extracted docker-compose.yml, Makefile, architecture.mmd, and SLA_SIZING_REPORT.md into ./ai-neural-city-stack"
`;
    const blob = new Blob([bundleScript], {
      type: 'text/x-shellscript;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ai-neural-city-stack-bundle.sh';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t.stackBuilder.modalTitle}
        onWheel={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-3 sm:p-6 backdrop-blur-md"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.2 }}
          className={`relative flex max-h-[92vh] w-full max-w-[1440px] flex-col overflow-hidden rounded-3xl border shadow-2xl ${
            isNight
              ? 'border-cyan-500/40 bg-[#050B1A] text-slate-100'
              : 'border-slate-300 bg-white text-slate-900'
          }`}
        >
          {/* Header */}
          <div
            className={`flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4 ${
              isNight ? 'border-slate-800 bg-slate-950/80' : 'border-slate-200 bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-400/50 bg-cyan-500/15 text-cyan-400">
                <Layers aria-hidden="true" className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-mono text-sm sm:text-base font-bold uppercase tracking-wider text-cyan-400">
                  {t.stackBuilder.modalTitle}
                </h2>
                <p
                  className={`text-xs ${
                    isNight ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  {t.stackBuilder.modalSubtitle}
                </p>
              </div>
            </div>

            {/* Live Hardware SLA Summary Pills */}
            <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
              <span className="rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-2.5 py-1 text-emerald-300 font-bold">
                P99 Est: {bundle.slaEstimate.estimatedP99LatencyMs} ms
              </span>
              <span className="rounded-xl border border-violet-500/40 bg-violet-500/15 px-2.5 py-1 text-violet-300 font-bold">
                VRAM: {bundle.slaEstimate.totalVramGb} GB
              </span>
              <span className="hidden md:inline-block rounded-xl border border-amber-500/40 bg-amber-500/15 px-2.5 py-1 text-amber-300 font-bold">
                {bundle.slaEstimate.recommendedGpuTier}
              </span>
              <button
                type="button"
                onClick={onResetDefaults}
                className="rounded-xl border border-slate-700 bg-slate-900 px-2.5 py-1 text-slate-300 hover:border-cyan-400 hover:text-white transition-colors cursor-pointer"
              >
                Reset Default Stack
              </button>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close Stack Builder"
                className="rounded-xl border border-slate-700 bg-slate-900 p-1.5 text-slate-300 hover:border-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
              >
                <X aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Body: 2 Columns */}
          <div className="grid flex-1 grid-cols-1 lg:grid-cols-12 overflow-hidden">
            {/* Left Column: 8-District Stack Selector Cards */}
            <div
              className={`lg:col-span-5 overflow-y-auto border-b lg:border-b-0 lg:border-r p-4 sm:p-5 space-y-3 ${
                isNight ? 'border-slate-800/90 bg-[#060E21]' : 'border-slate-200 bg-slate-50/70'
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-400">
                  {t.stackBuilder.selectTechHeading}
                </h3>
                <span className="font-mono text-[10px] text-slate-400">
                  8 Districts · 24 Production Options
                </span>
              </div>

              {STACK_CATALOG.map((cat) => {
                const chosenId = selections[cat.districtId] || cat.defaultOptionId;
                const localizedDistrict = t.districts[cat.districtId];
                return (
                  <div
                    key={cat.districtId}
                    className={`rounded-2xl border p-3 transition-colors ${
                      isNight
                        ? 'border-slate-800 bg-slate-950/80'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: cat.accentColor }}
                        />
                        <span className="font-mono text-xs font-bold">
                          {cat.code}: {localizedDistrict?.name || cat.roleTitle}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-slate-400">
                        {localizedDistrict?.shortName}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                      {cat.options.map((opt) => {
                        const active = opt.id === chosenId;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => onUpdateSelection(cat.districtId, opt.id)}
                            aria-pressed={active}
                            className={`flex flex-col justify-between rounded-xl border p-2 text-left transition-all cursor-pointer ${
                              active
                                ? 'border-cyan-400 bg-cyan-500/15 text-cyan-200 shadow-sm shadow-cyan-500/20'
                                : isNight
                                ? 'border-slate-800 bg-slate-900/70 text-slate-300 hover:border-slate-700 hover:text-white'
                                : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-1">
                              <span
                                className={`font-mono text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                                  active
                                    ? 'bg-cyan-400 text-slate-950'
                                    : 'bg-slate-800 text-slate-400'
                                }`}
                              >
                                Option {opt.tier}
                              </span>
                              <span className="font-mono text-[9px] text-amber-400">
                                {opt.protocolBadge}
                              </span>
                            </div>
                            <div className="mt-1.5 font-mono text-[11px] font-bold leading-snug">
                              {opt.name}
                            </div>
                            <div className="mt-1 text-[10px] text-slate-400 line-clamp-2">
                              {opt.summary}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Tabbed Code & Diagram Preview */}
            <div className="lg:col-span-7 flex flex-col overflow-hidden bg-[#030712] text-slate-100">
              {/* Tabs & Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 bg-slate-950 px-4 py-3">
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setActiveTab('docker')}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-mono text-xs font-semibold transition-colors cursor-pointer ${
                      activeTab === 'docker'
                        ? 'bg-cyan-400 text-slate-950 font-bold'
                        : 'bg-slate-900 text-slate-300 hover:text-white'
                    }`}
                  >
                    <Terminal aria-hidden="true" className="h-3.5 w-3.5" />
                    <span>{t.stackBuilder.tabDocker}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('makefile')}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-mono text-xs font-semibold transition-colors cursor-pointer ${
                      activeTab === 'makefile'
                        ? 'bg-cyan-400 text-slate-950 font-bold'
                        : 'bg-slate-900 text-slate-300 hover:text-white'
                    }`}
                  >
                    <Cpu aria-hidden="true" className="h-3.5 w-3.5" />
                    <span>{t.stackBuilder.tabMakefile}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('mermaid')}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-mono text-xs font-semibold transition-colors cursor-pointer ${
                      activeTab === 'mermaid'
                        ? 'bg-cyan-400 text-slate-950 font-bold'
                        : 'bg-slate-900 text-slate-300 hover:text-white'
                    }`}
                  >
                    <GitBranch aria-hidden="true" className="h-3.5 w-3.5" />
                    <span>{t.stackBuilder.tabMermaid}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('sla')}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-mono text-xs font-semibold transition-colors cursor-pointer ${
                      activeTab === 'sla'
                        ? 'bg-cyan-400 text-slate-950 font-bold'
                        : 'bg-slate-900 text-slate-300 hover:text-white'
                    }`}
                  >
                    <Gauge aria-hidden="true" className="h-3.5 w-3.5" />
                    <span>{t.stackBuilder.tabSla}</span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 font-mono text-xs font-semibold text-cyan-300 hover:border-cyan-400 transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check aria-hidden="true" className="h-3.5 w-3.5 text-emerald-400" />
                        <span>{t.stackBuilder.copiedBtn}</span>
                      </>
                    ) : (
                      <>
                        <Copy aria-hidden="true" className="h-3.5 w-3.5" />
                        <span>{t.stackBuilder.copyBtn}</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadSingleFile}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 font-mono text-xs font-semibold text-slate-200 hover:border-cyan-400 transition-colors cursor-pointer"
                  >
                    <Download aria-hidden="true" className="h-3.5 w-3.5" />
                    <span>{t.stackBuilder.downloadFileBtn}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadFullBundle}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-amber-400 px-3 py-1.5 font-mono text-xs font-bold text-slate-950 hover:bg-amber-300 transition-colors cursor-pointer"
                  >
                    <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
                    <span>{t.stackBuilder.downloadBundleBtn}</span>
                  </button>
                </div>
              </div>

              {/* SLA Cards Banner inside Right Column */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-b border-slate-800/80 bg-slate-900/60 px-4 py-2.5 font-mono text-xs">
                <div className="rounded-xl border border-slate-800 bg-slate-950/90 p-2">
                  <span className="block text-[9px] uppercase text-slate-400">
                    EST. P99 LATENCY
                  </span>
                  <span className="text-sm font-bold text-cyan-400">
                    {bundle.slaEstimate.estimatedP99LatencyMs} ms
                  </span>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950/90 p-2">
                  <span className="block text-[9px] uppercase text-slate-400">
                    THROUGHPUT CAPACITY
                  </span>
                  <span className="text-sm font-bold text-emerald-400">
                    {bundle.slaEstimate.estimatedThroughputRps} req/s
                  </span>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950/90 p-2">
                  <span className="block text-[9px] uppercase text-slate-400">
                    COMBINED GPU VRAM
                  </span>
                  <span className="text-sm font-bold text-violet-400">
                    {bundle.slaEstimate.totalVramGb} GB
                  </span>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950/90 p-2">
                  <span className="block text-[9px] uppercase text-slate-400">
                    AVAILABILITY SLA
                  </span>
                  <span className="text-xs font-bold text-amber-400 truncate block">
                    {bundle.slaEstimate.availabilityTarget}
                  </span>
                </div>
              </div>

              {/* Code Viewer */}
              <div className="flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed">
                <pre className="whitespace-pre-wrap break-words text-cyan-100/95 selection:bg-cyan-500/30">
                  <code>{currentCodeContent}</code>
                </pre>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
