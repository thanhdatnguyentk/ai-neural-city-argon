'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Play,
  Layers,
  CheckCircle2,
  BookOpen,
  Gauge,
} from 'lucide-react';
import { CASE_STUDIES, CaseStudyBlueprint } from '../data/case-studies';
import { useLanguage } from '../context/LanguageContext';

export interface CaseStudiesModalProps {
  isOpen: boolean;
  isNight: boolean;
  activeCaseStudyId: string | null;
  onSimulateCaseStudy: (study: CaseStudyBlueprint) => void;
  onInspectInStackBuilder: (study: CaseStudyBlueprint) => void;
  onClose: () => void;
}

export const CaseStudiesModal: React.FC<CaseStudiesModalProps> = ({
  isOpen,
  isNight,
  activeCaseStudyId,
  onSimulateCaseStudy,
  onInspectInStackBuilder,
  onClose,
}) => {
  const { lang, t } = useLanguage();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t.caseStudies.modalTitle}
        onWheel={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-3 sm:p-6 backdrop-blur-md"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.2 }}
          className={`relative flex max-h-[92vh] w-full max-w-[1380px] flex-col overflow-hidden rounded-3xl border shadow-2xl ${
            isNight
              ? 'border-cyan-500/40 bg-[#050B1A] text-slate-100'
              : 'border-slate-300 bg-white text-slate-900'
          }`}
        >
          {/* Header */}
          <div
            className={`flex items-center justify-between gap-3 border-b px-5 py-4 ${
              isNight ? 'border-slate-800 bg-slate-950/80' : 'border-slate-200 bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-amber-400/50 bg-amber-500/15 text-amber-400">
                <BookOpen aria-hidden="true" className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-mono text-sm sm:text-base font-bold uppercase tracking-wider text-amber-400">
                  {t.caseStudies.modalTitle}
                </h2>
                <p
                  className={`text-xs ${
                    isNight ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  {t.caseStudies.modalSubtitle}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close Case Studies Modal"
              className="rounded-xl border border-slate-700 bg-slate-900 p-2 text-slate-300 hover:border-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
            >
              <X aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>

          {/* 3 Applied Blueprints Grid */}
          <div className="grid flex-1 grid-cols-1 lg:grid-cols-3 gap-5 overflow-y-auto p-5">
            {CASE_STUDIES.map((study) => {
              const isSelected = activeCaseStudyId === study.id;
              return (
                <div
                  key={study.id}
                  className={`flex flex-col justify-between rounded-2xl border p-5 transition-all ${
                    isSelected
                      ? 'border-cyan-400 bg-cyan-950/20 shadow-lg shadow-cyan-500/15'
                      : isNight
                      ? 'border-slate-800 bg-[#081229]/90 hover:border-slate-700'
                      : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className="rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase"
                        style={{
                          backgroundColor: `${study.accentColor}22`,
                          color: study.accentColor,
                        }}
                      >
                        {study.numberBadge}
                      </span>
                      {isSelected && (
                        <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-emerald-400">
                          <CheckCircle2 aria-hidden="true" className="h-3.5 w-3.5" />
                          ACTIVE ON 3D CITY
                        </span>
                      )}
                    </div>

                    <h3 className="mt-3 text-base font-bold leading-snug">
                      {study.title[lang]}
                    </h3>
                    <p className="mt-1 font-mono text-[11px] text-cyan-400">
                      {study.subtitle[lang]}
                    </p>

                    {/* Problem Statement */}
                    <div
                      className={`mt-3 rounded-xl border p-3 text-xs leading-relaxed ${
                        isNight
                          ? 'border-slate-800 bg-slate-950/70 text-slate-300'
                          : 'border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      <span className="block font-mono text-[10px] font-bold uppercase text-amber-400 mb-1">
                        {t.caseStudies.problemLabel}
                      </span>
                      {study.problemStatement[lang]}
                    </div>

                    {/* Key Metrics */}
                    <div className="mt-3">
                      <span className="block font-mono text-[10px] font-bold uppercase text-slate-400 mb-1.5">
                        <Gauge aria-hidden="true" className="inline h-3 w-3 mr-1 text-emerald-400" />
                        {t.caseStudies.metricsLabel}
                      </span>
                      <div className="grid grid-cols-3 gap-1.5">
                        {study.metrics.map((m) => (
                          <div
                            key={m.label}
                            className={`rounded-xl border p-2 font-mono ${
                              isNight
                                ? 'border-slate-800 bg-slate-950/90'
                                : 'border-slate-200 bg-white'
                            }`}
                          >
                            <span className="block text-[9px] text-slate-400 truncate">
                              {m.label}
                            </span>
                            <span className="mt-0.5 block text-xs font-bold text-emerald-400">
                              {m.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Active Districts & Architecture */}
                    <div className="mt-3.5 space-y-2">
                      <span className="block font-mono text-[10px] font-bold uppercase text-slate-400">
                        {t.caseStudies.architectureLabel}
                      </span>
                      {study.districtArchitecture.map((arch) => (
                        <div
                          key={`${study.id}-${arch.districtId}`}
                          className={`rounded-xl border p-2.5 text-xs ${
                            isNight
                              ? 'border-slate-800/90 bg-slate-950/60'
                              : 'border-slate-200 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 font-mono text-[10px]">
                            <span className="font-bold text-cyan-300">
                              {arch.code} · {arch.roleTitle}
                            </span>
                            <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[9px] text-amber-300 shrink-0">
                              {arch.protocolBadge}
                            </span>
                          </div>
                          <p
                            className={`mt-1 text-[11px] leading-relaxed ${
                              isNight ? 'text-slate-300' : 'text-slate-600'
                            }`}
                          >
                            {arch.implementationDetail}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 1-Click Action Buttons */}
                  <div className="mt-4 flex flex-col sm:flex-row gap-2 pt-3 border-t border-slate-800/80">
                    <button
                      type="button"
                      onClick={() => onSimulateCaseStudy(study)}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-cyan-400 px-3 py-2 font-mono text-xs font-bold text-slate-950 hover:bg-cyan-300 transition-colors cursor-pointer"
                    >
                      <Play aria-hidden="true" className="h-3.5 w-3.5" />
                      <span>{t.caseStudies.simulateBtn}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onInspectInStackBuilder(study)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-amber-400/60 bg-amber-500/15 px-3 py-2 font-mono text-xs font-bold text-amber-300 hover:bg-amber-400 hover:text-slate-950 transition-colors cursor-pointer"
                    >
                      <Layers aria-hidden="true" className="h-3.5 w-3.5" />
                      <span>{t.caseStudies.openStackBtn}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
