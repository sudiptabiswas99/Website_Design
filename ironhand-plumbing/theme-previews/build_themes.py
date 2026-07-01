#!/usr/bin/env python3
# Throwaway theme generator. Reads the ORIGINAL ironhand index.html (never edits it)
# and writes recolored copies into theme-previews/<name>/index.html.
import os

# live site is COPPER again and is the single source of truth for theme regeneration
SRC = os.path.join(os.path.dirname(__file__), "..", "index.html")
OUT = os.path.dirname(__file__)

with open(SRC, "r", encoding="utf-8") as f:
    BASE = f.read()

# ---- exact source fragments we target ----
ROOT_OLD = """  :root {
    --ink: #0D0D0F;
    --ink-2: #141417;
    --ink-3: #1C1C21;
    --cream: #F4EFE7;
    --muted: #9A958C;
    --copper: #F2752B;
    --copper-d: #D85E18;
    --brass: #E8B04B;
    --line: rgba(244,239,231,.12);
    --line-2: rgba(244,239,231,.07);"""

BACKDROP_OLD = "radial-gradient(120% 120% at 70% 32%, #15100b 0%, #0d0a08 46%, #0a0a0c 100%)"
FLARE_OLD = "radial-gradient(circle, rgba(255,238,210,.9) 0%, rgba(242,150,60,.45) 14%, rgba(232,176,75,.16) 40%, transparent 68%)"
VIGNETTE_OLD = "rgba(7,7,8,.7) 100%)"
FOOTER_OLD = "linear-gradient(180deg, rgba(13,13,15,.18) 0%, rgba(12,12,14,.30) 58%, rgba(10,10,12,.46) 100%)"
THEMECOLOR_OLD = 'content="#0D0D0F"'

# globe shader fragments
SH_BASE_OLD = "vec3 night=vec3(0.020,0.013,0.009);vec3 day=vec3(0.06,0.038,0.020);"
SH_TERM_OLD = "col+=vec3(0.85,0.40,0.13)*term;"
SH_ATMOS_OLD = "vec3 c=mix(vec3(0.95,0.46,0.17),vec3(0.93,0.74,0.34),lit*0.6);"
SH_LAND_OLD = "vCol=mix(vec3(0.34,0.15,0.05),vec3(0.99,0.62,0.24),day);"


def build(theme):
    t = BASE
    # 1) explicit multi-value lines FIRST (before blanket passes)
    t = t.replace(ROOT_OLD, theme["root"])
    t = t.replace(BACKDROP_OLD, theme["backdrop"])
    t = t.replace(FLARE_OLD, theme["flare"])
    t = t.replace(VIGNETTE_OLD, theme["vignette"])
    t = t.replace(FOOTER_OLD, theme["footer"])
    t = t.replace(THEMECOLOR_OLD, 'content="%s"' % theme["themecolor"])
    # 2) globe shaders
    t = t.replace(SH_BASE_OLD, theme["sh_base"])
    t = t.replace(SH_TERM_OLD, theme["sh_term"])
    t = t.replace(SH_ATMOS_OLD, theme["sh_atmos"])
    t = t.replace(SH_LAND_OLD, theme["sh_land"])
    # 3) bare-hex tokens (covers both #F2752B and 0xF2752B etc.)
    t = t.replace("F2752B", theme["accent_hex"])
    t = t.replace("D85E18", theme["accent_d_hex"])
    t = t.replace("E8B04B", theme["brass_hex"])
    # 4) rgba accent / brass tokens
    t = t.replace("242,117,43", theme["accent_rgb"])
    t = t.replace("232,176,75", theme["brass_rgb"])
    # 5) ink scrims blanket (after explicit footer line already swapped)
    t = t.replace("rgba(13,13,15,", "rgba(%s," % theme["ink_rgb"])
    # 5b) hardcoded cream-as-rgba (nav, hero, intro, review, footer borders/text)
    t = t.replace("244,239,231", theme["cream_rgb"])
    # 6) dark-on-accent text (only flipped for light theme)
    if theme.get("ontext"):
        t = t.replace("#160c03", theme["ontext"]).replace("#120a04", theme["ontext"])
    # NOTE: the footer fade-grid + lightened scrim are now baked into the ORIGINAL,
    # so they carry over automatically. The grid line color recolors via step 5b
    # (cream token -> theme cream). Soften the dark-line alpha on the light theme.
    if theme.get("grid_soft"):
        t = t.replace("%s 1px" % theme["grid_line"], "%s 1px" % theme["grid_soft"])
    return t


THEMES = {
    "green": {
        "root": """  :root {
    --ink: #0A0F0C;
    --ink-2: #0F1612;
    --ink-3: #16201A;
    --cream: #EFF5EF;
    --muted: #94A399;
    --copper: #18B866;
    --copper-d: #0E8C4C;
    --brass: #E3AE38;
    --line: rgba(239,245,239,.12);
    --line-2: rgba(239,245,239,.07);""",
        "backdrop": "radial-gradient(120% 120% at 70% 32%, #0c1a12 0%, #08120c 46%, #07100b 100%)",
        "flare": "radial-gradient(circle, rgba(224,255,236,.9) 0%, rgba(60,220,130,.45) 14%, rgba(40,200,120,.16) 40%, transparent 68%)",
        "vignette": "rgba(6,12,9,.7) 100%)",
        "footer": "linear-gradient(180deg, rgba(10,15,12,.18) 0%, rgba(9,13,11,.30) 58%, rgba(8,12,10,.46) 100%)",
        "themecolor": "#0A0F0C",
        "sh_base": "vec3 night=vec3(0.009,0.022,0.014);vec3 day=vec3(0.020,0.050,0.032);",
        "sh_term": "col+=vec3(0.16,0.82,0.40)*term;",
        "sh_atmos": "vec3 c=mix(vec3(0.12,0.80,0.42),vec3(0.40,0.88,0.52),lit*0.6);",
        "sh_land": "vCol=mix(vec3(0.05,0.22,0.12),vec3(0.22,0.95,0.50),day);",
        "accent_hex": "18B866", "accent_d_hex": "0E8C4C", "brass_hex": "E3AE38",
        "accent_rgb": "24,184,102", "brass_rgb": "227,174,56",
        "ink_rgb": "10,15,12", "cream_rgb": "239,245,239", "grid_line": "rgba(239,245,239,.20)", "ontext": None,
    },
    "blue": {
        "root": """  :root {
    --ink: #08111C;
    --ink-2: #0C1828;
    --ink-3: #112335;
    --cream: #EAF1F8;
    --muted: #8C9AAB;
    --copper: #2E9BE6;
    --copper-d: #1A77C2;
    --brass: #E3AE38;
    --line: rgba(234,241,248,.12);
    --line-2: rgba(234,241,248,.07);""",
        "backdrop": "radial-gradient(120% 120% at 70% 32%, #0a1a2b 0%, #08131f 46%, #06101a 100%)",
        "flare": "radial-gradient(circle, rgba(214,238,255,.9) 0%, rgba(60,160,240,.45) 14%, rgba(40,150,235,.16) 40%, transparent 68%)",
        "vignette": "rgba(6,11,18,.7) 100%)",
        "footer": "linear-gradient(180deg, rgba(8,17,28,.18) 0%, rgba(7,14,22,.30) 58%, rgba(6,11,18,.46) 100%)",
        "themecolor": "#08111C",
        "sh_base": "vec3 night=vec3(0.008,0.015,0.030);vec3 day=vec3(0.018,0.036,0.066);",
        "sh_term": "col+=vec3(0.14,0.46,0.86)*term;",
        "sh_atmos": "vec3 c=mix(vec3(0.16,0.55,0.93),vec3(0.32,0.66,0.95),lit*0.6);",
        "sh_land": "vCol=mix(vec3(0.05,0.16,0.34),vec3(0.26,0.64,0.99),day);",
        "accent_hex": "2E9BE6", "accent_d_hex": "1A77C2", "brass_hex": "E3AE38",
        "accent_rgb": "46,155,230", "brass_rgb": "227,174,56",
        "ink_rgb": "8,17,28", "cream_rgb": "234,241,248", "grid_line": "rgba(234,241,248,.20)", "ontext": None,
    },
    "violet": {
        "root": """  :root {
    --ink: #1A1B1E;
    --ink-2: #222327;
    --ink-3: #2B2D33;
    --cream: #F0F0F0;
    --muted: #A0A0A0;
    --copper: #8C5CFF;
    --copper-d: #7033FF;
    --brass: #E3AE38;
    --line: rgba(240,240,240,.12);
    --line-2: rgba(240,240,240,.07);""",
        "backdrop": "radial-gradient(120% 120% at 70% 32%, #16121f 0%, #100d18 46%, #0c0a12 100%)",
        "flare": "radial-gradient(circle, rgba(225,215,255,.9) 0%, rgba(140,92,255,.45) 14%, rgba(112,51,255,.16) 40%, transparent 68%)",
        "vignette": "rgba(8,7,12,.7) 100%)",
        "footer": "linear-gradient(180deg, rgba(26,27,30,.18) 0%, rgba(22,23,26,.30) 58%, rgba(18,19,22,.46) 100%)",
        "themecolor": "#1A1B1E",
        "sh_base": "vec3 night=vec3(0.020,0.012,0.045);vec3 day=vec3(0.045,0.028,0.085);",
        "sh_term": "col+=vec3(0.55,0.34,1.0)*term;",
        "sh_atmos": "vec3 c=mix(vec3(0.55,0.36,1.0),vec3(0.72,0.58,1.0),lit*0.6);",
        "sh_land": "vCol=mix(vec3(0.22,0.12,0.45),vec3(0.62,0.42,1.0),day);",
        "accent_hex": "8C5CFF", "accent_d_hex": "7033FF", "brass_hex": "E3AE38",
        "accent_rgb": "140,92,255", "brass_rgb": "227,174,56",
        "ink_rgb": "26,27,30", "cream_rgb": "240,240,240", "grid_line": "rgba(240,240,240,.20)", "ontext": None,
    },
    "white": {
        "root": """  :root {
    --ink: #F6F8FB;
    --ink-2: #FFFFFF;
    --ink-3: #EDF2F7;
    --cream: #0F1B2A;
    --muted: #5B6776;
    --copper: #1273C6;
    --copper-d: #0E5BA0;
    --brass: #C7902A;
    --line: rgba(15,27,42,.13);
    --line-2: rgba(15,27,42,.07);""",
        "backdrop": "radial-gradient(120% 120% at 70% 32%, #e9f1fb 0%, #f3f7fc 46%, #ffffff 100%)",
        "flare": "radial-gradient(circle, rgba(120,180,235,.55) 0%, rgba(70,150,225,.30) 14%, rgba(120,180,235,.10) 40%, transparent 68%)",
        "vignette": "rgba(220,232,246,.55) 100%)",
        "footer": "linear-gradient(180deg, rgba(246,248,251,.30) 0%, rgba(248,250,252,.46) 58%, rgba(252,253,255,.62) 100%)",
        "themecolor": "#F6F8FB",
        "sh_base": "vec3 night=vec3(0.50,0.66,0.85);vec3 day=vec3(0.30,0.52,0.80);",
        "sh_term": "col+=vec3(0.10,0.18,0.30)*term;",
        "sh_atmos": "vec3 c=mix(vec3(0.20,0.45,0.80),vec3(0.35,0.60,0.90),lit*0.6);",
        "sh_land": "vCol=mix(vec3(0.10,0.22,0.40),vec3(0.20,0.40,0.70),day);",
        "accent_hex": "1273C6", "accent_d_hex": "0E5BA0", "brass_hex": "C7902A",
        "accent_rgb": "18,115,198", "brass_rgb": "199,144,42",
        "ink_rgb": "246,248,251", "cream_rgb": "15,27,42", "grid_line": "rgba(15,27,42,.20)", "grid_soft": "rgba(15,27,42,.12)", "ontext": "#F6F8FB",
    },
}

for name, theme in THEMES.items():
    html = build(theme)
    with open(os.path.join(OUT, name, "index.html"), "w", encoding="utf-8") as f:
        f.write(html)
    print("wrote", name, len(html), "bytes")

# copper passthrough — the original, unchanged, so all 4 live under one server
with open(os.path.join(OUT, "copper", "index.html"), "w", encoding="utf-8") as f:
    f.write(BASE)
print("wrote copper", len(BASE), "bytes (original passthrough)")
