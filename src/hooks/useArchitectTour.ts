import { useState, useEffect, useCallback } from 'react';
import type { DistrictId } from '../data/districts';
import type { StackSelectionMap } from '../data/stack-catalog.ts';
import {
  SLOT_TO_DISTRICT_ID,
  normalizeStackFromSlots,
} from '../data/stack-catalog.ts';
import type { CaseStudyBlueprint } from '../data/case-studies.ts';
import { CASE_STUDIES } from '../data/case-studies.ts';

export interface TourStep {
  districtId: number; // 1..8
  districtSlug: DistrictId;
  title: string;
  narration: string;
  protocolBadge: string;
  durationMs: number;
}

export interface ArchitectActionPlan {
  id: string;
  planTitle: string;
  architectSummary: string;
  recommendedStack: Record<number, string>;
  stackSelectionMap: StackSelectionMap;
  tourSteps: TourStep[];
  suggestedCaseStudyId?: string;
}

export interface ArchitectPromptPreset {
  id: string;
  label: string;
  prompt: string;
}

export const ARCHITECT_PROMPT_PRESETS: ArchitectPromptPreset[] = [
  {
    id: 'preset-video-retrieval',
    label:
      '🎬 Architect a Multimodal Video Retrieval Pipeline (CLIP/SigLIP + FAISS/Milvus)',
    prompt:
      'Architect a Multimodal Video Retrieval Pipeline (CLIP/SigLIP + FAISS/Milvus) for 1M+ keyframes under 30ms P99 latency.',
  },
  {
    id: 'preset-agentic-mcp',
    label:
      '🤖 Architect an Enterprise Agentic RAG System with MCP & Hybrid Search',
    prompt:
      'Architect an Enterprise Agentic RAG System with Model Context Protocol (MCP), LangGraph, pgvector HNSW, and RAGAS verification.',
  },
  {
    id: 'preset-triton-serving',
    label:
      '⚡ Optimize High-Throughput LLM & Vision Serving (ONNX + Triton + vLLM)',
    prompt:
      'Optimize High-Throughput LLM & Vision Serving using ONNX Runtime, Triton Inference Server, TensorRT-LLM, and vLLM PagedAttention.',
  },
  {
    id: 'preset-diagnose-oom',
    label:
      '🛡️ Diagnose & Fix KV-Cache OOM and Hallucination Bottlenecks',
    prompt:
      'Diagnose and remediate KV-Cache OOM crashes and RAG hallucination spikes across Inference Engine, Vector Vault, and Guardrails.',
  },
];

export function synthesizeArchitectPlanFromPrompt(
  rawPrompt: string
): ArchitectActionPlan {
  const q = rawPrompt.toLowerCase();

  // 1. Multimodal Video / Image Retrieval Intent
  if (
    q.includes('video') ||
    q.includes('clip') ||
    q.includes('siglip') ||
    q.includes('faiss') ||
    q.includes('keyframe') ||
    q.includes('image') ||
    q.includes('multimodal')
  ) {
    const recommendedStack: Record<number, string> = {
      1: 'd1-grpc',
      2: 'd2-faiss-es',
      3: 'd3-fsdp-qlora',
      4: 'd4-multimodal-clip',
      5: 'd5-triton-onnx',
      6: 'd6-react-redis',
      7: 'd7-ragas-pydantic',
      8: 'd8-docker-prom-grafana',
    };
    return {
      id: 'plan-multimodal-video',
      planTitle: 'Multimodal Video & Keyframe Retrieval Architecture',
      architectSummary:
        'Designed a sub-20ms dual-index retrieval pipeline: gRPC frame/query ingress -> CLIP/SigLIP shared latent projection -> FAISS GPU dense search fused with Elasticsearch BM25 OCR via Reciprocal Rank Fusion -> ONNX/Triton FP16 serving.',
      recommendedStack,
      stackSelectionMap: normalizeStackFromSlots(recommendedStack),
      suggestedCaseStudyId: 'case-study-01-video-retrieval',
      tourSteps: [
        {
          districtId: 1,
          districtSlug: 'input-gateway',
          title: 'Step 1 · High-Throughput Frame & Query Ingress',
          narration:
            'Incoming video streams undergo scene-change keyframe deduplication and multilingual OCR extraction while user queries enter over low-latency gRPC.',
          protocolBadge: 'gRPC + FFmpeg',
          durationMs: 4200,
        },
        {
          districtId: 4,
          districtSlug: 'model-core',
          title: 'Step 2 · CLIP / SigLIP Contrastive Projection',
          narration:
            'Visual patches and text queries are projected into a shared L2-normalized semantic vector space via a Dual-Encoder backbone.',
          protocolBadge: 'SigLIP Dual-Encoder',
          durationMs: 4200,
        },
        {
          districtId: 2,
          districtSlug: 'data-lake',
          title: 'Step 3 · Hybrid FAISS GPU + Elasticsearch BM25 Vault',
          narration:
            'Dense cosine similarity in FAISS GPU is combined with lexical OCR/ASR matches in Elasticsearch using Reciprocal Rank Fusion (RRF).',
          protocolBadge: 'FAISS CUDA + RRF',
          durationMs: 4200,
        },
        {
          districtId: 5,
          districtSlug: 'inference-center',
          title: 'Step 4 · ONNX Runtime & Triton Dynamic Batching',
          narration:
            'Query encoders compiled to FP16 ONNX execute on Triton Inference Server with concurrent model execution under 18.4ms P99.',
          protocolBadge: 'Triton + ONNX FP16',
          durationMs: 4200,
        },
        {
          districtId: 8,
          districtSlug: 'output-terminal',
          title: 'Step 5 · Temporal Keyframe Ranking & Telemetry',
          narration:
            'Top-K video segments stream back with exact timestamp offsets while Prometheus & Grafana monitor recall and GPU saturation.',
          protocolBadge: 'SSE + Prometheus',
          durationMs: 4200,
        },
      ],
    };
  }

  // 2. High-Throughput Serving / Compilation / Triton / ONNX / vLLM Intent
  if (
    q.includes('triton') ||
    q.includes('onnx') ||
    q.includes('tensorrt') ||
    q.includes('throughput') ||
    q.includes('compile') ||
    q.includes('serving')
  ) {
    const recommendedStack: Record<number, string> = {
      1: 'd1-grpc',
      2: 'd2-milvus',
      3: 'd3-deepspeed',
      4: 'd4-sparse-moe',
      5: 'd5-tensorrt',
      6: 'd6-react-redis',
      7: 'd7-nemo-llamaguard',
      8: 'd8-docker-prom-grafana',
    };
    return {
      id: 'plan-triton-serving',
      planTitle: 'Ultra-Low-Latency Compiled Inference & Triton Ensemble',
      architectSummary:
        'Configured a 3.8x throughput-boosted serving architecture: DeepSpeed ZeRO-3 + FlashAttention-2 training -> ONNX/TensorRT-LLM FP8 graph compilation -> Triton Inference Server + vLLM PagedAttention -> Docker + Prometheus MLOps.',
      recommendedStack,
      stackSelectionMap: normalizeStackFromSlots(recommendedStack),
      suggestedCaseStudyId: 'case-study-03-triton-compilation',
      tourSteps: [
        {
          districtId: 3,
          districtSlug: 'training-cluster',
          title: 'Step 1 · QLoRA & FlashAttention-2 Optimization',
          narration:
            'Domain-specific adapters are trained in BF16 with IO-aware FlashAttention-2 and fused into the base checkpoint.',
          protocolBadge: 'ZeRO-3 + FlashAttn-2',
          durationMs: 4200,
        },
        {
          districtId: 4,
          districtSlug: 'model-core',
          title: 'Step 2 · Sparse MoE & KV-Grouped Backbone',
          narration:
            'Grouped-Query Attention (GQA) reduces KV-Cache memory footprint by 4x–8x before ahead-of-time graph compilation.',
          protocolBadge: 'GQA + MoE Gate',
          durationMs: 4200,
        },
        {
          districtId: 5,
          districtSlug: 'inference-center',
          title: 'Step 3 · Triton + ONNX / TensorRT-LLM Execution',
          narration:
            'Compiled FP8/INT4 engines run inside Triton Inference Server with in-flight batching and PagedAttention KV blocks.',
          protocolBadge: 'TensorRT-LLM + Triton',
          durationMs: 4200,
        },
        {
          districtId: 8,
          districtSlug: 'output-terminal',
          title: 'Step 4 · Containerized MLOps & P99 SLA Observability',
          narration:
            'Automated via Docker Compose and Makefile targets with Prometheus scraping GPU SM occupancy and P99 decode latency.',
          protocolBadge: 'Docker + Grafana SLA',
          durationMs: 4200,
        },
      ],
    };
  }

  // 3. Chaos / OOM / Bottleneck Remediation Intent
  if (
    q.includes('oom') ||
    q.includes('kv-cache') ||
    q.includes('bottleneck') ||
    q.includes('diagnose') ||
    q.includes('hallucination') ||
    q.includes('fix')
  ) {
    const recommendedStack: Record<number, string> = {
      1: 'd1-fastapi',
      2: 'd2-pgvector',
      3: 'd3-unsloth',
      4: 'd4-dense-llm',
      5: 'd5-vllm',
      6: 'd6-mcp-langgraph',
      7: 'd7-ragas-pydantic',
      8: 'd8-k8s-envoy',
    };
    return {
      id: 'plan-chaos-remediation',
      planTitle: 'KV-Cache OOM & Hallucination Zero-Downtime Remediation Plan',
      architectSummary:
        'Eliminates contiguous VRAM fragmentation via vLLM PagedAttention + INT4 AWQ quantization, replaces O(N) vector scans with HNSW indexing, and enforces RAGAS > 0.92 faithfulness gates.',
      recommendedStack,
      stackSelectionMap: normalizeStackFromSlots(recommendedStack),
      suggestedCaseStudyId: 'case-study-02-agentic-mcp-rag',
      tourSteps: [
        {
          districtId: 5,
          districtSlug: 'inference-center',
          title: 'Step 1 · Remediate KV-Cache OOM with vLLM PagedAttention',
          narration:
            'Replaces contiguous KV tensor allocations with 16-token virtual memory pages and FP8/AWQ quantization, cutting VRAM usage by 52%.',
          protocolBadge: 'vLLM PagedAttention',
          durationMs: 4200,
        },
        {
          districtId: 2,
          districtSlug: 'data-lake',
          title: 'Step 2 · Eliminate O(N) Latency with HNSW + Reranking',
          narration:
            'Upgrades flat vector scans to logarithmic HNSW graphs in pgvector paired with Cross-Encoder Top-5 reranking.',
          protocolBadge: 'HNSW + Cross-Encoder',
          durationMs: 4200,
        },
        {
          districtId: 7,
          districtSlug: 'computer-vision',
          title: 'Step 3 · Enforce RAGAS Faithfulness & Prompt Shield',
          narration:
            'Blocks ungrounded claims and adversarial prompt injections before any token reaches the client terminal.',
          protocolBadge: 'RAGAS + Prompt Shield',
          durationMs: 4200,
        },
        {
          districtId: 8,
          districtSlug: 'output-terminal',
          title: 'Step 4 · Envoy Canary Rollback & SLA Protection',
          narration:
            'Routes traffic with automated P99 latency circuit breakers and real-time OpenTelemetry span alerts.',
          protocolBadge: 'Envoy Canary SLA',
          durationMs: 4200,
        },
      ],
    };
  }

  // 4. Default / Enterprise Agentic RAG + MCP Intent
  const recommendedStack: Record<number, string> = {
    1: 'd1-fastapi',
    2: 'd2-pgvector',
    3: 'd3-unsloth',
    4: 'd4-dense-llm',
    5: 'd5-vllm',
    6: 'd6-mcp-langgraph',
    7: 'd7-ragas-pydantic',
    8: 'd8-otel-langfuse',
  };
  return {
    id: 'plan-agentic-mcp-rag',
    planTitle: 'Enterprise Agentic RAG with Model Context Protocol (MCP)',
    architectSummary:
      'Synthesized a cyclic multi-step agent architecture: FastAPI + Pydantic v2 ingress -> PostgreSQL 16 pgvector (HNSW) hybrid retrieval -> LangGraph + MCP JSON-RPC tool servers -> vLLM serving -> RAGAS faithfulness guardrails.',
    recommendedStack,
    stackSelectionMap: normalizeStackFromSlots(recommendedStack),
    suggestedCaseStudyId: 'case-study-02-agentic-mcp-rag',
    tourSteps: [
      {
        districtId: 1,
        districtSlug: 'input-gateway',
        title: 'Step 1 · FastAPI + Pydantic v2 Intent Ingress',
        narration:
          'Normalizes user prompts, validates JSON schemas, and scrubs PII before dispatching to the Agentic Orchestrator.',
        protocolBadge: 'FastAPI ASGI',
        durationMs: 4200,
      },
      {
        districtId: 2,
        districtSlug: 'data-lake',
        title: 'Step 2 · PostgreSQL 16 pgvector (HNSW) Hybrid RAG',
        narration:
          'Executes single-query relational metadata filtering + HNSW vector search with Cross-Encoder reranking.',
        protocolBadge: 'pgvector HNSW',
        durationMs: 4200,
      },
      {
        districtId: 6,
        districtSlug: 'nlp-district',
        title: 'Step 3 · LangGraph Cyclic State Machine & MCP Servers',
        narration:
          'Invokes deterministic external tools (SQL, Git, Sandbox) over standardized Model Context Protocol (MCP) JSON-RPC 2.0.',
        protocolBadge: 'MCP JSON-RPC 2.0',
        durationMs: 4200,
      },
      {
        districtId: 4,
        districtSlug: 'model-core',
        title: 'Step 4 · Contextual Synthesis in Model Core',
        narration:
          'Fuses retrieved context chunks and MCP tool observations inside the Transformer attention window.',
        protocolBadge: 'GQA Context Fusion',
        durationMs: 4200,
      },
      {
        districtId: 7,
        districtSlug: 'computer-vision',
        title: 'Step 5 · RAGAS Faithfulness & Schema Guardrails',
        narration:
          'Audits generated responses for factual grounding (Faithfulness > 0.92) before streaming to the Output Terminal.',
        protocolBadge: 'RAGAS Guardrail',
        durationMs: 4200,
      },
    ],
  };
}

export function buildTourFromCaseStudy(
  study: CaseStudyBlueprint,
  lang: 'en' | 'vi' | 'ja' = 'en'
): ArchitectActionPlan {
  const recommendedStack: Record<number, string> = {};
  Object.entries(SLOT_TO_DISTRICT_ID).forEach(([slotStr, dId]) => {
    recommendedStack[Number(slotStr)] = study.stackSelections[dId];
  });

  const tourSteps: TourStep[] = study.districtArchitecture.map((item, idx) => ({
    districtId: idx + 1,
    districtSlug: item.districtId,
    title: `${item.code}: ${item.roleTitle}`,
    narration: item.implementationDetail,
    protocolBadge: item.protocolBadge,
    durationMs: 4400,
  }));

  return {
    id: `plan-${study.id}`,
    planTitle: study.title[lang],
    architectSummary: study.problemStatement[lang],
    recommendedStack,
    stackSelectionMap: study.stackSelections,
    suggestedCaseStudyId: study.id,
    tourSteps,
  };
}

export function useArchitectTour(options: {
  onFocusDistrict: (districtId: DistrictId) => void;
  onHighlightConduitDistrict: (districtId: DistrictId | null) => void;
}) {
  const { onFocusDistrict, onHighlightConduitDistrict } = options;
  const [activePlan, setActivePlan] = useState<ArchitectActionPlan | null>(
    () => synthesizeArchitectPlanFromPrompt(ARCHITECT_PROMPT_PRESETS[0].prompt)
  );
  const [isTourRunning, setIsTourRunning] = useState<boolean>(false);
  const [isTourPaused, setIsTourPaused] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  const currentTourStep: TourStep | null =
    isTourRunning && activePlan && activePlan.tourSteps[currentStepIndex]
      ? activePlan.tourSteps[currentStepIndex]
      : null;

  const focusStep = useCallback(
    (plan: ArchitectActionPlan, index: number) => {
      const step = plan.tourSteps[index];
      if (!step) return;
      onFocusDistrict(step.districtSlug);
      onHighlightConduitDistrict(step.districtSlug);
    },
    [onFocusDistrict, onHighlightConduitDistrict]
  );

  const startTour = useCallback(
    (planToRun?: ArchitectActionPlan) => {
      const targetPlan = planToRun || activePlan;
      if (!targetPlan || targetPlan.tourSteps.length === 0) return;
      if (planToRun) {
        setActivePlan(planToRun);
      }
      setCurrentStepIndex(0);
      setIsTourPaused(false);
      setIsTourRunning(true);
      focusStep(targetPlan, 0);
    },
    [activePlan, focusStep]
  );

  const exitTour = useCallback(() => {
    setIsTourRunning(false);
    setIsTourPaused(false);
    onHighlightConduitDistrict(null);
  }, [onHighlightConduitDistrict]);

  const nextStep = useCallback(() => {
    if (!activePlan) return;
    const nextIdx = (currentStepIndex + 1) % activePlan.tourSteps.length;
    setCurrentStepIndex(nextIdx);
    focusStep(activePlan, nextIdx);
  }, [activePlan, currentStepIndex, focusStep]);

  const prevStep = useCallback(() => {
    if (!activePlan) return;
    const prevIdx =
      (currentStepIndex - 1 + activePlan.tourSteps.length) %
      activePlan.tourSteps.length;
    setCurrentStepIndex(prevIdx);
    focusStep(activePlan, prevIdx);
  }, [activePlan, currentStepIndex, focusStep]);

  useEffect(() => {
    if (!isTourRunning || isTourPaused || !activePlan) return;
    const step = activePlan.tourSteps[currentStepIndex];
    if (!step) return;

    const timer = setTimeout(() => {
      if (currentStepIndex + 1 < activePlan.tourSteps.length) {
        const nextIdx = currentStepIndex + 1;
        setCurrentStepIndex(nextIdx);
        focusStep(activePlan, nextIdx);
      } else {
        setIsTourRunning(false);
        onHighlightConduitDistrict(null);
      }
    }, step.durationMs);

    return () => clearTimeout(timer);
  }, [
    isTourRunning,
    isTourPaused,
    activePlan,
    currentStepIndex,
    focusStep,
    onHighlightConduitDistrict,
  ]);

  return {
    activePlan,
    setActivePlan,
    isTourRunning,
    isTourPaused,
    setIsTourPaused,
    currentStepIndex,
    currentTourStep,
    startTour,
    exitTour,
    nextStep,
    prevStep,
     selectStepIndex: (idx: number) => {
      if (!activePlan) return;
      setCurrentStepIndex(idx);
      focusStep(activePlan, idx);
    },
  };
}
