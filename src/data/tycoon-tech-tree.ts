import type {
  TechNode,
  HardwareClusterTier,
} from '../types/tycoon-strategy';
import type { DistrictId } from './districts';

export const HARDWARE_CLUSTER_TIERS: HardwareClusterTier[] = [
  {
    id: 'gpu-24gb',
    tierIndex: 0,
    name: '1x RTX 4090 Consumer GPU (24 GB)',
    maxVramGb: 24,
    baseCapacityReqPerSec: 180,
    unlockCostCredits: 0,
    upkeepPerSec: 4,
  },
  {
    id: 'gpu-80gb',
    tierIndex: 1,
    name: '1x NVIDIA A100/H100 Enterprise (80 GB)',
    maxVramGb: 80,
    baseCapacityReqPerSec: 850,
    unlockCostCredits: 900,
    upkeepPerSec: 18,
  },
  {
    id: 'gpu-320gb',
    tierIndex: 2,
    name: '4x H100 NVLink Node (320 GB)',
    maxVramGb: 320,
    baseCapacityReqPerSec: 3600,
    unlockCostCredits: 3200,
    upkeepPerSec: 55,
  },
  {
    id: 'gpu-1280gb',
    tierIndex: 3,
    name: 'Multi-Node InfiniBand Supercluster (1,280 GB)',
    maxVramGb: 1280,
    baseCapacityReqPerSec: 16500,
    unlockCostCredits: 9500,
    upkeepPerSec: 160,
  },
];

export const TYCOON_TECH_TREE: TechNode[] = [
  // ==========================================================================
  // D1: Input Gateway (input-gateway)
  // ==========================================================================
  {
    id: 'd1-tier-1',
    districtId: 1,
    districtSlug: 'input-gateway',
    tier: 1,
    name: 'Async FastAPI + Pydantic v2',
    costCredits: 220,
    costRp: 35,
    vramDeltaGb: 0,
    throughputBonusPct: 30,
    latencyReductionMs: 5,
    description:
      'Replaces synchronous Python workers with Rust-backed Pydantic v2 validation and Uvicorn uvloop.',
  },
  {
    id: 'd1-tier-2',
    districtId: 1,
    districtSlug: 'input-gateway',
    tier: 2,
    name: 'gRPC + Protobuf Streaming',
    costCredits: 650,
    costRp: 110,
    vramDeltaGb: 0,
    throughputBonusPct: 75,
    latencyReductionMs: 12,
    prerequisiteNodeId: 'd1-tier-1',
    description:
      'Eliminates JSON serialization overhead via multiplexed HTTP/2 binary Protobuf streams.',
  },
  {
    id: 'd1-tier-3',
    districtId: 1,
    districtSlug: 'input-gateway',
    tier: 3,
    name: 'Zero-Copy DMA Multimodal Tokenizer',
    costCredits: 1850,
    costRp: 320,
    vramDeltaGb: -2,
    throughputBonusPct: 150,
    latencyReductionMs: 20,
    prerequisiteNodeId: 'd1-tier-2',
    description:
      'Streams BPE tokens and 16×16 ViT image patches directly into GPU pinned memory via GPUDirect DMA.',
  },

  // ==========================================================================
  // D2: Vector Vault (data-lake)
  // ==========================================================================
  {
    id: 'd2-tier-1',
    districtId: 2,
    districtSlug: 'data-lake',
    tier: 1,
    name: 'pgvector HNSW Indexing',
    costCredits: 260,
    costRp: 45,
    vramDeltaGb: 2,
    throughputBonusPct: 50,
    latencyReductionMs: 35,
    description:
      'Replaces O(N) flat cosine scans with logarithmic O(log N) Hierarchical Navigable Small World graphs.',
  },
  {
    id: 'd2-tier-2',
    districtId: 2,
    districtSlug: 'data-lake',
    tier: 2,
    name: 'Milvus IVF-PQ + BM25 Hybrid RRF',
    costCredits: 780,
    costRp: 140,
    vramDeltaGb: -4,
    throughputBonusPct: 120,
    latencyReductionMs: 60,
    prerequisiteNodeId: 'd2-tier-1',
    description:
      'Compresses vector indices via Product Quantization (-4GB VRAM) paired with Elasticsearch BM25 Reciprocal Rank Fusion.',
  },
  {
    id: 'd2-tier-3',
    districtId: 2,
    districtSlug: 'data-lake',
    tier: 3,
    name: 'FAISS GPU + ColPali Late-Interaction',
    costCredits: 2100,
    costRp: 380,
    vramDeltaGb: 4,
    throughputBonusPct: 250,
    latencyReductionMs: 85,
    prerequisiteNodeId: 'd2-tier-2',
    description:
      'Executes sub-10ms MaxSim patch-level multimodal retrieval directly inside CUDA warp cores.',
  },

  // ==========================================================================
  // D3: Training Foundry (training-cluster)
  // ==========================================================================
  {
    id: 'd3-tier-1',
    districtId: 3,
    districtSlug: 'training-cluster',
    tier: 1,
    name: 'BF16 Mixed Precision + Grad Clip',
    costCredits: 280,
    costRp: 40,
    vramDeltaGb: -6,
    throughputBonusPct: 40,
    latencyReductionMs: 6,
    rpPerSecondBonus: 4,
    description:
      'Halves activation memory footprint (-6GB VRAM) and accelerates R&D experimentation (+4 RP/s).',
  },
  {
    id: 'd3-tier-2',
    districtId: 3,
    districtSlug: 'training-cluster',
    tier: 2,
    name: 'QLoRA 4-Bit PEFT Adapters',
    costCredits: 820,
    costRp: 150,
    vramDeltaGb: -14,
    throughputBonusPct: 95,
    latencyReductionMs: 14,
    rpPerSecondBonus: 10,
    prerequisiteNodeId: 'd3-tier-1',
    description:
      'Freezes base weights in 4-bit NormalFloat (-14GB VRAM) while training low-rank adapters (+10 RP/s).',
  },
  {
    id: 'd3-tier-3',
    districtId: 3,
    districtSlug: 'training-cluster',
    tier: 3,
    name: 'DeepSpeed ZeRO-3 + DPO/GRPO Engine',
    costCredits: 2400,
    costRp: 420,
    vramDeltaGb: -10,
    throughputBonusPct: 190,
    latencyReductionMs: 22,
    rpPerSecondBonus: 25,
    prerequisiteNodeId: 'd3-tier-2',
    description:
      'Partitions parameters, gradients, and optimizer states across all GPUs while running continuous DPO alignment (+25 RP/s).',
  },

  // ==========================================================================
  // D4: Model Core (model-core)
  // ==========================================================================
  {
    id: 'd4-tier-1',
    districtId: 4,
    districtSlug: 'model-core',
    tier: 1,
    name: 'RoPE + SwiGLU + RMSNorm',
    costCredits: 300,
    costRp: 55,
    vramDeltaGb: 0,
    throughputBonusPct: 35,
    latencyReductionMs: 10,
    rpPerSecondBonus: 3,
    description:
      'Modernizes Transformer blocks with Rotary Position Embeddings and RMSNorm pre-normalization (+3 RP/s).',
  },
  {
    id: 'd4-tier-2',
    districtId: 4,
    districtSlug: 'model-core',
    tier: 2,
    name: 'FlashAttention-2 IO-Aware Kernel',
    costCredits: 920,
    costRp: 175,
    vramDeltaGb: -8,
    throughputBonusPct: 90,
    latencyReductionMs: 28,
    rpPerSecondBonus: 6,
    prerequisiteNodeId: 'd4-tier-1',
    description:
      'Fuses QKV attention inside GPU SRAM tiles, eliminating O(N²) HBM reads/writes (-8GB VRAM, -28ms latency).',
  },
  {
    id: 'd4-tier-3',
    districtId: 4,
    districtSlug: 'model-core',
    tier: 3,
    name: 'Sparse MoE Top-2 Router',
    costCredits: 2600,
    costRp: 460,
    vramDeltaGb: -12,
    throughputBonusPct: 220,
    latencyReductionMs: 45,
    rpPerSecondBonus: 12,
    prerequisiteNodeId: 'd4-tier-2',
    description:
      'Routes each token to only K=2 out of 8 specialized experts, slashing active compute & VRAM (-12GB VRAM, +220% cap).',
  },

  // ==========================================================================
  // D5: Inference Engine (inference-center)
  // ==========================================================================
  {
    id: 'd5-tier-1',
    districtId: 5,
    districtSlug: 'inference-center',
    tier: 1,
    name: 'ONNX Runtime + INT8 Quantization',
    costCredits: 320,
    costRp: 60,
    vramDeltaGb: -10,
    throughputBonusPct: 60,
    latencyReductionMs: 18,
    description:
      'Compiles computation graphs and quantizes weights to INT8, freeing 10 GB of VRAM and cutting latency by 18ms.',
  },
  {
    id: 'd5-tier-2',
    districtId: 5,
    districtSlug: 'inference-center',
    tier: 2,
    name: 'Triton Server + Dynamic Batching',
    costCredits: 980,
    costRp: 190,
    vramDeltaGb: 2,
    throughputBonusPct: 140,
    latencyReductionMs: 35,
    prerequisiteNodeId: 'd5-tier-1',
    description:
      'Coalesces concurrent inference requests on-the-fly into saturated GPU tensor batches (+140% capacity).',
  },
  {
    id: 'd5-tier-3',
    districtId: 5,
    districtSlug: 'inference-center',
    tier: 3,
    name: 'vLLM PagedAttention + Speculative Decoding',
    costCredits: 2800,
    costRp: 520,
    vramDeltaGb: -18,
    throughputBonusPct: 300,
    latencyReductionMs: 65,
    prerequisiteNodeId: 'd5-tier-2',
    description:
      'Eliminates KV-Cache fragmentation via non-contiguous virtual memory blocks (-18GB VRAM, +300% cap, -65ms).',
  },

  // ==========================================================================
  // D6: Agentic & Memory (nlp-district)
  // ==========================================================================
  {
    id: 'd6-tier-1',
    districtId: 6,
    districtSlug: 'nlp-district',
    tier: 1,
    name: 'Structured JSON Schema Function Calling',
    costCredits: 250,
    costRp: 50,
    vramDeltaGb: 0,
    throughputBonusPct: 40,
    latencyReductionMs: 8,
    description:
      'Enforces finite-state grammar masks during token decoding for 100% valid JSON tool invocations.',
  },
  {
    id: 'd6-tier-2',
    districtId: 6,
    districtSlug: 'nlp-district',
    tier: 2,
    name: 'Model Context Protocol (MCP) Server Bus',
    costCredits: 790,
    costRp: 155,
    vramDeltaGb: 0,
    throughputBonusPct: 100,
    latencyReductionMs: 20,
    prerequisiteNodeId: 'd6-tier-1',
    description:
      'Standardizes JSON-RPC 2.0 tool execution across vector stores, SQL databases, and sandboxed code runners.',
  },
  {
    id: 'd6-tier-3',
    districtId: 6,
    districtSlug: 'nlp-district',
    tier: 3,
    name: 'LangGraph Parallel Multi-Agent Swarm',
    costCredits: 2200,
    costRp: 410,
    vramDeltaGb: 2,
    throughputBonusPct: 200,
    latencyReductionMs: 32,
    prerequisiteNodeId: 'd6-tier-2',
    description:
      'Executes cyclic Planner, Retriever, and Verifier sub-agents concurrently with checkpointed state persistence.',
  },

  // ==========================================================================
  // D7: Guardrails & Eval (computer-vision)
  // ==========================================================================
  {
    id: 'd7-tier-1',
    districtId: 7,
    districtSlug: 'computer-vision',
    tier: 1,
    name: 'Pydantic PII & Regex Input Filter',
    costCredits: 240,
    costRp: 45,
    vramDeltaGb: 0,
    throughputBonusPct: 35,
    latencyReductionMs: 5,
    defenseBonusPct: 25,
    description:
      'Sanitizes PII and blocks basic injection signatures at the edge (+25% adversarial threat block).',
  },
  {
    id: 'd7-tier-2',
    districtId: 7,
    districtSlug: 'computer-vision',
    tier: 2,
    name: 'RAGAS Faithfulness NLI Verifier',
    costCredits: 840,
    costRp: 165,
    vramDeltaGb: 1,
    throughputBonusPct: 85,
    latencyReductionMs: 10,
    defenseBonusPct: 60,
    prerequisiteNodeId: 'd7-tier-1',
    description:
      'Decomposes responses into atomic claims and verifies entailment against retrieved context (+60% threat block).',
  },
  {
    id: 'd7-tier-3',
    districtId: 7,
    districtSlug: 'computer-vision',
    tier: 3,
    name: 'NeMo Guardrails + Adversarial Prompt Shield',
    costCredits: 2350,
    costRp: 440,
    vramDeltaGb: 1,
    throughputBonusPct: 160,
    latencyReductionMs: 10,
    defenseBonusPct: 95,
    prerequisiteNodeId: 'd7-tier-2',
    description:
      'Neutralizes coordinated red-team jailbreaks and indirect prompt injections (+95% threat block, -10ms).',
  },

  // ==========================================================================
  // D8: Output & MLOps (output-terminal)
  // ==========================================================================
  {
    id: 'd8-tier-1',
    districtId: 8,
    districtSlug: 'output-terminal',
    tier: 1,
    name: 'SSE Token Streaming + Prometheus',
    costCredits: 230,
    costRp: 40,
    vramDeltaGb: 0,
    throughputBonusPct: 40,
    latencyReductionMs: 8,
    creditYieldBonusPct: 30,
    description:
      'Streams tokens via Server-Sent Events with real-time Prometheus P99 scraping (+30% Compute Credit yield).',
  },
  {
    id: 'd8-tier-2',
    districtId: 8,
    districtSlug: 'output-terminal',
    tier: 2,
    name: 'Redis Semantic Vector Cache',
    costCredits: 860,
    costRp: 160,
    vramDeltaGb: -4,
    throughputBonusPct: 110,
    latencyReductionMs: 30,
    creditYieldBonusPct: 25,
    prerequisiteNodeId: 'd8-tier-1',
    description:
      'Intercepts semantically similar queries (cosine > 0.94) at the edge in 3ms (+110% effective cap, -30ms).',
  },
  {
    id: 'd8-tier-3',
    districtId: 8,
    districtSlug: 'output-terminal',
    tier: 3,
    name: 'Autonomous Data Flywheel + Canary Auto-Scaler',
    costCredits: 2500,
    costRp: 480,
    vramDeltaGb: 0,
    throughputBonusPct: 200,
    latencyReductionMs: 22,
    creditYieldBonusPct: 45,
    slaRecoveryPerSec: 2.0,
    prerequisiteNodeId: 'd8-tier-2',
    description:
      'Auto-scales Kubernetes replicas and self-heals production drift (+200% cap, +2% SLA Stability recovery/sec).',
  },
];

export const TECH_NODE_MAP: Record<string, TechNode> = Object.fromEntries(
  TYCOON_TECH_TREE.map((node) => [node.id, node])
);

export function getDistrictTechNodes(districtSlug: DistrictId): TechNode[] {
  return TYCOON_TECH_TREE.filter((n) => n.districtSlug === districtSlug).sort(
    (a, b) => a.tier - b.tier
  );
}
