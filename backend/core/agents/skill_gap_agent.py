"""
Skill Gap Agent
Identifies gaps between course curriculum and career requirements
"""
from typing import List, Set
from api.schemas.roadmap import SkillGapAnalysis, CurriculumAnalysis, CareerRequirements


class SkillGapAgent:
    """Analyzes skill gaps between education and career needs"""
    
    def __init__(self):
        # Similarity mappings for skill matching
        self.skill_aliases = {
            "programming fundamentals": ["programming", "coding", "development"],
            "data structures & algorithms": ["dsa", "algorithms", "data structures"],
            "database management": ["databases", "sql", "data management"],
            "web development": ["web", "frontend", "backend"],
            "cloud computing": ["cloud", "aws", "azure", "gcp"],
            "machine learning": ["ml", "ai", "deep learning"],
        }
    
    def identify(
        self,
        curriculum: CurriculumAnalysis,
        career_requirements: CareerRequirements
    ) -> SkillGapAnalysis:
        """
        Identify skill gaps between curriculum and career needs
        
        Args:
            curriculum: Course curriculum analysis
            career_requirements: Industry requirements for target role
            
        Returns:
            SkillGapAnalysis with categorized gaps
        """
        # Normalize skills to lowercase for comparison
        course_skills = set(s.lower() for s in curriculum.core_skills)
        required = set(s.lower() for s in career_requirements.required_skills)
        optional = set(s.lower() for s in career_requirements.optional_skills)
        
        # Find matches using aliases
        well_covered = []
        partially_covered = []
        missing_skills = []
        
        for req_skill in career_requirements.required_skills:
            match_level = self._match_skill(req_skill.lower(), course_skills)
            
            if match_level == "full":
                well_covered.append(req_skill)
            elif match_level == "partial":
                partially_covered.append(req_skill)
            else:
                missing_skills.append(req_skill)
        
        # Prioritize critical gaps (most important missing skills)
        priority_gaps = self._prioritize_gaps(missing_skills, career_requirements)
        
        return SkillGapAnalysis(
            missing_skills=missing_skills,
            partially_covered=partially_covered,
            well_covered=well_covered,
            priority_gaps=priority_gaps
        )
    
    def _match_skill(self, required_skill: str, course_skills: Set[str]) -> str:
        """
        Check if a required skill is covered in course skills
        
        Returns:
            "full" | "partial" | "none"
        """
        # Direct match
        if required_skill in course_skills:
            return "full"
        
        # Check aliases
        for course_skill in course_skills:
            if self._are_similar(required_skill, course_skill):
                return "full"
        
        # Check partial match (e.g., "programming" covers "python programming")
        for course_skill in course_skills:
            if required_skill in course_skill or course_skill in required_skill:
                return "partial"
        
        return "none"
    
    def _are_similar(self, skill1: str, skill2: str) -> bool:
        """Check if two skills are similar using alias mapping"""
        for canonical, aliases in self.skill_aliases.items():
            if (skill1 in aliases or skill1 == canonical) and \
               (skill2 in aliases or skill2 == canonical):
                return True
        return False
    
    def _prioritize_gaps(
        self,
        missing_skills: List[str],
        career_requirements: CareerRequirements
    ) -> List[str]:
        """
        Prioritize missing skills based on importance
        
        Returns first 3-4 most critical gaps
        """
        # Skills from required list are already prioritized
        # Take first few missing skills (assuming they're ordered by importance)
        return missing_skills[:4]
    
    def get_gap_severity(self, gap_analysis: SkillGapAnalysis) -> str:
        """
        Assess overall gap severity
        
        Returns:
            "low" | "medium" | "high"
        """
        missing_count = len(gap_analysis.missing_skills)
        
        if missing_count <= 2:
            return "low"
        elif missing_count <= 5:
            return "medium"
        else:
            return "high"
    
    def suggest_learning_path(self, gap_analysis: SkillGapAnalysis) -> List[str]:
        """Suggest order to address gaps"""
        # Priority gaps first, then other missing skills
        return gap_analysis.priority_gaps + [
            s for s in gap_analysis.missing_skills 
            if s not in gap_analysis.priority_gaps
        ]
