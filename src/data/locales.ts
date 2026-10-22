import type { DistrictId, PipelineStageId } from './districts.ts';
import type { ArchitecturalPipelineModeId } from '../types/pipeline-modes.ts';
import type {
  WorkloadPresetId,
  BottleneckScenarioId,
} from './bottleneck-scenarios.ts';

export type LanguageCode = 'en' | 'vi' | 'ja';

export const LANGUAGE_STORAGE_KEY = 'neural_city_lang';

export interface DistrictLocaleStrings {
  name: string;
  shortName: string;
  domainTitle: string;
  tagline: string;
  roleInPipeline?: string;
  plainLanguageExplanation?: string;
  modeRoleSummaries?: Record<ArchitecturalPipelineModeId, string>;
}

export interface PipelineStageLocaleStrings {
  label: string;
  title: string;
  summary: string;
  plainExplanation?: string;
}

export interface PipelineModeLocaleStrings {
  shortLabel: string;
  title: string;
  workloadExample: string;
  standbyBadgeText: string;
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
  ui: {
    pipelineModeTitle: string;
    canonicalBadge: string;
    clearBtn: string;
    stopBtn: string;
    clickToInspect: string;
    sceneControls: {
      runDemo: string;
      stopDemo: string;
      pause: string;
      resume: string;
      speed: string;
      trainingBoost: string;
      labels: string;
      resetCamera: string;
      view2d: string;
      view3d: string;
    };
    districtPanel: {
      throughput: string;
      capacity: string;
      load: string;
      roleHeading: string;
      plainLanguageHeading: string;
      exampleInput: string;
      exampleOutput: string;
      routesTo: string;
      finalDelivery: string;
      exploreRoadmapBtn: string;
      showingDataFlow: string;
      showDataFlow: string;
      prev: string;
      next: string;
      districtMastery: string;
      cityTotal: string;
      tabRoadmap: string;
      tabLandmarks: string;
      tabQuiz: string;
      tabVram: string;
    };
    walkthrough: {
      sectionBadge: string;
      sectionSubtitle: string;
      selectModeLabel: string;
      activeInModePrefix: string;
      archRoleInPrefix: string;
      rooflineConstraint: string;
      inspectIn3dPrefix: string;
      viewRoadmapBtn: string;
      specBoxTitle: string;
      protocolAndTensorLabel: string;
      coreResponsibilityLabel: string;
      productionStackLabel: string;
      hardwareBoundLabel: string;
      canonicalStageMapping: string;
      all8Heading: string;
      focus3dBtn: string;
      standbyLabel: string;
    };
    telemetry: {
      sectionTitle: string;
      sectionSubtitle: string;
      faultInjected: string;
      staticSnapshot: string;
      rooflineActive: string;
      chaosSimulatorLabel: string;
      masteryCardTitle: string;
      masteryCardSubtext: string;
    };
    footer: {
      shortcutDistrict: string;
      shortcutTycoon: string;
      shortcutLab: string;
      shortcutBattle: string;
      shortcutBlueprint: string;
      shortcutReset: string;
      shortcutClose: string;
    };
  };
  pipelineModes: Record<ArchitecturalPipelineModeId, PipelineModeLocaleStrings>;
  workloads: Record<WorkloadPresetId, { shortBadge: string; title: string }>;
  bottlenecks: Record<
    BottleneckScenarioId,
    {
      shortLabel: string;
      title: string;
      diagnosticMessage: string;
      fixButtonLabel: string;
    }
  >;
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
    ui: {
      pipelineModeTitle: 'Pipeline Architecture Mode',
      canonicalBadge: 'D1–D8 Canonical',
      clearBtn: 'Clear',
      stopBtn: 'Stop',
      clickToInspect: 'Click to inspect →',
      sceneControls: {
        runDemo: 'Run a demo',
        stopDemo: 'Stop Demo',
        pause: 'Pause',
        resume: 'Resume',
        speed: 'Speed',
        trainingBoost: 'Training Boost',
        labels: 'Labels',
        resetCamera: 'Reset [R]',
        view2d: '2D View',
        view3d: '3D View',
      },
      districtPanel: {
        throughput: 'Throughput',
        capacity: 'Capacity',
        load: 'Load',
        roleHeading: 'Role in the AI Pipeline',
        plainLanguageHeading: 'Architecture Summary',
        exampleInput: 'Example Input Tensor / Payload',
        exampleOutput: 'Example Output Tensor / Payload',
        routesTo: 'Routes to:',
        finalDelivery: 'Final User Delivery',
        exploreRoadmapBtn: 'Explore Zero-to-Hero Roadmap & Landmarks [Enter]',
        showingDataFlow: 'Showing Data Flow',
        showDataFlow: 'Show data flow',
        prev: 'Prev',
        next: 'Next',
        districtMastery: 'District Mastery',
        cityTotal: 'City Total',
        tabRoadmap: '01 · Roadmap',
        tabLandmarks: '02 · Landmarks',
        tabQuiz: '03 · Verify Quiz',
        tabVram: '04 · VRAM Lab',
      },
      walkthrough: {
        sectionBadge: 'Canonical 8-District Architecture',
        sectionSubtitle:
          'Production AI systems decouple real-time inference from offline data indexing and distributed GPU training. Switch architectural modes below to inspect physical routing and tensor shapes.',
        selectModeLabel: 'Select Decoupled Pipeline Mode:',
        activeInModePrefix: 'ACTIVE IN',
        archRoleInPrefix: 'Architectural Role in',
        rooflineConstraint: 'Roofline Constraint',
        inspectIn3dPrefix: 'Inspect in 3D City',
        viewRoadmapBtn: 'View Roadmap & Landmarks',
        specBoxTitle: 'Wire Protocol & Tensor Specification',
        protocolAndTensorLabel: 'Wire Protocol & Tensor Shape Specification:',
        coreResponsibilityLabel: 'Core Engineering Responsibility:',
        productionStackLabel: 'Primary Production Stack:',
        hardwareBoundLabel: 'Dominant Hardware Bound:',
        canonicalStageMapping: 'Canonical Stage Mapping:',
        all8Heading:
          'All 8 Canonical Neural City Districts (D1–D8) — Click any district to focus camera',
        focus3dBtn: 'Focus 3D →',
        standbyLabel: 'STANDBY',
      },
      telemetry: {
        sectionTitle: 'Physically Grounded Telemetry & Chaos Suite',
        sectionSubtitle:
          'Metrics dynamically isolate by Pipeline Mode — Online Inference (TTFT, TPOT, E2E P99, KV-Cache) never conflates with Offline Indexing or Distributed Training (MFU, ZeRO-3, Step Loss).',
        faultInjected: 'FAULT INJECTED',
        staticSnapshot: 'Static Snapshot',
        rooflineActive: 'Roofline Physics Active',
        chaosSimulatorLabel: 'Chaos Engineering & Bottleneck Simulator:',
        masteryCardTitle: 'ARCHITECT MASTERY INDEX',
        masteryCardSubtext: 'Milestones · Districts Overclocked',
      },
      footer: {
        shortcutDistrict: 'Shortcuts: [1–8] Select District',
        shortcutTycoon: '[G] Tycoon Mode · [T] Tech Tree',
        shortcutLab: '[L] District Micro-Lab',
        shortcutBattle: '[V] A/B Battle Arena',
        shortcutBlueprint: '[B] Blueprint X-Ray',
        shortcutReset: '[R] Reset Camera',
        shortcutClose: '[Esc] Close Panel',
      },
    },
    pipelineModes: {
      'online-inference': {
        shortLabel: 'Online Inference',
        title: 'Online Inference & Agentic Loop (Real-Time Serving)',
        workloadExample: 'kingfisher.jpg + "Identify species & habitat"',
        standbyBadgeText: 'OFFLINE IN SERVING MODE',
      },
      'offline-indexing': {
        shortLabel: 'Offline Indexing',
        title: 'Offline Data Indexing & ETL Pipeline (Batch)',
        workloadExample: 'Ingesting 10,000 Video Keyframes & PDF Docs into HNSW',
        standbyBadgeText: 'STANDBY IN ETL MODE',
      },
      'offline-training': {
        shortLabel: 'Offline Training',
        title: 'Offline Distributed Training & Alignment (Compute Cluster)',
        workloadExample: 'FSDP ZeRO-3 Fine-Tuning & DPO Alignment on 64× H100 GPUs',
        standbyBadgeText: 'ISOLATED FROM TRAINING CLUSTER',
      },
    },
    workloads: {
      'multimodal-vision': {
        shortBadge: 'Multimodal VLM',
        title: 'Multimodal Vision-Language Query',
      },
      'agentic-mcp-rag': {
        shortBadge: 'Agentic MCP + RAG',
        title: 'Agentic MCP Tool-Use & Hybrid RAG',
      },
      'distributed-training': {
        shortBadge: 'FSDP + QLoRA Run',
        title: 'Distributed Fine-Tuning (FSDP + QLoRA)',
      },
      'adversarial-injection': {
        shortBadge: 'Prompt Shield',
        title: 'Adversarial Prompt Injection Defense',
      },
    },
    bottlenecks: {
      none: {
        shortLabel: 'Normal',
        title: 'Healthy Production Flow',
        diagnosticMessage:
          'All 8 Neural City districts are operating within nominal P99 latency and VRAM budgets.',
        fixButtonLabel: 'System Healthy',
      },
      'kv-cache-oom': {
        shortLabel: 'KV-Cache OOM',
        title: 'KV-Cache VRAM Exhaustion (OOM)',
        diagnosticMessage:
          'Contiguous KV-Cache allocation exhausted 80GB HBM3 under 32K context concurrency. Severe memory fragmentation!',
        fixButtonLabel: 'Fix with vLLM PagedAttention (D5 Level 3)',
      },
      'vector-brute-force': {
        shortLabel: 'Flat Scan Lag',
        title: 'Unindexed Brute-Force Vector Scan',
        diagnosticMessage:
          'Exact O(N) cosine similarity scan across 50M embeddings spiked retrieval latency from 6.4ms to 380ms!',
        fixButtonLabel: 'Fix with HNSW + Hybrid BM25 (D2 Level 2)',
      },
      'gradient-explosion': {
        shortLabel: 'Grad Explosion',
        title: 'FP16 Gradient Explosion & All-Reduce Straggler',
        diagnosticMessage:
          'Unclipped FP16 gradients overflowed dynamic range (Loss = NaN) and stalled multi-node ring all-reduce.',
        fixButtonLabel: 'Fix with BF16 + FSDP ZeRO-3 (D3 Level 2)',
      },
      'prompt-injection-spike': {
        shortLabel: 'Jailbreak Attack',
        title: 'Adversarial Jailbreak & PII Leakage Attempt',
        diagnosticMessage:
          'Malicious instruction-override payload attempted to exfiltrate system prompts and bypass tool permissions.',
        fixButtonLabel: 'Fix with NeMo Guardrails & RAGAS (D7 Level 4)',
      },
    },
    districts: {
      'input-gateway': {
        name: 'Ingress & Multimodal Gateway',
        shortName: 'D1. Ingress',
        domainTitle: 'Multimodal Ingress & Tokenization',
        tagline: 'Receives text, images, video frames, and high-throughput API streams.',
      },
      'data-lake': {
        name: 'Data Lake & Vector Vault',
        shortName: 'D2. Vector Vault',
        domainTitle: 'Vector Storage, HNSW Indexing & Hybrid RAG',
        tagline: 'Stores embeddings, metadata, and hybrid BM25 + dense vector indices.',
      },
      'training-cluster': {
        name: 'Training Foundry',
        shortName: 'D3. Training',
        domainTitle: 'Distributed GPU Compute, FSDP & Alignment',
        tagline: 'Executes mixed-precision pre-training, QLoRA adaptation, and DPO/RLHF.',
      },
      'model-core': {
        name: 'Model Core & Registry',
        shortName: 'D4. Model Core',
        domainTitle: 'Foundation Transformer & Multimodal Backbone',
        tagline: 'Central neural architecture fusing visual-semantic and language representations.',
      },
      'inference-center': {
        name: 'Inference Engine',
        shortName: 'D5. Inference',
        domainTitle: 'High-Speed Serving, ONNX/TensorRT & vLLM',
        tagline: 'Executes low-latency forward passes with PagedAttention and dynamic batching.',
      },
      'nlp-district': {
        name: 'Agentic & MCP Orchestrator',
        shortName: 'D6. Agentic MCP',
        domainTitle: 'Autonomous Agents, LangGraph & MCP Tool Protocols',
        tagline: 'Coordinates cyclic reasoning graphs, memory, and standardized MCP tools.',
      },
      'computer-vision': {
        name: 'Guardrails & Eval Gate',
        shortName: 'D7. Guardrails',
        domainTitle: 'Visual Perception, Safety Guardrails & RAGAS Eval',
        tagline: 'Extracts visual embeddings, enforces safety shields, and audits faithfulness.',
      },
      'output-terminal': {
        name: 'Output Nexus & Telemetry',
        shortName: 'D8. Output',
        domainTitle: 'Observability, Containers & Canary Delivery',
        tagline: 'Streams responses and monitors GPU utilization, P99 latency, and drift.',
      },
    },
    pipelineStages: {
      input: {
        label: 'D1. Ingress Gateway',
        title: 'Multimodal Ingress & Schema Normalization',
        summary: 'Validates, sanitizes, and tokenizes incoming text, images, and video frames.',
      },
      'data-lake': {
        label: 'D2. Vector Vault',
        title: 'Hybrid Vector Indexing & Retrieval',
        summary: 'Organizes embeddings in HNSW/IVF-PQ structures paired with lexical filters.',
      },
      training: {
        label: 'D3. Training Foundry',
        title: 'Distributed Optimization & Fine-Tuning (Offline)',
        summary: 'Adapts model weights via FSDP, DeepSpeed ZeRO-3, QLoRA, and DPO alignment.',
      },
      'model-core': {
        label: 'D4. Model Core',
        title: 'Foundation Neural Backbone & Weight Registry',
        summary: 'Stores immutable FP8/AWQ checkpoints and multimodal projection layers.',
      },
      inference: {
        label: 'D5. Inference Engine',
        title: 'Compiled High-Throughput Serving (vLLM / TensorRT)',
        summary: 'Serves quantized checkpoints with PagedAttention and continuous batching.',
      },
      'agentic-mcp': {
        label: 'D6. Agentic & MCP',
        title: 'Cyclic LangGraph State & MCP Tool Dispatch',
        summary: 'Executes multi-step ReAct reasoning loops and JSON-RPC 2.0 MCP tool calls.',
      },
      'guardrails-eval': {
        label: 'D7. Guardrails & Eval',
        title: 'Input/Output Safety Shields & RAGAS Verification',
        summary: 'Audits factual faithfulness, blocks prompt injection, and redacts PII.',
      },
      output: {
        label: 'D8. Output Nexus',
        title: 'Streaming SSE Delivery & OpenTelemetry Metrics',
        summary: 'Delivers verified token streams with full Prometheus and Grafana observability.',
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
        'Thiết kế stack AI sản xuất, chạy tour camera 3D tự động và mô phỏng tải công việc đa phương thức & tác tử thời gian thực.',
      workloadLabel: 'Mô Phỏng Luồng Tải (Packet Tracer)',
      chaosLabel: 'Tiêm Lỗi Chaos (Fault Injection)',
      exploreBtn: 'Khám phá thành phố',
      pipelineBtn: 'Xem luồng AI Pipeline',
      selectDistrictPrompt: 'Chọn phân khu:',
      orbitHint:
        'Chọn phân khu [1–8] · Nhấn [B] xem Bản vẽ X-Ray · Kéo chuột để xoay',
      minimizedPill: 'Bảng Điều Khiển Tải & Chaos',
    },
    stackBuilder: {
      modalTitle: 'Bộ Tạo Stack AI & Sinh Mã Nguồn Sản Xuất (Boilerplate)',
      modalSubtitle:
        'Chọn 1 công nghệ cho mỗi phân khu trong 8 Quận để tự động sinh docker-compose.yml, Makefile, sơ đồ Mermaid và ước tính phần cứng SLA.',
      selectTechHeading: 'Cấu Hình Công Nghệ Cho 8 Phân Khu AI',
      copyBtn: 'Sao Chép Mã',
      copiedBtn: 'Đã Sao Chép!',
      downloadFileBtn: 'Tải Tệp Này',
      downloadBundleBtn: 'Tải Trọn Bộ (.sh)',
      tabDocker: 'docker-compose.yml',
      tabMakefile: 'Makefile',
      tabMermaid: 'architecture.mmd',
      tabSla: 'Ước Tính SLA & Phần Cứng',
    },
    architectAgent: {
      triggerLabel: 'Hỏi Kiến Trúc Sư AI',
      dockTitle: 'Trợ Lý Kiến Trúc Sư AI 3D',
      dockSubtitle:
        'Điều khiển cảnh 3D bằng Tool-Calling · Tự động chọn stack & bay camera qua từng phân khu',
      inputPlaceholder:
        'VD: Thiết kế hệ thống tìm kiếm 1 triệu video đa phương thức độ trễ dưới 30ms...',
      askBtn: 'Thiết Kế & Dẫn Đường',
      runTourBtn: 'Chạy Tour Camera 3D',
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
    ui: {
      pipelineModeTitle: 'Chế Độ Luồng Kiến Trúc',
      canonicalBadge: 'Chuẩn D1–D8',
      clearBtn: 'Xóa Lỗi',
      stopBtn: 'Dừng',
      clickToInspect: 'Nhấn để xem chi tiết →',
      sceneControls: {
        runDemo: 'Chạy Demo',
        stopDemo: 'Dừng Demo',
        pause: 'Tạm Dừng',
        resume: 'Tiếp Tục',
        speed: 'Tốc Độ',
        trainingBoost: 'Tăng Tốc Huấn Luyện',
        labels: 'Nhãn 3D',
        resetCamera: 'Đặt Lại [R]',
        view2d: 'Chế Độ 2D',
        view3d: 'Chế Độ 3D',
      },
      districtPanel: {
        throughput: 'Thông Lượng',
        capacity: 'Quy Mô Cụm',
        load: 'Tải Trọng',
        roleHeading: 'Vai Trò Trong Luồng AI Pipeline',
        plainLanguageHeading: 'Tóm Tắt Kiến Trúc & Thuật Toán',
        exampleInput: 'Đầu Vào Mẫu (Input Tensor / Payload)',
        exampleOutput: 'Đầu Ra Mẫu (Output Tensor / Payload)',
        routesTo: 'Định tuyến tới:',
        finalDelivery: 'Phân Phối Kết Quả Cuối Cùng',
        exploreRoadmapBtn: 'Khám Phá Lộ Trình Zero-to-Hero & Cột Mốc [Enter]',
        showingDataFlow: 'Đang Hiện Luồng Dữ Liệu',
        showDataFlow: 'Hiển Thị Luồng Dữ Liệu',
        prev: 'Trước',
        next: 'Tiếp',
        districtMastery: 'Tinh Thông Quận',
        cityTotal: 'Tổng Toàn Thành Phố',
        tabRoadmap: '01 · Lộ Trình',
        tabLandmarks: '02 · Cột Mốc',
        tabQuiz: '03 · Trắc Nghiệm',
        tabVram: '04 · Phòng Lab VRAM',
      },
      walkthrough: {
        sectionBadge: 'Kiến Trúc Chuẩn 8 Quận (D1–D8)',
        sectionSubtitle:
          'Hệ thống AI sản xuất tách biệt hoàn toàn luồng Suy luận thời gian thực (Online Inference) khỏi luồng Lập chỉ mục dữ liệu (Offline Indexing) và Huấn luyện phân tán (Offline Training). Chuyển đổi chế độ bên dưới để kiểm tra định tuyến vật lý và hình thái tensor.',
        selectModeLabel: 'Chọn Chế Độ Luồng Kiến Trúc Độc Lập:',
        activeInModePrefix: 'HOẠT ĐỘNG TRONG',
        archRoleInPrefix: 'Vai Trò Kiến Trúc Trong',
        rooflineConstraint: 'Giới Hạn Vật Lý Roofline',
        inspectIn3dPrefix: 'Quan Sát Trên Thành Phố 3D',
        viewRoadmapBtn: 'Xem Lộ Trình & Cột Mốc',
        specBoxTitle: 'Giao Thức Truyền Tải & Đặc Tả Hình Thái Tensor',
        protocolAndTensorLabel: 'Giao Thức Mạng & Biến Đổi Hình Thái Tensor:',
        coreResponsibilityLabel: 'Trách Nhiệm Kỹ Thuật Cốt Lõi:',
        productionStackLabel: 'Công Nghệ Sản Xuất Chủ Đạo:',
        hardwareBoundLabel: 'Điểm Nghẽn Phần Cứng Chi Phối:',
        canonicalStageMapping: 'Ánh Xạ Phân Khu Chuẩn:',
        all8Heading:
          'Toàn Bộ 8 Phân Khu Chuẩn Của Thành Phố Nơ-ron (D1–D8) — Nhấn vào bất kỳ quận nào để hội tụ camera 3D',
        focus3dBtn: 'Hội Tụ 3D →',
        standbyLabel: 'CHỜ (STANDBY)',
      },
      telemetry: {
        sectionTitle: 'Giám Sát Telemetry Vật Lý & Bộ Công Cụ Chaos',
        sectionSubtitle:
          'Các chỉ số được cô lập động theo từng Chế độ Luồng — Suy luận trực tuyến (TTFT, TPOT, E2E P99, KV-Cache) không bao giờ bị trộn lẫn với Lập chỉ mục hay Huấn luyện phân tán (MFU, ZeRO-3, Step Loss).',
        faultInjected: 'ĐANG TIÊM LỖI CHAOS',
        staticSnapshot: 'Ảnh Chụp Tĩnh',
        rooflineActive: 'Vật Lý Roofline Trực Tiếp',
        chaosSimulatorLabel: 'Mô Phỏng Chaos Engineering & Điểm Nghẽn Sản Xuất:',
        masteryCardTitle: 'CHỈ SỐ TINH THÔNG KIẾN TRÚC SƯ',
        masteryCardSubtext: 'Cột Mốc Hoàn Thành · Số Quận Đã Overclock',
      },
      footer: {
        shortcutDistrict: 'Phím tắt: [1–8] Chọn Quận',
        shortcutTycoon: '[G] Chế Độ Tycoon · [T] Cây Công Nghệ',
        shortcutLab: '[L] Phòng Thí Nghiệm Quận',
        shortcutBattle: '[V] Đấu Trường A/B',
        shortcutBlueprint: '[B] Bản Vẽ X-Ray',
        shortcutReset: '[R] Đặt Lại Camera',
        shortcutClose: '[Esc] Đóng Bảng',
      },
    },
    pipelineModes: {
      'online-inference': {
        shortLabel: 'Suy Luận Trực Tuyến',
        title: 'Suy Luận Trực Tuyến & Vòng Lặp Tác Tử (Real-Time Serving)',
        workloadExample: 'kingfisher.jpg + "Nhận diện loài chim & môi trường sống"',
        standbyBadgeText: 'NGẮT KẾT NỐI KHI PHỤC VỤ ONLINE',
      },
      'offline-indexing': {
        shortLabel: 'Lập Chỉ Mục Offline',
        title: 'Lập Chỉ Mục Dữ Liệu & Luồng ETL (Offline Batch)',
        workloadExample: 'Nạp 10.000 khung hình video & tài liệu PDF vào đồ thị HNSW',
        standbyBadgeText: 'CHỜ TRONG CHẾ ĐỘ ETL',
      },
      'offline-training': {
        shortLabel: 'Huấn Luyện Offline',
        title: 'Huấn Luyện Phân Tán & Căn Chỉnh DPO (Cụm GPU Offline)',
        workloadExample: 'Tinh chỉnh FSDP ZeRO-3 & DPO trên cụm 64× GPU H100',
        standbyBadgeText: 'CÔ LẬP KHỎI CỤM HUẤN LUYỆN',
      },
    },
    workloads: {
      'multimodal-vision': {
        shortBadge: 'Đa Phương Thức VLM',
        title: 'Truy Vấn Thị Giác - Ngôn Ngữ (VLM)',
      },
      'agentic-mcp-rag': {
        shortBadge: 'Tác Tử MCP + RAG',
        title: 'Tác Tử Tự Hành MCP & Truy Xuất Lai RAG',
      },
      'distributed-training': {
        shortBadge: 'Huấn Luyện FSDP',
        title: 'Tinh Chỉnh Phân Tán (FSDP + QLoRA)',
      },
      'adversarial-injection': {
        shortBadge: 'Lá Chắn Prompt',
        title: 'Phòng Thủ Tấn Công Prompt Injection',
      },
    },
    bottlenecks: {
      none: {
        shortLabel: 'Bình Thường',
        title: 'Luồng Sản Xuất Ổn Định',
        diagnosticMessage:
          'Cả 8 phân khu của Thành phố Nơ-ron đang vận hành trong ngưỡng độ trễ P99 và dung lượng VRAM cho phép.',
        fixButtonLabel: 'Hệ Thống Ổn Định',
      },
      'kv-cache-oom': {
        shortLabel: 'Tràn VRAM KV-Cache',
        title: 'Cạn Kiệt Bộ Nhớ VRAM Do KV-Cache (OOM)',
        diagnosticMessage:
          'Cấp phát KV-Cache liên tục làm tràn 80GB HBM3 khi chạy ngữ cảnh 32K đồng thời cao. Phân mảnh bộ nhớ nghiêm trọng!',
        fixButtonLabel: 'Khắc phục bằng vLLM PagedAttention (D5 Cấp 3)',
      },
      'vector-brute-force': {
        shortLabel: 'Quét Vector Chậm',
        title: 'Quét Toàn Bộ Vector Chưa Lập Chỉ Mục (Flat Scan)',
        diagnosticMessage:
          'Quét vét cạn O(N) trên 50 triệu vector làm độ trễ truy xuất tăng vọt từ 6.4ms lên 380ms!',
        fixButtonLabel: 'Khắc phục bằng HNSW + Hybrid BM25 (D2 Cấp 2)',
      },
      'gradient-explosion': {
        shortLabel: 'Bùng Nổ Gradient',
        title: 'Bùng Nổ Gradient FP16 & Nghẽn Đồng Bộ All-Reduce',
        diagnosticMessage:
          'Gradient FP16 vượt quá dải động gây lỗi Loss = NaN và làm treo vòng đồng bộ All-Reduce đa nút.',
        fixButtonLabel: 'Khắc phục bằng BF16 + FSDP ZeRO-3 (D3 Cấp 2)',
      },
      'prompt-injection-spike': {
        shortLabel: 'Tấn Công Jailbreak',
        title: 'Tấn Công Vượt Rào Prompt Injection & Rò Rỉ PII',
        diagnosticMessage:
          'Truy vấn độc hại cố tình ghi đè chỉ dẫn hệ thống nhằm đánh cắp system prompt và gọi công cụ trái phép.',
        fixButtonLabel: 'Khắc phục bằng NeMo Guardrails & RAGAS (D7 Cấp 4)',
      },
    },
    districts: {
      'input-gateway': {
        name: 'Cổng Tiếp Nhận Đa Phương Thức',
        shortName: 'D1. Cổng Vào',
        domainTitle: 'Tiếp Nhận, Phân Tích & Token Hóa',
        tagline: 'Tiếp nhận văn bản, ảnh, khung hình video và luồng dữ liệu thời gian thực.',
        roleInPipeline:
          'Chấm dứt kết nối TLS/gRPC, kiểm tra schema Pydantic v2, mã hóa văn bản bằng BPE (Tiktoken) và cắt ảnh RGB 1024×1024 thành lưới 256 patch 16×16 chuẩn hóa.',
        plainLanguageExplanation:
          'Đóng vai trò cửa khẩu biên giới tốc độ cao: chuẩn hóa mọi định dạng chữ, ảnh và âm thanh thô thành các tensor số học đồng nhất trước khi đưa vào mạng nơ-ron.',
        modeRoleSummaries: {
          'online-inference':
            'Tiếp nhận truy vấn thời gian thực qua HTTP/2 & gRPC, kiểm tra schema Pydantic v2, mã hóa BPE và chiếu ảnh 1024×1024 thành tensor patch [B, 256, 1152] (FP16).',
          'offline-indexing':
            'Tiếp nhận luồng lô (batch) gồm hàng chục nghìn khung hình video và tài liệu PDF, thực hiện khử trùng lặp pHash và bóc tách OCR bất đồng bộ.',
          'offline-training':
            'CÔ LẬP TRONG CHẾ ĐỘ HUẤN LUYỆN: Cổng API người dùng được tách biệt hoàn toàn khỏi cụm huấn luyện phân tán để tránh tranh chấp băng thông I/O.',
        },
      },
      'data-lake': {
        name: 'Kho Vector & Hồ Dữ Liệu',
        shortName: 'D2. Kho Vector',
        domainTitle: 'Lưu Trữ Vector HNSW & Truy Xuất Lai (Hybrid RAG)',
        tagline: 'Tổ chức embedding mật độ cao kết hợp tìm kiếm từ khóa BM25 tốc độ cao.',
        roleInPipeline:
          'Lưu trữ hàng tỷ vector đa phương thức trong đồ thị nhiều tầng HNSW kết hợp chỉ mục từ khóa BM25 và hợp nhất kết quả bằng Reciprocal Rank Fusion (RRF).',
        plainLanguageExplanation:
          'Thư viện trí nhớ dài hạn của thành phố: thay vì quét từng trang sách, hệ thống nhảy qua đồ thị HNSW trong vài mili-giây để tìm đúng đoạn kiến thức liên quan nhất.',
        modeRoleSummaries: {
          'online-inference':
            'Thực thi Truy xuất Lai (Hybrid RAG) dưới 10ms kết hợp duyệt đồ thị HNSW (efSearch=64) và chỉ mục đảo BM25 qua thuật toán hợp nhất hạng RRF.',
          'offline-indexing':
            'Xây dựng đồ thị lân cận đa tầng HNSW (M=16, efConstruction=200), lượng tử hóa SQ8/IVF-PQ tiết kiệm 74% RAM và ghi các phân đoạn bất biến xuống NVMe.',
          'offline-training':
            'Truyền phát các tập dữ liệu tiền huấn luyện (WebDataset / Parquet) qua băng thông cao GPUDirect Storage thẳng vào bộ nạp dữ liệu FSDP/ZeRO-3.',
        },
      },
      'training-cluster': {
        name: 'Xưởng Huấn Luyện Phân Tán',
        shortName: 'D3. Huấn Luyện',
        domainTitle: 'Huấn Luyện Đa GPU, FSDP/ZeRO & Tinh Chỉnh QLoRA',
        tagline: 'Huấn luyện hỗn hợp BF16/FP8, tinh chỉnh tham số hiệu quả và căn chỉnh DPO.',
        roleInPipeline:
          'Thực thi lan truyền tiến/ngược (forward/backward pass) độ chính xác hỗn hợp BF16/FP8 và phân mảnh tham số, gradient, trạng thái AdamW qua PyTorch FSDP / DeepSpeed ZeRO-3.',
        plainLanguageExplanation:
          'Nhà máy rèn luyện trí tuệ (chỉ hoạt động Offline): hàng chục GPU H100 cùng giải bài toán tối ưu hóa để cập nhật trọng số mô hình, hoàn toàn tách biệt khỏi luồng phục vụ người dùng.',
        modeRoleSummaries: {
          'online-inference':
            'CHỜ / NGẮT KẾT NỐI KHI PHỤC VỤ ONLINE: Truy vấn thời gian thực của người dùng KHÔNG BAO GIỜ đi qua lan truyền ngược hay cập nhật gradient; trọng số được đóng băng hoàn toàn.',
          'offline-indexing':
            'CHỜ TRONG CHẾ ĐỘ ETL: Quá trình trích xuất vector sử dụng bộ mã hóa đóng băng tại Động cơ Suy luận (D5), không kích hoạt cập nhật gradient tại xưởng huấn luyện.',
          'offline-training':
            'Thực thi lan truyền tiến/ngược BF16 giới hạn bởi năng lực tính toán (Compute-Bound) và đồng bộ gradient phân mảnh qua NVLink 900 GB/s bằng All-Gather & Reduce-Scatter.',
        },
      },
      'model-core': {
        name: 'Lõi Mô Hình & Kho Trọng Số',
        shortName: 'D4. Lõi Mô Hình',
        domainTitle: 'Kiến Trúc Nền Tảng Transformer & Kho Checkpoint',
        tagline: 'Mạng nơ-ron trung tâm lưu trữ checkpoint FP8/AWQ và tầng chiếu đa phương thức.',
        roleInPipeline:
          'Lưu trữ kiến trúc xương sống (Transformer / Sparse MoE / ViT) và cung cấp các bản chụp trọng số bất biến (Safetensors FP8/INT4-AWQ) cho cụm Suy luận.',
        plainLanguageExplanation:
          'Kho lưu trữ bộ não chuẩn hóa: nơi bảo quản các phiên bản trọng số mô hình đã kiểm định để nạp sẵn vào bộ nhớ HBM của cụm suy luận.',
        modeRoleSummaries: {
          'online-inference':
            'Cung cấp trọng số đóng băng đã lượng tử hóa (FP8 / INT4-AWQ Safetensors) nạp sẵn vào bộ nhớ HBM của Động cơ Suy luận (D5) qua liên kết tĩnh tốc độ cao.',
          'offline-indexing':
            'Cung cấp trọng số đóng băng của bộ mã hóa thị giác - ngôn ngữ (SigLIP / BGE-M3) cho cụm trích xuất embedding hàng loạt.',
          'offline-training':
            'Tiếp nhận các bản lưu checkpoint phân mảnh định kỳ từ Xưởng Huấn luyện (D3), quản lý phiên bản trọng số và xuất bản ứng viên mô hình mới.',
        },
      },
      'inference-center': {
        name: 'Động Cơ Suy Luận Tốc Độ Cao',
        shortName: 'D5. Suy Luận',
        domainTitle: 'Phục Vụ Mô Hình Triton, ONNX/TensorRT & vLLM',
        tagline: 'Thực thi suy luận độ trễ cực thấp với PagedAttention và Dynamic Batching.',
        roleInPipeline:
          'Thực thi pha Prefill (giới hạn bởi tính toán) và pha giải mã sinh token tự hồi quy (giới hạn bởi băng thông bộ nhớ HBM) với vLLM PagedAttention và Continuous Batching.',
        plainLanguageExplanation:
          'Động cơ phản lực phục vụ thời gian thực: quản lý bộ nhớ đệm KV-Cache theo từng trang rời rạc giúp hàng trăm người dùng nhận phản hồi đồng thời với độ trễ chỉ vài mili-giây mỗi token.',
        modeRoleSummaries: {
          'online-inference':
            'Thực thi pha Prefill O(L²) và giải mã tự hồi quy O(L) bằng vLLM PagedAttention (Block=16) và Continuous Batching ở tốc độ ~88 token/giây/luồng.',
          'offline-indexing':
            'Chạy các bộ mã hóa SigLIP / ViT theo lô động (Batch=256) trên Triton Server để biến đổi hàng nghìn khung hình và đoạn văn thành vector chuẩn hóa.',
          'offline-training':
            'CÔ LẬP KHỎI CỤM HUẤN LUYỆN: Các pod phục vụ suy luận thời gian thực được tách biệt hoàn toàn để bảo vệ cam kết SLA P99 cho người dùng cuối.',
        },
      },
      'nlp-district': {
        name: 'Điều Phối Tác Tử & Giao Thức MCP',
        shortName: 'D6. Tác Tử MCP',
        domainTitle: 'Tác Tử Tự Hành, LangGraph & Giao Thức MCP',
        tagline: 'Điều phối suy luận đa bước, bộ nhớ ngữ cảnh và gọi công cụ chuẩn hóa MCP.',
        roleInPipeline:
          'Thực thi đồ thị trạng thái có chu trình (LangGraph ReAct: Plan -> Act -> Observe -> Verify) và gọi các công cụ bên ngoài thông qua giao thức JSON-RPC 2.0 Model Context Protocol (MCP).',
        plainLanguageExplanation:
          'Trung tâm chỉ huy tác tử thông minh: phân rã yêu cầu phức tạp thành từng bước, chủ động tra cứu Kho Vector (D2) hoặc gọi API công cụ rồi tổng hợp câu trả lời.',
        modeRoleSummaries: {
          'online-inference':
            'Điều phối vòng lặp suy luận LangGraph ReAct, phát lệnh truy vấn Hybrid RAG sang Kho Vector (D2) và lắp ghép ngữ cảnh vào prompt cho Động cơ Suy luận (D5).',
          'offline-indexing':
            'CHỜ TRONG CHẾ ĐỘ ETL: Bộ điều phối tác tử tương tác không nằm trên đường dẫn nạp và băm tài liệu hàng loạt.',
          'offline-training':
            'CHỜ TRONG CHẾ ĐỘ HUẤN LUYỆN: Quá trình tối ưu hóa trọng số diễn ra trực tiếp trên các shard dữ liệu giữa D2, D3 và D4.',
        },
      },
      'computer-vision': {
        name: 'Hàng Rào An Toàn & Kiểm Định Eval',
        shortName: 'D7. Hàng Rào & Eval',
        domainTitle: 'Nhận Thức Thị Giác, Guardrails & Kiểm Định RAGAS',
        tagline: 'Trích xuất đặc trưng ảnh/video, chặn Prompt Injection và đo lường độ trung thực.',
        roleInPipeline:
          'Thực thi cổng kiểm soát kép (Dual-Gate): quét chặn Prompt Injection và ẩn danh PII ở đầu vào, đồng thời kiểm định độ trung thực NLI (RAGAS Faithfulness > 0.90) ở đầu ra.',
        plainLanguageExplanation:
          'Hệ thống lá chắn an ninh và kiểm định chất lượng: đảm bảo không có truy vấn độc hại nào lọt vào lõi AI và không có thông tin bịa đặt (ảo giác) nào lọt ra tới người dùng.',
        modeRoleSummaries: {
          'online-inference':
            'Vận hành lá chắn kép: Cổng vào chặn tấn công Jailbreak/Prompt Injection & ẩn PII; Cổng ra đối chiếu từng câu sinh ra với ngữ cảnh RAG để chặn ảo giác.',
          'offline-indexing':
            'Quét lọc thông tin định danh cá nhân (PII), kiểm열 nội dung độc hại và lọc chất lượng tài liệu trước khi ghi vector vào Kho D2.',
          'offline-training':
            'Chạy bộ kiểm thử tự động (RAGAS, MMLU, kiểm tra độ lệch an toàn) trên từng checkpoint mới trước khi cho phép đăng ký vào Lõi Mô Hình (D4).',
        },
      },
      'output-terminal': {
        name: 'Trạm Đầu Ra & Giám Sát MLOps',
        shortName: 'D8. Đầu Ra & MLOps',
        domainTitle: 'Đóng Gói Docker, Prometheus & Giám Sát Sản Xuất',
        tagline: 'Phân phối kết quả streaming và giám sát tài nguyên GPU, độ trễ P99.',
        roleInPipeline:
          'Truyền phát token thời gian thực qua Server-Sent Events (SSE / gRPC) và xuất bản các chỉ số OpenTelemetry, độ trễ TTFT/TPOT, bão hòa VRAM lên Prometheus & Grafana.',
        plainLanguageExplanation:
          'Trạm phát sóng và đài quan sát trung tâm: chuyển kết quả mượt mà tới màn hình người dùng đồng thời theo dõi sức khỏe của toàn bộ cụm GPU từng mili-giây.',
        modeRoleSummaries: {
          'online-inference':
            'Truyền phát luồng token đã xác thực qua SSE/gRPC tới người dùng cuối đồng thời ghi nhận chỉ số TTFT, TPOT và độ bão hòa KV-Cache.',
          'offline-indexing':
            'Phát báo cáo hoàn tất lô ETL, nhật ký đồng bộ phân đoạn HNSW và cảnh báo độ lệch phân phối dữ liệu (data drift).',
          'offline-training':
            'Ghi nhận biểu đồ hàm mất mát (Step Loss), chuẩn độ dốc (Gradient Norm), hiệu suất MFU và băng thông truyền thông NVLink/InfiniBand.',
        },
      },
    },
    pipelineStages: {
      input: {
        label: 'D1. Cổng Vào',
        title: 'Tiếp Nhận Đa Phương Thức & Chuẩn Hóa',
        summary: 'Kiểm tra schema, lọc nhiễu và mã hóa văn bản, hình ảnh, khung hình video.',
        plainExplanation:
          'Mọi yêu cầu từ người dùng (văn bản, ảnh độ phân giải cao, khung hình video) đi vào qua Cổng D1. Hệ thống xác thực cấu trúc dữ liệu, mã hóa chữ thành chuỗi Token ID và chia nhỏ hình ảnh thành lưới 256 mảnh (patch) chuẩn hóa.',
      },
      'data-lake': {
        label: 'D2. Kho Vector',
        title: 'Lập Chỉ Mục Vector & Truy Xuất Lai',
        summary: 'Lưu trữ vector trên đồ thị HNSW/IVF-PQ kết hợp bộ lọc siêu dữ liệu.',
        plainExplanation:
          'Kho Vector D2 lưu trữ hàng triệu vector đa phương thức trong đồ thị nhiều tầng HNSW kết hợp tìm kiếm từ khóa BM25, giúp trích xuấtTop-K ngữ cảnh chính xác trong chưa đầy 10ms.',
      },
      training: {
        label: 'D3. Huấn Luyện',
        title: 'Tối Ưu Hóa Phân Tán & Tinh Chỉnh Mô Hình (Offline)',
        summary: 'Cập nhật trọng số qua FSDP, DeepSpeed ZeRO-3, QLoRA và căn chỉnh DPO.',
        plainExplanation:
          'Xưởng Huấn Luyện D3 chỉ hoạt động trong luồng Offline Training: phân mảnh tham số, gradient và trạng thái tối ưu hóa qua hàng chục GPU bằng FSDP/ZeRO-3. Truy vấn người dùng trực tuyến không bao giờ đi qua phân khu này.',
      },
      'model-core': {
        label: 'D4. Lõi Mô Hình',
        title: 'Kho Lưu Trữ Trọng Số & Kiến Trúc Nền Tảng',
        summary: 'Quản lý checkpoint FP8/AWQ bất biến và tầng chiếu đa phương thức.',
        plainExplanation:
          'Lõi Mô Hình D4 quản lý các bản chụp trọng số đã lượng tử hóa (FP8 / INT4-AWQ Safetensors) và nạp sẵn (pre-load) vào bộ nhớ HBM của cụm Suy luận D5.',
      },
      inference: {
        label: 'D5. Suy Luận',
        title: 'Biên Dịch Mô Hình & Phục Vụ Thông Lượng Cao',
        summary: 'Tăng tốc bằng ONNX Runtime, Triton Server và vLLM PagedAttention.',
        plainExplanation:
          'Động cơ Suy luận D5 thực thi pha Prefill (tính toán song song) và pha Decode sinh từng token với PagedAttention, loại bỏ phân mảnh bộ nhớ KV-Cache và giữ độ trễ mỗi token quanh mức ~11.4ms.',
      },
      'agentic-mcp': {
        label: 'D6. Tác Tử & MCP',
        title: 'Điều Phối LangGraph & Giao Thức Công Cụ MCP',
        summary: 'Thực thi vòng lặp suy luận ReAct và gọi công cụ chuẩn hóa JSON-RPC 2.0.',
        plainExplanation:
          'Bộ Điều phối Tác tử D6 vận hành đồ thị trạng thái LangGraph, tự động lập kế hoạch, gọi truy xuất ngữ cảnh từ Kho Vector D2 hoặc gọi công cụ bên ngoài qua giao thức chuẩn MCP.',
      },
      'guardrails-eval': {
        label: 'D7. Hàng Rào & Eval',
        title: 'Kiểm Soát An Toàn & Kiểm Định Độ Trung Thực RAGAS',
        summary: 'Chặn Prompt Injection, ẩn thông tin nhạy cảm PII và kiểm chứng ảo giác.',
        plainExplanation:
          'Hàng rào An toàn D7 kiểm tra cả đầu vào (chặn tấn công Prompt Injection, lọc PII) lẫn đầu ra (đối chiếu độ trung thực với tài liệu gốc bằng RAGAS) trước khi trả kết quả.',
      },
      output: {
        label: 'D8. Đầu Ra & MLOps',
        title: 'Phản Hồi Streaming & Giám Sát Telemetry',
        summary: 'Truyền kết quả tới người dùng kèm theo dõi Prometheus/Grafana toàn diện.',
        plainExplanation:
          'Trạm Đầu Ra D8 truyền phát từng token kết quả về ứng dụng khách qua giao thức SSE/gRPC, đồng thời ghi nhận toàn bộ chỉ số vật lý (TTFT, TPOT, VRAM, độ lệch dữ liệu) lên bảng giám sát.',
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
      selectDistrictPrompt: 'ディストリクト選択:',
      orbitHint:
        'キー [1–8] でエリア選択 · [B] でX線設計図モード · ドラッグで回転',
      minimizedPill: 'ワークロード＆カオス制御',
    },
    stackBuilder: {
      modalTitle: 'AIスタックビルダー＆本番ボイラープレート生成',
      modalSubtitle:
        '全8ディストリクトの技術を選択し、docker-compose.yml、Makefile、Mermaid構成図、SLA・VRAM試算を自動生成します。',
      selectTechHeading: '8ディストリクト本番スタック構成',
      copyBtn: 'コードをコピー',
      copiedBtn: 'コピー完了！',
      downloadFileBtn: 'ファイルを保存',
      downloadBundleBtn: '一括バンドル保存 (.sh)',
      tabDocker: 'docker-compose.yml',
      tabMakefile: 'Makefile',
      tabMermaid: 'architecture.mmd',
      tabSla: 'SLA・ハードウェア試算',
    },
    architectAgent: {
      triggerLabel: 'AIアーキテクトに質問',
      dockTitle: 'AIシティ・アーキテクト Copilot',
      dockSubtitle:
        '3Dシーン制御エージェント · 最適な技術スタックの自動構成と3Dカメラツアーを実行',
      inputPlaceholder:
        '例: 100万本の動画を30ms以下で検索するマルチモーダルRAGシステムを設計して...',
      askBtn: '設計＆3Dトレース',
      runTourBtn: '3Dカメラツアー開始',
      loadStackBtn: 'スタックビルダーに読込',
      tourPlayingBadge: '3Dアーキテクトツアー実行中',
      prevStepBtn: '前へ',
      nextStepBtn: '次へ',
      exitTourBtn: 'ツアー終了',
    },
    caseStudies: {
      modalTitle: '実践AIエンジニアリング導入事例',
      modalSubtitle:
        '本番環境で実証された3つのAIシステム設計ブループリントを3D都市上で再現し、構成コードを出力します。',
      simulateBtn: '3D都市でシミュレート',
      openStackBtn: 'スタックビルダーで開く',
      problemLabel: '技術的課題',
      architectureLabel: 'ディストリクト別アーキテクチャ構成',
      metricsLabel: '実証パフォーマンス指標',
    },
    ui: {
      pipelineModeTitle: 'パイプライン・アーキテクチャモード',
      canonicalBadge: 'D1–D8 標準構成',
      clearBtn: '解除',
      stopBtn: '停止',
      clickToInspect: 'クリックして詳細を表示 →',
      sceneControls: {
        runDemo: 'デモを実行',
        stopDemo: 'デモ停止',
        pause: '一時停止',
        resume: '再開',
        speed: '速度',
        trainingBoost: '学習ブースト',
        labels: '3Dラベル',
        resetCamera: '視点リセット [R]',
        view2d: '2D表示',
        view3d: '3D表示',
      },
      districtPanel: {
        throughput: 'スループット',
        capacity: 'クラスタ規模',
        load: '負荷率',
        roleHeading: 'AIパイプラインにおける役割',
        plainLanguageHeading: 'アーキテクチャ概要',
        exampleInput: '入力テンソル / ペイロード例',
        exampleOutput: '出力テンソル / ペイロード例',
        routesTo: 'ルーティング先:',
        finalDelivery: 'クライアント最終配信',
        exploreRoadmapBtn: 'Zero-to-Hero ロードマップ＆金字塔を開く [Enter]',
        showingDataFlow: 'データフロー表示中',
        showDataFlow: 'データフローを表示',
        prev: '前へ',
        next: '次へ',
        districtMastery: 'エリア習熟度',
        cityTotal: '都市全体習熟度',
        tabRoadmap: '01 · ロードマップ',
        tabLandmarks: '02 · 歴史的論文',
        tabQuiz: '03 · 確認クイズ',
        tabVram: '04 · VRAMラボ',
      },
      walkthrough: {
        sectionBadge: '標準8ディストリクト・アーキテクチャ (D1–D8)',
        sectionSubtitle:
          '本番AIシステムでは、リアルタイム推論 (Online Inference) とオフラインデータ索引 (Offline Indexing)・分散学習 (Offline Training) を明確に分離します。以下のモードを切り替えて物理ルーティングとテンソル形状を確認してください。',
        selectModeLabel: 'パイプライン動作モードを選択:',
        activeInModePrefix: '稼働中:',
        archRoleInPrefix: '選択モードにおける役割:',
        rooflineConstraint: 'Roofline ハードウェア制約',
        inspectIn3dPrefix: '3D都市で検査',
        viewRoadmapBtn: 'ロードマップ＆論文を見る',
        specBoxTitle: '通信プロトコル＆テンソル形状仕様',
        protocolAndTensorLabel: '通信プロトコル＆テンソル変換仕様:',
        coreResponsibilityLabel: '主要エンジニアリング責務:',
        productionStackLabel: '主要プロダクション技術スタック:',
        hardwareBoundLabel: '支配的ハードウェア制約:',
        canonicalStageMapping: '標準ステージマッピング:',
        all8Heading:
          '全8ディストリクト一覧 (D1–D8) — 任意のカードをクリックして3Dカメラをフォーカス',
        focus3dBtn: '3Dフォーカス →',
        standbyLabel: '待機 (STANDBY)',
      },
      telemetry: {
        sectionTitle: '物理ルーフライン・テレメトリ＆カオス検証スイート',
        sectionSubtitle:
          'パイプラインモードごとに指標を厳密に分離 — オンライン推論 (TTFT, TPOT, E2E P99, KV-Cache) とオフライン分散学習 (MFU, ZeRO-3, Step Loss) を混同しません。',
        faultInjected: 'カオス障害注入中',
        staticSnapshot: '静止スナップショット',
        rooflineActive: 'Roofline物理演算稼働中',
        chaosSimulatorLabel: 'カオスエンジニアリング＆ボトルネック注入:',
        masteryCardTitle: 'アーキテクト習熟度指数',
        masteryCardSubtext: '完了マイルストーン · オーバークロック済エリア',
      },
      footer: {
        shortcutDistrict: 'ショートカット: [1–8] エリア選択',
        shortcutTycoon: '[G] 戦略モード · [T] 技術ツリー',
        shortcutLab: '[L] アルゴリズム・ラボ',
        shortcutBattle: '[V] A/B 対決アリーナ',
        shortcutBlueprint: '[B] 設計図X線モード',
        shortcutReset: '[R] カメラリセット',
        shortcutClose: '[Esc] パネルを閉じる',
      },
    },
    pipelineModes: {
      'online-inference': {
        shortLabel: 'オンライン推論',
        title: 'オンライン推論＆エージェントループ (Real-Time Serving)',
        workloadExample: 'kingfisher.jpg + "種別と生息地を特定して"',
        standbyBadgeText: '推論モード中はオフライン待機',
      },
      'offline-indexing': {
        shortLabel: 'オフライン索引 (ETL)',
        title: 'オフラインデータ索引＆ETLパイプライン (Batch)',
        workloadExample: '10,000枚の映像キーフレームとPDFをHNSWへ一括登録',
        standbyBadgeText: 'ETLモード中は待機',
      },
      'offline-training': {
        shortLabel: 'オフライン分散学習',
        title: 'オフライン分散学習＆アライメント (Compute Cluster)',
        workloadExample: '64× H100 GPUでのFSDP ZeRO-3学習およびDPOアライメント',
        standbyBadgeText: '学習クラスタから分離中',
      },
    },
    workloads: {
      'multimodal-vision': {
        shortBadge: 'マルチモーダルVLM',
        title: 'マルチモーダル視覚・言語クエリ',
      },
      'agentic-mcp-rag': {
        shortBadge: 'MCPエージェント+RAG',
        title: '自律型MCPツール実行＆ハイブリッドRAG',
      },
      'distributed-training': {
        shortBadge: 'FSDP + QLoRA学習',
        title: '分散ファインチューニング (FSDP + QLoRA)',
      },
      'adversarial-injection': {
        shortBadge: 'プロンプト防御',
        title: '敵対的プロンプトインジェクション防御',
      },
    },
    bottlenecks: {
      none: {
        shortLabel: '正常稼働',
        title: '本番システム正常稼働中',
        diagnosticMessage:
          '全8ディストリクトがP99遅延およびVRAMバジェット内で正常に稼働しています。',
        fixButtonLabel: 'システム正常',
      },
      'kv-cache-oom': {
        shortLabel: 'KVキャッシュOOM',
        title: 'KVキャッシュVRAM枯渇 (OOM)',
        diagnosticMessage:
          '32K長文脈の同時リクエストにより80GB HBM3が枯渇し、深刻なメモリ断片化が発生しました。',
        fixButtonLabel: 'vLLM PagedAttentionで解決 (D5 Lv.3)',
      },
      'vector-brute-force': {
        shortLabel: '全件走査遅延',
        title: 'インデックス未構築の総当たりベクトル検索',
        diagnosticMessage:
          '5,000万件のベクトルに対するO(N)線形走査により検索遅延が6.4msから380msに急増しました。',
        fixButtonLabel: 'HNSW + ハイブリッドBM25で解決 (D2 Lv.2)',
      },
      'gradient-explosion': {
        shortLabel: '勾配爆発 (NaN)',
        title: 'FP16勾配爆発＆All-Reduce通信停滞',
        diagnosticMessage:
          'FP16勾配のオーバーフローによりLossがNaNに発散し、ノード間同期が停止しました。',
        fixButtonLabel: 'BF16 + FSDP ZeRO-3で解決 (D3 Lv.2)',
      },
      'prompt-injection-spike': {
        shortLabel: 'Jailbreak攻撃',
        title: '敵対的Jailbreak＆PII漏洩試行',
        diagnosticMessage:
          '悪意あるシステム命令上書きペイロードが検知されました。',
        fixButtonLabel: 'NeMo Guardrails & RAGASで解決 (D7 Lv.4)',
      },
    },
    districts: {
      'input-gateway': {
        name: '入力ゲートウェイ (Multimodal Ingress)',
        shortName: 'D1. 入力GW',
        domainTitle: 'マルチモーダル入力・正規化・トークン化',
        tagline: 'テキスト、画像、映像フレーム、APIストリームを高速に受信・正規化します。',
        roleInPipeline:
          'TLS/gRPC終端、Pydantic v2スキーマ検証、BPEトークン化、および1024×1024画像の16×16 ViTパッチテンソル変換を実行します。',
        plainLanguageExplanation:
          '都市の高速ゲートウェイ：多様な入力データを検証し、ニューラルネットが処理可能な統一テンソル形式へ変換します。',
        modeRoleSummaries: {
          'online-inference':
            'HTTP/2およびgRPCリクエストを終端し、BPEトークン化と16×16 ViTパッチテンソル [B, 256, 1152] (FP16) への投影を行います。',
          'offline-indexing':
            '大量の映像キーフレームやPDF文書をバッチ受信し、pHash重複排除と非同期OCR抽出を実行します。',
          'offline-training':
            '学習モード中は分離：オンラインAPIゲートウェイは分散学習クラスタのI/O帯域を圧迫しないよう分離されています。',
        },
      },
      'data-lake': {
        name: 'データレイク・ベクトルDB (Vector Vault)',
        shortName: 'D2. ベクトルDB',
        domainTitle: 'HNSWベクトル検索＆ハイブリッドRAG基盤',
        tagline: '高次元ベクトルインデックスとBM25全文検索を統合し、高速検索を実現します。',
        roleInPipeline:
          '数十億規模のベクトルをHNSW階層グラフとBM25転置インデックスに格納し、RRF (Reciprocal Rank Fusion) で高速検索します。',
        plainLanguageExplanation:
          '都市の長期記憶ライブラリ：HNSWグラフ探索により数ミリ秒で最も関連性の高い知識チャンクを抽出します。',
        modeRoleSummaries: {
          'online-inference':
            'HNSWグラフ探索 (efSearch=64) とBM25検索をRRF統合し、10ms未満でハイブリッドRAGコンテキストを返却します。',
          'offline-indexing':
            'HNSWグラフ (M=16, efConstruction=200) の構築とSQ8量子化を実行し、不変セグメントをNVMeへ永続化します。',
          'offline-training':
            'トークン化済みWebDataset / ParquetシャードをGPUDirect Storage経由でFSDP学習ワーカーへ高速供給します。',
        },
      },
      'training-cluster': {
        name: '分散学習ファウンドリ (Training Foundry)',
        shortName: 'D3. 分散学習',
        domainTitle: '分散GPUクラスタ・FSDP・QLoRAファインチューニング',
        tagline: '混合精度学習、パラメータ効率的適応、DPO/RLHFアライメントを実行します。',
        roleInPipeline:
          'PyTorch FSDPおよびDeepSpeed ZeRO-3を用いてパラメータ・勾配・AdamW状態を複数GPUへ分割し、BF16/FP8混合精度学習を実行します。',
        plainLanguageExplanation:
          'オフライン専用の知能鍛造工場：オンライン推論リクエストは一切通過せず、バッチ学習時のみ稼働してモデルの重みを更新します。',
        modeRoleSummaries: {
          'online-inference':
            'オンライン推論モード中は待機 (OFFLINE)：リアルタイムのユーザー推論リクエストが逆伝播や勾配更新を通過することは決してありません。',
          'offline-indexing':
            'ETL索引モード中は待機：埋め込み生成は推論エンジン (D5) 上の凍結エンコーダで実行されます。',
          'offline-training':
            '64× H100 GPUクラスタ上でBF16順伝播・逆伝播を実行し、NVLink All-Gather / Reduce-Scatter通信で勾配を同期します。',
        },
      },
      'model-core': {
        name: 'モデルコア＆重みレジストリ (Model Core)',
        shortName: 'D4. モデルコア',
        domainTitle: '基盤Transformer・マルチモーダル融合・重み管理',
        tagline: '量子化済みFP8/AWQチェックポイントとマルチモーダル統合層を管理します。',
        roleInPipeline:
          '基盤モデル (Transformer / Sparse MoE / ViT) の不変チェックポイント (Safetensors FP8/INT4-AWQ) を管理し、推論エンジンへ供給します。',
        plainLanguageExplanation:
          '検証済みモデル重みの保管庫：推論エンジンのVRAMへ事前ロードされる凍結パラメータを管理します。',
        modeRoleSummaries: {
          'online-inference':
            '量子化済み (FP8 / INT4-AWQ) の凍結モデル重みを推論エンジン (D5) のHBMメモリへ事前ロード状態で供給します。',
          'offline-indexing':
            'SigLIP / BGE-M3 などの凍結埋め込みエンコーダ重みをバッチ推論ワーカーへ提供します。',
          'offline-training':
            '分散学習ファウンドリ (D3) から定期的にシャード化されたチェックポイントを受け取り、新規モデルバージョンを登録します。',
        },
      },
      'inference-center': {
        name: '推論エンジン (High-Speed Inference)',
        shortName: 'D5. 推論エンジン',
        domainTitle: 'ONNX/TensorRT最適化・Triton・vLLM高速推論',
        tagline: 'PagedAttentionと動的バッチ処理により低遅延・高スループット推論を提供します。',
        roleInPipeline:
          '演算律速なPrefillフェーズとメモリ帯域律速な自己回帰DecodeフェーズをvLLM PagedAttentionとContinuous Batchingで高速実行します。',
        plainLanguageExplanation:
          'リアルタイム推論の心臓部：KVキャッシュを非連続ページブロックで管理し、メモリ断片化ゼロで高速なトークン生成を行います。',
        modeRoleSummaries: {
          'online-inference':
            'vLLM PagedAttention (Block=16) とContinuous Batchingにより、1トークンあたり約11.4msの低遅延で自己回帰生成を実行します。',
          'offline-indexing':
            'Triton Inference Server上で動的バッチ (Batch=256) を組み、毎秒3,850ベクトルの高速埋め込み抽出を行います。',
          'offline-training':
            '学習クラスタから分離：オンライン推論SLAを保護するため、学習ジョブとは独立したGPUプールで運用されます。',
        },
      },
      'nlp-district': {
        name: 'AIエージェント＆MCP制御 (Agentic & MCP)',
        shortName: 'D6. エージェント',
        domainTitle: '自律型エージェント・LangGraph・MCPプロトコル',
        tagline: '複数ステップの推論、長期メモリ、標準化されたMCPツール呼び出しを統括します。',
        roleInPipeline:
          'LangGraphによる循環型ステートマシン (Plan -> Act -> Observe -> Verify) とJSON-RPC 2.0 MCPツール実行を制御します。',
        plainLanguageExplanation:
          '自律型エージェントの司令塔：複雑な質問をサブタスクに分解し、ベクトルDB検索や外部ツール呼び出しを組み合わせて回答を導きます。',
        modeRoleSummaries: {
          'online-inference':
            'LangGraphのReActループを実行し、ベクトルDB (D2) へのハイブリッドRAG検索と推論エンジン (D5) へのプロンプト構築を統括します。',
          'offline-indexing':
            'ETLモード中は待機：バッチドキュメント取込パイプラインでは対話型エージェントは稼働しません。',
          'offline-training':
            '学習モード中は待機：オフライン学習はD2・D3・D4間の直接データストリームで実行されます。',
        },
      },
      'computer-vision': {
        name: 'ガードレール＆評価ゲート (Safety & Eval)',
        shortName: 'D7. ガードレール',
        domainTitle: '入出力セーフティ・PIIマスキング・RAGAS精度検証',
        tagline: 'プロンプトインジェクション防御、PII保護、および回答の事実整合性監査を行います。',
        roleInPipeline:
          '入力側のJailbreak検知・PIIマスキングと、出力側のRAGAS事実整合性検証 (Faithfulness > 0.90) の二重ゲートを実行します。',
        plainLanguageExplanation:
          'AI都市のセキュリティ＆品質監査ゲート：悪意ある攻撃を遮断し、ハルシネーション（事実無根の回答）が外部へ出力されるのを防ぎます。',
        modeRoleSummaries: {
          'online-inference':
            '入力ゲートでPrompt InjectionとPIIを検査し、出力ゲートで生成トークンと検索コンテキストのNLI事実整合性を監査します。',
          'offline-indexing':
            'ベクトルDB (D2) へ登録する前に文書内の個人情報 (PII) マスキングと有害コンテンツフィルタリングを実行します。',
          'offline-training':
            '新規学習チェックポイントに対してRAGAS・MMLU・安全性ベンチマークを自動実行し、合格したモデルのみをD4へ昇格させます。',
        },
      },
      'output-terminal': {
        name: '出力・MLOpsテレメトリ (Output Nexus)',
        shortName: 'D8. 出力・MLOps',
        domainTitle: 'SSEストリーミング配信・OpenTelemetry・Prometheus監視',
        tagline: '推論結果のストリーミング配信とGPU使用率・P99遅延のリアルタイム監視を行います。',
        roleInPipeline:
          'Server-Sent Events (SSE / gRPC) によるトークンストリーミング配信と、TTFT/TPOT・VRAM飽和度のOpenTelemetry監視を行います。',
        plainLanguageExplanation:
          '最終配信＆統合監視ターミナル：検証済みの回答をクライアントへストリーミングしつつ、全ディストリクトの稼働指標を可視化します。',
        modeRoleSummaries: {
          'online-inference':
            '検証済みトークンストリームをSSE/gRPCでクライアントへ配信し、TTFT・TPOT・E2E P99遅延をPrometheusへ記録します。',
          'offline-indexing':
            'バッチETLジョブの完了通知、HNSWシャード同期ログ、およびデータドリフト検知メトリクスを出力します。',
          'offline-training':
            '学習ステップ損失 (Step Loss)、勾配ノルム、MFU (Model FLOPs Utilization)、NVLink通信効率をリアルタイム記録します。',
        },
      },
    },
    pipelineStages: {
      input: {
        label: 'D1. 入力ゲートウェイ',
        title: 'マルチモーダル受信＆スキーマ正規化',
        summary: 'テキスト、画像、動画フレームの検証・前処理・トークン化を実行します。',
        plainExplanation:
          'ユーザーからのマルチモーダル入力をD1ゲートウェイで受信し、スキーマ検証、BPEトークン化、16×16画像パッチ分割を行います。',
      },
      'data-lake': {
        label: 'D2. ベクトルDB',
        title: 'ハイブリッドインデックス＆高速検索',
        summary: 'HNSW/IVF-PQグラフとメタデータフィルタで関連コンテキストを抽出します。',
        plainExplanation:
          'D2ベクトルDBはHNSW階層グラフとBM25検索を統合し、10ms未満で関連性の高いコンテキストチャンクを抽出します。',
      },
      training: {
        label: 'D3. 分散学習',
        title: '分散最適化＆ファインチューニング (Offline)',
        summary: 'FSDP、DeepSpeed ZeRO-3、QLoRA、DPOによりモデルの重みを最適化します。',
        plainExplanation:
          'D3分散学習ファウンドリはオフライン学習モードでのみ稼働し、FSDP/ZeRO-3でモデルの重みを更新します。オンライン推論時は完全に分離されます。',
      },
      'model-core': {
        label: 'D4. モデルコア',
        title: '基盤モデル重みレジストリ＆マルチモーダル融合',
        summary: '量子化済みFP8/AWQチェックポイントとモダリティ変換層を管理します。',
        plainExplanation:
          'D4モデルコアは量子化済み (FP8/AWQ) の不変チェックポイントを管理し、D5推論エンジンのVRAMへ事前ロードします。',
      },
      inference: {
        label: 'D5. 推論エンジン',
        title: 'モデルコンパイル＆高スループット推論',
        summary: 'ONNX Runtime、Triton、vLLMを用いてP99遅延要件内で高速推論を行います。',
        plainExplanation:
          'D5推論エンジンはvLLM PagedAttentionとContinuous Batchingを用いて、1トークン約11.4msで高速な自己回帰デコードを実行します。',
      },
      'agentic-mcp': {
        label: 'D6. エージェント＆MCP',
        title: 'LangGraph状態制御＆MCPツール実行',
        summary: '自律的なReAct推論ループとJSON-RPC 2.0 MCPツール呼び出しを統括します。',
        plainExplanation:
          'D6エージェント制御はLangGraphの循環グラフを実行し、D2ベクトル検索や外部MCPツール呼び出しを自律的に調整します。',
      },
      'guardrails-eval': {
        label: 'D7. ガードレール＆評価',
        title: '入出力セーフティ＆RAGAS精度検証',
        summary: 'プロンプトインジェクション防御、PIIマスキング、事実整合性監査を行います。',
        plainExplanation:
          'D7ガードレールは入力の安全性検査と出力のRAGAS事実整合性検証（ハルシネーション防止）の二重ゲートを担います。',
      },
      output: {
        label: 'D8. 出力・MLOps',
        title: 'ストリーミング配信＆テレメトリ監視',
        summary: 'PrometheusとGrafanaによる可視化を伴い、安全な出力をクライアントへ届けます。',
        plainExplanation:
          'D8出力ターミナルはSSE/gRPCでトークンをストリーミング配信し、TTFT・TPOT・VRAM使用率をリアルタイム監視します。',
      },
    },
  },
};
