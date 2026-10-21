import type { DistrictId } from './districts';
import type { DistrictDeepDive } from '../types/district-roadmap';

export const DISTRICT_ROADMAPS: DistrictDeepDive[] = [
  {
    districtId: 'input-gateway',
    districtCode: 'DIST-01',
    districtName: 'Input Gateway',
    pipelineStageName: 'Ingestion, Multimodal Parsing & Tokenization',
    accentColorHex: '#00F0FF',
    tagline:
      'From raw character streams and pixel tensors to unified multimodal token representations at high ingress throughput.',
    roadmap: [
      {
        id: 'd1-level-1',
        levelId: 'level-1',
        tierLabel: '01 · Foundations (Zero)',
        title: 'Signal Normalization, Tensor Encoding & Lexical Tokenization',
        summary:
          'Master raw data hygiene across modalities: Unicode normalization (NFC/NFKC), regex sanitization, digital audio sampling rates, image tensor layouts (H×W×C), and deterministic character/word-level tokenization.',
        coreConcepts: [
          'Unicode Normalization (NFC / NFKC)',
          'Regex Sanitization & PII Scrubbing',
          'Digital Signal Sampling (PCM / Nyquist)',
          'Image Tensor Representations (H×W×C)',
          'Character & Word-Level Tokenization',
        ],
        techStack: ['Python', 'NumPy', 'Pillow / OpenCV', 'unicodedata', 're'],
        capstoneDeliverable:
          'Build a clean text & image normalization CLI pipeline that converts arbitrary UTF-8 documents and multi-resolution images into standardized tensor batches.',
      },
      {
        id: 'd1-level-2',
        levelId: 'level-2',
        tierLabel: '02 · Core Engineering',
        title: 'Subword Tokenizers, ViT Patchification & Spectral Features',
        summary:
          'Implement modern subword compression and multimodal encoding pipelines that bridge human inputs and transformer embedding tables without out-of-vocabulary degradation.',
        coreConcepts: [
          'Byte-Pair Encoding (BPE) & WordPiece',
          'Unigram Language Model & SentencePiece',
          'Byte-level BPE (Tiktoken)',
          'Visual Patch Embeddings (ViT Patchification)',
          'Audio Log-Mel Spectrogram Conversion',
        ],
        techStack: [
          'Tiktoken',
          'SentencePiece',
          'HuggingFace Tokenizers (Rust)',
          'TorchAudio',
          'TorchVision',
        ],
        capstoneDeliverable:
          'Train a custom BPE tokenizer from scratch on multilingual + code corpora and visualize token compression ratios across domains.',
      },
      {
        id: 'd1-level-3',
        levelId: 'level-3',
        tierLabel: '03 · Production & Scale',
        title: 'High-Throughput Async Ingestion & Multimodal Document Parsing',
        summary:
          'Architect resilient ingress gateways capable of parsing complex PDFs, layout-heavy tables, and concurrent media streams with strict schema validation and backpressure control.',
        coreConcepts: [
          'Asynchronous Ingress & Backpressure',
          'Streaming Multimodal Document Parsing (OCR & Layout)',
          'Strict Payload Schema Validation',
          'Dynamic Ingress Batching',
          'Event-Driven Ingestion Queues',
        ],
        techStack: [
          'FastAPI',
          'gRPC / Protobuf',
          'Apache Kafka',
          'Pydantic v2',
          'Unstructured / Docling',
        ],
        capstoneDeliverable:
          'Deploy an async multimodal ingestion microservice handling 1,000+ req/sec with gRPC streaming, Pydantic validation, and Kafka backpressure.',
      },
      {
        id: 'd1-level-4',
        levelId: 'level-4',
        tierLabel: '04 · Frontier & SOTA (Hero)',
        title: 'Native Early-Fusion Multimodal Tokens & Byte-Level Architectures',
        summary:
          'Eliminate modality silos using discrete vector-quantized visual/audio codebooks, native aspect-ratio patch packing, and tokenizer-free byte-latent transformers.',
        coreConcepts: [
          'Discrete Visual/Audio Tokens (VQ-VAE / VQGAN)',
          'Native Resolution Patch Packing (NaViT)',
          'Early-Fusion Interleaved Multimodal Streams',
          'Byte-Latent Tokenizer-Free Architectures (BLT)',
          'Entropy-Guided Dynamic Patching',
        ],
        techStack: [
          'PyTorch',
          'VQGAN / SoundStream Codebooks',
          'NaViT Sequence Packing',
          'Meta BLT (Byte Latent Transformer)',
          'CUDA Custom Preprocessing',
        ],
        capstoneDeliverable:
          'Implement a unified multimodal token stream serializer for interleaved image-audio-text inputs using discrete VQ-VAE tokens and NaViT packing.',
      },
    ],
    landmarks: [
      {
        id: 'd1-lm-1',
        year: 2015,
        title: 'Neural Machine Translation of Rare Words with Subword Units (BPE)',
        authorsOrOrg: 'Rico Sennrich et al. · University of Edinburgh',
        category: 'Seminal Paper',
        keyContribution:
          'Adapted Byte-Pair Encoding data compression to open-vocabulary subword tokenization, eliminating the out-of-vocabulary word bottleneck in neural language models.',
        impactMetricOrNote:
          'Foundation of GPT-2/3/4, LLaMA, and modern LLM tokenizers.',
        url: 'https://arxiv.org/abs/1508.07909',
      },
      {
        id: 'd1-lm-2',
        year: 2018,
        title: 'SentencePiece: A simple and language independent subword tokenizer',
        authorsOrOrg: 'Taku Kudo & John Richardson · Google',
        category: 'Open-Source / System Milestone',
        keyContribution:
          'Treated raw input text as a lossless Unicode stream including whitespace (▁), enabling language-agnostic BPE and Unigram tokenization without pre-tokenization rules.',
        impactMetricOrNote:
          'Adopted across T5, LLaMA, Mistral, PaLM, and Gemma model families.',
        url: 'https://arxiv.org/abs/1808.06226',
      },
      {
        id: 'd1-lm-3',
        year: 2020,
        title: 'An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale (ViT)',
        authorsOrOrg: 'Alexey Dosovitskiy et al. · Google Brain',
        category: 'Architecture Breakthrough',
        keyContribution:
          'Demonstrated that splitting images into fixed-size 16×16 pixel patches and projecting them as linear tokens allows standard Transformers to outperform CNNs at scale.',
        impactMetricOrNote:
          'Unified visual and textual input representations for multimodal foundation models.',
        url: 'https://arxiv.org/abs/2010.11929',
      },
      {
        id: 'd1-lm-4',
        year: 2022,
        title: 'Robust Speech Recognition via Large-Scale Weak Supervision (Whisper)',
        authorsOrOrg: 'Alec Radford et al. · OpenAI',
        category: 'Architecture Breakthrough',
        keyContribution:
          'Trained an encoder-decoder Transformer on 680,000 hours of noisy multilingual audio spectrograms, achieving human-level zero-shot speech transcription and translation.',
        impactMetricOrNote:
          'Standardized 80-channel log-Mel spectrogram audio ingestion for multimodal AI.',
        url: 'https://arxiv.org/abs/2212.04356',
      },
    ],
  },
  {
    districtId: 'data-lake',
    districtCode: 'DIST-02',
    districtName: 'Data Lake & Vector Vault',
    pipelineStageName: 'Embeddings, Indexing & Hybrid Retrieval',
    accentColorHex: '#00F0FF',
    tagline:
      'High-dimensional vector geometry, approximate nearest neighbor graph indexing, and billion-scale hybrid lakehouse retrieval.',
    roadmap: [
      {
        id: 'd2-level-1',
        levelId: 'level-1',
        tierLabel: '01 · Foundations (Zero)',
        title: 'Vector Spaces, Distance Metrics & Semantic Chunking',
        summary:
          'Understand geometric similarity in high-dimensional spaces, structure-aware document chunking, and the trade-offs between relational, document, and vector storage.',
        coreConcepts: [
          'Cosine Similarity, Euclidean L2 & Inner Product',
          'Curse of Dimensionality & Vector Normalization',
          'Fixed, Recursive & Semantic Document Chunking',
          'Relational vs. Unstructured Blob Storage',
          'Exact k-Nearest Neighbors (Flat Indexing)',
        ],
        techStack: ['Python', 'NumPy', 'SciPy', 'SQLite', 'Markdown / AST Chunkers'],
        capstoneDeliverable:
          'Build an in-memory semantic search engine using pure NumPy and exact k-NN with configurable Cosine, L2, and Dot-Product metrics.',
      },
      {
        id: 'd2-level-2',
        levelId: 'level-2',
        tierLabel: '02 · Core Engineering',
        title: 'Dense Multimodal Embeddings & ANN Graph/Quantized Indexes',
        summary:
          'Master dense bi-encoder representations and sub-linear Approximate Nearest Neighbor (ANN) data structures for low-latency retrieval.',
        coreConcepts: [
          'Dense Text & Multimodal Embeddings (CLIP, SigLIP, BGE, E5)',
          'Hierarchical Navigable Small World (HNSW) Graphs',
          'Inverted File & Product Quantization (IVF-PQ, ScaNN)',
          'Recall@K vs. Query-Per-Second (QPS) Trade-offs',
          'Transactional Vector Storage in PostgreSQL',
        ],
        techStack: [
          'FAISS',
          'PostgreSQL + pgvector',
          'Sentence-Transformers',
          'OpenCLIP / SigLIP',
          'HNSWlib',
        ],
        capstoneDeliverable:
          'Index 100k multimodal text+image items in FAISS and pgvector with <15ms p99 query latency and >95% Recall@10.',
      },
      {
        id: 'd2-level-3',
        levelId: 'level-3',
        tierLabel: '03 · Production & Scale',
        title: 'Distributed Vector Databases, Hybrid RRF & Lakehouse Formats',
        summary:
          'Combine lexical BM25 precision with dense semantic recall across distributed shards, refined by two-stage cross-encoder reranking and columnar lakehouse storage.',
        coreConcepts: [
          'Distributed Vector Sharding & Replication',
          'Hybrid Search (BM25 Sparse + Dense Vector Fusion)',
          'Reciprocal Rank Fusion (RRF)',
          'Two-Stage Cross-Encoder Reranking',
          'Columnar AI Lakehouses (Parquet, LanceDB, Iceberg)',
        ],
        techStack: [
          'Qdrant / Milvus',
          'Elasticsearch',
          'LanceDB',
          'Apache Iceberg / Parquet',
          'BGE-Reranker / Cohere Rerank',
        ],
        capstoneDeliverable:
          'Architect an end-to-end Hybrid RAG retrieval pipeline combining BM25 + dense vectors via RRF and two-stage cross-encoder reranking.',
      },
      {
        id: 'd2-level-4',
        levelId: 'level-4',
        tierLabel: '04 · Frontier & SOTA (Hero)',
        title: 'Late-Interaction Multi-Vector Retrieval, GraphRAG & Binary Quantization',
        summary:
          'Push retrieval accuracy and compression to the frontier using token-level MaxSim late interaction, vision-language page embeddings, and community-summarized knowledge graphs.',
        coreConcepts: [
          'Late-Interaction Multi-Vector Retrieval (ColBERT MaxSim)',
          'Visual Document Retrieval without OCR (ColPali)',
          'GraphRAG (Entity Graph + Community Vector Synthesis)',
          'Binary & Scalar Vector Quantization (32x RAM Reduction)',
          'Matryoshka Representation Learning (MRL)',
        ],
        techStack: [
          'ColBERTv2 / RAGatouille',
          'ColPali',
          'Neo4j / Microsoft GraphRAG',
          'Qdrant Binary Quantization',
          'Vespa',
        ],
        capstoneDeliverable:
          'Implement a multimodal ColPali + GraphRAG retrieval engine over complex visual financial/scientific PDFs with binary quantization.',
      },
    ],
    landmarks: [
      {
        id: 'd2-lm-1',
        year: 2013,
        title: 'Efficient Estimation of Word Representations in Vector Space (Word2Vec)',
        authorsOrOrg: 'Tomas Mikolov et al. · Google',
        category: 'Seminal Paper',
        keyContribution:
          'Introduced continuous bag-of-words (CBOW) and Skip-gram architectures that embedded words into dense vector spaces where linear arithmetic captures semantic analogies.',
        impactMetricOrNote:
          'Ignited the modern dense embedding paradigm across NLP and information retrieval.',
        url: 'https://arxiv.org/abs/1301.3781',
      },
      {
        id: 'd2-lm-2',
        year: 2016,
        title: 'Efficient and Robust Approximate Nearest Neighbor Search Using HNSW Graphs',
        authorsOrOrg: 'Yu. A. Malkov & D. A. Yashunin',
        category: 'Architecture Breakthrough',
        keyContribution:
          'Constructed multi-layer navigable small-world proximity graphs with logarithmic search scaling, delivering unmatched recall-vs-latency performance for high-dimensional vectors.',
        impactMetricOrNote:
          'Default ANN index engine powering Qdrant, Milvus, pgvector, Weaviate, and Lucene.',
        url: 'https://arxiv.org/abs/1603.09320',
      },
      {
        id: 'd2-lm-3',
        year: 2017,
        title: 'Billion-scale similarity search with GPUs (FAISS)',
        authorsOrOrg: 'Jeff Johnson, Matthijs Douze & Hervé Jégou · FAIR (Meta AI)',
        category: 'Open-Source / System Milestone',
        keyContribution:
          'Engineered GPU-accelerated Product Quantization (IVF-PQ) and warp-level k-selection kernels capable of searching 1 billion vectors in milliseconds.',
        impactMetricOrNote:
          'Gold-standard C++/CUDA library for high-throughput vector indexing.',
        url: 'https://arxiv.org/abs/1702.08734',
      },
      {
        id: 'd2-lm-4',
        year: 2020,
        title: 'Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks (RAG)',
        authorsOrOrg: 'Patrick Lewis et al. · Meta AI / UCL',
        category: 'Seminal Paper',
        keyContribution:
          'Coupled a non-parametric dense vector index (DPR + FAISS) with a parametric seq2seq generator, grounding model outputs in verifiable external knowledge.',
        impactMetricOrNote:
          'Established RAG as the dominant enterprise architecture for factual AI systems.',
        url: 'https://arxiv.org/abs/2005.11401',
      },
      {
        id: 'd2-lm-5',
        year: 2021,
        title: 'Learning Transferable Visual Models From Natural Language Supervision (CLIP)',
        authorsOrOrg: 'Alec Radford et al. · OpenAI',
        category: 'Architecture Breakthrough',
        keyContribution:
          'Jointly trained image and text encoders via symmetric contrastive InfoNCE loss on 400M image-caption pairs, aligning vision and language into a shared vector vault.',
        impactMetricOrNote:
          'Enabled zero-shot cross-modal image-text retrieval and conditioned generative vision models.',
        url: 'https://arxiv.org/abs/2103.00020',
      },
    ],
  },
  {
    districtId: 'computer-vision',
    districtCode: 'DIST-03',
    districtName: 'Computer Vision District',
    pipelineStageName: 'Visual Perception, Multimodal Evaluation & Interpretability',
    accentColorHex: '#38BDF8',
    tagline:
      'Spatial feature extraction, multimodal safety guardrails, automated RAG/VLM evaluation, and mechanistic feature interpretability.',
    roadmap: [
      {
        id: 'd3-level-1',
        levelId: 'level-1',
        tierLabel: '01 · Foundations (Zero)',
        title: 'Convolutional Kernels, Spatial Feature Maps & Input/Output Validation',
        summary:
          'Master spatial filtering, receptive fields, residual feature hierarchies, deterministic payload validation, and PII/sensitive visual region redaction.',
        coreConcepts: [
          '2D Convolutions, Stride, Padding & Receptive Fields',
          'Spatial Feature Hierarchies & Residual Connections',
          'Input/Output Schema Guardrails & Visual PII Redaction',
          'Classical Perception & NLP Metrics (IoU, mAP, BLEU, ROUGE)',
          'Data Augmentation (RandAugment, MixUp, CutMix)',
        ],
        techStack: ['PyTorch', 'TorchVision', 'OpenCV', 'Pydantic Guardrails', 'Microsoft Presidio'],
        capstoneDeliverable:
          'Build a real-time visual & text PII redaction and JSON-schema guardrail middleware with CNN spatial feature visualization.',
      },
      {
        id: 'd3-level-2',
        levelId: 'level-2',
        tierLabel: '02 · Core Engineering',
        title: 'Vision Transformers, Open-Vocabulary Detection & RAGAS Evaluation',
        summary:
          'Combine self-attention visual backbones with reference-free evaluation frameworks (RAGAS) and LLM/VLM-as-a-Judge rubrics to quantify faithfulness and grounding.',
        coreConcepts: [
          'Vision Transformers (ViT, Swin) & Self-Supervised DINOv2',
          'Promptable Segmentation (SAM) & Open-Vocabulary Detection',
          'RAGAS Framework (Faithfulness, Answer Relevance, Context Precision)',
          'LLM/VLM-as-a-Judge Rubrics & NLI Hallucination Detection',
          'Visual Grounding & Bounding-Box Verification',
        ],
        techStack: [
          'timm (PyTorch Image Models)',
          'Segment Anything (SAM 2)',
          'RAGAS',
          'DeepEval',
          'HuggingFace Transformers',
        ],
        capstoneDeliverable:
          'Create an automated CI evaluation suite using RAGAS and VLM grounding checks on a golden multimodal test dataset.',
      },
      {
        id: 'd3-level-3',
        levelId: 'level-3',
        tierLabel: '03 · Production & Scale',
        title: 'Adversarial Red-Teaming, Multimodal Jailbreak Defenses & Constitutional AI',
        summary:
          'Harden vision and language pipelines against adversarial patches, typographic prompt injections, and unsafe generations using low-latency safety classifiers.',
        coreConcepts: [
          'Adversarial Red-Teaming & Visual Typographic Attacks',
          'Direct & Indirect Prompt Injection Defenses',
          'Multimodal Safety Classifiers (Llama Guard Vision)',
          'Constitutional AI Policy Enforcement at Low Latency',
          'High-Throughput Video & Frame-Stream Batching',
        ],
        techStack: [
          'Llama Guard 3 Vision',
          'NeMo Guardrails',
          'PyTorch Red-Teaming Toolkit',
          'NVIDIA DALI',
          'Triton Vision Ensemble',
        ],
        capstoneDeliverable:
          'Deploy a dual-layer multimodal input/output guardrail proxy defending against indirect prompt injections and adversarial image patches.',
      },
      {
        id: 'd3-level-4',
        levelId: 'level-4',
        tierLabel: '04 · Frontier & SOTA (Hero)',
        title: 'Mechanistic Interpretability (Sparse Autoencoders), Diffusion Transformers & SynthID',
        summary:
          'Look inside neural activations using Sparse Autoencoders (SAEs) to extract monosemantic features, steer model behavior, and verify media provenance with cryptographic watermarks.',
        coreConcepts: [
          'Mechanistic Interpretability & Polysemantic Disentanglement',
          'Sparse Autoencoders (SAEs) & Activation Steering',
          'Diffusion Transformers (DiT) & Flow Matching',
          'Formal Verification of Multimodal Agent Actions',
          'Cryptographic Provenance Watermarking (SynthID / C2PA)',
        ],
        techStack: [
          'TransformerLens / SAELens',
          'Diffusers (DiT / Flux)',
          'SynthID Watermarking',
          'C2PA Content Credentials',
          'PyTorch Hooks & Steering Vectors',
        ],
        capstoneDeliverable:
          'Inspect and steer internal model representations using Sparse Autoencoder (SAE) feature activations with cryptographic output watermarking.',
      },
    ],
    landmarks: [
      {
        id: 'd3-lm-1',
        year: 2015,
        title: 'Deep Residual Learning for Image Recognition (ResNet)',
        authorsOrOrg: 'Kaiming He et al. · Microsoft Research',
        category: 'Seminal Paper',
        keyContribution:
          'Introduced skip/residual connections (y = F(x) + x) that solved vanishing gradients in deep networks, enabling 152-layer visual backbones and modern Transformer residual streams.',
        impactMetricOrNote:
          'Won ILSVRC 2015 with 3.57% top-5 error; most cited paper in modern AI.',
        url: 'https://arxiv.org/abs/1512.03385',
      },
      {
        id: 'd3-lm-2',
        year: 2022,
        title: 'Training language models to follow instructions with human feedback (InstructGPT)',
        authorsOrOrg: 'Long Ouyang et al. · OpenAI',
        category: 'Seminal Paper',
        keyContribution:
          'Demonstrated that Supervised Fine-Tuning (SFT) plus Reinforcement Learning from Human Feedback (RLHF) aligns model outputs with human intent and safety constraints.',
        impactMetricOrNote:
          '1.3B aligned InstructGPT outperformed 175B unaligned GPT-3 on human preference evaluations.',
        url: 'https://arxiv.org/abs/2203.02155',
      },
      {
        id: 'd3-lm-3',
        year: 2022,
        title: 'Constitutional AI: Harmlessness from AI Feedback (RLAIF)',
        authorsOrOrg: 'Yuntao Bai et al. · Anthropic',
        category: 'Architecture Breakthrough',
        keyContribution:
          'Replaced human harmlessness labels with self-critique and revision guided by an explicit written constitution, scaling alignment via AI feedback.',
        impactMetricOrNote:
          'Pioneered Pareto-improvements in helpfulness and harmlessness without evasive refusals.',
        url: 'https://arxiv.org/abs/2212.08073',
      },
      {
        id: 'd3-lm-4',
        year: 2023,
        title: 'RAGAS: Automated Evaluation of Retrieval Augmented Generation',
        authorsOrOrg: 'Shahul Es et al. · ExplodingGradients / Cardiff University',
        category: 'Open-Source / System Milestone',
        keyContribution:
          'Formulated reference-free evaluation metrics (Faithfulness, Answer Relevance, Context Precision) to systematically detect hallucinations in RAG pipelines.',
        impactMetricOrNote:
          'Standard open-source evaluation benchmark integrated across Langfuse, Arize, and CI pipelines.',
        url: 'https://arxiv.org/abs/2309.15217',
      },
      {
        id: 'd3-lm-5',
        year: 2024,
        title: 'Scaling Monosemanticity: Extracting Interpretable Features from Claude 3 Sonnet',
        authorsOrOrg: 'Adly Templeton et al. · Anthropic',
        category: 'Architecture Breakthrough',
        keyContribution:
          'Scaled Sparse Autoencoders (SAEs) to a frontier production model, uncovering millions of monosemantic features across language, code, and images that can be causally steered.',
        impactMetricOrNote:
          'Landmark breakthrough in mechanistic interpretability and internal safety auditing.',
        url: 'https://transformer-circuits.pub/2024/scaling-monosemanticity/',
      },
    ],
  },
  {
    districtId: 'nlp-district',
    districtCode: 'DIST-04',
    districtName: 'NLP & Agentic Orchestration District',
    pipelineStageName: 'Language Reasoning, Tool Use, Memory & Protocols',
    accentColorHex: '#38BDF8',
    tagline:
      'From contextual language representations and structured outputs to stateful cyclic agent graphs, MCP tool protocols, and multi-agent swarms.',
    roadmap: [
      {
        id: 'd4-level-1',
        levelId: 'level-1',
        tierLabel: '01 · Foundations (Zero)',
        title: 'In-Context Learning, Structured Outputs & Chain-of-Thought Reasoning',
        summary:
          'Master contextual language prompting, deterministic JSON Schema / Context-Free Grammar (CFG) constrained decoding, and step-by-step Chain-of-Thought decomposition.',
        coreConcepts: [
          'Zero-Shot & Few-Shot In-Context Learning',
          'System Prompt Architecture & Instruction Hierarchy',
          'Deterministic Structured Outputs (JSON Schema / CFG)',
          'Chain-of-Thought (CoT) & Self-Consistency Reasoning',
          'Contextual Token Embeddings & Semantic Attention',
        ],
        techStack: [
          'TypeScript / Python',
          'Pydantic / Zod',
          'Outlines / Instructor',
          'OpenAI / Anthropic Structured Outputs',
          'HuggingFace Transformers',
        ],
        capstoneDeliverable:
          'Build a schema-enforced structured extraction and Chain-of-Thought reasoning pipeline with 100% valid JSON grammar guarantees.',
      },
      {
        id: 'd4-level-2',
        levelId: 'level-2',
        tierLabel: '02 · Core Engineering',
        title: 'ReAct Loops, Function Calling, Agent Memory & Model Context Protocol (MCP)',
        summary:
          'Connect language models to deterministic external tools, databases, and multi-tiered memory stores using standardized tool-calling interfaces and MCP servers.',
        coreConcepts: [
          'ReAct (Reason + Act) Execution Loops',
          'Deterministic Function & Tool Calling',
          'Working, Episodic & Semantic Long-Term Memory',
          'Model Context Protocol (MCP) Server & Client Architecture',
          'Tool Result Grounding & Error Formatting',
        ],
        techStack: [
          'Model Context Protocol (MCP SDK)',
          'TypeScript / FastMCP',
          'PostgreSQL + pgvector Memory',
          'Redis Session Store',
          'OpenAPI Tool Schemas',
        ],
        capstoneDeliverable:
          'Build a custom Model Context Protocol (MCP) Server exposing database query, file-system, and search tools to an autonomous ReAct AI Agent.',
      },
      {
        id: 'd4-level-3',
        levelId: 'level-3',
        tierLabel: '03 · Production & Scale',
        title: 'Stateful Cyclic Agent Graphs, Sandboxed Execution & Self-Correction',
        summary:
          'Move beyond brittle linear chains to persisted state machines with human-in-the-loop approval gates, isolated code sandboxes, and compiler-driven self-healing loops.',
        coreConcepts: [
          'Stateful Cyclic Agent Graphs & Checkpointing',
          'Human-in-the-Loop (HITL) Interrupts & Time-Travel Debugging',
          'Isolated Code Execution Sandboxes (MicroVMs / Containers)',
          'Compiler/Test-Driven Error Self-Correction Loops',
          'Token Budget & Context Window Compaction',
        ],
        techStack: [
          'LangGraph',
          'Docker Micro-Sandboxes / E2B',
          'Temporal / Durable Execution',
          'Postgres Checkpointer',
          'AST Code Analysis',
        ],
        capstoneDeliverable:
          'Architect a stateful multi-step research & coding agent in LangGraph with sandboxed test execution and automated fault recovery.',
      },
      {
        id: 'd4-level-4',
        levelId: 'level-4',
        tierLabel: '04 · Frontier & SOTA (Hero)',
        title: 'Hierarchical Multi-Agent Swarms, Tree-of-Thoughts & MCTS Planning',
        summary:
          'Coordinate specialized autonomous agents with explicit supervisor routing, lookahead search over reasoning trees, and dynamic self-synthesized tool creation.',
        coreConcepts: [
          'Hierarchical Multi-Agent Swarms & Supervisor Routing',
          'Tree-of-Thoughts (ToT) & Monte Carlo Tree Search (MCTS) Planning',
          'Process Reward Models (PRMs) & Step-Level Verification',
          'Autonomous Self-Improving Tool Synthesis',
          'Shared Epistemic State & Conflict Resolution',
        ],
        techStack: [
          'LangGraph Multi-Agent / CrewAI',
          'MCTS Reasoning Planners',
          'Process Reward Verifiers',
          'gRPC Agent Mesh',
          'Git Worktree Isolation',
        ],
        capstoneDeliverable:
          'Build a multi-agent orchestration system with supervisor routing, parallel worker verification, and Tree-of-Thoughts lookahead planning.',
      },
    ],
    landmarks: [
      {
        id: 'd4-lm-1',
        year: 2022,
        title: 'Chain-of-Thought Prompting Elicits Reasoning in Large Language Models',
        authorsOrOrg: 'Jason Wei et al. · Google Brain',
        category: 'Seminal Paper',
        keyContribution:
          'Demonstrated that generating intermediate natural language reasoning steps dramatically unlocks multi-step arithmetic, commonsense, and symbolic reasoning in LLMs.',
        impactMetricOrNote:
          'Tripled GSM8K math accuracy on PaLM 540B and inspired modern reasoning models.',
        url: 'https://arxiv.org/abs/2201.11903',
      },
      {
        id: 'd4-lm-2',
        year: 2022,
        title: 'ReAct: Synergizing Reasoning and Acting in Language Models',
        authorsOrOrg: 'Shunyu Yao et al. · Princeton University & Google',
        category: 'Architecture Breakthrough',
        keyContribution:
          'Interleaved verbal reasoning traces (Thought) with external environment actions (Act) and observations (Obs), overcoming hallucination and error propagation.',
        impactMetricOrNote:
          'Foundational execution loop for virtually all modern tool-using AI agents.',
        url: 'https://arxiv.org/abs/2210.03629',
      },
      {
        id: 'd4-lm-3',
        year: 2023,
        title: 'Toolformer: Language Models Can Teach Themselves to Use Tools',
        authorsOrOrg: 'Timo Schick et al. · Meta AI',
        category: 'Seminal Paper',
        keyContribution:
          'Trained language models in a self-supervised manner to decide when and how to call external APIs (calculators, search engines, translators) and weave results into token generation.',
        impactMetricOrNote:
          'Catalyzed native function-calling training across frontier LLMs.',
        url: 'https://arxiv.org/abs/2302.04761',
      },
      {
        id: 'd4-lm-4',
        year: 2024,
        title: 'Model Context Protocol (MCP): Open Standard for Connecting AI Assistants to Data & Tools',
        authorsOrOrg: 'Anthropic & Open-Source Community',
        category: 'Open-Source / System Milestone',
        keyContribution:
          'Standardized a universal JSON-RPC client-server protocol for exposing resources, prompts, and executable tools to AI agents without bespoke N×M connectors.',
        impactMetricOrNote:
          'Rapidly adopted as the USB-C standard for agentic tool and context integration.',
        url: 'https://modelcontextprotocol.io',
      },
    ],
  },
  {
    districtId: 'training-cluster',
    districtCode: 'DIST-05',
    districtName: 'Training Cluster & Foundry',
    pipelineStageName: 'Optimization, Distributed Compute & Alignment',
    accentColorHex: '#8B5CF6',
    tagline:
      'Massive GPU tensor clusters executing backpropagation, 3D parallelism, parameter-efficient adaptation, and reinforcement alignment.',
    roadmap: [
      {
        id: 'd5-level-1',
        levelId: 'level-1',
        tierLabel: '01 · Foundations (Zero)',
        title: 'Computational Graphs, Reverse-Mode Autograd & Adaptive Optimizers',
        summary:
          'Understand the mathematical engine of deep learning from first principles: dynamic DAG construction, chain-rule backpropagation, loss landscapes, and weight decay dynamics.',
        coreConcepts: [
          'Dynamic Computational Graphs & Reverse-Mode Autograd',
          'Cross-Entropy, Perplexity & Contrastive InfoNCE Loss',
          'Vanishing/Exploding Gradients & Weight Initialization',
          'SGD with Momentum, Adam & Decoupled Weight Decay (AdamW)',
          'Activation Checkpointing (Memory vs. Compute Trade-off)',
        ],
        techStack: ['Python', 'PyTorch Autograd', 'NumPy', 'Matplotlib', 'Weights & Biases'],
        capstoneDeliverable:
          'Build a scalar and tensor autograd engine from scratch and train a multi-layer neural network with custom AdamW.',
      },
      {
        id: 'd5-level-2',
        levelId: 'level-2',
        tierLabel: '02 · Core Engineering',
        title: 'Mixed-Precision Training (BF16/FP8) & Parameter-Efficient Fine-Tuning (LoRA/QLoRA)',
        summary:
          'Maximize single-node GPU throughput and adapt multi-billion parameter models on consumer/cloud GPUs using low-rank matrix decomposition and 4-bit NormalFloat quantization.',
        coreConcepts: [
          'Mixed-Precision Training (FP16 Dynamic Loss Scaling & BF16)',
          'Gradient Accumulation, Global Norm Clipping & Cosine LR Warmup',
          'Low-Rank Adaptation (LoRA: ΔW = B·A)',
          '4-Bit NormalFloat Quantized Fine-Tuning (QLoRA & Paged Optimizers)',
          'Supervised Fine-Tuning (SFT) & Instruction Packing',
        ],
        techStack: [
          'PyTorch AMP',
          'HuggingFace PEFT & TRL',
          'bitsandbytes',
          'Unsloth',
          'Axolotl',
        ],
        capstoneDeliverable:
          'Fine-tune an open-weights 7B/8B model on custom domain instruction data using QLoRA with BF16 mixed precision and cosine schedule.',
      },
      {
        id: 'd5-level-3',
        levelId: 'level-3',
        tierLabel: '03 · Production & Scale',
        title: '3D Distributed Parallelism: FSDP, DeepSpeed ZeRO & Megatron-LM',
        summary:
          'Scale training across hundreds of H100 GPUs by sharding optimizer states, gradients, parameters, and activations across high-speed NVLink and InfiniBand fabrics.',
        coreConcepts: [
          'Distributed Data Parallelism (DDP) & Ring-AllReduce',
          'DeepSpeed ZeRO Stages 1, 2 & 3 (Optimizer/Gradient/Param Sharding)',
          'PyTorch Fully Sharded Data Parallel (FSDP2)',
          'Tensor Parallelism (Column/Row Split) & Pipeline Parallelism (1F1B)',
          'NCCL Collectives, NVLink & InfiniBand Topology Optimization',
        ],
        techStack: [
          'PyTorch FSDP',
          'DeepSpeed ZeRO',
          'NVIDIA Megatron-LM',
          'NCCL / Slurm / Kubernetes RayTrain',
          'MLflow / W&B',
        ],
        capstoneDeliverable:
          'Configure a multi-GPU FSDP / DeepSpeed ZeRO-3 training pipeline with activation checkpointing, gradient throughput profiling, and fault-tolerant checkpointing.',
      },
      {
        id: 'd5-level-4',
        levelId: 'level-4',
        tierLabel: '04 · Frontier & SOTA (Hero)',
        title: 'Post-Training Alignment (RLHF, DPO, GRPO) & Compute-Optimal Scaling Laws',
        summary:
          'Align frontier models with human preferences and verifiable reasoning rewards while forecasting loss curves via compute-optimal Chinchilla scaling laws.',
        coreConcepts: [
          'RLHF with Proximal Policy Optimization (PPO) & KL-Divergence Penalty',
          'Direct Preference Optimization (DPO) without Explicit Reward Models',
          'Group Relative Policy Optimization (GRPO) for Reasoning RL',
          'Verifiable Rewards (RLVR) for Code & Mathematics',
          'Compute-Optimal Chinchilla Scaling Laws (N vs. D Allocation)',
        ],
        techStack: [
          'OpenRLHF / veRL',
          'TRL (DPO / GRPO Trainers)',
          'Ray Distributed RL',
          'vLLM Rollout Engine',
          'PyTorch 2.x torch.compile',
        ],
        capstoneDeliverable:
          'Align a policy model using DPO and GRPO on preference and verifiable math/code reward datasets with automated win-rate evaluation.',
      },
    ],
    landmarks: [
      {
        id: 'd5-lm-1',
        year: 2014,
        title: 'Adam: A Method for Stochastic Optimization',
        authorsOrOrg: 'Diederik P. Kingma & Jimmy Ba',
        category: 'Seminal Paper',
        keyContribution:
          'Combined adaptive first-order momentum and second-order uncentered variance estimates to provide scale-invariant, fast-converging parameter updates.',
        impactMetricOrNote:
          'Together with decoupled weight decay (AdamW, 2017), serves as the universal optimizer for deep learning.',
        url: 'https://arxiv.org/abs/1412.6980',
      },
      {
        id: 'd5-lm-2',
        year: 2019,
        title: 'ZeRO: Memory Optimizations Toward Training Trillion Parameter Models',
        authorsOrOrg: 'Samyam Rajbhandari et al. · Microsoft Research',
        category: 'Architecture Breakthrough',
        keyContribution:
          'Eliminated redundant memory replication across data-parallel GPUs by partitioning optimizer states (ZeRO-1), gradients (ZeRO-2), and parameters (ZeRO-3).',
        impactMetricOrNote:
          'Reduced per-GPU memory footprint by up to 8x–64x, unlocking trillion-parameter training.',
        url: 'https://arxiv.org/abs/1910.02054',
      },
      {
        id: 'd5-lm-3',
        year: 2021,
        title: 'LoRA: Low-Rank Adaptation of Large Language Models',
        authorsOrOrg: 'Edward J. Hu et al. · Microsoft',
        category: 'Architecture Breakthrough',
        keyContribution:
          'Froze pretrained model weights and injected trainable rank-decomposition matrices into Transformer layers, reducing trainable parameters by 10,000x and GPU memory by 3x.',
        impactMetricOrNote:
          'Democratized fine-tuning of large models with zero additional inference latency when merged.',
        url: 'https://arxiv.org/abs/2106.09685',
      },
      {
        id: 'd5-lm-4',
        year: 2022,
        title: 'Training Compute-Optimal Large Language Models (Chinchilla)',
        authorsOrOrg: 'Jordan Hoffmann et al. · DeepMind',
        category: 'Seminal Paper',
        keyContribution:
          'Proved empirically across 400+ training runs that model parameters (N) and training tokens (D) must scale in equal proportions (~20 tokens per parameter) for a fixed FLOP budget.',
        impactMetricOrNote:
          '70B Chinchilla trained on 1.4T tokens outperformed 280B Gopher and 175B GPT-3.',
        url: 'https://arxiv.org/abs/2203.15556',
      },
      {
        id: 'd5-lm-5',
        year: 2023,
        title: 'Direct Preference Optimization: Your Language Model is Secretly a Reward Model (DPO)',
        authorsOrOrg: 'Rafael Rafailov et al. · Stanford University',
        category: 'Architecture Breakthrough',
        keyContribution:
          'Derived a closed-form mapping between reward functions and optimal policies, enabling stable RLHF preference alignment via a simple binary cross-entropy loss without PPO.',
        impactMetricOrNote:
          'Adopted for post-training alignment of Llama 3, Zephyr, Mixtral, and Qwen.',
        url: 'https://arxiv.org/abs/2305.18290',
      },
    ],
  },
  {
    districtId: 'model-core',
    districtCode: 'DIST-06',
    districtName: 'Model Core',
    pipelineStageName: 'Neural Architectures & Foundation Backbones',
    accentColorHex: '#EC4899',
    tagline:
      'The central neural nexus: attention mechanisms, hardware-aware sequence blocks, Sparse Mixture-of-Experts, and hybrid state-space backbones.',
    roadmap: [
      {
        id: 'd6-level-1',
        levelId: 'level-1',
        tierLabel: '01 · Foundations (Zero)',
        title: 'MLPs, Residual Highway Dynamics, CNNs & Recurrent Sequence Models',
        summary:
          'Master the foundational inductive biases of deep neural networks: affine projections, nonlinear activations, skip connections, and sequential hidden-state recurrence.',
        coreConcepts: [
          'Multi-Layer Perceptrons (MLPs) & Universal Approximation',
          'Activation Functions (ReLU, GELU, SiLU / Swish)',
          'Residual Connections & Pre-Norm vs. Post-Norm Stability',
          'Recurrent Neural Networks (RNN, LSTM, GRU) & Sequential Bottlenecks',
          'Representation Geometry & Latent Manifolds',
        ],
        techStack: ['PyTorch (torch.nn)', 'NumPy', 'einops', 'TorchVision', 'TensorBoard'],
        capstoneDeliverable:
          'Implement modular ResNet blocks and gated sequence encoders in pure PyTorch with gradient norm diagnostics.',
      },
      {
        id: 'd6-level-2',
        levelId: 'level-2',
        tierLabel: '02 · Core Engineering',
        title: 'Scaled Dot-Product Attention, Multi-Head Attention & Transformer Blocks',
        summary:
          'Build complete Encoder, Decoder, and Prefix-LM Transformer architectures from scratch with causal masking and sinusoidal/learned positional encodings.',
        coreConcepts: [
          'Scaled Dot-Product Attention: softmax(QKᵀ / √dₖ)V',
          'Multi-Head Attention (MHA) & Subspace Projections',
          'Causal Autoregressive Masking & Cross-Attention',
          'Layer Normalization & Residual Stream Architecture',
          'Sinusoidal & Learned Absolute Positional Encodings',
        ],
        techStack: [
          'PyTorch',
          'einops',
          'nanoGPT / minGPT Architecture',
          'HuggingFace Transformers',
          'safetensors',
        ],
        capstoneDeliverable:
          'Code a complete GPT-style autoregressive Transformer from scratch in PyTorch and pretrain it on a character/subword corpus.',
      },
      {
        id: 'd6-level-3',
        levelId: 'level-3',
        tierLabel: '03 · Production & Scale',
        title: 'Modern LLM Backbones: RoPE, SwiGLU, RMSNorm, GQA/MLA & FlashAttention',
        summary:
          'Upgrade classical Transformers to modern frontier specifications that support 128k+ context windows, compressed KV caches, and SRAM-tiled IO-aware attention.',
        coreConcepts: [
          'Rotary Position Embeddings (RoPE) & YaRN Context Extension',
          'SwiGLU Gated Feed-Forward Networks & Pre-RMSNorm',
          'Grouped-Query Attention (GQA) & Multi-Head Latent Attention (MLA)',
          'Hardware-Aware IO Tiling (FlashAttention-2 / FlashAttention-3)',
          'Sliding Window Attention & Ring Attention for 1M+ Context',
        ],
        techStack: [
          'PyTorch SDPA',
          'FlashAttention-2 / FlashAttention-3',
          'Triton GPU Kernels',
          'Llama-3 / DeepSeek-V3 Architecture Specs',
          'xFormers',
        ],
        capstoneDeliverable:
          'Upgrade a vanilla Transformer with RoPE, GQA, RMSNorm, SwiGLU, and FlashAttention-2, benchmarking memory and throughput gains at 32k context.',
      },
      {
        id: 'd6-level-4',
        levelId: 'level-4',
        tierLabel: '04 · Frontier & SOTA (Hero)',
        title: 'Sparse Mixture-of-Experts (MoE), Mamba/SSM Hybrids & Test-Time Compute',
        summary:
          'Decouple total parameter capacity from per-token FLOPs using routed Sparse MoE layers, linear-complexity State Space Models, and latent test-time reasoning loops.',
        coreConcepts: [
          'Sparse Mixture-of-Experts (MoE) & Top-K Token Routing',
          'Shared + Fine-Grained Experts & Auxiliary-Loss-Free Load Balancing',
          'Selective State Space Models (Mamba / Mamba-2) & Jamba Hybrids',
          'Diffusion Transformers (DiT) for Continuous/Discrete Generation',
          'Test-Time Compute Scaling & Recurrent Depth Architectures',
        ],
        techStack: [
          'MegaBlocks / Tutel MoE',
          'mamba-ssm',
          'DeepSeekMoE Routing',
          'PyTorch Distributed Expert Parallelism',
          'Custom CUDA / Triton Routers',
        ],
        capstoneDeliverable:
          'Build a Sparse Mixture-of-Experts (MoE) Transformer layer with top-k token routing, shared experts, and load-balancing telemetry.',
      },
    ],
    landmarks: [
      {
        id: 'd6-lm-1',
        year: 2015,
        title: 'Deep Residual Learning for Image Recognition (ResNet)',
        authorsOrOrg: 'Kaiming He et al. · Microsoft Research',
        category: 'Seminal Paper',
        keyContribution:
          'Established the residual stream highway allowing gradients to flow unimpeded through ratusan layers—the structural backbone of every Transformer block.',
        impactMetricOrNote:
          'Enabled scaling neural networks from tens of layers to ratusan of layers.',
        url: 'https://arxiv.org/abs/1512.03385',
      },
      {
        id: 'd6-lm-2',
        year: 2017,
        title: 'Attention Is All You Need (The Transformer)',
        authorsOrOrg: 'Ashish Vaswani et al. · Google Brain / Google Research',
        category: 'Seminal Paper',
        keyContribution:
          'Replaced recurrence and convolutions entirely with Multi-Head Self-Attention, enabling massive parallelization during training and O(1) path length between any two tokens.',
        impactMetricOrNote:
          'Foundational architecture behind GPT, BERT, ViT, Whisper, AlphaFold 2, and modern AI.',
        url: 'https://arxiv.org/abs/1706.03762',
      },
      {
        id: 'd6-lm-3',
        year: 2021,
        title: 'RoFormer: Enhanced Transformer with Rotary Position Embedding (RoPE)',
        authorsOrOrg: 'Jianlin Su et al.',
        category: 'Architecture Breakthrough',
        keyContribution:
          'Encoded relative token distances by rotating Query and Key representations in complex 2D subspaces, enabling smooth length extrapolation and relative distance decay.',
        impactMetricOrNote:
          'Standard positional encoding in Llama, Mistral, Qwen, Gemma, and PaLM.',
        url: 'https://arxiv.org/abs/2104.09864',
      },
      {
        id: 'd6-lm-4',
        year: 2022,
        title: 'FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness',
        authorsOrOrg: 'Tri Dao et al. · Stanford University',
        category: 'Architecture Breakthrough',
        keyContribution:
          'Used GPU SRAM tiling and online softmax rescaling to compute exact attention without materializing the N×N attention matrix in slow HBM memory.',
        impactMetricOrNote:
          'Reduced attention memory complexity from O(N²) to O(N) with 2x–4x wall-clock speedup.',
        url: 'https://arxiv.org/abs/2205.14135',
      },
      {
        id: 'd6-lm-5',
        year: 2024,
        title: 'Mixtral of Experts & DeepSeekMoE: Sparse Mixture-of-Experts Architectures',
        authorsOrOrg: 'Mistral AI / DeepSeek',
        category: 'Architecture Breakthrough',
        keyContribution:
          'Combined sparse top-k expert routing and fine-grained shared experts to deliver 47B–671B parameter knowledge capacity at a fraction of active per-token inference FLOPs.',
        impactMetricOrNote:
          'Established Sparse MoE as the dominant frontier backbone architecture.',
        url: 'https://arxiv.org/abs/2401.04088',
      },
    ],
  },
  {
    districtId: 'inference-center',
    districtCode: 'DIST-07',
    districtName: 'Inference Center & Engine',
    pipelineStageName: 'Low-Latency Serving & Hardware Acceleration',
    accentColorHex: '#8B5CF6',
    tagline:
      'Roofline-optimal execution: KV cache memory paging, low-bit quantization, continuous in-flight batching, and speculative decoding.',
    roadmap: [
      {
        id: 'd7-level-1',
        levelId: 'level-1',
        tierLabel: '01 · Foundations (Zero)',
        title: 'Prefill vs. Decode Dynamics, Roofline Model & KV Cache Mechanics',
        summary:
          'Analyze why prompt processing is compute-bound while token generation is memory-bandwidth-bound, and calculate exact KV cache byte footprints across batch sizes.',
        coreConcepts: [
          'Compute-Bound Prefill vs. Memory-Bandwidth-Bound Decode',
          'GPU Roofline Performance Model (Arithmetic Intensity: FLOPs/Byte)',
          'Key-Value (KV) Cache Mechanics & Memory Footprint Math',
          'Autoregressive Sampling (Temperature, Top-P, Top-K, Min-P)',
          'Safe Model Serialization (safetensors, TorchScript)',
        ],
        techStack: [
          'PyTorch Profiler',
          'safetensors',
          'NVIDIA Nsight Systems',
          'TorchScript / torch.export',
          'Python',
        ],
        capstoneDeliverable:
          'Profile prefill vs. decode latency, HBM bandwidth utilization, and KV cache memory footprint across varying batch sizes and sequence lengths.',
      },
      {
        id: 'd7-level-2',
        levelId: 'level-2',
        tierLabel: '02 · Core Engineering',
        title: 'Compiler Runtimes (ONNX / TensorRT) & Post-Training Quantization (AWQ / GPTQ / FP8)',
        summary:
          'Compress model weights and activations to 8-bit and 4-bit representations while fusing operator graphs to eliminate kernel launch overhead.',
        coreConcepts: [
          'Computational Graph Fusion (LayerNorm + MatMul + GELU)',
          'Compiler Runtimes (ONNX Runtime, TensorRT, TensorRT-LLM)',
          'Weight-Only & Activation Quantization (INT8, INT4, FP8)',
          'Activation-Aware Weight Quantization (AWQ) & GPTQ',
          'CPU/Edge Inference with GGUF & llama.cpp',
        ],
        techStack: [
          'ONNX Runtime',
          'NVIDIA TensorRT / TensorRT-LLM',
          'AutoAWQ / GPTQModel',
          'llama.cpp (GGUF)',
          'bitsandbytes',
        ],
        capstoneDeliverable:
          'Export a PyTorch model to ONNX/TensorRT and AWQ INT4, benchmarking throughput speedup and perplexity retention.',
      },
      {
        id: 'd7-level-3',
        levelId: 'level-3',
        tierLabel: '03 · Production & Scale',
        title: 'PagedAttention (vLLM), Continuous Batching & Triton Inference Server',
        summary:
          'Eliminate KV cache fragmentation with OS-inspired virtual memory paging and maximize GPU utilization under concurrent multi-tenant traffic via continuous batching.',
        coreConcepts: [
          'PagedAttention for Zero-Waste Non-Contiguous KV Cache',
          'Continuous (Iteration-Level / In-Flight) Batching',
          'Chunked Prefill to Prevent Decode Head-of-Line Blocking',
          'Multi-Model Ensembles on NVIDIA Triton Inference Server',
          'Tensor Parallel Serving Across Multi-GPU Nodes',
        ],
        techStack: [
          'vLLM',
          'SGLang',
          'NVIDIA Triton Inference Server',
          'Kubernetes + KServe',
          'Prometheus GPU Exporter',
        ],
        capstoneDeliverable:
          'Deploy a high-throughput LLM/Vision serving cluster on vLLM and Triton Inference Server with PagedAttention and continuous batching.',
      },
      {
        id: 'd7-level-4',
        levelId: 'level-4',
        tierLabel: '04 · Frontier & SOTA (Hero)',
        title: 'Speculative Decoding, RadixAttention Prefix Caching & Disaggregated Serving',
        summary:
          'Break the sequential autoregressive bottleneck using draft-target speculative verification, tree-structured prefix KV sharing, and disaggregated prefill/decode clusters.',
        coreConcepts: [
          'Speculative Decoding (Draft-Model & Medusa / EAGLE Heads)',
          'Prefix KV Cache Reuse via RadixAttention Trees',
          'Disaggregated Prefill & Decode GPU Clusters (Mooncake / Dynamo)',
          'Custom Triton & CUDA Warp-Specialized Decode Kernels',
          'Zero-Overhead Structured Grammar Masks (XGrammar)',
        ],
        techStack: [
          'SGLang (RadixAttention)',
          'vLLM Speculative Decoding / EAGLE',
          'OpenAI Triton Language',
          'CUDA C++ / FlashInfer',
          'NVIDIA Dynamo',
        ],
        capstoneDeliverable:
          'Implement speculative decoding with prefix caching to achieve 2.2x+ lossless token generation speedup under production load.',
      },
    ],
    landmarks: [
      {
        id: 'd7-lm-1',
        year: 2019,
        title: 'ONNX Runtime & NVIDIA TensorRT Inference Acceleration Ecosystem',
        authorsOrOrg: 'Microsoft & NVIDIA',
        category: 'Open-Source / System Milestone',
        keyContribution:
          'Standardized cross-framework intermediate graph representations, operator fusion, and hardware-specific kernel autotuning for low-latency production inference.',
        impactMetricOrNote:
          'Powers billions of daily production ML inferences across cloud and edge hardware.',
        url: 'https://onnxruntime.ai',
      },
      {
        id: 'd7-lm-2',
        year: 2022,
        title: 'Fast Inference from Transformers via Speculative Decoding',
        authorsOrOrg: 'Yaniv Leviathan, Matan Kalman & Yossi Matias · Google Research',
        category: 'Architecture Breakthrough',
        keyContribution:
          'Used a fast draft model to propose K candidate tokens and verified them in parallel in a single forward pass of the target LLM via rejection sampling, preserving the exact output distribution.',
        impactMetricOrNote:
          'Achieved 2x–3x latency reduction without changing model weights or output quality.',
        url: 'https://arxiv.org/abs/2211.17192',
      },
      {
        id: 'd7-lm-3',
        year: 2023,
        title: 'Efficient Memory Management for Large Language Model Serving with PagedAttention (vLLM)',
        authorsOrOrg: 'Woosuk Kwon et al. · UC Berkeley',
        category: 'Architecture Breakthrough',
        keyContribution:
          'Partitioned KV cache into fixed-size virtual memory blocks mapped via a page table, eliminating 60–80% memory fragmentation and enabling copy-on-write prefix sharing.',
        impactMetricOrNote:
          'Increased LLM serving throughput by 2x–24x; made vLLM the industry standard inference engine.',
        url: 'https://arxiv.org/abs/2309.06180',
      },
      {
        id: 'd7-lm-4',
        year: 2023,
        title: 'AWQ: Activation-aware Weight Quantization for LLM Compression and Acceleration',
        authorsOrOrg: 'Ji Lin et al. · MIT Han Lab',
        category: 'Seminal Paper',
        keyContribution:
          'Observed that protecting just 1% of salient weight channels identified by activation magnitudes (via per-channel scaling) enables near-lossless 4-bit weight quantization.',
        impactMetricOrNote:
          'Delivered >3x speedup over FP16 while avoiding overfitting to calibration sets.',
        url: 'https://arxiv.org/abs/2306.00978',
      },
    ],
  },
  {
    districtId: 'output-terminal',
    districtCode: 'DIST-08',
    districtName: 'Output Nexus & MLOps Telemetry',
    pipelineStageName: 'Observability, Streaming, Safety Verification & Data Flywheel',
    accentColorHex: '#00F0FF',
    tagline:
      'Real-time SSE/WebSocket token streaming, OpenTelemetry GenAI tracing, canary shadow deployments, and autonomous production data flywheels.',
    roadmap: [
      {
        id: 'd8-level-1',
        levelId: 'level-1',
        tierLabel: '01 · Foundations (Zero)',
        title: 'Real-Time Token Streaming (SSE / WebSockets) & Latency Telemetry (TTFT / ITL)',
        summary:
          'Stream detokenized UTF-8 chunks smoothly to user interfaces while measuring core user-perceived latency SLOs and structured telemetry logs.',
        coreConcepts: [
          'Server-Sent Events (SSE) & Bidirectional WebSockets',
          'Incremental UTF-8 Detokenization & Backpressure',
          'Time-To-First-Token (TTFT) vs. Inter-Token Latency (ITL / TPOT)',
          'Structured JSON Logging & Correlation Request IDs',
          'Graceful Timeout, Retry & Fallback Circuit Breakers',
        ],
        techStack: [
          'Web Streams API / SSE',
          'FastAPI StreamingResponse',
          'Next.js Route Handlers',
          'Pino / Structlog',
          'TypeScript',
        ],
        capstoneDeliverable:
          'Build a resilient SSE streaming endpoint and client HUD with real-time TTFT, ITL, and tokens/sec telemetry counters.',
      },
      {
        id: 'd8-level-2',
        levelId: 'level-2',
        tierLabel: '02 · Core Engineering',
        title: 'GenAI Distributed Tracing (OpenTelemetry) & Cost/Latency Observability',
        summary:
          'Instrument multi-step RAG and agentic calls with distributed spans, token usage accounting, prompt versioning, and live Prometheus/Grafana dashboards.',
        coreConcepts: [
          'OpenTelemetry GenAI Semantic Conventions',
          'Distributed Span Trees for RAG & Multi-Tool Agents',
          'Prompt Version Management & Token Cost Attribution',
          'Prometheus Histograms (p50, p95, p99 Latency)',
          'Real-Time Grafana Alerting & SLO Error Budgets',
        ],
        techStack: [
          'OpenTelemetry SDK',
          'Langfuse',
          'Arize Phoenix',
          'Prometheus',
          'Grafana',
        ],
        capstoneDeliverable:
          'Instrument a multi-step AI pipeline with OpenTelemetry GenAI traces, Langfuse prompt tracking, and a real-time Grafana SLO dashboard.',
      },
      {
        id: 'd8-level-3',
        levelId: 'level-3',
        tierLabel: '03 · Production & Scale',
        title: 'Containerized MLOps, Canary/Shadow Deployments & Drift Detection',
        summary:
          'Ship model updates safely using progressive traffic splitting, asynchronous shadow mirroring, semantic caching, and automated embedding drift monitors.',
        coreConcepts: [
          'Containerized GPU Microservices (Docker & Kubernetes)',
          'Canary Rollouts & Asynchronous Shadow Traffic Mirroring',
          'Semantic Response Caching (Vector Similarity Cache)',
          'Statistical Data, Embedding & Concept Drift Detection (PSI / MMD)',
          'Automated Rollback on Quality or Latency Regression',
        ],
        techStack: [
          'Docker & Kubernetes',
          'Istio / Envoy Traffic Splitting',
          'Redis Semantic Cache',
          'Evidently AI / WhyLogs',
          'GitHub Actions ML CI/CD',
        ],
        capstoneDeliverable:
          'Build a Dockerized shadow-deployment pipeline that mirrors live traffic to a candidate model and compares latency, cost, and judge scores.',
      },
      {
        id: 'd8-level-4',
        levelId: 'level-4',
        tierLabel: '04 · Frontier & SOTA (Hero)',
        title: 'Autonomous Data Flywheels & SLO-Aware Multi-Model Semantic Routing',
        summary:
          'Close the production loop: automatically mine hard edge cases and user feedback into golden evaluation and fine-tuning sets while dynamically routing queries across model tiers.',
        coreConcepts: [
          'Closed-Loop Autonomous Production Data Flywheels',
          'Automated Hard-Example Mining & Active Learning Curation',
          'Implicit User Feedback Signals (Accept, Edit Distance, Retry)',
          'SLO- & Cost-Aware Multi-Model Cascades / Semantic Routers',
          'Continuous Post-Deployment Alignment & Regression Gates',
        ],
        techStack: [
          'RouteLLM / Semantic Router',
          'Langfuse Datasets & Annotation Queues',
          'Apache Airflow / Prefect Flywheel Pipelines',
          'DVC / LakeFS Data Versioning',
          'vLLM Multi-Tier Fleet',
        ],
        capstoneDeliverable:
          'Design a closed-loop production data flywheel with SLO-aware semantic routing (small fast model → frontier model cascade) and automated hard-example curation.',
      },
    ],
    landmarks: [
      {
        id: 'd8-lm-1',
        year: 2015,
        title: 'Hidden Technical Debt in Machine Learning Systems',
        authorsOrOrg: 'D. Sculley et al. · Google',
        category: 'Seminal Paper',
        keyContribution:
          'Revealed that ML model code is a tiny fraction (<5%) of production AI systems, identifying boundary erosion, entanglement (CACE principle), data dependencies, and feedback loops.',
        impactMetricOrNote:
          'Foundational paper that established the discipline of modern MLOps and production ML engineering.',
        url: 'https://papers.nips.cc/paper/2015/hash/86df7d6896fcaf2674f757a2463eba-Abstract.html',
      },
      {
        id: 'd8-lm-2',
        year: 2023,
        title: 'FrugalGPT: How to Use Large Language Models While Reducing Cost and Improving Performance',
        authorsOrOrg: 'Lingjiao Chen, Matei Zaharia & James Zou · Stanford University',
        category: 'Architecture Breakthrough',
        keyContribution:
          'Formalized prompt adaptation, semantic caching, and learned LLM cascades (routing easy queries to small models and hard queries to frontier models).',
        impactMetricOrNote:
          'Demonstrated up to 98% inference cost reduction while matching or exceeding single-frontier-model accuracy.',
        url: 'https://arxiv.org/abs/2305.05176',
      },
      {
        id: 'd8-lm-3',
        year: 2024,
        title: 'OpenTelemetry Semantic Conventions for Generative AI Systems',
        authorsOrOrg: 'Cloud Native Computing Foundation (CNCF) & OpenTelemetry GenAI WG',
        category: 'Open-Source / System Milestone',
        keyContribution:
          'Standardized vendor-neutral telemetry attributes (`gen_ai.system`, `gen_ai.usage.input_tokens`, `gen_ai.server.time_to_first_token`) across LLM providers and observability platforms.',
        impactMetricOrNote:
          'Unified observability across Langfuse, Arize Phoenix, Datadog, Grafana, and cloud-native AI stacks.',
        url: 'https://opentelemetry.io/docs/specs/semconv/gen-ai/',
      },
    ],
  },
];

export const DISTRICT_ROADMAP_MAP: Record<DistrictId, DistrictDeepDive> =
  DISTRICT_ROADMAPS.reduce((acc, item) => {
    acc[item.districtId] = item;
    return acc;
  }, {} as Record<DistrictId, DistrictDeepDive>);

export function getDistrictDeepDive(districtId: DistrictId): DistrictDeepDive {
  return DISTRICT_ROADMAP_MAP[districtId];
}
