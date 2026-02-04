"""
Test roadmap generation for multiple career fields
Tests representatives from all 7 interest areas:
1. Information Technology
2. Business & Management
3. Engineering/Technology
4. Arts & Design
5. Healthcare/Medicine
6. Education/Teaching
7. Agriculture/Environment
"""

import requests
import json
from typing import Dict, Any

API_URL = "http://localhost:8000/roadmap/generate"

# Test cases for each interest area
TEST_CASES = [
    {
        "name": "Software Engineer (IT)",
        "request": {
            "user_profile": {
                "age": "20",
                "gender": "Male",
                "nativeLanguage": "Tamil",
                "preferredLanguage": "English",
                "olResults": "Maths: A, English: B, Science: B, ICT: A",
                "alStream": "Physical Science",
                "alResults": "Combined Maths: B, Physics: B, Chemistry: B",
                "otherQualifications": None,
                "ieltsScore": 6,
                "interestArea": "Information Technology",
                "careerGoal": "Software Engineer",
                "monthlyIncome": "45000 LKR",
                "fundingMethod": "Self-funded",
                "availability": "Weekday",
                "completionPeriod": "3-4 years",
                "studyMethod": "Onsite",
                "currentLocation": "Colombo, Sri Lanka",
                "preferredLocations": "Colombo, Sri Lanka"
            },
            "selected_course": {
                "course_name": "Bachelor of Software Engineering Honours",
                "university": "NSBM Green University",
                "location": "Pitipana, Homagama",
                "match_score": 85.5,
                "explanation": "This program offers comprehensive training in software development, algorithms, data structures, and modern frameworks.",
                "url": "https://nsbm.ac.lk/programme/bachelor-of-software-engineering-honours/",
                "career_opportunities": "Software Engineer, System Analyst, Full Stack Developer, DevOps Engineer",
                "study_language": "English",
                "study_method": "Full Time",
                "duration": "3-4 Years",
                "requirements": "GCE A/L qualifications in Physical Science. Good knowledge of mathematics and logical thinking.",
                "course_fee": "Rs.850,000.00 per year",
                "department": "School of Computing",
                "curriculum": "Data Structures, Algorithms, Object-Oriented Programming, Database Systems, Web Development, Software Engineering, Operating Systems, Mobile App Development"
            }
        },
        "expected_keywords": ["python", "java", "git", "algorithm", "data structure"],
        "interest_area": "Information Technology"
    },
    {
        "name": "Civil Engineer (Engineering)",
        "request": {
            "user_profile": {
                "age": "21",
                "gender": "Female",
                "nativeLanguage": "Sinhala",
                "preferredLanguage": "English",
                "olResults": "Maths: A, English: B, Science: A",
                "alStream": "Physical Science",
                "alResults": "Combined Maths: A, Physics: B, Chemistry: B",
                "otherQualifications": None,
                "ieltsScore": 6.5,
                "interestArea": "Engineering/Technology",
                "careerGoal": "Civil Engineer",
                "monthlyIncome": "50000 LKR",
                "fundingMethod": "Self-funded",
                "availability": "Weekday",
                "completionPeriod": "4-5 years",
                "studyMethod": "Onsite",
                "currentLocation": "Kandy, Sri Lanka",
                "preferredLocations": "Kandy, Colombo"
            },
            "selected_course": {
                "course_name": "Bachelor of Civil Engineering",
                "university": "University of Moratuwa",
                "location": "Moratuwa, Sri Lanka",
                "match_score": 88.0,
                "explanation": "Comprehensive civil engineering program covering structural design, construction management, and infrastructure development.",
                "url": "https://uom.lk/civil",
                "career_opportunities": "Civil Engineer, Structural Engineer, Construction Manager, Project Engineer",
                "study_language": "English",
                "study_method": "Full Time",
                "duration": "4 Years",
                "requirements": "GCE A/L qualifications in Physical Science with good grades in Mathematics and Physics.",
                "course_fee": "Government subsidized",
                "department": "Faculty of Engineering",
                "curriculum": "Structural Analysis, Surveying, Geotechnical Engineering, Construction Management, AutoCAD, Civil 3D, Fluid Mechanics, Transportation Engineering, Building Codes"
            }
        },
        "expected_keywords": ["structural", "autocad", "construction", "surveying", "civil"],
        "interest_area": "Engineering/Technology"
    },
    {
        "name": "Nurse (Healthcare)",
        "request": {
            "user_profile": {
                "age": "19",
                "gender": "Female",
                "nativeLanguage": "Tamil",
                "preferredLanguage": "English",
                "olResults": "Maths: B, English: A, Science: A, Health Science: A",
                "alStream": "Biological Science",
                "alResults": "Biology: B, Chemistry: B, Physics: C",
                "otherQualifications": None,
                "ieltsScore": 6,
                "interestArea": "Healthcare/Medicine",
                "careerGoal": "Registered Nurse",
                "monthlyIncome": "40000 LKR",
                "fundingMethod": "Self-funded",
                "availability": "Weekday",
                "completionPeriod": "3-4 years",
                "studyMethod": "Onsite",
                "currentLocation": "Jaffna, Sri Lanka",
                "preferredLocations": "Jaffna, Colombo"
            },
            "selected_course": {
                "course_name": "Bachelor of Science in Nursing",
                "university": "University of Colombo",
                "location": "Colombo, Sri Lanka",
                "match_score": 87.5,
                "explanation": "Comprehensive nursing program with clinical practice, patient care training, and healthcare management.",
                "url": "https://cmb.ac.lk/nursing",
                "career_opportunities": "Registered Nurse, Clinical Nurse, ICU Nurse, Community Health Nurse",
                "study_language": "English",
                "study_method": "Full Time",
                "duration": "4 Years",
                "requirements": "GCE A/L in Biological Science. Good understanding of human biology and chemistry.",
                "course_fee": "Government subsidized",
                "department": "Faculty of Medicine",
                "curriculum": "Anatomy & Physiology, Patient Care Fundamentals, Pharmacology, Medical-Surgical Nursing, Pediatric Nursing, Mental Health Nursing, Clinical Practice, Healthcare Ethics"
            }
        },
        "expected_keywords": ["patient", "clinical", "nursing", "care", "medical"],
        "interest_area": "Healthcare/Medicine"
    },
    {
        "name": "Teacher (Education)",
        "request": {
            "user_profile": {
                "age": "22",
                "gender": "Male",
                "nativeLanguage": "Sinhala",
                "preferredLanguage": "English",
                "olResults": "Maths: A, English: A, Science: B",
                "alStream": "Arts",
                "alResults": "English: A, Geography: B, History: B",
                "otherQualifications": None,
                "ieltsScore": 7,
                "interestArea": "Education/Teaching",
                "careerGoal": "Primary School Teacher",
                "monthlyIncome": "35000 LKR",
                "fundingMethod": "Self-funded",
                "availability": "Weekday",
                "completionPeriod": "3-4 years",
                "studyMethod": "Onsite",
                "currentLocation": "Galle, Sri Lanka",
                "preferredLocations": "Galle, Colombo"
            },
            "selected_course": {
                "course_name": "Bachelor of Education",
                "university": "University of Colombo",
                "location": "Colombo, Sri Lanka",
                "match_score": 86.0,
                "explanation": "Comprehensive teacher training program covering pedagogy, curriculum development, and classroom management.",
                "url": "https://cmb.ac.lk/education",
                "career_opportunities": "Primary Teacher, Secondary Teacher, Education Coordinator, Curriculum Developer",
                "study_language": "English",
                "study_method": "Full Time",
                "duration": "4 Years",
                "requirements": "GCE A/L qualifications with good communication skills and passion for teaching.",
                "course_fee": "Government subsidized",
                "department": "Faculty of Education",
                "curriculum": "Pedagogy & Teaching Methods, Educational Psychology, Curriculum Development, Classroom Management, Assessment & Evaluation, Child Development, Teaching Practice, Educational Technology"
            }
        },
        "expected_keywords": ["teaching", "pedagogy", "classroom", "curriculum", "student"],
        "interest_area": "Education/Teaching"
    },
    {
        "name": "Graphic Designer (Arts)",
        "request": {
            "user_profile": {
                "age": "20",
                "gender": "Female",
                "nativeLanguage": "English",
                "preferredLanguage": "English",
                "olResults": "Maths: B, English: A, Art: A, ICT: B",
                "alStream": "Arts",
                "alResults": "Art: A, English: A, Geography: B",
                "otherQualifications": "Certificate in Adobe Photoshop",
                "ieltsScore": 7.5,
                "interestArea": "Arts & Design",
                "careerGoal": "Graphic Designer",
                "monthlyIncome": "45000 LKR",
                "fundingMethod": "Self-funded",
                "availability": "Weekday",
                "completionPeriod": "3-4 years",
                "studyMethod": "Onsite",
                "currentLocation": "Colombo, Sri Lanka",
                "preferredLocations": "Colombo"
            },
            "selected_course": {
                "course_name": "Bachelor of Fine Arts in Graphic Design",
                "university": "University of Visual & Performing Arts",
                "location": "Colombo, Sri Lanka",
                "match_score": 90.0,
                "explanation": "Comprehensive graphic design program with focus on visual communication, branding, and digital media.",
                "url": "https://vpa.ac.lk/graphic-design",
                "career_opportunities": "Graphic Designer, Art Director, Brand Designer, UI Designer, Visual Designer",
                "study_language": "English",
                "study_method": "Full Time",
                "duration": "4 Years",
                "requirements": "GCE A/L with Art subject preferred. Portfolio submission required.",
                "course_fee": "Rs.350,000.00 per year",
                "department": "Faculty of Visual Arts",
                "curriculum": "Typography, Adobe Photoshop, Illustrator, InDesign, Layout Design, Color Theory, Branding & Identity, Digital Media, Portfolio Development, Design Thinking"
            }
        },
        "expected_keywords": ["design", "adobe", "creative", "visual", "graphic"],
        "interest_area": "Arts & Design"
    },
    {
        "name": "Marketing Manager (Business)",
        "request": {
            "user_profile": {
                "age": "21",
                "gender": "Male",
                "nativeLanguage": "Sinhala",
                "preferredLanguage": "English",
                "olResults": "Maths: A, English: A, Commerce: A, Economics: B",
                "alStream": "Commerce",
                "alResults": "Business Studies: A, Accounting: A, Economics: B",
                "otherQualifications": None,
                "ieltsScore": 6.5,
                "interestArea": "Business & Management",
                "careerGoal": "Marketing Manager",
                "monthlyIncome": "50000 LKR",
                "fundingMethod": "Self-funded",
                "availability": "Weekday",
                "completionPeriod": "3-4 years",
                "studyMethod": "Onsite",
                "currentLocation": "Colombo, Sri Lanka",
                "preferredLocations": "Colombo"
            },
            "selected_course": {
                "course_name": "Bachelor of Business Administration - Marketing",
                "university": "SLIIT Business School",
                "location": "Malabe, Colombo",
                "match_score": 88.5,
                "explanation": "Specialized BBA program focusing on marketing strategies, digital marketing, and brand management.",
                "url": "https://sliit.lk/bba-marketing",
                "career_opportunities": "Marketing Manager, Brand Manager, Digital Marketing Specialist, Marketing Analyst",
                "study_language": "English",
                "study_method": "Full Time",
                "duration": "3 Years",
                "requirements": "GCE A/L in Commerce stream preferred. Good communication and analytical skills.",
                "course_fee": "Rs.450,000.00 per year",
                "department": "Business School",
                "curriculum": "Marketing Principles, Digital Marketing, Consumer Behavior, Brand Management, Market Research, Social Media Marketing, Analytics, Strategic Planning, Campaign Management"
            }
        },
        "expected_keywords": ["marketing", "brand", "digital", "strategy", "campaign"],
        "interest_area": "Business & Management"
    },
    {
        "name": "Environmental Scientist (Agriculture/Environment)",
        "request": {
            "user_profile": {
                "age": "22",
                "gender": "Male",
                "nativeLanguage": "English",
                "preferredLanguage": "English",
                "olResults": "Maths: A, English: A, Science: A, Geography: A",
                "alStream": "Biological Science",
                "alResults": "Biology: A, Chemistry: B, Agricultural Science: A",
                "otherQualifications": None,
                "ieltsScore": 7,
                "interestArea": "Agriculture/Environment",
                "careerGoal": "Environmental Scientist",
                "monthlyIncome": "45000 LKR",
                "fundingMethod": "Self-funded",
                "availability": "Weekday",
                "completionPeriod": "3-4 years",
                "studyMethod": "Onsite",
                "currentLocation": "Peradeniya, Sri Lanka",
                "preferredLocations": "Peradeniya, Colombo"
            },
            "selected_course": {
                "course_name": "Bachelor of Science in Environmental Science",
                "university": "University of Peradeniya",
                "location": "Peradeniya, Sri Lanka",
                "match_score": 89.0,
                "explanation": "Comprehensive environmental science program focusing on ecology, conservation, and sustainability.",
                "url": "https://pdn.ac.lk/env-science",
                "career_opportunities": "Environmental Scientist, Conservation Officer, Sustainability Consultant, Environmental Analyst",
                "study_language": "English",
                "study_method": "Full Time",
                "duration": "4 Years",
                "requirements": "GCE A/L in Biological Science with good grades in Biology and Chemistry.",
                "course_fee": "Government subsidized",
                "department": "Faculty of Science",
                "curriculum": "Ecology, Environmental Chemistry, GIS & Remote Sensing, Sustainability, Conservation Biology, Environmental Policy, Field Research Methods, Climate Science, Biodiversity Management"
            }
        },
        "expected_keywords": ["environment", "sustainability", "ecology", "conservation", "climate"],
        "interest_area": "Agriculture/Environment"
    }
]

def test_career_field(test_case: Dict[str, Any]) -> Dict[str, Any]:
    """Test roadmap generation for a specific career field"""
    print(f"\n{'='*80}")
    print(f"Testing: {test_case['name']}")
    print(f"Interest Area: {test_case['interest_area']}")
    print(f"{'='*80}")
    
    try:
        response = requests.post(API_URL, json=test_case["request"], timeout=120)
        
        if response.status_code == 200:
            data = response.json()
            
            # Extract metadata
            metadata = data.get("metadata", {})
            curriculum_focus = metadata.get("curriculum_focus", "")
            languages = metadata.get("languages", [])
            priority_skills = metadata.get("priority_skills", [])
            
            # Get first stage for validation
            roadmap = data.get("roadmap", [])
            first_stage = roadmap[0] if roadmap else {}
            
            print(f"\n[SUCCESS]")
            print(f"\nMetadata:")
            print(f"  Curriculum Focus: {curriculum_focus}")
            print(f"  Languages: {', '.join(languages) if languages else 'None'}")
            print(f"  Priority Skills: {', '.join(priority_skills[:5])}")
            
            print(f"\nFirst Stage:")
            print(f"  Goal: {first_stage.get('goal', 'N/A')}")
            print(f"  Duration: {first_stage.get('duration', 'N/A')}")
            
            # Check for expected keywords in the full response
            response_text = json.dumps(data).lower()
            keyword_counts = {}
            for keyword in test_case["expected_keywords"]:
                count = response_text.count(keyword.lower())
                keyword_counts[keyword] = count
            
            print(f"\nKeyword Analysis:")
            for keyword, count in keyword_counts.items():
                status = "[YES]" if count > 0 else "[NO]"
                print(f"  {status} '{keyword}': {count} occurrences")
            
            # Overall validation
            total_keywords_found = sum(1 for count in keyword_counts.values() if count > 0)
            validation_pass = total_keywords_found >= len(test_case["expected_keywords"]) * 0.6  # 60% threshold
            
            if validation_pass:
                print(f"\n[VALIDATION PASSED] ({total_keywords_found}/{len(test_case['expected_keywords'])} keywords found)")
            else:
                print(f"\n[VALIDATION WARNING] ({total_keywords_found}/{len(test_case['expected_keywords'])} keywords found)")
            
            return {
                "status": "success",
                "name": test_case["name"],
                "interest_area": test_case["interest_area"],
                "validation_passed": validation_pass,
                "keywords_found": total_keywords_found,
                "curriculum_focus": curriculum_focus,
                "data": data
            }
            
        else:
            print(f"\n[FAILED] - Status: {response.status_code}")
            print(f"Response: {response.text}")
            return {
                "status": "error",
                "name": test_case["name"],
                "interest_area": test_case["interest_area"],
                "error": response.text
            }
            
    except Exception as e:
        print(f"\n[ERROR]: {str(e)}")
        return {
            "status": "error",
            "name": test_case["name"],
            "interest_area": test_case["interest_area"],
            "error": str(e)
        }

def main():
    print("="*80)
    print("MULTI-FIELD ROADMAP GENERATION TEST")
    print("Testing all 7 interest areas")
    print("="*80)
    
    results = []
    
    for test_case in TEST_CASES:
        result = test_career_field(test_case)
        results.append(result)
    
    # Summary
    print(f"\n\n{'='*80}")
    print("TEST SUMMARY")
    print(f"{'='*80}\n")
    
    success_count = sum(1 for r in results if r["status"] == "success")
    validation_pass_count = sum(1 for r in results if r.get("validation_passed", False))
    
    print(f"Total Tests: {len(TEST_CASES)}")
    print(f"Successful Generations: {success_count}/{len(TEST_CASES)}")
    print(f"Passed Validation: {validation_pass_count}/{len(TEST_CASES)}")
    
    print(f"\n{'Interest Area':<30} {'Career':<30} {'Status':<15} {'Validation':<15}")
    print("-"*90)
    
    for result in results:
        status = "[SUCCESS]" if result["status"] == "success" else "[ERROR]"
        validation = "[PASS]" if result.get("validation_passed", False) else "[WARN]"
        print(f"{result['interest_area']:<30} {result['name']:<30} {status:<15} {validation:<15}")
    
    # Save detailed results
    output_file = "multi_field_test_results.json"
    with open(output_file, 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"\n[SAVED] Detailed results saved to: {output_file}")
    
    # Final verdict
    if success_count == len(TEST_CASES) and validation_pass_count >= len(TEST_CASES) * 0.8:
        print("\n[ALL TESTS PASSED] System supports all 7 interest areas!")
    elif success_count == len(TEST_CASES):
        print("\n[PARTIAL SUCCESS] All roadmaps generated, but some validation warnings")
    else:
        print(f"\n[SOME FAILED] {len(TEST_CASES) - success_count} errors occurred")

if __name__ == "__main__":
    main()
