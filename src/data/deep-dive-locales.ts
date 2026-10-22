import type { LanguageCode } from './locales.ts';
import type {
  RoadmapMilestone,
  LandmarkWork,
  LandmarkCategory,
} from '../types/district-roadmap.ts';

export interface DeepDiveUIStrings {
  recommendedFixBadge: string;
  takeQuizBtn: string;
  completedBtn: string;
  markCompletedBtn: string;
  coreConceptsHeading: string;
  techStackHeading: string;
  capstoneHeading: string;
  viewPaperBtn: string;
  impactLabel: string;
  categories: Record<LandmarkCategory, string>;
  quizBanner: string;
  quizLevelPrefix: string;
  quizChallengeSuffix: string;
  milestoneVerifiedBadge: string;
  quizCorrectHeading: string;
  quizIncorrectHeading: string;
  vramBanner: string;
  oomTitlePrefix: string;
  oomRequiredLabel: string;
  oomBudgetLabel: string;
  oomDescriptionPrefix: string;
  oomDescriptionSuffix: string;
  fixInt4Btn: string;
  fixContext4kBtn: string;
  fixScale8xH100Btn: string;
  totalVramFootprint: string;
  weightsVram: string;
  kvCacheVram: string;
  decodeLatency: string;
  paramScaleHeading: string;
  quantPrecisionHeading: string;
  contextWindowHeading: string;
  batchSizeHeading: string;
  gpuBudgetHeading: string;
  drawerFooterShortcuts: string;
}

export const DEEP_DIVE_UI_LOCALES: Record<LanguageCode, DeepDiveUIStrings> = {
  en: {
    recommendedFixBadge: 'Recommended Bottleneck Remediation',
    takeQuizBtn: 'Take Quiz to Verify',
    completedBtn: 'Completed',
    markCompletedBtn: 'Mark Completed',
    coreConceptsHeading: 'Core Engineering Concepts',
    techStackHeading: 'Production Tech Stack',
    capstoneHeading: 'Capstone Deliverable',
    viewPaperBtn: 'View Paper / Spec',
    impactLabel: 'Impact:',
    categories: {
      'Seminal Paper': 'Seminal Paper',
      'Architecture Breakthrough': 'Architecture Breakthrough',
      'Open-Source / System Milestone': 'Open-Source / System Milestone',
    },
    quizBanner:
      "Answer each level's engineering verification question correctly to automatically unlock that Roadmap milestone and evolve the 3D District architecture.",
    quizLevelPrefix: 'Level',
    quizChallengeSuffix: 'Verification Challenge',
    milestoneVerifiedBadge: 'Milestone Verified',
    quizCorrectHeading: '✓ Correct — Milestone Unlocked & 3D Pulse Triggered!',
    quizIncorrectHeading: '✕ Architectural Insight — Try Again:',
    vramBanner:
      'Configure LLM parameter scale, quantization precision, context window, and batch size. Exceeding target GPU memory automatically triggers a live KV-Cache OOM bottleneck in the 3D city!',
    oomTitlePrefix: 'GPU HBM OOM:',
    oomRequiredLabel: 'Required >',
    oomBudgetLabel: 'Budget',
    oomDescriptionPrefix:
      'District 05 (Inference Engine) is thrashing HBM memory (Latency:',
    oomDescriptionSuffix: '). Apply an architectural fix below:',
    fixInt4Btn: 'Switch to INT4 AWQ (4x Compression)',
    fixContext4kBtn: 'Reduce Context to 4K',
    fixScale8xH100Btn: 'Scale to 8x H100 Node (640 GB)',
    totalVramFootprint: 'Total VRAM Footprint',
    weightsVram: 'Weights VRAM',
    kvCacheVram: 'KV-Cache VRAM',
    decodeLatency: 'Decode Latency',
    paramScaleHeading: '1. Foundation Model Scale (Parameters)',
    quantPrecisionHeading: '2. Weight & KV Quantization Precision',
    contextWindowHeading: '3. Context Window Length',
    batchSizeHeading: '4. Concurrent Batch Size',
    gpuBudgetHeading: '5. Target GPU Cluster Hardware Budget',
    drawerFooterShortcuts:
      'Shortcuts: [1–8] District · [B] Blueprint · [←/→] Nav · [Esc] Close',
  },
  vi: {
    recommendedFixBadge: 'Giải Pháp Khắc Phục Điểm Nghẽn Được Khuyến Nghị',
    takeQuizBtn: 'Làm Quiz Xác Thực',
    completedBtn: 'Đã Hoàn Thành',
    markCompletedBtn: 'Đánh Dấu Hoàn Thành',
    coreConceptsHeading: 'Khái Niệm Kỹ Thuật Cốt Lõi',
    techStackHeading: 'Công Nghệ Triển Khai Thực Tế (Tech Stack)',
    capstoneHeading: 'Sản Phẩm Thực Hành (Capstone Deliverable)',
    viewPaperBtn: 'Xem Bài Báo / Đặc Tả',
    impactLabel: 'Tác động:',
    categories: {
      'Seminal Paper': 'Bài Báo Nền Tảng',
      'Architecture Breakthrough': 'Đột Phá Kiến Trúc',
      'Open-Source / System Milestone': 'Mã Nguồn Mở / Cột Mốc Hệ Thống',
    },
    quizBanner:
      'Trả lời đúng câu hỏi kiểm tra kỹ thuật của từng cấp độ để tự động mở khóa cột mốc Lộ trình tương ứng và nâng cấp kiến trúc phân khu 3D.',
    quizLevelPrefix: 'Cấp độ',
    quizChallengeSuffix: 'Thử Thách Xác Thực Kỹ Thuật',
    milestoneVerifiedBadge: 'Đã Xác Thực Cột Mốc',
    quizCorrectHeading:
      '✓ Chính xác — Đã Mở Khóa Cột Mốc & Kích Hoạt Xung Năng Lượng 3D!',
    quizIncorrectHeading: '✕ Phân Tích Kiến Trúc — Hãy Thử Lại:',
    vramBanner:
      'Cấu hình quy mô tham số LLM, độ chính xác lượng tử hóa, độ dài ngữ cảnh và kích thước batch. Khi vượt quá dung lượng GPU mục tiêu, hệ thống sẽ kích hoạt lỗi tràn bộ nhớ KV-Cache OOM trực tiếp trên thành phố 3D!',
    oomTitlePrefix: 'TRÀN BỘ NHỚ GPU HBM (OOM):',
    oomRequiredLabel: 'Yêu cầu >',
    oomBudgetLabel: 'Ngân sách',
    oomDescriptionPrefix:
      'Phân khu 05 (Cụm Suy Luận) đang bị quá tải băng thông HBM (Độ trễ:',
    oomDescriptionSuffix: '). Áp dụng ngay một giải pháp kiến trúc bên dưới:',
    fixInt4Btn: 'Chuyển sang INT4 AWQ (Nén 4x)',
    fixContext4kBtn: 'Giảm Ngữ Cảnh xuống 4K',
    fixScale8xH100Btn: 'Nâng cấp lên Cụm 8x H100 (640 GB)',
    totalVramFootprint: 'Tổng Dung Lượng VRAM Chiếm Dụng',
    weightsVram: 'VRAM Trọng Số',
    kvCacheVram: 'VRAM Bộ Đệm KV',
    decodeLatency: 'Độ Trễ Giải Mã',
    paramScaleHeading: '1. Quy Mô Mô Hình Nền Tảng (Số Tham Số)',
    quantPrecisionHeading: '2. Độ Chính Xác Lượng Tử Hóa Trọng Số & KV',
    contextWindowHeading: '3. Độ Dài Cửa Sổ Ngữ Cảnh (Context Window)',
    batchSizeHeading: '4. Kích Thước Batch Đồng Thời',
    gpuBudgetHeading: '5. Ngân Sách Phần Cứng Cụm GPU Mục Tiêu',
    drawerFooterShortcuts:
      'Phím tắt: [1–8] Phân khu · [B] Bản vẽ · [←/→] Điều hướng · [Esc] Đóng',
  },
  ja: {
    recommendedFixBadge: '推奨されるボトルネック解消策',
    takeQuizBtn: 'クイズで習熟度を検証',
    completedBtn: '完了済み',
    markCompletedBtn: '完了としてマーク',
    coreConceptsHeading: 'コア・エンジニアリング概念',
    techStackHeading: 'プロダクション技術スタック',
    capstoneHeading: '実践成果物 (Capstone Deliverable)',
    viewPaperBtn: '論文 / 仕様を見る',
    impactLabel: 'インパクト:',
    categories: {
      'Seminal Paper': '基礎重要論文',
      'Architecture Breakthrough': 'アーキテクチャ革新',
      'Open-Source / System Milestone': 'OSS / システムマイルストーン',
    },
    quizBanner:
      '各レベルの技術検証クイズに正解すると、対応するロードマップのマイルストーンが自動解放され、3D地区アーキテクチャが進化します。',
    quizLevelPrefix: 'レベル',
    quizChallengeSuffix: '技術検証チャレンジ',
    milestoneVerifiedBadge: '検証済みマイルストーン',
    quizCorrectHeading: '✓ 正解 — マイルストーン解放＆3Dパルス発動！',
    quizIncorrectHeading: '✕ アーキテクチャ解説 — もう一度挑戦:',
    vramBanner:
      'LLMパラメータ規模、量子化精度、コンテキスト長、バッチサイズを設定します。GPUメモリ上限を超えると、3D都市でKVキャッシュOOMボトルネックが即座に発生します！',
    oomTitlePrefix: 'GPU HBM メモリ不足 (OOM):',
    oomRequiredLabel: '必要量 >',
    oomBudgetLabel: '上限',
    oomDescriptionPrefix:
      '第5地区（推論エンジン）でHBMメモリスラッシングが発生中（レイテンシ:',
    oomDescriptionSuffix: '）。以下のアーキテクチャ修正を適用してください:',
    fixInt4Btn: 'INT4 AWQに切替 (4倍圧縮)',
    fixContext4kBtn: 'コンテキスト長を4Kに縮小',
    fixScale8xH100Btn: '8x H100ノード (640 GB) に拡張',
    totalVramFootprint: '合計 VRAM 使用量',
    weightsVram: 'モデル重み VRAM',
    kvCacheVram: 'KVキャッシュ VRAM',
    decodeLatency: 'デコード遅延',
    paramScaleHeading: '1. 基盤モデル規模 (パラメータ数)',
    quantPrecisionHeading: '2. 重み＆KVキャッシュ量子化精度',
    contextWindowHeading: '3. コンテキストウィンドウ長',
    batchSizeHeading: '4. 同時実行バッチサイズ',
    gpuBudgetHeading: '5. ターゲットGPUクラスタ容量',
    drawerFooterShortcuts:
      'ショートカット: [1–8] 地区 · [B] 設計図 · [←/→] 移動 · [Esc] 閉じる',
  },
};

interface LocalizedMilestoneFields {
  tierLabel: string;
  title: string;
  summary: string;
  coreConcepts: string[];
  capstoneDeliverable: string;
}

const VI_MILESTONES: Record<string, LocalizedMilestoneFields> = {
  // D1: Input Gateway
  'd1-level-1': {
    tierLabel: '01 · Nền Tảng (Zero)',
    title: 'Chuẩn Hóa Tín Hiệu, Mã Hóa Tensor & Tách Từ Từ Vựng',
    summary:
      'Làm chủ quy trình làm sạch dữ liệu thô đa phương thức: chuẩn hóa Unicode (NFC/NFKC), lọc regex/PII, tần số lấy mẫu âm thanh số, bố cục tensor ảnh (H×W×C) và tách token cấp ký tự/từ tất định.',
    coreConcepts: [
      'Chuẩn hóa Unicode (NFC / NFKC)',
      'Làm sạch bằng Regex & Ẩn thông tin nhạy cảm (PII)',
      'Lấy mẫu tín hiệu số (PCM / Định lý Nyquist)',
      'Biểu diễn Tensor hình ảnh (H×W×C)',
      'Tách token cấp độ ký tự & từ vựng',
    ],
    capstoneDeliverable:
      'Xây dựng công cụ CLI chuẩn hóa văn bản & hình ảnh, chuyển đổi tài liệu UTF-8 và ảnh đa độ phân giải thành các batch tensor chuẩn hóa.',
  },
  'd1-level-2': {
    tierLabel: '02 · Kỹ Thuật Cốt Lõi',
    title: 'Bộ Tách Từ Phụ (Subword), Chia Mảnh ViT & Đặc Trưng Phổ Âm',
    summary:
      'Triển khai các pipeline nén từ phụ (subword) và mã hóa đa phương thức hiện đại, kết nối dữ liệu đầu vào của người dùng với bảng nhúng Transformer mà không bị lỗi từ ngoài từ điển (OOV).',
    coreConcepts: [
      'Byte-Pair Encoding (BPE) & WordPiece',
      'Mô hình ngôn ngữ Unigram & SentencePiece',
      'BPE cấp độ byte (Tiktoken)',
      'Nhúng mảnh hình ảnh (ViT Patchification)',
      'Chuyển đổi phổ âm thanh Log-Mel Spectrogram',
    ],
    capstoneDeliverable:
      'Huấn luyện bộ tokenizer BPE tùy chỉnh từ đầu trên tập dữ liệu đa ngôn ngữ + mã nguồn và trực quan hóa tỷ lệ nén token.',
  },
  'd1-level-3': {
    tierLabel: '03 · Vận Hành & Mở Rộng',
    title: 'Tiếp Nhận Bất Đồng Bộ Thông Lượng Cao & Phân Tích Tài Liệu Đa Phương Thức',
    summary:
      'Thiết kế cổng tiếp nhận chịu lỗi cao, có khả năng phân tích PDF phức tạp, bảng biểu và luồng media đồng thời với kiểm tra schema nghiêm ngặt và kiểm soát áp lực ngược (backpressure).',
    coreConcepts: [
      'Tiếp nhận bất đồng bộ (Async Ingress) & Kiểm soát Backpressure',
      'Phân tích tài liệu đa phương thức dạng luồng (OCR & Bố cục)',
      'Kiểm tra hợp lệ Schema Payload nghiêm ngặt',
      'Gom batch đầu vào động (Dynamic Ingress Batching)',
      'Hàng đợi tiếp nhận hướng sự kiện (Event-Driven Queues)',
    ],
    capstoneDeliverable:
      'Triển khai microservice tiếp nhận đa phương thức bất đồng bộ xử lý hơn 1.000 req/giây với gRPC streaming, Pydantic v2 và Kafka backpressure.',
  },
  'd1-level-4': {
    tierLabel: '04 · Tiên Phong & SOTA (Hero)',
    title: 'Token Đa Phương Thức Hợp Nhất Sớm (Early-Fusion) & Kiến Trúc Cấp Độ Byte',
    summary:
      'Xóa bỏ ranh giới giữa các phương thức bằng từ điển lượng tử hóa vector (VQ-VAE) cho hình ảnh/âm thanh, đóng gói patch giữ nguyên tỷ lệ khung hình (NaViT) và mô hình byte không cần tokenizer (BLT).',
    coreConcepts: [
      'Token hình ảnh/âm thanh rời rạc (VQ-VAE / VQGAN)',
      'Đóng gói Patch giữ nguyên độ phân giải gốc (NaViT)',
      'Luồng đa phương thức đan xen hợp nhất sớm (Early-Fusion)',
      'Kiến trúc Byte-Latent không cần Tokenizer (BLT)',
      'Chia patch động dẫn hướng bằng Entropy',
    ],
    capstoneDeliverable:
      'Triển khai bộ tuần tự hóa luồng token đa phương thức hợp nhất cho đầu vào ảnh-âm thanh-văn bản đan xen sử dụng VQ-VAE và NaViT packing.',
  },

  // D2: Data Lake & Vector Vault
  'd2-level-1': {
    tierLabel: '01 · Nền Tảng (Zero)',
    title: 'Không Gian Vector, Độ Đo Khoảng Cách & Phân Đoạn Ngữ Nghĩa (Chunking)',
    summary:
      'Hiểu bản chất hình học của độ tương đồng trong không gian nhiều chiều, kỹ thuật cắt đoạn tài liệu theo cấu trúc và sự đánh đổi giữa lưu trữ quan hệ, tài liệu và vector.',
    coreConcepts: [
      'Độ tương đồng Cosine, Khoảng cách Euclid L2 & Tích vô hướng',
      'Lời nguyền chiều dữ liệu & Chuẩn hóa Vector đơn vị',
      'Phân đoạn tài liệu cố định, đệ quy & theo ngữ nghĩa',
      'Lưu trữ cơ sở dữ liệu quan hệ vs. Đối tượng phi cấu trúc',
      'Tìm kiếm k láng giềng gần nhất chính xác (Flat k-NN)',
    ],
    capstoneDeliverable:
      'Xây dựng công cụ tìm kiếm ngữ nghĩa trong bộ nhớ bằng NumPy thuần với thuật toán k-NN chính xác hỗ trợ các độ đo Cosine, L2 và Dot-Product.',
  },
  'd2-level-2': {
    tierLabel: '02 · Kỹ Thuật Cốt Lõi',
    title: 'Vector Nhúng Đa Phương Thức Đặc & Chỉ Mục Đồ Thị/Lượng Tử Hóa ANN',
    summary:
      'Làm chủ biểu diễn bi-encoder đặc (dense embeddings) và các cấu trúc dữ liệu tìm kiếm xấp xỉ láng giềng gần nhất (ANN) dưới tuyến tính cho truy vấn độ trễ thấp.',
    coreConcepts: [
      'Vector nhúng văn bản & đa phương thức (CLIP, SigLIP, BGE, E5)',
      'Đồ thị thế giới nhỏ điều hướng phân cấp (HNSW)',
      'Chỉ mục tệp đảo ngược & Lượng tử hóa tích (IVF-PQ, ScaNN)',
      'Sự đánh đổi giữa độ phủ Recall@K và thông lượng QPS',
      'Lưu trữ vector giao dịch trong PostgreSQL (pgvector)',
    ],
    capstoneDeliverable:
      'Đánh chỉ mục 100.000 mục văn bản + hình ảnh trong FAISS và pgvector đạt độ trễ truy vấn p99 < 15ms và Recall@10 > 95%.',
  },
  'd2-level-3': {
    tierLabel: '03 · Vận Hành & Mở Rộng',
    title: 'Cơ Sở Dữ Liệu Vector Phân Tán, Tìm Kiếm Lai RRF & Định Dạng Lakehouse',
    summary:
      'Kết hợp độ chính xác từ khóa của BM25 với độ phủ ngữ nghĩa của vector đặc trên các phân mảnh phân tán, tinh chỉnh bằng xếp hạng lại Cross-Encoder hai giai đoạn và lưu trữ cột Lakehouse.',
    coreConcepts: [
      'Phân mảnh (Sharding) & Nhân bản Vector phân tán',
      'Tìm kiếm lai (Kết hợp từ khóa BM25 thưa + Vector đặc)',
      'Hợp nhất thứ hạng nghịch đảo (Reciprocal Rank Fusion - RRF)',
      'Xếp hạng lại hai giai đoạn bằng Cross-Encoder (Reranking)',
      'Hồ dữ liệu AI dạng cột (Parquet, LanceDB, Apache Iceberg)',
    ],
    capstoneDeliverable:
      'Thiết kế pipeline truy xuất Hybrid RAG hoàn chỉnh kết hợp BM25 + dense vector qua RRF và bước xếp hạng lại bằng Cross-Encoder.',
  },
  'd2-level-4': {
    tierLabel: '04 · Tiên Phong & SOTA (Hero)',
    title: 'Truy Xuất Đa Vector Tương Tác Trễ (ColBERT), GraphRAG & Lượng Tử Hóa Nhị Phân',
    summary:
      'Đưa độ chính xác truy xuất và tỷ lệ nén lên đỉnh cao bằng phép toán MaxSim cấp độ token, nhúng trang tài liệu thị giác-ngôn ngữ và đồ thị tri thức tổng hợp cộng đồng.',
    coreConcepts: [
      'Truy xuất đa vector tương tác trễ (ColBERT MaxSim)',
      'Truy xuất tài liệu trực quan không cần OCR (ColPali)',
      'GraphRAG (Đồ thị thực thể + Tổng hợp vector cộng đồng)',
      'Lượng tử hóa Vector nhị phân & vô hướng (Giảm 32x RAM)',
      'Học biểu diễn Matryoshka (MRL - Đa chiều linh hoạt)',
    ],
    capstoneDeliverable:
      'Triển khai công cụ truy xuất đa phương thức ColPali + GraphRAG trên các tài liệu PDF tài chính/khoa học phức tạp kết hợp lượng tử hóa nhị phân.',
  },

  // D3 (computer-vision): Guardrails & Eval Gate
  'd3-level-1': {
    tierLabel: '01 · Nền Tảng (Zero)',
    title: 'Nhân Tích Chập, Bản Đồ Đặc Trưng Không Gian & Kiểm Tra Đầu Vào/Đầu Ra',
    summary:
      'Nắm vững bộ lọc không gian, vùng cảm nhận (receptive field), phân cấp đặc trưng phần dư, kiểm tra tính hợp lệ payload tất định và che mờ thông tin nhạy cảm (PII) trên ảnh/văn bản.',
    coreConcepts: [
      'Tích chập 2D, Bước trượt (Stride), Đệm (Padding) & Vùng cảm nhận',
      'Phân cấp đặc trưng không gian & Kết nối tắt (Residual Connections)',
      'Rào chắn Schema Đầu vào/Đầu ra & Ẩn thông tin PII thị giác',
      'Chỉ số đánh giá Thị giác & NLP cổ điển (IoU, mAP, BLEU, ROUGE)',
      'Tăng cường dữ liệu (RandAugment, MixUp, CutMix)',
    ],
    capstoneDeliverable:
      'Xây dựng middleware ẩn thông tin nhạy cảm (PII) trên ảnh/văn bản và kiểm tra JSON-schema theo thời gian thực kèm trực quan hóa bản đồ đặc trưng CNN.',
  },
  'd3-level-2': {
    tierLabel: '02 · Kỹ Thuật Cốt Lõi',
    title: 'Vision Transformers, Phát Hiện Từ Vựng Mở & Đánh Giá RAGAS',
    summary:
      'Kết hợp kiến trúc thị giác tự chú ý (Self-Attention) với khung đánh giá không cần nhãn tham chiếu (RAGAS) và tiêu chí chấm điểm LLM/VLM-as-a-Judge để định lượng độ trung thực.',
    coreConcepts: [
      'Vision Transformers (ViT, Swin) & Học tự giám sát DINOv2',
      'Phân vùng theo nhắc lệnh (SAM) & Phát hiện đối tượng từ vựng mở',
      'Khung đánh giá RAGAS (Độ trung thực, Độ liên quan, Độ chính xác ngữ cảnh)',
      'Tiêu chí chấm điểm LLM/VLM-as-a-Judge & Phát hiện ảo giác bằng NLI',
      'Neo ngữ nghĩa thị giác (Visual Grounding) & Kiểm chứng hộp giới hạn',
    ],
    capstoneDeliverable:
      'Xây dựng bộ kiểm thử CI tự động sử dụng RAGAS và kiểm tra đối chiếu thị giác VLM trên tập dữ liệu kiểm thử chuẩn.',
  },
  'd3-level-3': {
    tierLabel: '03 · Vận Hành & Mở Rộng',
    title: 'Kiểm Thử Đối Kháng (Red-Teaming), Phòng Chống Jailbreak Đa Phương Thức & Constitutional AI',
    summary:
      'Bảo vệ pipeline thị giác và ngôn ngữ trước các miếng vá đối kháng, tấn công chèn lệnh qua chữ trên ảnh (typographic injection) và nội dung không an toàn bằng bộ phân loại độ trễ thấp.',
    coreConcepts: [
      'Red-Teaming đối kháng & Tấn công chữ viết trên ảnh (Typographic Attacks)',
      'Phòng chống tấn công chèn lệnh trực tiếp & gián tiếp (Prompt Injection)',
      'Bộ phân loại an toàn đa phương thức (Llama Guard Vision)',
      'Thực thi chính sách Constitutional AI ở độ trễ thấp',
      'Gom batch luồng video & khung hình thông lượng cao',
    ],
    capstoneDeliverable:
      'Triển khai proxy rào chắn bảo vệ 2 lớp (đầu vào + đầu ra) đa phương thức chống lại tấn công chèn lệnh gián tiếp và ảnh đối kháng.',
  },
  'd3-level-4': {
    tierLabel: '04 · Tiên Phong & SOTA (Hero)',
    title: 'Giải Thích Cơ Học (Sparse Autoencoders), Diffusion Transformers & Thủy Vân SynthID',
    summary:
      'Giải mã kích hoạt thần kinh bên trong mô hình bằng Bộ tự mã hóa thưa (SAE) để trích xuất các đặc trưng đơn nghĩa, điều hướng hành vi mô hình và xác thực nguồn gốc media bằng thủy vân mật mã.',
    coreConcepts: [
      'Khả năng giải thích cơ học & Tách gỡ tính đa nghĩa (Polysemanticity)',
      'Bộ tự mã hóa thưa (Sparse Autoencoders - SAE) & Điều hướng kích hoạt',
      'Diffusion Transformers (DiT) & Đối sánh dòng chảy (Flow Matching)',
      'Kiểm chứng hình thức đối với hành động của Agent đa phương thức',
      'Đóng dấu thủy vân xác thực nguồn gốc bằng mật mã (SynthID / C2PA)',
    ],
    capstoneDeliverable:
      'Trực quan hóa và điều hướng biểu diễn nội tại của mô hình bằng kích hoạt đặc trưng Sparse Autoencoder (SAE) kết hợp đóng dấu thủy vân đầu ra.',
  },

  // D4 (nlp-district): Agentic & MCP Orchestrator
  'd4-level-1': {
    tierLabel: '01 · Nền Tảng (Zero)',
    title: 'Học Trong Ngữ Cảnh (ICL), Đầu Ra Có Cấu Trúc & Suy Luận Chuỗi Tư Duy (CoT)',
    summary:
      'Làm chủ kỹ thuật thiết kế nhắc lệnh theo ngữ cảnh, giải mã ràng buộc theo văn phạm phi ngữ cảnh (CFG) / JSON Schema tất định và phân rã bài toán từng bước bằng Chain-of-Thought.',
    coreConcepts: [
      'Học trong ngữ cảnh Zero-Shot & Few-Shot (In-Context Learning)',
      'Kiến trúc System Prompt & Phân cấp độ ưu tiên chỉ thị',
      'Đầu ra có cấu trúc tất định (JSON Schema / Văn phạm CFG)',
      'Suy luận Chuỗi tư duy (CoT) & Tự nhất quán (Self-Consistency)',
      'Nhúng token theo ngữ cảnh & Cơ chế chú ý ngữ nghĩa',
    ],
    capstoneDeliverable:
      'Xây dựng pipeline trích xuất dữ liệu có cấu trúc và suy luận Chain-of-Thought đảm bảo 100% đầu ra tuân thủ đúng ngữ pháp JSON.',
  },
  'd4-level-2': {
    tierLabel: '02 · Kỹ Thuật Cốt Lõi',
    title: 'Vòng Lặp ReAct, Gọi Hàm (Tool Calling), Bộ Nhớ Agent & Giao Thức MCP',
    summary:
      'Kết nối mô hình ngôn ngữ với các công cụ bên ngoài, cơ sở dữ liệu và hệ thống bộ nhớ đa tầng bằng giao diện gọi công cụ chuẩn hóa và máy chủ Model Context Protocol (MCP).',
    coreConcepts: [
      'Vòng lặp thực thi ReAct (Suy luận + Hành động)',
      'Gọi hàm & công cụ tất định (Function & Tool Calling)',
      'Bộ nhớ ngắn hạn, bộ nhớ sự kiện (Episodic) & bộ nhớ dài hạn ngữ nghĩa',
      'Kiến trúc Máy chủ & Máy khách Model Context Protocol (MCP)',
      'Đối chiếu kết quả công cụ & Định dạng lỗi phản hồi',
    ],
    capstoneDeliverable:
      'Xây dựng Máy chủ Model Context Protocol (MCP Server) tùy chỉnh cung cấp công cụ truy vấn DB, hệ thống tệp và tìm kiếm cho một ReAct Agent tự hành.',
  },
  'd4-level-3': {
    tierLabel: '03 · Vận Hành & Mở Rộng',
    title: 'Đồ Thị Agent Có Trạng Thái Chu Trình, Thực Thi Sandbox & Tự Sửa Lỗi',
    summary:
      'Vượt qua các chuỗi tuyến tính dễ gãy để xây dựng máy trạng thái bền vững với cổng phê duyệt có con người (HITL), sandbox chạy code cô lập và vòng lặp tự sửa lỗi dựa trên trình biên dịch.',
    coreConcepts: [
      'Đồ thị Agent có chu trình lưu trạng thái & Điểm lưu (Checkpointing)',
      'Ngắt có con người phê duyệt (HITL) & Gỡ lỗi du hành thời gian (Time-Travel)',
      'Môi trường thực thi mã cô lập (MicroVMs / Container Sandboxes)',
      'Vòng lặp tự sửa lỗi dựa trên Trình biên dịch & Kiểm thử tự động',
      'Quản lý ngân sách Token & Nén cửa sổ ngữ cảnh',
    ],
    capstoneDeliverable:
      'Thiết kế Agent nghiên cứu & lập trình đa bước có trạng thái bằng LangGraph kèm sandbox chạy kiểm thử cô lập và tự động phục hồi lỗi.',
  },
  'd4-level-4': {
    tierLabel: '04 · Tiên Phong & SOTA (Hero)',
    title: 'Bầy Đàn Đa Agent Phân Cấp, Cây Tư Duy (ToT) & Lập Kế Hoạch MCTS',
    summary:
      'Điều phối các Agent tự hành chuyên biệt với bộ định tuyến giám sát tường minh, tìm kiếm nhìn trước trên cây suy luận và khả năng tự tổng hợp công cụ mới động.',
    coreConcepts: [
      'Bầy đàn đa Agent phân cấp & Định tuyến qua Supervisor',
      'Lập kế hoạch bằng Cây tư duy (Tree-of-Thoughts) & Tìm kiếm MCTS',
      'Mô hình phần thưởng quá trình (PRM) & Kiểm chứng từng bước',
      'Tự động tổng hợp & cải tiến công cụ mới',
      'Trạng thái nhận thức chung & Giải quyết xung đột giữa các Agent',
    ],
    capstoneDeliverable:
      'Xây dựng hệ thống điều phối đa Agent với bộ định tuyến giám sát, kiểm chứng song song và lập kế hoạch nhìn trước bằng Tree-of-Thoughts.',
  },

  // D5 (training-cluster): Training Foundry
  'd5-level-1': {
    tierLabel: '01 · Nền Tảng (Zero)',
    title: 'Đồ Thị Tính Toán, Đạo Hàm Tự Động Ngược (Autograd) & Bộ Tối Ưu Hóa Thích Nghi',
    summary:
      'Hiểu động cơ toán học của học sâu từ những nguyên lý đầu tiên: xây dựng đồ thị DAG động, lan truyền ngược theo quy tắc dây chuyền, bề mặt hàm mất mát và động lực học suy giảm trọng số.',
    coreConcepts: [
      'Đồ thị tính toán động & Đạo hàm tự động chế độ ngược (Reverse-Mode Autograd)',
      'Hàm mất mát Cross-Entropy, Perplexity & Tương phản InfoNCE',
      'Triệt tiêu/Bùng nổ Gradient & Khởi tạo trọng số',
      'SGD có quán tính (Momentum), Adam & Suy giảm trọng số tách rời (AdamW)',
      'Lưu điểm kiểm tra kích hoạt (Activation Checkpointing: Bộ nhớ vs. Tính toán)',
    ],
    capstoneDeliverable:
      'Tự viết bộ máy autograd vô hướng và tensor từ đầu, sau đó huấn luyện mạng nơ-ron đa tầng với bộ tối ưu AdamW tự cài đặt.',
  },
  'd5-level-2': {
    tierLabel: '02 · Kỹ Thuật Cốt Lõi',
    title: 'Huấn Luyện Độ Chính Xác Hỗn Hợp (BF16/FP8) & Tinh Chỉnh Hiệu Quả Tham Số (LoRA/QLoRA)',
    summary:
      'Tối đa hóa thông lượng GPU đơn nút và tinh chỉnh các mô hình hàng tỷ tham số trên GPU phổ thông/đám mây bằng phân rã ma trận hạng thấp và lượng tử hóa NormalFloat 4-bit.',
    coreConcepts: [
      'Huấn luyện độ chính xác hỗn hợp (FP16 Dynamic Loss Scaling & BF16)',
      'Tích lũy Gradient, Cắt chuẩn toàn cục (Grad Clipping) & Lịch trình Cosine LR',
      'Thích nghi hạng thấp (LoRA: ΔW = B·A)',
      'Tinh chỉnh lượng tử hóa NormalFloat 4-Bit (QLoRA & Paged Optimizers)',
      'Tinh chỉnh có giám sát (SFT) & Đóng gói chuỗi chỉ thị (Sequence Packing)',
    ],
    capstoneDeliverable:
      'Tinh chỉnh mô hình mã nguồn mở 7B/8B trên tập dữ liệu chỉ thị chuyên ngành bằng QLoRA với độ chính xác hỗn hợp BF16 và lịch trình học Cosine.',
  },
  'd5-level-3': {
    tierLabel: '03 · Vận Hành & Mở Rộng',
    title: 'Song Song Hóa Phân Tán 3 Chiều (3D Parallelism): FSDP, DeepSpeed ZeRO & Megatron-LM',
    summary:
      'Mở rộng quy mô huấn luyện trên hàng trăm GPU H100 bằng cách phân mảnh trạng thái bộ tối ưu, gradient, tham số và kích hoạt qua mạng liên kết tốc độ cao NVLink và InfiniBand.',
    coreConcepts: [
      'Song song dữ liệu phân tán (DDP) & Thuật toán Ring-AllReduce',
      'DeepSpeed ZeRO Giai đoạn 1, 2 & 3 (Phân mảnh Optimizer/Gradient/Tham số)',
      'PyTorch Fully Sharded Data Parallel (FSDP2)',
      'Song song Tensor (Chia Cột/Hàng) & Song song Pipeline (Lịch trình 1F1B)',
      'Phép toán tập thể NCCL, Tối ưu hóa tô-pô mạng NVLink & InfiniBand',
    ],
    capstoneDeliverable:
      'Cấu hình pipeline huấn luyện đa GPU FSDP / DeepSpeed ZeRO-3 với activation checkpointing, đo đạc thông lượng gradient và lưu checkpoint chịu lỗi.',
  },
  'd5-level-4': {
    tierLabel: '04 · Tiên Phong & SOTA (Hero)',
    title: 'Căn Chỉnh Hậu Huấn Luyện (RLHF, DPO, GRPO) & Quy Luật Mở Rộng Tối Ưu Tính Toán',
    summary:
      'Căn chỉnh các mô hình tiên phong theo thị hiếu con người và phần thưởng suy luận có thể kiểm chứng, đồng thời dự báo đường cong mất mát qua quy luật mở rộng Chinchilla.',
    coreConcepts: [
      'RLHF với Tối ưu hóa chính sách cận kề (PPO) & Phạt phân kỳ KL',
      'Tối ưu hóa thị hiếu trực tiếp (DPO) không cần Mô hình phần thưởng riêng',
      'Tối ưu hóa chính sách tương đối theo nhóm (GRPO) cho suy luận RL',
      'Học tăng cường với phần thưởng kiểm chứng được (RLVR) cho Toán & Code',
      'Quy luật mở rộng tối ưu tính toán Chinchilla (Phân bổ Tham số N vs. Token D)',
    ],
    capstoneDeliverable:
      'Căn chỉnh mô hình chính sách bằng DPO và GRPO trên tập dữ liệu thị hiếu và phần thưởng toán/code kiểm chứng được kèm đánh giá tỷ lệ thắng tự động.',
  },

  // D6 (model-core): Model Core & Registry
  'd6-level-1': {
    tierLabel: '01 · Nền Tảng (Zero)',
    title: 'Mạng MLP, Động Lực Học Luồng Phần Dư, CNN & Mô Hình Chuỗi Hồi Quy (RNN)',
    summary:
      'Làm chủ các thiên kiến quy nạp nền tảng của mạng nơ-ron sâu: phép chiếu affine, hàm kích hoạt phi tuyến, kết nối tắt (skip connections) và trạng thái ẩn tuần tự.',
    coreConcepts: [
      'Perceptron đa tầng (MLP) & Định lý xấp xỉ vạn năng',
      'Các hàm kích hoạt (ReLU, GELU, SiLU / Swish)',
      'Kết nối phần dư & Độ ổn định giữa Pre-Norm so với Post-Norm',
      'Mạng nơ-ron hồi quy (RNN, LSTM, GRU) & Điểm nghẽn tuần tự',
      'Hình học biểu diễn & Đa tạp tiềm ẩn (Latent Manifolds)',
    ],
    capstoneDeliverable:
      'Cài đặt các khối ResNet mô-đun và bộ mã hóa chuỗi có cổng trong PyTorch thuần kèm công cụ chẩn đoán chuẩn gradient.',
  },
  'd6-level-2': {
    tierLabel: '02 · Kỹ Thuật Cốt Lõi',
    title: 'Chú Ý Tích Vô Hướng Có Trọng Số, Đa Đầu Chú Ý (MHA) & Khối Transformer',
    summary:
      'Xây dựng hoàn chỉnh kiến trúc Transformer Encoder, Decoder và Prefix-LM từ đầu với mặt nạ nhân quả (causal mask) và mã hóa vị trí dạng sin hoặc học được.',
    coreConcepts: [
      'Chú ý tích vô hướng có tỷ lệ: softmax(QKᵀ / √dₖ)V',
      'Chú ý đa đầu (Multi-Head Attention - MHA) & Phép chiếu không gian con',
      'Mặt nạ tự hồi quy nhân quả (Causal Masking) & Chú ý chéo (Cross-Attention)',
      'Chuẩn hóa tầng (LayerNorm) & Kiến trúc luồng phần dư (Residual Stream)',
      'Mã hóa vị trí tuyệt đối dạng hàm Sin & dạng học được',
    ],
    capstoneDeliverable:
      'Lập trình hoàn chỉnh một mô hình Transformer tự hồi quy kiểu GPT từ đầu bằng PyTorch và tiền huấn luyện trên kho ngữ liệu ký tự/từ phụ.',
  },
  'd6-level-3': {
    tierLabel: '03 · Vận Hành & Mở Rộng',
    title: 'Khung Xương Sống LLM Hiện Đại: RoPE, SwiGLU, RMSNorm, GQA/MLA & FlashAttention',
    summary:
      'Nâng cấp Transformer cổ điển lên đặc tả tiên phong hiện đại hỗ trợ cửa sổ ngữ cảnh 128k+, nén bộ đệm KV và cơ chế chú ý chia ô tối ưu IO trên bộ nhớ SRAM.',
    coreConcepts: [
      'Nhúng vị trí xoay (RoPE) & Mở rộng ngữ cảnh YaRN',
      'Mạng tiến thẳng có cổng SwiGLU & Chuẩn hóa trước Pre-RMSNorm',
      'Chú ý truy vấn nhóm (GQA) & Chú ý tiềm ẩn đa đầu (DeepSeek MLA)',
      'Chia ô tối ưu hóa IO phần cứng (FlashAttention-2 / FlashAttention-3)',
      'Chú ý cửa sổ trượt (Sliding Window) & Ring Attention cho ngữ cảnh 1M+',
    ],
    capstoneDeliverable:
      'Nâng cấp mô hình Transformer cơ bản với RoPE, GQA, RMSNorm, SwiGLU và FlashAttention-2, đo kiểm mức tiết kiệm bộ nhớ và tăng tốc ở ngữ cảnh 32k.',
  },
  'd6-level-4': {
    tierLabel: '04 · Tiên Phong & SOTA (Hero)',
    title: 'Hỗn Hợp Chuyên Gia Thưa (Sparse MoE), Lai Ghép Mamba/SSM & Tính Toán Thời Điểm Suy Luận',
    summary:
      'Tách biệt tổng dung lượng tham số khỏi chi phí FLOPs trên mỗi token bằng các tầng Sparse MoE định tuyến động, mô hình không gian trạng thái độ phức tạp tuyến tính và vòng lặp suy luận tiềm ẩn.',
    coreConcepts: [
      'Hỗn hợp chuyên gia thưa (Sparse MoE) & Định tuyến Token Top-K',
      'Chuyên gia dùng chung + Chuyên gia mịn & Cân bằng tải không cần hàm phạt phụ',
      'Mô hình không gian trạng thái chọn lọc (Mamba / Mamba-2) & Kiến trúc lai Jamba',
      'Diffusion Transformers (DiT) cho sinh dữ liệu liên tục và rời rạc',
      'Mở rộng tính toán thời điểm suy luận (Test-Time Compute) & Kiến trúc độ sâu hồi quy',
    ],
    capstoneDeliverable:
      'Xây dựng tầng Transformer Sparse Mixture-of-Experts (MoE) với định tuyến token top-k, chuyên gia dùng chung và hệ thống đo lường cân bằng tải.',
  },

  // D7 (inference-center): Inference Engine
  'd7-level-1': {
    tierLabel: '01 · Nền Tảng (Zero)',
    title: 'Động Lực Học Prefill vs. Decode, Mô Hình Roofline & Cơ Chế Bộ Đệm KV',
    summary:
      'Phân tích tại sao giai đoạn xử lý prompt (Prefill) bị giới hạn bởi năng lực tính toán trong khi giai đoạn sinh token (Decode) bị giới hạn bởi băng thông bộ nhớ, và tính toán chính xác dung lượng byte của KV-Cache.',
    coreConcepts: [
      'Prefill giới hạn bởi Tính toán (Compute-Bound) vs. Decode giới hạn bởi Băng thông nhớ',
      'Mô hình hiệu năng GPU Roofline (Cường độ số học: FLOPs/Byte)',
      'Cơ chế bộ đệm Key-Value (KV Cache) & Công thức tính dung lượng bộ nhớ',
      'Lấy mẫu tự hồi quy (Temperature, Top-P, Top-K, Min-P)',
      'Tuần tự hóa mô hình an toàn (safetensors, TorchScript)',
    ],
    capstoneDeliverable:
      'Đo đạc (profile) độ trễ prefill so với decode, mức sử dụng băng thông HBM và dung lượng KV-cache trên nhiều kích thước batch và độ dài chuỗi khác nhau.',
  },
  'd7-level-2': {
    tierLabel: '02 · Kỹ Thuật Cốt Lõi',
    title: 'Trình Biên Dịch Thực Thi (ONNX / TensorRT) & Lượng Tử Hóa Hậu Huấn Luyện (AWQ / GPTQ / FP8)',
    summary:
      'Nén trọng số và kích hoạt của mô hình xuống biểu diễn 8-bit và 4-bit đồng thời hợp nhất đồ thị toán tử (operator fusion) để triệt tiêu chi phí gọi nhân GPU.',
    coreConcepts: [
      'Hợp nhất đồ thị tính toán (LayerNorm + MatMul + GELU Fusion)',
      'Trình biên dịch thực thi (ONNX Runtime, TensorRT, TensorRT-LLM)',
      'Lượng tử hóa Trọng số & Kích hoạt (INT8, INT4, FP8)',
      'Lượng tử hóa trọng số nhận biết kích hoạt (AWQ) & GPTQ',
      'Suy luận trên CPU/Thiết bị biên với định dạng GGUF & llama.cpp',
    ],
    capstoneDeliverable:
      'Xuất mô hình PyTorch sang ONNX/TensorRT và AWQ INT4, đo kiểm mức tăng tốc độ thông lượng và độ giữ nguyên chất lượng (perplexity).',
  },
  'd7-level-3': {
    tierLabel: '03 · Vận Hành & Mở Rộng',
    title: 'PagedAttention (vLLM), Gom Batch Liên Tục & Máy Chủ Suy Luận Triton',
    summary:
      'Triệt tiêu phân mảnh bộ nhớ KV-cache bằng kỹ thuật phân trang bộ nhớ ảo lấy cảm hứng từ Hệ điều hành và tối đa hóa hiệu suất GPU dưới tải đa người dùng bằng gom batch liên tục.',
    coreConcepts: [
      'PagedAttention cho bộ đệm KV không liên tục, không lãng phí bộ nhớ',
      'Gom batch liên tục cấp độ vòng lặp (Continuous / In-Flight Batching)',
      'Chia nhỏ Prefill (Chunked Prefill) chống nghẽn đầu hàng cho giai đoạn Decode',
      'Phối hợp đa mô hình trên NVIDIA Triton Inference Server',
      'Phục vụ song song Tensor (Tensor Parallelism) trên cụm đa GPU',
    ],
    capstoneDeliverable:
      'Triển khai cụm phục vụ LLM/Vision thông lượng cao trên vLLM và Triton Inference Server với PagedAttention và continuous batching.',
  },
  'd7-level-4': {
    tierLabel: '04 · Tiên Phong & SOTA (Hero)',
    title: 'Giải Mã Đầu Cơ (Speculative Decoding), Bộ Đệm Tiền Tố RadixAttention & Phục Vụ Tách Rời',
    summary:
      'Phá vỡ điểm nghẽn tuần tự tự hồi quy bằng kiểm chứng đầu cơ mô hình nháp-đích, chia sẻ KV-cache tiền tố theo cấu trúc cây và tách rời cụm GPU Prefill/Decode.',
    coreConcepts: [
      'Giải mã đầu cơ (Speculative Decoding với Draft-Model & đầu Medusa / EAGLE)',
      'Tái sử dụng bộ đệm KV tiền tố qua cây RadixAttention',
      'Tách rời cụm GPU Prefill & Decode (Kiến trúc Mooncake / NVIDIA Dynamo)',
      'Nhân giải mã tùy chỉnh tối ưu hóa cấp độ Warp bằng Triton & CUDA',
      'Mặt nạ văn phạm có cấu trúc chi phí bằng không (XGrammar)',
    ],
    capstoneDeliverable:
      'Triển khai giải mã đầu cơ kết hợp bộ đệm tiền tố đạt mức tăng tốc sinh token trên 2.2x mà không làm giảm chất lượng đầu ra.',
  },

  // D8 (output-terminal): Output Nexus & MLOps Telemetry
  'd8-level-1': {
    tierLabel: '01 · Nền Tảng (Zero)',
    title: 'Truyền Luồng Token Thời Gian Thực (SSE / WebSockets) & Đo Lường Độ Trễ (TTFT / ITL)',
    summary:
      'Truyền phát mượt mà các mảnh văn bản UTF-8 đã giải mã tới giao diện người dùng đồng thời đo lường các chỉ số SLO độ trễ cốt lõi và nhật ký có cấu trúc.',
    coreConcepts: [
      'Server-Sent Events (SSE) & Giao thức WebSockets hai chiều',
      'Giải mã token UTF-8 tăng dần & Kiểm soát áp lực ngược (Backpressure)',
      'Thời gian tới Token đầu tiên (TTFT) vs. Độ trễ giữa các Token (ITL / TPOT)',
      'Ghi nhật ký JSON có cấu trúc & Mã định danh tương quan (Correlation ID)',
      'Cơ chế Hết thời gian chờ (Timeout), Thử lại & Ngắt mạch dự phòng (Circuit Breaker)',
    ],
    capstoneDeliverable:
      'Xây dựng endpoint truyền luồng SSE bền vững kèm bảng điều khiển HUD hiển thị thời gian thực các bộ đếm TTFT, ITL và tốc độ tokens/giây.',
  },
  'd8-level-2': {
    tierLabel: '02 · Kỹ Thuật Cốt Lõi',
    title: 'Truy Vết Phân Tán GenAI (OpenTelemetry) & Quan Sát Chi Phí/Độ Trễ',
    summary:
      'Gắn đo lường cho các lời gọi RAG và Agent đa bước bằng cây truy vết phân tán, hạch toán chi phí token, quản lý phiên bản prompt và bảng điều khiển Prometheus/Grafana trực tiếp.',
    coreConcepts: [
      'Quy ước ngữ nghĩa OpenTelemetry cho Hệ thống GenAI (gen_ai.*)',
      'Cây Span phân tán cho hệ thống RAG & Agent đa công cụ',
      'Quản lý phiên bản Prompt & Phân bổ chi phí theo từng Token',
      'Biểu đồ tần suất Prometheus (Độ trễ phân vị p50, p95, p99)',
      'Cảnh báo Grafana thời gian thực & Ngân sách lỗi cam kết dịch vụ (SLO Error Budget)',
    ],
    capstoneDeliverable:
      'Tích hợp truy vết OpenTelemetry GenAI, quản lý prompt Langfuse và bảng điều khiển SLO Grafana thời gian thực cho một pipeline AI đa bước.',
  },
  'd8-level-3': {
    tierLabel: '03 · Vận Hành & Mở Rộng',
    title: 'MLOps Đóng Gói Container, Triển Khai Canary/Shadow & Phát Hiện Trôi Dạt Dữ Liệu',
    summary:
      'Phát hành bản cập nhật mô hình an toàn bằng phân chia lưu lượng lũy tiến, phản chiếu lưu lượng ngầm (shadow mirroring), bộ đệm ngữ nghĩa và giám sát độ trôi dạt vector nhúng.',
    coreConcepts: [
      'Microservice GPU đóng gói Container (Docker & Kubernetes)',
      'Triển khai cuốn chiếu Canary & Phản chiếu lưu lượng ngầm bất đồng bộ (Shadow)',
      'Bộ đệm phản hồi theo ngữ nghĩa (Semantic Vector Similarity Cache)',
      'Phát hiện trôi dạt dữ liệu, vector nhúng & khái niệm bằng thống kê (PSI / MMD)',
      'Tự động quay lui (Rollback) khi suy giảm chất lượng hoặc vượt ngưỡng độ trễ',
    ],
    capstoneDeliverable:
      'Xây dựng pipeline triển khai Shadow bằng Docker tự động nhân bản lưu lượng thực tế sang mô hình ứng viên và đối sánh độ trễ, chi phí cùng điểm chấm tự động.',
  },
  'd8-level-4': {
    tierLabel: '04 · Tiên Phong & SOTA (Hero)',
    title: 'Bánh Đà Dữ Liệu Tự Hành (Data Flywheel) & Định Tuyến Đa Mô Hình Nhận Biết SLO',
    summary:
      'Khép kín vòng lặp vận hành thực tế: tự động khai thác các ca khó và phản hồi người dùng thành tập dữ liệu tinh chỉnh chuẩn, đồng thời định tuyến truy vấn linh hoạt qua các tầng mô hình.',
    coreConcepts: [
      'Bánh đà dữ liệu sản xuất tự hành khép kín (Closed-Loop Data Flywheel)',
      'Tự động khai thác mẫu khó (Hard-Example Mining) & Tuyển chọn học chủ động',
      'Tín hiệu phản hồi ngầm từ người dùng (Chấp nhận, Khoảng cách chỉnh sửa, Thử lại)',
      'Bộ định tuyến ngữ nghĩa & Phân tầng đa mô hình tối ưu hóa SLO/Chi phí',
      'Căn chỉnh liên tục sau triển khai & Cổng chặn suy thoái tự động',
    ],
    capstoneDeliverable:
      'Thiết kế bánh đà dữ liệu tự hành khép kín kết hợp bộ định tuyến ngữ nghĩa nhận biết SLO (chuyển tiếp từ mô hình nhỏ tốc độ cao sang mô hình tiên phong) và tự động tuyển chọn mẫu khó.',
  },
};

const JA_MILESTONES: Record<string, LocalizedMilestoneFields> = {
  'd1-level-1': {
    tierLabel: '01 · 基礎 (Zero)',
    title: '信号正規化、テンソル符号化、語彙トークン化',
    summary:
      'Unicode正規化(NFC/NFKC)、正規表現サニタイズ、音声サンプリング、画像テンソル配置(H×W×C)、文字/単語レベルの決定的トークン化を習得します。',
    coreConcepts: [
      'Unicode正規化 (NFC / NFKC)',
      '正規表現サニタイズとPIIマスキング',
      'デジタル信号サンプリング (PCM / ナイキスト定理)',
      '画像テンソル表現 (H×W×C)',
      '文字・単語レベルのトークン化',
    ],
    capstoneDeliverable:
      '任意のUTF-8文書とマルチ解像度画像を標準化テンソルバッチに変換する正規化CLIパイプラインを構築。',
  },
  'd1-level-2': {
    tierLabel: '02 · コアエンジニアリング',
    title: 'サブワードトークナイザ、ViTパッチ化、音響スペクトル特徴',
    summary:
      '未知語(OOV)劣化を防ぎ、マルチモーダル入力をTransformer埋め込み層へ橋渡しするサブワード圧縮とパッチ符号化を実装します。',
    coreConcepts: [
      'Byte-Pair Encoding (BPE) & WordPiece',
      'Unigram言語モデル & SentencePiece',
      'バイトレベルBPE (Tiktoken)',
      '視覚パッチ埋め込み (ViT Patchification)',
      '音声Log-Melスペクトログラム変換',
    ],
    capstoneDeliverable:
      '多言語＋コードコーパスでカスタムBPEトークナイザをゼロから学習し、ドメイン別の圧縮率を可視化。',
  },
  'd1-level-3': {
    tierLabel: '03 · 本番運用・スケール',
    title: '高スループット非同期取り込み＆マルチモーダル文書解析',
    summary:
      '厳格なスキーマ検証とバックプレッシャー制御を備え、複雑なPDFや表、同時メディアストリームを解析する耐障害イングレスゲートウェイを設計します。',
    coreConcepts: [
      '非同期イングレス＆バックプレッシャー制御',
      'ストリーミング文書解析 (OCR＆レイアウト解析)',
      '厳格なペイロードスキーマ検証',
      '動的イングレスバッチング',
      'イベント駆動型インジェストキュー',
    ],
    capstoneDeliverable:
      'gRPCストリーミング、Pydantic検証、Kafkaバックプレッシャーで1,000+ req/秒を処理する非同期マイクロサービスを構築。',
  },
  'd1-level-4': {
    tierLabel: '04 · 最先端・SOTA (Hero)',
    title: 'ネイティブEarly-Fusionマルチモーダルトークン＆バイト潜在構造',
    summary:
      '離散ベクトル量子化コードブック(VQ-VAE)、ネイティブ解像度パッチパッキング(NaViT)、トークナイザ不要のByte-Latent構造でモダリティの壁を解消します。',
    coreConcepts: [
      '離散視覚/音響トークン (VQ-VAE / VQGAN)',
      'ネイティブ解像度パッチパッキング (NaViT)',
      'Early-Fusionインターリーブマルチモーダルストリーム',
      'トークナイザ不要のByte-Latent Transformer (BLT)',
      'エントロピー誘導型動的パッチ分割',
    ],
    capstoneDeliverable:
      'VQ-VAE離散トークンとNaViTパッキングを用い、画像・音声・テキスト混在入力を単一トークン列へ直列化する機構を実装。',
  },
  'd2-level-1': {
    tierLabel: '01 · 基礎 (Zero)',
    title: 'ベクトル空間、距離計量、セマンティックチャンキング',
    summary:
      '高次元空間の幾何学的類似度、構造を考慮した文書分割、リレーショナル/ドキュメント/ベクトル格納のトレードオフを理解します。',
    coreConcepts: [
      'コサイン類似度、ユークリッドL2距離、内積',
      '次元の呪いと単位ベクトル正規化',
      '固定長・再帰的・セマンティック文書チャンキング',
      'リレーショナル vs. 非構造化Blobストレージ',
      '厳密k近傍探索 (Flat k-NN)',
    ],
    capstoneDeliverable:
      '純粋なNumPyと厳密k-NNを用い、Cosine/L2/内積を切り替え可能なインメモリ意味検索エンジンを構築。',
  },
  'd2-level-2': {
    tierLabel: '02 · コアエンジニアリング',
    title: '高密度マルチモーダル埋め込み＆ANNグラフ/量子化インデックス',
    summary:
      '高密度Bi-Encoder表現と準線形時間の近似最近傍探索(ANN)データ構造を習得し、低遅延検索を実現します。',
    coreConcepts: [
      '高密度テキスト＆マルチモーダル埋め込み (CLIP, SigLIP, BGE)',
      '階層型ナビゲーブルスモールワールド (HNSW) グラフ',
      '転置ファイル＆直積量子化 (IVF-PQ, ScaNN)',
      'Recall@K と QPS (秒間クエリ数) のトレードオフ',
      'PostgreSQL (pgvector) でのトランザクションベクトル格納',
    ],
    capstoneDeliverable:
      'FAISSとpgvectorで10万件のマルチモーダル項目をインデックス化し、p99遅延15ms未満・Recall@10 > 95%を達成。',
  },
  'd2-level-3': {
    tierLabel: '03 · 本番運用・スケール',
    title: '分散ベクトルDB、ハイブリッドRRF検索、レイクハウス形式',
    summary:
      'BM25語彙検索と高密度ベクトル検索をRRFで統合し、2段階Cross-Encoderリランキングと列指向レイクハウスで精度と規模を両立します。',
    coreConcepts: [
      '分散ベクトルシャーディング＆レプリケーション',
      'ハイブリッド検索 (BM25疎検索 + 高密度ベクトル融合)',
      'Reciprocal Rank Fusion (RRF)',
      '2段階 Cross-Encoder リランキング',
      '列指向AIレイクハウス (Parquet, LanceDB, Iceberg)',
    ],
    capstoneDeliverable:
      'BM25＋高密度ベクトルのRRF融合とCross-Encoderリランキングを組み合わせたハイブリッドRAGパイプラインを構築。',
  },
  'd2-level-4': {
    tierLabel: '04 · 最先端・SOTA (Hero)',
    title: '遅延相互作用マルチベクトル検索 (ColBERT)、GraphRAG、二値量子化',
    summary:
      'トークン単位のMaxSim遅延相互作用、OCR不要の視覚文書埋め込み(ColPali)、知識グラフ統合(GraphRAG)で検索精度を極限まで高めます。',
    coreConcepts: [
      '遅延相互作用マルチベクトル検索 (ColBERT MaxSim)',
      'OCR不要の視覚文書検索 (ColPali)',
      'GraphRAG (エンティティグラフ＋コミュニティ要約融合)',
      'バイナリ＆スカラ量子化 (メモリ32分の1削減)',
      'マトリョーシカ表現学習 (MRL)',
    ],
    capstoneDeliverable:
      '複雑な財務・科学PDFに対してバイナリ量子化を備えたColPali + GraphRAGマルチモーダル検索エンジンを実装。',
  },
  'd3-level-1': {
    tierLabel: '01 · 基礎 (Zero)',
    title: '畳み込みカーネル、空間特徴マップ、入出力スキーマ検証',
    summary:
      '空間フィルタリング、受容野、残差結合、決定的ペイロード検証、視覚・テキストPIIの自動墨塗りを習得します。',
    coreConcepts: [
      '2D畳み込み、ストライド、パディング、受容野',
      '空間特徴階層と残差結合 (Residual Connections)',
      '入出力スキーマガードレール＆視覚PIIマスキング',
      '古典的知覚・NLP評価指標 (IoU, mAP, BLEU, ROUGE)',
      'データ拡張 (RandAugment, MixUp, CutMix)',
    ],
    capstoneDeliverable:
      'CNN空間特徴の可視化を備え、リアルタイムで画像・テキストのPII墨塗りとJSONスキーマ検証を行うミドルウェアを構築。',
  },
  'd3-level-2': {
    tierLabel: '02 · コアエンジニアリング',
    title: 'Vision Transformer、オープン語彙検出、RAGAS自動評価',
    summary:
      '自己注意視覚バックボーンと参照ラベル不要の評価フレームワーク(RAGAS)およびLLM-as-a-Judgeを組み合わせ、忠実度を定量化します。',
    coreConcepts: [
      'Vision Transformer (ViT, Swin) ＆ 自己教師あり学習 DINOv2',
      'プロンプト可能セグメンテーション (SAM) ＆ オープン語彙検出',
      'RAGAS評価 (Faithfulness, Answer Relevance, Context Precision)',
      'LLM/VLM-as-a-Judge ルーブリック＆NLI幻覚検出',
      '視覚グラウンディング＆バウンディングボックス検証',
    ],
    capstoneDeliverable:
      'ゴールデンテストセットに対しRAGASとVLMグラウンディング検証を自動実行するCI評価スイートを構築。',
  },
  'd3-level-3': {
    tierLabel: '03 · 本番運用・スケール',
    title: '敵対的レッドチーミング、マルチモーダル脱獄防御、Constitutional AI',
    summary:
      '敵対的パッチや画像内文字によるプロンプトインジェクション、有害生成を低遅延安全性分類器で防御します。',
    coreConcepts: [
      '敵対的レッドチーミング＆視覚タイポグラフィ攻撃対策',
      '直接・間接プロンプトインジェクション防御',
      'マルチモーダル安全性分類器 (Llama Guard Vision)',
      '低遅延での Constitutional AI ポリシー強制',
      '高スループット映像・フレームストリームバッチ処理',
    ],
    capstoneDeliverable:
      '間接プロンプトインジェクションと敵対的画像パッチを防ぐ二層マルチモーダル入出力ガードレールプロキシを構築。',
  },
  'd3-level-4': {
    tierLabel: '04 · 最先端・SOTA (Hero)',
    title: '機械論的解釈可能性 (Sparse Autoencoder)、DiT、SynthID透かし',
    summary:
      'スパースオートエンコーダ(SAE)でニューロン内部の単一意味特徴を抽出し、モデルの振る舞いの制御と暗号学的電子透かしによる来歴検証を行います。',
    coreConcepts: [
      '機械論的解釈可能性と多義性ニューロンの分離',
      'Sparse Autoencoder (SAE) とアクティベーション・ステアリング',
      'Diffusion Transformer (DiT) ＆ フローマッチング',
      'マルチモーダルエージェント行動の形式的検証',
      '暗号学的コンテンツ来歴透かし (SynthID / C2PA)',
    ],
    capstoneDeliverable:
      'SAE特徴アクティベーションによるモデル内部表現の検査・制御と暗号学的出力透かし機構を実装。',
  },
  'd4-level-1': {
    tierLabel: '01 · 基礎 (Zero)',
    title: '文脈内学習 (ICL)、構造化出力、思考の連鎖 (CoT) 推論',
    summary:
      '文脈プロンプト設計、JSONスキーマ/文脈自由文法(CFG)による制約付きデコーディング、段階的なCoT分解を習得します。',
    coreConcepts: [
      'Zero-Shot / Few-Shot 文脈内学習 (ICL)',
      'システムプロンプト設計と命令階層 (Instruction Hierarchy)',
      '決定的構造化出力 (JSON Schema / CFG制約デコード)',
      'Chain-of-Thought (CoT) と自己無撞着 (Self-Consistency) 推論',
      '文脈トークン埋め込みとセマンティック注意機構',
    ],
    capstoneDeliverable:
      '100%有効なJSON文法保証を備えたスキーマ強制型情報抽出およびCoT推論パイプラインを構築。',
  },
  'd4-level-2': {
    tierLabel: '02 · コアエンジニアリング',
    title: 'ReActループ、関数呼び出し、エージェント記憶、MCPプロトコル',
    summary:
      '標準化されたツール呼び出しとModel Context Protocol (MCP) サーバーを用い、LLMを外部DBや多層メモリへ接続します。',
    coreConcepts: [
      'ReAct (Reason + Act) 実行ループ',
      '決定的関数・ツール呼び出し (Tool Calling)',
      'ワーキング・エピソード・意味的長期メモリ',
      'Model Context Protocol (MCP) サーバー＆クライアント構造',
      'ツール実行結果のグラウンディングとエラー整形',
    ],
    capstoneDeliverable:
      'DBクエリ、ファイル操作、検索ツールを自律ReActエージェントに提供するカスタムMCPサーバーを構築。',
  },
  'd4-level-3': {
    tierLabel: '03 · 本番運用・スケール',
    title: '状態保持型巡回エージェントグラフ、サンドボックス実行、自己修復',
    summary:
      '脆弱な線形チェーンを超え、人間承認ゲート(HITL)、隔離コード実行サンドボックス、コンパイラ駆動の自己修復ループを持つ状態機械を構築します。',
    coreConcepts: [
      '状態保持型巡回グラフ (LangGraph) とチェックポイント保存',
      'Human-in-the-Loop (HITL) 割り込みとタイムトラベルデバッグ',
      '隔離コード実行サンドボックス (MicroVM / コンテナ)',
      'コンパイラ・テスト駆動の自己修復ループ',
      'トークン予算管理とコンテキストウィンドウ圧縮',
    ],
    capstoneDeliverable:
      '隔離テスト実行と自動障害復旧を備えた状態保持型マルチステップ調査・コーディングエージェントをLangGraphで構築。',
  },
  'd4-level-4': {
    tierLabel: '04 · 最先端・SOTA (Hero)',
    title: '階層型マルチエージェント群、Tree-of-Thoughts、MCTS計画',
    summary:
      'スーパーバイザールーティング、推論木上の先読み探索(MCTS)、動的ツール自己合成により専門エージェント群を協調制御します。',
    coreConcepts: [
      '階層型マルチエージェント群とスーパーバイザールーティング',
      'Tree-of-Thoughts (ToT) とモンテカルロ木探索 (MCTS) 計画',
      'プロセス報酬モデル (PRM) とステップ単位の検証',
      '自律的な自己改善ツール合成',
      '共有認識状態とエージェント間の競合解決',
    ],
    capstoneDeliverable:
      'スーパーバイザールーティング、並列ワーカー検証、ToT先読み計画を備えたマルチエージェント協調システムを構築。',
  },
  'd5-level-1': {
    tierLabel: '01 · 基礎 (Zero)',
    title: '計算グラフ、リバースモード自動微分 (Autograd)、適応的最適化',
    summary:
      '動的DAG構築、連鎖律による逆伝播、損失地形、重み減衰ダイナミクスなど深層学習の数学的エンジンを第一原理から理解します。',
    coreConcepts: [
      '動的計算グラフとリバースモード自動微分 (Autograd)',
      '交差エントロピー、Perplexity、対照学習 InfoNCE 損失',
      '勾配消失・爆発と重み初期化手法',
      'Momentum付きSGD、Adam、分離重み減衰 (AdamW)',
      'アクティベーション・チェックポインティング (メモリ対計算量)',
    ],
    capstoneDeliverable:
      'スカラおよびテンソル自動微分エンジンをゼロから実装し、カスタムAdamWで多層ニューラルネットを学習。',
  },
  'd5-level-2': {
    tierLabel: '02 · コアエンジニアリング',
    title: '混合精度学習 (BF16/FP8) ＆ パラメータ効率的微調整 (LoRA/QLoRA)',
    summary:
      '低ランク行列分解と4ビットNormalFloat量子化を用い、単一ノードGPUスループットを最大化して大規模モデルを効率的に微調整します。',
    coreConcepts: [
      '混合精度学習 (FP16動的ロススケーリング ＆ BF16)',
      '勾配累積、グローバルノルムクリッピング、Cosine LRウォームアップ',
      'Low-Rank Adaptation (LoRA: ΔW = B·A)',
      '4ビットNormalFloat量子化微調整 (QLoRA ＆ ページド最適化)',
      '教師あり微調整 (SFT) と命令パッキング (Sequence Packing)',
    ],
    capstoneDeliverable:
      'BF16混合精度とQLoRAを用い、7B/8Bオープン重みモデルを独自ドメイン命令データセットで微調整。',
  },
  'd5-level-3': {
    tierLabel: '03 · 本番運用・スケール',
    title: '3D分散並列学習: FSDP、DeepSpeed ZeRO、Megatron-LM',
    summary:
      '高速NVLink/InfiniBandファブリック上でオプティマイザ状態・勾配・パラメータ・活性値を分割し、数百基のH100 GPUへ学習をスケールします。',
    coreConcepts: [
      '分散データ並列 (DDP) と Ring-AllReduce 通信',
      'DeepSpeed ZeRO Stage 1, 2 & 3 (状態・勾配・重み分割)',
      'PyTorch Fully Sharded Data Parallel (FSDP2)',
      'テンソル並列 (列/行分割) ＆ パイプライン並列 (1F1Bスケジュール)',
      'NCCL集合通信、NVLink ＆ InfiniBandトポロジ最適化',
    ],
    capstoneDeliverable:
      'アクティベーションチェックポイント、勾配プロファイリング、耐障害保存を備えたマルチGPU FSDP / ZeRO-3パイプラインを構築。',
  },
  'd5-level-4': {
    tierLabel: '04 · 最先端・SOTA (Hero)',
    title: '事後学習アライメント (RLHF, DPO, GRPO) ＆ Chinchillaスケーリング則',
    summary:
      '人間の選好や検証可能な推論報酬にモデルを適合させ、計算量最適Chinchillaスケーリング則に基づき損失曲線を予測します。',
    coreConcepts: [
      'PPOによるRLHFとKLダイバージェンス制約',
      '報酬モデル不要の直接選好最適化 (DPO)',
      '推論強化学習向けグループ相対方策最適化 (GRPO)',
      'コード・数学向け検証可能報酬強化学習 (RLVR)',
      '計算量最適Chinchillaスケーリング則 (パラメータN対トークンD配分)',
    ],
    capstoneDeliverable:
      '選好データおよび検証可能な数学・コード報酬データセットを用い、DPOとGRPOでモデルをアライメントし勝率を自動評価。',
  },
  'd6-level-1': {
    tierLabel: '01 · 基礎 (Zero)',
    title: 'MLP、残差ストリーム動力学、CNN、再帰型系列モデル (RNN)',
    summary:
      'アフィン射影、非線形活性化関数、スキップ結合、再帰的隠れ状態など深層ニューラルネットワークの基礎的帰納バイアスを習得します。',
    coreConcepts: [
      '多層パーセプトロン (MLP) と普遍近似定理',
      '活性化関数 (ReLU, GELU, SiLU / Swish)',
      '残差結合と Pre-Norm vs. Post-Norm の学習安定性',
      '再帰型ニューラルネット (RNN, LSTM, GRU) と逐次ボトルネック',
      '表現幾何学と潜在多様体 (Latent Manifolds)',
    ],
    capstoneDeliverable:
      '純粋なPyTorchでモジュラーResNetブロックとゲート付き系列エンコーダを実装し、勾配ノルム診断を実行。',
  },
  'd6-level-2': {
    tierLabel: '02 · コアエンジニアリング',
    title: 'スケール化内積注意、マルチヘッド注意 (MHA)、Transformerブロック',
    summary:
      '因果マスキングと位置エンコーディングを備え、Encoder・Decoder・Prefix-LM Transformer構造をゼロから実装します。',
    coreConcepts: [
      'スケール化内積注意: softmax(QKᵀ / √dₖ)V',
      'マルチヘッド注意 (MHA) と部分空間射影',
      '因果的自己回帰マスキングと交差注意 (Cross-Attention)',
      'レイヤー正規化と残差ストリーム構造',
      '正弦波および学習可能な絶対位置エンコーディング',
    ],
    capstoneDeliverable:
      'GPTスタイルの自己回帰TransformerをPyTorchでゼロから実装し、サブワードコーパスで事前学習を実行。',
  },
  'd6-level-3': {
    tierLabel: '03 · 本番運用・スケール',
    title: '最新LLMバックボーン: RoPE, SwiGLU, RMSNorm, GQA/MLA, FlashAttention',
    summary:
      '128k以上の長文脈、圧縮KVキャッシュ、SRAMタイリングによるIO認識型注意機構を備えた最新フロンティア仕様へアップグレードします。',
    coreConcepts: [
      '回転位置埋め込み (RoPE) と YaRN コンテキスト長拡張',
      'SwiGLU ゲート付きFFN と Pre-RMSNorm',
      'グループ化クエリ注意 (GQA) と マルチヘッド潜在注意 (MLA)',
      'ハードウェアIOタイリング (FlashAttention-2 / FlashAttention-3)',
      'スライディングウィンドウ注意 ＆ 100万トークン向け Ring Attention',
    ],
    capstoneDeliverable:
      '標準TransformerをRoPE、GQA、RMSNorm、SwiGLU、FlashAttention-2で強化し、32k文脈でのメモリと速度向上を計測。',
  },
  'd6-level-4': {
    tierLabel: '04 · 最先端・SOTA (Hero)',
    title: 'スパースMixture-of-Experts (MoE)、Mamba/SSMハイブリッド、推論時計算拡張',
    summary:
      'Top-Kルーティング型スパースMoE層や線形計算量の状態空間モデル(SSM)により、総パラメータ容量とトークン当たり計算量を分離します。',
    coreConcepts: [
      'スパースMixture-of-Experts (MoE) と Top-K トークンルーティング',
      '共有＋細粒度エキスパートと補助損失なし負荷分散',
      '選択的状態空間モデル (Mamba / Mamba-2) と Jamba ハイブリッド',
      '連続・離散生成向け Diffusion Transformer (DiT)',
      '推論時計算スケーリング (Test-Time Compute) と再帰深度構造',
    ],
    capstoneDeliverable:
      'Top-Kルーティング、共有エキスパート、負荷分散テレメトリを備えたスパースMoE Transformer層を構築。',
  },
  'd7-level-1': {
    tierLabel: '01 · 基礎 (Zero)',
    title: 'Prefill対Decode動力学、Rooflineモデル、KVキャッシュ機構',
    summary:
      'プロンプト処理(Prefill)が演算律速でトークン生成(Decode)がメモリ帯域律速となる理由を解析し、KVキャッシュの正確なメモリ使用量を算出します。',
    coreConcepts: [
      '演算律速なPrefill vs. メモリ帯域律速なDecode',
      'GPU Roofline性能モデル (演算強度: FLOPs/Byte)',
      'Key-Value (KV) キャッシュ機構とメモリフットプリント計算',
      '自己回帰サンプリング (Temperature, Top-P, Top-K, Min-P)',
      '安全なモデル直列化 (safetensors, TorchScript)',
    ],
    capstoneDeliverable:
      '多様なバッチサイズと系列長でPrefill/Decode遅延、HBM帯域利用率、KVキャッシュ容量をプロファイリング。',
  },
  'd7-level-2': {
    tierLabel: '02 · コアエンジニアリング',
    title: 'コンパイラランタイム (ONNX / TensorRT) ＆ 事後量子化 (AWQ / GPTQ / FP8)',
    summary:
      '重みと活性値を8ビット/4ビットへ圧縮しつつ、演算グラフ融合(Operator Fusion)でカーネル起動オーバーヘッドを削減します。',
    coreConcepts: [
      '計算グラフ融合 (LayerNorm + MatMul + GELU Fusion)',
      'コンパイラランタイム (ONNX Runtime, TensorRT, TensorRT-LLM)',
      '重み・アクティベーション量子化 (INT8, INT4, FP8)',
      '活性化考慮型重み量子化 (AWQ) ＆ GPTQ',
      'GGUF ＆ llama.cpp によるCPU/エッジ推論',
    ],
    capstoneDeliverable:
      'PyTorchモデルをONNX/TensorRTおよびAWQ INT4へ変換し、スループット向上率とPerplexity維持率をベンチマーク。',
  },
  'd7-level-3': {
    tierLabel: '03 · 本番運用・スケール',
    title: 'PagedAttention (vLLM)、連続バッチング、Triton推論サーバー',
    summary:
      'OSの仮想メモリページングに着想を得たPagedAttentionでKVキャッシュ断片化を解消し、連続バッチングでGPU稼働率を最大化します。',
    coreConcepts: [
      '非連続領域でメモリ無駄をゼロにする PagedAttention',
      '反復レベル連続バッチング (Continuous / In-Flight Batching)',
      'DecodeのHead-of-Lineブロッキングを防ぐ Chunked Prefill',
      'NVIDIA Triton Inference Server 上でのマルチモデル連携',
      'マルチGPUノードにわたるテンソル並列サービング',
    ],
    capstoneDeliverable:
      'PagedAttentionと連続バッチングを備えた高スループットLLMサービングクラスタをvLLMとTritonで構築。',
  },
  'd7-level-4': {
    tierLabel: '04 · 最先端・SOTA (Hero)',
    title: '投機的デコーディング、RadixAttentionプレフィックス共有、分離サービング',
    summary:
      'ドラフト・ターゲット検証による投機的デコーディング、木構造プレフィックスKV共有、Prefill/Decode分離クラスタで逐次生成の壁を突破します。',
    coreConcepts: [
      '投機的デコーディング (ドラフトモデル ＆ Medusa / EAGLEヘッド)',
      'RadixAttention木によるプレフィックスKVキャッシュ再利用',
      'Prefill / Decode GPUクラスタ分離 (Mooncake / NVIDIA Dynamo)',
      'カスタムTriton ＆ CUDA Warp特化デコードカーネル',
      'ゼロオーバーヘッド構造化文法マスク (XGrammar)',
    ],
    capstoneDeliverable:
      'プレフィックスキャッシュと投機的デコーディングを実装し、品質劣化ゼロで2.2倍以上のトークン生成高速化を達成。',
  },
  'd8-level-1': {
    tierLabel: '01 · 基礎 (Zero)',
    title: 'リアルタイムトークン配信 (SSE / WebSocket) ＆ 遅延計測 (TTFT / ITL)',
    summary:
      'デトークン化されたUTF-8チャンクをUIへ滑らかにストリーミング配信しつつ、体感遅延SLOと構造化ログを計測します。',
    coreConcepts: [
      'Server-Sent Events (SSE) ＆ 双方向 WebSocket',
      '増分UTF-8デトークン化とバックプレッシャー制御',
      '初回トークン到達時間 (TTFT) vs. トークン間遅延 (ITL / TPOT)',
      '構造化JSONロギングと相関リクエストID',
      'グレースフルタイムアウト、リトライ、サーキットブレーカー',
    ],
    capstoneDeliverable:
      'リアルタイムのTTFT、ITL、tokens/secカウンタを表示するクライアントHUDと高信頼SSE配信エンドポイントを構築。',
  },
  'd8-level-2': {
    tierLabel: '02 · コアエンジニアリング',
    title: 'GenAI分散トレーシング (OpenTelemetry) ＆ コスト/遅延オブザーバビリティ',
    summary:
      'マルチステップのRAGやエージェント呼び出しを分散スパンで計装し、トークン消費量、プロンプト版管理、Grafanaダッシュボードを統合します。',
    coreConcepts: [
      'OpenTelemetry GenAI セマンティック規約 (gen_ai.*)',
      'RAG＆マルチツールエージェント向け分散スパンツリー',
      'プロンプトバージョン管理とトークンコスト帰属計算',
      'Prometheusヒストグラム (p50, p95, p99レイテンシ)',
      'リアルタイムGrafanaアラートとSLOエラーバジェット管理',
    ],
    capstoneDeliverable:
      'マルチステップAIパイプラインをOpenTelemetry GenAIトレース、Langfuse、Grafana SLOダッシュボードで計装。',
  },
  'd8-level-3': {
    tierLabel: '03 · 本番運用・スケール',
    title: 'コンテナ化MLOps、カナリア/シャドウ配備、ドリフト検知',
    summary:
      '段階的トラフィック分割、非同期シャドウミラーリング、セマンティックキャッシュ、埋め込みドリフト監視により安全にモデルを更新します。',
    coreConcepts: [
      'コンテナ化GPUマイクロサービス (Docker & Kubernetes)',
      'カナリアロールアウト＆非同期シャドウトラフィックミラーリング',
      'セマンティック応答キャッシュ (ベクトル類似度キャッシュ)',
      '統計的データ・埋め込み・概念ドリフト検知 (PSI / MMD)',
      '品質劣化や遅延悪化時の自動ロールバック',
    ],
    capstoneDeliverable:
      '本番トラフィックを候補モデルへ非同期ミラーリングし、遅延・コスト・評価スコアを比較するDocker化シャドウパイプラインを構築。',
  },
  'd8-level-4': {
    tierLabel: '04 · 最先端・SOTA (Hero)',
    title: '自律データフライホイール ＆ SLO認識型マルチモデルルーティング',
    summary:
      '本番の難例やユーザーフィードバックを自動的に評価・微調整データへ還流させつつ、クエリ難易度に応じてモデル階層を動的ルーティングします。',
    coreConcepts: [
      '閉ループ自律型プロダクション・データフライホイール',
      '自動難例マイニング (Hard-Example Mining) と能動学習キュレーション',
      '暗黙的ユーザーフィードバック信号 (採用、編集距離、再試行)',
      'SLO・コスト認識型マルチモデルカスケード / セマンティックルーター',
      'デプロイ後の継続的アライメントと自動リグレッションゲート',
    ],
    capstoneDeliverable:
      'SLO認識型セマンティックルーティング（小型高速モデル→フロンティアモデル）と自動難例収集を備えた閉ループデータフライホイールを設計。',
  },
};

interface LocalizedLandmarkFields {
  keyContribution: string;
  impactMetricOrNote: string;
}

const VI_LANDMARKS: Record<string, LocalizedLandmarkFields> = {
  'd1-lm-1': {
    keyContribution:
      'Áp dụng thuật toán nén dữ liệu Byte-Pair Encoding (BPE) vào việc tách từ phụ từ vựng mở, xóa bỏ hoàn toàn điểm nghẽn từ ngoài từ điển (OOV) trong các mô hình ngôn ngữ nơ-ron.',
    impactMetricOrNote:
      'Nền tảng của các bộ tokenizer trong GPT-2/3/4, LLaMA và các LLM hiện đại.',
  },
  'd1-lm-2': {
    keyContribution:
      'Xử lý văn bản đầu vào thô như một luồng Unicode không mất mát bao gồm cả khoảng trắng (▁), cho phép tách token BPE và Unigram độc lập ngôn ngữ mà không cần quy tắc tách từ trước.',
    impactMetricOrNote:
      'Được áp dụng rộng rãi trên các họ mô hình T5, LLaMA, Mistral, PaLM và Gemma.',
  },
  'd1-lm-3': {
    keyContribution:
      'Chứng minh rằng việc chia ảnh thành các mảnh (patch) cố định 16×16 pixel và chiếu tuyến tính chúng thành các token cho phép kiến trúc Transformer chuẩn vượt qua mạng tích chập CNN ở quy mô lớn.',
    impactMetricOrNote:
      'Hợp nhất biểu diễn đầu vào thị giác và văn bản cho các mô hình nền tảng đa phương thức.',
  },
  'd1-lm-4': {
    keyContribution:
      'Huấn luyện mô hình Transformer encoder-decoder trên 680.000 giờ phổ âm thanh đa ngôn ngữ nhiễu, đạt độ chính xác nhận dạng và dịch giọng nói zero-shot ngang tầm con người.',
    impactMetricOrNote:
      'Chuẩn hóa đầu vào phổ âm thanh Log-Mel 80 kênh cho các hệ thống AI đa phương thức.',
  },
  'd2-lm-1': {
    keyContribution:
      'Giới thiệu kiến trúc CBOW và Skip-gram giúp nhúng từ vựng vào không gian vector đặc, nơi các phép toán đại số tuyến tính nắm bắt được mối quan hệ tương đồng ngữ nghĩa.',
    impactMetricOrNote:
      'Khởi đầu kỷ nguyên biểu diễn vector nhúng đặc (dense embeddings) trong NLP và truy xuất thông tin.',
  },
  'd2-lm-2': {
    keyContribution:
      'Xây dựng đồ thị láng giềng thế giới nhỏ điều hướng đa tầng với độ phức tạp tìm kiếm hàm logarit, mang lại hiệu năng độ phủ (recall) so với độ trễ vượt trội cho vector nhiều chiều.',
    impactMetricOrNote:
      'Cấu trúc chỉ mục ANN mặc định đứng sau Qdrant, Milvus, pgvector, Weaviate và Lucene.',
  },
  'd2-lm-3': {
    keyContribution:
      'Thiết kế kỹ thuật Lượng tử hóa tích (IVF-PQ) tăng tốc bằng GPU và các nhân chọn lọc top-k cấp độ warp có khả năng tìm kiếm trên 1 tỷ vector chỉ trong vài mili-giây.',
    impactMetricOrNote:
      'Thư viện C++/CUDA tiêu chuẩn vàng cho đánh chỉ mục vector thông lượng cao.',
  },
  'd2-lm-4': {
    keyContribution:
      'Kết hợp chỉ mục vector đặc phi tham số (DPR + FAISS) với bộ sinh seq2seq có tham số, giúp neo giữ đầu ra của mô hình vào nguồn tri thức bên ngoài có thể kiểm chứng.',
    impactMetricOrNote:
      'Thiết lập RAG thành kiến trúc doanh nghiệp chủ đạo cho các hệ thống AI chính xác.',
  },
  'd2-lm-5': {
    keyContribution:
      'Huấn luyện đồng thời bộ mã hóa ảnh và văn bản qua hàm mất mát tương phản đối xứng InfoNCE trên 400 triệu cặp ảnh-chú thích, căn chỉnh thị giác và ngôn ngữ vào chung một không gian vector.',
    impactMetricOrNote:
      'Mở ra khả năng truy xuất ảnh-văn bản chéo zero-shot và các mô hình sinh ảnh có điều kiện.',
  },
  'd3-lm-1': {
    keyContribution:
      'Giới thiệu kết nối tắt phần dư (y = F(x) + x) giải quyết triệt để hiện tượng triệt tiêu gradient trong mạng sâu, cho phép huấn luyện mạng thị giác 152 tầng và luồng phần dư Transformer hiện đại.',
    impactMetricOrNote:
      'Chiến thắng ILSVRC 2015 với tỷ lệ lỗi top-5 chỉ 3.57%; bài báo được trích dẫn nhiều nhất lịch sử AI hiện đại.',
  },
  'd3-lm-2': {
    keyContribution:
      'Chứng minh rằng Tinh chỉnh có giám sát (SFT) kết hợp Học tăng cường từ phản hồi con người (RLHF) giúp căn chỉnh đầu ra mô hình theo đúng ý định người dùng và các rào chắn an toàn.',
    impactMetricOrNote:
      'Mô hình InstructGPT 1.3B đã căn chỉnh vượt qua cả GPT-3 175B chưa căn chỉnh trong đánh giá của con người.',
  },
  'd3-lm-3': {
    keyContribution:
      'Thay thế nhãn đánh giá an toàn thủ công bằng cơ chế tự phê bình và chỉnh sửa dựa trên một bản hiến pháp nguyên tắc tường minh, mở rộng quy mô căn chỉnh bằng phản hồi AI (RLAIF).',
    impactMetricOrNote:
      'Tiên phong cải thiện đồng thời tính hữu ích và tính vô hại mà không làm mô hình từ chối máy móc.',
  },
  'd3-lm-4': {
    keyContribution:
      'Định nghĩa bộ chỉ số đánh giá không cần nhãn tham chiếu (Độ trung thực, Độ liên quan câu trả lời, Độ chính xác ngữ cảnh) để phát hiện có hệ thống hiện tượng ảo giác trong RAG.',
    impactMetricOrNote:
      'Chuẩn đánh giá mã nguồn mở được tích hợp rộng rãi trong Langfuse, Arize và các pipeline CI.',
  },
  'd3-lm-5': {
    keyContribution:
      'Mở rộng quy mô Bộ tự mã hóa thưa (Sparse Autoencoders - SAE) lên mô hình thương mại tiên phong, giải mã hàng triệu đặc trưng đơn nghĩa có thể kiểm tra và điều hướng nhân quả.',
    impactMetricOrNote:
      'Bước đột phá lịch sử trong khả năng giải thích cơ học (mechanistic interpretability) và kiểm toán an toàn nội tại.',
  },
  'd4-lm-1': {
    keyContribution:
      'Chứng minh rằng việc sinh các bước suy luận ngôn ngữ tự nhiên trung gian mở khóa mạnh mẽ khả năng giải toán đa bước, suy luận thông thường và ký hiệu trong các mô hình ngôn ngữ lớn.',
    impactMetricOrNote:
      'Tăng gấp 3 lần độ chính xác giải toán GSM8K trên PaLM 540B và khởi nguồn cho các mô hình suy luận hiện đại.',
  },
  'd4-lm-2': {
    keyContribution:
      'Đan xen chuỗi suy luận ngôn ngữ (Thought) với các hành động tương tác môi trường bên ngoài (Act) và quan sát kết quả (Obs), khắc phục hiện tượng ảo giác và lan truyền lỗi.',
    impactMetricOrNote:
      'Vòng lặp thực thi nền tảng cho hầu hết mọi AI Agent sử dụng công cụ hiện nay.',
  },
  'd4-lm-3': {
    keyContribution:
      'Huấn luyện mô hình ngôn ngữ theo phương pháp tự giám sát để tự quyết định thời điểm và cú pháp gọi các API bên ngoài (máy tính, công cụ tìm kiếm, dịch thuật) trong quá trình sinh token.',
    impactMetricOrNote:
      'Thúc đẩy việc huấn luyện khả năng gọi hàm (function-calling) nguyên bản trên mọi LLM tiên phong.',
  },
  'd4-lm-4': {
    keyContribution:
      'Chuẩn hóa giao thức client-server JSON-RPC toàn cầu để cung cấp tài nguyên (Resources), mẫu nhắc lệnh (Prompts) và công cụ thực thi (Tools) cho AI Agent mà không cần viết bộ kết nối N×M.',
    impactMetricOrNote:
      'Nhanh chóng trở thành chuẩn kết nối "USB-C" cho tích hợp công cụ và ngữ cảnh của hệ thống Agent.',
  },
  'd5-lm-1': {
    keyContribution:
      'Kết hợp ước lượng mô-men bậc nhất thích nghi và phương sai bậc hai không tâm để mang lại bước cập nhật tham số bất biến theo tỷ lệ và hội tụ nhanh.',
    impactMetricOrNote:
      'Cùng với biến thể suy giảm trọng số tách rời (AdamW, 2017), trở thành bộ tối ưu hóa phổ quát cho học sâu.',
  },
  'd5-lm-2': {
    keyContribution:
      'Loại bỏ sự trùng lặp bộ nhớ dư thừa giữa các GPU song song dữ liệu bằng cách phân mảnh trạng thái bộ tối ưu (ZeRO-1), gradient (ZeRO-2) và tham số mô hình (ZeRO-3).',
    impactMetricOrNote:
      'Giảm dung lượng bộ nhớ trên mỗi GPU từ 8x–64x, mở khóa khả năng huấn luyện mô hình hàng nghìn tỷ tham số.',
  },
  'd5-lm-3': {
    keyContribution:
      'Đóng băng trọng số tiền huấn luyện và chỉ chèn các ma trận phân rã hạng thấp khả huấn luyện vào các tầng Transformer, giảm 10.000 lần số tham số cần huấn luyện và giảm 3 lần bộ nhớ GPU.',
    impactMetricOrNote:
      'Đại chúng hóa việc tinh chỉnh mô hình lớn mà không gây thêm bất kỳ độ trễ suy luận nào sau khi gộp trọng số.',
  },
  'd5-lm-4': {
    keyContribution:
      'Chứng minh thực nghiệm qua hơn 400 lần huấn luyện rằng quy mô tham số mô hình (N) và số lượng token huấn luyện (D) phải tăng tỷ lệ thuận ngang nhau (~20 token/tham số) trên cùng ngân sách FLOPs.',
    impactMetricOrNote:
      'Mô hình Chinchilla 70B huấn luyện trên 1.4T token vượt qua cả Gopher 280B và GPT-3 175B.',
  },
  'd5-lm-5': {
    keyContribution:
      'Chứng minh công thức ánh xạ dạng đóng giữa hàm phần thưởng và chính sách tối ưu, cho phép căn chỉnh thị hiếu RLHF ổn định chỉ bằng hàm mất mát binary cross-entropy đơn giản không cần PPO.',
    impactMetricOrNote:
      'Được áp dụng để căn chỉnh hậu huấn luyện cho Llama 3, Zephyr, Mixtral và Qwen.',
  },
  'd6-lm-1': {
    keyContribution:
      'Thiết lập luồng cao tốc phần dư (residual stream) cho phép gradient truyền nguyên vẹn qua hàng trăm tầng—trở thành khung xương sống cấu trúc của mọi khối Transformer.',
    impactMetricOrNote:
      'Cho phép mở rộng mạng nơ-ron từ vài chục tầng lên tới hàng trăm tầng sâu.',
  },
  'd6-lm-2': {
    keyContribution:
      'Thay thế hoàn toàn cấu trúc hồi quy và tích chập bằng cơ chế Tự chú ý đa đầu (Multi-Head Self-Attention), cho phép song song hóa quy mô lớn khi huấn luyện và độ dài đường truyền O(1) giữa mọi cặp token.',
    impactMetricOrNote:
      'Kiến trúc nền tảng đằng sau GPT, BERT, ViT, Whisper, AlphaFold 2 và toàn bộ AI hiện đại.',
  },
  'd6-lm-3': {
    keyContribution:
      'Mã hóa khoảng cách tương đối giữa các token bằng phép quay biểu diễn Query và Key trong không gian phức 2 chiều, giúp ngoại suy độ dài mượt mà và suy giảm tự nhiên theo khoảng cách.',
    impactMetricOrNote:
      'Chuẩn mã hóa vị trí trong Llama, Mistral, Qwen, Gemma và PaLM.',
  },
  'd6-lm-4': {
    keyContribution:
      'Sử dụng kỹ thuật chia ô (tiling) trên bộ nhớ SRAM tốc độ cao của GPU và chuẩn hóa lại online softmax để tính toán chính xác ma trận chú ý mà không cần ghi ma trận N×N ra bộ nhớ HBM chậm.',
    impactMetricOrNote:
      'Giảm độ phức tạp bộ nhớ Attention từ O(N²) xuống O(N) và tăng tốc độ thực thi thực tế từ 2x–4x.',
  },
  'd6-lm-5': {
    keyContribution:
      'Kết hợp định tuyến chuyên gia thưa top-k với các chuyên gia mịn dùng chung để mang lại dung lượng tri thức 47B–671B tham số nhưng chỉ tiêu tốn một phần nhỏ FLOPs suy luận trên mỗi token.',
    impactMetricOrNote:
      'Thiết lập Sparse MoE thành kiến trúc khung xương sống chủ đạo cho các mô hình tiên phong.',
  },
  'd7-lm-1': {
    keyContribution:
      'Chuẩn hóa biểu diễn đồ thị trung gian đa khung (cross-framework), hợp nhất toán tử (operator fusion) và tự động tinh chỉnh nhân phần cứng cho suy luận độ trễ thấp.',
    impactMetricOrNote:
      'Vận hành hàng tỷ lượt suy luận ML thực tế mỗi ngày trên cả hạ tầng đám mây và thiết bị biên.',
  },
  'd7-lm-2': {
    keyContribution:
      'Sử dụng mô hình nháp (draft model) tốc độ cao để đề xuất K token ứng viên và kiểm chứng song song toàn bộ trong một lượt truyền tiến duy nhất của LLM đích qua lấy mẫu bác bỏ (rejection sampling).',
    impactMetricOrNote:
      'Giảm độ trễ sinh token từ 2x–3x mà không làm thay đổi trọng số mô hình hay phân phối chất lượng đầu ra.',
  },
  'd7-lm-3': {
    keyContribution:
      'Phân chia bộ đệm KV thành các khối bộ nhớ ảo kích thước cố định ánh xạ qua bảng phân trang, xóa bỏ 60–80% phân mảnh bộ nhớ và cho phép chia sẻ tiền tố copy-on-write.',
    impactMetricOrNote:
      'Tăng thông lượng phục vụ LLM từ 2x–24x; đưa vLLM trở thành bộ máy suy luận tiêu chuẩn công nghiệp.',
  },
  'd7-lm-4': {
    keyContribution:
      'Phát hiện rằng việc bảo vệ chỉ 1% kênh trọng số quan trọng nhất (xác định dựa trên biên độ kích hoạt đầu vào) bằng phép nhân tỷ lệ theo kênh cho phép lượng tử hóa 4-bit gần như không suy giảm chất lượng.',
    impactMetricOrNote:
      'Tăng tốc độ suy luận hơn 3 lần so với FP16 đồng thời tránh hiện tượng quá khớp vào tập dữ liệu hiệu chuẩn.',
  },
  'd8-lm-1': {
    keyContribution:
      'Chỉ ra rằng mã nguồn mô hình ML chỉ chiếm chưa tới 5% hệ thống AI thực tế, đồng thời định danh các rủi ro xói mòn ranh giới, sự phụ thuộc dữ liệu và vòng lặp phản hồi ngầm.',
    impactMetricOrNote:
      'Bài báo nền tảng khai sinh ngành kỹ thuật MLOps và vận hành hệ thống ML hiện đại.',
  },
  'd8-lm-2': {
    keyContribution:
      'Hình thức hóa kỹ thuật thích nghi prompt, bộ đệm ngữ nghĩa và chuỗi thác mô hình LLM (định tuyến truy vấn dễ sang mô hình nhỏ và truy vấn khó sang mô hình tiên phong).',
    impactMetricOrNote:
      'Chứng minh khả năng cắt giảm tới 98% chi phí suy luận trong khi vẫn duy trì hoặc vượt độ chính xác của mô hình lớn đơn lẻ.',
  },
  'd8-lm-3': {
    keyContribution:
      'Chuẩn hóa các thuộc tính đo lường trung lập nhà cung cấp (`gen_ai.system`, `gen_ai.usage.input_tokens`, `gen_ai.server.time_to_first_token`) trên mọi nền tảng LLM và công cụ quan sát.',
    impactMetricOrNote:
      'Hợp nhất khả năng quan sát (observability) trên Langfuse, Arize Phoenix, Datadog, Grafana và hạ tầng Cloud-Native AI.',
  },
};

const JA_LANDMARKS: Record<string, LocalizedLandmarkFields> = {
  'd1-lm-1': {
    keyContribution:
      'データ圧縮アルゴリズムByte-Pair Encoding (BPE) をオープン語彙サブワード分割に応用し、ニューラル言語モデルにおける未知語(OOV)ボトルネックを解消。',
    impactMetricOrNote:
      'GPT-2/3/4、LLaMA、現代のあらゆるLLMトークナイザの基盤。',
  },
  'd1-lm-2': {
    keyContribution:
      '入力テキストを空白(▁)を含むロスレスUnicodeストリームとして扱い、事前分割ルール不要で言語非依存のBPE/Unigramトークン化を実現。',
    impactMetricOrNote:
      'T5、LLaMA、Mistral、PaLM、Gemmaなど主要モデル群で採用。',
  },
  'd1-lm-3': {
    keyContribution:
      '画像を16×16ピクセルの固定パッチに分割して線形トークンとして射影することで、標準Transformerが大規模環境でCNNを凌駕することを実証。',
    impactMetricOrNote:
      'マルチモーダル基盤モデルにおける視覚とテキストの入力表現を統一。',
  },
  'd1-lm-4': {
    keyContribution:
      '68万時間の多様な音声スペクトログラムでTransformerを学習し、人間レベルのゼロショット音声認識・翻訳を達成。',
    impactMetricOrNote:
      'マルチモーダルAIにおける80チャネルLog-Melスペクトログラム音声入力を標準化。',
  },
  'd2-lm-1': {
    keyContribution:
      'CBOWとSkip-gramにより単語を高密度ベクトル空間へ埋め込み、線形演算で意味的類推が可能であることを実証。',
    impactMetricOrNote:
      'NLPと情報検索における高密度埋め込み(Dense Embedding)パラダイムを確立。',
  },
  'd2-lm-2': {
    keyContribution:
      '対数スケーリング探索を持つ多層ナビゲーブル・スモールワールド近接グラフを構築し、高次元ベクトル検索で圧倒的な精度対遅延性能を実現。',
    impactMetricOrNote:
      'Qdrant、Milvus、pgvector、Weaviate、Luceneの中核ANNインデックスエンジン。',
  },
  'd2-lm-3': {
    keyContribution:
      'GPU加速された直積量子化(IVF-PQ)とWarpレベルk選択カーネルを実装し、10億ベクトルを数ミリ秒で検索可能に。',
    impactMetricOrNote:
      '高スループットベクトル検索のデファクトC++/CUDAライブラリ。',
  },
  'd2-lm-4': {
    keyContribution:
      '非パラメトリックな高密度ベクトル検索(DPR+FAISS)とパラメトリック生成器を結合し、外部知識に基づく事実性の高い生成を実現。',
    impactMetricOrNote:
      'エンタープライズAIシステムにおけるRAGアーキテクチャの標準を確立。',
  },
  'd2-lm-5': {
    keyContribution:
      '4億組の画像・テキスト対で対称対照損失(InfoNCE)により画像・言語エンコーダを共同学習し、共通ベクトル空間へ整列。',
    impactMetricOrNote:
      'ゼロショット画像・テキスト横断検索と条件付き視覚生成モデルを可能に。',
  },
  'd3-lm-1': {
    keyContribution:
      'スキップ/残差結合(y = F(x) + x)を導入して深層学習の勾配消失を解決し、152層CNNおよび現代のTransformer残差ストリームの礎を築く。',
    impactMetricOrNote:
      'ILSVRC 2015で優勝（Top-5誤差3.57%）。現代AIで最も引用された論文。',
  },
  'd3-lm-2': {
    keyContribution:
      '教師あり微調整(SFT)と人間フィードバックからの強化学習(RLHF)により、モデル出力を人間の意図と安全性制約に整合できることを実証。',
    impactMetricOrNote:
      '1.3BのInstructGPTが未調整の175B GPT-3を人間評価で上回る成果を達成。',
  },
  'd3-lm-3': {
    keyContribution:
      '明示的な憲法（原則）に基づく自己批評と修正(RLAIF)により、人間による有害性ラベル付けを代替して安全性をスケール。',
    impactMetricOrNote:
      '過剰な拒絶を抑えつつ有用性と無害性のパレート改善を実現。',
  },
  'd3-lm-4': {
    keyContribution:
      '参照ラベル不要の評価指標（Faithfulness, Answer Relevance, Context Precision）を定式化し、RAGのハルシネーションを体系的に検出。',
    impactMetricOrNote:
      'Langfuse、Arize、CIパイプラインに統合された標準OSS評価フレームワーク。',
  },
  'd3-lm-5': {
    keyContribution:
      'フロンティア商用モデルにSparse Autoencoder (SAE) を適用し、因果的に制御可能な数百万の単一意味(Monosemantic)特徴を抽出。',
    impactMetricOrNote:
      '機械論的解釈可能性とモデル内部安全性監査における歴史的ブレイクスルー。',
  },
  'd4-lm-1': {
    keyContribution:
      '中間的な自然言語の推論ステップを生成させることで、LLMの多段階算術・常識・記号推論能力が劇的に向上することを実証。',
    impactMetricOrNote:
      'PaLM 540BのGSM8K数学精度を3倍に引き上げ、現代の推論モデルの原点となる。',
  },
  'd4-lm-2': {
    keyContribution:
      '言語による推論トレース(Thought)と外部環境への行動(Act)・観測(Obs)を交互に実行し、幻覚とエラー伝播を克服。',
    impactMetricOrNote:
      '現代のあらゆるツール利用型AIエージェントの基本実行ループ。',
  },
  'd4-lm-3': {
    keyContribution:
      '外部API（電卓、検索、翻訳など）をいつ・どのように呼び出すかを自己教師あり学習でモデル自身に習得させる手法を確立。',
    impactMetricOrNote:
      'フロンティアLLMにおけるネイティブFunction Calling学習を牽引。',
  },
  'd4-lm-4': {
    keyContribution:
      'AIエージェントへリソース、プロンプト、ツールを提供する標準JSON-RPCプロトコルを策定し、N×M個の個別コネクタ開発を不要に。',
    impactMetricOrNote:
      'エージェントのツール・コンテキスト統合における「USB-C」標準として急速に普及。',
  },
  'd5-lm-1': {
    keyContribution:
      '1次モーメント（運動量）と2次モーメント（非中心化分散）の適応的推定を組み合わせ、スケール不変で高速収束する更新を実現。',
    impactMetricOrNote:
      '分離重み減衰(AdamW, 2017)と共に、深層学習の標準オプティマイザとして定着。',
  },
  'd5-lm-2': {
    keyContribution:
      'データ並列GPU間でオプティマイザ状態(ZeRO-1)、勾配(ZeRO-2)、モデル重み(ZeRO-3)を分割し、冗長なメモリ複製を排除。',
    impactMetricOrNote:
      'GPU当たりのメモリ消費を8〜64分の1に削減し、兆パラメータ級の学習を可能に。',
  },
  'd5-lm-3': {
    keyContribution:
      '事前学習済み重みを凍結し、低ランク分解行列のみを学習することで、学習パラメータ数を1万分の1、GPUメモリを3分の1に削減。',
    impactMetricOrNote:
      '重み統合後の推論遅延増加ゼロで大規模モデルの微調整を民主化。',
  },
  'd5-lm-4': {
    keyContribution:
      '400回以上の学習実験から、固定FLOP予算下ではモデル規模(N)と学習トークン数(D)を等比例（1パラメータ当たり約20トークン）で拡大すべきことを証明。',
    impactMetricOrNote:
      '1.4兆トークンで学習した70B Chinchillaが280B Gopherや175B GPT-3を凌駕。',
  },
  'd5-lm-5': {
    keyContribution:
      '報酬関数と最適方策の閉形式マッピングを導出し、複雑なPPOなしで単純な交差エントロピー損失による選好アライメントを実現。',
    impactMetricOrNote:
      'Llama 3、Zephyr、Mixtral、Qwenなどの事後アライメントで広く採用。',
  },
  'd6-lm-1': {
    keyContribution:
      '数百層にわたって勾配を減衰なく伝播させる残差ストリーム(Residual Highway)を確立し、全Transformerブロックの構造的骨格となる。',
    impactMetricOrNote:
      'ニューラルネットワークを数十層から数百層へとスケールさせる道を拓く。',
  },
  'd6-lm-2': {
    keyContribution:
      '再帰と畳み込みを完全に廃してMulti-Head Self-Attentionに置き換え、学習の超並列化と任意トークン間のO(1)経路長を実現。',
    impactMetricOrNote:
      'GPT、BERT、ViT、Whisper、AlphaFold 2など現代AIすべての基礎アーキテクチャ。',
  },
  'd6-lm-3': {
    keyContribution:
      'QueryとKeyを2次元複素平面上で回転させることで相対トークン距離を符号化し、滑らかな文脈長外挿と距離減衰を実現。',
    impactMetricOrNote:
      'Llama、Mistral、Qwen、Gemma、PaLMにおける標準位置エンコーディング。',
  },
  'd6-lm-4': {
    keyContribution:
      'GPUの高速オンチップSRAMタイリングとオンラインSoftmax再スケーリングを用い、低速なHBM上にN×N注意行列を展開せずに厳密なAttentionを計算。',
    impactMetricOrNote:
      'Attentionのメモリ計算量をO(N²)からO(N)へ削減し、2〜4倍の実時間高速化を達成。',
  },
  'd6-lm-5': {
    keyContribution:
      'スパースTop-Kエキスパートルーティングと細粒度共有エキスパートを組み合わせ、少ない活性FLOPsで47B〜671B級の知識容量を実現。',
    impactMetricOrNote:
      'フロンティアモデルにおけるSparse MoEバックボーンの優位性を確立。',
  },
  'd7-lm-1': {
    keyContribution:
      'フレームワーク横断の中間グラフ表現、演算子融合(Operator Fusion)、ハードウェア特化カーネル自動調整を標準化。',
    impactMetricOrNote:
      'クラウドからエッジまで毎日数十億回の本番ML推論を支える基盤。',
  },
  'd7-lm-2': {
    keyContribution:
      '高速な小型ドラフトモデルが提案したK個のトークンを大型ターゲットモデルの1回の並列フォワードパスで検証し、出力分布を完全に保ったまま高速化。',
    impactMetricOrNote:
      'モデルの重みや出力品質を一切変えずに2〜3倍のデコード遅延削減を達成。',
  },
  'd7-lm-3': {
    keyContribution:
      'KVキャッシュをページテーブル管理の固定長仮想メモリブロックに分割し、60〜80%のメモリ断片化を解消するとともにCopy-on-Writeプレフィックス共有を実現。',
    impactMetricOrNote:
      'LLMサービングスループットを2〜24倍向上させ、vLLMを業界標準エンジンに押し上げる。',
  },
  'd7-lm-4': {
    keyContribution:
      '入力活性値の大きさに基づいて特定したわずか1%の重要重みチャネルをスケーリング保護することで、ほぼ無劣化の4ビット量子化を実現。',
    impactMetricOrNote:
      'キャリブレーションデータへの過適合を防ぎつつ、FP16比で3倍以上の高速化を達成。',
  },
  'd8-lm-1': {
    keyContribution:
      '本番AIシステムにおいてMLモデルコードは全体の5%未満に過ぎないことを明らかにし、境界浸食やデータの絡み合い(CACE原則)、隠れたフィードバックループを指摘。',
    impactMetricOrNote:
      '現代のMLOpsおよび本番MLエンジニアリングという専門領域を確立した記念碑的論文。',
  },
  'd8-lm-2': {
    keyContribution:
      'プロンプト圧縮、セマンティックキャッシュ、学習型LLMカスケード（簡単なクエリは小型モデル、難問は大型モデルへ振り分け）を体系化。',
    impactMetricOrNote:
      '単一フロンティアモデルと同等以上の精度を維持しつつ推論コストを最大98%削減。',
  },
  'd8-lm-3': {
    keyContribution:
      'LLMプロバイダや監視基盤を横断するベンダー中立なテレメトリ属性（`gen_ai.system`, `gen_ai.usage.input_tokens`, `gen_ai.server.time_to_first_token`）を標準化。',
    impactMetricOrNote:
      'Langfuse、Arize Phoenix、Datadog、Grafana、クラウドネイティブAIスタックの可観測性を統一。',
  },
};

export function getLocalizedDeepDiveUI(lang: LanguageCode): DeepDiveUIStrings {
  return DEEP_DIVE_UI_LOCALES[lang] || DEEP_DIVE_UI_LOCALES.en;
}

export function getLocalizedMilestone(
  milestone: RoadmapMilestone,
  lang: LanguageCode
): RoadmapMilestone {
  if (lang === 'en') return milestone;
  const dict = lang === 'vi' ? VI_MILESTONES : JA_MILESTONES;
  const loc = dict[milestone.id];
  if (!loc) return milestone;
  return {
    ...milestone,
    tierLabel: loc.tierLabel as RoadmapMilestone['tierLabel'],
    title: loc.title,
    summary: loc.summary,
    coreConcepts: loc.coreConcepts,
    capstoneDeliverable: loc.capstoneDeliverable,
  };
}

export function getLocalizedLandmark(
  landmark: LandmarkWork,
  lang: LanguageCode
): LandmarkWork {
  if (lang === 'en') return landmark;
  const dict = lang === 'vi' ? VI_LANDMARKS : JA_LANDMARKS;
  const loc = dict[landmark.id];
  if (!loc) return landmark;
  return {
    ...landmark,
    keyContribution: loc.keyContribution,
    impactMetricOrNote: loc.impactMetricOrNote,
  };
}
