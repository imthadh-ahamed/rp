"""
Quick Demo: How the Agentic RAG Roadmap System Works

Run this to see a step-by-step execution flow (no API server needed)
"""
import sys
import os
from pathlib import Path

# Add backend directory to Python path
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

from api.schemas.roadmap import (
    RoadmapRequest, SelectedCourse, CareerGoal
)
from core.agents.roadmap_orchestrator import RoadmapOrchestrator
import asyncio
import json


async def demo():
    """Demo the roadmap generation system"""
    
    print("=" * 70)
    print("🎯 AGENTIC RAG ROADMAP GENERATION - DEMO")
    print("=" * 70)
    print()
    
    # Sample input
    sample_course = SelectedCourse(
        course_name="Bachelor of Software Engineering Honours",
        university="Open University of Sri Lanka",
        location="Colombo",
        match_score=82.19574332237244,
        explanation="This Bachelor of Software Engineering Honours at Colombo is well-suited for students interested in Information Technology pursuing careers in Software Engineer or Data Engineer. The program offers Full Time over 4 Years and provides comprehensive training leading to opportunities in various career paths.",
        url="https://ou.ac.lk/programme/bachelor-of-software-engineering-honours/",
        career_opportunities="Software Engineer, System Analyst, Software Architect, Quality Assurance Engineer, Project Manager, IT Consultant",
        study_language="English",
        study_method="Full Time",
        duration="4 Years",
        requirements="Applicants should meet the general admission requirements of the Open University of Sri Lanka. Those with accepted formal post-secondary educational qualifications may complete the program in a shorter period. Students with prior academic qualifications beyond standard entry requirements may apply for course exemptions as detailed in the BSE Guidebook 2025/2026.",
        course_fee="Rs.660,000.00",
        department="Faculty of Engineering Technology"
    )
    
    sample_profile = {
        "age":"20",
        "gender":"Male",
        "nativeLanguage":"Tamil",
        "preferredLanguage":"English",
        "olResults":"Maths: A, English: B, Science: B, ICT: A",
        "alStream":"Physical Science",
        "alResults":"Combined Maths: B, Physics: B, Chemistry: B",
        "otherQualifications": None,
        "ieltsScore": 6,
        "interestArea":"Information Technology",
        "careerGoal":"Software Engineer or Data Engineer",
        "monthlyIncome":"45000 LKR",
        "fundingMethod":"Self-funded",
        "availability":"Weekday",
        "completionPeriod":"3-4 years",
        "studyMethod":"Onsite",
        "currentLocation":"Colombo, Sri Lanka",
        "preferredLocations":"Colombo, Sri Lanka"
    }
    
    request = RoadmapRequest(
        user_profile=sample_profile,
        selected_course=sample_course,
        career_goal=CareerGoal.SOFTWARE_ENGINEER
    )
    
    print("📥 INPUT:")
    print(f"  Course: {sample_course.course_name}")
    print(f"  University: {sample_course.university}")
    print(f"  Career Goal: {request.career_goal.value}")
    print(f"  Duration: {sample_course.duration}")
    print()
    
    # Initialize orchestrator
    orchestrator = RoadmapOrchestrator(llm_client=None)
    
    print("🤖 AGENT EXECUTION FLOW:")
    print()
    
    # Generate roadmap
    result = await orchestrator.generate_roadmap(request)
    
    print()
    print("=" * 70)
    print("📊 RESULTS:")
    print("=" * 70)
    
    # Display metadata
    if result.get("metadata"):
        metadata = result["metadata"]
        print(f"\n✅ Status: {result['status']}")
        print(f"\n📌 Metadata:")
        print(f"   Focus Area: {metadata['curriculum_focus']}")
        print(f"   Languages: {', '.join(metadata['languages'])}")
        print(f"   Duration: {metadata['duration_years']} years")
        print(f"   Skill Gaps: {metadata['skill_gaps_count']} ({metadata['gap_severity']} severity)")
        print(f"   Priority Skills: {', '.join(metadata['priority_skills'][:3])}")
    
    # Display warnings
    if result.get("warnings"):
        print(f"\n⚠️  Warnings:")
        for warning in result["warnings"]:
            print(f"   - {warning}")
    
    # Display roadmap overview
    if result.get("roadmap"):
        print(f"\n🗺️  Roadmap Overview ({len(result['roadmap'])} stages):")
        print()
        for stage in result["roadmap"]:
            print(f"   Stage {stage.id}: {stage.title}")
            print(f"   └─ Goal: {stage.goal}")
            print(f"   └─ Duration: {stage.duration}")
            print(f"   └─ Actions: {len(stage.actionPlan)} items")
            print(f"   └─ Resources: {len(stage.resources)} links")
            print()
    
    # Save to file
    output_file = "demo_roadmap_output.json"
    with open(output_file, 'w') as f:
        # Convert Pydantic models to dict for JSON serialization
        roadmap_dict = {
            "status": result["status"],
            "roadmap": [step.model_dump() for step in result["roadmap"]],
            "metadata": result["metadata"],
            "warnings": result.get("warnings", []),
            "errors": result.get("errors", [])
        }
        json.dump(roadmap_dict, f, indent=2)
    
    print(f"💾 Full roadmap saved to: {output_file}")
    print()
    print("=" * 70)
    print("✅ DEMO COMPLETE")
    print("=" * 70)


if __name__ == "__main__":
    asyncio.run(demo())
