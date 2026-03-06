import sys, os, json
import argparse
from recommender import recommend_jobs
from dataChecker import resume_lint, generate_roast
from reader import read_pdf, read_docx
from matcher import compare_resume_with_jd

def main():
    parser = argparse.ArgumentParser(description='Resume Analyser Engine')
    parser.add_argument('file_path', help='Path to the resume file')
    parser.add_argument('--mode', choices=['roast', 'recommend', 'match', 'all'], default='all', help='Analysis mode')
    parser.add_argument('--jd', help='Job Description for matching (text or path to file)')
    
    # Use parse_known_args to handle potential issues with unparsed args if called from node with odd flags
    args, unknown = parser.parse_known_args()

    file_path = args.file_path

    if not os.path.exists(file_path):
        print(json.dumps({"error": "File not found"}))
        sys.exit(1)

    try:
        if file_path.endswith(".pdf"):
            
            resume_text = read_pdf(file_path)
        elif file_path.endswith(".docx"):
            resume_text = read_docx(file_path)
        else:
            print(json.dumps({"error": "Unsupported format"}))
            sys.exit(1)
    except Exception as e:
        print(json.dumps({"error": f"Error reading file: {str(e)}"}))
        sys.exit(1)

    if not resume_text:
        print(json.dumps({"error": "Could not extract text from resume"}))
        sys.exit(1)

    result = {}

    try:
        # Calculate lint score first as it might be used in multiple places or just good to have
        lint = resume_lint(resume_text)
        
        if args.mode in ['roast', 'all']:
            result['roast'] = generate_roast(lint, tone="brutal")
            result['score'] = lint

        if args.mode in ['recommend', 'all']:
             # Note: recommend_jobs might need database connection, ensure it handles connection errors gracefully
             try:
                result['recommendations'] = recommend_jobs(resume_text)
             except Exception as e:
                 result['recommendations'] = []
                 result['recommendation_error'] = str(e)

        if args.mode in ['match', 'all']:
            if args.jd:
                # Check if jd argument is a file path 
                if os.path.exists(args.jd):
                    with open(args.jd, 'r', encoding='utf-8') as f:
                        job_description = f.read()
                else:
                    job_description = args.jd
                
                result['match'] = compare_resume_with_jd(resume_text, job_description)
            else:
                if args.mode == 'match':
                    result['error'] = "Job description required for match mode"

    except Exception as e:
        print(json.dumps({"error": f"Processing error: {str(e)}"}))
        sys.exit(1)

    print(json.dumps(result, default=str))

if __name__ == "__main__":
    main()