import type { LanguageCode } from './locales.ts';
import type { DistrictQuizQuestion } from './district-quizzes.ts';

interface LocalizedQuizFields {
  question: string;
  options: [string, string, string, string];
  technicalExplanation: string;
}

const VI_QUIZZES: Record<string, LocalizedQuizFields> = {
  // D1: Input Gateway
  'q-d1-1': {
    question:
      'Tại sao chuẩn hóa Unicode (NFC / NFKC) lại đóng vai trò quyết định trước khi chạy tách token từ vựng trên văn bản thô của người dùng?',
    options: [
      'Nó nén trực tiếp chuỗi UTF-8 thành số nguyên 4-bit trong bộ nhớ GPU.',
      'Các ký tự nhìn giống hệt nhau (ví dụ chữ "é" đơn lẻ so với chữ "e" ghép dấu sắc) có chuỗi byte khác nhau và sẽ làm phân mảnh ID token nếu không được chuẩn hóa.',
      'Nó tự động dịch văn bản tiếng Việt sang mã ASCII trước khi nhúng.',
      'Nó thay thế toàn bộ dấu câu bằng khoảng trắng để tăng tốc độ phân tích regex.',
    ],
    technicalExplanation:
      'Nếu không chuẩn hóa tương thích/hợp thành (NFC/NFKC), các chuỗi tương đương về mặt hiển thị sẽ tạo ra các chuỗi byte khác nhau, làm phân tán xác suất qua các token từ phụ trùng lặp và mở lỗ hổng tấn công prompt bằng ký tự đồng hình (homograph).',
  },
  'q-d1-2': {
    question:
      'Tại sao thuật toán Byte-Pair Encoding (BPE) vượt trội hơn tách từ cấp độ từ vựng (word-level) cho LLM, và Vision Transformer (ViT) tách token một bức ảnh 2D như thế nào?',
    options: [
      'BPE xóa bỏ hoàn toàn các từ hiếm; ViT chạy bộ lọc cạnh Sobel 3×3 trên từng điểm ảnh.',
      'BPE gộp lặp các cặp byte/ký tự xuất hiện nhiều để bao phủ từ vựng mở với độ dài chuỗi ngắn gọn, trong khi ViT chia ảnh thành các mảnh (patch) không chồng lấn (ví dụ 16×16) và chiếu tuyến tính từng mảnh phẳng.',
      'BPE băm mỗi từ thành một số nguyên tố ngẫu nhiên; ViT chuyển ảnh thành phổ âm thanh MP3.',
      'BPE chỉ mã hóa ký tự ASCII; ViT yêu cầu mạng hồi quy LSTM chạy qua từng hàng điểm ảnh.',
    ],
    technicalExplanation:
      'BPE từ phụ cân bằng giữa kích thước từ điển và độ dài chuỗi đồng thời loại bỏ hoàn toàn lỗi từ ngoài từ điển (<UNK>). Tương tự, ViT coi mỗi mảnh 16×16 pixel không chồng lấn như một "token thị giác" thông qua phép chiếu tuyến tính, thống nhất văn bản và thị giác cho kiến trúc Transformer.',
  },
  'q-d1-3': {
    question:
      'Trong cổng tiếp nhận đa phương thức thông lượng cao (>1.000 req/giây), tại sao phải kết hợp gom batch đầu vào động (dynamic ingress batching) với cơ chế kiểm soát áp lực ngược (backpressure) của Apache Kafka?',
    options: [
      'Để ép toàn bộ máy khách phải sử dụng giao thức thăm dò HTTP/1.0 đồng bộ.',
      'Để gom các yêu cầu đến không đều thành các batch tensor tối ưu cho phần cứng, đồng thời đệm các đợt tăng đột biến lưu lượng giúp các cụm GPU phía sau không bị sập do tràn bộ nhớ (OOM).',
      'Để bỏ qua kiểm tra schema và ghi thẳng byte thô chưa kiểm chứng vào thanh ghi GPU.',
      'Để cố tình làm tăng độ trễ Time-To-First-Token.',
    ],
    technicalExplanation:
      'Dynamic batching giúp khấu hao chi phí khởi chạy nhân GPU và bước prefill trên nhiều yêu cầu đồng thời, trong khi điều khiển luồng bằng Kafka/gRPC hấp thụ các đợt tải lên đa phương thức đột biến mà không làm rớt yêu cầu hay tràn bộ nhớ worker.',
  },
  'q-d1-4': {
    question:
      'Cơ chế Native Resolution ViT (NaViT) và từ điển lượng tử hóa thị giác rời rạc VQ-VAE cải thiện điểm gì so với tiền xử lý ảnh độ phân giải cố định (224×224)?',
    options: [
      'NaViT đóng gói các mảnh (patch) có tỷ lệ khung hình biến thiên vào chung một chuỗi mà không làm méo ảnh, còn VQ-VAE lượng tử hóa các mảnh liên tục thành ID từ điển rời rạc để mô hình hóa tự hồi quy thống nhất.',
      'Chúng cắt mọi bức ảnh về kích thước ảnh thu nhỏ đen trắng 32×32.',
      'Chúng yêu cầu huấn luyện một mạng CNN riêng cho từng chiều rộng ảnh.',
      'Chúng chuyển toàn bộ ảnh sang chuỗi base64 rồi đưa vào bộ tách từ văn bản BPE.',
    ],
    technicalExplanation:
      'NaViT sử dụng kỹ thuật đóng gói chuỗi có mặt nạ (masked sequence packing) cùng mã hóa vị trí 2D phân tách để giữ nguyên độ phân giải và tỷ lệ khung hình gốc, trong khi các token rời rạc VQ-VAE/VQGAN cho phép Transformer đa phương thức hợp nhất sớm dự đoán cả ảnh và văn bản trong cùng một từ điển.',
  },

  // D2: Data Lake & Vector Vault
  'q-d2-1': {
    question:
      'Khi các vector nhúng đã được chuẩn hóa đơn vị (chuẩn L2 = 1) được đánh chỉ mục trong kho vector, Độ tương đồng Cosine liên hệ thế nào với Tích vô hướng (Inner Product) và khoảng cách Euclid L2?',
    options: [
      'Độ tương đồng Cosine trở nên hoàn toàn ngẫu nhiên trên các vector đã chuẩn hóa.',
      'Độ tương đồng Cosine bằng chính Tích vô hướng (u · v) và tương đương đơn điệu với bình phương khoảng cách Euclid (||u - v||² = 2 - 2(u · v)), cho phép dùng tập lệnh SIMD dot-product tốc độ cao.',
      'Khoảng cách Euclid bằng 0 đối với mọi cặp vector.',
      'Tích vô hướng đòi hỏi phép nghịch đảo ma trận O(d³) cho mỗi lần so sánh.',
    ],
    technicalExplanation:
      'Khi ||u|| = ||v|| = 1, cos(θ) = u · v và ||u - v||² = 2(1 - u · v). Chuẩn hóa vector trước giúp bộ máy tìm kiếm dùng trực tiếp các nhân SIMD tích vô hướng FMA một lượt thay vì phải tính lại chuẩn độ dài ở thời điểm truy vấn.',
  },
  'q-d2-2': {
    question:
      'Sự đánh đổi cốt lõi được điều khiển bởi tham số `efSearch` trong chỉ mục đồ thị HNSW (Hierarchical Navigable Small World) là gì?',
    options: [
      'Tỷ lệ nén đĩa cứng so với băng thông mạng.',
      'Kích thước danh sách ứng viên động lúc truy vấn: tăng `efSearch` giúp cải thiện độ phủ Recall@K nhưng đánh đổi bằng độ trễ truy vấn cao hơn (nhiều phép tính khoảng cách hơn).',
      'Số lượng bảng SQL được tạo ra trong PostgreSQL.',
      'Số chiều của vector đầu ra từ mô hình nhúng.',
    ],
    technicalExplanation:
      'Khi duyệt đồ thị tham lam trong HNSW, `efSearch` quy định kích thước hàng đợi ưu tiên của các ứng viên gần nhất được khám phá tại tầng 0. Tăng `efSearch` giúp độ phủ tiến sát 100% trong khi độ trễ chỉ tăng dưới tuyến tính.',
  },
  'q-d2-3': {
    question:
      'Tại sao cần kết hợp tìm kiếm từ khóa thưa BM25 với vector nhúng đặc qua Reciprocal Rank Fusion (RRF), sau đó xếp hạng lại bằng Cross-Encoder?',
    options: [
      'BM25 bắt chính xác từ khóa/mã SKU/từ viết tắt mà bi-encoder vector đặc dễ làm mờ, RRF hợp nhất hai danh sách xếp hạng không cần hiệu chuẩn điểm, còn Cross-Encoder áp dụng chú ý chéo toàn diện từng token trên top-K ứng viên.',
      'Vì cơ sở dữ liệu vector đặc không thể lưu quá 1.000 tài liệu.',
      'Vì RRF xóa bỏ 90% cơ sở dữ liệu để tiết kiệm dung lượng ổ cứng.',
      'Cross-Encoder nhanh hơn tìm kiếm HNSW gấp 1.000 lần trên 100 triệu tài liệu.',
    ],
    technicalExplanation:
      'Bi-encoder nén toàn bộ đoạn văn thành một vector đơn lẻ (truy xuất ANN rất nhanh nhưng dễ sót mã định danh hiếm). Tìm kiếm lai BM25 + Dense qua RRF tối đa hóa độ phủ (recall), sau đó Cross-Encoder tính self-attention đầy đủ giữa câu hỏi và top-50 tài liệu để tối đa hóa độ chính xác (precision).',
  },
  'q-d2-4': {
    question:
      'Các mô hình Tương tác trễ (ColBERT / ColPali) khác biệt về mặt kiến trúc so với bi-encoder đơn vector tiêu chuẩn như thế nào?',
    options: [
      'Chúng giữ lại các vector ngữ cảnh hóa cho từng token (hoặc từng mảnh ảnh) và tính toán tử MaxSim tốc độ cao lúc truy vấn, bảo toàn tương tác chi tiết giữa các từ/bố cục thị giác mà không tốn chi phí lớn như Cross-Encoder.',
      'Chúng hoàn toàn không sử dụng mạng nơ-ron.',
      'Chúng nối toàn bộ cơ sở dữ liệu vào một prompt duy nhất.',
      'Chúng bắt buộc phải chạy OCR và tách bảng thủ công trước khi đánh chỉ mục bất kỳ trang PDF nào.',
    ],
    technicalExplanation:
      'ColBERT và ColPali lưu biểu diễn đa vector nhỏ gọn cho mỗi tài liệu/trang ảnh và chấm điểm truy vấn bằng tổng độ tương đồng cosine cực đại (MaxSim), vượt trội hơn hẳn cách gộp thành một vector đơn lẻ trên các câu hỏi đa khía cạnh và bảng biểu phức tạp.',
  },

  // D3: Guardrails & Eval Gate
  'q-d3-1': {
    question:
      'Tại sao Kết nối tắt phần dư (Residual Connections: y = F(x) + x) trong ResNet lại cách mạng hóa cả mạng thị giác máy tính CNN sâu lẫn khung xương sống Transformer hiện đại?',
    options: [
      'Chúng loại bỏ toàn bộ phép nhân ma trận khỏi mạng nơ-ron.',
      'Chúng tạo ra đường cao tốc đồng nhất cho đạo hàm (∂y/∂x = 1 + ∂F/∂x) giúp gradient truyền trực tiếp về các tầng đầu tiên mà không bị triệt tiêu, cho phép huấn luyện mạng sâu trên 100 tầng.',
      'Chúng tự động xóa thông tin cá nhân (PII) khỏi ảnh đầu vào.',
      'Chúng giảm độ phân giải ảnh xuống 1×1 pixel ngay ở tầng đầu tiên.',
    ],
    technicalExplanation:
      'Kết nối cộng đồng nhất đảm bảo ma trận Jacobian của đầu ra tầng đối với đầu vào luôn chứa hạng tử đơn vị, ngăn chặn sự suy giảm gradient khi đi qua hàng chục hoặc hàng trăm khối tích chập hay chú ý.',
  },
  'q-d3-2': {
    question:
      'Khung đánh giá RAGAS tính toán chỉ số Độ trung thực (Faithfulness) như thế nào để phát hiện ảo giác (hallucination) trong hệ thống RAG mà không cần nhãn chuẩn do con người gán?',
    options: [
      'Bằng cách đếm tổng số từ trong câu trả lời.',
      'Bằng cách tách câu trả lời thành các mệnh đề sự kiện nguyên tử và kiểm chứng qua mô hình NLI / LLM-Judge xem tỷ lệ bao nhiêu mệnh đề có thể suy ra trực tiếp từ ngữ cảnh truy xuất được.',
      'Bằng cách đo nhiệt độ GPU trong quá trình suy luận.',
      'Bằng cách kiểm tra xem đầu ra có khớp điểm BLEU-4 bằng 1.0 tuyệt đối hay không.',
    ],
    technicalExplanation:
      'RAGAS Faithfulness = (Số mệnh đề được chứng minh bởi ngữ cảnh truy xuất) / (Tổng số mệnh đề nguyên tử trích xuất từ câu trả lời). Điểm số < 1.0 chỉ đích danh các phát biểu bịa đặt không có căn cứ.',
  },
  'q-d3-3': {
    question:
      'Tại sao một bộ lọc regex đầu vào đơn lẻ lại không đủ khả năng chống lại Tấn công chèn lệnh gián tiếp (Indirect Prompt Injection) và Jailbreak qua chữ trên ảnh?',
    options: [
      'Vì các chỉ thị độc hại có thể ẩn bên trong tài liệu bên thứ ba được truy xuất về hoặc hiển thị dưới dạng điểm ảnh (pixel) trong hình ảnh, đòi hỏi bộ phân loại an toàn ngữ nghĩa 2 lớp (đầu vào + đầu ra) như Llama Guard.',
      'Vì bộ lọc regex không thể chạy trên máy chủ Linux.',
      'Vì hình ảnh không chứa điểm ảnh.',
      'Vì tấn công prompt injection chỉ xảy ra trong giai đoạn tiền huấn luyện.',
    ],
    technicalExplanation:
      'Dữ liệu không tin cậy lấy từ RAG/MCP hoặc đọc từ bộ mã hóa thị giác có thể chiếm quyền điều khiển phân cấp chỉ thị ngay giữa ngữ cảnh. Phòng thủ chiều sâu đòi hỏi tách biệt đặc quyền, phân loại ngữ cảnh đầu vào và kiểm chứng chính sách đầu ra.',
  },
  'q-d3-4': {
    question:
      'Trong lĩnh vực Khả năng giải thích cơ học (Mechanistic Interpretability), Bộ tự mã hóa thưa (Sparse Autoencoders - SAE) giải quyết hiện tượng "đa nghĩa" (polysemanticity) trong các nơ-ron luồng phần dư của Transformer bằng cách nào?',
    options: [
      'Bằng cách xóa bỏ 90% số tầng của mô hình.',
      'Bằng cách chiếu các kích hoạt phần dư đặc lên một từ điển số chiều cao hơn có phạt độ thưa L1, nơi mỗi đặc trưng tiềm ẩn riêng lẻ tương ứng với một khái niệm đơn nghĩa mà con người hiểu được.',
      'Bằng cách chuyển đổi trọng số thành tệp ảnh JPEG.',
      'Bằng cách thay thế cơ chế tự chú ý bằng nhiễu ngẫu nhiên.',
    ],
    technicalExplanation:
      'Các mô hình nén nhiều khái niệm không liên quan chồng chập lên cùng một nhóm nơ-ron (đa nghĩa). SAE quá đầy đủ (overcomplete) tách gỡ các kích hoạt chồng chập này thành các đặc trưng đơn nghĩa thưa có thể kiểm tra và điều hướng nhân quả.',
  },

  // D4: Agentic & MCP Orchestrator
  'q-d4-1': {
    question:
      'Giải mã ràng buộc theo Văn phạm phi ngữ cảnh (CFG) / JSON-Schema đảm bảo 100% đầu ra có cấu trúc hợp lệ về mặt cú pháp từ LLM bằng cơ chế nào?',
    options: [
      'Nó gọi lại LLM 50 lần cho đến khi hàm JSON.parse chạy thành công.',
      'Tại mỗi bước giải mã tự hồi quy, một máy trạng thái hữu hạn (FSM) che mặt nạ (gán logit = -∞) cho mọi token từ vựng nào vi phạm JSON Schema mục tiêu trước khi lấy mẫu softmax.',
      'Nó tinh chỉnh lại toàn bộ mô hình 70B trên mỗi yêu cầu của người dùng.',
      'Nó xóa toàn bộ dấu ngoặc nhọn khỏi câu trả lời của mô hình.',
    ],
    technicalExplanation:
      'Kỹ thuật che mặt nạ logit (logit masking) bằng ôtômat trạng thái hữu hạn biên dịch trước chỉ cho phép lấy mẫu các token tiếp theo hợp lệ theo văn phạm đích, đạt tỷ lệ lỗi cú pháp bằng 0 với độ trễ tăng thêm gần như bằng 0.',
  },
  'q-d4-2': {
    question:
      'Trong Giao thức Ngữ cảnh Mô hình (Model Context Protocol - MCP), Tài nguyên (Resources), Mẫu nhắc (Prompts) và Công cụ (Tools) được phân tách kiến trúc giữa Host, Client và Server như thế nào?',
    options: [
      'MCP Server chạy trực tiếp bên trong bộ nhớ VRAM của GPU chứa LLM.',
      'Ứng dụng Host quản lý ngữ cảnh LLM và quyền hạn, duy trì các kết nối JSON-RPC Client có trạng thái 1:1 với các MCP Server cô lập chuyên cung cấp dữ liệu chỉ đọc (Resources), mẫu tái sử dụng (Prompts) và hành động thực thi (Tools).',
      'Resources, Prompts và Tools đều là các câu lệnh SQL thô được trình duyệt thực thi trực tiếp.',
      'MCP chỉ hỗ trợ duy nhất một công cụ tìm kiếm cố định.',
    ],
    technicalExplanation:
      'MCP tách biệt ứng dụng AI Host khỏi các tích hợp bên ngoài qua giao thức JSON-RPC 2.0 chuẩn hóa với ranh giới bảo mật rõ ràng: Resources do ứng dụng điều khiển, Prompts do người dùng chọn và Tools do mô hình gọi (có phê duyệt).',
  },
  'q-d4-3': {
    question:
      'Tại sao nên dùng đồ thị có chu trình lưu trạng thái (như LangGraph) với điểm lưu (checkpoints) thay vì đồ thị tuyến tính không chu trình (DAG) cho các Agent lập trình và nghiên cứu thực tế?',
    options: [
      'Đồ thị trạng thái có chu trình cho phép lặp vòng Suy luận-Hành động-Quan sát-Kiểm chứng, tự sửa lỗi dựa trên phản hồi trình biên dịch khi công cụ thất bại, và tạm dừng/tiếp tục bền vững để chờ con người phê duyệt (HITL).',
      'Đồ thị DAG tuyến tính tốn quá nhiều bộ nhớ GPU.',
      'Đồ thị có chu trình không bao giờ cần xử lý lỗi.',
      'LangGraph tự động biên dịch mã Python sang phần cứng Verilog.',
    ],
    technicalExplanation:
      'Các luồng công việc Agent thực tế đòi hỏi vòng lặp có điều kiện (chạy test -> đọc lỗi -> sửa code -> chạy lại test) và lưu trữ trạng thái bền vững để các tác vụ dài hạn có thể tạm dừng chờ phê duyệt hoặc phục hồi sau sự cố.',
  },
  'q-d4-4': {
    question:
      'Cây tư duy (Tree-of-Thoughts - ToT) / Tìm kiếm cây Monte Carlo (MCTS) kết hợp với Mô hình phần thưởng quá trình (PRM) cải thiện suy luận phức tạp so với giải mã tham lam một chuỗi đơn như thế nào?',
    options: [
      'Nó sinh các token theo thứ tự bảng chữ cái ngược.',
      'Nó phân nhánh nhiều bước suy luận ứng viên, chấm điểm tính hợp lệ của từng bước trung gian bằng PRM, và lan truyền ngược giá trị ước lượng để cắt tỉa các nhánh suy luận sai trước khi chốt kết quả.',
      'Nó đặt nhiệt độ (temperature) về 0.0 và tắt cơ chế chú ý.',
      'Nó giảm lượng token sử dụng xuống chỉ còn 1 token duy nhất.',
    ],
    technicalExplanation:
      'Giải mã tham lam tự hồi quy không thể quay lui một khi tiền đề sai đã lọt vào ngữ cảnh. Tìm kiếm cây được dẫn hướng bởi Mô hình phần thưởng quá trình (PRM) phân bổ năng lực tính toán lúc suy luận để khám phá, kiểm chứng và quay lui qua các nhánh suy luận.',
  },

  // D5: Training Foundry
  'q-d5-1': {
    question:
      'Tại sao bộ tối ưu AdamW (Suy giảm trọng số tách rời) lại khái quát hóa tốt hơn hẳn so với Adam tiêu chuẩn dùng điều chuẩn L2 khi huấn luyện mạng Transformer?',
    options: [
      'Trong Adam tiêu chuẩn, đạo hàm điều chuẩn L2 bị chia tỷ lệ theo nghịch đảo phương sai thích nghi (√v_t), khiến các tham số có gradient lịch sử lớn bị điều chuẩn yếu đi; AdamW tách rời bước suy giảm trọng số khỏi bước cập nhật gradient thích nghi.',
      'AdamW không tính toán mô-men bậc nhất hay bậc hai.',
      'AdamW chỉ cập nhật hệ số chệch (bias) của các tầng tuyến tính.',
      'AdamW không tốn bất kỳ bộ nhớ nào cho trạng thái bộ tối ưu.',
    ],
    technicalExplanation:
      'Gộp phạt L2 vào đạo hàm trước khi chuẩn hóa mô-men trong Adam làm biến dạng mức suy giảm trọng số giữa các tham số có biên độ gradient khác nhau. Tách rời bước suy giảm trọng số (θ_t = (1 - λ)θ_{t-1} - η·m̂_t/√v̂_t) khôi phục tính điều chuẩn đồng đều.',
  },
  'q-d5-2': {
    question:
      'Tại sao định dạng BF16 (Brain Float 16) ngăn chặn tràn dưới/tràn trên gradient tốt hơn FP16 mà không cần nhân tỷ lệ mất mát động, và LoRA giảm VRAM khi tinh chỉnh bằng cách nào?',
    options: [
      'BF16 dùng 64 bit cho mỗi số; LoRA xóa đi một nửa từ điển.',
      'BF16 giữ nguyên trọn vẹn 8 bit số mũ của FP32 (bảo toàn dải động lớn), trong khi LoRA đóng băng trọng số gốc W₀ và chỉ huấn luyện các ma trận hạng thấp ΔW = B·A (r ≪ d), giảm trên 99% bộ nhớ trạng thái optimizer.',
      'BF16 không có bit phần định trị nào; LoRA biến Transformer thành cây quyết định.',
      'BF16 chỉ chạy được trên CPU.',
    ],
    technicalExplanation:
      'FP16 chỉ có 5 bit số mũ (cực đại ~65.504), rất dễ tràn số khi tính chú ý và đạo hàm. BF16 giữ nguyên 8 bit số mũ của FP32 (dải động ~3.4×10³⁸), còn LoRA loại bỏ hoàn toàn bộ nhớ trạng thái Adam khổng lồ của các trọng số gốc đã đóng băng.',
  },
  'q-d5-3': {
    question:
      'DeepSpeed ZeRO Giai đoạn 3 (và PyTorch FSDP) phân mảnh (shard) những thành phần nào qua các GPU song song dữ liệu so với ZeRO Giai đoạn 1 và Giai đoạn 2?',
    options: [
      'ZeRO-1 chỉ phân mảnh tập dữ liệu huấn luyện; ZeRO-3 xóa bỏ hoàn toàn đạo hàm.',
      'ZeRO-1 phân mảnh Trạng thái Bộ tối ưu, ZeRO-2 phân mảnh Trạng thái Bộ tối ưu + Đạo hàm (Gradients), và ZeRO-3 (FSDP) phân mảnh cả Trạng thái Bộ tối ưu + Đạo hàm + Tham số Mô hình, thu gom tham số tức thời theo từng tầng qua phép All-Gather.',
      'ZeRO-3 nhân bản toàn bộ mô hình lên 8 lần trên mỗi GPU.',
      'ZeRO-3 chỉ phân mảnh bộ nhớ RAM của CPU.',
    ],
    technicalExplanation:
      'Trong huấn luyện Adam độ chính xác hỗn hợp, trạng thái bộ tối ưu tốn 12 byte/tham số, đạo hàm tốn 2 byte và trọng số tốn 2 byte. ZeRO-3 chia đều cả 16 byte/tham số này qua N GPU, giảm bộ nhớ trạng thái trên mỗi GPU xuống 1/N.',
  },
  'q-d5-4': {
    question:
      'Thuật toán Tối ưu hóa thị hiếu trực tiếp (DPO) và Tối ưu hóa chính sách tương đối theo nhóm (GRPO) đơn giản hóa việc căn chỉnh hậu huấn luyện so với PPO cổ điển như thế nào?',
    options: [
      'DPO tối ưu hóa giải tích xác suất chính sách trực tiếp trên các cặp câu trả lời được chọn/bị loại mà không cần huấn luyện Mô hình phần thưởng riêng, còn GRPO loại bỏ hoàn toàn mạng Critic (Value) bằng cách chuẩn hóa lợi thế (advantage) trên một nhóm mẫu sinh ra cho mỗi prompt.',
      'Chúng hoàn toàn không sử dụng tín hiệu thị hiếu hay phần thưởng nào.',
      'Chúng đòi hỏi phải huấn luyện đồng thời 4 mô hình Critic riêng biệt.',
      'Chúng chỉ hoạt động trên các mô hình nhỏ hơn 100 triệu tham số.',
    ],
    technicalExplanation:
      'RLHF-PPO cổ điển cần giữ 4 mô hình trong bộ nhớ (Policy, Reference, Reward, Value Critic). DPO tham số hóa lại hàm phần thưởng trực tiếp theo tỷ số log xác suất của policy, còn GRPO thay thế mạng Critic ngốn bộ nhớ bằng đường cơ sở điểm chuẩn z-score trong nhóm mẫu.',
  },

  // D6: Model Core & Registry
  'q-d6-1': {
    question:
      'Tại sao các khối Transformer hiện đại đều ưu tiên dùng Pre-RMSNorm (chuẩn hóa trước tầng Attention/FFN) thay vì đặt Post-LayerNorm ở sau như kiến trúc gốc năm 2017?',
    options: [
      'Pre-RMSNorm giữ cho luồng phần dư chính không bị chuẩn hóa chắn ngang, giúp đạo hàm đồng nhất truyền thẳng từ đầu ra về đầu vào không bị biến dạng khuếch đại, ổn định việc huấn luyện mạng sâu mà không cần giai đoạn warmup dài.',
      'Post-LayerNorm không thể tính toán được trên GPU.',
      'Pre-RMSNorm làm tăng 50% số lượng tham số mô hình.',
      'Pre-RMSNorm xóa bỏ toàn bộ các kết nối phần dư.',
    ],
    technicalExplanation:
      'Trong kiến trúc Pre-Norm (x_{l+1} = x_l + F(Norm(x_l))), đường cao tốc phần dư là một tổng sạch của các bước cập nhật tầng, ngăn chặn bùng nổ gradient lúc khởi tạo, đồng thời RMSNorm tiết kiệm 7–15% chi phí tính toán nhờ bỏ qua bước trừ trung bình.',
  },
  'q-d6-2': {
    question:
      'Tại sao chúng ta phải chia tích vô hướng Query-Key cho √d_k trong công thức Chú ý tích vô hướng có tỷ lệ: softmax(QKᵀ / √d_k)V?',
    options: [
      'Để chuyển đổi số thực dấu phẩy động thành số nguyên.',
      'Khi số chiều mỗi đầu chú ý d_k tăng lên, phương sai của tích vô hướng Q·K tăng tỷ lệ thuận với d_k, đẩy hàm softmax vào vùng bão hòa có đạo hàm cực nhỏ gần bằng 0 nếu không được chia tỷ lệ cho 1/√d_k.',
      'Để rút ngắn độ dài ngữ cảnh đi d_k lần.',
      'Để biến ma trận chú ý thành ma trận đối xứng.',
    ],
    technicalExplanation:
      'Nếu các thành phần của q và k có trung bình bằng 0 và phương sai bằng 1, tích vô hướng của chúng sẽ có phương sai bằng d_k. Chia cho √d_k giúp đưa phương sai trở về 1 trước khi qua softmax, tránh hiện tượng bão hòa one-hot cực đoan và duy trì luồng gradient.',
  },
  'q-d6-3': {
    question:
      'Cơ chế Chú ý truy vấn nhóm (GQA) giảm băng thông bộ nhớ lúc suy luận so với Đa đầu chú ý (MHA) như thế nào, và tại sao FlashAttention tăng tốc 2x–4x mà không hề xấp xỉ?',
    options: [
      'GQA chia sẻ chung một đầu Key/Value cho một nhóm đầu Query (giảm 4x–8x dung lượng KV-Cache), trong khi FlashAttention chia ô Q, K, V trên bộ nhớ SRAM tốc độ cao của GPU kết hợp online softmax để không bao giờ phải đọc/ghi ma trận chú ý N×N ra bộ nhớ HBM chậm.',
      'GQA bỏ đi 75% số token đầu vào; FlashAttention xấp xỉ ma trận chú ý bằng phân rã SVD hạng thấp.',
      'GQA chỉ dùng duy nhất 1 đầu Query; FlashAttention chạy trên bộ nhớ đệm CPU.',
      'Cả hai phương pháp đều không ảnh hưởng đến lưu lượng bộ nhớ HBM.',
    ],
    technicalExplanation:
      'Giải mã tự hồi quy bị nghẽn bởi việc nạp KV-cache từ HBM—GQA thu nhỏ đáng kể dung lượng KV-cache mà hầu như không giảm chất lượng. FlashAttention loại bỏ hoàn toàn các lượt đọc/ghi HBM bậc O(N²) bằng cách hợp nhất phép tính chú ý vào một nhân chia ô trên SRAM.',
  },
  'q-d6-4': {
    question:
      'Trong mô hình Hỗn hợp chuyên gia thưa (Sparse MoE như Mixtral / DeepSeekMoE), tại sao việc cân bằng tải giữa các chuyên gia được định tuyến lại sống còn khi huấn luyện và phục vụ?',
    options: [
      'Nếu không cân bằng tải, hiện tượng sụp đổ bộ định tuyến (router collapse) sẽ dồn mọi token vào cùng 1–2 chuyên gia—lãng phí dung lượng tham số của các chuyên gia khác và gây nghẽn cổ chai nghiêm trọng trên các GPU bị quá tải trong Song song Chuyên gia.',
      'Cân bằng tải đảm bảo mỗi token luôn kích hoạt 100% toàn bộ các chuyên gia.',
      'Mô hình MoE không sử dụng mạng Feed-Forward.',
      'Cân bằng tải chỉ cần thiết khi kích thước batch bằng 1.',
    ],
    technicalExplanation:
      'Sparse MoE tách biệt tổng tham số khỏi số FLOPs hoạt động trên mỗi token nhờ định tuyến Top-K. Nếu bộ định tuyến dồn tải vào một vài chuyên gia, dung lượng tri thức bị lãng phí và các nút GPU trong cụm Expert Parallelism sẽ phải chờ đợi các GPU bị quá tải.',
  },

  // D7: Inference Engine
  'q-d7-1': {
    question:
      'Theo Mô hình hiệu năng GPU Roofline, tại sao giai đoạn Prefill của LLM bị giới hạn bởi tính toán (compute-bound) trong khi giai đoạn giải mã tự hồi quy Decode lại bị giới hạn bởi băng thông bộ nhớ (memory-bandwidth-bound)?',
    options: [
      'Prefill xử lý song song toàn bộ các token trong prompt (cường độ số học cao: nhân Ma trận×Ma trận nhiều FLOPs trên mỗi byte trọng số nạp vào), trong khi Decode sinh từng token một cho mỗi chuỗi (cường độ số học thấp: phải truyền toàn bộ trọng số mô hình + KV cache từ HBM chỉ để nhân Ma trận×Vector mảnh).',
      'Prefill chạy trên CPU còn Decode chạy trên GPU.',
      'Giai đoạn Decode không sử dụng bộ đệm KV cache.',
      'Prefill dùng định dạng INT4 còn Decode dùng định dạng FP64.',
    ],
    technicalExplanation:
      'Trong bước Prefill, nạp trọng số mô hình một lần từ HBM phục vụ đồng thời N token của prompt (tỷ lệ FLOPs/Byte rất cao). Trong bước Decode ở kích thước batch nhỏ, GPU phải truyền hàng chục gigabyte trọng số và KV-cache từ HBM chỉ để sinh ra duy nhất 1 token cho mỗi yêu cầu.',
  },
  'q-d7-2': {
    question:
      'Tại sao Lượng tử hóa trọng số nhận biết kích hoạt (AWQ) lại giữ được độ chính xác của LLM ở mức 4-bit (INT4) tốt hơn hẳn so với lượng tử hóa làm tròn đều (Round-To-Nearest - RTN)?',
    options: [
      'AWQ giữ lại 50% trọng số của mô hình ở định dạng FP32.',
      'AWQ quan sát thấy khoảng 1% kênh trọng số xử lý các kích hoạt đầu vào có biên độ lớn; việc nhân tỷ lệ toán học theo từng kênh để bảo vệ các kênh quan trọng này giúp giảm mạnh sai số lượng tử hóa mà không tốn chi phí phần cứng độ chính xác hỗn hợp.',
      'AWQ huấn luyện lại toàn bộ mô hình từ đầu trên 1 nghìn tỷ token.',
      'AWQ chỉ lượng tử hóa duy nhất tầng nhúng từ vựng.',
    ],
    technicalExplanation:
      'Tầm quan trọng của trọng số được quyết định bởi biên độ kích hoạt đầu vào (Y = W·X) chứ không chỉ bản thân độ lớn trọng số. Nhân tỷ lệ phóng đại các kênh quan trọng trước khi lượng tử hóa INT4 và gộp hệ số nghịch đảo vào tầng liền trước giúp bảo toàn chất lượng tương đương FP16.',
  },
  'q-d7-3': {
    question:
      'Cơ chế PagedAttention trong vLLM loại bỏ hiện tượng phân mảnh bộ nhớ trong và ngoài của KV-Cache bằng cách nào?',
    options: [
      'Bằng cách cấp phát trước một vùng đệm liên tục 128K token cho mọi yêu cầu.',
      'Bằng cách chia bộ đệm KV-Cache thành các khối vật lý kích thước cố định không cần nằm liên tiếp nhau, được ánh xạ qua bảng khối ảo (tương tự phân trang bộ nhớ ảo của Hệ điều hành), cấp phát khối theo nhu cầu khi sinh token và hỗ trợ chia sẻ tiền tố copy-on-write.',
      'Bằng cách ghi toàn bộ KV-Cache ra ổ đĩa cứng cơ học.',
      'Bằng cách tính toán lại toàn bộ các token quá khứ từ đầu ở mỗi bước giải mã.',
    ],
    technicalExplanation:
      'Đặt chỗ bộ nhớ KV liên tục gây lãng phí 60–80% VRAM của GPU vì không thể biết trước độ dài câu trả lời. PagedAttention xóa bỏ hoàn toàn phân mảnh ngoài và giới hạn phần dư bên trong chỉ ở khối nhỏ cuối cùng (<4%), giúp tăng dung lượng batch từ 2x–24x.',
  },
  'q-d7-4': {
    question:
      'Giải mã đầu cơ (Speculative Decoding) đạt tốc độ sinh token nhanh gấp 2x–3x trong khi vẫn đảm bảo toán học phân phối đầu ra giống hệt 100% mô hình LLM đích bằng cơ chế nào?',
    options: [
      'Một mô hình nháp nhỏ gọn đề xuất nhanh K token, sau đó mô hình LLM đích kiểm chứng toàn bộ K token chỉ trong một lượt truyền tiến song song duy nhất (tận dụng tính toán như prefill), chấp nhận/bác bỏ qua thuật toán lấy mẫu bác bỏ có hiệu chỉnh bảo toàn phân phối p_target(x).',
      'Nó thay thế vĩnh viễn mô hình đích bằng mô hình nháp nhỏ.',
      'Nó bỏ qua xen kẽ một nửa số tầng Transformer.',
      'Nó chỉ hoạt động khi đặt tham số temperature = 100.',
    ],
    technicalExplanation:
      'Kiểm chứng song song K token nháp chỉ tốn băng thông đọc trọng số HBM tương đương với việc sinh 1 token đơn lẻ. Kỹ thuật lấy mẫu bác bỏ (chấp nhận với xác suất min(1, p_target/p_draft) và lấy mẫu lại từ phân phối phần dư khi bác bỏ) đảm bảo chất lượng đầu ra không suy suyển.',
  },

  // D8: Output Nexus & MLOps Telemetry
  'q-d8-1': {
    question:
      'Tại sao Thời gian tới Token đầu tiên (TTFT) và Độ trễ giữa các Token (ITL / TPOT) lại được theo dõi như hai chỉ số cam kết dịch vụ (SLO) tách biệt trong hệ thống quan sát LLM truyền luồng?',
    options: [
      'TTFT đo thời gian xếp hàng cộng với độ trễ Prefill xử lý prompt (độ phản hồi ban đầu mà người dùng cảm nhận), trong khi ITL đo tốc độ giải mã tự hồi quy Decode giới hạn bởi băng thông bộ nhớ (nhịp độ đọc văn bản đang chảy ra).',
      'TTFT và ITL là hai con số hoàn toàn giống nhau.',
      'TTFT chỉ áp dụng cho các tác vụ chạy batch ngoại tuyến.',
      'ITL dùng để đo thời gian phân giải tên miền DNS của mạng.',
    ],
    technicalExplanation:
      'Prompt dài hoặc nghẽn hàng đợi prefill sẽ làm tăng vọt TTFT, trong khi kích thước batch đồng thời quá lớn hoặc bão hòa băng thông đọc KV-cache sẽ làm suy giảm ITL. Tách riêng hai chỉ số giúp khoanh vùng ngay lập tức điểm nghẽn nằm ở giai đoạn prefill hay decode.',
  },
  'q-d8-2': {
    question:
      'Lợi ích cốt lõi của việc gắn đo lường các pipeline AI bằng Quy ước ngữ nghĩa OpenTelemetry GenAI (các span `gen_ai.*`) là gì?',
    options: [
      'Nó tự động viết mã nguồn Python thay cho kỹ sư.',
      'Nó cung cấp cây truy vết phân tán trung lập nhà cung cấp, liên kết yêu cầu HTTP đầu vào, bước truy xuất vector, lời gọi công cụ MCP, phiên bản prompt, số lượng token và độ trễ TTFT/ITL vào chung các nền tảng quan sát (Langfuse, Phoenix, Grafana).',
      'Nó mã hóa trọng số mô hình trên ổ đĩa.',
      'Nó thay thế hoàn toàn hệ thống điều phối Kubernetes.',
    ],
    technicalExplanation:
      'Trong hệ thống RAG hoặc Agent đa bước, một yêu cầu của người dùng có thể kích hoạt 5–20 lời gọi phụ. Truy vết phân tán OpenTelemetry gắn kết mọi span với các thuộc tính token/độ trễ chuẩn hóa để chỉ ra chính xác bước nào gây đội chi phí hoặc tăng độ trễ.',
  },
  'q-d8-3': {
    question:
      'Triển khai phản chiếu ngầm bất đồng bộ (Shadow Deployment) khác với Triển khai cuốn chiếu (Canary Rollout) như thế nào khi kiểm định một mô hình LLM ứng viên mới trên môi trường thực tế?',
    options: [
      'Shadow deployment nhân bản bất đồng bộ các yêu cầu thực tế sang mô hình ứng viên và ghi lại đầu ra/độ trễ để chấm điểm đối sánh ngoại tuyến mà không bao giờ trả câu trả lời của mô hình ứng viên cho người dùng thật.',
      'Shadow deployment tắt hoàn toàn mô hình đang chạy chính thức.',
      'Canary rollout chuyển ngay lập tức 100% lưu lượng sang mô hình ứng viên.',
      'Shadow deployment chỉ hoạt động trên các tệp HTML tĩnh.',
    ],
    technicalExplanation:
      'Phản chiếu ngầm (Shadow mirroring) kiểm thử mô hình ứng viên trên đúng phân phối lưu lượng và các ca khó thực tế với rủi ro bằng 0 cho người dùng, trong khi Canary rollout định tuyến một tỷ lệ nhỏ (ví dụ 5%) phản hồi thực tế của người dùng sang mô hình mới.',
  },
  'q-d8-4': {
    question:
      'Chuỗi thác mô hình nhận biết SLO (FrugalGPT / RouteLLM) kết hợp với Bánh đà dữ liệu tự hành (Autonomous Data Flywheel) giúp nhân lên hiệu năng hệ thống theo thời gian như thế nào?',
    options: [
      'Bộ định tuyến ngữ nghĩa chuyển 70–80% truy vấn thông thường sang mô hình 8B lượng tử hóa tốc độ cao và chỉ chuyển các truy vấn khó lên mô hình tiên phong (giảm >70% chi phí và độ trễ), đồng thời bánh đà dữ liệu khai thác các ca khó/đã sửa để liên tục tinh chỉnh cho mô hình nhỏ thông minh hơn.',
      'Chúng gửi mọi câu hỏi tới 10 mô hình lớn cùng một lúc.',
      'Chúng xóa sạch toàn bộ nhật ký vận hành sau mỗi 5 phút.',
      'Chúng tắt hoàn toàn bước đánh giá mô hình trong quy trình CI/CD.',
    ],
    technicalExplanation:
      'Định tuyến phân tầng theo ngữ nghĩa tối ưu hóa ngay lập tức đường biên Pareto giữa chi phí, độ trễ và chất lượng, trong khi bánh đà dữ liệu biến các ca lỗi khó trong thực tế thành dữ liệu huấn luyện SFT/DPO quý giá để mô hình nhỏ ngày càng gánh được tỷ lệ lưu lượng lớn hơn.',
  },
};

const JA_QUIZZES: Record<string, LocalizedQuizFields> = {
  'q-d1-1': {
    question:
      '生のユーザーテキストに対して語彙トークン化を実行する前に、Unicode正規化（NFC / NFKC）が不可欠な理由は何ですか？',
    options: [
      'UTF-8文字列をGPUメモリ内で直接4ビット整数に圧縮するため。',
      '見た目が同じ文字（単一コードポイントの「é」と「e＋結合アクセント」など）が異なるバイト列になり、正規化しないとトークンIDが断片化するため。',
      '非英語テキストを埋め込み前に自動的にASCIIへ翻訳するため。',
      'すべての句読点を空白に置換して正規表現の解析を高速化するため。',
    ],
    technicalExplanation:
      'NFC/NFKC正規化を行わないと、視覚的に等価な文字列が異なるバイト列を生成し、重複するサブワードトークン間で確率質量が分散されるほか、ホモグラフ攻撃の温床となります。',
  },
  'q-d1-2': {
    question:
      'LLMにおいてByte-Pair Encoding (BPE) が単語レベルトークン化より優れている理由と、Vision Transformer (ViT) が2D画像をトークン化する仕組みはどれですか？',
    options: [
      'BPEは希少語を完全に削除し、ViTは全ピクセルに3×3 Sobelエッジ検出を適用する。',
      'BPEは頻出するバイト/文字ペアを反復統合して未知語なしでコンパクトな系列長を実現し、ViTは画像を非重複パッチ（例: 16×16）に分割して各パッチを線形射影する。',
      'BPEは各単語をランダムな素数にハッシュ化し、ViTは画像をMP3スペクトログラムに変換する。',
      'BPEはASCII文字のみを符号化し、ViTは画像の各行にLSTMを適用する。',
    ],
    technicalExplanation:
      'サブワードBPEは語彙サイズと系列長のバランスを取りつつ未知語(<UNK>)を排除します。同様にViTは16×16ピクセルの非重複パッチを線形射影によって「視覚トークン」として扱い、テキストと視覚を単一のTransformer構造で統合します。',
  },
  'q-d1-3': {
    question:
      '高スループットなマルチモーダル取り込みゲートウェイ（1,000+ req/秒）において、動的イングレスバッチングとApache Kafkaのバックプレッシャーを組み合わせる理由は？',
    options: [
      'すべてのクライアントに同期HTTP/1.0ポーリングを強制するため。',
      '不規則に到着するリクエストをGPU効率の高いテンソルバッチにまとめつつ、トラフィックスパイクをバッファリングして下流GPUワーカーのOOMクラッシュを防ぐため。',
      'スキーマ検証を迂回して未検証の生バイトをGPUレジスタへ直接書き込むため。',
      'Time-To-First-Tokenの遅延を意図的に増加させるため。',
    ],
    technicalExplanation:
      '動的バッチングはGPUカーネル起動やPrefillのオーバーヘッドを複数リクエストで償却し、Kafka/gRPCのフロー制御はバースト的なアップロードを吸収してメモリ枯渇やリクエスト欠손を防ぎます。',
  },
  'q-d1-4': {
    question:
      'Native Resolution ViT (NaViT) と VQ-VAE離散視覚コードブックは、固定解像度（224×224）の画像前処理をどのように改善しますか？',
    options: [
      'NaViTは可変アスペクト比のパッチを歪みなく単一シーケンスにパッキングし、VQ-VAEは連続パッチを離散コードブックIDに量子化して統一的な自己回帰モデル学習を可能にする。',
      'すべての画像を32×32のグレースケールサムネイルに切り抜く。',
      '画像の横幅ごとに個別のCNNを学習させる必要がある。',
      'すべての画像をbase64文字列に変換してからBPEテキストトークナイザに入力する。',
    ],
    technicalExplanation:
      'NaViTはマスク付きシーケンスパッキングと2D位置埋め込みにより元の解像度と縦横比を維持し、VQ-VAE/VQGAN離散トークンは画像とテキストを単一の共有語彙で予測するEarly-Fusionマルチモーダル学習を実現します。',
  },
  'q-d2-1': {
    question:
      '単位正規化（L2ノルム = 1）された埋め込みベクトルをインデックス化する際、コサイン類似度は内積（ドット積）およびユークリッドL2距離とどのような関係にありますか？',
    options: [
      '正規化されたベクトル上ではコサイン類似度は完全にランダムになる。',
      'コサイン類似度は内積 (u · v) と完全に一致し、二乗ユークリッド距離 (||u - v||² = 2 - 2(u · v)) と単調等価になるため、高速なSIMD内積命令をそのまま利用できる。',
      'すべてのベクトル対でユークリッド距離がゼロになる。',
      '内積の計算に1回あたりO(d³)の逆行列演算が必要になる。',
    ],
    technicalExplanation:
      '||u|| = ||v|| = 1 のとき cos(θ) = u · v かつ ||u - v||² = 2(1 - u · v) となります。事前正規化により、検索時にノルム除算を行うことなく高速なFMA内積SIMDカーネルで距離計算が完結します。',
  },
  'q-d2-2': {
    question:
      'HNSW（Hierarchical Navigable Small World）グラフインデックスにおける `efSearch` パラメータが制御する主なトレードオフは何ですか？',
    options: [
      'ディスク圧縮率とネットワーク帯域幅のトレードオフ。',
      '検索時の動的候補リストサイズ：`efSearch` を増やすと Recall@K（検索再現率）が向上する代わりに、距離計算回数が増えてクエリ遅延が増加する。',
      'PostgreSQL内に作成されるSQLテーブルの数。',
      '埋め込みモデルが出力するベクトルの次元数。',
    ],
    technicalExplanation:
      'HNSWの貪欲グラフ探索において、`efSearch` はレイヤー0で探索する近傍候補優先度キューのサイズを決定します。値を大きくすると厳密検索に近いRecallが得られますが、計算量は準線形に増加します。',
  },
  'q-d2-3': {
    question:
      'BM25疎語彙検索と高密度ベクトル検索をReciprocal Rank Fusion (RRF) で統合し、さらにCross-Encoderでリランキングする理由は何ですか？',
    options: [
      'BM25が型番や専門用語の厳密一致を捉え、RRFがスコア正規化なしで両ランキングを融合し、Cross-Encoderが上位K件に対して全トークン間のCross-Attentionを計算して精度を最大化するため。',
      '高密度ベクトルDBは1,000件以上の文書を保存できないため。',
      'RRFがディスク容量節約のためにデータベースの90%を削除するため。',
      '1億件の文書に対してCross-EncoderがHNSWより1,000倍高速なため。',
    ],
    technicalExplanation:
      'Bi-Encoderは文書を単一ベクトルに圧縮するため高速ですが希少な固有名詞を取りこぼすことがあります。BM25＋高密度ベクトルのRRF融合でRecallを最大化し、上位候補のみCross-Encoderで精査することで高精度と低遅延を両立します。',
  },
  'q-d2-4': {
    question:
      '遅延相互作用モデル（ColBERT / ColPali）は、標準的な単一ベクトルBi-Encoderとアーキテクチャ上どのように異なりますか？',
    options: [
      'トークン（または画像パッチ）ごとの文脈化ベクトルを保持し、検索時に高速なMaxSim演算を行うことで、Cross-Encoderの高コストを避けつつ細粒度の相互作用を維持する。',
      'ニューラルネットワークを一切使用しない。',
      'データベース全体を1つの巨大なプロンプトに連結する。',
      'PDFページをインデックス化する前に必ずOCRと手動の表解析を必要とする。',
    ],
    technicalExplanation:
      'ColBERTやColPaliは文書・ページ単位でマルチベクトル表現を保持し、最大コサイン類似度の和（MaxSim）でスコアリングすることで、複雑な表やレイアウトを含む検索で単一ベクトルを大きく上回る精度を達成します。',
  },
  'q-d3-1': {
    question:
      'ResNetの残差結合（y = F(x) + x）が深層コンピュータビジョンCNNと現代のTransformerバックボーンの両方に革命をもたらした理由は？',
    options: [
      'ニューラルネットワークから行列乗算を完全に排除したため。',
      '恒等勾配ハイウェイ（∂y/∂x = 1 + ∂F/∂x）を形成し、勾配が消失せず初期層へ直接伝播することで100層以上の深層学習を可能にしたため。',
      '入力画像から個人情報を自動的に除去するため。',
      '最初の層で画像解像度を1×1ピクセルに縮小するため。',
    ],
    technicalExplanation:
      '加算的な恒等スキップ結合により、層出力の入力に対するヤコビ行列に常に恒等項が含まれるようになり、深い畳み込み層やAttention層を重ねても勾配減衰が発生しなくなります。',
  },
  'q-d3-2': {
    question:
      'RAGASフレームワークは、正解ラベルなしでRAGパイプラインのハルシネーションを検出する「Faithfulness（忠実度）」指標をどのように計算しますか？',
    options: [
      '生成された回答の総単語数を数える。',
      '生成回答を原子的な事実主張（クレーム）に分解し、そのうち検索されたコンテキストから論理的に推論可能な主張の割合をNLI / LLM-Judgeで検証する。',
      '推論中のGPU温度を測定する。',
      '出力がBLEU-4スコア1.0と完全一致するかを確認する。',
    ],
    technicalExplanation:
      'RAGAS Faithfulness = （検索コンテキストで裏付けられる主張数）÷（回答から抽出された全主張数）で算出され、1.0未満の場合は根拠のないハルシネーションが含まれていることを特定できます。',
  },
  'q-d3-3': {
    question:
      '間接プロンプトインジェクションや画像内の文字によるマルチモーダル脱獄（Typographic Jailbreak）に対して、単純な入力正規表現フィルタでは不十分な理由は？',
    options: [
      '悪意ある命令が検索された外部文書内や画像のピクセル内に埋め込まれる可能性があり、Llama Guardのような意味論的な二層（入力＋出力）安全性分類器が必要となるため。',
      '正規表現フィルタはLinuxサーバー上で動作しないため。',
      '画像にはピクセルが含まれないため。',
      'プロンプトインジェクションは事前学習中にしか発生しないため。',
    ],
    technicalExplanation:
      'RAG/MCP経由で取得した外部データや視覚エンコーダが読み取った画像内テキストは文脈途中で命令階層を乗っ取る恐れがあるため、権限分離と入出力双方のセマンティック検証による多層防御が不可欠です。',
  },
  'q-d3-4': {
    question:
      '機械論的解釈可能性において、Sparse Autoencoder (SAE) はTransformer残差ストリーム内の「多義性（Polysemanticity）」をどのように解消しますか？',
    options: [
      'モデルの層の90%を削除する。',
      '密な残差アクティベーションをL1スパース制約付きの高次元辞書へ射影し、人間が解釈可能な単一概念に対応するモノセマンティック特徴へと分離する。',
      'モデルの重みをJPEGファイルに変換する。',
      '自己注意機構をランダムノイズに置き換える。',
    ],
    technicalExplanation:
      'ニューラルネットは限られたニューロンに多数の無関係な概念を重ね合わせて表現（重ね合わせと多義性）します。過完備SAEはこれらを疎な単一意味特徴へと解きほぐし、内部状態の検査や因果的な振る舞い制御を可能にします。',
  },
  'q-d4-1': {
    question:
      '文脈自由文法 (CFG) やJSON Schemaによる制約付きデコーディングが、LLMから100%構文的に有効な構造化出力を保証できる仕組みは？',
    options: [
      'JSON.parseが成功するまでLLMを50回再試行する。',
      '自己回帰デコードの各ステップで、有限状態オートマトンが目標スキーマに違反する語彙トークンのロジットを -∞ にマスクしてからSoftmaxサンプリングを行う。',
      'ユーザーリクエストごとに70Bモデル全体を微調整する。',
      'モデルの応答からすべての波括弧を除去する。',
    ],
    technicalExplanation:
      '事前コンパイルされた有限状態機械(FSM)によるロジットマスキングにより、文法的に有効な次トークンのみがサンプリング対象となるため、追加遅延ほぼゼロで構文エラーを完全に排除できます。',
  },
  'q-d4-2': {
    question:
      'Model Context Protocol (MCP) において、Resources、Prompts、ToolsはHost、Client、Server間でどのように分離されていますか？',
    options: [
      'MCPサーバーはLLMのGPU VRAM内部で直接実行される。',
      'HostアプリがLLMの文脈と権限を管理し、隔離されたMCPサーバーと1対1のステートフルJSON-RPC Client通信を行い、読み取り専用データ(Resources)、定型テンプレート(Prompts)、実行可能アクション(Tools)を公開する。',
      'Resources、Prompts、Toolsはすべてブラウザが直接実行する生SQL文字列である。',
      'MCPはハードコードされた単一の検索ツールしかサポートしない。',
    ],
    technicalExplanation:
      'MCPは標準JSON-RPC 2.0プロトコルによってAIホストと外部連携を分離し、アプリ制御のResources、ユーザー制御のPrompts、モデル呼び出し（人間承認付き）のToolsという明確なセキュリティ境界を提供します。',
  },
  'q-d4-3': {
    question:
      '本番のコーディング・調査エージェントにおいて、線形DAGではなくチェックポイント付きの状態保持型巡回グラフ（LangGraphなど）を採用する理由は？',
    options: [
      '推論・行動・観測・検証の反復ループ、コンパイラエラーに基づく自己修正、およびHuman-in-the-Loop (HITL) の一時停止・再開チェックポイントを実現できるため。',
      '線形DAGはGPUメモリを大量に消費するため。',
      '巡回グラフではエラー処理が一切不要になるため。',
      'LangGraphがPythonコードを自動的にVerilogハードウェア記述へ変換するため。',
    ],
    technicalExplanation:
      '実践的なエージェント処理では「テスト実行→トレースバック解析→コード修正→再テスト」のような条件付きループと、人間承認や障害復旧のための永続ステート保存が不可欠です。',
  },
  'q-d4-4': {
    question:
      'Tree-of-Thoughts (ToT) / モンテカルロ木探索 (MCTS) とプロセス報酬モデル (PRM) の組み合わせは、単純な単一連鎖の貪欲デコーディングをどう改善しますか？',
    options: [
      'トークンをアルファベット逆順に生成する。',
      '複数の推論ステップ候補を分岐させ、PRMで中間ステップの妥当性を評価・逆伝播して行き止まりの推論経路を枝刈りし、バックトラックを可能にする。',
      'Temperatureを0.0に設定し、Attentionを無効化する。',
      'トークン消費量をわずか1トークンに削減する。',
    ],
    technicalExplanation:
      '通常の自己回帰デコードは一度誤った前提を生成すると後戻りできません。PRMに導かれた木探索は推論時計算量を割り当てて複数経路の検証とバックトラックを行い、複雑な数学・論理課題を解決します。',
  },
  'q-d5-1': {
    question:
      'Transformerの学習において、L2正則化付き標準AdamよりもAdamW（分離重み減衰）の方が汎化性能に優れる理由は何ですか？',
    options: [
      '標準AdamではL2正則化項の勾配も適応的分散(√v_t)で割られてしまい、過去の勾配が大きいパラメータほど正則化が弱まるが、AdamWは重み減衰を適応的勾配ステップから分離して均一な正則化を保つため。',
      'AdamWは1次・2次モーメントを計算しないため。',
      'AdamWは線形層のバイアス項のみを更新するため。',
      'AdamWはオプティマイザ状態のメモリを一切必要としないため。',
    ],
    technicalExplanation:
      '勾配にL2ペナルティを加算してからAdamのモーメント正規化を行うと、勾配の大きさに依存して重み減衰が歪みます。重み減衰ステップを分離（θ_t = (1 - λ)θ_{t-1} - η·m̂_t/√v̂_t）することで本来の均一な正則化が回復します。',
  },
  'q-d5-2': {
    question:
      'BF16 (Brain Float 16) が動的ロススケーリングなしでFP16より勾配のアンダーフロー/オーバーフローを防げる理由と、LoRAがVRAMを削減する仕組みは？',
    options: [
      'BF16は1数値あたり64ビットを使用し、LoRAは語彙の半分を削除する。',
      'BF16はFP32と同じ8ビットの指数部を維持して広いダイナミックレンジを保ち、LoRAは事前学習重みW₀を凍結して低ランク行列 ΔW = B·A (r ≪ d) のみを学習することでオプティマイザ状態を99%以上削減する。',
      'BF16は仮数部が0ビットであり、LoRAはTransformerを決定木に変換する。',
      'BF16はCPU上でのみ動作する。',
    ],
    technicalExplanation:
      'FP16は指数部が5ビット（最大約65,504）しかなくAttentionや勾配計算で容易にオーバーフローしますが、BF16はFP32と同じ8ビット指数部を保持します。さらにLoRAは凍結重みの巨大なAdam状態メモリを不要にします。',
  },
  'q-d5-3': {
    question:
      'DeepSpeed ZeRO Stage 3（およびPyTorch FSDP）は、ZeRO Stage 1・Stage 2と比較してデータ並列GPU間で何をシャーディング（分割）しますか？',
    options: [
      'ZeRO-1は学習データセットのみを分割し、ZeRO-3は勾配を削除する。',
      'ZeRO-1はオプティマイザ状態、ZeRO-2はオプティマイザ状態＋勾配、ZeRO-3 (FSDP) はオプティマイザ状態＋勾配＋モデルパラメータのすべてを分割し、各層の計算時にAll-Gatherで必要パラメータを収集する。',
      'ZeRO-3は各GPU上にモデル全体を8回複製する。',
      'ZeRO-3はCPU RAMのみを分割する。',
    ],
    technicalExplanation:
      '混合精度Adam学習では1パラメータあたりオプティマイザ状態に12バイト、勾配に2バイト、重みに2バイトの計16バイトを要します。ZeRO-3はこれら全16バイトをN基のGPUに分割し、GPUあたりの状態メモリを1/Nに圧縮します。',
  },
  'q-d5-4': {
    question:
      'Direct Preference Optimization (DPO) と Group Relative Policy Optimization (GRPO) は、古典的なPPOと比較して事後強化学習アライメントをどう簡素化しますか？',
    options: [
      'DPOは独立した報酬モデルなしで選好ペアから直接方策確率を解析的に最適化し、GRPOはプロンプトごとのサンプル群内で報酬を正規化することで巨大なCritic（価値）モデルを不要にする。',
      '選好データや報酬信号を一切使用しない。',
      '4つの独立したCriticモデルを同時に学習する必要がある。',
      '1億パラメータ未満の小型モデルでしか動作しない。',
    ],
    technicalExplanation:
      '従来のRLHF-PPOは4つのモデル（Policy, Reference, Reward, Value Critic）をメモリ上に保持する必要がありました。DPOは報酬関数を方策の対数確率比で再定式化し、GRPOはグループ内の相対ZスコアをペースラインとしてCriticネットワークを排除します。',
  },
  'q-d6-1': {
    question:
      '現代のTransformerブロックが2017年当初のPost-LayerNormではなく、Pre-RMSNorm（Attention/FFNの前に正規化）を採用する理由は？',
    options: [
      'Pre-RMSNormは主残差ストリームを非正規化のまま保つため、出力から入力へ恒等勾配が歪みなく直接流れ、長いウォームアップなしでも深層学習が安定するため。',
      'Post-LayerNormはGPU上で計算できないため。',
      'Pre-RMSNormはパラメータ数を50%増加させるため。',
      'Pre-RMSNormはすべての残差結合を除去するため。',
    ],
    technicalExplanation:
      'Pre-Norm構造（x_{l+1} = x_l + F(Norm(x_l))）では残差ハイウェイが各層の更新のクリーンな和として保たれるため初期勾配爆発を防げます。またRMSNormは平均減算を省くことで正規化演算を7〜15%高速化します。',
  },
  'q-d6-2': {
    question:
      'スケール化内積注意 softmax(QKᵀ / √d_k)V において、QueryとKeyの内積を √d_k で割る理由は何ですか？',
    options: [
      '浮動小数点数を整数に変換するため。',
      'ヘッド次元 d_k が大きくなると内積 Q·K の分散が d_k に比例して増大し、1/√d_k でスケールしないとSoftmaxが飽和領域に入って勾配が消失するため。',
      'コンテキスト長を d_k 分の1に短縮するため。',
      '注意行列を対称行列にするため。',
    ],
    technicalExplanation:
      'q と k の各要素が平均0・分散1のとき、その内積の分散は d_k になります。√d_k で割ることでSoftmax入力の分散を1に保ち、極端なOne-hot飽和と勾配消失を防ぎます。',
  },
  'q-d6-3': {
    question:
      'Grouped-Query Attention (GQA) がMHAと比べて推論メモリ帯域を削減する仕組みと、FlashAttentionが近似なしで2〜4倍の高速化を達成する理由は？',
    options: [
      'GQAは複数のQueryヘッド群で単一のKey/Valueヘッドを共有してKVキャッシュを4〜8分の1に縮小し、FlashAttentionはGPUオンチップSRAM上でQ, K, Vをタイリング処理して低速なHBMへのN×N注意行列の読み書きを排除するため。',
      'GQAは入力トークンの75%を破棄し、FlashAttentionは低ランクSVDで注意行列を近似するため。',
      'GQAはQueryヘッドを1つしか使わず、FlashAttentionはCPUキャッシュ上で動作するため。',
      'どちらの手法もHBMメモリトラフィックには影響しない。',
    ],
    technicalExplanation:
      '自己回帰デコードはHBMからのKVキャッシュ読み込み帯域がボトルネックとなりますが、GQAは品質を維持しつつKVキャッシュ容量を劇的に削減します。またFlashAttentionはオンラインSoftmaxを用いた単一SRAM融合カーネルによりO(N²)のHBMアクセスをO(N)へ削減します。',
  },
  'q-d6-4': {
    question:
      'Sparse Mixture-of-Experts (MoE) モデル（MixtralやDeepSeekMoEなど）において、ルーティングされるエキスパート間の負荷分散が学習・推論で極めて重要な理由は？',
    options: [
      '負荷分散がないとルーター崩壊により全トークンが特定の1〜2エキスパートに集中し、他エキスパートのパラメータ容量が無駄になる上、Expert並列時に過負荷GPUが通信ボトルネックになるため。',
      '負荷分散により各トークンが全エキスパートの100%を必ず活性化するため。',
      'MoEモデルはFeed-Forwardネットワークを使用しないため。',
      '負荷分散はバッチサイズ1のときのみ必要だから。',
    ],
    technicalExplanation:
      'Sparse MoEはTop-Kルーティングによって総パラメータ容量とトークン当たり計算量を分離します。ルーティングが一部のエキスパートに偏ると知識容量が活かされず、分散GPU間で過負荷ノード待ちのストールが発生します。',
  },
  'q-d7-1': {
    question:
      'GPU Rooflineモデルにおいて、LLMのPrefillフェーズが「演算律速（Compute-Bound）」であり、自己回帰Decodeフェーズが「メモリ帯域律速（Memory-Bandwidth-Bound）」となる理由は？',
    options: [
      'Prefillは全プロンプトトークンを並列処理（高演算強度：重み読み込み1バイト当たり多くの行列×行列FLOPs）するのに対し、Decodeは1トークンずつ生成（低演算強度：細い行列×ベクトル積のために毎回全重み＋KVキャッシュをHBMから転送）するため。',
      'PrefillはCPU上で実行され、DecodeはGPU上で実行されるため。',
      'DecodeフェーズではKVキャッシュを使用しないため。',
      'PrefillはINT4を使用し、DecodeはFP64を使用するため。',
    ],
    technicalExplanation:
      'PrefillではHBMから一度モデル重みを読み込むだけでN個のプロンプトトークンを同時計算できます（高FLOPs/Byte）。一方、小バッチのDecodeでは1トークンを出力するたびに何十GBもの重みとKVキャッシュをHBMからストリーム転送する必要があります。',
  },
  'q-d7-2': {
    question:
      'Activation-aware Weight Quantization (AWQ) が、均一な四捨五入量子化 (RTN) よりも4ビット (INT4) で高いLLM精度を維持できる理由は？',
    options: [
      'モデルの重みの50%をFP32のまま保持するため。',
      '入力アクティベーションの振幅が大きい約1%の重要重みチャネルを特定し、チャネルごとの数学的スケーリングで保護することで、混合精度のハードウェア負荷なしに量子化誤差を劇的に抑えるため。',
      '1兆トークンを使ってモデル全体をゼロから再学習するため。',
      '埋め込み層のみを量子化するため。',
    ],
    technicalExplanation:
      '重みの重要度は重み自体の大きさだけでなく入力活性値との積（Y = W·X）で決まります。重要チャネルを量子化前に拡大スケーリングし、逆スケールを前層に吸収させることでFP16に迫る精度を維持します。',
  },
  'q-d7-3': {
    question:
      'vLLMのPagedAttentionは、KVキャッシュの内部および外部メモリ断片化をどのように解消しますか？',
    options: [
      'すべてのリクエストに対して連続した128Kトークン分のバッファを事前確保する。',
      'OSの仮想メモリページングのようにKVキャッシュを固定長の非連続物理ブロックに分割してブロックテーブルで管理し、トークン生成に応じてオンデマンド割り当てとCopy-on-Writeプレフィックス共有を行う。',
      'KVキャッシュを磁気ハードディスクに書き出す。',
      'デコードステップごとに過去の全トークンをゼロから再計算する。',
    ],
    technicalExplanation:
      '出力長は事前に分からないため、連続メモリ予約ではGPU VRAMの60〜80%が無駄になります。PagedAttentionは外部断片化を完全にゼロにし、内部断片化も最終ブロックのみ（4%未満）に抑えることでバッチ処理能力を2〜24倍に高めます。',
  },
  'q-d7-4': {
    question:
      '投機的デコーディング（Speculative Decoding）が、ターゲットLLMと数学的に全く同じ出力分布を保証しつつ2〜3倍のトークン生成高速化を達成する仕組みは？',
    options: [
      '軽量なドラフトモデルがK個のトークンを高速に提案し、ターゲットLLMが1回の並列フォワードパスで全K個を一括検証し、修正棄却サンプリングによって p_target(x) を厳密に保ったまま採否を決定する。',
      'ターゲットモデルを恒久的に小型ドラフトモデルへ置き換える。',
      'Transformer層を1層おきにスキップする。',
      'Temperature = 100 のときのみ動作する。',
    ],
    technicalExplanation:
      'K個のドラフトトークンを並列検証するHBM重み読み込みコストは、1トークン生成とほぼ同じです。棄却サンプリング（確率 min(1, p_target/p_draft) で採択し、棄却時は残差分布から再サンプル）により無劣化の品質が数学的に保証されます。',
  },
  'q-d8-1': {
    question:
      'ストリーミングLLM監視において、初回トークン到達時間 (TTFT) とトークン間遅延 (ITL / TPOT) を別々のSLOとして追跡する理由は？',
    options: [
      'TTFTはキュー待ち＋演算律速なプロンプトPrefill遅延（応答開始までの体感速度）を測り、ITLはメモリ帯域律速な自己回帰Decode速度（テキストが流れる読書テンポ）を測るため。',
      'TTFTとITLは常に全く同じ数値になるため。',
      'TTFTはオフラインバッチ処理にしか適用されないため。',
      'ITLはネットワークのDNS名前解決時間を測定するため。',
    ],
    technicalExplanation:
      '長文プロンプトやPrefillキュー混雑はTTFTを悪化させ、同時バッチサイズ過大やKVキャッシュ帯域飽和はITLを悪化させます。両者を分離することでPrefillとDecodeのどちらにボトルネックがあるか即座に切り分けられます。',
  },
  'q-d8-2': {
    question:
      'OpenTelemetry GenAI セマンティック規約（`gen_ai.*` スパン）でAIパイプラインを計装する最大のメリットは何ですか？',
    options: [
      'エンジニアの代わりにPythonコードを自動生成してくれる。',
      'HTTPリクエスト、ベクトル検索、MCPツール呼び出し、プロンプト版、トークン消費量、TTFT/ITL遅延をベンダー中立な分散トレース木として統合し、LangfuseやGrafana等で一貫分析できる。',
      'ディスク上のモデル重みを暗号化する。',
      'Kubernetesを完全に置き換える。',
    ],
    technicalExplanation:
      'マルチステップのRAGやエージェントでは1リクエストが5〜20個のサブ呼び出しを連鎖させます。OpenTelemetry分散トレースにより全スパンのトークン数や遅延属性が標準化され、コストや遅延のボトルネックを正確に特定できます。',
  },
  'q-d8-3': {
    question:
      '新しい候補LLMを本番検証する際、非同期シャドウデプロイメント（Shadow Deployment）はカナリアロールアウト（Canary Rollout）とどう異なりますか？',
    options: [
      'シャドウデプロイは本番リクエストを非同期で候補モデルへ複製して出力・遅延をログ記録しオフライン比較を行うため、実際のユーザーに候補モデルの応答を一切見せずに検証できる。',
      'シャドウデプロイは本番稼働中のモデルを完全に停止させる。',
      'カナリアロールアウトは即座に100%のトラフィックを候補モデルへ送る。',
      'シャドウデプロイは静的HTMLファイルにしか機能しない。',
    ],
    technicalExplanation:
      'シャドウミラーリングはユーザーへのリスクゼロで実際の本番トラフィック分布やエッジケースに対する候補モデルの挙動を検証でき、カナリアロールアウトは実際の一部ユーザー（例: 5%）に新モデルの応答を返して段階展開します。',
  },
  'q-d8-4': {
    question:
      'SLO認識型LLMカスケード（FrugalGPT / RouteLLM）と自律データフライホイールは、どのようにして本番システムの性能を時間とともに複利向上させますか？',
    options: [
      'セマンティックルーターが定型クエリの70〜80%を高速な小型モデルへ処理させ難問のみ大型モデルへエスカレーション（コスト・遅延を70%以上削減）し、フライホイールが低確信度や修正ログを収集して小型モデルを継続的に微調整する。',
      'すべてのクエリを10個の大型モデルへ同時に送信する。',
      '本番ログを5分ごとにすべて削除する。',
      'CI/CDにおけるモデル評価を無効化する。',
    ],
    technicalExplanation:
      'カスケードルーティングがコスト・遅延・品質のパレート最適を即座に実現し、データフライホイールが本番の難例をSFT/DPO学習データへと変換することで、小型高速モデルが処理できる領域が継続的に拡大します。',
  },
};

export function getLocalizedQuiz(
  quiz: DistrictQuizQuestion,
  lang: LanguageCode
): DistrictQuizQuestion {
  if (lang === 'en') return quiz;
  const dict = lang === 'vi' ? VI_QUIZZES : JA_QUIZZES;
  const loc = dict[quiz.id];
  if (!loc) return quiz;
  return {
    ...quiz,
    question: loc.question,
    options: loc.options,
    technicalExplanation: loc.technicalExplanation,
  };
}
