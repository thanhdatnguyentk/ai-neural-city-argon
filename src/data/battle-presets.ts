import type { DistrictId } from './districts';
import type { StackSelectionMap } from './stack-catalog';
import { getSelectedOptionForDistrict } from './stack-catalog.ts';
import type { LanguageCode } from './locales';

export interface BattleContenderSpec {
  name: string;
  badge: string;
  stackSummary: string;
  ttftMs: number;
  p99LatencyMs: number;
  throughputRps: number;
  peakVramGb: number;
  unitCostPer1M: number;
  /** Per-district stage latency in ms across all 8 districts */
  stageLatenciesMs: Record<DistrictId, number>;
}

export interface BattlePreset {
  id: string;
  numberBadge: string;
  title: Record<LanguageCode, string>;
  stressWorkload: string;
  contenderA: BattleContenderSpec;
  contenderB: BattleContenderSpec;
  engineeringPostMortem: {
    districtId: DistrictId;
    code: string;
    bottleneckEliminated: string;
    speedupFactor: string;
  }[];
}

export const BATTLE_PRESETS: BattlePreset[] = [
  {
    id: 'battle-01-multimodal-retrieval',
    numberBadge: 'BATTLE 01',
    title: {
      en: 'Multimodal Video & Image Retrieval at Scale',
      vi: 'Truy Xuất Video & Ảnh Đa Phương Thức Quy Mô Lớn',
      ja: '大規模マルチモーダル映像・画像検索ベンチマーク対決',
    },
    stressWorkload: '1,000 Concurrent Image/Video Queries over 2M Vectors',
    contenderA: {
      name: 'Contender A · Naive Baseline',
      badge: 'Sync REST + Exact k-NN + PyTorch FP32',
      stackSummary:
        'Python Sync Flask REST + Flat Exact O(N) Vector Scan + Uncompiled PyTorch Eager FP32',
      ttftMs: 420,
      p99LatencyMs: 685,
      throughputRps: 18,
      peakVramGb: 64.0,
      unitCostPer1M: 14.2,
      stageLatenciesMs: {
        'input-gateway': 45,
        'data-lake': 380,
        'training-cluster': 15,
        'model-core': 95,
        'inference-center': 110,
        'nlp-district': 15,
        'computer-vision': 15,
        'output-terminal': 10,
      },
    },
    contenderB: {
      name: 'Contender B · Optimized Production',
      badge: 'FastAPI/gRPC + FAISS/Milvus HNSW + Triton ONNX FP16',
      stackSummary:
        'gRPC Async Ingress + FAISS/Milvus HNSW + Elasticsearch BM25 RRF + Triton ONNX Runtime FP16',
      ttftMs: 12,
      p99LatencyMs: 18.4,
      throughputRps: 340,
      peakVramGb: 18.5,
      unitCostPer1M: 1.65,
      stageLatenciesMs: {
        'input-gateway': 1.2,
        'data-lake': 4.2,
        'training-cluster': 1.0,
        'model-core': 4.5,
        'inference-center': 3.8,
        'nlp-district': 1.2,
        'computer-vision': 1.5,
        'output-terminal': 1.0,
      },
    },
    engineeringPostMortem: [
      {
        districtId: 'data-lake',
        code: 'D2 · Vector Vault',
        bottleneckEliminated:
          'Replaced O(N) flat brute-force cosine scan (380ms) with HNSW logarithmic graph traversal + BM25 RRF (4.2ms).',
        speedupFactor: '90.4x Faster Retrieval',
      },
      {
        districtId: 'inference-center',
        code: 'D5 · Inference Engine',
        bottleneckEliminated:
          'Compiled PyTorch Eager FP32 encoders into FP16 ONNX Runtime graphs served via Triton Dynamic Batching.',
        speedupFactor: '28.9x Lower Serving Latency',
      },
      {
        districtId: 'input-gateway',
        code: 'D1 · Input Gateway',
        bottleneckEliminated:
          'Eliminated Python GIL blocking via async gRPC HTTP/2 protobuf streaming.',
        speedupFactor: '37.5x Faster Ingress',
      },
    ],
  },
  {
    id: 'battle-02-llm-serving',
    numberBadge: 'BATTLE 02',
    title: {
      en: 'High-Concurrency LLM & Vision Serving',
      vi: 'Phục Vụ Mô Hình LLM & Thị Giác Chịu Tải Đồng Thời Cao',
      ja: '高並列LLM・ビジョン推論サービング対決',
    },
    stressWorkload: '500 Concurrent Users · 16K Context Window',
    contenderA: {
      name: 'Contender A · Legacy Serving',
      badge: 'HF Pipeline FP16 + Contiguous KV + Static Batch',
      stackSummary:
        'HuggingFace Pipeline FP16 + Contiguous Pre-Allocated KV-Cache + Static Batching',
      ttftMs: 480,
      p99LatencyMs: 890,
      throughputRps: 14,
      peakVramGb: 78.4,
      unitCostPer1M: 18.5,
      stageLatenciesMs: {
        'input-gateway': 25,
        'data-lake': 30,
        'training-cluster': 20,
        'model-core': 240,
        'inference-center': 520,
        'nlp-district': 20,
        'computer-vision': 20,
        'output-terminal': 15,
      },
    },
    contenderB: {
      name: 'Contender B · vLLM + TensorRT-LLM',
      badge: 'PagedAttention + INT4 AWQ + Continuous Batching',
      stackSummary:
        'vLLM / TensorRT-LLM + Non-Contiguous PagedAttention + INT4 AWQ + Iteration-Level Batching',
      ttftMs: 28,
      p99LatencyMs: 42.0,
      throughputRps: 310,
      peakVramGb: 21.6,
      unitCostPer1M: 1.85,
      stageLatenciesMs: {
        'input-gateway': 2.0,
        'data-lake': 4.5,
        'training-cluster': 2.0,
        'model-core': 12.0,
        'inference-center': 14.5,
        'nlp-district': 2.5,
        'computer-vision': 2.5,
        'output-terminal': 2.0,
      },
    },
    engineeringPostMortem: [
      {
        districtId: 'inference-center',
        code: 'D5 · Inference Engine',
        bottleneckEliminated:
          'Eliminated 58% contiguous KV-Cache fragmentation via vLLM PagedAttention + Continuous Batching.',
        speedupFactor: '35.8x Faster Decode',
      },
      {
        districtId: 'model-core',
        code: 'D4 · Model Core',
        bottleneckEliminated:
          'Applied Activation-aware Weight Quantization (INT4 AWQ) + Grouped-Query Attention (GQA), saving 72% VRAM.',
        speedupFactor: '-72% Peak VRAM',
      },
    ],
  },
  {
    id: 'battle-03-agentic-rag',
    numberBadge: 'BATTLE 03',
    title: {
      en: 'Enterprise Agentic RAG & Guardrail Reliability',
      vi: 'Hệ Thống Agentic RAG Doanh Nghiệp & Kiểm Định An Toàn',
      ja: 'エンタープライズAgentic RAG＆ガードレール信頼性対決',
    },
    stressWorkload: '250 Complex Multi-Step Analytical Queries',
    contenderA: {
      name: 'Contender A · Monolithic Prompt',
      badge: 'Stuffed Context + Unvalidated Output + No Cache',
      stackSummary:
        'Monolithic 64K Prompt Stuffing + Naive Tool Parsing + Zero Semantic Caching',
      ttftMs: 610,
      p99LatencyMs: 1120,
      throughputRps: 9,
      peakVramGb: 72.0,
      unitCostPer1M: 24.0,
      stageLatenciesMs: {
        'input-gateway': 35,
        'data-lake': 280,
        'training-cluster': 15,
        'model-core': 310,
        'inference-center': 240,
        'nlp-district': 160,
        'computer-vision': 60,
        'output-terminal': 20,
      },
    },
    contenderB: {
      name: 'Contender B · MCP + Hybrid RAG + RAGAS',
      badge: 'MCP LangGraph + pgvector HNSW + Semantic Cache',
      stackSummary:
        'Model Context Protocol (MCP) + pgvector HNSW + Cross-Encoder + RAGAS Guard + Redis Cache',
      ttftMs: 34,
      p99LatencyMs: 68.0,
      throughputRps: 215,
      peakVramGb: 24.0,
      unitCostPer1M: 2.1,
      stageLatenciesMs: {
        'input-gateway': 3.0,
        'data-lake': 8.5,
        'training-cluster': 2.0,
        'model-core': 18.0,
        'inference-center': 14.0,
        'nlp-district': 12.5,
        'computer-vision': 7.5,
        'output-terminal': 2.5,
      },
    },
    engineeringPostMortem: [
      {
        districtId: 'nlp-district',
        code: 'D6 · Agentic & Memory',
        bottleneckEliminated:
          'Replaced brittle regex tool parsing and 64K prompt stuffing with deterministic MCP JSON-RPC 2.0 + Redis Semantic Cache.',
        speedupFactor: '12.8x Faster Tool Loop',
      },
      {
        districtId: 'computer-vision',
        code: 'D7 · Guardrails & Eval',
        bottleneckEliminated:
          'Added automated RAGAS Faithfulness > 0.92 verification and Pydantic JSON-Schema constrained decoding.',
        speedupFactor: '-78% Hallucinations',
      },
    ],
  },
];

export function buildCustomStackBattlePreset(
  selections: StackSelectionMap
): BattlePreset {
  const d1 = getSelectedOptionForDistrict('input-gateway', selections);
  const d2 = getSelectedOptionForDistrict('data-lake', selections);
  const d3 = getSelectedOptionForDistrict('training-cluster', selections);
  const d4 = getSelectedOptionForDistrict('model-core', selections);
  const d5 = getSelectedOptionForDistrict('inference-center', selections);
  const d6 = getSelectedOptionForDistrict('nlp-district', selections);
  const d7 = getSelectedOptionForDistrict('computer-vision', selections);
  const d8 = getSelectedOptionForDistrict('output-terminal', selections);

  const stageLatenciesMs: Record<DistrictId, number> = {
    'input-gateway': Math.max(0.8, d1.latencyDeltaMs),
    'data-lake': Math.max(1.5, d2.latencyDeltaMs),
    'training-cluster': 1.5,
    'model-core': Math.max(3.5, d4.latencyDeltaMs),
    'inference-center': Math.max(2.2, d5.latencyDeltaMs),
    'nlp-district': Math.max(1.5, d6.latencyDeltaMs),
    'computer-vision': Math.max(1.8, d7.latencyDeltaMs),
    'output-terminal': Math.max(0.8, d8.latencyDeltaMs),
  };

  const p99LatencyMs = Number(
    Object.values(stageLatenciesMs)
      .reduce((a, b) => a + b, 4.0)
      .toFixed(1)
  );
  const ttftMs = Math.round(p99LatencyMs * 0.58);
  const peakVramGb = Number(
    [d1, d2, d3, d4, d5, d6, d7, d8]
      .reduce((s, o) => s + o.vramImpactGb, 0)
      .toFixed(1)
  );
  const avgMult =
    [d1, d2, d3, d4, d5, d6, d7, d8].reduce(
      (s, o) => s + o.throughputMultiplier,
      0
    ) / 8;
  const throughputRps = Math.round(210 * avgMult);

  return {
    id: 'battle-04-custom-stack',
    numberBadge: 'CUSTOM STACK VS BASELINE',
    title: {
      en: 'Your Custom Stack Builder Config vs. Legacy Baseline',
      vi: 'Cấu Hình Stack Tùy Chỉnh Của Bạn vs. Hệ Thống Cũ (Baseline)',
      ja: 'カスタムStack Builder構成 vs. レガシーベースライン対決',
    },
    stressWorkload: '500 Concurrent Multimodal + Agentic Requests',
    contenderA: BATTLE_PRESETS[0].contenderA,
    contenderB: {
      name: 'Contender B · Your Custom Stack',
      badge: `${d1.shortLabel} + ${d2.shortLabel} + ${d5.shortLabel}`,
      stackSummary: `${d1.name} → ${d2.name} → ${d4.name} → ${d5.name} → ${d6.name}`,
      ttftMs,
      p99LatencyMs,
      throughputRps,
      peakVramGb,
      unitCostPer1M: Number((2.4 / avgMult).toFixed(2)),
      stageLatenciesMs,
    },
    engineeringPostMortem: [
      {
        districtId: 'data-lake',
        code: 'D2 · Vector Vault',
        bottleneckEliminated: `Configured ${d2.name} (${d2.protocolBadge}), eliminating O(N) unindexed scans.`,
        speedupFactor: `${(380 / stageLatenciesMs['data-lake']).toFixed(1)}x Faster`,
      },
      {
        districtId: 'inference-center',
        code: 'D5 · Inference Engine',
        bottleneckEliminated: `Accelerated serving via ${d5.name} (${d5.protocolBadge}).`,
        speedupFactor: `${(110 / stageLatenciesMs['inference-center']).toFixed(1)}x Faster`,
      },
    ],
  };
}
