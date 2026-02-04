"""
Career Path Agent
Maps career goals to industry skill requirements
"""
from typing import Dict, List
from api.schemas.roadmap import CareerRequirements, CareerGoal


class CareerPathAgent:
    """Maps career goals to required skills and typical journeys"""
    
    def __init__(self):
        # Industry-validated skill requirements per role
        self.career_requirements = {
            CareerGoal.SOFTWARE_ENGINEER: {
                "required": [
                    "Data Structures & Algorithms",
                    "Object-Oriented Programming",
                    "Version Control (Git)",
                    "RESTful APIs",
                    "Testing & Debugging",
                    "System Design Basics",
                    "Database Design",
                    "Backend Development"
                ],
                "optional": [
                    "Frontend Frameworks",
                    "Cloud Platforms",
                    "Microservices",
                    "CI/CD Pipelines",
                    "Agile Methodologies"
                ],
                "description": "Designs, develops, and maintains software applications using engineering principles and best practices.",
                "journey": [
                    "Master programming fundamentals",
                    "Build strong DSA foundation",
                    "Develop 2-3 portfolio projects",
                    "Contribute to open source",
                    "Prepare for technical interviews",
                    "Gain internship/junior role experience"
                ]
            },
            CareerGoal.DATA_ENGINEER: {
                "required": [
                    "SQL & Database Design",
                    "Python for Data Processing",
                    "ETL/ELT Pipelines",
                    "Data Warehousing",
                    "Cloud Platforms (AWS/Azure/GCP)",
                    "Distributed Systems",
                    "Data Modeling",
                    "Big Data Technologies"
                ],
                "optional": [
                    "Apache Spark/Hadoop",
                    "Kafka/Stream Processing",
                    "Docker & Kubernetes",
                    "Data Quality & Testing",
                    "Data Governance"
                ],
                "description": "Builds and maintains data infrastructure, pipelines, and platforms for analytics and ML teams.",
                "journey": [
                    "Master SQL and Python",
                    "Learn cloud data services",
                    "Build ETL pipeline projects",
                    "Understand data warehousing",
                    "Practice with real datasets",
                    "Gain experience with production systems"
                ]
            },
            CareerGoal.FULL_STACK_DEVELOPER: {
                "required": [
                    "HTML/CSS/JavaScript",
                    "Frontend Framework (React/Vue/Angular)",
                    "Backend Framework (Node.js/Django/Spring)",
                    "RESTful API Design",
                    "Database Management",
                    "Version Control (Git)",
                    "Responsive Design",
                    "Authentication & Security"
                ],
                "optional": [
                    "GraphQL",
                    "TypeScript",
                    "Cloud Deployment",
                    "DevOps Basics",
                    "Mobile Development"
                ],
                "description": "Develops both client-side and server-side software, handling the complete application stack.",
                "journey": [
                    "Master HTML, CSS, JavaScript",
                    "Learn a frontend framework",
                    "Master a backend technology",
                    "Build full-stack projects",
                    "Deploy applications online",
                    "Create impressive portfolio"
                ]
            },
            CareerGoal.DEVOPS_ENGINEER: {
                "required": [
                    "Linux/Unix Administration",
                    "CI/CD Pipelines",
                    "Docker & Kubernetes",
                    "Infrastructure as Code",
                    "Cloud Platforms",
                    "Scripting (Bash/Python)",
                    "Monitoring & Logging",
                    "Network & Security Basics"
                ],
                "optional": [
                    "Terraform/Ansible",
                    "Service Mesh",
                    "GitOps",
                    "Site Reliability Engineering",
                    "Cost Optimization"
                ],
                "description": "Automates and streamlines software development, deployment, and infrastructure operations.",
                "journey": [
                    "Learn Linux fundamentals",
                    "Master version control",
                    "Understand networking basics",
                    "Practice with Docker/K8s",
                    "Build CI/CD pipelines",
                    "Get cloud certifications"
                ]
            },
            CareerGoal.ML_ENGINEER: {
                "required": [
                    "Python Programming",
                    "Machine Learning Algorithms",
                    "Deep Learning Frameworks",
                    "Data Preprocessing",
                    "Model Training & Evaluation",
                    "MLOps Practices",
                    "Cloud ML Services",
                    "Linear Algebra & Statistics"
                ],
                "optional": [
                    "Computer Vision/NLP",
                    "Model Optimization",
                    "Edge Deployment",
                    "Research Paper Implementation",
                    "Experiment Tracking"
                ],
                "description": "Develops, trains, and deploys machine learning models to solve real-world problems.",
                "journey": [
                    "Master Python and math foundations",
                    "Learn ML algorithms deeply",
                    "Practice with Kaggle competitions",
                    "Build ML projects end-to-end",
                    "Learn MLOps and deployment",
                    "Build strong ML portfolio"
                ]
            },
            CareerGoal.CIVIL_ENGINEER: {
                "required": [
                    "Structural Analysis & Design",
                    "AutoCAD & Civil 3D",
                    "Construction Materials & Methods",
                    "Geotechnical Engineering",
                    "Surveying & Site Planning",
                    "Building Codes & Standards",
                    "Project Management",
                    "Cost Estimation & Budgeting"
                ],
                "optional": [
                    "BIM (Building Information Modeling)",
                    "Revit & 3D Modeling",
                    "Environmental Engineering",
                    "Transportation Engineering",
                    "Hydraulics & Water Resources",
                    "Sustainable Design Practices",
                    "Earthquake Engineering",
                    "Construction Law & Contracts"
                ],
                "description": "Designs, plans, and oversees construction of infrastructure projects including buildings, roads, bridges, and water systems.",
                "journey": [
                    "Master structural analysis fundamentals",
                    "Learn CAD software (AutoCAD, Civil 3D)",
                    "Study construction materials and methods",
                    "Gain practical site experience",
                    "Understand building codes and standards",
                    "Develop project management skills",
                    "Obtain professional licensure (PE/PMP)",
                    "Build portfolio of completed projects"
                ]
            },
            CareerGoal.MECHANICAL_ENGINEER: {
                "required": [
                    "Thermodynamics & Heat Transfer",
                    "Fluid Mechanics",
                    "Machine Design & Mechanics",
                    "CAD Software (SolidWorks, AutoCAD)",
                    "Manufacturing Processes",
                    "Materials Science",
                    "Control Systems",
                    "Engineering Drawings & GD&T"
                ],
                "optional": [
                    "Finite Element Analysis (FEA)",
                    "HVAC Systems",
                    "Robotics & Automation",
                    "3D Printing & Additive Manufacturing",
                    "CFD (Computational Fluid Dynamics)",
                    "MATLAB & Simulation"
                ],
                "description": "Designs, develops, and tests mechanical devices, systems, and machinery.",
                "journey": [
                    "Master mechanical engineering fundamentals",
                    "Learn CAD software proficiently",
                    "Understand manufacturing processes",
                    "Gain hands-on workshop experience",
                    "Build prototypes and test designs",
                    "Obtain professional certifications"
                ]
            },
            CareerGoal.ELECTRICAL_ENGINEER: {
                "required": [
                    "Circuit Analysis & Design",
                    "Electronics & Semiconductors",
                    "Power Systems & Distribution",
                    "Control Systems",
                    "Microcontrollers & Embedded Systems",
                    "Signal Processing",
                    "PCB Design",
                    "Electrical Safety Standards"
                ],
                "optional": [
                    "Renewable Energy Systems",
                    "IoT & Wireless Communication",
                    "FPGA & VHDL/Verilog",
                    "MATLAB & Simulink",
                    "Power Electronics",
                    "Automation & PLC Programming"
                ],
                "description": "Designs, develops, and tests electrical equipment and systems.",
                "journey": [
                    "Master circuit theory and electronics",
                    "Learn PCB design software",
                    "Practice with microcontroller projects",
                    "Understand power systems",
                    "Build electronics projects",
                    "Obtain relevant certifications"
                ]
            },
            CareerGoal.CHEMICAL_ENGINEER: {
                "required": [
                    "Chemical Process Design",
                    "Thermodynamics & Kinetics",
                    "Mass & Heat Transfer",
                    "Process Control",
                    "Chemical Safety & Hazard Analysis",
                    "Unit Operations",
                    "Process Simulation Software",
                    "Quality Control & Optimization"
                ],
                "optional": [
                    "Biochemical Engineering",
                    "Environmental Engineering",
                    "Pharmaceutical Manufacturing",
                    "Polymer Science",
                    "Petrochemical Processes"
                ],
                "description": "Designs and optimizes chemical processes for manufacturing products.",
                "journey": [
                    "Master chemical engineering principles",
                    "Learn process simulation tools",
                    "Understand safety protocols",
                    "Gain laboratory experience",
                    "Study industrial processes",
                    "Obtain safety certifications"
                ]
            },
            CareerGoal.INDUSTRIAL_ENGINEER: {
                "required": [
                    "Operations Research",
                    "Supply Chain Management",
                    "Quality Control & Six Sigma",
                    "Process Improvement & Lean",
                    "Production Planning",
                    "Ergonomics & Human Factors",
                    "Cost Analysis",
                    "Project Management"
                ],
                "optional": [
                    "Data Analytics",
                    "Simulation Software",
                    "Automation & Robotics",
                    "Facility Design",
                    "Logistics Management"
                ],
                "description": "Optimizes complex systems, processes, and organizations for efficiency.",
                "journey": [
                    "Master operations research",
                    "Learn Lean and Six Sigma",
                    "Study supply chain management",
                    "Gain practical industry experience",
                    "Obtain relevant certifications",
                    "Develop process optimization skills"
                ]
            },
            CareerGoal.DATA_SCIENTIST: {
                "required": [
                    "Python & R Programming",
                    "Statistics & Probability",
                    "Machine Learning",
                    "Data Visualization",
                    "SQL & Databases",
                    "Exploratory Data Analysis",
                    "Feature Engineering",
                    "Communication & Storytelling"
                ],
                "optional": [
                    "Deep Learning",
                    "Big Data Technologies",
                    "A/B Testing",
                    "Business Intelligence Tools",
                    "Cloud Platforms"
                ],
                "description": "Extracts insights from data to drive business decisions.",
                "journey": [
                    "Master statistics and Python",
                    "Learn ML algorithms",
                    "Practice with real datasets",
                    "Build data science portfolio",
                    "Develop communication skills",
                    "Gain domain expertise"
                ]
            },
            CareerGoal.BUSINESS_ANALYST: {
                "required": [
                    "Requirements Gathering",
                    "Business Process Modeling",
                    "Data Analysis & Excel",
                    "SQL & Reporting",
                    "Stakeholder Management",
                    "Documentation & Communication",
                    "Agile/Scrum Methodologies",
                    "Problem Solving"
                ],
                "optional": [
                    "Power BI / Tableau",
                    "Python for Analysis",
                    "Project Management",
                    "UX/UI Basics",
                    "Financial Analysis"
                ],
                "description": "Bridges business needs with technical solutions through analysis.",
                "journey": [
                    "Learn business analysis fundamentals",
                    "Master Excel and SQL",
                    "Understand Agile methodologies",
                    "Develop communication skills",
                    "Gain domain knowledge",
                    "Obtain BA certifications"
                ]
            },
            CareerGoal.PROJECT_MANAGER: {
                "required": [
                    "Project Planning & Scheduling",
                    "Risk Management",
                    "Budgeting & Cost Control",
                    "Team Leadership",
                    "Stakeholder Communication",
                    "Agile & Waterfall Methodologies",
                    "Resource Allocation",
                    "Quality Management"
                ],
                "optional": [
                    "MS Project / Jira",
                    "Change Management",
                    "Contract Management",
                    "Business Analysis",
                    "Technical Knowledge"
                ],
                "description": "Plans, executes, and oversees projects from initiation to completion.",
                "journey": [
                    "Learn project management fundamentals",
                    "Understand PM methodologies",
                    "Develop leadership skills",
                    "Gain practical project experience",
                    "Obtain PMP/PRINCE2 certification",
                    "Build stakeholder management skills"
                ]
            },
            CareerGoal.OTHER: {
                "required": [
                    "Domain-Specific Knowledge",
                    "Problem Solving",
                    "Communication Skills",
                    "Continuous Learning",
                    "Analytical Thinking",
                    "Time Management",
                    "Collaboration",
                    "Adaptability"
                ],
                "optional": [
                    "Technical Skills",
                    "Leadership",
                    "Project Management",
                    "Data Analysis",
                    "Industry Certifications"
                ],
                "description": "Generic career path - customize based on your specific field.",
                "journey": [
                    "Identify your specific career path",
                    "Research required skills",
                    "Build foundational knowledge",
                    "Gain practical experience",
                    "Network with professionals",
                    "Develop specialized expertise",

                    "Learn MLOps and deployment",
                    "Stay updated with research"
                ]
            }
        }
    
    def infer(self, career_goal: CareerGoal, user_profile: Dict = None) -> CareerRequirements:
        """
        Infer career requirements based on goal
        
        Args:
            career_goal: Target career path
            user_profile: Optional user profile for personalization
            
        Returns:
            CareerRequirements with skills and journey
        """
        # Get base requirements for the career
        requirements = self.career_requirements.get(
            career_goal,
            self.career_requirements[CareerGoal.SOFTWARE_ENGINEER]  # Default
        )
        
        # TODO: Personalize based on user_profile (experience, interests, etc.)
        
        return CareerRequirements(
            required_skills=requirements["required"],
            optional_skills=requirements["optional"],
            role_description=requirements["description"],
            typical_journey=requirements["journey"]
        )
    
    def get_skill_priority(self, career_goal: CareerGoal) -> List[str]:
        """Get prioritized list of skills to learn first"""
        requirements = self.career_requirements.get(career_goal)
        if not requirements:
            return []
        
        # First 4-5 are highest priority
        return requirements["required"][:5]
    
    def get_learning_resources(self, skill: str) -> List[Dict[str, str]]:
        """Get recommended learning resources for a skill (stub for future expansion)"""
        # This could be extended with RAG to retrieve actual resources
        resource_map = {
            "Data Structures & Algorithms": [
                {"title": "LeetCode", "url": "https://leetcode.com"},
                {"title": "NeetCode", "url": "https://neetcode.io"}
            ],
            "Python Programming": [
                {"title": "Python Official Tutorial", "url": "https://docs.python.org/3/tutorial/"},
                {"title": "Real Python", "url": "https://realpython.com"}
            ],
            # Add more mappings as needed
        }
        return resource_map.get(skill, [])
