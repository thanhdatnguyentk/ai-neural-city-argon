import type { DistrictId } from './districts';

export type StackOptionTier = 'A' | 'B' | 'C';

export interface StackTechOption {
  id: string;
  tier: StackOptionTier;
  name: string;
  shortLabel: string;
  summary: string;
  protocolBadge: string;
  dockerImage: string;
  defaultPort: number;
  vramImpactGb: number;
  latencyDeltaMs: number;
  throughputMultiplier: number;
}

export interface DistrictStackCategory {
  slotNumber: number; // 1..8 in architectural stack order
  districtId: DistrictId;
  code: string;
  roleTitle: string;
  accentColor: string;
  defaultOptionId: string;
  options: [StackTechOption, StackTechOption, StackTechOption];
}

export type StackSelectionMap = Record<DistrictId, string>;

export const STACK_CATALOG: DistrictStackCategory[] = [
  {
    slotNumber: 1,
    districtId: 'input-gateway',
    code: 'D1',
    roleTitle: 'D1: Input Gateway',
    accentColor: '#00F0FF',
    defaultOptionId: 'd1-fastapi',
    options: [
      {
        id: 'd1-fastapi',
        tier: 'A',
        name: 'FastAPI + AsyncIO + Pydantic v2',
        shortLabel: 'FastAPI + Pydantic v2',
        summary:
          'High-concurrency ASGI gateway with Rust-backed Pydantic v2 schema validation and multipart tensor streaming.',
        protocolBadge: 'HTTP/2 + ASGI',
        dockerImage: 'tiangolo/uvicorn-gunicorn-fastapi:python3.11',
        defaultPort: 8000,
        vramImpactGb: 0.5,
        latencyDeltaMs: 2.1,
        throughputMultiplier: 1.0,
      },
      {
        id: 'd1-grpc',
        tier: 'B',
        name: 'gRPC + Protobuf Stream',
        shortLabel: 'gRPC + Protobuf',
        summary:
          'Zero-copy binary Protobuf serialization over HTTP/2 bidirectional streams for ultra-low-latency frame/token ingress.',
        protocolBadge: 'gRPC HTTP/2',
        dockerImage: 'grpc/python:1.62',
        defaultPort: 50051,
        vramImpactGb: 0.5,
        latencyDeltaMs: 0.9,
        throughputMultiplier: 1.35,
      },
      {
        id: 'd1-kafka',
        tier: 'C',
        name: 'Apache Kafka + Workers',
        shortLabel: 'Kafka Event Stream',
        summary:
          'Partitioned event-driven ingestion bus decoupling high-burst video/telemetry producers from GPU workers.',
        protocolBadge: 'Kafka TCP',
        dockerImage: 'bitnami/kafka:3.7',
        defaultPort: 9092,
        vramImpactGb: 1.0,
        latencyDeltaMs: 4.5,
        throughputMultiplier: 1.8,
      },
    ],
  },
  {
    slotNumber: 2,
    districtId: 'data-lake',
    code: 'D2',
    roleTitle: 'D2: Vector Vault',
    accentColor: '#00F0FF',
    defaultOptionId: 'd2-pgvector',
    options: [
      {
        id: 'd2-pgvector',
        tier: 'A',
        name: 'PostgreSQL 16 + pgvector (HNSW)',
        shortLabel: 'pgvector (HNSW)',
        summary:
          'Unified relational ACID metadata + HNSW cosine vector index with single-query hybrid filtering.',
        protocolBadge: 'HNSW Cosine',
        dockerImage: 'pgvector/pgvector:pg16',
        defaultPort: 5432,
        vramImpactGb: 2.0,
        latencyDeltaMs: 4.2,
        throughputMultiplier: 1.0,
      },
      {
        id: 'd2-milvus',
        tier: 'B',
        name: 'Milvus Distributed (IVF-PQ / HNSW)',
        shortLabel: 'Milvus Distributed',
        summary:
          'Cloud-native distributed vector engine supporting billion-scale IVF-PQ and diskANN hybrid search.',
        protocolBadge: 'Milvus gRPC',
        dockerImage: 'milvusdb/milvus:v2.4.0',
        defaultPort: 19530,
        vramImpactGb: 4.0,
        latencyDeltaMs: 2.8,
        throughputMultiplier: 1.5,
      },
      {
        id: 'd2-faiss-es',
        tier: 'C',
        name: 'FAISS GPU + Elasticsearch Hybrid',
        shortLabel: 'FAISS GPU + ES BM25',
        summary:
          'GPU-accelerated FAISS dense similarity fused with Elasticsearch BM25 lexical/OCR retrieval via Reciprocal Rank Fusion.',
        protocolBadge: 'FAISS CUDA + BM25',
        dockerImage: 'docker.elastic.co/elasticsearch/elasticsearch:8.13.0',
        defaultPort: 9200,
        vramImpactGb: 6.0,
        latencyDeltaMs: 1.9,
        throughputMultiplier: 1.65,
      },
    ],
  },
  {
    slotNumber: 3,
    districtId: 'training-cluster',
    code: 'D3',
    roleTitle: 'D3: Training Foundry',
    accentColor: '#8B5CF6',
    defaultOptionId: 'd3-fsdp-qlora',
    options: [
      {
        id: 'd3-fsdp-qlora',
        tier: 'A',
        name: 'PyTorch FSDP + QLoRA (PEFT)',
        shortLabel: 'PyTorch FSDP + QLoRA',
        summary:
          '4-bit NormalFloat (NF4) base weights with sharded low-rank adapters and BF16 mixed-precision gradients.',
        protocolBadge: 'NCCL AllGather',
        dockerImage: 'pytorch/pytorch:2.3.0-cuda12.1-cudnn8-devel',
        defaultPort: 29500,
        vramImpactGb: 14.0,
        latencyDeltaMs: 0,
        throughputMultiplier: 1.1,
      },
      {
        id: 'd3-deepspeed',
        tier: 'B',
        name: 'DeepSpeed ZeRO-3 + FlashAttn-2',
        shortLabel: 'DeepSpeed ZeRO-3',
        summary:
          'Full parameter, gradient, and optimizer state partitioning across GPUs with IO-aware FlashAttention-2 kernels.',
        protocolBadge: 'NVLink ZeRO-3',
        dockerImage: 'nvcr.io/nvidia/pytorch:24.04-py3',
        defaultPort: 29500,
        vramImpactGb: 24.0,
        latencyDeltaMs: 0,
        throughputMultiplier: 1.35,
      },
      {
        id: 'd3-unsloth',
        tier: 'C',
        name: 'Unsloth + TRL (DPO / GRPO)',
        shortLabel: 'Unsloth + TRL DPO',
        summary:
          'Custom Triton fused backprop kernels delivering 2x faster post-training alignment (DPO/GRPO) with 60% less VRAM.',
        protocolBadge: 'Triton Kernels',
        dockerImage: 'unsloth/unsloth:latest',
        defaultPort: 29500,
        vramImpactGb: 10.0,
        latencyDeltaMs: 0,
        throughputMultiplier: 1.25,
      },
    ],
  },
  {
    slotNumber: 4,
    districtId: 'model-core',
    code: 'D4',
    roleTitle: 'D4: Model Core',
    accentColor: '#A855F7',
    defaultOptionId: 'd4-multimodal-clip',
    options: [
      {
        id: 'd4-multimodal-clip',
        tier: 'A',
        name: 'Multimodal Dual-Encoder (CLIP / SigLIP + LLM)',
        shortLabel: 'CLIP / SigLIP + LLM',
        summary:
          'Contrastive vision-language encoders aligned into a shared latent space paired with a cross-modal LLM decoder.',
        protocolBadge: 'Cross-Attention',
        dockerImage: 'huggingface/transformers-pytorch-gpu:latest',
        defaultPort: 8081,
        vramImpactGb: 16.0,
        latencyDeltaMs: 6.4,
        throughputMultiplier: 1.2,
      },
      {
        id: 'd4-dense-llm',
        tier: 'B',
        name: 'Dense Transformer (Qwen / Llama 8B-70B)',
        shortLabel: 'Dense Qwen/Llama',
        summary:
          'Grouped-Query Attention (GQA) dense decoder transformer with RoPE long-context scaling and SwiGLU FFN.',
        protocolBadge: 'GQA + RoPE',
        dockerImage: 'huggingface/text-generation-inference:2.0',
        defaultPort: 8081,
        vramImpactGb: 22.0,
        latencyDeltaMs: 8.5,
        throughputMultiplier: 1.0,
      },
      {
        id: 'd4-sparse-moe',
        tier: 'C',
        name: 'Sparse MoE Backbone (Mixtral / DeepSeek)',
        shortLabel: 'Sparse MoE Router',
        summary:
          'Top-2 / Multi-Head Latent Attention (MLA) Mixture-of-Experts activating only a fraction of parameters per token.',
        protocolBadge: 'MoE Top-K Gate',
        dockerImage: 'vllm/vllm-openai:latest',
        defaultPort: 8081,
        vramImpactGb: 32.0,
        latencyDeltaMs: 5.2,
        throughputMultiplier: 1.45,
      },
    ],
  },
  {
    slotNumber: 5,
    districtId: 'inference-center',
    code: 'D5',
    roleTitle: 'D5: Inference Engine',
    accentColor: '#EC4899',
    defaultOptionId: 'd5-triton-onnx',
    options: [
      {
        id: 'd5-triton-onnx',
        tier: 'A',
        name: 'Triton Inference Server + ONNX Runtime',
        shortLabel: 'Triton + ONNX Runtime',
        summary:
          'Multi-model ensemble serving with dynamic batching, concurrent execution, and graph-optimized ONNX/CUDA execution providers.',
        protocolBadge: 'ONNX / Triton gRPC',
        dockerImage: 'nvcr.io/nvidia/tritonserver:24.04-py3',
        defaultPort: 8001,
        vramImpactGb: 8.0,
        latencyDeltaMs: 3.8,
        throughputMultiplier: 1.4,
      },
      {
        id: 'd5-vllm',
        tier: 'B',
        name: 'vLLM (PagedAttention + FP8/AWQ)',
        shortLabel: 'vLLM PagedAttention',
        summary:
          'Non-contiguous KV-cache block paging with continuous iteration-level batching and speculative decoding.',
        protocolBadge: 'PagedAttention',
        dockerImage: 'vllm/vllm-openai:v0.5.0',
        defaultPort: 8080,
        vramImpactGb: 12.0,
        latencyDeltaMs: 4.5,
        throughputMultiplier: 1.6,
      },
      {
        id: 'd5-tensorrt',
        tier: 'C',
        name: 'TensorRT-LLM (INT4 / FP8 Engine)',
        shortLabel: 'TensorRT-LLM Engine',
        summary:
          'Ahead-of-time compiled CUDA kernel fusion, in-flight batching, and FP8 Tensor Core quantization for minimum P99 latency.',
        protocolBadge: 'TensorRT-LLM FP8',
        dockerImage: 'nvcr.io/nvidia/tritonserver:24.04-trtllm-python-py3',
        defaultPort: 8001,
        vramImpactGb: 7.0,
        latencyDeltaMs: 2.4,
        throughputMultiplier: 1.85,
      },
    ],
  },
  {
    slotNumber: 6,
    districtId: 'nlp-district',
    code: 'D6',
    roleTitle: 'D6: Agentic & Memory',
    accentColor: '#38BDF8',
    defaultOptionId: 'd6-mcp-langgraph',
    options: [
      {
        id: 'd6-mcp-langgraph',
        tier: 'A',
        name: 'Model Context Protocol (MCP) + LangGraph',
        shortLabel: 'MCP + LangGraph',
        summary:
          'Stateful cyclic agent graph orchestrating standardized JSON-RPC Model Context Protocol tool servers and checkpoints.',
        protocolBadge: 'MCP JSON-RPC 2.0',
        dockerImage: 'langchain/langgraph-api:0.1',
        defaultPort: 8100,
        vramImpactGb: 1.0,
        latencyDeltaMs: 3.2,
        throughputMultiplier: 1.15,
      },
      {
        id: 'd6-react-redis',
        tier: 'B',
        name: 'ReAct Native Function Calling + Redis',
        shortLabel: 'ReAct + Redis Memory',
        summary:
          'Low-overhead Reason+Act tool loop backed by sub-millisecond Redis semantic cache and session state.',
        protocolBadge: 'RESP3 + ToolCall',
        dockerImage: 'redis/redis-stack-server:7.2.0-v10',
        defaultPort: 6379,
        vramImpactGb: 1.0,
        latencyDeltaMs: 1.8,
        throughputMultiplier: 1.3,
      },
      {
        id: 'd6-multi-agent-swarm',
        tier: 'C',
        name: 'Hierarchical Multi-Agent Swarm',
        shortLabel: 'Multi-Agent Swarm',
        summary:
          'Supervisor-worker agent topology with parallel task delegation, isolated sandboxes, and consensus verification.',
        protocolBadge: 'Swarm DAG',
        dockerImage: 'langchain/langgraph-api:0.1',
        defaultPort: 8100,
        vramImpactGb: 2.5,
        latencyDeltaMs: 7.5,
        throughputMultiplier: 0.95,
      },
    ],
  },
  {
    slotNumber: 7,
    districtId: 'computer-vision',
    code: 'D7',
    roleTitle: 'D7: Guardrails & Eval',
    accentColor: '#38BDF8',
    defaultOptionId: 'd7-ragas-pydantic',
    options: [
      {
        id: 'd7-ragas-pydantic',
        tier: 'A',
        name: 'RAGAS Evaluation + Pydantic Guard',
        shortLabel: 'RAGAS + Pydantic Guard',
        summary:
          'Automated faithfulness/context-precision scoring paired with deterministic JSON-Schema output validation.',
        protocolBadge: 'RAGAS + JSON Schema',
        dockerImage: 'python:3.11-slim',
        defaultPort: 8200,
        vramImpactGb: 1.5,
        latencyDeltaMs: 2.2,
        throughputMultiplier: 1.1,
      },
      {
        id: 'd7-nemo-llamaguard',
        tier: 'B',
        name: 'NeMo Guardrails + Llama Guard 3',
        shortLabel: 'NeMo + Llama Guard 3',
        summary:
          'Programmable Colang dialog rails and hardware-accelerated safety classification blocking jailbreaks and PII leaks.',
        protocolBadge: 'Colang Safety Rail',
        dockerImage: 'nvcr.io/nvidia/nemo:24.03',
        defaultPort: 8200,
        vramImpactGb: 4.0,
        latencyDeltaMs: 3.9,
        throughputMultiplier: 1.0,
      },
      {
        id: 'd7-llm-judge',
        tier: 'C',
        name: 'LLM-as-a-Judge + Prompt Shield',
        shortLabel: 'LLM-Judge + Shield',
        summary:
          'Real-time adversarial prompt injection classifier and pairwise rubric evaluation pipeline.',
        protocolBadge: 'Prompt Shield',
        dockerImage: 'python:3.11-slim',
        defaultPort: 8200,
        vramImpactGb: 3.0,
        latencyDeltaMs: 3.1,
        throughputMultiplier: 1.05,
      },
    ],
  },
  {
    slotNumber: 8,
    districtId: 'output-terminal',
    code: 'D8',
    roleTitle: 'D8: Output & MLOps',
    accentColor: '#F59E0B',
    defaultOptionId: 'd8-docker-prom-grafana',
    options: [
      {
        id: 'd8-docker-prom-grafana',
        tier: 'A',
        name: 'Docker Compose + Prometheus + Grafana',
        shortLabel: 'Docker + Prometheus',
        summary:
          'Reproducible multi-container runtime with DCGM GPU exporter, Prometheus time-series scraping, and Grafana SLA dashboards.',
        protocolBadge: 'SSE + PromQL',
        dockerImage: 'prom/prometheus:v2.51.0',
        defaultPort: 9090,
        vramImpactGb: 0.5,
        latencyDeltaMs: 1.0,
        throughputMultiplier: 1.0,
      },
      {
        id: 'd8-otel-langfuse',
        tier: 'B',
        name: 'OpenTelemetry + Langfuse Tracing',
        shortLabel: 'OTel + Langfuse',
        summary:
          'Distributed span tracing across prompt templates, MCP tool invocations, token costs, and retrieval latency.',
        protocolBadge: 'OTLP gRPC',
        dockerImage: 'langfuse/langfuse:2',
        defaultPort: 3000,
        vramImpactGb: 0.5,
        latencyDeltaMs: 1.2,
        throughputMultiplier: 1.05,
      },
      {
        id: 'd8-k8s-envoy',
        tier: 'C',
        name: 'Kubernetes + Envoy Canary Router',
        shortLabel: 'K8s + Envoy Canary',
        summary:
          'Autoscaled GPU node pools with Envoy shadow traffic mirroring and automated canary rollback on P99 degradation.',
        protocolBadge: 'Envoy xDS + SSE',
        dockerImage: 'envoyproxy/envoy:v1.30-latest',
        defaultPort: 10000,
        vramImpactGb: 0.5,
        latencyDeltaMs: 0.8,
        throughputMultiplier: 1.4,
      },
    ],
  },
];

export const DEFAULT_STACK_SELECTIONS: StackSelectionMap =
  STACK_CATALOG.reduce((acc, item) => {
    acc[item.districtId] = item.defaultOptionId;
    return acc;
  }, {} as StackSelectionMap);

/**
 * Maps architectural slot number (1..8) to the corresponding DistrictId.
 */
export const SLOT_TO_DISTRICT_ID: Record<number, DistrictId> = {
  1: 'input-gateway',
  2: 'data-lake',
  3: 'training-cluster',
  4: 'model-core',
  5: 'inference-center',
  6: 'nlp-district',
  7: 'computer-vision',
  8: 'output-terminal',
};

export function getSelectedOptionForDistrict(
  districtId: DistrictId,
  selections: StackSelectionMap
): StackTechOption {
  const category = STACK_CATALOG.find((c) => c.districtId === districtId);
  if (!category) {
    return STACK_CATALOG[0].options[0];
  }
  const chosenId = selections[districtId] || category.defaultOptionId;
  return (
    category.options.find((o) => o.id === chosenId) || category.options[0]
  );
}

export function normalizeStackFromSlots(
  slotRecord: Record<number, string>
): StackSelectionMap {
  const next: StackSelectionMap = { ...DEFAULT_STACK_SELECTIONS };
  for (const [slotStr, val] of Object.entries(slotRecord)) {
    const slotNum = Number(slotStr);
    const districtId = SLOT_TO_DISTRICT_ID[slotNum];
    if (!districtId) continue;
    const category = STACK_CATALOG.find((c) => c.districtId === districtId);
    if (!category) continue;
    const matched = category.options.find(
      (opt) =>
        opt.id === val ||
        opt.name.toLowerCase().includes(val.toLowerCase()) ||
        opt.shortLabel.toLowerCase().includes(val.toLowerCase())
    );
    if (matched) {
      next[districtId] = matched.id;
    }
  }
  return next;
}
