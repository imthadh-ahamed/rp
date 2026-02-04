"""
Roadmap Orchestrator
Coordinates all agents to generate personalized roadmap
"""
from typing import Dict
from api.schemas.roadmap import (
    RoadmapRequest, RoadmapStep, CareerGoal, SelectedCourse
)
from core.agents.curriculum_agent import CurriculumAgent
from core.agents.career_path_agent import CareerPathAgent
from core.agents.skill_gap_agent import SkillGapAgent
from core.agents.roadmap_planning_agent import RoadmapPlanningAgent


class RoadmapOrchestrator:
    """Orchestrates all agents to generate complete roadmap"""
    
    def __init__(self, llm_client=None):
        """
        Initialize orchestrator with all agents
        
        Args:
            llm_client: Optional LLM client for roadmap generation
        """
        self.curriculum_agent = CurriculumAgent()
        self.career_agent = CareerPathAgent()
        self.gap_agent = SkillGapAgent()
        self.roadmap_agent = RoadmapPlanningAgent(llm_client=llm_client)
    
    async def generate_roadmap(self, request: RoadmapRequest) -> Dict:
        """
        Main orchestration method - coordinates all agents
        
        Args:
            request: RoadmapRequest with user profile and course
            
        Returns:
            Dictionary with roadmap and metadata
        """
        try:
            # Extract career goal (from top-level or user_profile)
            career_goal_str = request.get_career_goal()
            
            # Convert to CareerGoal enum for agents
            from api.schemas.roadmap import CareerGoal
            career_goal_enum = CareerGoal(career_goal_str)
            
            # Step 1: Analyze curriculum
            print("🔍 Analyzing course curriculum...")
            curriculum = self.curriculum_agent.analyze(request.selected_course)
            
            # Step 2: Infer career requirements
            print(f"🎯 Inferring requirements for {career_goal_str}...")
            career_requirements = self.career_agent.infer(
                career_goal=career_goal_enum,
                user_profile=request.user_profile
            )
            
            # Step 3: Identify skill gaps
            print("📊 Identifying skill gaps...")
            gap_analysis = self.gap_agent.identify(
                curriculum=curriculum,
                career_requirements=career_requirements
            )
            
            # Step 4: Generate roadmap
            print("🗺️ Generating personalized roadmap...")
            roadmap_steps = await self.roadmap_agent.plan(
                user_profile=request.user_profile,
                career_goal=career_goal_enum,
                curriculum=curriculum,
                career_requirements=career_requirements,
                gap_analysis=gap_analysis
            )
            
            # Build metadata
            metadata = {
                "curriculum_focus": curriculum.focus_area,
                "languages": curriculum.languages,
                "duration_years": curriculum.duration_years,
                "skill_gaps_count": len(gap_analysis.missing_skills),
                "gap_severity": self.gap_agent.get_gap_severity(gap_analysis),
                "priority_skills": gap_analysis.priority_gaps[:3]
            }
            
            return {
                "status": "success",
                "roadmap": roadmap_steps,
                "metadata": metadata,
                "warnings": self._generate_warnings(gap_analysis),
                "errors": []
            }
        
        except Exception as e:
            print(f"❌ Error in roadmap generation: {e}")
            import traceback
            traceback.print_exc()
            
            return {
                "status": "error",
                "roadmap": [],
                "metadata": {},
                "warnings": [],
                "errors": [str(e)]
            }
    
    def _generate_warnings(self, gap_analysis) -> list:
        """Generate helpful warnings based on gap analysis"""
        warnings = []
        
        gap_count = len(gap_analysis.missing_skills)
        if gap_count > 5:
            warnings.append(
                f"Your course has {gap_count} skill gaps. "
                "Consider supplementing with online courses or bootcamps."
            )
        
        if gap_analysis.priority_gaps:
            warnings.append(
                f"Priority skills to learn: {', '.join(gap_analysis.priority_gaps[:3])}"
            )
        
        return warnings
