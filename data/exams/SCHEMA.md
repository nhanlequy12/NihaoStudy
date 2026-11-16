# Định dạng đề luyện tự soạn (HSK 3.0)

Mỗi đề là một tệp `data/exams/hsk3-<cấp>-de<số>.json`, ví dụ `hsk3-4-de01.json`. Cấp 7–9 dùng `hsk3-7-9-de01.json`.

Đề do Nǐ hǎo tự biên soạn hoàn toàn. Chỉ bám theo **cấu trúc** của đề chính thức (số phần, dạng câu, số câu, thời gian), không lấy câu hỏi, bài đọc hay audio của bất kỳ đề nào.

```jsonc
{
  "id": "hsk3-4-de01",
  "level": 4,                       // 1..6, hoặc "7-9"
  "format": "HSK 3.0 (2025)",
  "title": "Đề luyện HSK 4 – số 1",
  "minutes_total": 85,
  "scoring_note": "CLEC chưa công bố thang điểm và điểm đạt của HSK 3.0 cấp 1–6; web chấm theo tỷ lệ đúng từng phần.",
  "sections": [
    {
      "key": "listening",           // listening | reading | writing | translation | speaking
      "name_zh": "听力", "name_vi": "Nghe hiểu", "minutes": 20,
      "parts": [
        {
          "part": 1,
          "type": "l_dialog_q",      // mã dạng câu, xem bảng bên dưới
          "instruction_vi": "Nghe đoạn hội thoại ngắn, chọn đáp án đúng.",
          "instruction_zh": "听对话，选择正确答案。",
          "plays": 1,
          "groups": [                // mỗi nhóm có thể có tài liệu chung (đoạn văn, audio dài) và nhiều câu
            {
              "audio": [["男", "…"], ["女", "…"]],   // lời thoại cho giọng đọc máy; độc thoại: [["", "…"]]
              "passage": null,                       // bài đọc chung (phần đọc)
              "image_vi": null,                      // mô tả thay cho tranh (web không có tranh)
              "items": [
                {
                  "no": 1,                           // số câu liên tục trong toàn đề
                  "stem": "问：男的是什么意思？",       // câu hỏi (chữ Hán); có thể rỗng nếu chỉ nghe rồi chọn
                  "stem_py": "",                     // pinyin, chỉ cần cho cấp 1–2
                  "options": ["…", "…", "…", "…"],   // trắc nghiệm; ✓/✗ thì ["对", "错"]
                  "answer": 2,                       // chỉ số (0 = A) của đáp án đúng; câu viết: null
                  "sample_answer": null,             // câu viết / dịch / nói: bài mẫu
                  "rubric_vi": null,                 // câu viết: tiêu chí tự chấm
                  "explain_vi": "Vì sao chọn C, vì sao các đáp án kia sai (1–3 câu).",
                  "skills": ["nghe-y-chinh"],        // nhãn kỹ năng để thống kê lỗi
                  "words": ["…"]                     // từ trọng tâm (để nối với bộ từ vựng)
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  "self_check": { "items": 70, "levels_used": "≤ 4", "out_of_level_words": ["…"] }
}
```

## Quy ước

- **Mã dạng câu** (`type`):
  - `l_*` cho nghe, `r_*` cho đọc, `w_*` cho viết, `t_*` cho dịch, `s_*` cho nói.
  - Dùng lại mã của web khi khớp: `l_tf`, `l_pick`, `l_dialog_pick`, `l_reply`, `l_dialog_q`, `l_dialog_long`, `l_tf_long`, `r_word_tf`, `r_match_vi`, `r_match_qa`, `r_cloze`, `r_tf`, `r_passage`, `r_order`, `w_order`, `w_char`.
  - Dạng mới thì đặt mã mới và mô tả ở `instruction_vi`, ví dụ: `r_sentence_cloze` (chọn câu điền vào đoạn), `r_paragraph_order` (sắp xếp đoạn), `w_picture_sentence` (nhìn tranh đặt câu), `w_short_essay`, `w_topic_essay`, `w_practical` (văn bản ứng dụng), `w_chart` (mô tả biểu đồ), `t_zh_vi`, `s_repeat`, `s_picture`, `s_answer`.
- **Thay cho tranh:**
  - `image_vi` là một câu tiếng Việt mô tả cảnh, ví dụ "Một cô gái đang đứng chờ xe buýt dưới mưa".
  - Phương án dạng tranh thì ghi bằng mô tả ngắn.
- **Từ vựng:**
  - Dùng chủ yếu từ ở cấp đó và các cấp dưới, theo `data/hsk/hsk3/hsk3-<n>.json` (đề cương 2025).
  - Từ vượt cấp phải liệt kê trong `self_check.out_of_level_words`. Tên riêng không tính.
- **Đáp án:** phân bố đều A/B/C/D, không để lộ quy luật.
- **Giải thích:** `explain_vi` viết bằng tiếng Việt, nói rõ vì sao đáp án đúng, và đáp án nhiễu sai ở đâu khi cần.
