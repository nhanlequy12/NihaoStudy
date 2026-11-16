#!/usr/bin/env bash
# Tải các nguồn dữ liệu mở vào data/raw/ (thư mục này không đưa lên git).
# Chạy từ thư mục gốc dự án:  bash data/scripts/fetch_sources.sh
set -euo pipefail
SCRIPTS="$(cd "$(dirname "$0")" && pwd)"
RAW="$SCRIPTS/../raw"
mkdir -p "$RAW" && cd "$RAW"

# Danh sách HSK 2.0 + 3.0 (MIT) – nghĩa tiếng Anh bên trong lấy từ CC-CEDICT (CC BY-SA 4.0)
curl -fsSL -o hsk_complete.json https://raw.githubusercontent.com/drkameleon/complete-hsk-vocabulary/main/complete.json
curl -fsSL -o hsk_LICENSE       https://raw.githubusercontent.com/drkameleon/complete-hsk-vocabulary/main/LICENSE
# CC-CEDICT (CC BY-SA 4.0)
curl -fsSL -o cedict.txt.gz     https://www.mdbg.net/chinese/export/cedict/cedict_1_0_ts_utf-8_mdbg.txt.gz
# CVDICT – từ điển Trung–Việt dựa trên CC-CEDICT (CC BY-SA 4.0)
curl -fsSL -o cvdict.u8         https://raw.githubusercontent.com/ph0ngp/CVDICT/main/CVDICT.u8
# Unihan (Unicode License v3)
curl -fsSL -o Unihan.zip        https://www.unicode.org/Public/UCD/latest/ucd/Unihan.zip
rm -rf unihan && mkdir unihan && unzip -q -o Unihan.zip -d unihan
# Make Me a Hanzi dictionary.txt (LGPL-3.0+)
curl -fsSL -o mmah_dictionary.txt https://raw.githubusercontent.com/skishore/makemeahanzi/master/dictionary.txt
curl -fsSL -o mmah_COPYING        https://raw.githubusercontent.com/skishore/makemeahanzi/master/COPYING
# Make Me a Hanzi graphics.txt – thứ tự nét (Arphic Public License, ~30 MB)
curl -fsSL -o mmah_graphics.txt   https://raw.githubusercontent.com/skishore/makemeahanzi/master/graphics.txt

# Đề cương HSK 2025 (CLEC) – chỉ trích bảng từ vựng (từ, cấp, pinyin, từ loại); cần pdftotext
curl -fsSL -o hsk-syllabus-2025.pdf "https://hsk.cn-bj.ufileos.com/3.0/%E6%96%B0%E7%89%88HSK%E8%80%83%E8%AF%95%E5%A4%A7%E7%BA%B21219.pdf"
python3 "$SCRIPTS/extract_syllabus_2025.py" hsk-syllabus-2025.pdf hsk-syllabus-2025.json

echo "Đã tải vào $RAW"
