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
 * Supports EN / VI / JA localization.
 */
export function computeModeGroundedTelemetry(
  modeId: ArchitecturalPipelineModeId,
  options?: {
    computedTelemetry?: ComputedSimulationTelemetry;
    activeBottleneck?: BottleneckScenarioId;
    flowSpeed?: number;
    lang?: 'en' | 'vi' | 'ja';
  }
): GroundedModeTelemetryReport {
  const computed = options?.computedTelemetry;
  const bottleneck = options?.activeBottleneck ?? 'none';
  const lang = options?.lang ?? 'en';

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
      modeLabel:
        lang === 'vi'
          ? 'SUY LUẬN TRỰC TUYẾN & VÒNG LẶP TÁC TỬ'
          : lang === 'ja'
          ? 'オンライン推論＆エージェントループ'
          : 'ONLINE INFERENCE & AGENTIC LOOP',
      heroSummary: {
        statusText:
          bottleneck !== 'none' || computed?.isVramOom
            ? 'SLA_DEGRADED'
            : 'SERVING_OPTIMAL',
        badgeText: `TTFT ${ttftMs}ms · TPOT ${tpotMs}ms/tok`,
        activePoolLabel:
          lang === 'vi'
            ? 'CỤM PHỤC VỤ (D3 CHỜ)'
            : lang === 'ja'
            ? '推論ポッド (D3待機)'
            : 'SERVING PODS (D3 STANDBY)',
        activePoolValue:
          lang === 'vi'
            ? '7 / 8 Quận Hoạt Động'
            : lang === 'ja'
            ? '7 / 8 エリア稼働中'
            : '7 / 8 Districts Active',
        throughputLabel:
          lang === 'vi'
            ? 'TỐC ĐỘ SINH TOKEN'
            : lang === 'ja'
            ? 'トークン生成速度'
            : 'TOKEN STREAM RATE',
        throughputValue: `${Math.round(88 * (options?.flowSpeed ?? 1))} tok/s/stream`,
        loadLabel:
          lang === 'vi'
            ? 'BỘ NHỚ KV-CACHE HBM'
            : lang === 'ja'
            ? 'KVキャッシュ HBM'
            : 'KV-CACHE HBM POOL',
        loadValue: kvSaturation,
      },
      cards: [
        {
          id: 'online-ttft',
          label:
            lang === 'vi'
              ? 'TTFT (THỜI GIAN TỚI TOKEN ĐẦU)'
              : lang === 'ja'
              ? 'TTFT (初回トークン到達遅延)'
              : 'TTFT (TIME-TO-FIRST-TOKEN)',
          primaryValue: `${ttftMs} ms`,
          breakdownNote:
            lang === 'vi'
              ? 'Phân rã: Mã hóa ảnh ViT 14.2 ms + Truy xuất HNSW 6.4 ms + LLM Prefill 26.2 ms'
              : lang === 'ja'
              ? '内訳: 画像エンコード 14.2 ms + HNSW検索 6.4 ms + LLM Prefill 26.2 ms'
              : 'Breakdown: Vision Patch & Encode 14.2 ms + HNSW Retrieval 6.4 ms + LLM Prefill 26.2 ms',
          hardwareNote: 'Compute-Bound Prefill O(L²)',
          accentColorHex: '#00F0FF',
          isAlert: ttftMs > 150,
        },
        {
          id: 'online-tpot',
          label:
            lang === 'vi'
              ? 'TPOT / ITL (ĐỘ TRỄ MỖI TOKEN)'
              : lang === 'ja'
              ? 'TPOT / ITL (トークン間生成遅延)'
              : 'TPOT / ITL (INTER-TOKEN LATENCY)',
          primaryValue: `${tpotMs} ms / token`,
          breakdownNote:
            lang === 'vi'
              ? 'Giải mã tự hồi quy P99 — Giới hạn bởi băng thông bộ nhớ ở 88 token/giây/luồng'
              : lang === 'ja'
              ? 'P99 自己回帰デコード — メモリ帯域律速 (88 tokens/sec/stream)'
              : 'P99 Autoregressive Decode step — Memory-Bandwidth-Bound at 88 tokens/sec/stream',
          hardwareNote: 'HBM3 Bandwidth-Bound O(L)',
          accentColorHex: '#38BDF8',
          isAlert: tpotMs > 40,
        },
        {
          id: 'online-e2e-p99',
          label:
            lang === 'vi'
              ? 'ĐỘ TRỄ TOÀN TRÌNH E2E (P99)'
              : lang === 'ja'
              ? 'エンドツーエンド応答遅延 (P99)'
              : 'END-TO-END REQUEST LATENCY (P99)',
          primaryValue: `${e2eP99Ms} ms`,
          breakdownNote:
            lang === 'vi'
              ? 'TTFT + 32 token sinh ra + Kiểm định độ trung thực NLI tại Hàng rào kép D7'
              : lang === 'ja'
              ? 'TTFT + 32生成トークン + D7二重ゲートNLI事実整合性検証'
              : 'TTFT + 32 generated tokens + Dual-Gate Guardrail NLI Faithfulness verification',
          hardwareNote: 'Full 7-District Serving Path',
          accentColorHex: '#10B981',
          isAlert: e2eP99Ms > 800,
        },
        {
          id: 'online-kv-cache',
          label:
            lang === 'vi'
              ? 'ĐỘ BÃO HÒA BỘ NHỚ KV-CACHE'
              : lang === 'ja'
              ? 'KVキャッシュプール飽和度'
              : 'KV-CACHE POOL SATURATION',
          primaryValue: kvSaturation,
          breakdownNote:
            lang === 'vi'
              ? 'Không phân mảnh ngoại vi · 128 chuỗi đồng thời trên 80GB HBM3 (Block Size = 16)'
              : lang === 'ja'
              ? '外部断片化ゼロ · 80GB HBM3上で128同時シーケンス (Block Size = 16)'
              : 'Zero external fragmentation · 128 concurrent sequences on 80GB HBM3 (Block Size = 16)',
          hardwareNote: 'vLLM Non-Contiguous Paged Blocks',
          accentColorHex: '#8B5CF6',
          isAlert: bottleneck === 'kv-cache-oom' || Boolean(computed?.isVramOom),
        },
        {
          id: 'online-hybrid-recall',
          label:
            lang === 'vi'
              ? 'ĐỘ PHỦ TRUY XUẤT LAI RECALL@10'
              : lang === 'ja'
              ? 'ハイブリッド検索 RECALL@10'
              : 'HYBRID RETRIEVAL RECALL@10',
          primaryValue: recallText,
          breakdownNote:
            lang === 'vi'
              ? 'Hợp nhất hạng RRF giữa đồ thị Milvus/pgvector HNSW (efSearch=64) & từ khóa BM25'
              : lang === 'ja'
              ? 'Milvus/pgvector HNSW (efSearch=64) + BM25 RRF統合検索'
              : 'Milvus/pgvector HNSW (efSearch=64) + Elasticsearch BM25 Reciprocal Rank Fusion',
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
      modeLabel:
        lang === 'vi'
          ? 'LẬP CHỈ MỤC DỮ LIỆU & LUỒNG ETL OFFLINE'
          : lang === 'ja'
          ? 'オフラインデータ索引＆ETLパイプライン'
          : 'OFFLINE DATA INDEXING & ETL PIPELINE',
      heroSummary: {
        statusText: 'BATCH_ETL_ACTIVE',
        badgeText: '3,850 vec/s · 4.2 GB/s NVMe',
        activePoolLabel:
          lang === 'vi'
            ? 'CỤM ETL (D3/D6 CHỜ)'
            : lang === 'ja'
            ? 'ETLワーカー (D3/D6待機)'
            : 'ETL WORKERS (D3/D6 STANDBY)',
        activePoolValue:
          lang === 'vi'
            ? '5 / 8 Quận Hoạt Động'
            : lang === 'ja'
            ? '5 / 8 エリア稼働中'
            : '5 / 8 Districts Active',
        throughputLabel:
          lang === 'vi'
            ? 'THÔNG LƯỢNG EMBEDDING'
            : lang === 'ja'
            ? '埋め込み生成速度'
            : 'EMBEDDING THROUGHPUT',
        throughputValue: '3,850 vectors/sec',
        loadLabel:
          lang === 'vi'
            ? 'XÂY DỰNG ĐỒ THỊ HNSW'
            : lang === 'ja'
            ? 'HNSWグラフ構築'
            : 'HNSW INDEX BUILD',
        loadValue: '92.4% (SQ8 RAM)',
      },
      cards: [
        {
          id: 'etl-ingest-ocr',
          label:
            lang === 'vi'
              ? 'THÔNG LƯỢNG TIẾP NHẬN & OCR'
              : lang === 'ja'
              ? 'データ取込＆OCRスループット'
              : 'INGESTION & OCR THROUGHPUT',
          primaryValue: '1,420 keyframes/sec',
          breakdownNote:
            lang === 'vi'
              ? 'Worker gRPC bất đồng bộ + phân tích bố cục PDF bằng GPU & khử trùng lặp pHash'
              : lang === 'ja'
              ? '非同期gRPCワーカー + GPU高速PDF解析＆pHash重複排除'
              : 'Async gRPC workers + GPU-accelerated PDF layout parsing & perceptual pHash deduplication',
          hardwareNote: 'Network I/O & CPU SIMD Bound',
          accentColorHex: '#00F0FF',
        },
        {
          id: 'etl-embedding-rate',
          label:
            lang === 'vi'
              ? 'TỐC ĐỘ MÃ HÓA VECTOR EMBEDDING'
              : lang === 'ja'
              ? '埋め込みエンコーダ速度'
              : 'EMBEDDING ENCODER THROUGHPUT',
          primaryValue: '3,850 vectors/sec',
          breakdownNote:
            lang === 'vi'
              ? 'Ghép lô động SigLIP-So400m FP16 (Batch=256) trên Triton Inference Server'
              : lang === 'ja'
              ? 'Triton Inference Server上でのSigLIP-So400m FP16動的バッチ (Batch=256)'
              : 'SigLIP-So400m FP16 Dynamic Batching (Batch=256) on Triton Inference Server',
          hardwareNote: 'Compute-Bound Tensor Cores',
          accentColorHex: '#8B5CF6',
        },
        {
          id: 'etl-hnsw-build',
          label:
            lang === 'vi'
              ? 'TIẾN ĐỘ XÂY DỰNG ĐỒ THỊ HNSW'
              : lang === 'ja'
              ? 'HNSWグラフ構築ステータス'
              : 'HNSW GRAPH BUILD STATUS',
          primaryValue: '92.4% Indexed',
          breakdownNote:
            lang === 'vi'
              ? 'Tham số: M=16, efConstruction=200 · Đã ghi 1.8M / 2.0M vector đa phương thức'
              : lang === 'ja'
              ? 'パラメータ: M=16, efConstruction=200 · 180万 / 200万ベクトル登録済'
              : 'Parameters: M=16, efConstruction=200 · 1.8M / 2.0M multimodal vectors committed',
          hardwareNote: 'Multi-Layer Small-World Graph',
          accentColorHex: '#F59E0B',
        },
        {
          id: 'etl-ram-footprint',
          label:
            lang === 'vi'
              ? 'DUNG LƯỢNG RAM CHỈ MỤC VECTOR'
              : lang === 'ja'
              ? 'ベクトル索引 RAM使用量'
              : 'VECTOR INDEX RAM FOOTPRINT',
          primaryValue: '18.6 GB (SQ8 Quantized)',
          breakdownNote:
            lang === 'vi'
              ? 'Lượng tử hóa vô hướng INT8 tiết kiệm 74% RAM so với FP32, giảm độ phủ <0.6%'
              : lang === 'ja'
              ? 'SQ8量子化によりFP32比で74%のRAMを削減 (Recall低下0.6%未満)'
              : 'Scalar Quantization INT8 saves 74% RAM vs. raw FP32 vectors with <0.6% recall drop',
          hardwareNote: 'DRAM Capacity Optimized',
          accentColorHex: '#10B981',
        },
        {
          id: 'etl-nvme-iops',
          label:
            lang === 'vi'
              ? 'ĐỒNG BỘ PHÂN ĐOẠN & BĂNG THÔNG NVME'
              : lang === 'ja'
              ? 'シャード整合性＆NVMe書込IOPS'
              : 'SHARD CONSISTENCY & WRITE IOPS',
          primaryValue: 'OPTIMAL (4.2 GB/s NVMe)',
          breakdownNote:
            lang === 'vi'
              ? 'Không rớt phân đoạn · Nhật ký WAL đồng bộ hoàn tất trên 8 phân mảnh'
              : lang === 'ja'
              ? 'セグメント欠損ゼロ · 全8シャードでWALチェックポイント同期完了'
              : 'Zero dropped segments · Write-Ahead Log (WAL) checkpoint synced across 8 shards',
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
    modeLabel:
      lang === 'vi'
        ? 'HUẤN LUYỆN PHÂN TÁN & CĂN CHỈNH DPO (OFFLINE)'
        : lang === 'ja'
        ? 'オフライン分散学習＆アライメント'
        : 'OFFLINE DISTRIBUTED TRAINING & ALIGNMENT',
    heroSummary: {
      statusText: isGradExplosion ? 'NAN_DIVERGENCE' : 'FSDP_TRAINING_SYNC',
      badgeText: 'MFU 51.4% · 184.3K tok/s',
      activePoolLabel:
        lang === 'vi'
          ? 'CỤM HUẤN LUYỆN (TÁCH BIỆT PHỤC VỤ)'
          : lang === 'ja'
          ? '学習クラスタ (推論分離)'
          : 'TRAINING CLUSTER (SERVING ISOLATED)',
      activePoolValue: '64× H100 SXM5 (ZeRO-3)',
      throughputLabel:
        lang === 'vi'
          ? 'THÔNG LƯỢNG CỤM GPU'
          : lang === 'ja'
          ? 'クラスタ学習速度'
          : 'CLUSTER THROUGHPUT',
      throughputValue: '184,320 tok/sec',
      loadLabel:
        lang === 'vi'
          ? 'HÀM MẤT MÁT & CHUẨN ĐỘ DỐC'
          : lang === 'ja'
          ? 'ステップ損失＆勾配ノルム'
          : 'STEP LOSS & GRAD NORM',
      loadValue: isGradExplosion
        ? 'Loss: NaN (Spike!)'
        : 'Loss: 1.184 · ||g||: 0.72',
    },
    cards: [
      {
        id: 'train-mfu',
        label:
          lang === 'vi'
            ? 'HIỆU SUẤT TÍNH TOÁN MÔ HÌNH (MFU)'
            : lang === 'ja'
            ? 'モデルFLOPs利用率 (MFU)'
            : 'MODEL FLOPS UTILIZATION (MFU)',
        primaryValue: isGradExplosion ? '12.4% (STALLED)' : '51.4%',
        breakdownNote:
          lang === 'vi'
            ? '64× H100 SXM5 · FlashAttention-2 IO-Aware Tiling + Nhân Tensor BF16'
            : lang === 'ja'
            ? '64× H100 SXM5 · FlashAttention-2 + BF16混合精度Tensorコア'
            : '64× H100 SXM5 · FlashAttention-2 IO-Aware Tiling + BF16 Mixed Precision Tensor Cores',
        hardwareNote: 'Compute-Bound (989 TFLOPs/GPU)',
        accentColorHex: '#EC4899',
        isAlert: isGradExplosion,
      },
      {
        id: 'train-throughput',
        label:
          lang === 'vi'
            ? 'THÔNG LƯỢNG HUẤN LUYỆN'
            : lang === 'ja'
            ? '学習スループット'
            : 'TRAINING THROUGHPUT',
        primaryValue: '184,320 tok/sec',
        breakdownNote:
          lang === 'vi'
            ? '2,880 token/giây/GPU · Kích thước lô toàn cục: 4M token · Đóng gói chuỗi (Sequence Packing)'
            : lang === 'ja'
            ? '2,880 tokens/sec/GPU · グローバルバッチ: 4Mトークン · Sequence Packing有効'
            : '2,880 tokens/sec/GPU · Global Batch Size: 4M tokens · Sequence Packing enabled',
        hardwareNote: 'Zero Padding Token Waste',
        accentColorHex: '#8B5CF6',
      },
      {
        id: 'train-zero3-comm',
        label:
          lang === 'vi'
            ? 'CHI PHÍ TRUYỀN THÔNG ZERO-3'
            : lang === 'ja'
            ? 'ZERO-3 通信オーバーヘッド'
            : 'ZERO-3 INTERCONNECT OVERHEAD',
        primaryValue: '14.2% Comm / 85.8% Compute',
        breakdownNote:
          lang === 'vi'
            ? 'Chồng lấp tính toán và truyền thông All-Gather / Reduce-Scatter qua NVLink 900 GB/s & InfiniBand'
            : lang === 'ja'
            ? 'NVLink 900 GB/s + InfiniBand 400 Gbps All-Gather / Reduce-Scatter通信オーバーラップ'
            : 'NVLink 900 GB/s intra-node + InfiniBand 400 Gbps All-Gather / Reduce-Scatter overlap',
        hardwareNote: 'Collective Communication Bound',
        accentColorHex: '#00F0FF',
      },
      {
        id: 'train-loss-dynamics',
        label:
          lang === 'vi'
            ? 'ĐỘNG LỰC HỌC TỐI ƯU HÓA'
            : lang === 'ja'
            ? '最適化ダイナミクス (Loss & Grad)'
            : 'OPTIMIZATION DYNAMICS',
        primaryValue: isGradExplosion
          ? 'Loss: NaN · Grad Norm: ∞'
          : 'Loss: 1.184 · Grad Norm: 0.72',
        breakdownNote:
          lang === 'vi'
            ? 'Cosine LR: 1.5e-5 · Bước 14,200 / 16,800 · Cắt ngưỡng Gradient max_norm=1.0'
            : lang === 'ja'
            ? 'Cosine LR: 1.5e-5 · Step 14,200 / 16,800 · 勾配クリッピング max_norm=1.0'
            : 'Cosine LR: 1.5e-5 · Step 14,200 / 16,800 · Gradient Clipping max_norm=1.0',
        hardwareNote: 'AdamW FP32 Master States',
        accentColorHex: '#F59E0B',
        isAlert: isGradExplosion,
      },
      {
        id: 'train-checkpoint-eval',
        label:
          lang === 'vi'
            ? 'CỔNG LƯU CHECKPOINT & ĐÁNH GIÁ EVAL'
            : lang === 'ja'
            ? 'チェックポイント＆評価ゲート'
            : 'CHECKPOINT & EVAL GATE',
        primaryValue: 'PASS (RAGAS: 0.91)',
        breakdownNote:
          lang === 'vi'
            ? 'Lưu phân mảnh Safetensors bất đồng bộ mỗi 500 bước + chấm điểm tự động MMLU/RAGAS'
            : lang === 'ja'
            ? '500ステップごとにSafetensors非同期保存 + 自動MMLU/RAGAS評価'
            : 'Async Safetensors sharded save to D2 Data Lake every 500 steps + automated MMLU/RAGAS eval',
        hardwareNote: 'Non-Blocking Async I/O',
        accentColorHex: '#10B981',
      },
    ],
  };
}
