import type { DistrictId } from '../data/districts';
import type { LanguageCode } from '../data/locales';

export type TokenizerMode = 'word' | 'bpe' | 'byte';
export type VectorSearchMode = 'brute-force' | 'hnsw';
export type ZeroShardingStage = 'ddp' | 'zero-1' | 'zero-2' | 'zero-3' | 'qlora';
export type MoeRoutingMode = 'dense-8' | 'sparse-top2';
export type MoeStreamPresetId = 'code' | 'math' | 'multimodal';
export type KvAllocatorMode = 'contiguous' | 'paged-attention';
export type RagasResponseMode = 'grounded' | 'hallucinated';

export interface MicroLabMetadata {
  districtId: DistrictId;
  code: string;
  labTitle: Record<LanguageCode, string>;
  algorithmFocus: string;
  accentColor: string;
}

export const MICRO_LAB_METADATA: Record<DistrictId, MicroLabMetadata> = {
  'input-gateway': {
    districtId: 'input-gateway',
    code: 'LAB-01 · D1',
    labTitle: {
      en: 'Multimodal BPE Tokenizer & ViT 16×16 Patch Inspector',
      vi: 'Bộ Tách Từ BPE Đa Phương Thức & Lưới Patch ViT 16×16',
      ja: 'マルチモーダルBPEトークナイザ＆ViT 16×16パッチ解析ラボ',
    },
    algorithmFocus: 'Byte-Pair Encoding (BPE) + Vision Transformer Linear Patch Projection + RoPE-2D',
    accentColor: '#00F0FF',
  },
  'data-lake': {
    districtId: 'data-lake',
    code: 'LAB-02 · D2',
    labTitle: {
      en: 'HNSW Multi-Layer Graph Traversal vs. Brute-Force k-NN',
      vi: 'Duyệt Đồ Thị Đa Tầng HNSW vs. Quét Vét Cạn Brute-Force k-NN',
      ja: 'HNSW多層グラフ探索 vs. 総当たりk-NN検索ラボ',
    },
    algorithmFocus: 'Hierarchical Navigable Small World (HNSW) O(log N) Greedy Routing',
    accentColor: '#00F0FF',
  },
  'training-cluster': {
    districtId: 'training-cluster',
    code: 'LAB-03 · D3',
    labTitle: {
      en: 'DeepSpeed ZeRO (Stages 1/2/3) & QLoRA Memory Sharding',
      vi: 'Phân Mảnh Bộ Nhớ DeepSpeed ZeRO (1/2/3) & Tinh Chỉnh QLoRA',
      ja: 'DeepSpeed ZeRO (Stage 1/2/3) ＆ QLoRAメモリシャーディングラボ',
    },
    algorithmFocus: 'Optimizer, Gradient & Parameter Partitioning + 4-bit NF4 Low-Rank Adapters',
    accentColor: '#8B5CF6',
  },
  'model-core': {
    districtId: 'model-core',
    code: 'LAB-04 · D4',
    labTitle: {
      en: 'Sparse Mixture-of-Experts (MoE) Top-K Token Router',
      vi: 'Bộ Định Tuyến Token Sparse Mixture-of-Experts (MoE) Top-K',
      ja: '疎結合Mixture-of-Experts (MoE) Top-Kトークンルーターラボ',
    },
    algorithmFocus: 'Softmax(x · W_g) Top-2 Gating + Auxiliary Load-Balancing Loss',
    accentColor: '#A855F7',
  },
  'inference-center': {
    districtId: 'inference-center',
    code: 'LAB-05 · D5',
    labTitle: {
      en: 'vLLM PagedAttention KV-Cache Block Allocator',
      vi: 'Bộ Cấp Phát Khối KV-Cache Không Liên Tục vLLM PagedAttention',
      ja: 'vLLM PagedAttention 非連続KVキャッシュブロック割り当てラボ',
    },
    algorithmFocus: 'Virtual Block Table Paging + Copy-on-Write Shared Prefix Caching',
    accentColor: '#EC4899',
  },
  'nlp-district': {
    districtId: 'nlp-district',
    code: 'LAB-06 · D6',
    labTitle: {
      en: 'Model Context Protocol (MCP) & ReAct State Machine Inspector',
      vi: 'Trình Gỡ Lỗi Máy Trạng Thái Tác Tử ReAct & Giao Thức MCP',
      ja: 'Model Context Protocol (MCP) ＆ ReAct状態機械デバッガ',
    },
    algorithmFocus: 'JSON-RPC 2.0 Tool Invocation Loop + Self-Healing Error Recovery',
    accentColor: '#38BDF8',
  },
  'computer-vision': {
    districtId: 'computer-vision',
    code: 'LAB-07 · D7',
    labTitle: {
      en: 'RAGAS Faithfulness Verifier & Guardrail NLI Shield',
      vi: 'Bộ Kiểm Định Độ Trung Thực RAGAS & Khiên Chắn NLI Guardrails',
      ja: 'RAGAS忠実度検証（Faithfulness）＆ガードレールNLIシールド',
    },
    algorithmFocus: 'Atomic Claim Decomposition + Natural Language Inference (NLI) Entailment',
    accentColor: '#38BDF8',
  },
  'output-terminal': {
    districtId: 'output-terminal',
    code: 'LAB-08 · D8',
    labTitle: {
      en: 'SSE Token Streaming & Canary Traffic Router',
      vi: 'Phân Phối Token SSE Thời Gian Thực & Định Tuyến Canary',
      ja: 'SSEトークンストリーミング＆カナリアトラフィックルーター',
    },
    algorithmFocus: 'Server-Sent Events (SSE) Waterfall + Redis Semantic Cache + Canary Split',
    accentColor: '#F59E0B',
  },
};

// ============================================================================
// 1. D1: Tokenizer & ViT 16x16 Patch Math
// ============================================================================
export interface TokenChip {
  text: string;
  tokenId: number;
  colorHex: string;
}

const TOKEN_COLORS = [
  '#00F0FF',
  '#38BDF8',
  '#8B5CF6',
  '#EC4899',
  '#F59E0B',
  '#10B981',
];

export function tokenizeTextSample(
  input: string,
  mode: TokenizerMode
): {
  tokens: TokenChip[];
  charCount: number;
  tokenCount: number;
  charsPerToken: number;
} {
  const clean = input.trim() || 'AI Neural City: Truy xuất đa phương thức 30ms';
  const rawParts: string[] = [];

  if (mode === 'word') {
    rawParts.push(...clean.split(/(\s+|[.,!?;:()])/).filter(Boolean));
  } else if (mode === 'byte') {
    const encoder = new TextEncoder();
    const bytes = Array.from(encoder.encode(clean)).slice(0, 36);
    bytes.forEach((b) => rawParts.push(`0x${b.toString(16).toUpperCase()}`));
  } else {
    // Subword BPE simulation
    const words = clean.split(/(\s+)/).filter(Boolean);
    for (const w of words) {
      if (w.length <= 4) {
        rawParts.push(w);
      } else {
        rawParts.push(w.slice(0, Math.ceil(w.length * 0.55)));
        rawParts.push('##' + w.slice(Math.ceil(w.length * 0.55)));
      }
    }
  }

  const tokens: TokenChip[] = rawParts.map((part, idx) => {
    let hash = 1024;
    for (let i = 0; i < part.length; i++) {
      hash = (hash * 31 + part.charCodeAt(i)) % 128000;
    }
    return {
      text: part,
      tokenId: hash,
      colorHex: TOKEN_COLORS[idx % TOKEN_COLORS.length],
    };
  });

  const charCount = clean.length;
  const tokenCount = Math.max(1, tokens.length);
  const charsPerToken = Number((charCount / tokenCount).toFixed(2));

  return { tokens, charCount, tokenCount, charsPerToken };
}

// ============================================================================
// 2. D2: HNSW vs Brute-Force k-NN Math
// ============================================================================
export function computeVectorSearchMetrics(
  mode: VectorSearchMode,
  efSearch: number
): {
  distanceComputations: number;
  hops: number;
  latencyMs: number;
  recallAt10: number;
  visitedLayerNodes: { layer: number; nodeIds: number[] }[];
} {
  if (mode === 'brute-force') {
    return {
      distanceComputations: 200,
      hops: 200,
      latencyMs: 185.0,
      recallAt10: 100.0,
      visitedLayerNodes: [
        { layer: 2, nodeIds: [] },
        { layer: 1, nodeIds: [] },
        {
          layer: 0,
          nodeIds: Array.from({ length: 24 }, (_, i) => i + 1),
        },
      ],
    };
  }

  // HNSW logarithmic routing
  const hops = Math.min(22, Math.max(8, Math.round(7 + Math.log2(efSearch))));
  const distanceComputations = Math.round(hops * 2.4);
  const latencyMs = Number((2.1 + (efSearch / 128) * 3.8).toFixed(1));
  const recallAt10 = Number(
    Math.min(99.6, 88.5 + Math.log2(efSearch) * 1.55).toFixed(1)
  );

  return {
    distanceComputations,
    hops,
    latencyMs,
    recallAt10,
    visitedLayerNodes: [
      { layer: 2, nodeIds: [1, 4] },
      { layer: 1, nodeIds: [4, 7, 11] },
      { layer: 0, nodeIds: [11, 14, 15, 19, 21, 22] },
    ],
  };
}

// ============================================================================
// 3. D3: DeepSpeed ZeRO & QLoRA Memory Sharding Math (30B Model across 4x 80GB GPUs)
// ============================================================================
export interface ZeroGpuMemoryBreakdown {
  stage: ZeroShardingStage;
  label: string;
  paramsGb: number;
  gradientsGb: number;
  optimizerGb: number;
  loraAdapterGb: number;
  totalPerGpuGb: number;
  gpuBudgetGb: number;
  isOomOn80Gb: boolean;
  description: string;
}

export function computeZeroGpuMemoryBreakdown(
  stage: ZeroShardingStage,
  modelParamsB = 30,
  gpuCount = 4
): ZeroGpuMemoryBreakdown {
  const gpuBudgetGb = 80;
  // Standard mixed-precision baseline for 30B model:
  // FP16 Params = 2 * P = 60 GB
  // FP16 Gradients = 2 * P = 60 GB
  // FP32 Optimizer (Master weights 4B + Momentum 4B + Variance 4B = 12B) = 360 GB
  const fullParams = modelParamsB * 2; // 60 GB
  const fullGrads = modelParamsB * 2; // 60 GB
  const fullOpt = modelParamsB * 12; // 360 GB

  let paramsGb = fullParams;
  let gradientsGb = fullGrads;
  let optimizerGb = fullOpt;
  let loraAdapterGb = 0;
  let label = 'Standard DDP (Replicated)';
  let description =
    'Replicates full Parameters, Gradients, and FP32 Adam States on every GPU — causes immediate OOM (480 GB/GPU required).';

  if (stage === 'zero-1') {
    optimizerGb = Number((fullOpt / gpuCount).toFixed(1));
    label = 'DeepSpeed ZeRO Stage 1 (Optimizer Sharded)';
    description =
      'Partitions FP32 Adam Optimizer states (1/4 per GPU), cutting memory from 480 GB to 210 GB/GPU.';
  } else if (stage === 'zero-2') {
    optimizerGb = Number((fullOpt / gpuCount).toFixed(1));
    gradientsGb = Number((fullGrads / gpuCount).toFixed(1));
    label = 'DeepSpeed ZeRO Stage 2 (Opt + Grad Sharded)';
    description =
      'Partitions both Optimizer states and FP16 Gradients across all 4 GPUs (165 GB/GPU).';
  } else if (stage === 'zero-3') {
    optimizerGb = Number((fullOpt / gpuCount).toFixed(1));
    gradientsGb = Number((fullGrads / gpuCount).toFixed(1));
    paramsGb = Number((fullParams / gpuCount).toFixed(1));
    label = 'DeepSpeed ZeRO Stage 3 (Full State Sharding)';
    description =
      'Partitions Parameters, Gradients, and Optimizer states evenly (1/4 per GPU = 120 GB/GPU; fits with activation checkpointing or 8 GPUs).';
  } else if (stage === 'qlora') {
    paramsGb = Number((modelParamsB * 0.55).toFixed(1)); // 4-bit NF4 frozen base weights (~16.5 GB)
    gradientsGb = 0;
    optimizerGb = 0;
    loraAdapterGb = 2.4; // Low-rank adapters (r=16) + Adam states
    label = 'QLoRA 4-bit NF4 + PEFT Adapters (r=16)';
    description =
      'Freezes base 30B weights in 4-bit NormalFloat (16.5 GB) and updates <1% LoRA adapter parameters (Total: 18.9 GB/GPU — easily fits on a single 24GB/80GB GPU!).';
  }

  const totalPerGpuGb = Number(
    (paramsGb + gradientsGb + optimizerGb + loraAdapterGb).toFixed(1)
  );

  return {
    stage,
    label,
    paramsGb,
    gradientsGb,
    optimizerGb,
    loraAdapterGb,
    totalPerGpuGb,
    gpuBudgetGb,
    isOomOn80Gb: totalPerGpuGb > gpuBudgetGb,
    description,
  };
}

// ============================================================================
// 4. D4: Sparse MoE Top-K Router Math
// ============================================================================
export interface MoeExpertScore {
  expertId: number;
  specialty: string;
  probability: number;
  isSelected: boolean;
}

export function computeMoeRoutingStats(
  streamId: MoeStreamPresetId,
  mode: MoeRoutingMode
): {
  experts: MoeExpertScore[];
  activeParamsB: number;
  totalParamsB: number;
  flopsSavedPercent: number;
  auxLoadBalanceLoss: number;
  sampleToken: string;
} {
  const specialties = [
    'E1 · Syntax & Code',
    'E2 · Symbolic Math',
    'E3 · Visual Patch Fusion',
    'E4 · Multilingual Semantics',
    'E5 · Tool & JSON Schema',
    'E6 · Temporal Reasoning',
    'E7 · Safety & Policy',
    'E8 · Long-Context Retrieval',
  ];

  const rawProbs =
    streamId === 'code'
      ? [0.44, 0.08, 0.03, 0.05, 0.28, 0.04, 0.03, 0.05]
      : streamId === 'math'
      ? [0.09, 0.48, 0.02, 0.04, 0.06, 0.23, 0.03, 0.05]
      : [0.04, 0.03, 0.46, 0.26, 0.05, 0.08, 0.04, 0.04];

  const sortedIndices = rawProbs
    .map((_, idx) => idx)
    .sort((a, b) => rawProbs[b] - rawProbs[a]);
  const top2Set = new Set(sortedIndices.slice(0, 2));

  const experts: MoeExpertScore[] = specialties.map((spec, idx) => ({
    expertId: idx + 1,
    specialty: spec,
    probability: rawProbs[idx],
    isSelected: mode === 'dense-8' ? true : top2Set.has(idx),
  }));

  return {
    experts,
    activeParamsB: mode === 'dense-8' ? 46.7 : 12.9,
    totalParamsB: 46.7,
    flopsSavedPercent: mode === 'dense-8' ? 0 : 72.4,
    auxLoadBalanceLoss: mode === 'dense-8' ? 0.0 : 0.014,
    sampleToken:
      streamId === 'code'
        ? 'async def query_hnsw(vec: Tensor)'
        : streamId === 'math'
        ? '∇_θ L(θ) = E[log π_θ(a|s)]'
        : '<image_patch_142> + "Identify crane"',
  };
}

// ============================================================================
// 5. D5: vLLM PagedAttention KV-Cache Block Allocator Math
// ============================================================================
export type KvBlockState =
  | 'free'
  | 'active'
  | 'shared-prefix'
  | 'internal-frag'
  | 'external-frag';

export function computeKvBlockAllocation(
  mode: KvAllocatorMode,
  concurrentRequests: number,
  prefixSharing: boolean
): {
  blocks: KvBlockState[];
  wastedVramPercent: number;
  activeBlocksCount: number;
  maxConcurrentFit: number;
  isOom: boolean;
} {
  const totalBlocks = 64;
  const blocks: KvBlockState[] = Array.from({ length: totalBlocks }, () => 'free');

  if (mode === 'contiguous') {
    // Each request reserves a contiguous 18-block slab (6 used + 10 internal frag + 2 external gap)
    const slabSize = 18;
    const isOom = concurrentRequests * slabSize > totalBlocks;
    const cappedReqs = Math.min(concurrentRequests, Math.floor(totalBlocks / slabSize));

    for (let r = 0; r < cappedReqs; r++) {
      const start = r * slabSize;
      for (let i = 0; i < 6; i++) blocks[start + i] = 'active';
      for (let i = 6; i < 16; i++) blocks[start + i] = 'internal-frag';
      for (let i = 16; i < 18; i++) blocks[start + i] = 'external-frag';
    }

    const wastedBlocks = blocks.filter(
      (b) => b === 'internal-frag' || b === 'external-frag'
    ).length;
    const allocatedBlocks = Math.max(1, cappedReqs * slabSize);
    const wastedVramPercent = Number(
      ((wastedBlocks / allocatedBlocks) * 100).toFixed(1)
    );

    return {
      blocks,
      wastedVramPercent: cappedReqs > 0 ? wastedVramPercent : 58.4,
      activeBlocksCount: blocks.filter((b) => b === 'active').length,
      maxConcurrentFit: 3,
      isOom,
    };
  }

  // PagedAttention non-contiguous allocation
  const sharedCount = prefixSharing ? 4 : 0;
  const blocksPerReq = prefixSharing ? 4 : 6;
  const required = sharedCount + concurrentRequests * blocksPerReq;
  const isOom = required > totalBlocks;

  for (let i = 0; i < Math.min(totalBlocks, sharedCount); i++) {
    blocks[i] = 'shared-prefix';
  }

  // Deterministic pseudo-random non-contiguous physical placement
  const availableIndices = Array.from(
    { length: totalBlocks - sharedCount },
    (_, i) => i + sharedCount
  );
  const toAllocate = Math.min(
    availableIndices.length,
    concurrentRequests * blocksPerReq
  );
  for (let i = 0; i < toAllocate; i++) {
    const mappedIdx =
      sharedCount + ((i * 7 + 3) % (totalBlocks - sharedCount));
    if (blocks[mappedIdx] === 'free') {
      blocks[mappedIdx] = 'active';
    } else {
      const fallback = blocks.findIndex((b) => b === 'free');
      if (fallback !== -1) blocks[fallback] = 'active';
    }
  }

  return {
    blocks,
    wastedVramPercent: 2.4,
    activeBlocksCount: blocks.filter(
      (b) => b === 'active' || b === 'shared-prefix'
    ).length,
    maxConcurrentFit: prefixSharing ? 14 : 10,
    isOom,
  };
}

// ============================================================================
// 7. D7: RAGAS Faithfulness Verifier Math
// ============================================================================
export interface AtomicClaimEvaluation {
  id: string;
  claimText: string;
  entailment: 'supported' | 'contradicted';
  evidenceSnippet: string;
}

export function computeRagasFaithfulness(mode: RagasResponseMode): {
  contextPassage: string;
  responseText: string;
  claims: AtomicClaimEvaluation[];
  groundedCount: number;
  totalClaims: number;
  faithfulnessScore: number;
  guardrailAction: 'PASS_STREAM' | 'BLOCK_FALLBACK';
} {
  const contextPassage =
    '[Doc #402 · Retrieval Spec]: The Multimodal Video Search Pipeline indexes 1.5M keyframes using SigLIP ViT-B/16 embeddings in FAISS GPU combined with Elasticsearch BM25 OCR filters, achieving 18.4ms P99 latency.';

  if (mode === 'grounded') {
    const claims: AtomicClaimEvaluation[] = [
      {
        id: 'c1',
        claimText: 'The pipeline indexes 1.5M video keyframes using SigLIP ViT-B/16.',
        entailment: 'supported',
        evidenceSnippet: 'indexes 1.5M keyframes using SigLIP ViT-B/16 embeddings',
      },
      {
        id: 'c2',
        claimText: 'Dense FAISS GPU search is combined with Elasticsearch BM25 OCR.',
        entailment: 'supported',
        evidenceSnippet: 'in FAISS GPU combined with Elasticsearch BM25 OCR filters',
      },
      {
        id: 'c3',
        claimText: 'End-to-end P99 retrieval latency is 18.4ms.',
        entailment: 'supported',
        evidenceSnippet: 'achieving 18.4ms P99 latency',
      },
    ];
    return {
      contextPassage,
      responseText:
        'The video retrieval system indexes 1.5M keyframes with SigLIP ViT-B/16, fuses FAISS GPU and Elasticsearch BM25 OCR results, and achieves 18.4ms P99 latency.',
      claims,
      groundedCount: 3,
      totalClaims: 3,
      faithfulnessScore: 1.0,
      guardrailAction: 'PASS_STREAM',
    };
  }

  const claims: AtomicClaimEvaluation[] = [
    {
      id: 'c1',
      claimText: 'The pipeline indexes 1.5M video keyframes using SigLIP ViT-B/16.',
      entailment: 'supported',
      evidenceSnippet: 'indexes 1.5M keyframes using SigLIP ViT-B/16 embeddings',
    },
    {
      id: 'c2',
      claimText: 'It stores all video files directly inside a Neo4j Graph Database.',
      entailment: 'contradicted',
      evidenceSnippet: 'No mention of Neo4j; context specifies FAISS GPU + Elasticsearch.',
    },
    {
      id: 'c3',
      claimText: 'It requires 8x H200 GPUs and runs at 2.1ms latency.',
      entailment: 'contradicted',
      evidenceSnippet: 'Hallucinated hardware & latency (context states 18.4ms P99).',
    },
  ];
  return {
    contextPassage,
    responseText:
      'The system indexes 1.5M keyframes with SigLIP, stores raw videos in Neo4j Graph DB, and runs at 2.1ms on 8x H200 GPUs.',
    claims,
    groundedCount: 1,
    totalClaims: 3,
    faithfulnessScore: 0.33,
    guardrailAction: 'BLOCK_FALLBACK',
  };
}
