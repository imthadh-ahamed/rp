"""
Curriculum Analysis Agent
Analyzes course curriculum to extract skills, languages, and focus areas
"""
import re
from typing import Dict, List
from api.schemas.roadmap import CurriculumAnalysis, SelectedCourse


class CurriculumAgent:
    """Analyzes course curriculum using pattern matching and extraction"""
    
    def __init__(self):
        # Common skill keywords to detect
        self.skill_patterns = {
            # Software/IT Skills
            "programming": r"(programming|coding|development|software)",
            "algorithms": r"(algorithm|data structure|DSA)",
            "databases": r"(database|SQL|NoSQL|data management)",
            "web": r"(web development|frontend|backend|full.?stack)",
            "cloud": r"(cloud|AWS|Azure|GCP)",
            "systems": r"(system design|architecture|distributed)",
            "testing": r"(testing|QA|quality assurance)",
            "devops": r"(devops|CI/CD|deployment)",
            "ai_ml": r"(machine learning|AI|deep learning|neural)",
            "data_science": r"(data science|analytics|visualization)",
            
            # Civil Engineering Skills
            "structural": r"(structural analysis|structural design|structures|structural engineering)",
            "construction": r"(construction|building|site management|project management)",
            "autocad": r"(AutoCAD|CAD|Civil 3D|BIM|drafting|technical drawing)",
            "surveying": r"(surveying|geotechnical|soil mechanics|site planning)",
            "materials": r"(construction materials|concrete|steel|building materials)",
            "codes": r"(building codes|safety standards|regulations|compliance)",
            
            # Mechanical Engineering Skills
            "thermodynamics": r"(thermodynamics|heat transfer|fluid mechanics)",
            "machine_design": r"(machine design|mechanical design|mechanics)",
            "manufacturing": r"(manufacturing|production|machining|CNC)",
            
            # Electrical Engineering Skills
            "circuits": r"(circuit|electronics|semiconductors|PCB)",
            "power_systems": r"(power systems|electrical|energy|renewable energy)",
            "embedded": r"(embedded|microcontroller|firmware|IoT)",
            
            # Healthcare/Medicine Skills
            "patient_care": r"(patient care|clinical|nursing|bedside)",
            "pharmacology": r"(pharmacology|medication|drug|pharmaceutical)",
            "medical_tech": r"(medical technology|lab|diagnostic|radiology)",
            "anatomy": r"(anatomy|physiology|pathology|biology)",
            "healthcare_mgmt": r"(healthcare management|hospital administration)",
            
            # Education/Teaching Skills
            "pedagogy": r"(pedagogy|teaching methods|instruction|classroom)",
            "curriculum": r"(curriculum|syllabus|lesson plan)",
            "assessment": r"(assessment|evaluation|grading|testing)",
            "education_tech": r"(educational technology|e-learning|LMS)",
            
            # Arts & Design Skills
            "graphic_design": r"(graphic design|adobe|photoshop|illustrator)",
            "ui_ux": r"(UI|UX|user interface|user experience|wireframe|prototype)",
            "3d_modeling": r"(3D modeling|maya|blender|animation)",
            "visual_arts": r"(visual arts|drawing|painting|illustration)",
            "interior_design": r"(interior design|space planning|furniture)",
            
            # Business & Management Skills
            "finance": r"(finance|accounting|budgeting|financial analysis)",
            "marketing": r"(marketing|branding|advertising|digital marketing)",
            "hr": r"(human resources|HR|recruitment|talent management)",
            "business_strategy": r"(business strategy|strategic planning|entrepreneurship)",
            
            # Agriculture/Environment Skills
            "agriculture": r"(agriculture|farming|crop|irrigation)",
            "environmental": r"(environmental|ecology|conservation|sustainability)",
            "soil_science": r"(soil|agronomy|horticulture)",
            
            # General Engineering Skills
            "project_mgmt": r"(project management|cost estimation|scheduling)",
            "quality": r"(quality control|Six Sigma|Lean|process improvement)",
        }
        
        self.language_patterns = [
            r"\b(Python|Java|JavaScript|TypeScript|C\+\+|C#|Go|Rust|Ruby|PHP|Swift|Kotlin)\b"
        ]
    
    def analyze(self, course: SelectedCourse) -> CurriculumAnalysis:
        """
        Analyze course to extract curriculum details
        
        Args:
            course: Selected course object from recommendation
            
        Returns:
            CurriculumAnalysis with extracted information
        """
        # Combine all text sources
        text_content = f"{course.course_name} {course.department or ''} {course.curriculum or ''}".lower()
        
        # Extract core skills from all available data
        core_skills = self._extract_skills(text_content)
        
        # Extract programming languages
        languages = self._extract_languages(text_content)
        
        # Determine focus area
        focus_area = self._determine_focus(course.course_name, core_skills)
        
        # Determine academic level
        level = self._determine_level(course.course_name)
        
        # Parse duration
        duration_years = self._parse_duration(course.duration)
        
        return CurriculumAnalysis(
            core_skills=core_skills,
            languages=languages,
            focus_area=focus_area,
            level=level,
            duration_years=duration_years
        )
    
    def _extract_skills(self, text: str) -> List[str]:
        """Extract core skills from text content"""
        detected_skills = []
        
        skill_map = {
            # Software/IT
            "programming": "Programming Fundamentals",
            "algorithms": "Data Structures & Algorithms",
            "databases": "Database Management",
            "web": "Web Development",
            "cloud": "Cloud Computing",
            "systems": "System Design",
            "testing": "Software Testing",
            "devops": "DevOps Practices",
            "ai_ml": "Machine Learning",
            "data_science": "Data Science",
            
            # Civil Engineering
            "structural": "Structural Analysis & Design",
            "construction": "Construction Management",
            "autocad": "AutoCAD & Civil 3D",
            "surveying": "Surveying & Geotechnical Engineering",
            "materials": "Construction Materials",
            "codes": "Building Codes & Standards",
            
            # Mechanical Engineering
            "thermodynamics": "Thermodynamics & Heat Transfer",
            "machine_design": "Machine Design & Mechanics",
            "manufacturing": "Manufacturing Processes",
            
            # Electrical Engineering
            "circuits": "Circuit Analysis & Electronics",
            "power_systems": "Power Systems & Distribution",
            "embedded": "Embedded Systems & Microcontrollers",
            
            # Healthcare/Medicine
            "patient_care": "Patient Care & Clinical Skills",
            "pharmacology": "Pharmacology & Medication Management",
            "medical_tech": "Medical Technology & Diagnostics",
            "anatomy": "Anatomy & Physiology",
            "healthcare_mgmt": "Healthcare Management",
            
            # Education/Teaching
            "pedagogy": "Pedagogy & Teaching Methods",
            "curriculum": "Curriculum Development",
            "assessment": "Assessment & Evaluation",
            "education_tech": "Educational Technology",
            
            # Arts & Design
            "graphic_design": "Graphic Design & Visual Communication",
            "ui_ux": "UI/UX Design",
            "3d_modeling": "3D Modeling & Animation",
            "visual_arts": "Visual Arts & Illustration",
            "interior_design": "Interior Design & Space Planning",
            
            # Business & Management
            "finance": "Financial Analysis & Accounting",
            "marketing": "Marketing & Brand Management",
            "hr": "Human Resources Management",
            "business_strategy": "Business Strategy & Planning",
            
            # Agriculture/Environment
            "agriculture": "Agriculture & Crop Management",
            "environmental": "Environmental Science & Conservation",
            "soil_science": "Soil Science & Agronomy",
            
            # General Engineering
            "project_mgmt": "Project Management",
            "quality": "Quality Control & Process Improvement",
        }
        
        for key, pattern in self.skill_patterns.items():
            if re.search(pattern, text, re.IGNORECASE):
                detected_skills.append(skill_map[key])
        
        # Intelligent defaults based on text content
        if not detected_skills:
            # Engineering
            if re.search(r"civil\s+engineering", text, re.IGNORECASE):
                detected_skills = ["Structural Analysis & Design", "Construction Management", "Engineering Mathematics"]
            elif re.search(r"mechanical\s+engineering", text, re.IGNORECASE):
                detected_skills = ["Machine Design & Mechanics", "Thermodynamics & Heat Transfer", "Manufacturing Processes"]
            elif re.search(r"electrical\s+engineering|electronics", text, re.IGNORECASE):
                detected_skills = ["Circuit Analysis & Electronics", "Power Systems & Distribution", "Signal Processing"]
            # Healthcare
            elif re.search(r"nursing|nurse", text, re.IGNORECASE):
                detected_skills = ["Patient Care & Clinical Skills", "Anatomy & Physiology", "Pharmacology"]
            elif re.search(r"pharmacy|pharmacist", text, re.IGNORECASE):
                detected_skills = ["Pharmacology & Medication Management", "Patient Counseling", "Drug Compounding"]
            # Education
            elif re.search(r"teaching|education", text, re.IGNORECASE):
                detected_skills = ["Pedagogy & Teaching Methods", "Curriculum Development", "Classroom Management"]
            # Arts & Design
            elif re.search(r"design|arts", text, re.IGNORECASE):
                detected_skills = ["Creative Design", "Visual Communication", "Design Software"]
            # Business
            elif re.search(r"business|management", text, re.IGNORECASE):
                detected_skills = ["Business Analysis", "Strategic Planning", "Leadership"]
            # Agriculture/Environment
            elif re.search(r"agriculture|environmental", text, re.IGNORECASE):
                detected_skills = ["Agriculture & Crop Management", "Environmental Science", "Sustainability"]
            # Default to programming (for software/IT courses)
            else:
                detected_skills = ["Professional Skills", "Problem Solving"]
        
        return list(set(detected_skills))[:8]  # Limit to 8 skills
    
    def _extract_languages(self, text: str) -> List[str]:
        """Extract programming languages mentioned"""
        languages = []
        
        for pattern in self.language_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            languages.extend(matches)
        
        # Default to common languages only for software/IT courses
        if not languages:
            if "software" in text.lower() or "programming" in text.lower():
                languages = ["Java", "Python"]
            elif "data" in text.lower() and ("science" in text.lower() or "analytics" in text.lower()):
                languages = ["Python", "SQL"]
            # Don't default to programming languages for non-IT courses
        
        return list(set(languages))[:5]  # Limit to 5 languages
    
    def _determine_focus(self, course_name: str, skills: List[str]) -> str:
        """Determine main focus area of the course"""
        name_lower = course_name.lower()
        
        # Engineering Disciplines
        if "civil engineering" in name_lower:
            return "Civil Engineering & Infrastructure"
        elif "mechanical engineering" in name_lower:
            return "Mechanical Engineering & Design"
        elif "electrical engineering" in name_lower or "electronics" in name_lower:
            return "Electrical & Electronics Engineering"
        elif "chemical engineering" in name_lower:
            return "Chemical Engineering"
        elif "industrial engineering" in name_lower:
            return "Industrial Engineering & Operations"
        elif "agricultural engineering" in name_lower:
            return "Agricultural Engineering"
        
        # Software/IT Disciplines
        elif "software engineering" in name_lower:
            return "Software Engineering Foundations"
        elif "data science" in name_lower or "data analytics" in name_lower:
            return "Data Science & Analytics"
        elif "computer science" in name_lower or "computing" in name_lower:
            return "Computer Science Core"
        elif "information technology" in name_lower:
            return "IT Systems & Infrastructure"
        elif "web development" in name_lower:
            return "Web Development"
        
        # Healthcare/Medicine
        elif "nursing" in name_lower or "nurse" in name_lower:
            return "Nursing & Patient Care"
        elif "pharmacy" in name_lower or "pharmacist" in name_lower:
            return "Pharmacy & Pharmaceutical Sciences"
        elif "medical tech" in name_lower or "laboratory" in name_lower:
            return "Medical Technology & Diagnostics"
        elif "healthcare" in name_lower or "health admin" in name_lower:
            return "Healthcare Administration"
        elif "physiotherapy" in name_lower:
            return "Physiotherapy & Rehabilitation"
        
        # Education/Teaching
        elif "education" in name_lower or "teaching" in name_lower:
            return "Education & Teaching"
        elif "curriculum" in name_lower:
            return "Curriculum & Instructional Design"
        
        # Arts & Design
        elif "graphic design" in name_lower:
            return "Graphic Design & Visual Communication"
        elif "interior design" in name_lower:
            return "Interior Design & Space Planning"
        elif "animation" in name_lower:
            return "Animation & Motion Graphics"
        elif "ui" in name_lower or "ux" in name_lower or "user experience" in name_lower:
            return "UI/UX Design"
        elif "arts" in name_lower or "fine arts" in name_lower:
            return "Visual Arts & Creative Design"
        
        # Business & Management
        elif "business admin" in name_lower or "management" in name_lower:
            return "Business Administration & Management"
        elif "finance" in name_lower or "accounting" in name_lower:
            return "Finance & Accounting"
        elif "marketing" in name_lower:
            return "Marketing & Brand Management"
        elif "human resource" in name_lower or "hr" in name_lower:
            return "Human Resources Management"
        elif "entrepreneur" in name_lower:
            return "Entrepreneurship & Business Development"
        
        # Agriculture/Environment
        elif "agriculture" in name_lower or "farming" in name_lower:
            return "Agriculture & Crop Sciences"
        elif "environmental" in name_lower:
            return "Environmental Science & Sustainability"
        
        # Infer from skills
        elif any("Structural" in skill or "Construction" in skill for skill in skills):
            return "Civil Engineering & Infrastructure"
        elif any("Machine Design" in skill or "Thermodynamics" in skill for skill in skills):
            return "Mechanical Engineering & Design"
        elif any("Circuit" in skill or "Power Systems" in skill for skill in skills):
            return "Electrical & Electronics Engineering"
        elif any("Patient Care" in skill or "Pharmacology" in skill for skill in skills):
            return "Healthcare & Medical Sciences"
        elif any("Teaching" in skill or "Curriculum" in skill for skill in skills):
            return "Education & Teaching"
        elif any("Design" in skill and "UI" not in skill for skill in skills):
            return "Creative Design & Arts"
        elif any("Marketing" in skill or "Financial" in skill for skill in skills):
            return "Business & Management"
        elif "Machine Learning" in skills:
            return "AI & Machine Learning"
        elif "Database Management" in skills and "Data Science" in skills:
            return "Data Engineering"
        else:
            return "Professional Skills Development"
    
    def _determine_level(self, course_name: str) -> str:
        """Determine academic level"""
        name_lower = course_name.lower()
        
        if "bachelor" in name_lower or "undergraduate" in name_lower or "bsc" in name_lower:
            return "Undergraduate"
        elif "master" in name_lower or "graduate" in name_lower or "msc" in name_lower:
            return "Graduate"
        elif "diploma" in name_lower:
            return "Diploma"
        elif "certificate" in name_lower:
            return "Certificate"
        else:
            return "Undergraduate"  # Default
    
    def _parse_duration(self, duration_str: str) -> float:
        """Parse duration string to years"""
        try:
            # Match patterns like "3 years", "4 Years", "3-4 years"
            match = re.search(r"(\d+)(?:\s*-\s*\d+)?\s*years?", duration_str, re.IGNORECASE)
            if match:
                return float(match.group(1))
            
            # Match patterns like "6 months"
            match = re.search(r"(\d+)\s*months?", duration_str, re.IGNORECASE)
            if match:
                return float(match.group(1)) / 12
            
            return 3.0  # Default to 3 years
        except:
            return 3.0
