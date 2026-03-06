import re
import csv
from collections import defaultdict


# ======================================
# REGEX
# ======================================

import os

# ... existing imports

BASE_DIR = os.path.dirname(os.path.abspath(__file__))


# ======================================
# REGEX
# ======================================

NUMBER_REGEX = re.compile(r"\b\d+(?:\.\d+)?%?\b")
EMAIL_REGEX = re.compile(r"\b[\w\.-]+@[\w\.-]+\.\w+\b")
PHONE_REGEX = re.compile(r"\b\d{10}\b")


# ======================================
# CSV LOADERS
# ======================================

def load_section_headers(path):
    data = defaultdict(list)

    with open(path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            data[row["section"].strip().lower()].append(
                row["keyword"].strip().lower()
            )

    return dict(data)


def load_action_verbs(path):
    verbs = set()

    with open(path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            verbs.add(row["verb"].strip().lower())

    return verbs


def load_buzzwords(path):
    words = set()

    with open(path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            words.add(row["word"].strip().lower())

    return words

# ======================================
# LOAD CONFIG
# ======================================

SECTION_HEADERS = load_section_headers(os.path.join(BASE_DIR, "section_headers.csv"))
ACTION_VERBS = load_action_verbs(os.path.join(BASE_DIR, "action_verbs.csv"))
BUZZWORDS = load_buzzwords(os.path.join(BASE_DIR, "buzzwords.csv"))

BUZZWORD_PATTERN = re.compile(
    r"\b(" + "|".join(re.escape(w) for w in sorted(BUZZWORDS, key=len, reverse=True)) + r")\b"
)


# ======================================
# TEXT PROCESSING
# ======================================

def preprocess_text(text: str) -> str:

    # Pull all keywords from your CSV to build the split pattern dynamically
    all_keywords = []
    for kws in SECTION_HEADERS.values():
        all_keywords.extend(kws)

    # Sort longest first so "technical skills" matches before "skills"
    all_keywords.sort(key=len, reverse=True)

    # Build regex pattern from your actual CSV keywords
    pattern = "|".join(re.escape(kw) for kw in all_keywords)

    # Insert newline before every keyword found mid-line
    text = re.sub(
        rf"(?<!\n)({pattern})",
        r"\n\1",
        text,
        flags=re.I
    )

    return text


def normalize_text(text: str) -> str:
    return text.lower()


# ======================================
# SECTION DETECTION
# ======================================

def detect_sections(text: str):

    sections = {}
    current_section = None

    for raw_line in text.splitlines():

        stripped = raw_line.strip()
        if not stripped:
            continue

        line = stripped.lower()
        clean_line = re.sub(r"[^a-z\s]", "", line).strip()

        matched_section = None

        # Exact match
        for section, keywords in SECTION_HEADERS.items():
            if clean_line in keywords:
                matched_section = section
                break

        # Loose match
        if not matched_section:
            for section, keywords in SECTION_HEADERS.items():
                for kw in keywords:
                    if kw in clean_line and len(clean_line.split()) <= 4:
                        matched_section = section
                        break
                if matched_section:
                    break

        if matched_section:
            current_section = matched_section
            sections.setdefault(current_section, [])
            continue

        if current_section:
            sections[current_section].append(stripped)

    return sections


def clean_first_word(word):
    return re.sub(r"^[^a-zA-Z]+", "", word)

# ======================================
# BULLET ANALYSIS
# ======================================

def lint_bullets(sections):

    issues = []

    for block in ["experience", "projects"]:

        for line in sections.get(block, []):

            stripped = line.strip()
            content = stripped.lower()
            words = content.split()

            if not words:
                continue

            first_word = clean_first_word(words[0])

            is_bullet = (
                stripped.startswith(("-", "•")) or
                first_word in ACTION_VERBS
            )

            if not is_bullet:
                continue

            if len(words) < 8:
                issues.append({"issue": "too_short", "text": content})

            if first_word not in ACTION_VERBS:
                issues.append({"issue": "weak_action_verb", "text": content})

            if not NUMBER_REGEX.search(content):
                issues.append({"issue": "no_metrics", "text": content})

            buzz_matches = BUZZWORD_PATTERN.findall(content)
            for buzz in buzz_matches:
                issues.append({"issue": "buzzword", "text": buzz})

    return issues


def detect_global_buzzwords(text):
    matches = BUZZWORD_PATTERN.findall(text)
    return list(set(matches))


def validate_contact_info(text):
    email_found = bool(EMAIL_REGEX.search(text))
    phone_found = bool(PHONE_REGEX.search(text))

    return {
        "email_found": email_found,
        "phone_found": phone_found
    }

def resume_lint(text: str):

    text = preprocess_text(text)
    text = normalize_text(text)
    score = 100
    contact_info = validate_contact_info(text)

    if not contact_info["email_found"]:
        score -= 5

    if not contact_info["phone_found"]:
        score -= 5


    sections = detect_sections(text)

    # Education fallback detection
    if "education" not in sections:
        if re.search(r"\b(bachelor|master|degree|bca|btech)\b", text):
            sections["education"] = ["Detected via degree keyword"]

    bullet_issues = lint_bullets(sections)
    global_buzz = detect_global_buzzwords(text)

   

    # Bullet penalties
    score -= min(len(bullet_issues) * 2, 20)

    # Missing section penalties
    missing_sections = []

    for s in SECTION_HEADERS:
        if s not in sections:
            if s == "experience" and "projects" in sections:
                continue
            missing_sections.append(s)

    score -= len(missing_sections) * 5

    buzz_density = len(global_buzz) / max(len(text.split()), 1)
    if buzz_density > 0.02:
        score -= 5

    score = max(min(score, 100), 0)

    return {
        "sections_found": list(sections.keys()),
        "missing_sections": missing_sections,
        "bullet_issues": bullet_issues,
        "global_buzzwords": global_buzz,
        "buzzword_density": round(buzz_density, 4),
        "contact_info": contact_info,
        "resume_score": score
    }

import random

def generate_roast(analysis, tone="mild"):

    score = analysis["resume_score"]
    issues = analysis["bullet_issues"]
    missing_sections = analysis["missing_sections"]
    global_buzz = analysis["global_buzzwords"]
    contact = analysis.get("contact_info", {})

    roast_lines = []

    # ----------------------------------
    # Overall Score Reaction
    # ----------------------------------

    if tone == "mild":
        if score >= 80:
            roast_lines.append("Not bad. You clearly know what you're doing, but there’s room to sharpen impact.")
        elif score >= 60:
            roast_lines.append("Decent structure, weak impact. This won’t dominate a hiring stack.")
        else:
            roast_lines.append("This needs serious tightening. Right now it feels average at best.")
    else:  # brutal
        if score >= 80:
            roast_lines.append("You almost look hireable. Almost.")
        elif score >= 60:
            roast_lines.append("This resume screams 'mid-level comfort zone'. Nothing stands out.")
        else:
            roast_lines.append("If this lands interviews, the market is broken.")

    # ----------------------------------
    # Missing Sections
    # ---------------------------------- 
    for sec in missing_sections:
        if tone == "brutal":
           roast_lines.append(f"No {sec} section. You’re skipping fundamentals. Handle the basics before chasing bigger opportunities.")
        else:
            roast_lines.append(f"You're missing a {sec} section. Adding it would strengthen structure.")

    # ----------------------------------
    # Contact Info
    # ----------------------------------

    if not contact.get("email_found"):
        if tone == "brutal":
            roast_lines.append("No email on your resume. Are you trying to stay hidden?")
        else:
            roast_lines.append("Consider adding your email address.")

    if not contact.get("phone_found"):
        if tone == "brutal":
            roast_lines.append("No phone number. Do you even want to be contacted?")
        else:
            roast_lines.append("Adding a phone number can improve response rates.")


    if global_buzz:
        buzz_preview = ", ".join(global_buzz[:5])

        if tone == "brutal":
            roast_lines.append(
                f"Buzzwords detected: {buzz_preview}. This reads like LinkedIn autopilot mode."
            )
        else:
            roast_lines.append(
                f"Some buzzwords detected: {buzz_preview}. Consider replacing them with measurable impact."
            )


    for issue in issues[:5]:

        if issue["issue"] == "no_metrics":
            if tone == "brutal":
                roast_lines.append(
                    "You describe effort, not outcomes. If no numbers moved, nothing moved."
                )
            else:
                roast_lines.append(
                    "Try adding measurable results. Numbers increase credibility."
                )

        elif issue["issue"] == "weak_action_verb":
            if tone == "brutal":
                roast_lines.append(
                    "Weak verbs create weak perception. Own your impact properly."
                )
            else:
                roast_lines.append(
                    "Stronger action verbs would improve clarity and impact."
                )

        elif issue["issue"] == "too_short":
            if tone == "brutal":
                roast_lines.append(
                    "That bullet is a headline, not an achievement. Add depth."
                )
            else:
                roast_lines.append(
                    "Expand that bullet with more context and technical detail."
                )

        elif issue["issue"] == "buzzword":
            if tone == "brutal":
                roast_lines.append(
                    "Buzzwords don’t impress engineers. Proof does."
                )
            else:
                roast_lines.append(
                    "Consider replacing buzzwords with specific accomplishments."
                )
    return roast_lines