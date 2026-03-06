import re
from collections import Counter
from itertools import chain

WORD_REGEX = re.compile(r"\b[a-zA-Z0-9+#.]+\b")

STOP_WORDS = {
    "and","or","the","a","an","with","for","to",
    "of","in","on","at","by","as","is","are",
    "be","this","that","will","we","you","our",
    "should","must","required","experience",
    "looking","candidate","job","role",
    "responsible","ability","strong","good",
    "excellent","working","work","using",
    "knowledge","building","years","understanding"
}
 
# -------------------------------
# NORMALIZATION
# -------------------------------

def normalize(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^a-z0-9+#.\s]", " ", text)
    return text

# -------------------------------
# NGRAM GENERATOR
# -------------------------------

def generate_ngrams(words, n):
    return zip(*[words[i:] for i in range(n)])


# -------------------------------
# KEYWORD EXTRACTION
# -------------------------------

def extract_keywords(text: str):
    text = normalize(text)

    words = WORD_REGEX.findall(text)
    words = [w for w in words if len(w) > 2 and w not in STOP_WORDS]

    keyword_counter = Counter()

    # Unigrams
    for w in words:
        keyword_counter[w] += 1

    # Bigrams
    # for gram in generate_ngrams(words, 2):
    #     keyword_counter[" ".join(gram)] += 1

    # Trigrams
    # for gram in generate_ngrams(words, 3):
    #     keyword_counter[" ".join(gram)] += 1

    return keyword_counter


# -------------------------------
# MATCHING ENGINE
# -------------------------------

def compare_resume_with_jd(resume_text: str, job_description: str):

    resume_keywords = extract_keywords(resume_text)
    jd_keywords = extract_keywords(job_description)

    # Focus on meaningful JD terms
    # Remove very rare terms
    jd_core = {
        k: v for k, v in jd_keywords.items()
        if v >= 2 or len(k.split()) > 1
    }

    matched = []
    missing = []

    total_weight = 0
    matched_weight = 0

    for keyword, freq in jd_core.items():

        # Phrase weighting
        weight = 2 if len(keyword.split()) > 1 else 1

        total_weight += weight

        if keyword in resume_keywords:
            matched.append(keyword)
            matched_weight += weight
        else:
            missing.append(keyword)

    match_score = round((matched_weight / total_weight) * 100, 2) if total_weight else 0

    return {
        "match_percentage": match_score,
        "total_jd_keywords": len(jd_core),
        "matched_keywords": sorted(matched),
        "missing_keywords": sorted(missing)
    }
