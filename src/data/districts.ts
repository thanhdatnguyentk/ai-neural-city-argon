export type DistrictId =
  | 'input-gateway'
  | 'data-lake'
  | 'training-cluster'
  | 'model-core'
  | 'inference-center'
  | 'nlp-district'
  | 'computer-vision'
  | 'output-terminal';

export type PipelineStageId =
  | 'input'
  | 'data-lake'
  | 'training'
  | 'model-core'
  | 'inference'
  | 'agentic-mcp'
  | 'guardrails-eval'
  | 'output';

export interface DistrictData {
  id: DistrictId;
  name: string;
  shortName: string;
  pipelineStage: PipelineStageId;
  category: 'data' | 'modality' | 'compute' | 'neural' | 'output';
  tagline: string;
  shortDescription: string;
  roleInPipeline: string;
  plainLanguageExplanation: string;
  technicalTerm: {
    term: string;
    definition: string;
  };
  exampleInput: string;
  exampleOutput: string;
  statusText: string;
  statusLevel: 'optimal' | 'high-load' | 'active';
  metrics: {
    throughput: string;
    activeUnits: string;
    utilization: number;
  };
  /** 3D coordinates on the isometric city platform [x, y, z] */
  position: [number, number, number];
  /** Platform footprint size [width, depth] */
  footprint: [number, number];
  /** Primary accent color hex */
  accentColor: string;
  /** Secondary glow color hex */
  secondaryColor: string;
  /** Connected target districts for data flow */
  connectsTo: DistrictId[];
  /** Connected source districts for data flow */
  receivesFrom: DistrictId[];
}

export interface DataFlowPath {
  id: string;
  from: DistrictId;
  to: DistrictId;
  type: 'data' | 'neural' | 'output';
  label: string;
  /** Intermediate control points for smooth 3D paths */
  waypoints: [number, number, number][];
}

export interface PipelineStep {
  id: PipelineStageId;
  stepNumber: number;
  label: string;
  districtId: DistrictId;
  relatedDistrictIds?: DistrictId[];
  title: string;
  summary: string;
  plainExplanation: string;
  keyConcept: string;
  keyConceptDefinition: string;
}

export const DISTRICTS: DistrictData[] = [
  // D1: Ingress & Multimodal Gateway
  {
    id: 'input-gateway',
    name: 'Ingress & Multimodal Gateway',
    shortName: 'D1 · Ingress',
    pipelineStage: 'input',
    category: 'data',
    tagline: 'API termination, BPE tokenization, ViT 16×16 patchification & OCR/ASR.',
    shortDescription:
      'Terminates gRPC/HTTP2 requests, validates Pydantic v2 schemas, and encodes UTF-8 text + RGB tensors.',
    roleInPipeline:
      'Acts as the high-throughput ingress boundary. Validates schemas, splits text into subword token IDs via Tiktoken BPE, and projects 1024×1024 images into 16×16 Vision Transformer patch tensors.',
    plainLanguageExplanation:
      'Input: Raw RGB [B, 3, 1024, 1024] + UTF-8 String → Output: Patch Tensor [B, 256, 1152] (FP16) + Token IDs [B, L] (int32) via gRPC Protobuf.',
    technicalTerm: {
      term: 'BPE Tokenization & ViT Linear Patch Projection',
      definition:
        'Input: Raw RGB [B, 3, 1024, 1024] + UTF-8 String → Output: Patch Tensor [B, 256, 1152] (FP16) + Token IDs [B, L] (int32) via gRPC Protobuf.',
    },
    exampleInput:
      'POST /v1/chat/multimodal: Raw RGB [1, 3, 1024, 1024] + UTF-8 prompt',
    exampleOutput:
      'Patch Tensor [1, 256, 1152] (FP16) + BPE Token IDs [1, 48] (int32)',
    statusText: 'INGRESS ACTIVE',
    statusLevel: 'optimal',
    metrics: {
      throughput: '14.2 GB/s',
      activeUnits: '64 gRPC Workers',
      utilization: 78,
    },
    position: [-10, 0, 8],
    footprint: [4.8, 4.8],
    accentColor: '#00F0FF',
    secondaryColor: '#38BDF8',
    connectsTo: ['data-lake', 'computer-vision', 'nlp-district'],
    receivesFrom: [],
  },

  // D2: Data Lake & Vector Vault
  {
    id: 'data-lake',
    name: 'Data Lake & Vector Vault',
    shortName: 'D2 · Vector Vault',
    pipelineStage: 'data-lake',
    category: 'data',
    tagline: 'Unstructured lakehouse storage, dense embeddings, HNSW graph + BM25.',
    shortDescription:
      'Stores Parquet training shards and serves sub-10ms HNSW + BM25 hybrid retrieval.',
    roleInPipeline:
      'Provides dual-plane storage: serves online Hybrid RAG context chunks via Milvus/FAISS HNSW + Elasticsearch BM25 Reciprocal Rank Fusion, and feeds Parquet shards to D3 during offline training.',
    plainLanguageExplanation:
      'Query: Normalized Embedding [1, 1152] (FP16) → Index: HNSW (M=16, ef=64) + Inverted BM25 → Output: Top-K Context Chunks (Cosine > 0.82).',
    technicalTerm: {
      term: 'HNSW Graph Traversal & Reciprocal Rank Fusion (RRF)',
      definition:
        'Query: Normalized Embedding [1, 1152] (FP16) → Index: HNSW (M=16, ef=64) + Inverted BM25 → Output: Top-K Context Chunks (Cosine > 0.82).',
    },
    exampleInput: 'Normalized Query Vector [1, 1152] (FP16) + Lexical Filter',
    exampleOutput: 'Top-K Grounded Context Passages (Recall@10: 94.8% in 6.4ms)',
    statusText: 'HNSW INDEX READY',
    statusLevel: 'optimal',
    metrics: {
      throughput: '6.4 ms HNSW',
      activeUnits: '128 Vector Shards',
      utilization: 84,
    },
    position: [-8, 0, -2],
    footprint: [5.2, 5.2],
    accentColor: '#00F0FF',
    secondaryColor: '#0EA5E9',
    connectsTo: ['computer-vision', 'nlp-district', 'training-cluster'],
    receivesFrom: ['input-gateway'],
  },

  // D3: Training Foundry
  {
    id: 'training-cluster',
    name: 'Training Foundry',
    shortName: 'D3 · Training',
    pipelineStage: 'training',
    category: 'compute',
    tagline: 'Distributed pre-training, SFT, QLoRA, and DPO/GRPO alignment.',
    shortDescription:
      'Offline multi-node GPU cluster executing FSDP/ZeRO-3 forward/backward passes (Standby during Online Serving).',
    roleInPipeline:
      'Offline compute powerhouse. Partitions parameters, gradients, and FP32 Adam states across H100 nodes via FSDP ZeRO-3 and publishes verified checkpoints to D4 Model Core. Explicitly offline during real-time user inference.',
    plainLanguageExplanation:
      'Sharding: FSDP ZeRO-3 (Params + Grads + Adam FP32 States partitioned across N GPUs) → Precision: BF16 Forward/Backward.',
    technicalTerm: {
      term: 'FSDP ZeRO-3 Sharding & NVLink Collective All-Reduce',
      definition:
        'Sharding: FSDP ZeRO-3 (Params + Grads + Adam FP32 States partitioned across N GPUs) → Precision: BF16 Forward/Backward.',
    },
    exampleInput: 'WebDataset Parquet Shards [Global Batch: 4M tokens, BF16]',
    exampleOutput: 'Sharded Safetensors Checkpoint (MFU: 51.4%, Loss: 1.184)',
    statusText: 'OFFLINE IN SERVING MODE',
    statusLevel: 'high-load',
    metrics: {
      throughput: '51.4% MFU',
      activeUnits: '64× H100 ZeRO-3',
      utilization: 94,
    },
    position: [5.5, 0, -8.5],
    footprint: [5.4, 5.0],
    accentColor: '#8B5CF6',
    secondaryColor: '#EC4899',
    connectsTo: ['model-core'],
    receivesFrom: ['data-lake', 'computer-vision', 'nlp-district'],
  },

  // D4: Model Core & Registry
  {
    id: 'model-core',
    name: 'Model Core & Registry',
    shortName: 'D4 · Model Core',
    pipelineStage: 'model-core',
    category: 'neural',
    tagline: 'Foundation model backbones (Transformer/MoE, CLIP/SigLIP) & frozen weights.',
    shortDescription:
      'Houses versioned Safetensors weights, GQA/RoPE/SwiGLU Transformer blocks, and Sparse MoE routers.',
    roleInPipeline:
      'Central neural registry holding immutable, version-locked foundation backbones (GQA, RoPE, SwiGLU, FlashAttention-2, Sparse MoE). Supplies frozen weights to D5 Inference Engine and receives checkpoints from D3.',
    plainLanguageExplanation:
      'Backbone: GQA (8 KV heads, 32 Q heads) + RoPE (theta=1e6) + SwiGLU FFN + FlashAttention-2 IO-Aware Tiling.',
    technicalTerm: {
      term: 'Grouped-Query Attention (GQA) & Sparse MoE Top-K Routing',
      definition:
        'Backbone: GQA (8 KV heads, 32 Q heads) + RoPE (theta=1e6) + SwiGLU FFN + FlashAttention-2 IO-Aware Tiling.',
    },
    exampleInput: 'Fused Multimodal Tokens [B, L, 4096] + Frozen AWQ Weights',
    exampleOutput: 'Contextualized Hidden States [B, L, 4096] (FP16/BF16)',
    statusText: 'WEIGHTS LOCKED',
    statusLevel: 'optimal',
    metrics: {
      throughput: '12.9B Active MoE',
      activeUnits: '96 GQA Layers',
      utilization: 88,
    },
    position: [0.5, 0, 0],
    footprint: [6.0, 6.0],
    accentColor: '#EC4899',
    secondaryColor: '#8B5CF6',
    connectsTo: ['inference-center'],
    receivesFrom: ['training-cluster', 'computer-vision', 'nlp-district'],
  },

  // D5: Inference Engine
  {
    id: 'inference-center',
    name: 'Inference Engine',
    shortName: 'D5 · Inference',
    pipelineStage: 'inference',
    category: 'neural',
    tagline: 'Low-latency prefill/decode execution, PagedAttention KV-cache & quantization.',
    shortDescription:
      'Executes compute-bound prefill and HBM-bandwidth-bound decode via vLLM and Triton Server.',
    roleInPipeline:
      'Executes real-time forward passes using frozen weights from D4. Separates compute-bound O(L²) prefill from memory-bandwidth-bound O(L) decode using non-contiguous vLLM PagedAttention KV blocks.',
    plainLanguageExplanation:
      'Prefill: Compute-Bound O(L^2) Matrix-Matrix | Decode: Memory-BW-Bound O(L) Matrix-Vector | KV Block Size: 16 tokens (PagedAttention).',
    technicalTerm: {
      term: 'vLLM PagedAttention & Continuous Iteration-Level Batching',
      definition:
        'Prefill: Compute-Bound O(L^2) Matrix-Matrix | Decode: Memory-BW-Bound O(L) Matrix-Vector | KV Block Size: 16 tokens (PagedAttention).',
    },
    exampleInput: 'Grounded Prompt Context [B, 2048] + Paged KV-Cache Pointers',
    exampleOutput: 'Logit Stream at TTFT 46.8ms · TPOT 11.4ms/tok (88 tok/s)',
    statusText: 'LOW-LATENCY SERVING',
    statusLevel: 'optimal',
    metrics: {
      throughput: '11.4 ms/tok TPOT',
      activeUnits: '144 vLLM Pods',
      utilization: 76,
    },
    position: [8.5, 0, -1],
    footprint: [4.8, 4.8],
    accentColor: '#8B5CF6',
    secondaryColor: '#00F0FF',
    connectsTo: ['output-terminal'],
    receivesFrom: ['model-core'],
  },

  // D6: Agentic & MCP Orchestrator
  {
    id: 'nlp-district',
    name: 'Agentic & MCP Orchestrator',
    shortName: 'D6 · Agentic MCP',
    pipelineStage: 'agentic-mcp',
    category: 'modality',
    tagline: 'Multi-step ReAct planning, MCP JSON-RPC 2.0 tool routing & working memory.',
    shortDescription:
      'Coordinates cyclic LangGraph state machines, tool execution, and Model Context Protocol (MCP) buses.',
    roleInPipeline:
      'Decomposes complex user intents into cyclic Thought → Action → Observation loops, invoking external vector stores and SQL/code tools over standardized MCP JSON-RPC 2.0 channels.',
    plainLanguageExplanation:
      'Protocol: MCP JSON-RPC 2.0 over stdio/SSE | Loop: Thought -> Action (Tool Call) -> Observation -> Grounded Synthesis.',
    technicalTerm: {
      term: 'Model Context Protocol (MCP) & Cyclic ReAct Graphs',
      definition:
        'Protocol: MCP JSON-RPC 2.0 over stdio/SSE | Loop: Thought -> Action (Tool Call) -> Observation -> Grounded Synthesis.',
    },
    exampleInput: 'User Intent + Session State Graph + Tool Schemas',
    exampleOutput: 'JSON-RPC 2.0 Tool Call: query_hybrid_vault(top_k=5)',
    statusText: 'MCP BUS ACTIVE',
    statusLevel: 'active',
    metrics: {
      throughput: '1.8M tok/s',
      activeUnits: '112 Agent Workers',
      utilization: 81,
    },
    position: [-1.5, 0, 9.5],
    footprint: [4.8, 4.8],
    accentColor: '#38BDF8',
    secondaryColor: '#A855F7',
    connectsTo: ['training-cluster', 'model-core'],
    receivesFrom: ['data-lake'],
  },

  // D7: Guardrails & Eval Gate
  {
    id: 'computer-vision',
    name: 'Guardrails & Eval Gate',
    shortName: 'D7 · Guardrails',
    pipelineStage: 'guardrails-eval',
    category: 'modality',
    tagline: 'Input prompt-injection shield, PII redaction & output NLI faithfulness check.',
    shortDescription:
      'Enforces sub-4ms input prompt shields and RAGAS atomic claim NLI faithfulness verification.',
    roleInPipeline:
      'Operates as the dual-gate security and quality firewall: intercepts adversarial jailbreaks/PII at ingress and verifies generated claims against retrieved D2 context via NLI entailment before egress.',
    plainLanguageExplanation:
      'Input Gate: Prompt-Injection Classifier (<4ms) | Output Gate: Decomposed Claim NLI Entailment (Faithfulness >= 0.90).',
    technicalTerm: {
      term: 'Dual-Gate NeMo Guardrails & RAGAS Claim Entailment',
      definition:
        'Input Gate: Prompt-Injection Classifier (<4ms) | Output Gate: Decomposed Claim NLI Entailment (Faithfulness >= 0.90).',
    },
    exampleInput: 'Candidate Response Claims + Retrieved Context Passages',
    exampleOutput: 'Verified Grounded Stream (RAGAS Faithfulness: 0.96 PASS)',
    statusText: 'SHIELD & NLI ACTIVE',
    statusLevel: 'active',
    metrics: {
      throughput: '< 4.0 ms Gate',
      activeUnits: '96 NLI Verifiers',
      utilization: 72,
    },
    position: [-2.5, 0, -9.5],
    footprint: [4.8, 4.8],
    accentColor: '#38BDF8',
    secondaryColor: '#8B55F7',
    connectsTo: ['training-cluster', 'model-core'],
    receivesFrom: ['data-lake'],
  },

  // D8: Output Nexus & Telemetry
  {
    id: 'output-terminal',
    name: 'Output Nexus & Telemetry',
    shortName: 'D8 · Output & Telemetry',
    pipelineStage: 'output',
    category: 'output',
    tagline: 'SSE token streaming, semantic caching, OpenTelemetry tracing & data flywheel.',
    shortDescription:
      'Streams HTTP/2 SSE tokens, serves 3ms Redis semantic cache hits, and scrapes Prometheus P99 telemetry.',
    roleInPipeline:
      'Delivers detokenized UTF-8 chunks over HTTP/2 Server-Sent Events (SSE), intercepts repeat queries via Redis Semantic Vector Cache, and exports OpenTelemetry GenAI spans to Prometheus/Grafana.',
    plainLanguageExplanation:
      'Egress: HTTP/2 SSE Text-Event-Stream | Telemetry: OpenTelemetry GenAI Spans -> Prometheus TSDB.',
    technicalTerm: {
      term: 'HTTP/2 SSE Streaming & OpenTelemetry GenAI Observability',
      definition:
        'Egress: HTTP/2 SSE Text-Event-Stream | Telemetry: OpenTelemetry GenAI Spans -> Prometheus TSDB.',
    },
    exampleInput: 'Verified Token Stream + Per-Request TTFT/TPOT Metrics',
    exampleOutput: 'data: {"token":"Kingfisher","ttft_ms":46.8,"ragas":0.96}',
    statusText: 'SSE STREAMING',
    statusLevel: 'optimal',
    metrics: {
      throughput: '99.98% SLA',
      activeUnits: '48 SSE Channels',
      utilization: 69,
    },
    position: [9.5, 0, 8.5],
    footprint: [4.8, 4.8],
    accentColor: '#00F0FF',
    secondaryColor: '#F59E0B',
    connectsTo: [],
    receivesFrom: ['inference-center'],
  },
];

export const DISTRICT_MAP: Record<DistrictId, DistrictData> = DISTRICTS.reduce(
  (acc, d) => {
    acc[d.id] = d;
    return acc;
  },
  {} as Record<DistrictId, DistrictData>
);

export const DATA_FLOW_PATHS: DataFlowPath[] = [
  {
    id: 'path-input-datalake',
    from: 'input-gateway',
    to: 'data-lake',
    type: 'data',
    label: 'gRPC Protobuf Ingress',
    waypoints: [
      [-10, 0.35, 8],
      [-10, 0.35, 3],
      [-8, 0.35, 3],
      [-8, 0.35, -2],
    ],
  },
  {
    id: 'path-datalake-cv',
    from: 'data-lake',
    to: 'computer-vision',
    type: 'data',
    label: 'Guardrail & NLI Context',
    waypoints: [
      [-8, 0.35, -2],
      [-8, 0.35, -9.5],
      [-2.5, 0.35, -9.5],
    ],
  },
  {
    id: 'path-datalake-nlp',
    from: 'data-lake',
    to: 'nlp-district',
    type: 'data',
    label: 'MCP Hybrid RAG Chunks',
    waypoints: [
      [-8, 0.35, -2],
      [-5, 0.35, -2],
      [-5, 0.35, 9.5],
      [-1.5, 0.35, 9.5],
    ],
  },
  {
    id: 'path-datalake-training',
    from: 'data-lake',
    to: 'training-cluster',
    type: 'data',
    label: 'Offline Parquet Shards',
    waypoints: [
      [-8, 0.35, -2],
      [-3, 0.35, -5.5],
      [5.5, 0.35, -5.5],
      [5.5, 0.35, -8.5],
    ],
  },
  {
    id: 'path-cv-training',
    from: 'computer-vision',
    to: 'training-cluster',
    type: 'neural',
    label: 'Eval Benchmark Feedback',
    waypoints: [
      [-2.5, 0.4, -9.5],
      [1.5, 0.4, -9.5],
      [5.5, 0.4, -8.5],
    ],
  },
  {
    id: 'path-cv-core',
    from: 'computer-vision',
    to: 'model-core',
    type: 'neural',
    label: 'Verified Guardrail Gate',
    waypoints: [
      [-2.5, 0.4, -9.5],
      [-2.5, 0.4, -4.5],
      [0.5, 0.4, -4.5],
      [0.5, 0.4, 0],
    ],
  },
  {
    id: 'path-nlp-training',
    from: 'nlp-district',
    to: 'training-cluster',
    type: 'neural',
    label: 'RLHF/DPO Trajectory Logs',
    waypoints: [
      [-1.5, 0.4, 9.5],
      [4.5, 0.4, 9.5],
      [4.5, 0.4, -4.5],
      [5.5, 0.4, -8.5],
    ],
  },
  {
    id: 'path-nlp-core',
    from: 'nlp-district',
    to: 'model-core',
    type: 'neural',
    label: 'Agentic MCP State Graph',
    waypoints: [
      [-1.5, 0.4, 9.5],
      [-1.5, 0.4, 4.5],
      [0.5, 0.4, 4.5],
      [0.5, 0.4, 0],
    ],
  },
  {
    id: 'path-training-core',
    from: 'training-cluster',
    to: 'model-core',
    type: 'neural',
    label: 'Safetensors Checkpoints',
    waypoints: [
      [5.5, 0.45, -8.5],
      [5.5, 0.45, -3.5],
      [0.5, 0.45, -3.5],
      [0.5, 0.45, 0],
    ],
  },
  {
    id: 'path-core-inference',
    from: 'model-core',
    to: 'inference-center',
    type: 'neural',
    label: 'Frozen FP8/AWQ Weights',
    waypoints: [
      [0.5, 0.45, 0],
      [4.5, 0.45, 0],
      [4.5, 0.45, -1],
      [8.5, 0.45, -1],
    ],
  },
  {
    id: 'path-inference-output',
    from: 'inference-center',
    to: 'output-terminal',
    type: 'output',
    label: 'SSE Token Stream',
    waypoints: [
      [8.5, 0.4, -1],
      [8.5, 0.4, 4],
      [9.5, 0.4, 4],
      [9.5, 0.4, 8.5],
    ],
  },
];

export const PIPELINE_STEPS: PipelineStep[] = [
  {
    id: 'input',
    stepNumber: 1,
    label: 'D1 · Ingress',
    districtId: 'input-gateway',
    title: 'D1 · Ingress & Multimodal Gateway',
    summary:
      'API termination, BPE tokenization, ViT 16×16 patchification, and OCR/ASR normalization.',
    plainExplanation:
      'Terminates HTTP/2 and gRPC streams, validates Pydantic v2 schemas, encodes UTF-8 strings into BPE token IDs, and projects 1024×1024 RGB images into 16×16 ViT patch tensors.',
    keyConcept: 'NETWORK / IOPS-BOUND',
    keyConceptDefinition:
      'Input: Raw RGB [B, 3, 1024, 1024] + UTF-8 String -> Output: Patch Tensor [B, 256, 1152] (FP16) + Token IDs [B, L] (int32) via gRPC Protobuf',
  },
  {
    id: 'data-lake',
    stepNumber: 2,
    label: 'D2 · Vector Vault',
    districtId: 'data-lake',
    title: 'D2 · Data Lake & Vector Vault',
    summary:
      'Unstructured lakehouse storage, dense embeddings, HNSW ANN graph + sparse BM25 indexing.',
    plainExplanation:
      'Executes sub-10ms Hybrid Retrieval combining HNSW logarithmic graph traversal (efSearch=64) and inverted BM25 lexical search via Reciprocal Rank Fusion (RRF), while storing Parquet shards for offline training.',
    keyConcept: 'NETWORK / IOPS-BOUND',
    keyConceptDefinition:
      'Query: Normalized Embedding [1, 1152] (FP16) -> Index: HNSW (M=16, ef=64) + Inverted BM25 -> Output: Top-K Context Chunks (Cosine > 0.82)',
  },
  {
    id: 'training',
    stepNumber: 3,
    label: 'D3 · Training',
    districtId: 'training-cluster',
    title: 'D3 · Training Foundry (Offline Batch / Standby in Serving)',
    summary:
      'Distributed pre-training, SFT, QLoRA, and DPO/GRPO alignment across FSDP ZeRO-3 GPU clusters.',
    plainExplanation:
      'Executes compute-bound BF16 forward/backward passes and NVLink All-Reduce gradient synchronization during Offline Training. Explicitly placed on Standby during Online Inference.',
    keyConcept: 'COMPUTE-BOUND (TFLOPs)',
    keyConceptDefinition:
      'Sharding: FSDP ZeRO-3 (Params + Grads + Adam FP32 States partitioned across N GPUs) -> Precision: BF16 Forward/Backward',
  },
  {
    id: 'model-core',
    stepNumber: 4,
    label: 'D4 · Model Core',
    districtId: 'model-core',
    title: 'D4 · Model Core & Registry',
    summary:
      'Foundation model backbones (Transformer/MoE, CLIP/SigLIP) and frozen Safetensors weights.',
    plainExplanation:
      'Houses version-locked Safetensors model weights, Grouped-Query Attention (GQA), RoPE positional embeddings, FlashAttention-2 kernels, and Sparse MoE Top-2 routers.',
    keyConcept: 'MEMORY-BANDWIDTH-BOUND (HBM GB/s)',
    keyConceptDefinition:
      'Backbone: GQA (8 KV heads, 32 Q heads) + RoPE (theta=1e6) + SwiGLU FFN + FlashAttention-2 IO-Aware Tiling',
  },
  {
    id: 'inference',
    stepNumber: 5,
    label: 'D5 · Inference',
    districtId: 'inference-center',
    title: 'D5 · Inference Engine',
    summary:
      'Low-latency prefill/decode execution, vLLM PagedAttention KV-cache management, and quantization.',
    plainExplanation:
      'Pulls frozen weights from D4 to execute compute-bound O(L²) prefill and HBM-bandwidth-bound O(L) autoregressive token decoding with zero external KV-cache fragmentation.',
    keyConcept: 'MEMORY-BANDWIDTH-BOUND (HBM GB/s)',
    keyConceptDefinition:
      'Prefill: Compute-Bound O(L^2) Matrix-Matrix | Decode: Memory-BW-Bound O(L) Matrix-Vector | KV Block Size: 16 tokens (PagedAttention)',
  },
  {
    id: 'agentic-mcp',
    stepNumber: 6,
    label: 'D6 · Agentic MCP',
    districtId: 'nlp-district',
    title: 'D6 · Agentic & MCP Orchestrator',
    summary:
      'Multi-step ReAct planning, JSON-RPC 2.0 tool routing, and episodic/working memory.',
    plainExplanation:
      'Coordinates cyclic LangGraph state machines (Thought → Action → Observation) and dispatches standardized Model Context Protocol (MCP) tool calls to external data sources.',
    keyConcept: 'NETWORK / IOPS-BOUND',
    keyConceptDefinition:
      'Protocol: MCP JSON-RPC 2.0 over stdio/SSE | Loop: Thought -> Action (Tool Call) -> Observation -> Grounded Synthesis',
  },
  {
    id: 'guardrails-eval',
    stepNumber: 7,
    label: 'D7 · Guardrails',
    districtId: 'computer-vision',
    title: 'D7 · Guardrails & Eval Gate',
    summary:
      'Input prompt-injection shield, PII redaction, and output RAGAS NLI faithfulness verification.',
    plainExplanation:
      'Enforces dual-gate safety: blocks adversarial prompt injections in <4ms at ingress and verifies atomic claim NLI entailment (Faithfulness >= 0.90) before tokens reach the user.',
    keyConcept: 'COMPUTE-BOUND (TFLOPs)',
    keyConceptDefinition:
      'Input Gate: Prompt-Injection Classifier (<4ms) | Output Gate: Decomposed Claim NLI Entailment (Faithfulness >= 0.90)',
  },
  {
    id: 'output',
    stepNumber: 8,
    label: 'D8 · Output Nexus',
    districtId: 'output-terminal',
    title: 'D8 · Output Nexus & Telemetry',
    summary:
      'SSE token streaming, Redis semantic caching, OpenTelemetry tracing, and production data flywheel.',
    plainExplanation:
      'Streams detokenized UTF-8 chunks via HTTP/2 Server-Sent Events (SSE), serves semantic cache hits in 3ms, and exports mode-specific TTFT/TPOT/MFU telemetry to Prometheus.',
    keyConcept: 'NETWORK / IOPS-BOUND',
    keyConceptDefinition:
      'Egress: HTTP/2 SSE Text-Event-Stream | Telemetry: OpenTelemetry GenAI Spans -> Prometheus TSDB',
  },
];

export interface DemoJourneyStep {
  stepIndex: number;
  districtId: DistrictId;
  activePathIds: string[];
  headline: string;
  narration: string;
  packetSample: string;
  durationMs: number;
}

export interface DemoScenario {
  id: string;
  name: string;
  badge: string;
  samplePrompt: string;
  sampleOutput: string;
}

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'multimodal-bird',
    name: 'Vision + Text: Wildlife ID',
    badge: 'Online Inference',
    samplePrompt: 'Image: kingfisher.jpg + "Identify species & river habitat"',
    sampleOutput:
      'Common Kingfisher (Alcedo atthis) — 99.2% confidence. Inhabits slow-flowing clear rivers.',
  },
  {
    id: 'nlp-reasoning',
    name: 'Agentic MCP: CUDA Kernel Synthesis',
    badge: 'Agentic Loop',
    samplePrompt: 'Prompt: "Write an optimized CUDA kernel for matrix attention"',
    sampleOutput:
      'Generated flash_attention_kernel.cu (1.42x speedup verified via MCP sandbox).',
  },
  {
    id: 'cv-autonomous',
    name: 'Vision: Autonomous Lidar Scan',
    badge: 'Low-Latency',
    samplePrompt: 'Stream: 60FPS stereo camera + point-cloud frame #4092',
    sampleOutput:
      '3D Bounding Boxes: [Pedestrian: 14.2m, Cyclist: 8.6m] — Safe Trajectory Locked.',
  },
];

/**
 * Online Inference & Agentic Loop Demo Journey:
 * Strictly follows D1 -> D7 -> D6 <-> D2 -> D4/D5 -> D7 -> D8 (D3 Training is Standby/Offline!).
 */
export const DEMO_JOURNEY_STEPS: DemoJourneyStep[] = [
  {
    stepIndex: 0,
    districtId: 'input-gateway',
    activePathIds: ['path-input-datalake'],
    headline: 'Step 1/6 · D1 Ingress: BPE Tokenization & ViT 16×16 Patch Projection',
    narration:
      'POST /v1/chat/multimodal arrives at D1 Ingress. Raw RGB [1, 3, 1024, 1024] is projected into 256 ViT patches (FP16) alongside BPE Token IDs.',
    packetSample:
      'gRPC Protobuf: PatchTensor[1, 256, 1152] (FP16) + Tokens[1, 18] (int32)',
    durationMs: 3600,
  },
  {
    stepIndex: 1,
    districtId: 'computer-vision',
    activePathIds: ['path-datalake-cv', 'path-cv-core'],
    headline: 'Step 2/6 · D7 Input Guardrail: Prompt-Injection & PII Shield (<4ms)',
    narration:
      'Before invoking any agent or model, D7 Guardrails scans the multimodal payload for adversarial prompt injections and PII leakage.',
    packetSample:
      'GUARDRAIL_INPUT_GATE: InjectionScore=0.002 (<0.15 threshold) -> ALLOW',
    durationMs: 3400,
  },
  {
    stepIndex: 2,
    districtId: 'nlp-district',
    activePathIds: ['path-datalake-nlp', 'path-nlp-core'],
    headline: 'Step 3/6 · D6 Agentic Planner: MCP JSON-RPC 2.0 Tool Dispatch',
    narration:
      'D6 Agentic Orchestrator formulates a ReAct plan and dispatches a JSON-RPC 2.0 MCP tool call to retrieve ornithology context from D2 Vector Vault.',
    packetSample:
      'MCP_CALL: {"method":"tools/call","params":{"name":"hybrid_search","ef":64}}',
    durationMs: 3600,
  },
  {
    stepIndex: 3,
    districtId: 'data-lake',
    activePathIds: ['path-input-datalake', 'path-datalake-nlp'],
    headline: 'Step 4/6 · D2 Vector Vault: Hybrid HNSW + BM25 RRF Retrieval (6.4ms)',
    narration:
      'D2 executes O(log N) HNSW graph traversal (M=16, ef=64) fused with BM25 lexical search, returning Top-K grounded passages (D3 Training remains Offline).',
    packetSample:
      'HYBRID_RRF_HIT: 4 chunks (Cosine=0.94, Recall@10=94.8%, Latency=6.4ms)',
    durationMs: 3600,
  },
  {
    stepIndex: 4,
    districtId: 'inference-center',
    activePathIds: ['path-core-inference', 'path-inference-output'],
    headline: 'Step 5/6 · D5 Inference Engine: Prefill & PagedAttention Decode',
    narration:
      'Pulling frozen FP8/AWQ weights from D4 Model Core, D5 executes compute-bound prefill (TTFT 46.8ms) and HBM-bound decode (TPOT 11.4ms/tok).',
    packetSample:
      'vLLM_PAGED_DECODE: BlockSize=16 · TTFT=46.8ms · TPOT=11.4ms/tok (88 tok/s)',
    durationMs: 3800,
  },
  {
    stepIndex: 5,
    districtId: 'output-terminal',
    activePathIds: ['path-inference-output'],
    headline: 'Step 6/6 · D8 Output Nexus: NLI Verified HTTP/2 SSE Stream',
    narration:
      'Verified claims pass D7 Output Faithfulness Gate (RAGAS 0.96) and stream to the client over HTTP/2 SSE while exporting OpenTelemetry spans.',
    packetSample:
      'SSE EGRESS: data: {"species":"Alcedo atthis","faithfulness":0.96,"e2e_p99_ms":412}',
    durationMs: 4000,
  },
];
