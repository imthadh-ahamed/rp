import json

INPUT = "data/raw/CourseData.json"
OUTPUT = "data/processed/CourseData_clean.json"

def clean_course_row(row):
    return {
        "course_name": row.get("Course", "").strip(),
        "campus": row.get("Campus", "").strip(),
        "department": row.get("Department", "").strip(),
        "study_language": row.get("Study Language", "").strip(),
        "study_method": row.get("Study Method", "").strip(),
        "duration": row.get("Duration", "").strip(),
        "entry_requirements": row.get("Entry Requirements", "").strip(),
        "english_level": row.get("English Level", "").strip(),
        "course_fee": row.get("Course Fees", "").strip(),
        "location": row.get("Location", "").strip(),
        "career_opportunities": row.get("Career Opportunities", "").strip(),
        "url": row.get("URL", "").strip(),
    }

def process_json():
    with open(INPUT, "r", encoding="utf-8") as f:
        data = json.load(f)

    cleaned = [clean_course_row(row) for row in data]

    with open(OUTPUT, "w", encoding="utf-8") as f:
        json.dump(cleaned, f, indent=4, ensure_ascii=False)

    print(f"Cleaned JSON saved to: {OUTPUT}")

if __name__ == "__main__":
    process_json()
