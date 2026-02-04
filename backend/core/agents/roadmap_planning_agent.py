"""
Roadmap Planning Agent
Creates structured 6-stage roadmap with LLM-generated content
"""
import json
from typing import List, Dict
from api.schemas.roadmap import (
    RoadmapStep, Resource, CurriculumAnalysis, 
    CareerRequirements, SkillGapAnalysis, CareerGoal
)


class RoadmapPlanningAgent:
    """Plans and generates 6-stage roadmap using LLM"""
    
    def __init__(self, llm_client=None):
        """
        Initialize with LLM client
        
        Args:
            llm_client: LLM client instance (OpenAI, Anthropic, etc.)
        """
        self.llm = llm_client
        
        # Define 6-stage structure (fixed stages)
        self.stage_templates = [
            {
                "id": 1,
                "title": "Foundation Stage",
                "icon": "BookOpen",
                "focus": "fundamental_skills"
            },
            {
                "id": 2,
                "title": "Skill Development",
                "icon": "Code",
                "focus": "core_technical_skills"
            },
            {
                "id": 3,
                "title": "Real-world Readiness",
                "icon": "Briefcase",
                "focus": "practical_application"
            },
            {
                "id": 4,
                "title": "Performance Strategies",
                "icon": "Target",
                "focus": "optimization_and_best_practices"
            },
            {
                "id": 5,
                "title": "Knowledge Expansion",
                "icon": "GraduationCap",
                "focus": "advanced_topics"
            },
            {
                "id": 6,
                "title": "Industry Polishing",
                "icon": "Award",
                "focus": "job_readiness"
            }
        ]
    
    async def plan(
        self,
        user_profile: Dict,
        career_goal: CareerGoal,
        curriculum: CurriculumAnalysis,
        career_requirements: CareerRequirements,
        gap_analysis: SkillGapAnalysis
    ) -> List[RoadmapStep]:
        """
        Generate complete 6-stage roadmap
        
        Args:
            user_profile: User profile data
            career_goal: Target career path
            curriculum: Curriculum analysis
            career_requirements: Industry requirements
            gap_analysis: Skill gap analysis
            
        Returns:
            List of 6 RoadmapStep objects
        """
        # Build context for LLM
        context = self._build_context(
            user_profile, career_goal, curriculum, 
            career_requirements, gap_analysis
        )
        
        # Generate roadmap using LLM
        if self.llm:
            roadmap_steps = await self._generate_with_llm(context)
        else:
            # Fallback: Generate deterministic roadmap
            roadmap_steps = self._generate_fallback(context)
        
        return roadmap_steps
    
    def _build_context(
        self,
        user_profile: Dict,
        career_goal: CareerGoal,
        curriculum: CurriculumAnalysis,
        career_requirements: CareerRequirements,
        gap_analysis: SkillGapAnalysis
    ) -> Dict:
        """Build context object for roadmap generation"""
        return {
            "career_goal": career_goal.value,
            "study_duration": f"{curriculum.duration_years} years",
            "course_focus": curriculum.focus_area,
            "course_skills": curriculum.core_skills,
            "languages": curriculum.languages,
            "required_skills": career_requirements.required_skills,
            "missing_skills": gap_analysis.missing_skills,
            "priority_gaps": gap_analysis.priority_gaps,
            "well_covered": gap_analysis.well_covered,
            "role_description": career_requirements.role_description,
            "typical_journey": career_requirements.typical_journey,
            # Add user preferences from profile
            "user_interests": user_profile.get("interestArea", ""),
            "study_method": user_profile.get("studyMethod", ""),
            "availability": user_profile.get("availability", ""),
            "completion_period": user_profile.get("completionPeriod", "")
        }
    
    async def _generate_with_llm(self, context: Dict) -> List[RoadmapStep]:
        """Generate roadmap using LLM"""
        prompt = self._build_llm_prompt(context)
        
        try:
            # Call LLM (supports various clients)
            response = await self.llm.generate(
                prompt=prompt,
                temperature=0.7,
                max_tokens=3000
            )
            
            # Parse JSON response
            roadmap_data = json.loads(response)
            
            # Convert to RoadmapStep objects
            roadmap_steps = []
            for step_data in roadmap_data.get("roadmap", []):
                # Ensure resources have proper structure
                resources = []
                for res in step_data.get("resources", []):
                    if isinstance(res, dict):
                        resources.append(Resource(**res))
                    elif isinstance(res, str):
                        resources.append(Resource(title=res, url="#"))
                
                roadmap_steps.append(RoadmapStep(
                    id=step_data["id"],
                    title=step_data["title"],
                    goal=step_data["goal"],
                    icon=step_data.get("icon", self.stage_templates[step_data["id"]-1]["icon"]),
                    duration=step_data["duration"],
                    description=step_data["description"],
                    actionPlan=step_data["actionPlan"],
                    resources=resources,
                    successCriteria=step_data["successCriteria"]
                ))
            
            return roadmap_steps
        
        except Exception as e:
            print(f"LLM generation failed: {e}. Using fallback.")
            return self._generate_fallback(context)
    
    def _build_llm_prompt(self, context: Dict) -> str:
        """Build comprehensive prompt for LLM"""
        return f"""You are a career roadmap generator AI. Generate a personalized learning roadmap.

**User Context:**
- Career Goal: {context['career_goal']}
- Study Duration: {context['study_duration']}
- Course Focus: {context['course_focus']}
- Programming Languages: {', '.join(context['languages'])}

**Course Provides:**
{chr(10).join(f"- {skill}" for skill in context['course_skills'])}

**Industry Requires:**
{chr(10).join(f"- {skill}" for skill in context['required_skills'])}

**Critical Skill Gaps:**
{chr(10).join(f"- {skill}" for skill in context['priority_gaps'])}

**Well Covered:**
{chr(10).join(f"- {skill}" for skill in context['well_covered'])}

**Role Description:** {context['role_description']}

**Task:** Generate a JSON object with a 6-stage roadmap in this EXACT format:

{{
  "roadmap": [
    {{
      "id": 1,
      "title": "Foundation Stage",
      "goal": "Short goal statement",
      "icon": "BookOpen",
      "duration": "6-8 Weeks",
      "description": "Detailed description of this stage",
      "actionPlan": [
        "Specific action 1",
        "Specific action 2",
        "Specific action 3"
      ],
      "resources": [
        {{"title": "Resource Name", "url": "https://example.com"}},
        {{"title": "Resource Name 2", "url": "https://example.com"}}
      ],
      "successCriteria": [
        "Measurable criterion 1",
        "Measurable criterion 2"
      ]
    }}
  ]
}}

**Requirements:**
1. Generate exactly 6 stages with IDs 1-6
2. Stage titles: "Foundation Stage", "Skill Development", "Real-world Readiness", "Performance Strategies", "Knowledge Expansion", "Industry Polishing"
3. Icons: BookOpen, Code, Briefcase, Target, GraduationCap, Award
4. Each stage: 3-5 action items, 3-5 resources with real URLs, 2-4 success criteria
5. Focus on addressing the skill gaps while building on well-covered areas
6. Align actions to {context['career_goal']} role requirements
7. Make resources practical (MDN, LeetCode, official docs, courses)
8. Keep durations realistic (weeks for early stages, months for later ones)
9. Output ONLY valid JSON, no markdown, no explanations

Generate the roadmap now:"""
    
    def _generate_fallback(self, context: Dict) -> List[RoadmapStep]:
        """Generate deterministic fallback roadmap based on career goal"""
        career_goal = context['career_goal']
        priority_gaps = context['priority_gaps']
        languages = context['languages']
        
        # Get career-specific content
        career_content = self._get_career_specific_content(career_goal, priority_gaps, languages)
        
        roadmap_steps = []
        
        # Stage 1: Foundation
        stage1 = RoadmapStep(
            id=1,
            title="Foundation Stage",
            goal=career_content['stage1']['goal'],
            icon="BookOpen",
            duration="6-8 Weeks",
            description=career_content['stage1']['description'],
            actionPlan=career_content['stage1']['actionPlan'],
            resources=career_content['stage1']['resources'],
            successCriteria=career_content['stage1']['successCriteria']
        )
        roadmap_steps.append(stage1)
        
        # Stage 2: Skill Development
        stage2 = RoadmapStep(
            id=2,
            title="Skill Development",
            goal=career_content['stage2']['goal'],
            icon="Code",
            duration="8-12 Weeks",
            description=career_content['stage2']['description'],
            actionPlan=career_content['stage2']['actionPlan'],
            resources=career_content['stage2']['resources'],
            successCriteria=career_content['stage2']['successCriteria']
        )
        roadmap_steps.append(stage2)
        
        # Stage 3: Real-world Readiness
        stage3 = RoadmapStep(
            id=3,
            title="Real-world Readiness",
            goal=career_content['stage3']['goal'],
            icon="Briefcase",
            duration="10-14 Weeks",
            description=career_content['stage3']['description'],
            actionPlan=career_content['stage3']['actionPlan'],
            resources=career_content['stage3']['resources'],
            successCriteria=career_content['stage3']['successCriteria']
        )
        roadmap_steps.append(stage3)
        
        # Stage 4: Performance Strategies
        stage4 = RoadmapStep(
            id=4,
            title="Performance Strategies",
            goal=career_content['stage4']['goal'],
            icon="Target",
            duration="6-10 Weeks",
            description=career_content['stage4']['description'],
            actionPlan=career_content['stage4']['actionPlan'],
            resources=career_content['stage4']['resources'],
            successCriteria=career_content['stage4']['successCriteria']
        )
        roadmap_steps.append(stage4)
        
        # Stage 5: Knowledge Expansion
        stage5 = RoadmapStep(
            id=5,
            title="Knowledge Expansion",
            goal=career_content['stage5']['goal'],
            icon="GraduationCap",
            duration="8-12 Weeks",
            description=career_content['stage5']['description'],
            actionPlan=career_content['stage5']['actionPlan'],
            resources=career_content['stage5']['resources'],
            successCriteria=career_content['stage5']['successCriteria']
        )
        roadmap_steps.append(stage5)
        
        # Stage 6: Industry Polishing
        stage6 = RoadmapStep(
            id=6,
            title="Industry Polishing",
            goal=career_content['stage6']['goal'],
            icon="Award",
            duration="4-8 Weeks",
            description=career_content['stage6']['description'],
            actionPlan=career_content['stage6']['actionPlan'],
            resources=career_content['stage6']['resources'],
            successCriteria=career_content['stage6']['successCriteria']
        )
        roadmap_steps.append(stage6)
        
        return roadmap_steps
    
    def _get_career_specific_content(self, career_goal: str, priority_gaps: List[str], languages: List[str]) -> Dict:
        """Get career-specific roadmap content"""
        
        # Civil Engineering Content
        if "Civil Engineer" in career_goal:
            return {
                'stage1': {
                    'goal': "Build Strong Engineering Fundamentals",
                    'description': "Master core civil engineering concepts and essential tools for structural design and analysis.",
                    'actionPlan': [
                        "Master AutoCAD basics for engineering drawings",
                        "Study structural analysis fundamentals",
                        "Learn construction materials and their properties",
                        "Practice surveying and site measurement techniques"
                    ],
                    'resources': [
                        Resource(title="AutoCAD Civil 3D Tutorial", url="https://www.autodesk.com/products/civil-3d/learn-training-tutorials"),
                        Resource(title="MIT OpenCourseWare - Structural Engineering", url="https://ocw.mit.edu/courses/civil-and-environmental-engineering/"),
                        Resource(title="Civil Engineering Academy", url="https://www.youtube.com/c/CivilEngineeringAcademy")
                    ],
                    'successCriteria': [
                        "Create basic AutoCAD drawings",
                        "Understand load calculations and beam design",
                        "Complete surveying field exercises"
                    ]
                },
                'stage2': {
                    'goal': "Develop Core Technical Skills",
                    'description': f"Focus on skills critical for Civil Engineer roles, addressing identified gaps: {', '.join(priority_gaps[:2])}.",
                    'actionPlan': [
                        "Deep dive into structural design principles",
                        "Learn building codes and safety standards",
                        "Master Civil 3D and site planning tools",
                        "Study geotechnical engineering basics"
                    ],
                    'resources': [
                        Resource(title="ASCE Standards & Codes", url="https://www.asce.org/publications-and-news/civil-engineering-source/standards"),
                        Resource(title="Structural Engineering Basics", url="https://www.coursera.org/courses?query=structural%20engineering"),
                        Resource(title="Geotechnical Software Training", url="https://www.rocscience.com/learning")
                    ],
                    'successCriteria': [
                        "Design a small residential structure",
                        "Apply building codes correctly",
                        "Complete 2-3 CAD design projects"
                    ]
                },
                'stage3': {
                    'goal': "Apply Skills to Real-World Projects",
                    'description': "Gain practical experience through site visits, internships, and real construction projects.",
                    'actionPlan': [
                        "Participate in construction site visits",
                        "Work on capstone infrastructure project",
                        "Apply for civil engineering internships",
                        "Learn project management and cost estimation"
                    ],
                    'resources': [
                        Resource(title="ASCE Student Resources", url="https://www.asce.org/communities/student-and-younger-members"),
                        Resource(title="Construction Management Courses", url="https://www.linkedin.com/learning/topics/construction-management"),
                        Resource(title="Engineering Internship Platforms", url="https://www.engineeringinternships.com")
                    ],
                    'successCriteria': [
                        "Complete internship or co-op program",
                        "Manage a small project from design to execution",
                        "Develop cost estimation skills"
                    ]
                },
                'stage4': {
                    'goal': "Master Advanced Design and Analysis",
                    'description': "Learn optimization techniques, structural analysis software, and sustainable design practices.",
                    'actionPlan': [
                        "Master structural analysis software (SAP2000, ETABS)",
                        "Study earthquake and wind engineering",
                        "Learn sustainable and green building practices",
                        "Practice advanced foundation design"
                    ],
                    'resources': [
                        Resource(title="SAP2000 Training", url="https://www.csiamerica.com/products/sap2000/training"),
                        Resource(title="LEED Green Associate Prep", url="https://www.usgbc.org/credentials/leed-green-associate"),
                        Resource(title="Structural Analysis Courses", url="https://www.edx.org/learn/structural-engineering")
                    ],
                    'successCriteria': [
                        "Complete 3+ structural analysis projects",
                        "Understand seismic design principles",
                        "Pass LEED Green Associate exam (optional)"
                    ]
                },
                'stage5': {
                    'goal': "Explore Specialized Areas",
                    'description': "Dive deeper into specialized civil engineering domains like transportation, hydraulics, or construction management.",
                    'actionPlan': [
                        "Choose specialization (structural, transportation, water resources)",
                        "Attend civil engineering conferences and workshops",
                        "Study advanced topics in chosen specialization",
                        "Stay updated with industry innovations and BIM"
                    ],
                    'resources': [
                        Resource(title="Transportation Engineering", url="https://www.coursera.org/courses?query=transportation%20engineering"),
                        Resource(title="Water Resources Engineering", url="https://www.edx.org/learn/water-resources"),
                        Resource(title="BIM for Civil Engineers", url="https://www.autodesk.com/bim")
                    ],
                    'successCriteria': [
                        "Complete 2+ advanced courses in specialization",
                        "Attend 3+ industry events or webinars",
                        "Develop expertise in chosen area"
                    ]
                },
                'stage6': {
                    'goal': "Prepare for Professional Licensure and Career",
                    'description': "Final preparation for PE exam, job market, and professional engineering career.",
                    'actionPlan': [
                        "Prepare for FE (Fundamentals of Engineering) exam",
                        "Build professional engineering portfolio",
                        "Gain EIT (Engineer-in-Training) certification",
                        "Apply to civil engineering firms",
                        "Prepare for PE (Professional Engineer) licensure path"
                    ],
                    'resources': [
                        Resource(title="NCEES FE Exam Prep", url="https://ncees.org/engineering/fe/"),
                        Resource(title="Engineering Portfolio Guide", url="https://www.asce.org/career-growth/career-resources"),
                        Resource(title="PE Exam Resources", url="https://ppi2pass.com/")
                    ],
                    'successCriteria': [
                        "Pass FE exam and obtain EIT certification",
                        "Professional portfolio with 3-5 major projects",
                        "Complete 10+ job interviews",
                        "Receive engineering job offer(s)"
                    ]
                }
            }
        
        # Software Engineering Content (existing)
        elif "Software Engineer" in career_goal or "Full Stack" in career_goal:
            lang = languages[0] if languages else 'Python'
            return {
                'stage1': {
                    'goal': "Build Strong Programming Fundamentals",
                    'description': "Master core programming concepts and problem-solving skills essential for your journey.",
                    'actionPlan': [
                        f"Master {lang} programming basics",
                        "Practice coding challenges daily (30-60 min)",
                        "Learn Git version control fundamentals",
                        "Set up development environment and tools"
                    ],
                    'resources': [
                        Resource(title=f"{lang} Official Tutorial", url=f"https://docs.python.org/3/tutorial/" if lang == "Python" else "https://developer.mozilla.org/"),
                        Resource(title="Git Handbook", url="https://guides.github.com/introduction/git-handbook/"),
                        Resource(title="LeetCode Easy Problems", url="https://leetcode.com/problemset/all/?difficulty=Easy")
                    ],
                    'successCriteria': [
                        "Complete 20+ coding problems",
                        "Build 1-2 small projects",
                        "Comfortable with Git basics"
                    ]
                },
                'stage2': {
                    'goal': "Develop Core Technical Skills",
                    'description': f"Focus on skills critical for {career_goal} roles, addressing identified gaps.",
                    'actionPlan': [
                        f"Deep dive into {priority_gaps[0] if priority_gaps else 'Data Structures & Algorithms'}",
                        "Build 2-3 intermediate projects",
                        "Learn industry best practices and design patterns",
                        "Start contributing to open source"
                    ],
                    'resources': [
                        Resource(title="NeetCode Roadmap", url="https://neetcode.io/roadmap"),
                        Resource(title="System Design Primer", url="https://github.com/donnemartin/system-design-primer"),
                        Resource(title="Real Python", url="https://realpython.com")
                    ],
                    'successCriteria': [
                        "Complete 50+ DSA problems",
                        "Build 2 portfolio-worthy projects",
                        "Make 5+ open source contributions"
                    ]
                },
                'stage3': {
                    'goal': "Apply Skills to Real-World Scenarios",
                    'description': "Gain practical experience through projects, internships, and real-world problem solving.",
                    'actionPlan': [
                        "Build a full-scale capstone project",
                        "Apply for internships and entry-level positions",
                        "Practice technical interview skills",
                        "Network with professionals in your field"
                    ],
                    'resources': [
                        Resource(title="Pramp - Mock Interviews", url="https://www.pramp.com"),
                        Resource(title="LinkedIn Learning", url="https://www.linkedin.com/learning/"),
                        Resource(title="Internship Platforms", url="https://www.internships.com")
                    ],
                    'successCriteria': [
                        "Complete 1 major project",
                        "Pass 5+ mock interviews",
                        "Land internship or contract work"
                    ]
                },
                'stage4': {
                    'goal': "Optimize Performance and Efficiency",
                    'description': "Learn optimization techniques, performance tuning, and efficient problem-solving strategies.",
                    'actionPlan': [
                        "Study algorithm complexity and optimization",
                        "Learn profiling and debugging techniques",
                        "Practice system design interviews",
                        "Optimize your existing projects"
                    ],
                    'resources': [
                        Resource(title="Big O Cheat Sheet", url="https://www.bigocheatsheet.com"),
                        Resource(title="LeetCode Medium/Hard", url="https://leetcode.com/problemset/all/?difficulty=Medium"),
                        Resource(title="System Design Interview", url="https://www.educative.io/courses/grokking-the-system-design-interview")
                    ],
                    'successCriteria': [
                        "Solve 30+ medium/hard problems",
                        "Complete system design practice",
                        "Improve project performance metrics"
                    ]
                },
                'stage5': {
                    'goal': "Explore Advanced Topics and Specializations",
                    'description': "Dive deeper into specialized areas relevant to your career goals.",
                    'actionPlan': [
                        f"Study advanced topics in {career_goal} domain",
                        "Attend webinars, conferences, and workshops",
                        "Build expertise in a niche area",
                        "Stay updated with industry trends"
                    ],
                    'resources': [
                        Resource(title="Coursera Specializations", url="https://www.coursera.org"),
                        Resource(title="Tech Blogs & Publications", url="https://dev.to"),
                        Resource(title="Conference Talks", url="https://www.youtube.com/c/GOTO-")
                    ],
                    'successCriteria': [
                        "Complete 2+ advanced courses",
                        "Attend 3+ industry events",
                        "Develop specialized expertise"
                    ]
                },
                'stage6': {
                    'goal': "Prepare for Job Market and Career Launch",
                    'description': "Final preparation for entering the job market as a professional.",
                    'actionPlan': [
                        "Polish resume and online profiles",
                        "Prepare for behavioral interviews",
                        "Build strong portfolio website",
                        "Apply strategically to target companies",
                        "Practice salary negotiation"
                    ],
                    'resources': [
                        Resource(title="Resume Templates", url="https://www.resumegenius.com"),
                        Resource(title="Interview Preparation", url="https://www.interviewcake.com"),
                        Resource(title="Salary Negotiation Guide", url="https://www.levels.fyi")
                    ],
                    'successCriteria': [
                        "Professional portfolio completed",
                        "Resume reviewed by 3+ professionals",
                        "Complete 10+ real interviews",
                        "Receive job offer(s)"
                    ]
                }
            }
        
        # Nursing Content
        elif "Nurse" in career_goal or "Nursing" in career_goal:
            return {
                'stage1': {
                    'goal': "Master Nursing Fundamentals",
                    'description': "Build strong foundation in anatomy, patient care basics, and clinical terminology.",
                    'actionPlan': [
                        "Study anatomy & physiology thoroughly",
                        "Learn medical terminology and abbreviations",
                        "Practice basic patient care skills in lab",
                        "Master vital signs monitoring techniques"
                    ],
                    'resources': [
                        Resource(title="RegisteredNursing.org", url="https://www.registerednursing.org/"),
                        Resource(title="Khan Academy Anatomy", url="https://www.khanacademy.org/science/health-and-medicine"),
                        Resource(title="Nurse.org Study Guides", url="https://nurse.org/")
                    ],
                    'successCriteria': [
                        "Master A&P with 85%+ exam scores",
                        "Demonstrate proper vital signs technique",
                        "Complete basic patient care skills checklist"
                    ]
                },
                'stage2': {
                    'goal': "Develop Clinical Skills",
                    'description': "Progress to medication administration, IV therapy, and patient assessment techniques.",
                    'actionPlan': [
                        "Study pharmacology and drug classifications",
                        "Practice medication administration (5 rights)",
                        "Learn sterile technique and infection control",
                        "Develop patient assessment skills (head-to-toe)"
                    ],
                    'resources': [
                        Resource(title="Davis's Drug Guide", url="https://www.fadavis.com/"),
                        Resource(title="Nursing Central", url="https://www.unboundmedicine.com/nursing"),
                        Resource(title="CDC Infection Control", url="https://www.cdc.gov/infection-control/")
                    ],
                    'successCriteria': [
                        "Pass medication math calculations 100%",
                        "Demonstrate safe IV insertion",
                        "Complete patient assessment accurately"
                    ]
                },
                'stage3': {
                    'goal': "Excel in Clinical Rotations",
                    'description': "Apply nursing skills in real hospital settings across multiple specialties.",
                    'actionPlan': [
                        "Complete med-surg clinical rotation",
                        "Practice in pediatric and maternal health units",
                        "Develop time management and prioritization",
                        "Learn EHR documentation standards"
                    ],
                    'resources': [
                        Resource(title="NCSBN Resources", url="https://www.ncsbn.org/"),
                        Resource(title="HealthStream Courses", url="https://www.healthstream.com/"),
                        Resource(title="Clinical Nursing Skills Videos", url="https://www.youtube.com/@RegisteredNurseRN")
                    ],
                    'successCriteria': [
                        "Successfully complete 400+ clinical hours",
                        "Positive evaluations from preceptors",
                        "Demonstrate safe patient care independently"
                    ]
                },
                'stage4': {
                    'goal': "Prepare for NCLEX-RN",
                    'description': "Intensive preparation for nursing licensure examination.",
                    'actionPlan': [
                        "Complete NCLEX review course",
                        "Practice 3000+ NCLEX-style questions",
                        "Master nursing process (ADPIE)",
                        "Study prioritization and delegation"
                    ],
                    'resources': [
                        Resource(title="UWorld NCLEX", url="https://www.uworld.com/nclex/nclex_rn/"),
                        Resource(title="NCSBN Learning Extension", url="https://www.ncsbn.org/learning-extension.htm"),
                        Resource(title="Mark Klimek Lectures", url="https://www.markklimaudioproducts.com/")
                    ],
                    'successCriteria': [
                        "Score 65%+ on NCLEX practice tests",
                        "Complete comprehensive review",
                        "Pass NCLEX-RN on first attempt"
                    ]
                },
                'stage5': {
                    'goal': "Launch Nursing Career",
                    'description': "Secure first nursing position and begin professional practice.",
                    'actionPlan': [
                        "Apply to new graduate residency programs",
                        "Complete BLS and ACLS certifications",
                        "Prepare nursing interview responses",
                        "Choose specialty area of interest"
                    ],
                    'resources': [
                        Resource(title="Indeed Nursing Jobs", url="https://www.indeed.com/jobs?q=registered+nurse"),
                        Resource(title="American Heart Association", url="https://cpr.heart.org/"),
                        Resource(title="Nurse.org Career Center", url="https://nurse.org/jobs/")
                    ],
                    'successCriteria': [
                        "Obtain RN license",
                        "Complete BLS/ACLS certifications",
                        "Secure nursing position"
                    ]
                },
                'stage6': {
                    'goal': "Pursue Specialty Certification",
                    'description': "Develop expertise in chosen nursing specialty and advance career.",
                    'actionPlan': [
                        "Gain 1-2 years experience in specialty",
                        "Pursue specialty certification (CCRN, CEN, etc.)",
                        "Consider BSN to MSN program",
                        "Join professional nursing organizations"
                    ],
                    'resources': [
                        Resource(title="ANCC Certification", url="https://www.nursingworld.org/ancc/"),
                        Resource(title="American Nurses Association", url="https://www.nursingworld.org/"),
                        Resource(title="Specialty Nursing Orgs", url="https://www.aacnnursing.org/")
                    ],
                    'successCriteria': [
                        "Complete 2000+ hours in specialty",
                        "Earn specialty certification",
                        "Develop leadership competencies"
                    ]
                }
            }
        
        # Teaching Content
        elif "Teacher" in career_goal or "Education" in career_goal or "Lecturer" in career_goal:
            return {
                'stage1': {
                    'goal': "Master Teaching Foundations",
                    'description': "Build strong foundation in pedagogy, educational psychology, and learning theories.",
                    'actionPlan': [
                        "Study major learning theories (Piaget, Vygotsky)",
                        "Learn classroom management techniques",
                        "Understand child/adolescent development",
                        "Explore diverse teaching methodologies"
                    ],
                    'resources': [
                        Resource(title="TeachThought", url="https://www.teachthought.com/"),
                        Resource(title="Edutopia", url="https://www.edutopia.org/"),
                        Resource(title="ASCD Resources", url="https://www.ascd.org/")
                    ],
                    'successCriteria': [
                        "Demonstrate understanding of learning theories",
                        "Create comprehensive lesson plan",
                        "Pass foundational education courses"
                    ]
                },
                'stage2': {
                    'goal': "Develop Curriculum Skills",
                    'description': "Learn curriculum development, assessment design, and differentiated instruction.",
                    'actionPlan': [
                        "Study curriculum frameworks and standards",
                        "Design lessons with clear learning objectives",
                        "Create diverse assessment tools",
                        "Learn differentiation strategies"
                    ],
                    'resources': [
                        Resource(title="Understanding by Design", url="https://www.ascd.org/books/understanding-by-design-expanded-2nd-edition"),
                        Resource(title="Common Core Standards", url="http://www.corestandards.org/"),
                        Resource(title="Teachers Pay Teachers", url="https://www.teacherspayteachers.com/")
                    ],
                    'successCriteria': [
                        "Create 10+ standards-aligned lesson plans",
                        "Design authentic assessments",
                        "Demonstrate differentiation techniques"
                    ]
                },
                'stage3': {
                    'goal': "Practice Teaching Skills",
                    'description': "Gain hands-on experience through field observations and practice teaching.",
                    'actionPlan': [
                        "Complete classroom observation hours",
                        "Practice teaching in microteaching labs",
                        "Receive feedback from experienced educators",
                        "Develop classroom management plan"
                    ],
                    'resources': [
                        Resource(title="IRIS Center Modules", url="https://iris.peabody.vanderbilt.edu/"),
                        Resource(title="Classroom Management Courses", url="https://www.coursera.org/courses?query=classroom%20management"),
                        Resource(title="YouTube Teaching Channels", url="https://www.youtube.com/@TheCornerstoneForTeachers")
                    ],
                    'successCriteria': [
                        "Complete 50+ observation hours",
                        "Teach 5+ practice lessons successfully",
                        "Demonstrate effective management"
                    ]
                },
                'stage4': {
                    'goal': "Complete Student Teaching",
                    'description': "Full-time supervised teaching experience in real classroom setting.",
                    'actionPlan': [
                        "Complete student teaching placement (12-16 weeks)",
                        "Gradually assume full teaching responsibilities",
                        "Implement varied instructional strategies",
                        "Build relationships with students and families"
                    ],
                    'resources': [
                        Resource(title="Student Teaching Handbook", url="https://www.edutopia.org/blog/student-teaching-survival-guide"),
                        Resource(title="NEA Resources", url="https://www.nea.org/"),
                        Resource(title="Teaching Channel", url="https://www.teachingchannel.com/")
                    ],
                    'successCriteria': [
                        "Successfully complete student teaching",
                        "Receive positive evaluations",
                        "Develop teaching portfolio"
                    ]
                },
                'stage5': {
                    'goal': "Obtain Teaching Certification",
                    'description': "Pass certification exams and obtain teaching license.",
                    'actionPlan': [
                        "Prepare for state teaching certification exams",
                        "Study subject-specific content knowledge",
                        "Complete fingerprinting and background check",
                        "Apply for teaching license"
                    ],
                    'resources': [
                        Resource(title="Praxis Test Prep", url="https://www.ets.org/praxis.html"),
                        Resource(title="State Teaching Requirements", url="https://teach.com/become/teaching-credential/"),
                        Resource(title="240 Tutoring Praxis Prep", url="https://www.240tutoring.com/")
                    ],
                    'successCriteria': [
                        "Pass all required certification exams",
                        "Obtain teaching license",
                        "Complete all credential requirements"
                    ]
                },
                'stage6': {
                    'goal': "Launch Teaching Career",
                    'description': "Secure teaching position and begin professional development journey.",
                    'actionPlan': [
                        "Apply to school districts and positions",
                        "Prepare teaching portfolio and demo lessons",
                        "Join professional teaching associations",
                        "Plan for continuous professional development"
                    ],
                    'resources': [
                        Resource(title="Indeed Teaching Jobs", url="https://www.indeed.com/jobs?q=teacher"),
                        Resource(title="National Board Certification", url="https://www.nbpts.org/"),
                        Resource(title="EdWeek", url="https://www.edweek.org/")
                    ],
                    'successCriteria': [
                        "Secure teaching position",
                        "Create engaging classroom environment",
                        "Plan for continuous improvement"
                    ]
                }
            }
        
        # Graphic Design Content
        elif "Graphic Design" in career_goal or "Visual" in career_goal or "Designer" in career_goal:
            return {
                'stage1': {
                    'goal': "Master Design Fundamentals",
                    'description': "Build foundation in design principles, color theory, and typography.",
                    'actionPlan': [
                        "Study design principles (balance, contrast, hierarchy)",
                        "Learn color theory and psychology",
                        "Master typography fundamentals",
                        "Practice with pencil sketching and ideation"
                    ],
                    'resources': [
                        Resource(title="Canva Design School", url="https://www.canva.com/designschool/"),
                        Resource(title="Smashing Magazine", url="https://www.smashingmagazine.com/"),
                        Resource(title="Design Principles YouTube", url="https://www.youtube.com/@TheFutur")
                    ],
                    'successCriteria': [
                        "Complete design principles course",
                        "Create 10+ design studies",
                        "Understand color harmonies"
                    ]
                },
                'stage2': {
                    'goal': "Learn Adobe Creative Suite",
                    'description': "Master industry-standard design software and digital tools.",
                    'actionPlan': [
                        "Master Adobe Photoshop for image editing",
                        "Learn Adobe Illustrator for vector graphics",
                        "Study Adobe InDesign for layouts",
                        "Practice keyboard shortcuts and workflows"
                    ],
                    'resources': [
                        Resource(title="Adobe Creative Cloud Tutorials", url="https://helpx.adobe.com/creative-cloud/tutorials-explore.html"),
                        Resource(title="LinkedIn Learning Adobe", url="https://www.linkedin.com/learning/topics/adobe"),
                        Resource(title="Bring Your Own Laptop", url="https://www.youtube.com/@BringYourOwnLaptop")
                    ],
                    'successCriteria': [
                        "Complete 20+ software tutorials",
                        "Create designs using each tool",
                        "Develop efficient workflow"
                    ]
                },
                'stage3': {
                    'goal': "Build Diverse Portfolio",
                    'description': "Create variety of design projects showcasing different skills and styles.",
                    'actionPlan': [
                        "Design logo and brand identity system",
                        "Create poster and print materials",
                        "Design social media graphics",
                        "Complete client-style projects"
                    ],
                    'resources': [
                        Resource(title="Behance", url="https://www.behance.net/"),
                        Resource(title="Dribbble", url="https://dribbble.com/"),
                        Resource(title="Daily UI Challenge", url="https://www.dailyui.co/")
                    ],
                    'successCriteria': [
                        "Create 15-20 portfolio pieces",
                        "Complete Daily UI challenges",
                        "Receive design feedback"
                    ]
                },
                'stage4': {
                    'goal': "Develop Professional Skills",
                    'description': "Learn client communication, design process, and business skills.",
                    'actionPlan': [
                        "Study design brief interpretation",
                        "Learn client presentation techniques",
                        "Practice design revisions and feedback",
                        "Understand print production basics"
                    ],
                    'resources': [
                        Resource(title="The Futur - Business of Design", url="https://www.youtube.com/@thefutur"),
                        Resource(title="AIGA Design Business", url="https://www.aiga.org/"),
                        Resource(title="Creative Bloq", url="https://www.creativebloq.com/")
                    ],
                    'successCriteria': [
                        "Complete 3+ client-simulated projects",
                        "Create professional presentations",
                        "Understand printing specifications"
                    ]
                },
                'stage5': {
                    'goal': "Specialize and Network",
                    'description': "Choose design specialization and build professional network.",
                    'actionPlan': [
                        "Choose specialization (branding, UI, packaging)",
                        "Attend design meetups and conferences",
                        "Take on freelance design projects",
                        "Stay updated with design trends"
                    ],
                    'resources': [
                        Resource(title="99designs Blog", url="https://99designs.com/blog/"),
                        Resource(title="Design Conferences", url="https://www.awwwards.com/conferences/"),
                        Resource(title="Fiverr/Upwork for Freelance", url="https://www.fiverr.com/")
                    ],
                    'successCriteria': [
                        "Complete 5+ freelance projects",
                        "Attend 3+ design events",
                        "Develop signature style"
                    ]
                },
                'stage6': {
                    'goal': "Launch Design Career",
                    'description': "Build professional presence and secure design position.",
                    'actionPlan': [
                        "Create stunning online portfolio website",
                        "Optimize LinkedIn and design profiles",
                        "Apply to design positions or agencies",
                        "Prepare for design interviews"
                    ],
                    'resources': [
                        Resource(title="Indeed Design Jobs", url="https://www.indeed.com/jobs?q=graphic+designer"),
                        Resource(title="Coroflot Job Board", url="https://www.coroflot.com/"),
                        Resource(title="Portfolio Builders", url="https://www.format.com/")
                    ],
                    'successCriteria': [
                        "Professional portfolio live online",
                        "Apply to 20+ positions",
                        "Secure design job offer"
                    ]
                }
            }
        
        # Marketing Content
        elif "Marketing" in career_goal:
            return {
                'stage1': {
                    'goal': "Master Marketing Fundamentals",
                    'description': "Build foundation in marketing principles, consumer behavior, and strategy.",
                    'actionPlan': [
                        "Study 4 Ps of marketing (Product, Price, Place, Promotion)",
                        "Learn consumer behavior psychology",
                        "Understand market segmentation and targeting",
                        "Study branding fundamentals"
                    ],
                    'resources': [
                        Resource(title="HubSpot Academy", url="https://academy.hubspot.com/"),
                        Resource(title="Google Digital Garage", url="https://learndigital.withgoogle.com/digitalgarage"),
                        Resource(title="Marketing Week", url="https://www.marketingweek.com/")
                    ],
                    'successCriteria': [
                        "Complete marketing fundamentals course",
                        "Understand buyer personas",
                        "Create sample marketing plan"
                    ]
                },
                'stage2': {
                    'goal': "Learn Digital Marketing Tools",
                    'description': "Master SEO, social media, email marketing, and analytics platforms.",
                    'actionPlan': [
                        "Learn SEO and SEM fundamentals",
                        "Master Google Analytics and Search Console",
                        "Study social media marketing strategies",
                        "Explore email marketing platforms (Mailchimp)"
                    ],
                    'resources': [
                        Resource(title="Google Analytics Academy", url="https://analytics.google.com/analytics/academy/"),
                        Resource(title="Moz SEO Learning Center", url="https://moz.com/learn/seo"),
                        Resource(title="Hootsuite Academy", url="https://education.hootsuite.com/")
                    ],
                    'successCriteria': [
                        "Earn Google Analytics certification",
                        "Complete 3+ SEO projects",
                        "Manage social media campaigns"
                    ]
                },
                'stage3': {
                    'goal': "Build Marketing Portfolio",
                    'description': "Create real marketing campaigns and track results.",
                    'actionPlan': [
                        "Launch social media campaigns",
                        "Create content marketing strategy",
                        "Run email marketing campaigns",
                        "Analyze campaign performance metrics"
                    ],
                    'resources': [
                        Resource(title="Mailchimp Resources", url="https://mailchimp.com/resources/"),
                        Resource(title="Content Marketing Institute", url="https://contentmarketinginstitute.com/"),
                        Resource(title="Buffer Blog", url="https://buffer.com/resources/")
                    ],
                    'successCriteria': [
                        "Complete 5+ marketing campaigns",
                        "Demonstrate ROI improvement",
                        "Build marketing portfolio"
                    ]
                },
                'stage4': {
                    'goal': "Master Marketing Analytics",
                    'description': "Learn data analysis, A/B testing, and marketing metrics.",
                    'actionPlan': [
                        "Study marketing KPIs and metrics",
                        "Learn A/B testing methodologies",
                        "Master data visualization tools",
                        "Practice marketing attribution modeling"
                    ],
                    'resources': [
                        Resource(title="Google Data Studio", url="https://datastudio.google.com/"),
                        Resource(title="Optimizely Academy", url="https://www.optimizely.com/optimization-glossary/"),
                        Resource(title="Marketing Analytics Course", url="https://www.coursera.org/courses?query=marketing%20analytics")
                    ],
                    'successCriteria': [
                        "Create 3+ analytics dashboards",
                        "Run successful A/B tests",
                        "Make data-driven decisions"
                    ]
                },
                'stage5': {
                    'goal': "Develop Strategic Skills",
                    'description': "Learn campaign strategy, brand management, and market research.",
                    'actionPlan': [
                        "Study integrated marketing communications",
                        "Learn brand positioning strategies",
                        "Conduct market research projects",
                        "Develop go-to-market plans"
                    ],
                    'resources': [
                        Resource(title="American Marketing Association", url="https://www.ama.org/"),
                        Resource(title="Think with Google", url="https://www.thinkwithgoogle.com/"),
                        Resource(title="Marketing Week Strategy", url="https://www.marketingweek.com/category/strategy/")
                    ],
                    'successCriteria': [
                        "Create comprehensive marketing strategy",
                        "Complete market research project",
                        "Develop brand positioning document"
                    ]
                },
                'stage6': {
                    'goal': "Launch Marketing Career",
                    'description': "Build professional network and secure marketing position.",
                    'actionPlan': [
                        "Earn marketing certifications (Google, HubSpot, Meta)",
                        "Network at marketing events and conferences",
                        "Apply to marketing positions",
                        "Prepare case study presentations for interviews"
                    ],
                    'resources': [
                        Resource(title="Indeed Marketing Jobs", url="https://www.indeed.com/jobs?q=marketing+manager"),
                        Resource(title="LinkedIn Marketing Jobs", url="https://www.linkedin.com/jobs/marketing-jobs"),
                        Resource(title="Marketing Conferences", url="https://www.ama.org/events-training/")
                    ],
                    'successCriteria': [
                        "Obtain 3+ marketing certifications",
                        "Professional portfolio complete",
                        "Secure marketing position"
                    ]
                }
            }
        
        # Environmental Science Content
        elif "Environmental" in career_goal or "Sustainability" in career_goal:
            return {
                'stage1': {
                    'goal': "Master Environmental Fundamentals",
                    'description': "Build foundation in ecology, environmental science, and conservation.",
                    'actionPlan': [
                        "Study ecology and ecosystem dynamics",
                        "Learn environmental chemistry basics",
                        "Understand biodiversity and conservation biology",
                        "Study climate science fundamentals"
                    ],
                    'resources': [
                        Resource(title="Khan Academy Environmental Science", url="https://www.khanacademy.org/science/ap-biology/ecology-ap"),
                        Resource(title="Coursera Environmental Science", url="https://www.coursera.org/courses?query=environmental%20science"),
                        Resource(title="EPA Educational Resources", url="https://www.epa.gov/students")
                    ],
                    'successCriteria': [
                        "Complete ecology coursework with high marks",
                        "Understand carbon cycle and climate systems",
                        "Pass environmental science exams"
                    ]
                },
                'stage2': {
                    'goal': "Learn Field Research Methods",
                    'description': "Master GIS, environmental sampling, and data collection techniques.",
                    'actionPlan': [
                        "Learn GIS software (ArcGIS or QGIS)",
                        "Practice environmental sampling methods",
                        "Study statistical analysis for ecology",
                        "Conduct water and soil testing procedures"
                    ],
                    'resources': [
                        Resource(title="Esri Training", url="https://www.esri.com/training/"),
                        Resource(title="QGIS Tutorials", url="https://www.qgistutorials.com/"),
                        Resource(title="Ecological Society Resources", url="https://www.esa.org/")
                    ],
                    'successCriteria': [
                        "Complete GIS certification",
                        "Conduct field sampling project",
                        "Analyze environmental data successfully"
                    ]
                },
                'stage3': {
                    'goal': "Gain Field Experience",
                    'description': "Participate in environmental research and conservation projects.",
                    'actionPlan': [
                        "Join environmental field research projects",
                        "Volunteer for conservation organizations",
                        "Conduct environmental impact assessments",
                        "Work on restoration projects"
                    ],
                    'resources': [
                        Resource(title="Conservation Volunteer", url="https://www.conservationvolunteers.com.au/"),
                        Resource(title="The Nature Conservancy", url="https://www.nature.org/"),
                        Resource(title="Wildlife Conservation Society", url="https://www.wcs.org/")
                    ],
                    'successCriteria': [
                        "Complete 200+ field hours",
                        "Contribute to research paper or report",
                        "Lead conservation initiative"
                    ]
                },
                'stage4': {
                    'goal': "Master Environmental Policy",
                    'description': "Learn regulations, compliance, and environmental law.",
                    'actionPlan': [
                        "Study environmental regulations (NEPA, ESA, Clean Water Act)",
                        "Learn environmental compliance procedures",
                        "Understand sustainability reporting frameworks",
                        "Study climate policy frameworks"
                    ],
                    'resources': [
                        Resource(title="EPA Compliance", url="https://www.epa.gov/compliance"),
                        Resource(title="Environmental Law Institute", url="https://www.eli.org/"),
                        Resource(title="UN Environment Programme", url="https://www.unep.org/")
                    ],
                    'successCriteria': [
                        "Understand major environmental laws",
                        "Complete compliance assessment project",
                        "Create sustainability report"
                    ]
                },
                'stage5': {
                    'goal': "Specialize in Focus Area",
                    'description': "Develop expertise in conservation, climate science, or sustainability consulting.",
                    'actionPlan': [
                        "Choose specialization (climate, conservation, consulting)",
                        "Pursue relevant certifications (LEED, CEM)",
                        "Work on advanced specialized projects",
                        "Publish research or technical reports"
                    ],
                    'resources': [
                        Resource(title="LEED Certification", url="https://www.usgbc.org/leed"),
                        Resource(title="Climate Change Certificate", url="https://www.edx.org/learn/climate-change"),
                        Resource(title="Society for Conservation Biology", url="https://conbio.org/")
                    ],
                    'successCriteria': [
                        "Earn specialty certification",
                        "Complete advanced projects in focus area",
                        "Develop expert knowledge"
                    ]
                },
                'stage6': {
                    'goal': "Launch Environmental Career",
                    'description': "Secure position in environmental science or sustainability field.",
                    'actionPlan': [
                        "Apply to environmental organizations and agencies",
                        "Network at environmental conferences",
                        "Create professional research portfolio",
                        "Consider graduate studies if pursuing research"
                    ],
                    'resources': [
                        Resource(title="Environmental Career Opportunities", url="https://www.ecojobs.com/"),
                        Resource(title="Conservation Job Board", url="https://www.conservationjobboard.com/"),
                        Resource(title="Indeed Environmental Jobs", url="https://www.indeed.com/jobs?q=environmental+scientist")
                    ],
                    'successCriteria': [
                        "Professional research portfolio complete",
                        "Network with environmental professionals",
                        "Secure environmental science position"
                    ]
                }
            }
        
        # Default/Other careers - return generic content
        else:
            return {
                'stage1': {
                    'goal': "Build Strong Fundamentals",
                    'description': f"Master core concepts and essential skills for {career_goal}.",
                    'actionPlan': [
                        f"Study fundamentals of {career_goal}",
                        "Complete introductory courses and certifications",
                        "Practice essential skills daily",
                        "Set up professional tools and environment"
                    ],
                    'resources': [
                        Resource(title="Coursera", url="https://www.coursera.org"),
                        Resource(title="edX", url="https://www.edx.org"),
                        Resource(title="LinkedIn Learning", url="https://www.linkedin.com/learning/")
                    ],
                    'successCriteria': [
                        "Complete 2-3 foundational courses",
                        "Build 1-2 beginner projects",
                        "Understand industry basics"
                    ]
                },
                'stage2': {
                    'goal': "Develop Core Skills",
                    'description': f"Focus on skills critical for {career_goal} roles.",
                    'actionPlan': [
                        f"Deep dive into {priority_gaps[0] if priority_gaps else 'key competencies'}",
                        "Build practical projects",
                        "Learn industry best practices",
                        "Network with professionals"
                    ],
                    'resources': [
                        Resource(title="Industry Blogs", url="https://medium.com"),
                        Resource(title="Professional Courses", url="https://www.udemy.com"),
                        Resource(title="YouTube Tutorials", url="https://www.youtube.com")
                    ],
                    'successCriteria': [
                        "Complete 3-5 skill-building projects",
                        "Understand industry standards",
                        "Build professional network"
                    ]
                },
                'stage3': {
                    'goal': "Apply Skills to Real-World Scenarios",
                    'description': "Gain practical experience through projects and internships.",
                    'actionPlan': [
                        "Work on capstone project",
                        "Apply for internships",
                        "Practice interview skills",
                        "Build professional portfolio"
                    ],
                    'resources': [
                        Resource(title="Internship Platforms", url="https://www.internships.com"),
                        Resource(title="Project Ideas", url="https://github.com/topics"),
                        Resource(title="Interview Prep", url="https://www.glassdoor.com")
                    ],
                    'successCriteria': [
                        "Complete major project",
                        "Gain practical experience",
                        "Build strong portfolio"
                    ]
                },
                'stage4': {
                    'goal': "Master Advanced Techniques",
                    'description': "Learn optimization and advanced skills in your field.",
                    'actionPlan': [
                        "Study advanced topics",
                        "Optimize your work processes",
                        "Learn industry tools",
                        "Practice problem-solving"
                    ],
                    'resources': [
                        Resource(title="Advanced Courses", url="https://www.coursera.org"),
                        Resource(title="Professional Certifications", url="https://www.certifications.com"),
                        Resource(title="Industry Standards", url="https://www.iso.org")
                    ],
                    'successCriteria': [
                        "Master advanced concepts",
                        "Improve efficiency",
                        "Gain specialized knowledge"
                    ]
                },
                'stage5': {
                    'goal': "Explore Specializations",
                    'description': "Dive deeper into specialized areas.",
                    'actionPlan': [
                        "Choose specialization area",
                        "Attend industry events",
                        "Study specialized topics",
                        "Stay updated with trends"
                    ],
                    'resources': [
                        Resource(title="Specialization Courses", url="https://www.coursera.org"),
                        Resource(title="Industry Publications", url="https://www.medium.com"),
                        Resource(title="Conference Videos", url="https://www.youtube.com")
                    ],
                    'successCriteria': [
                        "Complete 2+ specialized courses",
                        "Attend 3+ events",
                        "Develop expertise"
                    ]
                },
                'stage6': {
                    'goal': "Prepare for Career Launch",
                    'description': "Final preparation for job market.",
                    'actionPlan': [
                        "Polish resume and profiles",
                        "Prepare for interviews",
                        "Build portfolio",
                        "Apply to companies",
                        "Practice negotiation"
                    ],
                    'resources': [
                        Resource(title="Resume Builder", url="https://www.resumegenius.com"),
                        Resource(title="Interview Guide", url="https://www.thebalancecareers.com"),
                        Resource(title="Job Boards", url="https://www.indeed.com")
                    ],
                    'successCriteria': [
                        "Professional portfolio",
                        "Polished resume",
                        "Complete interviews",
                        "Receive job offers"
                    ]
                }
            }

