import os
from pymongo import MongoClient
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

MIN_SCORE = 0.1


def load_jobs_from_mongodb():
    mongo_uri = os.environ.get("MONGO_URI", "mongodb://127.0.0.1:27017")
    client = MongoClient(mongo_uri)
    collection = client["ResumeAnalyser"]["jobs"]

    cursor = collection.aggregate([
        {
            "$match": {
                "status": {"$regex": "^open$", "$options": "i"}
            }
        },
        {
            "$lookup": {
                "from": "users",
                "localField": "company",
                "foreignField": "_id",
                "as": "company"
            }
        },
        {
            "$unwind": {
                "path": "$company",
                "preserveNullAndEmptyArrays": True
            }
        },
        {
            "$project": {
                "applications": 0,
                "company._id": 0,
                "company.password": 0,
                "company.role": 0,
                "company.updatedAt": 0,
                "company.createdAt": 0
            }
        }
    ])

    jobs = []
    documents = []

    for job in cursor:
        text = (
            f"{job.get('title', '')} "
            f"{' '.join(job.get('skills', []))} "
            f"{job.get('description', '')}"
        )
        jobs.append(job)
        documents.append(text.lower())

    return jobs, documents


def recommend_jobs(resume_text):
    jobs, docs = load_jobs_from_mongodb()
    if not jobs:
        return []

    corpus = docs + [resume_text]

    tfidf = TfidfVectorizer(stop_words="english")
    matrix = tfidf.fit_transform(corpus)

    scores = cosine_similarity(matrix[-1], matrix[:-1])[0]

    results = []

    for job, score in zip(jobs, scores):
        if score >= MIN_SCORE:
            job_copy = job.copy()
            job_copy["matchScore"] = round(float(score), 2)
            results.append(job_copy)

    results.sort(key=lambda x: x["matchScore"], reverse=True)
    return results
