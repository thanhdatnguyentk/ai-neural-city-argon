import type {
  ArchitecturalPipelineModeId,
  GroundedModeTelemetryReport,
} from '../types/pipeline-modes.ts';
import type {
  BottleneckScenarioId,
  ComputedSimulationTelemetry,
} from '../data/bottleneck-scenarios.ts';

/**
 * Physically Grounded Telemetry & Roofline Math Engine.
 * Guarantees online serving metrics (TTFT, TPOT, KV-Cache) NEVER mix with
 * offline pre-training metrics (MFU, Epoch Loss, ZeRO-3 All-Reduce).
 */
export function computeModeGroundedTelemetry(
  modeId: ArchitecturalPipelineModeId,
  options?: {
    computedTelemetry?: ComputedSimulationTelemetry;
    activeBottleneck?: BottleneckScenarioId;
    flowSpeed?: number;
  }
): GroundedModeTelemetryReport {
  const computed = options?.computedTelemetry;
  const bottleneck = options?.activeBottleneck ?? 'none';

  if (modeId === 'online-inference') {
    const tpotMs =
      bottleneck === 'kv-cache-oom'
        ? 142.5
        : computed
        ? computed.inferenceLatencyMs
        : 11.4;
    const ttftMs =
      bottleneck === 'vector-brute-force'
        ? 418.0
        : Number((35.4 + tpotMs).toFixed(1));
    const e2eP99Ms = Math.round(ttftMs + tpotMs * 32 + 4.0);
    const kvSaturation =
      bottleneck === 'kv-cache-oom'
        ? '99.8% (OOM THRASHING)'
        : computed
        ? `${Math.min(99.4, Math.max(24.0, computed.modelLoadPercent)).toFixed(1)}% (PagedAttention)`
        : '64.2% (PagedAttention)';
    const recallText =
      bottleneck === 'vector-brute-force'
        ? '100% (380 ms Flat Scan!)'
        : '94.8% (6.4 ms)';

    return {
      modeId: 'online-inference',
      modeLabel: 'ONLINE INFERENCE & AGENTIC LOOP',
      heroSummary: {
        statusText:
          bottleneck !== 'none' || computed?.isVramOom
            ? 'SLA_DEGRADED'
            : 'SERVING_OPTIMAL',
        badgeText: `TTFT ${ttftMs}ms · TPOT ${tpotMs}ms/tok`,
        activePoolLabel: 'SERVING PODS (D3 STANDBY)',
        activePoolValue: '7 / 8 Districts Active',
        throughputLabel: 'TOKEN STREAM RATE',
        throughputValue: `${Math.round(88 * (options?.flowSpeed ?? 1))} tok/s/stream`,
        loadLabel: 'KV-CACHE HBM POOL',
        loadValue: kvSaturation,
      },
      cards: [
        {
          id: 'online-ttft',
          label: 'TTFT (TIME-TO-FIRST-TOKEN)',
          primaryValue: `${ttftMs} ms`,
          breakdownNote:
            'Breakdown: Vision Patch & Encode 14.2 ms + HNSW Retrieval 6.4 ms + LLM Prefill 26.2 ms',
          hardwareNote: 'Compute-Bound Prefill O(L²)',
          accentColorHex: '#00F0FF',
          isAlert: ttftMs > 150,
        },
        {
          id: 'online-tpot',
          label: 'TPOT / ITL (INTER-TOKEN LATENCY)',
          primaryValue: `${tpotMs} ms / token`,
          breakdownNote:
            'P99 Autoregressive Decode step — Memory-Bandwidth-Bound at 88 tokens/sec/stream',
          hardwareNote: 'HBM3 Bandwidth-Bound O(L)',
          accentColorHex: '#38BDF8',
          isAlert: tpotMs > 40,
        },
        {
          id: 'online-e2e-p99',
          label: 'END-TO-END REQUEST LATENCY (P99)',
          primaryValue: `${e2eP99Ms} ms`,
          breakdownNote:
            'TTFT + 32 generated tokens + Dual-Gate Guardrail NLI Faithfulness verification',
          hardwareNote: 'Full 7-District Serving Path',
          accentColorHex: '#10B981',
          isAlert: e2eP99Ms > 800,
        },
        {
          id: 'online-kv-cache',
          label: 'KV-CACHE POOL SATURATION',
          primaryValue: kvSaturation,
          breakdownNote:
            'Zero external fragmentation · 128 concurrent sequences on 80GB HBM3 (Block Size = 16)',
          hardwareNote: 'vLLM Non-Contiguous Paged Blocks',
          accentColorHex: '#8B5CF6',
          isAlert: bottleneck === 'kv-cache-oom' || Boolean(computed?.isVramOom),
        },
        {
          id: 'online-hybrid-recall',
          label: 'HYBRID RETRIEVAL RECALL@10',
          primaryValue: recallText,
          breakdownNote:
            'Milvus/pgvector HNSW (efSearch=64) + Elasticsearch BM25 Reciprocal Rank Fusion',
          hardwareNote: 'O(log N) Graph Traversal',
          accentColorHex: '#F59E0B',
          isAlert: bottleneck === 'vector-brute-force',
        },
      ],
    };
  }

  if (modeId === 'offline-indexing') {
    return {
      modeId: 'offline-indexing',
      modeLabel: 'OFFLINE DATA INDEXING & ETL PIPELINE',
      heroSummary: {
        statusText: 'BATCH_ETL_ACTIVE',
        badgeText: '3,850 vec/s · 4.2 GB/s NVMe',
        activePoolLabel: 'ETL WORKERS (D3/D6 STANDBY)',
        activePoolValue: '5 / 8 Districts Active',
        throughputLabel: 'EMBEDDING THROUGHPUT',
        throughputValue: '3,850 vectors/sec',
        loadLabel: 'HNSW INDEX BUILD',
        loadValue: '92.4% (SQ8 RAM)',
      },
      cards: [
        {
          id: 'etl-ingest-ocr',
          label: 'INGESTION & OCR THROUGHPUT',
          primaryValue: '1,420 keyframes/sec',
          breakdownNote:
            'Async gRPC workers + GPU-accelerated PDF layout parsing & perceptual pHash deduplication',
          hardwareNote: 'Network I/O & CPU SIMD Bound',
          accentColorHex: '#00F0FF',
        },
        {
          id: 'etl-embedding-rate',
          label: 'EMBEDDING ENCODER THROUGHPUT',
          primaryValue: '3,850 vectors/sec',
          breakdownNote:
            'SigLIP-So400m FP16 Dynamic Batching (Batch=256) on Triton Inference Server',
          hardwareNote: 'Compute-Bound Tensor Cores',
          accentColorHex: '#8B5CF6',
        },
        {
          id: 'etl-hnsw-build',
          label: 'HNSW GRAPH BUILD STATUS',
          primaryValue: '92.4% Indexed',
          breakdownNote:
            'Parameters: M=16, efConstruction=200 · 1.8M / 2.0M multimodal vectors committed',
          hardwareNote: 'Multi-Layer Small-World Graph',
          accentColorHex: '#F59E0B',
        },
        {
          id: 'etl-ram-footprint',
          label: 'VECTOR INDEX RAM FOOTPRINT',
          primaryValue: '18.6 GB (SQ8 Quantized)',
          breakdownNote:
            'Scalar Quantization INT8 saves 74% RAM vs. raw FP32 vectors with <0.6% recall drop',
          hardwareNote: 'DRAM Capacity Optimized',
          accentColorHex: '#10B981',
        },
        {
          id: 'etl-nvme-iops',
          label: 'SHARD CONSISTENCY & WRITE IOPS',
          primaryValue: 'OPTIMAL (4.2 GB/s NVMe)',
          breakdownNote:
            'Zero dropped segments · Write-Ahead Log (WAL) checkpoint synced across 8 shards',
          hardwareNote: 'Disk IOPS & PCIe Gen5 Bound',
          accentColorHex: '#38BDF8',
        },
      ],
    };
  }

  // Mode C: offline-training
  const isGradExplosion = bottleneck === 'gradient-explosion';
  return {
    modeId: 'offline-training',
    modeLabel: 'OFFLINE DISTRIBUTED TRAINING & ALIGNMENT',
    heroSummary: {
      statusText: isGradExplosion ? 'NAN_DIVERGENCE' : 'FSDP_TRAINING_SYNC',
      badgeText: 'MFU 51.4% · 184.3K tok/s',
      activePoolLabel: 'TRAINING CLUSTER (SERVING ISOLATED)',
      activePoolValue: '64× H100 SXM5 (ZeRO-3)',
      throughputLabel: 'CLUSTER THROUGHPUT',
      throughputValue: '184,320 tok/sec',
      loadLabel: 'STEP LOSS & GRAD NORM',
      loadValue: isGradExplosion ? 'Loss: NaN (Spike!)' : 'Loss: 1.184 · ||g||: 0.72',
    },
    cards: [
      {
        id: 'train-mfu',
        label: 'MODEL FLOPS UTILIZATION (MFU)',
        primaryValue: isGradExplosion ? '12.4% (STALLED)' : '51.4%',
        breakdownNote:
          '64× H100 SXM5 · FlashAttention-2 IO-Aware Tiling + BF16 Mixed Precision Tensor Cores',
        hardwareNote: 'Compute-Bound (989 TFLOPs/GPU)',
        accentColorHex: '#EC4899',
        isAlert: isGradExplosion,
      },
      {
        id: 'train-throughput',
        label: 'TRAINING THROUGHPUT',
        primaryValue: '184,320 tok/sec',
        breakdownNote:
          '2,880 tokens/sec/GPU · Global Batch Size: 4M tokens · Sequence Packing enabled',
        hardwareNote: 'Zero Padding Token Waste',
        accentColorHex: '#8B5CF6',
      },
      {
        id: 'train-zero3-comm',
        label: 'ZERO-3 INTERCONNECT OVERHEAD',
        primaryValue: '14.2% Comm / 85.8% Compute',
        breakdownNote:
          'NVLink 900 GB/s intra-node + InfiniBand 400 Gbps All-Gather / Reduce-Scatter overlap',
        hardwareNote: 'Collective Communication Bound',
        accentColorHex: '#00F0FF',
      },
      {
        id: 'train-loss-dynamics',
        label: 'OPTIMIZATION DYNAMICS',
        primaryValue: isGradExplosion
          ? 'Loss: NaN · Grad Norm: ∞'
          : 'Loss: 1.184 · Grad Norm: 0.72',
        breakdownNote:
          'Cosine LR: 1.5e-5 · Step 14,200 / 16,800 · Gradient Clipping max_norm=1.0',
        hardwareNote: 'AdamW FP32 Master States',
        accentColorHex: '#F59E0B',
        isAlert: isGradExplosion,
      },
      {
        id: 'train-checkpoint-eval',
        label: 'CHECKPOINT & EVAL GATE',
        primaryValue: 'PASS (RAGAS: 0.91)',
        breakdownNote:
          'Async Safetensors sharded save to D2 Data Lake every 500 steps + automated MMLU/RAGAS eval',
        hardwareNote: 'Non-Blocking Async I/O',
        accentColorHex: '#10B981',
      },
    ],
  };
}
