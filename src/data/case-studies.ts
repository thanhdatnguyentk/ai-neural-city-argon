import type { DistrictId } from './districts';
import type { WorkloadPresetId } from './bottleneck-scenarios';
import type { StackSelectionMap } from './stack-catalog';
import type { LanguageCode } from './locales';

export interface CaseStudyDistrictHighlight {
  districtId: DistrictId;
  code: string;
  roleTitle: string;
  implementationDetail: string;
  protocolBadge: string;
}

export interface CaseStudyBlueprint {
  id: string;
  numberBadge: string;
  title: Record<LanguageCode, string>;
  subtitle: Record<LanguageCode, string>;
  problemStatement: Record<LanguageCode, string>;
  accentColor: string;
  workloadPresetId: WorkloadPresetId;
  activeDistricts: DistrictId[];
  activePathIds: string[];
  stackSelections: StackSelectionMap;
  metrics: {
    label: string;
    value: string;
  }[];
  districtArchitecture: CaseStudyDistrictHighlight[];
}

export const CASE_STUDIES: CaseStudyBlueprint[] = [
  {
    id: 'case-study-01-video-retrieval',
    numberBadge: 'CASE STUDY 01',
    title: {
      en: 'Intelligent Multimodal Video & Image Retrieval System',
      vi: 'Hệ Thống Truy Xuất Video & Hình Ảnh Đa Phương Thức Thông Minh',
      ja: 'インテリジェント・マルチモーダル映像・画像検索システム',
    },
    subtitle: {
      en: 'CLIP / SigLIP + FAISS GPU / Milvus + Elasticsearch BM25 + ONNX / Triton',
      vi: 'CLIP / SigLIP + FAISS GPU / Milvus + Elasticsearch BM25 + ONNX / Triton',
      ja: 'CLIP / SigLIP + FAISS GPU / Milvus + Elasticsearch BM25 + ONNX / Triton',
    },
    problemStatement: {
      en: 'Searching complex events across hundreds of hours of video and millions of keyframes with semantic text queries and OCR filters under strict <30ms latency budgets.',
      vi: 'Truy vấn sự kiện phức tạp trên hàng trăm giờ video và hàng triệu khung hình (keyframes) bằng ngữ nghĩa tự nhiên kết hợp bộ lọc OCR với độ trễ P99 dưới 30ms.',
      ja: '数百時間の映像・数百万のキーフレームから、意味検索とOCRテキストフィルタを組み合わせて30ms以下の低遅延で目的シーンを特定する。',
    },
    accentColor: '#00F0FF',
    workloadPresetId: 'multimodal-vision',
    activeDistricts: [
      'input-gateway',
      'data-lake',
      'model-core',
      'inference-center',
      'output-terminal',
    ],
    activePathIds: [
      'path-input-datalake',
      'path-datalake-cv',
      'path-cv-core',
      'path-core-inference',
      'path-inference-output',
    ],
    stackSelections: {
      'input-gateway': 'd1-grpc',
      'data-lake': 'd2-faiss-es',
      'training-cluster': 'd3-fsdp-qlora',
      'model-core': 'd4-multimodal-clip',
      'inference-center': 'd5-triton-onnx',
      'nlp-district': 'd6-react-redis',
      'computer-vision': 'd7-ragas-pydantic',
      'output-terminal': 'd8-docker-prom-grafana',
    },
    metrics: [
      { label: 'P99 Retrieval Latency', value: '18.4 ms' },
      { label: 'Index Scale', value: '1.5M+ Keyframes' },
      { label: 'Recall@10', value: '91.4%' },
    ],
    districtArchitecture: [
      {
        districtId: 'input-gateway',
        code: 'D1 · Ingress',
        roleTitle: 'Keyframe Deduplication & Multilingual OCR',
        implementationDetail:
          'Extracts scene-change keyframes via FFmpeg, removes near-duplicates, extracts Vietnamese/English OCR text, and normalizes queries.',
        protocolBadge: 'gRPC + FFmpeg Stream',
      },
      {
        districtId: 'data-lake',
        code: 'D2 · Vector Vault',
        roleTitle: 'Dual-Index Hybrid Retrieval (FAISS + Elasticsearch)',
        implementationDetail:
          'Combines CLIP/SigLIP dense visual-semantic vectors in FAISS/Milvus with Elasticsearch BM25 OCR/ASR metadata via Reciprocal Rank Fusion (RRF).',
        protocolBadge: 'FAISS CUDA + BM25 RRF',
      },
      {
        districtId: 'model-core',
        code: 'D4 · Model Core',
        roleTitle: 'CLIP / SigLIP Shared Latent Projection',
        implementationDetail:
          'Maps natural language event descriptions and visual patches into a normalized L2 cosine similarity space.',
        protocolBadge: 'Cross-Modal Cosine',
      },
      {
        districtId: 'inference-center',
        code: 'D5 · Inference Engine',
        roleTitle: 'ONNX Runtime & Triton FP16 Acceleration',
        implementationDetail:
          'Serves compiled ONNX visual/text encoders on Triton Inference Server with dynamic batching and FP16 Tensor Core execution.',
        protocolBadge: 'ONNX / Triton FP16',
      },
      {
        districtId: 'output-terminal',
        code: 'D8 · Output & MLOps',
        roleTitle: 'Sub-30ms Temporal Keyframe Ranking',
        implementationDetail:
          'Streams Top-K ranked video segments with exact millisecond timestamp offsets and Prometheus latency tracking.',
        protocolBadge: 'SSE + PromQL',
      },
    ],
  },
  {
    id: 'case-study-02-agentic-mcp-rag',
    numberBadge: 'CASE STUDY 02',
    title: {
      en: 'Production Agentic Workflow with Model Context Protocol (MCP) & Hybrid RAG',
      vi: 'Hệ Thống Tác Tử Tự Hành Chuẩn Model Context Protocol (MCP) & Hybrid RAG',
      ja: 'Model Context Protocol (MCP) ＆ ハイブリッドRAGによる自律型AIエージェント基盤',
    },
    subtitle: {
      en: 'LangGraph + MCP Servers + PostgreSQL pgvector (HNSW) + RAGAS Guardrails',
      vi: 'LangGraph + MCP Servers + PostgreSQL pgvector (HNSW) + RAGAS Guardrails',
      ja: 'LangGraph + MCP Servers + PostgreSQL pgvector (HNSW) + RAGAS Guardrails',
    },
    problemStatement: {
      en: 'Building an autonomous technical assistant capable of querying internal documentation, executing deterministic database/sandbox tools via MCP, and verifying factual grounding before responding.',
      vi: 'Xây dựng trợ lý kỹ thuật tự hành có khả năng truy vấn tài liệu nội bộ, gọi công cụ cơ sở dữ liệu/sandbox chuẩn xác qua giao thức MCP và kiểm định chống ảo giác trước khi phản hồi.',
      ja: '社内ドキュメントの検索、MCP経由での安全なDB・ツール実行、および回答前のハルシネーション検証を自律的に行う技術アシスタントの構築。',
    },
    accentColor: '#38BDF8',
    workloadPresetId: 'agentic-mcp-rag',
    activeDistricts: [
      'input-gateway',
      'data-lake',
      'nlp-district',
      'model-core',
      'computer-vision',
      'output-terminal',
    ],
    activePathIds: [
      'path-input-datalake',
      'path-datalake-nlp',
      'path-nlp-core',
      'path-core-inference',
      'path-inference-output',
    ],
    stackSelections: {
      'input-gateway': 'd1-fastapi',
      'data-lake': 'd2-pgvector',
      'training-cluster': 'd3-unsloth',
      'model-core': 'd4-dense-llm',
      'inference-center': 'd5-vllm',
      'nlp-district': 'd6-mcp-langgraph',
      'computer-vision': 'd7-ragas-pydantic',
      'output-terminal': 'd8-otel-langfuse',
    },
    metrics: [
      { label: 'Hallucination Reduction', value: '-78%' },
      { label: 'Tool Call Accuracy', value: '96.8%' },
      { label: 'Time-To-First-Token', value: '240 ms' },
    ],
    districtArchitecture: [
      {
        districtId: 'input-gateway',
        code: 'D1 · Ingress',
        roleTitle: 'Semantic Chunking & Pydantic v2 Ingress',
        implementationDetail:
          'Parses technical Markdown/PDF docs into context-aware chunks and validates user tool-use intents.',
        protocolBadge: 'FastAPI + Pydantic v2',
      },
      {
        districtId: 'data-lake',
        code: 'D2 · Vector Vault',
        roleTitle: 'PostgreSQL 16 pgvector (HNSW) + Reranker',
        implementationDetail:
          'Executes single-query SQL metadata filtering + HNSW vector similarity followed by Cross-Encoder Top-5 reranking.',
        protocolBadge: 'pgvector HNSW',
      },
      {
        districtId: 'nlp-district',
        code: 'D6 · Agentic & Memory',
        roleTitle: 'LangGraph Cyclic State Machine & MCP Servers',
        implementationDetail:
          'Orchestrates plan-execute-reflect loops connected to standardized JSON-RPC 2.0 MCP servers (Git, PostgreSQL, Docker).',
        protocolBadge: 'MCP JSON-RPC 2.0',
      },
      {
        districtId: 'computer-vision',
        code: 'D7 · Guardrails & Eval',
        roleTitle: 'RAGAS Faithfulness & JSON-Schema Verification',
        implementationDetail:
          'Enforces Faithfulness > 0.92 threshold and grammar-constrained JSON output schemas before streaming to the user.',
        protocolBadge: 'RAGAS > 0.92',
      },
    ],
  },
  {
    id: 'case-study-03-triton-compilation',
    numberBadge: 'CASE STUDY 03',
    title: {
      en: 'Ultra-Low-Latency Model Compilation & Triton Ensemble Pipeline',
      vi: 'Pipeline Biên Dịch Mô Hình Độ Trễ Cực Thấp & Phục Vụ Đa Mô Hình Triton',
      ja: '超低遅延モデルコンパイル＆Tritonアンサンブル推論パイプライン',
    },
    subtitle: {
      en: 'QLoRA + FlashAttention-2 + ONNX / TensorRT + Triton + vLLM + Prometheus',
      vi: 'QLoRA + FlashAttention-2 + ONNX / TensorRT + Triton + vLLM + Prometheus',
      ja: 'QLoRA + FlashAttention-2 + ONNX / TensorRT + Triton + vLLM + Prometheus',
    },
    problemStatement: {
      en: 'Serving concurrent vision + language workloads on constrained GPU clusters without KV-cache memory thrashing or cold-start bottlenecks.',
      vi: 'Phục vụ đồng thời các tác vụ Thị giác + Ngôn ngữ trên cụm GPU giới hạn VRAM mà không bị tràn bộ nhớ đệm KV-Cache hay nghẽn cổ chai khi tải cao.',
      ja: '限られたGPUリソース上で、KVキャッシュのメモリ枯渇やコールドスタート遅延を防ぎながら視覚・言語モデルを同時並列サービングする。',
    },
    accentColor: '#EC4899',
    workloadPresetId: 'distributed-training',
    activeDistricts: [
      'training-cluster',
      'model-core',
      'inference-center',
      'output-terminal',
    ],
    activePathIds: [
      'path-datalake-training',
      'path-training-core',
      'path-core-inference',
      'path-inference-output',
    ],
    stackSelections: {
      'input-gateway': 'd1-grpc',
      'data-lake': 'd2-milvus',
      'training-cluster': 'd3-deepspeed',
      'model-core': 'd4-sparse-moe',
      'inference-center': 'd5-tensorrt',
      'nlp-district': 'd6-react-redis',
      'computer-vision': 'd7-nemo-llamaguard',
      'output-terminal': 'd8-docker-prom-grafana',
    },
    metrics: [
      { label: 'Throughput Gain', value: '3.8x vs Eager' },
      { label: 'VRAM Savings', value: '-52% (INT8/FP8)' },
      { label: 'P99 Latency', value: '11.4 ms' },
    ],
    districtArchitecture: [
      {
        districtId: 'training-cluster',
        code: 'D3 · Training Foundry',
        roleTitle: 'QLoRA Adaptation & FlashAttention-2',
        implementationDetail:
          'Fine-tunes domain adapters in BF16 with IO-aware FlashAttention-2 and merges weights for zero-overhead deployment.',
        protocolBadge: 'FlashAttn-2 + QLoRA',
      },
      {
        districtId: 'inference-center',
        code: 'D5 · Inference Engine',
        roleTitle: 'ONNX / TensorRT Compilation & Triton Dynamic Batching',
        implementationDetail:
          'Exports PyTorch graphs to ONNX/TensorRT engines served via Triton with concurrent model execution and vLLM PagedAttention.',
        protocolBadge: 'TensorRT + Triton',
      },
      {
        districtId: 'output-terminal',
        code: 'D8 · Output & MLOps',
        roleTitle: 'Docker + Makefile Automation & Prometheus Telemetry',
        implementationDetail:
          'Packages reproducible GPU containers monitored by DCGM Exporter, Prometheus alerts, and Grafana P99 dashboards.',
        protocolBadge: 'Docker + Prometheus',
      },
    ],
  },
];
