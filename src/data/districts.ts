export type DistrictId =
  | 'input-gateway'
  | 'data-lake'
  | 'computer-vision'
  | 'nlp-district'
  | 'training-cluster'
  | 'model-core'
  | 'inference-center'
  | 'output-terminal';

export type PipelineStageId =
  | 'input'
  | 'data-lake'
  | 'training'
  | 'model-core'
  | 'inference'
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
  {
    id: 'input-gateway',
    name: 'Input Gateway',
    shortName: 'Input',
    pipelineStage: 'input',
    category: 'data',
    tagline: 'Receives text, images, video, or other data.',
    shortDescription: 'Receives raw prompts, images, audio, and sensor streams entering the AI system.',
    roleInPipeline:
      'Acts as the city port of entry. Every user prompt, uploaded photograph, video frame, or document passes through security checks and format normalization here before entering the pipeline.',
    plainLanguageExplanation:
      'Think of the Input Gateway as an international airport terminal for information. Raw data arrives in many formats—spoken words, typed questions, or camera photos—and gets checked, cleaned, and tagged so the rest of the city can understand it.',
    technicalTerm: {
      term: 'Ingestion & Normalization',
      definition:
        'Converting raw inputs (like differently sized images or messy text) into clean, standardized digital formats ready for processing.',
    },
    exampleInput: 'User prompt: "Identify the bird in this photo and explain its habitat" + 4K JPEG image',
    exampleOutput: 'Normalized UTF-8 text stream + 224×224 RGB pixel tensor packet',
    statusText: 'RECEIVING STREAMS',
    statusLevel: 'optimal',
    metrics: {
      throughput: '14.2 GB/s',
      activeUnits: '64 Intake Gates',
      utilization: 78,
    },
    position: [-10, 0, 8],
    footprint: [4.8, 4.8],
    accentColor: '#00F0FF',
    secondaryColor: '#38BDF8',
    connectsTo: ['data-lake'],
    receivesFrom: [],
  },
  {
    id: 'data-lake',
    name: 'Data Lake',
    shortName: 'Data Lake',
    pipelineStage: 'data-lake',
    category: 'data',
    tagline: 'Stores and organizes incoming data.',
    shortDescription: 'Stores, indexes, and organizes incoming data into structured reservoirs.',
    roleInPipeline:
      'Catalogs raw inputs into high-speed reservoirs, removes duplicates, balances datasets, and routes visual data to Computer Vision and text data to the NLP District.',
    plainLanguageExplanation:
      'The Data Lake is a massive automated library and water treatment plant combined. It stores billions of examples, filters out noise or broken data, and organizes everything neatly on digital shelves so specialized districts can fetch what they need in milliseconds.',
    technicalTerm: {
      term: 'Vector Indexing & Sharding',
      definition:
        'Organizing massive datasets into searchable mathematical catalogs and splitting them across many storage tanks for instant retrieval.',
    },
    exampleInput: 'Unorganized stream of millions of images, articles, and user queries',
    exampleOutput: 'Curated, deduplicated training batches & indexed modality streams',
    statusText: 'INDEXING ACTIVE',
    statusLevel: 'optimal',
    metrics: {
      throughput: '28.6 GB/s',
      activeUnits: '128 Storage Silos',
      utilization: 84,
    },
    position: [-8, 0, -2],
    footprint: [5.2, 5.2],
    accentColor: '#00F0FF',
    secondaryColor: '#0EA5E9',
    connectsTo: ['computer-vision', 'nlp-district', 'training-cluster'],
    receivesFrom: ['input-gateway'],
  },
  {
    id: 'computer-vision',
    name: 'Computer Vision District',
    shortName: 'Vision (CV)',
    pipelineStage: 'training',
    category: 'modality',
    tagline: 'Analyzes visual information.',
    shortDescription: 'Extracts edges, shapes, objects, and spatial context from images and video.',
    roleInPipeline:
      'Breaks visual data into pixel grids and passes them through layered optical filters to detect edges, textures, objects, and scenes before feeding visual embeddings to the Training Cluster and Model Core.',
    plainLanguageExplanation:
      'This district works like the human visual cortex. Instead of seeing a photo all at once, its scanner towers first spot simple lines and colors, then combine them into shapes like feathers or beaks, and finally recognize complete objects.',
    technicalTerm: {
      term: 'Convolutional Feature Maps',
      definition:
        'Layered visual filters that scan across an image to highlight important patterns like edges, textures, and recognizable objects.',
    },
    exampleInput: '224×224 RGB image matrix of a perched kingfisher bird',
    exampleOutput: 'Spatial feature map: [Beak: 0.98, Cyan Plumage: 0.96, Branch: 0.91]',
    statusText: 'SCANNING FRAMES',
    statusLevel: 'active',
    metrics: {
      throughput: '9,400 FPS',
      activeUnits: '96 Optical Arrays',
      utilization: 72,
    },
    position: [-2.5, 0, -9.5],
    footprint: [4.8, 4.8],
    accentColor: '#38BDF8',
    secondaryColor: '#8B5CF6',
    connectsTo: ['training-cluster', 'model-core'],
    receivesFrom: ['data-lake'],
  },
  {
    id: 'nlp-district',
    name: 'NLP District',
    shortName: 'NLP District',
    pipelineStage: 'training',
    category: 'modality',
    tagline: 'Processes language and text.',
    shortDescription: 'Splits language into tokens and maps meaning, grammar, and context.',
    roleInPipeline:
      'Transforms human language into numerical token embeddings and calculates attention relationships between words so the system understands nuance, intent, and context.',
    plainLanguageExplanation:
      'Computers cannot read words directly—they only understand numbers. The NLP (Natural Language Processing) District chops sentences into word pieces called "tokens" and gives each piece coordinates on a map of meaning, placing related words like "bird" and "habitat" close together.',
    technicalTerm: {
      term: 'Tokenization & Embeddings',
      definition:
        'Breaking text into small word fragments (tokens) and converting each fragment into a list of numbers that captures its meaning.',
    },
    exampleInput: 'Raw text: "Identify the bird in this photo and explain its habitat"',
    exampleOutput: 'Token sequence [1402, 279, 7194, ...] + 4096-dim semantic vectors',
    statusText: 'PARSING TOKENS',
    statusLevel: 'active',
    metrics: {
      throughput: '1.8M tok/s',
      activeUnits: '112 Transformer Spires',
      utilization: 81,
    },
    position: [-1.5, 0, 9.5],
    footprint: [4.8, 4.8],
    accentColor: '#38BDF8',
    secondaryColor: '#A855F7',
    connectsTo: ['training-cluster', 'model-core'],
    receivesFrom: ['data-lake'],
  },
  {
    id: 'training-cluster',
    name: 'Training Cluster',
    shortName: 'Training',
    pipelineStage: 'training',
    category: 'compute',
    tagline: 'A group of GPU towers that train AI models.',
    shortDescription: 'High-density GPU towers running parallel matrix math to teach the model.',
    roleInPipeline:
      'Runs trillions of parallel calculations across synchronized GPU towers, comparing predictions against ground-truth data and adjusting neural weights via backpropagation.',
    plainLanguageExplanation:
      'The Training Cluster is the city’s powerhouse gymnasium. Thousands of specialized graphics processors (GPUs) work side by side, practicing on millions of examples. Every time the AI makes a mistake during practice, this cluster sends a correction signal to tune the brain.',
    technicalTerm: {
      term: 'Backpropagation & Gradient Descent',
      definition:
        'The learning loop where the system measures how wrong a guess was and slightly adjusts billions of internal dials (weights) to be more accurate next time.',
    },
    exampleInput: 'Batched feature vectors + ground-truth labels (Loss: 0.412)',
    exampleOutput: 'Updated neural weight gradients (Loss reduced to 0.038)',
    statusText: 'GPU CLUSTER ACTIVE',
    statusLevel: 'high-load',
    metrics: {
      throughput: '420 PFLOPS',
      activeUnits: '512 H100 Tensor Nodes',
      utilization: 94,
    },
    position: [5.5, 0, -8.5],
    footprint: [5.4, 5.0],
    accentColor: '#8B5CF6',
    secondaryColor: '#EC4899',
    connectsTo: ['model-core'],
    receivesFrom: ['data-lake', 'computer-vision', 'nlp-district'],
  },
  {
    id: 'model-core',
    name: 'Model Core',
    shortName: 'Model Core',
    pipelineStage: 'model-core',
    category: 'neural',
    tagline: 'The central neural network that connects the system.',
    shortDescription: 'The central multi-layered neural network connecting every specialized district.',
    roleInPipeline:
      'Houses the unified foundation model—billions of learned parameters arranged in deep attention layers that fuse vision, language, and reasoning into coherent intelligence.',
    plainLanguageExplanation:
      'At the heart of the city sits the Model Core: a glowing, interconnected web of digital neurons. It combines what the Vision District sees with what the NLP District reads, drawing on knowledge learned in the Training Cluster to reason through complex problems.',
    technicalTerm: {
      term: 'Multi-Head Self-Attention Network',
      definition:
        'A neural architecture that connects different pieces of information simultaneously—linking a word in a question to a specific region of an image.',
    },
    exampleInput: 'Fused visual embeddings + text tokens + trained parameter weights',
    exampleOutput: 'Contextualized latent representation & reasoning graph',
    statusText: 'SYNAPSES SYNCHRONIZED',
    statusLevel: 'optimal',
    metrics: {
      throughput: '175B Params',
      activeUnits: '96 Deep Attention Layers',
      utilization: 88,
    },
    position: [0.5, 0, 0],
    footprint: [6.0, 6.0],
    accentColor: '#EC4899',
    secondaryColor: '#8B5CF6',
    connectsTo: ['inference-center'],
    receivesFrom: ['training-cluster', 'computer-vision', 'nlp-district'],
  },
  {
    id: 'inference-center',
    name: 'Inference Center',
    shortName: 'Inference',
    pipelineStage: 'inference',
    category: 'neural',
    tagline: 'Runs a trained model to produce a prediction or response.',
    shortDescription: 'Executes the trained neural model at ultra-low latency to generate answers.',
    roleInPipeline:
      'Takes the active representation from the Model Core and runs fast forward-pass decoding to predict the most accurate classification, action, or next-token sequence.',
    plainLanguageExplanation:
      'While Training is like studying for an exam, Inference is taking the test in real time. Once the Model Core understands your request, the Inference Center rapidly calculates probabilities and selects the best words or predictions in milliseconds.',
    technicalTerm: {
      term: 'Autoregressive Decoding & KV Cache',
      definition:
        'Generating a response one word or prediction at a time by calculating probabilities and caching recent steps for near-instant speed.',
    },
    exampleInput: 'Latent reasoning state from Model Core',
    exampleOutput: 'Ranked prediction: "Common Kingfisher (Alcedo atthis) — 99.2% confidence" + habitat synthesis',
    statusText: 'LOW-LATENCY SERVING',
    statusLevel: 'optimal',
    metrics: {
      throughput: '11.4 ms/tok',
      activeUnits: '144 Inference Pods',
      utilization: 76,
    },
    position: [8.5, 0, -1],
    footprint: [4.8, 4.8],
    accentColor: '#8B5CF6',
    secondaryColor: '#00F0FF',
    connectsTo: ['output-terminal'],
    receivesFrom: ['model-core'],
  },
  {
    id: 'output-terminal',
    name: 'Output Terminal',
    shortName: 'Output',
    pipelineStage: 'output',
    category: 'output',
    tagline: 'Displays the result to the user.',
    shortDescription: 'Formats, verifies safety, and streams the final AI response back to the user.',
    roleInPipeline:
      'Applies final safety guardrails, formats raw probabilities into human-friendly text, visuals, or API payloads, and broadcasts the completed answer to the user interface.',
    plainLanguageExplanation:
      'The Output Terminal is the broadcast tower that translates the AI’s mathematical conclusions back into clear human language, annotated images, or interactive answers you can read on your screen.',
    technicalTerm: {
      term: 'Detokenization & Response Streaming',
      definition:
        'Converting numerical token IDs back into readable text and streaming them smoothly to the user interface as they are generated.',
    },
    exampleInput: 'Decoded token stream + confidence telemetry from Inference Center',
    exampleOutput: 'Formatted UI response: "This is a Common Kingfisher, found near calm rivers and wetlands..."',
    statusText: 'BROADCASTING RESULT',
    statusLevel: 'optimal',
    metrics: {
      throughput: '99.98% Uptime',
      activeUnits: '48 Dispatch Channels',
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
    label: 'Raw Data Stream',
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
    label: 'Image & Video Tensors',
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
    label: 'Text Corpus Stream',
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
    label: 'Training Batches',
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
    label: 'Visual Feature Maps',
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
    label: 'Spatial Embeddings',
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
    label: 'Token Vectors',
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
    label: 'Semantic Attention Vectors',
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
    label: 'Updated Neural Weights',
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
    label: 'Trained Model State',
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
    label: 'Generated Prediction',
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
    label: 'Input',
    districtId: 'input-gateway',
    title: '1. Input Gateway — Data Arrives',
    summary: 'Raw prompts, images, or video streams enter the system and are cleaned into standard formats.',
    plainExplanation:
      'Every AI interaction starts with raw information from the outside world—a typed question, a photo, or a voice clip. The Input Gateway checks the data, cleans out formatting errors, and converts it into digital packets.',
    keyConcept: 'Data Normalization',
    keyConceptDefinition: 'Making sure all incoming text and images follow a uniform size and format before processing.',
  },
  {
    id: 'data-lake',
    stepNumber: 2,
    label: 'Data Lake',
    districtId: 'data-lake',
    relatedDistrictIds: ['computer-vision', 'nlp-district'],
    title: '2. Data Lake & Modality Routing — Organize & Specialize',
    summary: 'Incoming data is cataloged in the Data Lake and routed to Computer Vision (images) or NLP (text).',
    plainExplanation:
      'Once inside the city, data is stored and organized in the Data Lake. From here, visual information flows to the Computer Vision District to detect shapes and objects, while text flows to the NLP District to be broken into meaningful word tokens.',
    keyConcept: 'Feature Extraction & Tokenization',
    keyConceptDefinition:
      'Turning raw pixels into visual patterns (Computer Vision) and splitting sentences into numerical word pieces (NLP).',
  },
  {
    id: 'training',
    stepNumber: 3,
    label: 'Training',
    districtId: 'training-cluster',
    relatedDistrictIds: ['computer-vision', 'nlp-district'],
    title: '3. Training Cluster — Learning Patterns',
    summary: 'Towering GPU clusters run billions of calculations to learn patterns from organized data.',
    plainExplanation:
      'In the Training Cluster, synchronized GPU towers practice on millions of examples from the Data Lake, Vision, and NLP districts. By repeatedly guessing and correcting mistakes, the cluster discovers deep patterns and tunes the AI’s internal parameters.',
    keyConcept: 'Neural Weight Optimization',
    keyConceptDefinition:
      'Adjusting billions of mathematical connections inside the model so its predictions become more accurate over time.',
  },
  {
    id: 'model-core',
    stepNumber: 4,
    label: 'Model Core',
    districtId: 'model-core',
    title: '4. Model Core — The Central Neural Network',
    summary: 'The central neural network fuses knowledge from all districts into unified intelligence.',
    plainExplanation:
      'The Model Core is the city’s central brain. It holds the trained neural network—layers of interconnected nodes that combine visual understanding, language context, and learned reasoning into a single unified representation.',
    keyConcept: 'Deep Neural Architecture',
    keyConceptDefinition:
      'Layers of connected artificial neurons that weigh relationships between words, images, and concepts simultaneously.',
  },
  {
    id: 'inference',
    stepNumber: 5,
    label: 'Inference',
    districtId: 'inference-center',
    title: '5. Inference Center — Running the Model Live',
    summary: 'The Inference Center runs the trained model at high speed to generate a prediction or answer.',
    plainExplanation:
      'When you ask a live question, the system doesn’t need to retrain from scratch. Instead, the Inference Center uses the Model Core’s learned knowledge to rapidly calculate probabilities and produce the best answer in milliseconds.',
    keyConcept: 'Real-Time Forward Pass',
    keyConceptDefinition:
      'Passing new input through a trained model to compute an immediate prediction or response without changing the model weights.',
  },
  {
    id: 'output',
    stepNumber: 6,
    label: 'Output',
    districtId: 'output-terminal',
    title: '6. Output Terminal — Delivering the Result',
    summary: 'Mathematical predictions are translated back into clear human language or visual results.',
    plainExplanation:
      'Finally, the Output Terminal takes the numbers and probabilities produced by the Inference Center, checks them for clarity and safety, and displays the finished answer, image tag, or recommendation to the user.',
    keyConcept: 'Response Synthesis',
    keyConceptDefinition:
      'Translating internal model probabilities back into readable sentences, visual labels, or structured actions.',
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
    badge: 'Multimodal',
    samplePrompt: 'Image: kingfisher.jpg + "Identify species & river habitat"',
    sampleOutput: 'Common Kingfisher (Alcedo atthis) — 99.2% confidence. Inhabits slow-flowing clear rivers.',
  },
  {
    id: 'nlp-reasoning',
    name: 'NLP: Quantum Code Synthesis',
    badge: 'Language',
    samplePrompt: 'Prompt: "Write an optimized CUDA kernel for matrix attention"',
    sampleOutput: 'Generated flash_attention_kernel.cu (1.42x speedup verified across 512 tensor nodes).',
  },
  {
    id: 'cv-autonomous',
    name: 'Vision: Autonomous Lidar Scan',
    badge: 'Computer Vision',
    sampleOutput: '3D Bounding Boxes: [Pedestrian: 14.2m, Cyclist: 8.6m] — Safe Trajectory Locked.',
    samplePrompt: 'Stream: 60FPS stereo camera + point-cloud frame #4092',
  },
];

export const DEMO_JOURNEY_STEPS: DemoJourneyStep[] = [
  {
    stepIndex: 0,
    districtId: 'input-gateway',
    activePathIds: ['path-input-datalake'],
    headline: 'Step 1/7 · Packet Arrives at Input Gateway',
    narration: 'A multimodal user request (photo + question) enters the Input Gateway and is normalized into clean tensor packets.',
    packetSample: 'PACKET #8492-A: { image: "kingfisher.jpg", prompt: "Identify species & habitat" }',
    durationMs: 3600,
  },
  {
    stepIndex: 1,
    districtId: 'data-lake',
    activePathIds: ['path-input-datalake', 'path-datalake-cv', 'path-datalake-nlp'],
    headline: 'Step 2/7 · Indexed & Routed in Data Lake',
    narration: 'The Data Lake logs the request, indexes the payload, and splits visual pixels to Computer Vision and text to NLP.',
    packetSample: 'INDEX_KEY: sha256:9f82a... → Route[CV_STREAM, NLP_STREAM]',
    durationMs: 3600,
  },
  {
    stepIndex: 2,
    districtId: 'computer-vision',
    activePathIds: ['path-datalake-cv', 'path-cv-core', 'path-cv-training'],
    headline: 'Step 3/7 · Visual Feature Extraction in CV District',
    narration: 'Optical convolutional filters scan the image, detecting cyan plumage, beak geometry, and river branch textures.',
    packetSample: 'VISION_FEATURES: [plumage_cyan: 0.98, beak_long: 0.95, water_bg: 0.89]',
    durationMs: 3600,
  },
  {
    stepIndex: 3,
    districtId: 'nlp-district',
    activePathIds: ['path-datalake-nlp', 'path-nlp-core', 'path-nlp-training'],
    headline: 'Step 4/7 · Semantic Tokenization in NLP District',
    narration: 'The NLP District converts the question into token embeddings so the network understands intent ("identify" + "habitat").',
    packetSample: 'TOKENS: ["Identify", "species", "&", "habitat"] → Embedding[4096-d]',
    durationMs: 3600,
  },
  {
    stepIndex: 4,
    districtId: 'training-cluster',
    activePathIds: ['path-datalake-training', 'path-cv-training', 'path-nlp-training', 'path-training-core'],
    headline: 'Step 5/7 · Weight Calibration in Training Cluster',
    narration: 'GPU towers verify feature alignment against millions of learned ornithology and ecology representations.',
    packetSample: 'TENSOR_SYNC: 512 GPUs · Gradient Check OK · Knowledge Weights Locked',
    durationMs: 3600,
  },
  {
    stepIndex: 5,
    districtId: 'model-core',
    activePathIds: ['path-cv-core', 'path-nlp-core', 'path-training-core', 'path-core-inference'],
    headline: 'Step 6/7 · Cross-Modal Fusion in Model Core',
    narration: 'Deep attention layers inside the central Model Core connect the visual features with semantic knowledge.',
    packetSample: 'ATTENTION_FUSION: Vision×Language Cross-Attention Score = 0.994',
    durationMs: 3800,
  },
  {
    stepIndex: 6,
    districtId: 'inference-center',
    activePathIds: ['path-core-inference', 'path-inference-output'],
    headline: 'Step 7/7 · Real-Time Decoding to Output Terminal',
    narration: 'Inference Center generates the response in 11.4ms/token and streams the verified answer to the Output Terminal!',
    packetSample: 'OUTPUT: "Common Kingfisher (Alcedo atthis) — 99.2% match. Inhabits slow-flowing rivers..."',
    durationMs: 4200,
  },
];
