import type { DistrictId } from './districts';
import type { MasteryLevelId } from '../types/district-roadmap';

export interface DistrictQuizQuestion {
  id: string;
  districtId: DistrictId;
  levelId: MasteryLevelId;
  milestoneId: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  technicalExplanation: string;
}

export const DISTRICT_QUIZZES: DistrictQuizQuestion[] = [
  // ==================== DISTRICT 1: INPUT GATEWAY ====================
  {
    id: 'q-d1-1',
    districtId: 'input-gateway',
    levelId: 'level-1',
    milestoneId: 'd1-level-1',
    question:
      'Why is Unicode normalization (NFC / NFKC) critical before running lexical tokenization on raw user text?',
    options: [
      'It compresses UTF-8 strings into 4-bit integers directly in GPU memory.',
      'Visually identical characters (e.g., "é" as a single codepoint vs. "e" + combining accent) map to different byte sequences and fragment token IDs if unnormalized.',
      'It automatically translates non-English text into ASCII before embedding.',
      'It replaces all punctuation with whitespace to speed up regex parsing.',
    ],
    correctIndex: 1,
    technicalExplanation:
      'Without canonical composition/compatibility normalization (NFC/NFKC), canonically equivalent strings produce distinct byte sequences, splitting probability mass across duplicate subword tokens and enabling homograph prompt attacks.',
  },
  {
    id: 'q-d1-2',
    districtId: 'input-gateway',
    levelId: 'level-2',
    milestoneId: 'd1-level-2',
    question:
      'Why does Byte-Pair Encoding (BPE) outperform word-level tokenization for Large Language Models, and how does Vision Transformer (ViT) tokenize a 2D image?',
    options: [
      'BPE drops rare words entirely; ViT runs a 3×3 Sobel edge detector over every pixel.',
      'BPE iteratively merges frequent byte/character pairs to achieve open-vocabulary coverage with compact sequence lengths, while ViT splits an image into fixed non-overlapping patches (e.g., 16×16) and linearly projects each flattened patch.',
      'BPE hashes every word to a random prime number; ViT converts images into MP3 spectrograms.',
      'BPE only encodes ASCII characters; ViT requires a recurrent LSTM over every image row.',
    ],
    correctIndex: 1,
    technicalExplanation:
      'Subword BPE balances vocabulary size against sequence length while eliminating out-of-vocabulary (<UNK>) tokens. Similarly, ViT treats non-overlapping 16×16 pixel patches as "visual tokens" via a linear projection (or stride-16 conv), unifying text and vision for Transformer backbones.',
  },
  {
    id: 'q-d1-3',
    districtId: 'input-gateway',
    levelId: 'level-3',
    milestoneId: 'd1-level-3',
    question:
      'In a high-throughput multimodal ingestion gateway (1,000+ req/sec), why combine dynamic ingress batching with Apache Kafka backpressure?',
    options: [
      'To force all clients to use synchronous HTTP/1.0 polling.',
      'To coalesce variable-arrival requests into hardware-efficient tensor batches while buffering traffic spikes so downstream GPU workers never suffer OOM crashes.',
      'To bypass schema validation and write raw unvalidated bytes directly to GPU registers.',
      'To increase Time-To-First-Token latency intentionally.',
    ],
    correctIndex: 1,
    technicalExplanation:
      'Dynamic batching amortizes GPU kernel launch and prefill overhead across concurrent arrivals, while Kafka/gRPC flow-control absorbs bursty multimodal uploads without dropping requests or exhausting worker memory.',
  },
  {
    id: 'q-d1-4',
    districtId: 'input-gateway',
    levelId: 'level-4',
    milestoneId: 'd1-level-4',
    question:
      'How do Native Resolution ViT (NaViT) and VQ-VAE discrete visual codebooks improve upon fixed-resolution (224×224) image preprocessing?',
    options: [
      'NaViT packs variable-aspect-ratio patches into a single sequence without distorting aspect ratios, and VQ-VAE quantizes continuous patches into discrete codebook IDs for unified autoregressive modeling.',
      'They crop every image to a 32×32 grayscale thumbnail.',
      'They require training a separate CNN for every possible image width.',
      'They convert all images into base64 strings before feeding them to a BPE text tokenizer.',
    ],
    correctIndex: 0,
    technicalExplanation:
      'NaViT uses masked sequence packing with factorized 2D positional embeddings to preserve native resolution and aspect ratio, while VQ-VAE/VQGAN discrete tokens allow early-fusion multimodal transformers to predict image and text tokens in one shared vocabulary.',
  },

  // ==================== DISTRICT 2: DATA LAKE & VECTOR VAULT ====================
  {
    id: 'q-d2-1',
    districtId: 'data-lake',
    levelId: 'level-1',
    milestoneId: 'd2-level-1',
    question:
      'When unit-normalized (L2 norm = 1) embedding vectors are indexed in a vector store, how does Cosine Similarity relate to Inner Product (Dot Product) and Euclidean L2 distance?',
    options: [
      'Cosine similarity becomes completely random on normalized vectors.',
      'Cosine similarity equals the Inner Product (u · v) and is monotonically equivalent to squared Euclidean distance (||u - v||² = 2 - 2(u · v)), allowing faster SIMD dot-product instructions.',
      'Euclidean distance becomes zero for all vector pairs.',
      'Inner product requires O(d³) matrix inversion per comparison.',
    ],
    correctIndex: 1,
    technicalExplanation:
      'When ||u|| = ||v|| = 1, cos(θ) = u · v and ||u - v||² = 2(1 - u · v). Pre-normalizing embeddings lets vector engines use single-pass FMA dot-product SIMD kernels instead of computing norms at query time.',
  },
  {
    id: 'q-d2-2',
    districtId: 'data-lake',
    levelId: 'level-2',
    milestoneId: 'd2-level-2',
    question:
      'What is the primary trade-off controlled by the `efSearch` parameter in an HNSW (Hierarchical Navigable Small World) graph index?',
    options: [
      'Disk compression ratio vs. network bandwidth.',
      'Query-time dynamic candidate list size: increasing `efSearch` improves Recall@K accuracy at the cost of higher query latency (more distance evaluations).',
      'The number of SQL tables created in PostgreSQL.',
      'The dimensionality of the embedding model output.',
    ],
    correctIndex: 1,
    technicalExplanation:
      'In HNSW greedy graph traversal, `efSearch` sets the size of the priority queue of nearest candidates explored at layer 0 during search. Higher `efSearch` approaches 100% exact recall while scaling latency sub-linearly.',
  },
  {
    id: 'q-d2-3',
    districtId: 'data-lake',
    levelId: 'level-3',
    milestoneId: 'd2-level-3',
    question:
      'Why combine BM25 sparse lexical retrieval with dense vector embeddings via Reciprocal Rank Fusion (RRF), followed by Cross-Encoder reranking?',
    options: [
      'BM25 captures exact keyword/SKU/acronym matches that dense bi-encoders can smooth over, RRF fuses both ranked lists without score calibration, and a Cross-Encoder applies full token-to-token cross-attention on the top-K candidates.',
      'Because dense vector databases cannot store more than 1,000 documents.',
      'Because RRF deletes 90% of the database to save disk space.',
      'Cross-encoders are 1,000x faster than HNSW vector search on 100M documents.',
    ],
    correctIndex: 0,
    technicalExplanation:
      'Bi-encoders compress an entire chunk into a single vector (fast ANN retrieval, but can miss exact rare identifiers). Hybrid BM25 + Dense via RRF maximizes recall, and a Cross-Encoder computes full query-document self-attention on top-50 candidates to maximize precision.',
  },
  {
    id: 'q-d2-4',
    districtId: 'data-lake',
    levelId: 'level-4',
    milestoneId: 'd2-level-4',
    question:
      'How do Late-Interaction models (ColBERT / ColPali) differ architecturally from standard single-vector bi-encoders?',
    options: [
      'They retain per-token (or per-patch) contextualized vectors and compute a fast MaxSim operator at query time, preserving fine-grained token/visual-layout interactions without full cross-encoder cost.',
      'They do not use neural networks at all.',
      'They concatenate the entire database into a single prompt.',
      'They require OCR and manual table parsing before indexing any PDF page.',
    ],
    correctIndex: 0,
    technicalExplanation:
      'ColBERT and ColPali index compact multi-vector representations per document/page and score queries via sum-of-maximum cosine similarities (MaxSim), outperforming single-vector pooling on complex multi-aspect queries and visual tables.',
  },

  // ==================== DISTRICT 3: COMPUTER VISION & GUARDRAILS ====================
  {
    id: 'q-d3-1',
    districtId: 'computer-vision',
    levelId: 'level-1',
    milestoneId: 'd3-level-1',
    question:
      'Why did Residual Connections (y = F(x) + x) in ResNet revolutionize both deep Computer Vision CNNs and modern Transformer backbones?',
    options: [
      'They removed all matrix multiplications from neural networks.',
      'They create an identity gradient highway (∂y/∂x = 1 + ∂F/∂x) that allows gradients to flow directly to early layers without vanishing, enabling training of 100+ layer networks.',
      'They automatically redact PII from input images.',
      'They reduce image resolution to 1×1 pixel in the first layer.',
    ],
    correctIndex: 1,
    technicalExplanation:
      'Additive identity skip connections ensure that the Jacobian of the layer output with respect to its input contains an identity term, preventing gradient degradation across deep stacks of convolutional or attention blocks.',
  },
  {
    id: 'q-d3-2',
    districtId: 'computer-vision',
    levelId: 'level-2',
    milestoneId: 'd3-level-2',
    question:
      'How does the RAGAS framework compute the Faithfulness metric to detect hallucinations in RAG and multimodal pipelines without human ground-truth labels?',
    options: [
      'By counting the total number of words in the response.',
      'By decomposing the generated response into atomic factual claims and verifying via NLI / LLM-Judge what fraction of those claims can be directly inferred from the retrieved context.',
      'By measuring the GPU temperature during inference.',
      'By checking whether the output matches an exact BLEU-4 score of 1.0.',
    ],
    correctIndex: 1,
    technicalExplanation:
      'RAGAS Faithfulness = (# of claims supported by retrieved context) / (total # of atomic claims extracted from the generated answer). A score < 1.0 pinpoints unsupported hallucinated statements.',
  },
  {
    id: 'q-d3-3',
    districtId: 'computer-vision',
    levelId: 'level-3',
    milestoneId: 'd3-level-3',
    question:
      'Why is a single input regex filter insufficient against Indirect Prompt Injection and Multimodal Typographic Jailbreaks?',
    options: [
      'Because adversarial instructions can be embedded inside retrieved third-party documents or rendered visually as pixels inside an image, requiring semantic dual-layer (input + output) safety classifiers like Llama Guard.',
      'Because regex filters cannot run on Linux servers.',
      'Because images do not contain pixels.',
      'Because prompt injection only happens during model pretraining.',
    ],
    correctIndex: 0,
    technicalExplanation:
      'Untrusted data fetched via RAG/MCP or OCRed by vision encoders can hijack instruction hierarchy mid-context. Defense-in-depth requires privilege separation, input/context classification, and output policy verification.',
  },
  {
    id: 'q-d3-4',
    districtId: 'computer-vision',
    levelId: 'level-4',
    milestoneId: 'd3-level-4',
    question:
      'In Mechanistic Interpretability, how do Sparse Autoencoders (SAEs) resolve "polysemanticity" inside Transformer residual stream neurons?',
    options: [
      'By deleting 90% of the model layers.',
      'By projecting dense residual activations into an overcomplete, L1-sparsity-penalized higher-dimensional dictionary where individual latent features correspond to monosemantic, human-interpretable concepts.',
      'By converting weights into JPEG files.',
      'By replacing self-attention with random noise.',
    ],
    correctIndex: 1,
    technicalExplanation:
      'Models compress many unrelated concepts into superposition across the same neurons (polysemanticity). Overcomplete SAEs disentangle these superposed activations into sparse monosemantic features that can be inspected and causally steered.',
  },

  // ==================== DISTRICT 4: NLP & AGENTIC ORCHESTRATION ====================
  {
    id: 'q-d4-1',
    districtId: 'nlp-district',
    levelId: 'level-1',
    milestoneId: 'd4-level-1',
    question:
      'How does Context-Free Grammar (CFG) / JSON-Schema constrained decoding guarantee 100% syntactically valid structured outputs from an LLM?',
    options: [
      'It retries the LLM call 50 times until JSON.parse succeeds.',
      'At each autoregressive decoding step, a finite-state automaton masks out (sets logit = -∞) any vocabulary token that would violate the target JSON Schema before softmax sampling.',
      'It fine-tunes the entire 70B model on every user request.',
      'It strips all curly braces from the model response.',
    ],
    correctIndex: 1,
    technicalExplanation:
      'Logit masking via precompiled FSM/PDA automata restricts next-token sampling strictly to valid continuations of the target grammar, achieving zero syntax errors with near-zero latency overhead.',
  },
  {
    id: 'q-d4-2',
    districtId: 'nlp-district',
    levelId: 'level-2',
    milestoneId: 'd4-level-2',
    question:
      'In the Model Context Protocol (MCP), how are Resources, Prompts, and Tools architecturally separated between Host, Client, and Server?',
    options: [
      'The MCP Server runs inside the GPU VRAM of the LLM.',
      'The Host application manages LLM context and permissions, maintaining 1:1 stateful JSON-RPC Clients with isolated MCP Servers that expose read-only data (Resources), reusable templates (Prompts), and model-invocable actions (Tools).',
      'Resources, Prompts, and Tools are all raw SQL strings executed directly by the browser.',
      'MCP only supports a single hardcoded search tool.',
    ],
    correctIndex: 1,
    technicalExplanation:
      'MCP decouples AI host applications from external integrations via a standardized JSON-RPC 2.0 protocol with clear security boundaries: application-controlled Resources, user-controlled Prompts, and model-controlled (human-approved) Tools.',
  },
  {
    id: 'q-d4-3',
    districtId: 'nlp-district',
    levelId: 'level-3',
    milestoneId: 'd4-level-3',
    question:
      'Why use a stateful cyclic graph (e.g., LangGraph) with persisted checkpoints instead of a linear DAG for production coding and research agents?',
    options: [
      'Cyclic state graphs allow iterative Reason-Act-Observe-Verify loops, compiler-driven self-correction on failed tool outputs, and durable Human-in-the-Loop (HITL) pause/resume checkpoints.',
      'Linear DAGs use too much GPU memory.',
      'Cyclic graphs never require any error handling.',
      'LangGraph automatically compiles Python into Verilog hardware.',
    ],
    correctIndex: 0,
    technicalExplanation:
      'Real-world agentic workflows require conditional looping (e.g., run test -> inspect traceback -> patch code -> re-test) and state persistence so long-running tasks can pause for human approval or recover from transient failures.',
  },
  {
    id: 'q-d4-4',
    districtId: 'nlp-district',
    levelId: 'level-4',
    milestoneId: 'd4-level-4',
    question:
      'How does Tree-of-Thoughts (ToT) / Monte Carlo Tree Search (MCTS) combined with a Process Reward Model (PRM) improve complex reasoning over greedy single-chain decoding?',
    options: [
      'It generates tokens in reverse alphabetical order.',
      'It branches multiple candidate reasoning steps, scores intermediate step validity using a PRM, and backpropagates value estimates to prune dead-end reasoning paths before committing.',
      'It sets temperature to 0.0 and disables attention.',
      'It reduces token usage to a single token.',
    ],
    correctIndex: 1,
    technicalExplanation:
      'Autoregressive greedy decoding cannot backtrack once a flawed premise enters the context. Tree search guided by step-level Process Reward Models allocates test-time compute to explore, verify, and backtrack across reasoning branches.',
  },

  // ==================== DISTRICT 5: TRAINING CLUSTER & FOUNDRY ====================
  {
    id: 'q-d5-1',
    districtId: 'training-cluster',
    levelId: 'level-1',
    milestoneId: 'd5-level-1',
    question:
      'Why does AdamW (Decoupled Weight Decay) generalize significantly better than standard Adam with L2 regularization when training Transformers?',
    options: [
      'In standard Adam, L2 regularization gradients get scaled by the inverse adaptive variance (√v_t), meaning parameters with large historical gradients receive less regularization; AdamW decouples weight decay directly from the adaptive gradient step.',
      'AdamW does not compute first- or second-order moments.',
      'AdamW only updates the bias terms of linear layers.',
      'AdamW requires zero memory for optimizer states.',
    ],
    correctIndex: 0,
    technicalExplanation:
      'Coupling L2 penalty into the gradient before Adam moment normalization distorts weight decay across parameters with different gradient magnitudes. Decoupling the weight decay step (θ_t = (1 - λ)θ_{t-1} - η·m̂_t/√v̂_t) restores uniform regularization.',
  },
  {
    id: 'q-d5-2',
    districtId: 'training-cluster',
    levelId: 'level-2',
    milestoneId: 'd5-level-2',
    question:
      'Why does BF16 (Brain Float 16) prevent gradient underflow/overflow better than FP16 without dynamic loss scaling, and how does LoRA reduce fine-tuning VRAM?',
    options: [
      'BF16 uses 64 bits per number; LoRA deletes half of the vocabulary.',
      'BF16 preserves the full 8-bit exponent of FP32 (matching its dynamic range), while LoRA freezes pretrained weights W₀ and trains only low-rank matrices ΔW = B·A (r ≪ d), shrinking optimizer states by >99%.',
      'BF16 has zero mantissa bits; LoRA converts Transformers into decision trees.',
      'BF16 only runs on CPUs.',
    ],
    correctIndex: 1,
    technicalExplanation:
      'FP16 has only a 5-bit exponent (max ~65,504), frequently overflowing in attention/gradient computations. BF16 keeps FP32’s 8-bit exponent (~3.4×10³⁸ range), and LoRA eliminates massive Adam optimizer state memory for frozen base weights.',
  },
  {
    id: 'q-d5-3',
    districtId: 'training-cluster',
    levelId: 'level-3',
    milestoneId: 'd5-level-3',
    question:
      'What does DeepSpeed ZeRO Stage 3 (and PyTorch FSDP) shard across data-parallel GPUs compared to ZeRO Stage 1 and Stage 2?',
    options: [
      'ZeRO-1 shards only the training dataset; ZeRO-3 deletes gradients.',
      'ZeRO-1 shards Optimizer States, ZeRO-2 shards Optimizer States + Gradients, and ZeRO-3 (FSDP) shards Optimizer States + Gradients + Model Parameters, gathering parameters on-the-fly per layer via All-Gather.',
      'ZeRO-3 duplicates the entire model 8 times on every GPU.',
      'ZeRO-3 only shards CPU RAM.',
    ],
    correctIndex: 1,
    technicalExplanation:
      'In mixed-precision Adam training, optimizer states (FP32 master weights, momentum, variance) consume 12 bytes/param, gradients 2 bytes, and weights 2 bytes. ZeRO-3 partitions all 16 bytes/param across N GPUs, reducing per-GPU state memory by 1/N.',
  },
  {
    id: 'q-d5-4',
    districtId: 'training-cluster',
    levelId: 'level-4',
    milestoneId: 'd5-level-4',
    question:
      'How do Direct Preference Optimization (DPO) and Group Relative Policy Optimization (GRPO) simplify post-training RL alignment compared to classic PPO?',
    options: [
      'DPO analytically optimizes policy probabilities directly on chosen/rejected pairs without training a separate Reward Model, while GRPO eliminates the Critic (Value) model by normalizing advantages across a group of sampled rollouts per prompt.',
      'They do not use any preference or reward signals.',
      'They require training 4 separate critic models simultaneously.',
      'They only work on models smaller than 100M parameters.',
    ],
    correctIndex: 0,
    technicalExplanation:
      'Classic RLHF-PPO requires 4 models in memory (Policy, Reference, Reward, Value Critic). DPO reparameterizes the reward function directly in terms of policy log-ratios, and GRPO replaces the memory-heavy Critic network with group-relative z-score reward baselines.',
  },

  // ==================== DISTRICT 6: MODEL CORE ====================
  {
    id: 'q-d6-1',
    districtId: 'model-core',
    levelId: 'level-1',
    milestoneId: 'd6-level-1',
    question:
      'Why do modern Transformer blocks overwhelmingly use Pre-RMSNorm (normalizing before Attention/FFN) rather than the original 2017 Post-LayerNorm placement?',
    options: [
      'Pre-RMSNorm keeps the main residual stream unnormalized so identity gradients flow directly from output to input without amplification distortion, stabilizing deep training without lengthy warmup.',
      'Post-LayerNorm cannot be computed on GPUs.',
      'Pre-RMSNorm increases parameter count by 50%.',
      'Pre-RMSNorm removes all residual connections.',
    ],
    correctIndex: 0,
    technicalExplanation:
      'In Pre-Norm architectures (x_{l+1} = x_l + F(Norm(x_l))), the residual highway remains a clean sum of layer updates, preventing gradient explosion at initialization, while RMSNorm saves ~7–15% normalization compute by omitting mean-centering.',
  },
  {
    id: 'q-d6-2',
    districtId: 'model-core',
    levelId: 'level-2',
    milestoneId: 'd6-level-2',
    question:
      'Why do we divide the Query-Key dot product by √d_k in Scaled Dot-Product Attention: softmax(QKᵀ / √d_k)V?',
    options: [
      'To convert floating-point numbers into integers.',
      'As head dimension d_k grows, the variance of Q·K grows proportionally to d_k, pushing softmax into saturated regions with vanishingly small gradients unless scaled by 1/√d_k.',
      'To reduce the context length by a factor of d_k.',
      'To make the attention matrix symmetric.',
    ],
    correctIndex: 1,
    technicalExplanation:
      'If q and k have zero mean and unit variance, their dot product has variance d_k. Dividing by √d_k restores unit variance before softmax, preventing extreme one-hot saturation and preserving gradient flow.',
  },
  {
    id: 'q-d6-3',
    districtId: 'model-core',
    levelId: 'level-3',
    milestoneId: 'd6-level-3',
    question:
      'How does Grouped-Query Attention (GQA) reduce inference memory bandwidth compared to Multi-Head Attention (MHA), and why does FlashAttention achieve 2x–4x speedups without approximations?',
    options: [
      'GQA shares a single Key/Value head across a group of Query heads (shrinking KV-Cache by 4x–8x), while FlashAttention tiles Q, K, V in fast on-chip GPU SRAM using online softmax so the N×N attention matrix is never read/written to slow HBM.',
      'GQA drops 75% of input tokens; FlashAttention approximates attention using low-rank SVD.',
      'GQA only uses 1 Query head; FlashAttention runs on CPU cache.',
      'Neither method affects HBM memory traffic.',
    ],
    correctIndex: 0,
    technicalExplanation:
      'Autoregressive decoding is bottlenecked by loading the KV-cache from HBM—GQA shrinks KV-cache footprints dramatically with minimal quality loss. FlashAttention eliminates O(N²) HBM reads/writes by fusing attention into a single SRAM-tiled kernel.',
  },
  {
    id: 'q-d6-4',
    districtId: 'model-core',
    levelId: 'level-4',
    milestoneId: 'd6-level-4',
    question:
      'In a Sparse Mixture-of-Experts (MoE) model (e.g., Mixtral / DeepSeekMoE), why is load balancing across routed experts critical during training and serving?',
    options: [
      'Without load balancing, router collapse routes all tokens to the same 1–2 experts—wasting the parameter capacity of unused experts and creating severe GPU straggler bottlenecks in Expert Parallelism.',
      'Load balancing ensures every token activates 100% of all experts.',
      'MoE models do not use Feed-Forward Networks.',
      'Load balancing is only needed for batch size 1.',
    ],
    correctIndex: 0,
    technicalExplanation:
      'Sparse MoE decouples total model parameters from active FLOPs per token via Top-K routing. If routing collapses onto a few experts, capacity underutilizes and distributed Expert Parallel ranks stall waiting for overloaded GPUs.',
  },

  // ==================== DISTRICT 7: INFERENCE CENTER & ENGINE ====================
  {
    id: 'q-d7-1',
    districtId: 'inference-center',
    levelId: 'level-1',
    milestoneId: 'd7-level-1',
    question:
      'According to the GPU Roofline Model, why is the LLM Prefill phase compute-bound while the autoregressive Decode phase is memory-bandwidth-bound?',
    options: [
      'Prefill processes all prompt tokens in parallel (high arithmetic intensity: Matrix×Matrix FLOPs per byte of weights loaded), whereas Decode generates 1 token at a time per sequence (low arithmetic intensity: streaming all model weights + KV cache from HBM for a skinny Matrix×Vector multiply).',
      'Prefill runs on CPU while Decode runs on GPU.',
      'Decode does not use the KV cache.',
      'Prefill uses INT4 while Decode uses FP64.',
    ],
    correctIndex: 0,
    technicalExplanation:
      'During Prefill, loading model weights once from HBM serves N prompt tokens simultaneously (high FLOPs/Byte). During Decode at small batch sizes, the GPU must stream gigabytes of weights and KV-cache from HBM just to emit a single token per request.',
  },
  {
    id: 'q-d7-2',
    districtId: 'inference-center',
    levelId: 'level-2',
    milestoneId: 'd7-level-2',
    question:
      'Why does Activation-aware Weight Quantization (AWQ) preserve LLM accuracy at 4-bit (INT4) much better than uniform Round-To-Nearest (RTN) quantization?',
    options: [
      'AWQ keeps 50% of the model weights in FP32.',
      'AWQ observes that ~1% of weight channels process large-magnitude input activations; applying per-channel mathematical scaling to protect those salient channels reduces quantization error without mixed-precision hardware overhead.',
      'AWQ retrains the entire model from scratch for 1 trillion tokens.',
      'AWQ only quantizes the embedding layer.',
    ],
    correctIndex: 1,
    technicalExplanation:
      'Weight salience is determined by activation magnitude (Y = W·X), not weight magnitude alone. Scaling salient channels up before INT4 quantization and fusing the inverse scale into the preceding layer preserves FP16-level perplexity.',
  },
  {
    id: 'q-d7-3',
    districtId: 'inference-center',
    levelId: 'level-3',
    milestoneId: 'd7-level-3',
    question:
      'How does PagedAttention in vLLM eliminate external and internal KV-Cache memory fragmentation?',
    options: [
      'By pre-allocating a contiguous 128K-token buffer for every request.',
      'By partitioning the KV-Cache into fixed-size non-contiguous physical blocks mapped via a virtual block table (like OS virtual memory paging), allocating blocks on-demand as tokens are generated and enabling copy-on-write prefix sharing.',
      'By writing the KV-Cache to a spinning hard drive.',
      'By recomputing all past tokens from scratch on every decode step.',
    ],
    correctIndex: 1,
    technicalExplanation:
      'Contiguous KV reservation wastes 60–80% of GPU VRAM because output length is unknown ahead of time. PagedAttention eliminates external fragmentation completely and limits internal waste to the final small block (<4%), boosting batch capacity by 2x–24x.',
  },
  {
    id: 'q-d7-4',
    districtId: 'inference-center',
    levelId: 'level-4',
    milestoneId: 'd7-level-4',
    question:
      'How does Speculative Decoding achieve 2x–3x faster token generation while mathematically guaranteeing the exact same output distribution as the target LLM?',
    options: [
      'A lightweight draft model proposes K tokens quickly, and the target LLM verifies all K tokens in a single parallel forward pass (compute-bound like prefill), accepting/rejecting via modified rejection sampling that preserves p_target(x).',
      'It replaces the target model permanently with the small draft model.',
      'It skips every other transformer layer.',
      'It only works when temperature = 100.',
    ],
    correctIndex: 0,
    technicalExplanation:
      'Verifying K draft tokens in parallel costs roughly the same HBM weight-bandwidth read as generating 1 token. Rejection sampling (accepting with probability min(1, p_target/p_draft) and resampling from the residual distribution on rejection) guarantees lossless output quality.',
  },

  // ==================== DISTRICT 8: OUTPUT NEXUS & MLOPS TELEMETRY ====================
  {
    id: 'q-d8-1',
    districtId: 'output-terminal',
    levelId: 'level-1',
    milestoneId: 'd8-level-1',
    question:
      'Why are Time-To-First-Token (TTFT) and Inter-Token Latency (ITL / TPOT) tracked as separate SLOs in streaming LLM observability?',
    options: [
      'TTFT measures queueing + compute-bound prompt Prefill latency (perceived responsiveness), whereas ITL measures memory-bandwidth-bound autoregressive Decode speed (reading cadence).',
      'TTFT and ITL are identical numbers.',
      'TTFT only applies to batch offline jobs.',
      'ITL measures network DNS lookup time.',
    ],
    correctIndex: 0,
    technicalExplanation:
      'Long prompts or prefill queue contention spike TTFT, whereas oversized concurrent batch sizes or KV-cache bandwidth saturation degrade ITL. Separating them immediately isolates prefill vs. decode bottlenecks.',
  },
  {
    id: 'q-d8-2',
    districtId: 'output-terminal',
    levelId: 'level-2',
    milestoneId: 'd8-level-2',
    question:
      'What is the core benefit of instrumenting AI pipelines with OpenTelemetry GenAI Semantic Conventions (`gen_ai.*` spans)?',
    options: [
      'It automatically writes Python code for you.',
      'It provides vendor-neutral distributed trace trees linking ingress HTTP requests, vector retrieval spans, MCP tool calls, prompt versions, token counts, and TTFT/ITL latency into unified observability backends (Langfuse, Phoenix, Grafana).',
      'It encrypts model weights on disk.',
      'It replaces Kubernetes.',
    ],
    correctIndex: 1,
    technicalExplanation:
      'In multi-step agentic/RAG systems, a single user request triggers 5–20 sub-calls. OpenTelemetry distributed tracing correlates every span with standardized token/latency attributes to pinpoint cost and latency regressions.',
  },
  {
    id: 'q-d8-3',
    districtId: 'output-terminal',
    levelId: 'level-3',
    milestoneId: 'd8-level-3',
    question:
      'How does Asynchronous Shadow Deployment differ from a Canary Rollout when validating a new candidate LLM in production?',
    options: [
      'Shadow deployment mirrors live production requests asynchronously to the candidate model and logs its outputs/latency for offline judge comparison without ever exposing users to candidate responses.',
      'Shadow deployment shuts down the production model completely.',
      'Canary rollout sends 100% of traffic to the candidate model immediately.',
      'Shadow deployment only works on static HTML files.',
    ],
    correctIndex: 0,
    technicalExplanation:
      'Shadow mirroring tests the candidate model on real production traffic distributions and edge cases with zero user-facing risk, whereas Canary rollouts route a small live percentage (e.g., 5%) of actual user responses to the candidate.',
  },
  {
    id: 'q-d8-4',
    districtId: 'output-terminal',
    levelId: 'level-4',
    milestoneId: 'd8-level-4',
    question:
      'How do SLO-aware LLM Cascades (FrugalGPT / RouteLLM) and Autonomous Data Flywheels compound production system performance over time?',
    options: [
      'A semantic router dispatches 70–80% of routine queries to a fast quantized 8B model and escalates hard queries to a frontier model (cutting cost/latency by >70%), while the flywheel mines low-confidence/corrected traces to continuously fine-tune the smaller model.',
      'They route every query to 10 frontier models simultaneously.',
      'They delete all production logs every 5 minutes.',
      'They disable model evaluation in CI/CD.',
    ],
    correctIndex: 0,
    technicalExplanation:
      'Cascaded semantic routing optimizes the Pareto frontier of cost, latency, and quality immediately, while the data flywheel turns hard production failures into golden SFT/DPO training examples so the small fast model progressively handles more traffic.',
  },
];

export const DISTRICT_QUIZ_MAP: Record<DistrictId, DistrictQuizQuestion[]> =
  DISTRICT_QUIZZES.reduce((acc, q) => {
    if (!acc[q.districtId]) {
      acc[q.districtId] = [];
    }
    acc[q.districtId].push(q);
    return acc;
  }, {} as Record<DistrictId, DistrictQuizQuestion[]>);

export function getDistrictQuizzes(
  districtId: DistrictId
): DistrictQuizQuestion[] {
  return DISTRICT_QUIZ_MAP[districtId] || [];
}
