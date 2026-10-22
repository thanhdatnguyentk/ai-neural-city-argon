'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Microscope,
  Play,
  Plus,
  Minus,
  Zap,
  ShieldCheck,
  AlertTriangle,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import { DISTRICTS, DistrictId } from '../../data/districts';
import { useLanguage } from '../../context/LanguageContext';
import {
  MICRO_LAB_METADATA,
  TokenizerMode,
  VectorSearchMode,
  ZeroShardingStage,
  MoeRoutingMode,
  MoeStreamPresetId,
  KvAllocatorMode,
  RagasResponseMode,
  tokenizeTextSample,
  computeVectorSearchMetrics,
  computeZeroGpuMemoryBreakdown,
  computeMoeRoutingStats,
  computeKvBlockAllocation,
  computeRagasFaithfulness,
} from '../../types/micro-labs';

export interface DistrictMicroLabModalProps {
  districtId: DistrictId | null;
  isOpen: boolean;
  isNight: boolean;
  onSelectDistrict: (id: DistrictId) => void;
  onClose: () => void;
}

export const DistrictMicroLabModal: React.FC<DistrictMicroLabModalProps> = ({
  districtId,
  isOpen,
  isNight,
  onSelectDistrict,
  onClose,
}) => {
  const { lang, t } = useLanguage();

  // D1 State: Tokenizer & ViT Patch Grid
  const [d1Text, setD1Text] = useState<string>(
    'Identify kingfisher species & OCR timestamp in frame #1042'
  );
  const [d1Mode, setD1Mode] = useState<TokenizerMode>('bpe');
  const [selectedPatchIdx, setSelectedPatchIdx] = useState<number>(102);

  // D2 State: HNSW vs Brute-Force
  const [d2Mode, setD2Mode] = useState<VectorSearchMode>('hnsw');
  const [efSearch, setEfSearch] = useState<number>(32);
  const [d2PulseCount, setD2PulseCount] = useState<number>(1);

  // D3 State: DeepSpeed ZeRO & QLoRA
  const [d3Stage, setD3Stage] = useState<ZeroShardingStage>('zero-3');

  // D4 State: Sparse MoE Router
  const [d4Stream, setD4Stream] = useState<MoeStreamPresetId>('multimodal');
  const [d4Mode, setD4Mode] = useState<MoeRoutingMode>('sparse-top2');

  // D5 State: vLLM PagedAttention
  const [d5Mode, setD5Mode] = useState<KvAllocatorMode>('paged-attention');
  const [d5Requests, setD5Requests] = useState<number>(6);
  const [d5PrefixSharing, setD5PrefixSharing] = useState<boolean>(true);

  // D6 State: MCP & ReAct State Machine
  const [d6Step, setD6Step] = useState<number>(2);
  const [d6InjectError, setD6InjectError] = useState<boolean>(false);

  // D7 State: RAGAS Faithfulness
  const [d7Mode, setD7Mode] = useState<RagasResponseMode>('grounded');

  // D8 State: SSE Streaming & Canary Router
  const [canaryPercent, setCanaryPercent] = useState<number>(20);
  const [semanticCacheHit, setSemanticCacheHit] = useState<boolean>(true);

  if (!isOpen || !districtId) return null;

  const meta = MICRO_LAB_METADATA[districtId];
  const d1Stats = tokenizeTextSample(d1Text, d1Mode);
  const d2Stats = computeVectorSearchMetrics(d2Mode, efSearch);
  const d3Stats = computeZeroGpuMemoryBreakdown(d3Stage, 30, 4);
  const d4Stats = computeMoeRoutingStats(d4Stream, d4Mode);
  const d5Stats = computeKvBlockAllocation(
    d5Mode,
    d5Requests,
    d5PrefixSharing
  );
  const d7Stats = computeRagasFaithfulness(d7Mode);

  const patchRow = Math.floor(selectedPatchIdx / 16);
  const patchCol = selectedPatchIdx % 16;

  const mcpStates = [
    {
      step: 0,
      node: 'Host LLM (Planner)',
      protocol: 'ReAct Thought',
      payload: `{"thought": "User asked for P99 latency regressions in Vector Vault. Discovering MCP tools..."}`,
    },
    {
      step: 1,
      node: 'MCP Client ⇄ Server',
      protocol: 'JSON-RPC 2.0 · tools/list',
      payload: `{"jsonrpc": "2.0", "id": 1, "method": "tools/list", "result": ["query_pgvector_hnsw", "inspect_prometheus_p99"]}`,
    },
    {
      step: 2,
      node: 'MCP Server [PostgreSQL / PromQL]',
      protocol: 'JSON-RPC 2.0 · tools/call',
      payload: d6InjectError
        ? `{"jsonrpc": "2.0", "id": 2, "error": {"code": -32001, "message": "Timeout: efSearch=512 exceeded 50ms budget"}}`
        : `{"jsonrpc": "2.0", "id": 2, "method": "tools/call", "params": {"name": "query_pgvector_hnsw", "arguments": {"ef_search": 64, "top_k": 5}}}`,
    },
    {
      step: 3,
      node: d6InjectError ? 'Self-Correction Retry Loop' : 'Grounded Synthesis',
      protocol: d6InjectError ? 'Adaptive Fallback' : 'Verified Response',
      payload: d6InjectError
        ? `{"retry_action": "Lower ef_search from 512 -> 64 and enable HNSW index scan", "status": "RECOVERED (4.2ms)"}`
        : `{"observation": "Top-5 chunks retrieved in 4.2ms (Recall@10=0.95). Streaming grounded answer."}`,
    },
  ];

  const d8TtftMs = semanticCacheHit ? 6.4 : Math.round(28 + canaryPercent * 0.15);
  const d8ItlMs = semanticCacheHit ? 1.2 : 8.4;

  return (
    <AnimatePresence>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={meta.labTitle[lang]}
        onWheel={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-3 sm:p-6 backdrop-blur-md"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 14 }}
          transition={{ duration: 0.22 }}
          className={`relative flex max-h-[92vh] w-full max-w-[1380px] flex-col overflow-hidden rounded-3xl border shadow-2xl ${
            isNight
              ? 'border-cyan-500/40 bg-[#040917] text-slate-100'
              : 'border-slate-300 bg-white text-slate-900'
          }`}
        >
          {/* Top Header + District Switcher Bar */}
          <div
            className={`border-b px-5 py-4 ${
              isNight ? 'border-slate-800 bg-slate-950/90' : 'border-slate-200 bg-slate-50'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-2xl border"
                  style={{
                    borderColor: `${meta.accentColor}66`,
                    backgroundColor: `${meta.accentColor}1A`,
                    color: meta.accentColor,
                  }}
                >
                  <Microscope aria-hidden="true" className="h-5 w-5" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-cyan-500/20 px-2 py-0.5 font-mono text-[10px] font-bold text-cyan-300">
                      {meta.code} · INTERIOR ALGORITHMIC LAB
                    </span>
                    <span className="font-mono text-[11px] text-amber-400">
                      {meta.algorithmFocus}
                    </span>
                  </div>
                  <h2 className="mt-1 text-base sm:text-lg font-bold">
                    {meta.labTitle[lang]}
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close Micro-Lab"
                className="rounded-xl border border-slate-700 bg-slate-900 p-2 text-slate-300 hover:border-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
              >
                <X aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>

            {/* 8-District Lab Switcher Pills */}
            <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1">
              {DISTRICTS.map((d, idx) => {
                const active = d.id === districtId;
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => onSelectDistrict(d.id)}
                    className={`rounded-xl px-2.5 py-1 font-mono text-[10px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      active
                        ? 'bg-cyan-400 text-slate-950 font-bold'
                        : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    0{idx + 1} · {t.districts[d.id]?.shortName || d.shortName}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Micro-Lab Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6">
            {/* ==================== LAB 1: INPUT GATEWAY (BPE + ViT 16x16 PATCHES) ==================== */}
            {districtId === 'input-gateway' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 space-y-4">
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <span className="font-mono text-xs font-bold uppercase text-cyan-400">
                        1. Interactive Subword BPE / Byte Tokenizer
                      </span>
                      <div className="flex gap-1">
                        {(['word', 'bpe', 'byte'] as TokenizerMode[]).map((m) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setD1Mode(m)}
                            className={`rounded-lg px-2.5 py-1 font-mono text-[10px] uppercase cursor-pointer ${
                              d1Mode === m
                                ? 'bg-cyan-400 text-slate-950 font-bold'
                                : 'bg-slate-900 text-slate-300'
                            }`}
                          >
                            {m === 'bpe'
                              ? 'BPE Subword'
                              : m === 'word'
                              ? 'Word-Level'
                              : 'UTF-8 Byte'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <input
                      type="text"
                      value={d1Text}
                      onChange={(e) => setD1Text(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 font-mono text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    />

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {d1Stats.tokens.map((tok, i) => (
                        <span
                          key={`${tok.tokenId}-${i}`}
                          className="inline-flex flex-col rounded-lg border px-2 py-1 font-mono text-xs"
                          style={{
                            borderColor: `${tok.colorHex}66`,
                            backgroundColor: `${tok.colorHex}18`,
                          }}
                        >
                          <span className="font-bold text-white">{tok.text}</span>
                          <span className="text-[9px] text-slate-400">
                            ID: {tok.tokenId}
                          </span>
                        </span>
                      ))}
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2 font-mono text-xs">
                      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-2.5">
                        <span className="block text-[9px] text-slate-400">
                          TOKEN COUNT
                        </span>
                        <span className="text-base font-bold text-cyan-400">
                          {d1Stats.tokenCount} tokens
                        </span>
                      </div>
                      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-2.5">
                        <span className="block text-[9px] text-slate-400">
                          COMPRESSION RATIO
                        </span>
                        <span className="text-base font-bold text-emerald-400">
                          {d1Stats.charsPerToken} chars/tok
                        </span>
                      </div>
                      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-2.5">
                        <span className="block text-[9px] text-slate-400">
                          VOCAB / OOV FALLBACK
                        </span>
                        <span className="text-xs font-bold text-amber-400">
                          128K BPE · 0% UNK
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: ViT 16x16 Visual Patch Grid */}
                <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold uppercase text-cyan-400">
                      2. ViT 16×16 Visual Patch Embedding Grid
                    </span>
                    <span className="font-mono text-[10px] text-amber-400">
                      256 Patches + [CLS]
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mb-3">
                    Click any patch in the 16×16 frame grid to inspect its Linear Projection &amp; 2D Rotary Position Embedding (`RoPE-2D`).
                  </p>

                  <div className="grid grid-cols-16 gap-0.5 rounded-xl border border-cyan-500/30 bg-slate-900 p-2 aspect-square max-w-[300px] mx-auto">
                    {Array.from({ length: 256 }, (_, idx) => {
                      const isSelected = idx === selectedPatchIdx;
                      const r = Math.floor(idx / 16);
                      const c = idx % 16;
                      const distCenter = Math.hypot(r - 7.5, c - 7.5);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedPatchIdx(idx)}
                          aria-label={`Select visual patch ${idx}`}
                          className={`aspect-square rounded-[2px] transition-transform cursor-pointer ${
                            isSelected
                              ? 'ring-2 ring-amber-400 scale-125 z-10 bg-amber-400'
                              : distCenter < 4.5
                              ? 'bg-cyan-400/70 hover:bg-cyan-300'
                              : 'bg-slate-800 hover:bg-slate-700'
                          }`}
                        />
                      );
                    })}
                  </div>

                  <div className="mt-3 rounded-xl border border-slate-800 bg-slate-900/90 p-3 font-mono text-[11px] space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Selected Patch Token:</span>
                      <span className="font-bold text-amber-400">
                        Patch #{selectedPatchIdx} (row={patchRow}, col={patchCol})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Linear Projection:</span>
                      <span className="text-cyan-300">
                        16×16×3 (768px) → d_model=1024
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">RoPE-2D Frequencies:</span>
                      <span className="text-emerald-400">
                        θ_x({patchCol}) ⊕ θ_y({patchRow})
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ==================== LAB 2: VECTOR VAULT (HNSW vs BRUTE-FORCE) ==================== */}
            {districtId === 'data-lake' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5 space-y-4">
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 space-y-4">
                    <span className="block font-mono text-xs font-bold uppercase text-cyan-400">
                      Search Strategy &amp; efSearch Controls
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setD2Mode('brute-force')}
                        className={`rounded-xl border p-3 text-left font-mono text-xs cursor-pointer ${
                          d2Mode === 'brute-force'
                            ? 'border-rose-500 bg-rose-500/20 text-rose-200 font-bold'
                            : 'border-slate-800 bg-slate-900 text-slate-300'
                        }`}
                      >
                        <div>Exact Brute-Force</div>
                        <div className="text-[10px] text-rose-400 mt-0.5">
                          O(N) Full Scan · 185 ms
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setD2Mode('hnsw')}
                        className={`rounded-xl border p-3 text-left font-mono text-xs cursor-pointer ${
                          d2Mode === 'hnsw'
                            ? 'border-cyan-400 bg-cyan-500/20 text-cyan-200 font-bold'
                            : 'border-slate-800 bg-slate-900 text-slate-300'
                        }`}
                      >
                        <div>HNSW Multi-Layer</div>
                        <div className="text-[10px] text-emerald-400 mt-0.5">
                          O(log N) Graph · {d2Stats.latencyMs} ms
                        </div>
                      </button>
                    </div>

                    <div>
                      <div className="flex justify-between font-mono text-xs mb-1">
                        <span>HNSW Candidate Queue (`efSearch`):</span>
                        <span className="font-bold text-cyan-400">{efSearch}</span>
                      </div>
                      <input
                        type="range"
                        min={8}
                        max={128}
                        step={8}
                        value={efSearch}
                        onChange={(e) => setEfSearch(Number(e.target.value))}
                        className="w-full accent-cyan-400 cursor-pointer"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => setD2PulseCount((c) => c + 1)}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-2.5 font-mono text-xs font-bold text-slate-950 hover:bg-cyan-300 transition-colors cursor-pointer"
                    >
                      <Play aria-hidden="true" className="h-4 w-4" />
                      <span>🎯 Fire Query Vector (Run #{d2PulseCount})</span>
                    </button>

                    <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                      <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
                        <span className="block text-[9px] text-slate-400">
                          DISTANCE EVALS / HOPS
                        </span>
                        <span
                          className={`text-base font-bold ${
                            d2Mode === 'brute-force'
                              ? 'text-rose-400'
                              : 'text-emerald-400'
                          }`}
                        >
                          {d2Stats.distanceComputations} evals ({d2Stats.hops} hops)
                        </span>
                      </div>
                      <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
                        <span className="block text-[9px] text-slate-400">
                          QUERY LATENCY &amp; RECALL@10
                        </span>
                        <span className="text-base font-bold text-cyan-400">
                          {d2Stats.latencyMs} ms · {d2Stats.recallAt10}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3-Layer HNSW SVG Hierarchical Graph Visualizer */}
                <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-slate-950/90 p-4">
                  <span className="block font-mono text-xs font-bold uppercase text-cyan-400 mb-3">
                    3-Layer Hierarchical Navigable Small World (HNSW) Traversal
                  </span>
                  <div className="space-y-3">
                    {[
                      {
                        layer: 2,
                        title: 'Layer 2 · Coarse Entry Highway (Long-Range Skip Edges)',
                        totalNodes: 6,
                      },
                      {
                        layer: 1,
                        title: 'Layer 1 · Intermediate Navigable Delone Graph',
                        totalNodes: 12,
                      },
                      {
                        layer: 0,
                        title: 'Layer 0 · Base Dense Vector Manifold (Top-K Neighbors)',
                        totalNodes: 24,
                      },
                    ].map((layerSpec) => {
                      const visited =
                        d2Stats.visitedLayerNodes.find(
                          (l) => l.layer === layerSpec.layer
                        )?.nodeIds || [];
                      return (
                        <div
                          key={`${layerSpec.layer}-${d2PulseCount}`}
                          className="rounded-xl border border-slate-800 bg-slate-900/75 p-3"
                        >
                          <div className="flex items-center justify-between font-mono text-[11px] mb-2">
                            <span className="font-bold text-slate-200">
                              {layerSpec.title}
                            </span>
                            <span className="text-cyan-400">
                              {visited.length} nodes visited
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {Array.from(
                              { length: layerSpec.totalNodes },
                              (_, i) => i + 1
                            ).map((nodeId) => {
                              const isVisited = visited.includes(nodeId);
                              return (
                                <span
                                  key={nodeId}
                                  className={`inline-flex h-7 w-7 items-center justify-center rounded-lg font-mono text-[10px] font-bold transition-all ${
                                    isVisited
                                      ? d2Mode === 'brute-force'
                                        ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                                        : 'bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/40 scale-105'
                                      : 'border border-slate-800 bg-slate-950 text-slate-500'
                                  }`}
                                >
                                  v{nodeId}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ==================== LAB 3: TRAINING FOUNDRY (DEEPSPEED ZERO & QLORA) ==================== */}
            {districtId === 'training-cluster' && (
              <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                  <div>
                    <span className="font-mono text-xs font-bold uppercase text-violet-400">
                      30B Parameter Model Training across 4× 80GB H100 GPUs
                    </span>
                    <p className="text-xs text-slate-300 mt-1">
                      {d3Stats.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(
                      [
                        { id: 'ddp', label: 'Standard DDP' },
                        { id: 'zero-1', label: 'ZeRO-1 (Opt)' },
                        { id: 'zero-2', label: 'ZeRO-2 (Opt+Grad)' },
                        { id: 'zero-3', label: 'ZeRO-3 (Full Shard)' },
                        { id: 'qlora', label: 'QLoRA 4-bit NF4' },
                      ] as { id: ZeroShardingStage; label: string }[]
                    ).map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setD3Stage(st.id)}
                        className={`rounded-xl px-3 py-1.5 font-mono text-xs font-semibold cursor-pointer ${
                          d3Stage === st.id
                            ? 'bg-violet-500 text-white font-bold'
                            : 'bg-slate-900 text-slate-300 hover:text-white'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4x GPU Vertical Memory Bars */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[0, 1, 2, 3].map((gpuIdx) => (
                    <div
                      key={gpuIdx}
                      className={`rounded-2xl border p-4 font-mono ${
                        d3Stats.isOomOn80Gb
                          ? 'border-rose-500/70 bg-rose-950/20'
                          : 'border-emerald-500/50 bg-slate-950/80'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-bold text-white">
                          GPU #{gpuIdx} (H100 80GB)
                        </span>
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                            d3Stats.isOomOn80Gb
                              ? 'bg-rose-500 text-white'
                              : 'bg-emerald-500/20 text-emerald-300'
                          }`}
                        >
                          {d3Stats.totalPerGpuGb} / 80 GB
                        </span>
                      </div>

                      <div className="space-y-2 text-[11px] mt-3">
                        <div className="flex justify-between rounded-lg bg-cyan-500/15 px-2.5 py-1.5 text-cyan-300">
                          <span>Weights (Params):</span>
                          <span className="font-bold">{d3Stats.paramsGb} GB</span>
                        </div>
                        <div className="flex justify-between rounded-lg bg-fuchsia-500/15 px-2.5 py-1.5 text-fuchsia-300">
                          <span>FP16 Gradients:</span>
                          <span className="font-bold">
                            {d3Stats.gradientsGb} GB
                          </span>
                        </div>
                        <div className="flex justify-between rounded-lg bg-amber-500/15 px-2.5 py-1.5 text-amber-300">
                          <span>FP32 Adam States:</span>
                          <span className="font-bold">
                            {d3Stats.optimizerGb} GB
                          </span>
                        </div>
                        {d3Stats.loraAdapterGb > 0 && (
                          <div className="flex justify-between rounded-lg bg-emerald-500/20 px-2.5 py-1.5 text-emerald-300">
                            <span>LoRA Rank (r=16):</span>
                            <span className="font-bold">
                              {d3Stats.loraAdapterGb} GB
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ==================== LAB 4: MODEL CORE (SPARSE MOE TOP-K ROUTER) ==================== */}
            {districtId === 'model-core' && (
              <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold uppercase text-purple-400">
                      Input Token Stream:
                    </span>
                    {(
                      [
                        { id: 'code', label: 'Code Snippet' },
                        { id: 'math', label: 'Math Proof' },
                        { id: 'multimodal', label: 'Multimodal Caption' },
                      ] as { id: MoeStreamPresetId; label: string }[]
                    ).map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setD4Stream(s.id)}
                        className={`rounded-xl px-3 py-1.5 font-mono text-xs cursor-pointer ${
                          d4Stream === s.id
                            ? 'bg-cyan-400 text-slate-950 font-bold'
                            : 'bg-slate-900 text-slate-300'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => setD4Mode('dense-8')}
                      className={`rounded-xl px-3 py-1.5 font-mono text-xs cursor-pointer ${
                        d4Mode === 'dense-8'
                          ? 'bg-amber-400 text-slate-950 font-bold'
                          : 'bg-slate-900 text-slate-300'
                      }`}
                    >
                      Dense (8/8 Experts)
                    </button>
                    <button
                      type="button"
                      onClick={() => setD4Mode('sparse-top2')}
                      className={`rounded-xl px-3 py-1.5 font-mono text-xs cursor-pointer ${
                        d4Mode === 'sparse-top2'
                          ? 'bg-purple-500 text-white font-bold'
                          : 'bg-slate-900 text-slate-300'
                      }`}
                    >
                      Sparse MoE (Top-2/8)
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3.5">
                    <span className="block text-[10px] text-slate-400">
                      ACTIVE PARAMETERS PER TOKEN
                    </span>
                    <span className="text-lg font-bold text-cyan-400">
                      {d4Stats.activeParamsB}B / {d4Stats.totalParamsB}B Total
                    </span>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3.5">
                    <span className="block text-[10px] text-slate-400">
                      COMPUTE FLOPS SAVED
                    </span>
                    <span className="text-lg font-bold text-emerald-400">
                      -{d4Stats.flopsSavedPercent}% FLOPs
                    </span>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3.5">
                    <span className="block text-[10px] text-slate-400">
                      AUX LOAD-BALANCING LOSS
                    </span>
                    <span className="text-lg font-bold text-amber-400">
                      L_aux = {d4Stats.auxLoadBalanceLoss}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {d4Stats.experts.map((exp) => (
                    <div
                      key={exp.expertId}
                      className={`rounded-2xl border p-3.5 font-mono transition-all ${
                        exp.isSelected
                          ? 'border-purple-400 bg-purple-950/35 shadow-lg shadow-purple-500/20'
                          : 'border-slate-800 bg-slate-950/50 opacity-55'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white">
                          {exp.specialty}
                        </span>
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                            exp.isSelected
                              ? 'bg-emerald-400 text-slate-950'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {(exp.probability * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="mt-2 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-400 to-purple-400"
                          style={{ width: `${exp.probability * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ==================== LAB 5: INFERENCE ENGINE (VLLM PAGEDATTENTION) ==================== */}
            {districtId === 'inference-center' && (
              <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setD5Mode('contiguous')}
                      className={`rounded-xl px-3 py-1.5 font-mono text-xs cursor-pointer ${
                        d5Mode === 'contiguous'
                          ? 'bg-rose-500 text-white font-bold'
                          : 'bg-slate-900 text-slate-300'
                      }`}
                    >
                      Contiguous Traditional KV-Cache
                    </button>
                    <button
                      type="button"
                      onClick={() => setD5Mode('paged-attention')}
                      className={`rounded-xl px-3 py-1.5 font-mono text-xs cursor-pointer ${
                        d5Mode === 'paged-attention'
                          ? 'bg-cyan-400 text-slate-950 font-bold'
                          : 'bg-slate-900 text-slate-300'
                      }`}
                    >
                      vLLM PagedAttention (Non-Contiguous)
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                    <button
                      type="button"
                      onClick={() =>
                        setD5Requests((r) => Math.max(1, r - 1))
                      }
                      className="rounded-xl border border-slate-700 bg-slate-900 p-1.5 text-slate-200 hover:border-cyan-400 cursor-pointer"
                    >
                      <Minus aria-hidden="true" className="h-3.5 w-3.5" />
                    </button>
                    <span className="px-2 font-bold text-cyan-300">
                      {d5Requests} Concurrent Requests
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setD5Requests((r) => Math.min(14, r + 1))
                      }
                      className="inline-flex items-center gap-1 rounded-xl bg-cyan-400 px-3 py-1.5 font-bold text-slate-950 hover:bg-cyan-300 cursor-pointer"
                    >
                      <Plus aria-hidden="true" className="h-3.5 w-3.5" />
                      <span>Spawn Concurrent Request</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setD5PrefixSharing((p) => !p)}
                      className={`inline-flex items-center gap-1 rounded-xl border px-3 py-1.5 cursor-pointer ${
                        d5PrefixSharing
                          ? 'border-amber-400 bg-amber-500/20 text-amber-300 font-bold'
                          : 'border-slate-700 bg-slate-900 text-slate-400'
                      }`}
                    >
                      <Zap aria-hidden="true" className="h-3.5 w-3.5" />
                      <span>Prefix Sharing: {d5PrefixSharing ? 'ON' : 'OFF'}</span>
                    </button>
                  </div>
                </div>

                {/* 64-Block Physical GPU HBM Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  <div className="lg:col-span-8 rounded-2xl border border-slate-800 bg-slate-950 p-4">
                    <div className="flex items-center justify-between font-mono text-xs mb-3">
                      <span className="font-bold text-cyan-400 uppercase">
                        64-Block Physical GPU HBM Grid (16 Tokens / Block)
                      </span>
                      <span
                        className={`font-bold ${
                          d5Stats.isOom ? 'text-rose-400' : 'text-emerald-400'
                        }`}
                      >
                        {d5Stats.isOom
                          ? '⚠ KV-CACHE OOM (MAX CAPACITY EXCEEDED)'
                          : '✓ ZERO OOM · OPTIMAL PAGING'}
                      </span>
                    </div>

                    <div className="grid grid-cols-8 gap-1.5">
                      {d5Stats.blocks.map((state, idx) => (
                        <div
                          key={idx}
                          className={`rounded-lg border p-2 text-center font-mono text-[10px] font-bold ${
                            state === 'active'
                              ? 'border-cyan-400 bg-cyan-500/25 text-cyan-200'
                              : state === 'shared-prefix'
                              ? 'border-amber-400 bg-amber-500/30 text-amber-200'
                              : state === 'internal-frag'
                              ? 'border-rose-500/60 bg-rose-950/60 text-rose-300'
                              : state === 'external-frag'
                              ? 'border-orange-500/60 bg-orange-950/60 text-orange-300'
                              : 'border-slate-800 bg-slate-900/50 text-slate-600'
                          }`}
                        >
                          B{idx}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-4 space-y-3 font-mono text-xs">
                    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                      <span className="block text-[10px] text-slate-400">
                        FRAGMENTATION / WASTED VRAM
                      </span>
                      <span
                        className={`text-2xl font-bold ${
                          d5Mode === 'contiguous'
                            ? 'text-rose-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        {d5Stats.wastedVramPercent}% Wasted
                      </span>
                    </div>
                    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                      <span className="block text-[10px] text-slate-400">
                        MAX CONCURRENT SEQUENCES FIT
                      </span>
                      <span className="text-2xl font-bold text-cyan-400">
                        {d5Stats.maxConcurrentFit} Sequences
                      </span>
                    </div>
                    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-1.5 text-[11px]">
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded bg-cyan-400 inline-block" />
                        <span>Active Token Page</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded bg-amber-400 inline-block" />
                        <span>Copy-on-Write Shared Prefix</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded bg-rose-500 inline-block" />
                        <span>Internal/External Fragmentation</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ==================== LAB 6: AGENTIC & MCP STATE MACHINE ==================== */}
            {districtId === 'nlp-district' && (
              <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <button
                      type="button"
                      onClick={() => setD6Step((s) => (s + 1) % 4)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-400 px-3.5 py-2 font-bold text-slate-950 hover:bg-cyan-300 cursor-pointer"
                    >
                      <ChevronRight aria-hidden="true" className="h-4 w-4" />
                      <span>Step Forward (State {d6Step + 1}/4)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setD6Step(0)}
                      className="inline-flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-slate-300 hover:text-white cursor-pointer"
                    >
                      <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" />
                      <span>Reset</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setD6InjectError((e) => !e)}
                    className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 font-mono text-xs font-bold cursor-pointer ${
                      d6InjectError
                        ? 'border-rose-500 bg-rose-500 text-white'
                        : 'border-slate-700 bg-slate-900 text-slate-300'
                    }`}
                  >
                    <AlertTriangle aria-hidden="true" className="h-3.5 w-3.5" />
                    <span>
                      Inject Tool Error: {d6InjectError ? 'ACTIVE' : 'OFF'}
                    </span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  {mcpStates.map((st) => {
                    const active = st.step === d6Step;
                    return (
                      <button
                        key={st.step}
                        type="button"
                        onClick={() => setD6Step(st.step)}
                        className={`rounded-2xl border p-4 text-left font-mono transition-all cursor-pointer ${
                          active
                            ? 'border-cyan-400 bg-cyan-950/30 shadow-lg shadow-cyan-500/20'
                            : 'border-slate-800 bg-slate-950/70'
                        }`}
                      >
                        <span className="text-[10px] text-amber-400 font-bold">
                          STEP 0{st.step + 1} · {st.protocol}
                        </span>
                        <h4 className="mt-1 text-xs font-bold text-white">
                          {st.node}
                        </h4>
                        <pre className="mt-2 whitespace-pre-wrap break-words rounded-xl bg-slate-900 p-2 text-[10px] text-cyan-200">
                          {st.payload}
                        </pre>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ==================== LAB 7: GUARDRAILS & RAGAS FAITHFULNESS ==================== */}
            {districtId === 'computer-vision' && (
              <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setD7Mode('grounded')}
                      className={`rounded-xl px-3.5 py-2 font-mono text-xs font-bold cursor-pointer ${
                        d7Mode === 'grounded'
                          ? 'bg-emerald-400 text-slate-950'
                          : 'bg-slate-900 text-slate-300'
                      }`}
                    >
                      ✓ Grounded Response (Faithfulness = 1.00)
                    </button>
                    <button
                      type="button"
                      onClick={() => setD7Mode('hallucinated')}
                      className={`rounded-xl px-3.5 py-2 font-mono text-xs font-bold cursor-pointer ${
                        d7Mode === 'hallucinated'
                          ? 'bg-rose-500 text-white'
                          : 'bg-slate-900 text-slate-300'
                      }`}
                    >
                      ⚠ Hallucinated Response (Faithfulness = 0.33)
                    </button>
                  </div>

                  <div className="font-mono text-xs">
                    <span className="rounded-xl border border-cyan-500/40 bg-cyan-500/15 px-3 py-1.5 font-bold text-cyan-300">
                      Faithfulness = {d7Stats.groundedCount} /{' '}
                      {d7Stats.totalClaims} = {d7Stats.faithfulnessScore.toFixed(2)}{' '}
                      ({d7Stats.guardrailAction})
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs">
                  <span className="block text-[10px] font-bold uppercase text-amber-400">
                    Retrieved Ground-Truth Context Passage:
                  </span>
                  <p className="mt-1 text-slate-200">{d7Stats.contextPassage}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {d7Stats.claims.map((c) => (
                    <div
                      key={c.id}
                      className={`rounded-2xl border p-4 font-mono text-xs ${
                        c.entailment === 'supported'
                          ? 'border-emerald-500/60 bg-emerald-950/20'
                          : 'border-rose-500/80 bg-rose-950/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold uppercase text-[10px]">
                          ATOMIC CLAIM #{c.id.toUpperCase()}
                        </span>
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                            c.entailment === 'supported'
                              ? 'bg-emerald-400 text-slate-950'
                              : 'bg-rose-500 text-white'
                          }`}
                        >
                          {c.entailment}
                        </span>
                      </div>
                      <p className="mt-2 font-bold text-white">{c.claimText}</p>
                      <p className="mt-1.5 text-[11px] text-slate-300">
                        NLI Evidence: {c.evidenceSnippet}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ==================== LAB 8: OUTPUT & SSE CANARY ROUTER ==================== */}
            {districtId === 'output-terminal' && (
              <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-4 font-mono text-xs">
                  <div className="flex-1 min-w-[240px]">
                    <div className="flex justify-between mb-1">
                      <span>
                        Envoy Canary Split: Production v1.0 ({100 - canaryPercent}
                        %) vs. Canary v1.1 ({canaryPercent}%)
                      </span>
                      <span className="font-bold text-amber-400">
                        {canaryPercent}% Canary
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={50}
                      step={5}
                      value={canaryPercent}
                      onChange={(e) => setCanaryPercent(Number(e.target.value))}
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setSemanticCacheHit((s) => !s)}
                    className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 font-bold cursor-pointer ${
                      semanticCacheHit
                        ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300'
                        : 'border-slate-700 bg-slate-900 text-slate-400'
                    }`}
                  >
                    <ShieldCheck aria-hidden="true" className="h-4 w-4" />
                    <span>
                      Redis Semantic Cache: {semanticCacheHit ? 'HIT (6.4ms)' : 'OFF'}
                    </span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                    <span className="block text-[10px] text-slate-400">
                      TIME-TO-FIRST-TOKEN (TTFT)
                    </span>
                    <span className="text-2xl font-bold text-cyan-400">
                      {d8TtftMs} ms
                    </span>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                    <span className="block text-[10px] text-slate-400">
                      INTER-TOKEN LATENCY (ITL)
                    </span>
                    <span className="text-2xl font-bold text-emerald-400">
                      {d8ItlMs} ms / token
                    </span>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                    <span className="block text-[10px] text-slate-400">
                      SSE STREAMING WATERFALL
                    </span>
                    <span className="text-sm font-bold text-amber-400">
                      data: {'{"token":"kingfisher","p99_ok":true}'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
