import type { DistrictId } from './districts.ts';
import type {
  ArchitecturalPipelineModeId,
  ArchitecturalPipelineModeSpec,
  DistrictTechnicalSpec,
} from '../types/pipeline-modes.ts';

export const CANONICAL_DISTRICT_SPECS: Record<
  DistrictId,
  DistrictTechnicalSpec
> = {
  'input-gateway': {
    districtId: 'input-gateway',
    code: 'D1',
    stepNumber: 1,
    canonicalName: 'Ingress & Multimodal Gateway',
    shortName: 'D1 · Ingress',
    coreResponsibility:
      'API termination, BPE tokenization, ViT 16×16 patchification, OCR/ASR normalization',
    dominantHardwareBound: 'Network I/O & CPU SIMD',
    hardwareBottleneckBadge: 'NETWORK / IOPS-BOUND',
    primaryProductionStack: ['FastAPI', 'gRPC', 'Tiktoken', 'ImageTensor'],
    wireProtocolAndTensorSpec:
      'Input: Raw RGB [B, 3, 1024, 1024] + UTF-8 String -> Output: Patch Tensor [B, 256, 1152] (FP16) + Token IDs [B, L] (int32) via gRPC Protobuf',
    modeRoleSummary: {
      'online-inference':
        'Terminates TLS/HTTP2 connections, validates Pydantic v2 schemas, tokenizes UTF-8 prompts via BPE, and projects 1024×1024 RGB images into 16×16 ViT patch tensors.',
      'offline-indexing':
        'Ingests high-throughput batch streams of video keyframes and PDF documents, running perceptual pHash deduplication and async OCR extraction.',
      'offline-training':
        'ISOLATED IN TRAINING MODE: Public user API ingress is decoupled from the offline pre-training and alignment cluster to prevent noisy-neighbor I/O contention.',
    },
  },
  'data-lake': {
    districtId: 'data-lake',
    code: 'D2',
    stepNumber: 2,
    canonicalName: 'Data Lake & Vector Vault',
    shortName: 'D2 · Vector Vault',
    coreResponsibility:
      'Unstructured lakehouse storage, dense embeddings, ANN graph + sparse indexing',
    dominantHardwareBound: 'RAM Capacity & Disk IOPS',
    hardwareBottleneckBadge: 'NETWORK / IOPS-BOUND',
    primaryProductionStack: [
      'Milvus',
      'FAISS',
      'pgvector (HNSW)',
      'BM25',
    ],
    wireProtocolAndTensorSpec:
      'Query: Normalized Embedding [1, 1152] (FP16) -> Index: HNSW (M=16, ef=64) + Inverted BM25 -> Output: Top-K Context Chunks (Cosine > 0.82)',
    modeRoleSummary: {
      'online-inference':
        'Executes sub-10ms Hybrid Retrieval combining HNSW logarithmic graph traversal (efSearch=64) and inverted BM25 lexical search via Reciprocal Rank Fusion (RRF).',
      'offline-indexing':
        'Constructs multi-layer HNSW proximity graphs (M=16, efConstruction=200), applies SQ8/IVF-PQ quantization, and commits immutable vector segments to NVMe.',
      'offline-training':
        'Streams tokenized WebDataset / Parquet shards over high-bandwidth GPUDirect Storage into the distributed FSDP/ZeRO-3 data loaders.',
    },
  },
  'training-cluster': {
    districtId: 'training-cluster',
    code: 'D3',
    stepNumber: 3,
    canonicalName: 'Training Foundry',
    shortName: 'D3 · Training',
    coreResponsibility:
      'Distributed pre-training, SFT, QLoRA, and DPO/GRPO alignment',
    dominantHardwareBound: 'GPU Tensor Core FLOPs & NVLink',
    hardwareBottleneckBadge: 'COMPUTE-BOUND (TFLOPs)',
    primaryProductionStack: [
      'PyTorch FSDP',
      'DeepSpeed ZeRO-3',
      'TRL',
      'QLoRA',
    ],
    wireProtocolAndTensorSpec:
      'Sharding: FSDP ZeRO-3 (Params + Grads + Adam FP32 States partitioned across N GPUs) -> Precision: BF16 Forward/Backward',
    modeRoleSummary: {
      'online-inference':
        'STANDBY / OFFLINE IN SERVING MODE: Online user requests never pass through backpropagation or gradient descent; weights are frozen during inference.',
      'offline-indexing':
        'STANDBY IN ETL INDEXING MODE: Embedding extraction uses frozen encoders on the Inference Engine rather than gradient-updating training nodes.',
      'offline-training':
        'Executes compute-bound BF16 forward/backward passes and synchronizes sharded gradients across 64× H100 GPUs via NVLink All-Gather and Reduce-Scatter collectives.',
    },
  },
  'model-core': {
    districtId: 'model-core',
    code: 'D4',
    stepNumber: 4,
    canonicalName: 'Model Core & Registry',
    shortName: 'D4 · Model Core',
    coreResponsibility:
      'Foundation model backbones (Transformer/MoE, CLIP/SigLIP) & frozen weights',
    dominantHardwareBound: 'HBM Capacity & Weight Storage',
    hardwareBottleneckBadge: 'MEMORY-BANDWIDTH-BOUND (HBM GB/s)',
    primaryProductionStack: [
      'Safetensors',
      'FlashAttention-2',
      'RoPE',
      'Sparse MoE',
    ],
    wireProtocolAndTensorSpec:
      'Backbone: GQA (8 KV heads, 32 Q heads) + RoPE (theta=1e6) + SwiGLU FFN + FlashAttention-2 IO-Aware Tiling',
    modeRoleSummary: {
      'online-inference':
        'Serves immutable, version-locked Safetensors model weights (FP8 / INT4 AWQ) and Multimodal Projector matrices to the active Inference Engine.',
      'offline-indexing':
        'Provides frozen SigLIP-So400m / CLIP ViT-L/14 dual-encoder backbones for deterministic batch vector embedding extraction.',
      'offline-training':
        'Receives periodic sharded Safetensors checkpoints from the Training Foundry and tracks lineage across pre-training, SFT, and DPO stages.',
    },
  },
  'inference-center': {
    districtId: 'inference-center',
    code: 'D5',
    stepNumber: 5,
    canonicalName: 'Inference Engine',
    shortName: 'D5 · Inference',
    coreResponsibility:
      'Low-latency prefill/decode execution, KV-cache management, quantization',
    dominantHardwareBound: 'Compute (Prefill) / HBM BW (Decode)',
    hardwareBottleneckBadge: 'MEMORY-BANDWIDTH-BOUND (HBM GB/s)',
    primaryProductionStack: [
      'Triton Server',
      'vLLM (PagedAttention)',
      'ONNX/TRT',
    ],
    wireProtocolAndTensorSpec:
      'Prefill: Compute-Bound O(L^2) Matrix-Matrix | Decode: Memory-BW-Bound O(L) Matrix-Vector | KV Block Size: 16 tokens (PagedAttention)',
    modeRoleSummary: {
      'online-inference':
        'Executes compute-bound prompt prefill and memory-bandwidth-bound autoregressive token decoding with vLLM PagedAttention and continuous iteration-level batching.',
      'offline-indexing':
        'Runs high-throughput Triton dynamic batching over thousands of document chunks and video frames to saturate GPU Tensor Cores during embedding generation.',
      'offline-training':
        'ISOLATED FROM TRAINING CLUSTER: Online serving replicas remain physically partitioned from training nodes to guarantee deterministic P99 serving SLAs.',
    },
  },
  'nlp-district': {
    districtId: 'nlp-district',
    code: 'D6',
    stepNumber: 6,
    canonicalName: 'Agentic & MCP Orchestrator',
    shortName: 'D6 · Agentic MCP',
    coreResponsibility:
      'Multi-step ReAct planning, tool routing, episodic/working memory',
    dominantHardwareBound: 'Control-Flow Latency & Serialization',
    hardwareBottleneckBadge: 'NETWORK / IOPS-BOUND',
    primaryProductionStack: [
      'Model Context Protocol (MCP)',
      'LangGraph',
      'JSON-RPC 2.0',
    ],
    wireProtocolAndTensorSpec:
      'Protocol: MCP JSON-RPC 2.0 over stdio/SSE | Loop: Thought -> Action (Tool Call) -> Observation -> Grounded Synthesis',
    modeRoleSummary: {
      'online-inference':
        'Orchestrates cyclic ReAct reasoning graphs, dispatches standardized JSON-RPC 2.0 MCP tool calls to D2 Vector Vault, and maintains working session memory.',
      'offline-indexing':
        'STANDBY IN ETL INDEXING MODE: Batch indexing pipelines bypass interactive multi-turn agent state machines for maximum linear throughput.',
      'offline-training':
        'ISOLATED FROM TRAINING CLUSTER: Agentic tool-calling trajectories are logged offline to D2 Data Lake for future GRPO/RLHF policy optimization.',
    },
  },
  'computer-vision': {
    districtId: 'computer-vision',
    code: 'D7',
    stepNumber: 7,
    canonicalName: 'Guardrails & Eval Gate',
    shortName: 'D7 · Guardrails',
    coreResponsibility:
      'Input prompt-injection shield, PII redaction, output NLI faithfulness check',
    dominantHardwareBound: 'Low-Latency Classifier Overhead',
    hardwareBottleneckBadge: 'COMPUTE-BOUND (TFLOPs)',
    primaryProductionStack: ['RAGAS', 'NeMo Guardrails', 'Pydantic v2'],
    wireProtocolAndTensorSpec:
      'Input Gate: Prompt-Injection Classifier (<4ms) | Output Gate: Decomposed Claim NLI Entailment (Faithfulness >= 0.90)',
    modeRoleSummary: {
      'online-inference':
        'Enforces dual-gate safety: blocks jailbreaks/PII at ingress (<4ms) and verifies NLI entailment faithfulness (>=0.90) on generated claims before streaming.',
      'offline-indexing':
        'Scans ingested documents and images for PII leakage and poison signatures before vectors are committed to the production HNSW index.',
      'offline-training':
        'Runs automated post-checkpoint evaluation suites (RAGAS, MMLU, multimodal hallucination benchmarks) to gate model promotion into D4 Registry.',
    },
  },
  'output-terminal': {
    districtId: 'output-terminal',
    code: 'D8',
    stepNumber: 8,
    canonicalName: 'Output Nexus & Telemetry',
    shortName: 'D8 · Output & Telemetry',
    coreResponsibility:
      'SSE token streaming, semantic caching, OpenTelemetry tracing, data flywheel',
    dominantHardwareBound: 'Network Egress & Time-Series Ingest',
    hardwareBottleneckBadge: 'NETWORK / IOPS-BOUND',
    primaryProductionStack: [
      'SSE / WebSockets',
      'Prometheus',
      'Grafana',
      'Redis Cache',
    ],
    wireProtocolAndTensorSpec:
      'Egress: HTTP/2 SSE Text-Event-Stream | Telemetry: OpenTelemetry GenAI Spans -> Prometheus TSDB',
    modeRoleSummary: {
      'online-inference':
        'Streams detokenized UTF-8 chunks via HTTP/2 Server-Sent Events (SSE), serves Redis semantic cache hits in 3ms, and exports OpenTelemetry TTFT/TPOT spans.',
      'offline-indexing':
        'Publishes HNSW shard build progress, vector recall metrics, and NVMe write IOPS telemetry to Prometheus and Grafana dashboards.',
      'offline-training':
        'Aggregates per-rank GPU MFU, step loss curves, gradient L2 norms, and NVLink collective communication latency across all training nodes.',
    },
  },
};

export const ARCHITECTURAL_PIPELINE_MODES: ArchitecturalPipelineModeSpec[] = [
  {
    id: 'online-inference',
    code: 'MODE A',
    shortLabel: 'Online Inference & Agentic Loop',
    title: 'ONLINE INFERENCE & AGENTIC LOOP (Latency-Critical Serving Path)',
    subtitle:
      'Real-time user requests bypass offline Training (D3 on Standby) and execute via Guardrails, Agentic MCP, Hybrid Retrieval, and vLLM/Triton Serving.',
    workloadExample:
      'POST /v1/chat/multimodal — Image: kingfisher.jpg (1024×1024) + "Identify species, river habitat & conservation status"',
    directedSequence: [
      'input-gateway',
      'computer-vision',
      'nlp-district',
      'data-lake',
      'model-core',
      'inference-center',
      'output-terminal',
    ],
    directedFlowSummary:
      'D1 (Ingress) → D7 (Input Guardrail) → D6 (Agentic Planner / MCP) ↔ D2 (Hybrid Vector Retrieval) → D5 (Inference Engine ← D4 Frozen Weights) → D7 (Output Faithfulness Gate) → D8 (SSE Token Stream)',
    activeDistricts: [
      'input-gateway',
      'computer-vision',
      'nlp-district',
      'data-lake',
      'model-core',
      'inference-center',
      'output-terminal',
    ],
    standbyDistricts: ['training-cluster'],
    standbyBadgeText: 'OFFLINE IN SERVING MODE',
    activePathIds: [
      'path-input-datalake',
      'path-datalake-cv',
      'path-datalake-nlp',
      'path-nlp-core',
      'path-cv-core',
      'path-core-inference',
      'path-inference-output',
    ],
    particleColorHex: '#00F0FF',
    secondaryParticleColorHex: '#10B981',
  },
  {
    id: 'offline-indexing',
    code: 'MODE B',
    shortLabel: 'Offline Data Indexing & ETL',
    title: 'OFFLINE DATA INDEXING & ETL PIPELINE (Throughput-Critical Batch Path)',
    subtitle:
      'Batch ingestion of documents and video keyframes through frozen Triton CLIP/SigLIP encoders into HNSW + IVF-PQ vector indices.',
    workloadExample:
      'Batch Job #402 — Ingest 50,000 video keyframes & PDF technical manuals into Hybrid Vector Index',
    directedSequence: [
      'input-gateway',
      'model-core',
      'inference-center',
      'data-lake',
      'output-terminal',
    ],
    directedFlowSummary:
      'D1 (Batch Ingest, Frame Deduplication & OCR) → D5/D4 (Batch Embedding Extraction via Triton CLIP/SigLIP) → D2 (HNSW Graph Construction & IVF-PQ Quantization) → D8 (Index Shard Health Telemetry)',
    activeDistricts: [
      'input-gateway',
      'model-core',
      'inference-center',
      'data-lake',
      'output-terminal',
    ],
    standbyDistricts: ['training-cluster', 'nlp-district', 'computer-vision'],
    standbyBadgeText: 'STANDBY IN ETL MODE',
    activePathIds: [
      'path-input-datalake',
      'path-core-inference',
      'path-inference-output',
    ],
    particleColorHex: '#F59E0B',
    secondaryParticleColorHex: '#A855F7',
  },
  {
    id: 'offline-training',
    code: 'MODE C',
    shortLabel: 'Offline Distributed Training',
    title:
      'OFFLINE DISTRIBUTED TRAINING & ALIGNMENT (Compute & Interconnect-Bound Path)',
    subtitle:
      'Multi-node FSDP / ZeRO-3 gradient synchronization across D2 Parquet Shards, D3 Training Foundry, and D4 Checkpoint Registry (Public Serving Isolated).',
    workloadExample:
      'Run #18: Qwen-VL-14B Domain SFT + DPO Alignment — Dataset: 12B Multimodal Tokens · 64× H100 Cluster (FSDP ZeRO-3)',
    directedSequence: [
      'data-lake',
      'training-cluster',
      'model-core',
      'computer-vision',
      'output-terminal',
    ],
    directedFlowSummary:
      'D2 (Data Lake Parquet Shards) → D3 (Training Foundry: Forward / Backward / All-Reduce) ↔ D4 (Model Core Checkpoint Registry) → D7 (Automated Eval Benchmark: RAGAS & MMLU) → D8 (Loss & MFU Telemetry)',
    activeDistricts: [
      'data-lake',
      'training-cluster',
      'model-core',
      'computer-vision',
      'output-terminal',
    ],
    standbyDistricts: ['input-gateway', 'inference-center', 'nlp-district'],
    standbyBadgeText: 'ISOLATED FROM TRAINING CLUSTER',
    activePathIds: [
      'path-datalake-training',
      'path-training-core',
      'path-cv-training',
      'path-cv-core',
    ],
    particleColorHex: '#EC4899',
    secondaryParticleColorHex: '#FDE047',
  },
];

export const ARCHITECTURAL_MODE_MAP: Record<
  ArchitecturalPipelineModeId,
  ArchitecturalPipelineModeSpec
> = {
  'online-inference': ARCHITECTURAL_PIPELINE_MODES[0],
  'offline-indexing': ARCHITECTURAL_PIPELINE_MODES[1],
  'offline-training': ARCHITECTURAL_PIPELINE_MODES[2],
};
