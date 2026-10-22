import type { DistrictId, PipelineStageId } from './districts';

export type LanguageCode = 'en' | 'vi' | 'ja';

export const LANGUAGE_STORAGE_KEY = 'neural_city_lang';

export interface DistrictLocaleStrings {
  name: string;
  shortName: string;
  domainTitle: string;
  tagline: string;
}

export interface PipelineStageLocaleStrings {
  label: string;
  title: string;
  summary: string;
}

export interface LocaleDictionary {
  code: LanguageCode;
  label: string;
  nativeLabel: string;
  header: {
    appTitle: string;
    appSubtitle: string;
    navCity: string;
    navPipeline: string;
    navTelemetry: string;
    btnStackBuilder: string;
    btnCaseStudies: string;
    btnBlueprint: string;
    btnRoadmap: string;
    btnAskArchitect: string;
    btnEnterLab: string;
    btnBattleArena: string;
    btnTycoonMode: string;
    motionReduced: string;
    motionStandard: string;
  };
  tycoon: {
    modeLabel: string;
    techTreeLabel: string;
    computeCreditsLabel: string;
    researchPointsLabel: string;
    clusterVramLabel: string;
    slaStabilityLabel: string;
    bottleneckCenterLabel: string;
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    workloadLabel: string;
    chaosLabel: string;
    exploreBtn: string;
    pipelineBtn: string;
    selectDistrictPrompt: string;
    orbitHint: string;
    minimizedPill: string;
  };
  stackBuilder: {
    modalTitle: string;
    modalSubtitle: string;
    selectTechHeading: string;
    copyBtn: string;
    copiedBtn: string;
    downloadFileBtn: string;
    downloadBundleBtn: string;
    tabDocker: string;
    tabMakefile: string;
    tabMermaid: string;
    tabSla: string;
  };
  architectAgent: {
    triggerLabel: string;
    dockTitle: string;
    dockSubtitle: string;
    inputPlaceholder: string;
    askBtn: string;
    runTourBtn: string;
    loadStackBtn: string;
    tourPlayingBadge: string;
    prevStepBtn: string;
    nextStepBtn: string;
    exitTourBtn: string;
  };
  caseStudies: {
    modalTitle: string;
    modalSubtitle: string;
    simulateBtn: string;
    openStackBtn: string;
    problemLabel: string;
    architectureLabel: string;
    metricsLabel: string;
  };
  districts: Record<DistrictId, DistrictLocaleStrings>;
  pipelineStages: Record<PipelineStageId, PipelineStageLocaleStrings>;
}

export const LOCALES: Record<LanguageCode, LocaleDictionary> = {
  en: {
    code: 'en',
    label: 'EN',
    nativeLabel: 'English',
    header: {
      appTitle: 'AI Neural City',
      appSubtitle: 'AI Architecture Studio & Sandbox',
      navCity: '01. Interactive City',
      navPipeline: '02. AI Pipeline',
      navTelemetry: '03. Chaos & Telemetry',
      btnStackBuilder: 'Stack Builder',
      btnCaseStudies: 'Case Studies',
      btnBlueprint: 'Blueprint [B]',
      btnRoadmap: 'Roadmap',
      btnAskArchitect: 'Ask AI City Architect',
      btnEnterLab: 'Enter District Lab',
      btnBattleArena: 'A/B Architecture Battle',
      btnTycoonMode: 'Tycoon Strategy Mode',
      motionReduced: 'Reduced Motion: ON',
      motionStandard: 'Motion: Standard',
    },
    tycoon: {
      modeLabel: 'Tycoon Strategy Mode',
      techTreeLabel: 'Tech Tree',
      computeCreditsLabel: 'Compute Credits',
      researchPointsLabel: 'Research Points',
      clusterVramLabel: 'Cluster VRAM',
      slaStabilityLabel: 'SLA Stability',
      bottleneckCenterLabel: 'Center of Gravity Bottleneck',
    },
    hero: {
      badge: 'AI ARCHITECTURE DESIGN STUDIO',
      title: 'Inside the Neural City',
      subtitle:
        'Design production AI stacks, run 3D guided architecture tours, and simulate real-world multimodal & agentic workloads.',
      workloadLabel: 'Packet Tracer Workload',
      chaosLabel: 'Chaos Fault Injection',
      exploreBtn: 'Explore the city',
      pipelineBtn: 'View the AI pipeline',
      selectDistrictPrompt: 'Select a district:',
      orbitHint:
        'Select a district [1–8] · Press [B] for Blueprint X-Ray · Drag to orbit',
      minimizedPill: 'Workload & Chaos Sandbox',
    },
    stackBuilder: {
      modalTitle: 'AI Stack Builder & Production Boilerplate Generator',
      modalSubtitle:
        'Select 1 production technology per District to synthesize docker-compose.yml, Makefile, Mermaid System Diagram, and Hardware SLA.',
      selectTechHeading: '8-District Production Stack Configuration',
      copyBtn: 'Copy Code',
      copiedBtn: 'Copied!',
      downloadFileBtn: 'Download File',
      downloadBundleBtn: 'Download Full Bundle (.sh)',
      tabDocker: 'docker-compose.yml',
      tabMakefile: 'Makefile',
      tabMermaid: 'architecture.mmd',
      tabSla: 'SLA & Hardware Sizing',
    },
    architectAgent: {
      triggerLabel: 'Ask AI City Architect',
      dockTitle: 'AI City Architect Copilot',
      dockSubtitle:
        'Tool-Calling 3D Scene Controller · Synthesizes stacks & flies the 3D camera across districts',
      inputPlaceholder:
        'e.g., Design a multimodal video search system for 1M clips under 30ms...',
      askBtn: 'Architect & Trace',
      runTourBtn: 'Run Live 3D Camera Tour',
      loadStackBtn: 'Load into Stack Builder',
      tourPlayingBadge: 'LIVE 3D ARCHITECT TOUR',
      prevStepBtn: 'Prev',
      nextStepBtn: 'Next',
      exitTourBtn: 'Exit Tour',
    },
    caseStudies: {
      modalTitle: 'Applied AI Engineering Case Studies',
      modalSubtitle:
        'Production-verified blueprints ready to simulate on the 3D Neural City and export to Docker/Makefile.',
      simulateBtn: 'Simulate on 3D City',
      openStackBtn: 'Inspect in Stack Builder',
      problemLabel: 'Engineering Challenge',
      architectureLabel: 'District-by-District Architecture',
      metricsLabel: 'Verified Production Metrics',
    },
    districts: {
      'input-gateway': {
        name: 'Input Gateway',
        shortName: 'Input',
        domainTitle: 'Multimodal Ingress & Tokenization',
        tagline: 'Receives text, images, video frames, and high-throughput API streams.',
      },
      'data-lake': {
        name: 'Vector Vault & Data Lake',
        shortName: 'Vector Vault',
        domainTitle: 'Vector Storage, HNSW Indexing & Hybrid RAG',
        tagline: 'Stores embeddings, metadata, and hybrid BM25 + dense vector indices.',
      },
      'computer-vision': {
        name: 'Guardrails, Eval & Vision',
        shortName: 'Vision & Eval',
        domainTitle: 'Visual Perception, Safety Guardrails & RAGAS Eval',
        tagline: 'Extracts visual embeddings, enforces safety shields, and audits faithfulness.',
      },
      'nlp-district': {
        name: 'Agentic Orchestration & NLP',
        shortName: 'Agentic (MCP)',
        domainTitle: 'Autonomous Agents, LangGraph & MCP Tool Protocols',
        tagline: 'Coordinates cyclic reasoning graphs, memory, and standardized MCP tools.',
      },
      'training-cluster': {
        name: 'Training Foundry',
        shortName: 'Training',
        domainTitle: 'Distributed GPU Compute, FSDP & Alignment',
        tagline: 'Executes mixed-precision pre-training, QLoRA adaptation, and DPO/RLHF.',
      },
      'model-core': {
        name: 'Model Core',
        shortName: 'Model Core',
        domainTitle: 'Foundation Transformer & Multimodal Backbone',
        tagline: 'Central neural architecture fusing visual-semantic and language representations.',
      },
      'inference-center': {
        name: 'Inference Engine',
        shortName: 'Inference',
        domainTitle: 'High-Speed Serving, ONNX/TensorRT & vLLM',
        tagline: 'Executes low-latency forward passes with PagedAttention and dynamic batching.',
      },
      'output-terminal': {
        name: 'Output & MLOps Telemetry',
        shortName: 'Output & MLOps',
        domainTitle: 'Observability, Containers & Canary Delivery',
        tagline: 'Streams responses and monitors GPU utilization, P99 latency, and drift.',
      },
    },
    pipelineStages: {
      input: {
        label: '01. Input',
        title: 'Multimodal Ingress & Schema Normalization',
        summary: 'Validates, sanitizes, and tokenizes incoming text, images, and video frames.',
      },
      'data-lake': {
        label: '02. Vector Vault',
        title: 'Hybrid Vector Indexing & Retrieval',
        summary: 'Organizes embeddings in HNSW/IVF-PQ structures paired with lexical filters.',
      },
      training: {
        label: '03. Training Foundry',
        title: 'Distributed Optimization & Fine-Tuning',
        summary: 'Adapts model weights via FSDP, DeepSpeed ZeRO, QLoRA, and alignment.',
      },
      'model-core': {
        label: '04. Model Core',
        title: 'Foundation Neural Reasoning & MCP',
        summary: 'Connects multimodal representations, attention layers, and agentic tool graphs.',
      },
      inference: {
        label: '05. Inference Engine',
        title: 'Compiled High-Throughput Serving',
        summary: 'Serves quantized ONNX/TensorRT and vLLM models under strict P99 budgets.',
      },
      output: {
        label: '06. Output & MLOps',
        title: 'Streaming Delivery & Prometheus Telemetry',
        summary: 'Delivers verified outputs with full OpenTelemetry and Grafana observability.',
      },
    },
  },
  vi: {
    code: 'vi',
    label: 'VI',
    nativeLabel: 'Tiếng Việt',
    header: {
      appTitle: 'AI Neural City',
      appSubtitle: 'Studio Thiết Kế Kiến Trúc AI 3D',
      navCity: '01. Thành Phố 3D',
      navPipeline: '02. Luồng AI Pipeline',
      navTelemetry: '03. Chaos & Telemetry',
      btnStackBuilder: 'Tạo Stack & Code',
      btnCaseStudies: 'Case Studies',
      btnBlueprint: 'Bản Vẽ [B]',
      btnRoadmap: 'Lộ Trình',
      btnAskArchitect: 'Hỏi Kiến Trúc Sư AI',
      btnEnterLab: 'Vào Phòng Thí Nghiệm Quận',
      btnBattleArena: 'Đấu Trường Kiến Trúc A/B',
      btnTycoonMode: 'Chế Độ Chiến Thuật Tycoon',
      motionReduced: 'Giảm Chuyển Động: BẬT',
      motionStandard: 'Chuyển Động: Chuẩn',
    },
    tycoon: {
      modeLabel: 'Chế Độ Chiến Thuật Tycoon',
      techTreeLabel: 'Cây Công Nghệ',
      computeCreditsLabel: 'Tín Dụng Tính Toán',
      researchPointsLabel: 'Điểm Nghiên Cứu (RP)',
      clusterVramLabel: 'Dung Lượng VRAM Cụm',
      slaStabilityLabel: 'Độ Ổn Định SLA',
      bottleneckCenterLabel: 'Điểm Nghẽn Trọng Tâm',
    },
    hero: {
      badge: 'STUDIO KIẾN TRÚC HỆ THỐNG AI',
      title: 'Bên Trong Thành Phố Nơ-ron',
      subtitle:
        'Thiết kế stack AI thực chiến, chạy tour camera 3D tự động và mô phỏng luồng xử lý đa phương thức & tác tử thông minh.',
      workloadLabel: 'Luồng Tải AI (Packet Tracer)',
      chaosLabel: 'Tiêm Lỗi Thực Chiến (Chaos)',
      exploreBtn: 'Khám phá thành phố',
      pipelineBtn: 'Xem luồng AI pipeline',
      selectDistrictPrompt: 'Chọn phân khu:',
      orbitHint:
        'Chọn phân khu [1–8] · Nhấn [B] bật X-Ray · Kéo chuột để xoay 3D',
      minimizedPill: 'Sandbox Luồng Tải & Chaos',
    },
    stackBuilder: {
      modalTitle: 'Trình Tạo AI Stack & Sinh Mã Nguồn Production',
      modalSubtitle:
        'Chọn 1 công nghệ cho mỗi Phân khu để tự động sinh docker-compose.yml, Makefile, sơ đồ Mermaid và ước tính phần cứng SLA.',
      selectTechHeading: 'Cấu Hình Công Nghệ Cho 8 Phân Khu AI',
      copyBtn: 'Sao Chép Code',
      copiedBtn: 'Đã Sao Chép!',
      downloadFileBtn: 'Tải File Này',
      downloadBundleBtn: 'Tải Trọn Bộ Khởi Tạo (.sh)',
      tabDocker: 'docker-compose.yml',
      tabMakefile: 'Makefile',
      tabMermaid: 'architecture.mmd',
      tabSla: 'Báo Cáo SLA & VRAM',
    },
    architectAgent: {
      triggerLabel: 'Hỏi Kiến Trúc Sư AI 3D',
      dockTitle: 'Trợ Lý Kiến Trúc Sư AI (3D Scene Controller)',
      dockSubtitle:
        'Tự động thiết kế kiến trúc, chọn công nghệ và điều khiển camera 3D bay qua từng phân khu',
      inputPlaceholder:
        'VD: Thiết kế hệ thống tìm kiếm video đa phương thức cho 1 triệu clip dưới 30ms...',
      askBtn: 'Thiết Kế & Dẫn Đường 3D',
      runTourBtn: 'Chạy Tour Camera 3D Trực Tiếp',
      loadStackBtn: 'Nạp Vào Stack Builder',
      tourPlayingBadge: 'ĐANG CHẠY TOUR KIẾN TRÚC 3D',
      prevStepBtn: 'Trước',
      nextStepBtn: 'Tiếp',
      exitTourBtn: 'Thoát Tour',
    },
    caseStudies: {
      modalTitle: 'Case Studies Kỹ Thuật AI Thực Chiến',
      modalSubtitle:
        '3 bản thiết kế hệ thống AI hoàn chỉnh có thể nạp trực tiếp lên thành phố 3D và xuất mã Docker/Makefile.',
      simulateBtn: 'Mô Phỏng Trên Thành Phố 3D',
      openStackBtn: 'Mở Trong Stack Builder',
      problemLabel: 'Bài Toán Kỹ Thuật',
      architectureLabel: 'Kiến Trúc Chi Tiết Theo Phân Khu',
      metricsLabel: 'Chỉ Số Thực Nghiệm Đạt Được',
    },
    districts: {
      'input-gateway': {
        name: 'Cổng Tiếp Nhận Đa Phương Thức',
        shortName: 'Cổng Vào',
        domainTitle: 'Tiếp Nhận, Phân Tích & Token Hóa',
        tagline: 'Tiếp nhận văn bản, ảnh, khung hình video và luồng dữ liệu thời gian thực.',
      },
      'data-lake': {
        name: 'Kho Vector & Hồ Dữ Liệu',
        shortName: 'Kho Vector',
        domainTitle: 'Lưu Trữ Vector HNSW & Truy Xuất Lai (Hybrid RAG)',
        tagline: 'Tổ chức embedding mật độ cao kết hợp tìm kiếm từ khóa BM25 tốc độ cao.',
      },
      'computer-vision': {
        name: 'Thị Giác, Hàng Rào An Toàn & Đánh Giá',
        shortName: 'Thị Giác & Eval',
        domainTitle: 'Nhận Thức Thị Giác, Guardrails & Kiểm Định RAGAS',
        tagline: 'Trích xuất đặc trưng ảnh/video, chặn Prompt Injection và đo lường độ trung thực.',
      },
      'nlp-district': {
        name: 'Điều Phối Tác Tử & Bộ Nhớ (MCP)',
        shortName: 'Tác Tử (MCP)',
        domainTitle: 'Tác Tử Tự Hành, LangGraph & Giao Thức MCP',
        tagline: 'Điều phối suy luận đa bước, bộ nhớ ngữ cảnh và gọi công cụ chuẩn hóa MCP.',
      },
      'training-cluster': {
        name: 'Xưởng Huấn Luyện Phân Tán',
        shortName: 'Huấn Luyện',
        domainTitle: 'Huấn Luyện Đa GPU, FSDP/ZeRO & Tinh Chỉnh QLoRA',
        tagline: 'Huấn luyện hỗn hợp BF16/FP8, tinh chỉnh tham số hiệu quả và căn chỉnh DPO.',
      },
      'model-core': {
        name: 'Lõi Kiến Trúc Mô Hình',
        shortName: 'Lõi Mô Hình',
        domainTitle: 'Kiến Trúc Nền Tảng Transformer & Hợp Nhất Đa Phương Thức',
        tagline: 'Mạng nơ-ron trung tâm kết nối không gian ngữ nghĩa hình ảnh và ngôn ngữ.',
      },
      'inference-center': {
        name: 'Động Cơ Suy Luận Tốc Độ Cao',
        shortName: 'Suy Luận',
        domainTitle: 'Phục Vụ Mô Hình Triton, ONNX/TensorRT & vLLM',
        tagline: 'Thực thi suy luận độ trễ cực thấp với PagedAttention và Dynamic Batching.',
      },
      'output-terminal': {
        name: 'Trạm Đầu Ra & Giám Sát MLOps',
        shortName: 'Đầu Ra & MLOps',
        domainTitle: 'Đóng Gói Docker, Prometheus & Giám Sát Sản Xuất',
        tagline: 'Phân phối kết quả streaming và giám sát tài nguyên GPU, độ trễ P99.',
      },
    },
    pipelineStages: {
      input: {
        label: '01. Tiếp Nhận',
        title: 'Tiếp Nhận Đa Phương Thức & Chuẩn Hóa',
        summary: 'Kiểm tra schema, lọc nhiễu và mã hóa văn bản, hình ảnh, khung hình video.',
      },
      'data-lake': {
        label: '02. Kho Vector',
        title: 'Lập Chỉ Mục Vector & Truy Xuất Lai',
        summary: 'Lưu trữ vector trên đồ thị HNSW/IVF-PQ kết hợp bộ lọc siêu dữ liệu.',
      },
      training: {
        label: '03. Huấn Luyện',
        title: 'Tối Ưu Hóa Phân Tán & Tinh Chỉnh Mô Hình',
        summary: 'Cập nhật trọng số qua FSDP, DeepSpeed, QLoRA và căn chỉnh DPO.',
      },
      'model-core': {
        label: '04. Lõi Mô Hình',
        title: 'Suy Luận Nơ-ron Trung Tâm & Điều Phối MCP',
        summary: 'Hợp nhất biểu diễn đa phương thức, cơ chế Attention và đồ thị tác tử.',
      },
      inference: {
        label: '05. Suy Luận',
        title: 'Biên Dịch Mô Hình & Phục Vụ Thông Lượng Cao',
        summary: 'Tăng tốc bằng ONNX Runtime, Triton Server và vLLM PagedAttention.',
      },
      output: {
        label: '06. Đầu Ra & MLOps',
        title: 'Phản Hồi Streaming & Giám Sát Telemetry',
        summary: 'Truyền kết quả tới người dùng kèm theo dõi Prometheus/Grafana toàn diện.',
      },
    },
  },
  ja: {
    code: 'ja',
    label: '日本語',
    nativeLabel: '日本語',
    header: {
      appTitle: 'AI Neural City',
      appSubtitle: '3D AIアーキテクチャ設計スタジオ',
      navCity: '01. 3D都市ビュー',
      navPipeline: '02. AIパイプライン',
      navTelemetry: '03. カオス＆テレメトリ',
      btnStackBuilder: 'スタック構築・出力',
      btnCaseStudies: '導入事例 (Case Studies)',
      btnBlueprint: '設計図 [B]',
      btnRoadmap: 'ロードマップ',
      btnAskArchitect: 'AIアーキテクトに質問',
      btnEnterLab: 'ディストリクト・ラボに入る',
      btnBattleArena: 'A/B アーキテクチャ対決',
      btnTycoonMode: 'AIラボ戦略モード (Tycoon)',
      motionReduced: '視差効果: 最小',
      motionStandard: 'アニメーション: 標準',
    },
    tycoon: {
      modeLabel: 'AIラボ戦略モード (Tycoon)',
      techTreeLabel: '技術ツリー (Tech Tree)',
      computeCreditsLabel: '計算クレジット',
      researchPointsLabel: '研究ポイント (RP)',
      clusterVramLabel: 'クラスタ VRAM',
      slaStabilityLabel: 'SLA 安定度',
      bottleneckCenterLabel: 'ボトルネック重心',
    },
    hero: {
      badge: 'AIシステム設計・検証サンドボックス',
      title: 'ニューラル・シティへようこそ',
      subtitle:
        '本番環境向けAIスタックの構築、3Dカメラツアーによるパイプライン追跡、カオス障害検証をリアルタイムに実行します。',
      workloadLabel: 'AIワークロード追跡 (Packet Tracer)',
      chaosLabel: 'カオス障害注入 (Fault Injection)',
      exploreBtn: '3D都市を探索する',
      pipelineBtn: 'AIパイプラインを見る',
      selectDistrictPrompt: '区画を選択:',
      orbitHint:
        '区画選択 [1–8] · [B]キーでX線設計図モード · ドラッグで回転',
      minimizedPill: 'ワークロード＆カオス制御',
    },
    stackBuilder: {
      modalTitle: 'AIスタックビルダー＆本番ボイラープレート生成',
      modalSubtitle:
        '全8区画の技術スタックを選択し、docker-compose.yml、Makefile、Mermaid構成図、SLA見積もりを自動生成します。',
      selectTechHeading: '8区画の本番技術スタック構成',
      copyBtn: 'コードをコピー',
      copiedBtn: 'コピー完了！',
      downloadFileBtn: 'ファイルを保存',
      downloadBundleBtn: '一括バンドルを保存 (.sh)',
      tabDocker: 'docker-compose.yml',
      tabMakefile: 'Makefile',
      tabMermaid: 'architecture.mmd',
      tabSla: 'SLA・GPUメモリ見積',
    },
    architectAgent: {
      triggerLabel: 'AIアーキテクトに相談',
      dockTitle: 'AIシティ・アーキテクト (3D制御エージェント)',
      dockSubtitle:
        '要件から最適な技術構成を提案し、3Dカメラツアーで各区画のデータフローを自動案内します',
      inputPlaceholder:
        '例: 100万件の動画クリップを30ms以下で検索するマルチモーダル検索システムを設計して...',
      askBtn: '設計＆3Dツアー生成',
      runTourBtn: '3Dカメラツアーを開始',
      loadStackBtn: 'スタックビルダーに反映',
      tourPlayingBadge: '3Dアーキテクチャツアー実行中',
      prevStepBtn: '前へ',
      nextStepBtn: '次へ',
      exitTourBtn: 'ツアー終了',
    },
    caseStudies: {
      modalTitle: '実践AIエンジニアリング導入事例 (Case Studies)',
      modalSubtitle:
        'ワンクリックで3D都市にロードし、データフローのシミュレーションとDocker/Makefile出力が可能な3つの本番設計ブループリント。',
      simulateBtn: '3D都市でシミュレート',
      openStackBtn: 'スタック構成を確認',
      problemLabel: '技術的課題 (Problem)',
      architectureLabel: '区画別システムアーキテクチャ',
      metricsLabel: '検証済みパフォーマンス指標',
    },
    districts: {
      'input-gateway': {
        name: '入力ゲートウェイ (Multimodal Ingress)',
        shortName: '入力GW',
        domainTitle: 'マルチモーダル入力・正規化・トークン化',
        tagline: 'テキスト、画像、映像フレーム、APIストリームを高速に受信・正規化します。',
      },
      'data-lake': {
        name: 'データレイク・ベクトルDB (Vector Vault)',
        shortName: 'ベクトルDB',
        domainTitle: 'HNSWベクトル検索＆ハイブリッドRAG基盤',
        tagline: '高次元ベクトルインデックスとBM25全文検索を統合し、高速検索を実現します。',
      },
      'computer-vision': {
        name: 'ガードレール・評価・視覚認識 (Safety & Eval)',
        shortName: '視覚・評価',
        domainTitle: '画像特徴抽出・安全性ガードレール・RAGAS評価',
        tagline: '視覚エンコーディング、プロンプトインジェクション防御、回答精度検証を行います。',
      },
      'nlp-district': {
        name: 'AIエージェント制御 (Agentic & MCP)',
        shortName: 'エージェント',
        domainTitle: '自律型エージェント・LangGraph・MCPプロトコル',
        tagline: '複数ステップの推論、長期メモリ、標準化されたMCPツール呼び出しを統括します。',
      },
      'training-cluster': {
        name: '分散学習ファウンドリ (Training Foundry)',
        shortName: '分散学習',
        domainTitle: '分散GPUクラスタ・FSDP・QLoRAファインチューニング',
        tagline: '混合精度学習、パラメータ効率的適応、DPO/RLHFアライメントを実行します。',
      },
      'model-core': {
        name: 'モデルコア (Foundation Backbone)',
        shortName: 'モデルコア',
        domainTitle: '基盤Transformer・マルチモーダル融合ネットワーク',
        tagline: '視覚特徴と言語表現を統合する中枢ニューラルネットワークです。',
      },
      'inference-center': {
        name: '推論エンジン (High-Speed Inference)',
        shortName: '推論エンジン',
        domainTitle: 'ONNX/TensorRT最適化・Triton・vLLM高速推論',
        tagline: 'PagedAttentionと動的バッチ処理により低遅延・高スループット推論を提供します。',
      },
      'output-terminal': {
        name: '出力・MLOpsテレメトリ (Observability)',
        shortName: '出力・MLOps',
        domainTitle: 'コンテナ基盤・Prometheus監視・カナリア配信',
        tagline: '推論結果のストリーミング配信とGPU使用率・P99遅延のリアルタイム監視を行います。',
      },
    },
    pipelineStages: {
      input: {
        label: '01. 入力ゲートウェイ',
        title: 'マルチモーダル受信＆スキーマ正規化',
        summary: 'テキスト、画像、動画フレームの検証・前処理・トークン化を実行します。',
      },
      'data-lake': {
        label: '02. ベクトルDB',
        title: 'ハイブリッドインデックス＆高速検索',
        summary: 'HNSW/IVF-PQグラフとメタデータフィルタで関連コンテキストを抽出します。',
      },
      training: {
        label: '03. 分散学習',
        title: '分散最適化＆ファインチューニング',
        summary: 'FSDP、DeepSpeed、QLoRA、DPOによりモデルの重みを最適化します。',
      },
      'model-core': {
        label: '04. モデルコア',
        title: '基盤ニューラル推論＆MCPエージェント連携',
        summary: 'マルチモーダル表現、Attention機構、自律ツール実行グラフを接続します。',
      },
      inference: {
        label: '05. 推論エンジン',
        title: 'モデルコンパイル＆高スループット推論',
        summary: 'ONNX Runtime、Triton、vLLMを用いてP99遅延要件内で高速推論を行います。',
      },
      output: {
        label: '06. 出力・MLOps',
        title: 'ストリーミング配信＆テレメトリ監視',
        summary: 'PrometheusとGrafanaによる可視化を伴い、安全な出力をクライアントへ届けます。',
      },
    },
  },
};
