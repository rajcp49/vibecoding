#!/usr/bin/env python3
"""Generate docs/vibecoding-ai-prompts.pdf from docs/vibecoding-ai-prompts.txt (requires fpdf2)."""

import re
from pathlib import Path

try:
    from fpdf import FPDF
except ImportError as e:
    raise SystemExit("Install fpdf2: python3 -m pip install fpdf2") from e

ROOT = Path(__file__).resolve().parents[1]
TXT = ROOT / "docs" / "vibecoding-ai-prompts.txt"
PDF = ROOT / "docs" / "vibecoding-ai-prompts.pdf"

FONT_DIR = Path("/usr/share/fonts/truetype/dejavu")
DEJAVU = FONT_DIR / "DejaVuSans.ttf"
DEJAVU_BOLD = FONT_DIR / "DejaVuSans-Bold.ttf"
DEJAVU_MONO = FONT_DIR / "DejaVuSansMono.ttf"


def is_separator(line: str) -> bool:
    s = line.strip()
    if len(s) < 12:
        return False
    return len(set(s)) <= 2 and s[0] in "=-"


def main() -> None:
    if not DEJAVU.is_file():
        raise SystemExit(f"Missing font: {DEJAVU}")

    lines = TXT.read_text(encoding="utf-8").split("\n")

    pdf = FPDF(unit="mm", format="A4")
    pdf.set_auto_page_break(auto=True, margin=20)
    pdf.set_margins(left=20, top=22, right=20)

    pdf.add_font("DejaVu", "", str(DEJAVU))
    pdf.add_font("DejaVu", "B", str(DEJAVU_BOLD) if DEJAVU_BOLD.is_file() else str(DEJAVU))
    if DEJAVU_MONO.is_file():
        pdf.add_font("Mono", "", str(DEJAVU_MONO))
    pdf.add_page()

    BODY = 10.5
    BODY_H = 6.2
    SMALL = 9.0
    SMALL_H = 5.2
    MONO = 8.5
    MONO_H = 4.8

    schema_mono = False

    for idx, line in enumerate(lines):
        stripped = line.rstrip()

        if not stripped:
            pdf.ln(2.5)
            continue

        if is_separator(stripped):
            pdf.ln(4)
            pdf.set_draw_color(200, 192, 178)
            pdf.set_line_width(0.35)
            y = pdf.get_y()
            pdf.line(pdf.l_margin, y, pdf.w - pdf.r_margin, y)
            pdf.ln(5)
            continue

        if idx < 8 and stripped.startswith("VIBECODING"):
            pdf.set_font("DejaVu", "B", 16)
            pdf.set_text_color(20, 20, 22)
            pdf.multi_cell(0, 8, stripped)
            pdf.ln(5)
            continue

        if stripped.startswith("Scope:"):
            pdf.set_font("DejaVu", "", SMALL)
            pdf.set_text_color(75, 75, 80)
            pdf.multi_cell(0, SMALL_H, stripped)
            pdf.ln(3)
            continue

        if re.match(r"^\d+\)\s", stripped):
            pdf.ln(3)
            pdf.set_font("DejaVu", "B", 12)
            pdf.set_text_color(26, 26, 30)
            pdf.multi_cell(0, 7, stripped)
            pdf.ln(4)
            continue

        if stripped.startswith(("Constant:", "File:", "Model:", "Endpoint:")):
            pdf.set_font("DejaVu", "", SMALL)
            pdf.set_text_color(70, 72, 78)
            pdf.multi_cell(0, SMALL_H, stripped)
            pdf.ln(2)
            continue

        if "END OF DOCUMENT" in stripped:
            pdf.ln(6)
            pdf.set_font("DejaVu", "B", BODY)
            pdf.set_text_color(22, 22, 24)
            pdf.multi_cell(0, BODY_H, stripped)
            continue

        if "Required JSON shape" in stripped:
            pdf.set_font("DejaVu", "", BODY)
            pdf.set_text_color(22, 22, 24)
            pdf.multi_cell(0, BODY_H, stripped)
            pdf.ln(2)
            schema_mono = True
            continue

        if schema_mono:
            if stripped.startswith("Scores must"):
                schema_mono = False
                pdf.set_font("DejaVu", "", BODY)
                pdf.set_text_color(22, 22, 24)
                pdf.multi_cell(0, BODY_H, stripped)
                pdf.ln(0)
                continue
            if DEJAVU_MONO.is_file():
                pdf.set_font("Mono", "", MONO)
                pdf.set_text_color(28, 28, 32)
                pdf.multi_cell(0, MONO_H, line.rstrip() or " ")
                pdf.ln(0)
            else:
                pdf.set_font("DejaVu", "", SMALL)
                pdf.multi_cell(0, SMALL_H, stripped)
                pdf.ln(0)
            continue

        pdf.set_font("DejaVu", "", BODY)
        pdf.set_text_color(22, 22, 24)
        pdf.multi_cell(0, BODY_H, stripped)
        pdf.ln(0)

    pdf.output(str(PDF))
    print(f"Wrote {PDF}")


if __name__ == "__main__":
    main()
