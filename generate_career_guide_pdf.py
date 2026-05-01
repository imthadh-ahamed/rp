"""
Generate Career Guide for Non-Traditional Learners - Methodology Documentation PDF
"""
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, PageBreak, ListFlowable, ListItem, KeepTogether
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
import datetime

OUTPUT_PATH = "E:/rp/career_guide_methodology.pdf"

# ──────────────────────────────────────────────
# Colour palette
# ──────────────────────────────────────────────
DARK_BLUE   = colors.HexColor("#1E3A5F")
MID_BLUE    = colors.HexColor("#2C5F8A")
ACCENT_BLUE = colors.HexColor("#3B82F6")
LIGHT_BLUE  = colors.HexColor("#EFF6FF")
LIGHT_GREY  = colors.HexColor("#F8FAFC")
MID_GREY    = colors.HexColor("#64748B")
DARK_GREY   = colors.HexColor("#1E293B")
WHITE       = colors.white
GREEN       = colors.HexColor("#16A34A")
AMBER       = colors.HexColor("#D97706")


def build_styles():
    base = getSampleStyleSheet()

    styles = {
        "cover_title": ParagraphStyle(
            "cover_title", parent=base["Title"],
            fontSize=26, leading=32, textColor=WHITE,
            spaceAfter=8, alignment=TA_CENTER, fontName="Helvetica-Bold"
        ),
        "cover_subtitle": ParagraphStyle(
            "cover_subtitle", parent=base["Normal"],
            fontSize=13, leading=18, textColor=colors.HexColor("#BFD7F5"),
            spaceAfter=6, alignment=TA_CENTER, fontName="Helvetica"
        ),
        "cover_meta": ParagraphStyle(
            "cover_meta", parent=base["Normal"],
            fontSize=10, leading=14, textColor=colors.HexColor("#93C5FD"),
            alignment=TA_CENTER, fontName="Helvetica"
        ),
        "h1": ParagraphStyle(
            "h1", parent=base["Heading1"],
            fontSize=18, leading=24, textColor=DARK_BLUE,
            spaceBefore=18, spaceAfter=6, fontName="Helvetica-Bold",
            borderPad=4
        ),
        "h2": ParagraphStyle(
            "h2", parent=base["Heading2"],
            fontSize=13, leading=18, textColor=MID_BLUE,
            spaceBefore=14, spaceAfter=4, fontName="Helvetica-Bold"
        ),
        "h3": ParagraphStyle(
            "h3", parent=base["Heading3"],
            fontSize=11, leading=15, textColor=DARK_GREY,
            spaceBefore=10, spaceAfter=3, fontName="Helvetica-Bold"
        ),
        "body": ParagraphStyle(
            "body", parent=base["Normal"],
            fontSize=10, leading=15, textColor=DARK_GREY,
            spaceAfter=6, alignment=TA_JUSTIFY, fontName="Helvetica"
        ),
        "body_left": ParagraphStyle(
            "body_left", parent=base["Normal"],
            fontSize=10, leading=15, textColor=DARK_GREY,
            spaceAfter=4, alignment=TA_LEFT, fontName="Helvetica"
        ),
        "code": ParagraphStyle(
            "code", parent=base["Code"],
            fontSize=8.5, leading=13, textColor=DARK_GREY,
            backColor=LIGHT_GREY, fontName="Courier",
            leftIndent=12, rightIndent=12, spaceAfter=6,
            borderPad=6
        ),
        "caption": ParagraphStyle(
            "caption", parent=base["Normal"],
            fontSize=8.5, leading=12, textColor=MID_GREY,
            alignment=TA_CENTER, fontName="Helvetica-Oblique", spaceAfter=8
        ),
        "bullet": ParagraphStyle(
            "bullet", parent=base["Normal"],
            fontSize=10, leading=14, textColor=DARK_GREY,
            leftIndent=16, spaceAfter=3, fontName="Helvetica"
        ),
        "toc_entry": ParagraphStyle(
            "toc_entry", parent=base["Normal"],
            fontSize=10, leading=16, textColor=DARK_GREY,
            fontName="Helvetica"
        ),
        "note_box": ParagraphStyle(
            "note_box", parent=base["Normal"],
            fontSize=9.5, leading=14, textColor=colors.HexColor("#92400E"),
            fontName="Helvetica-Oblique", leftIndent=8
        ),
        "section_label": ParagraphStyle(
            "section_label", parent=base["Normal"],
            fontSize=9, leading=12, textColor=WHITE,
            fontName="Helvetica-Bold", alignment=TA_LEFT
        ),
    }
    return styles


def hr(story, color=ACCENT_BLUE, thickness=1):
    story.append(HRFlowable(width="100%", thickness=thickness, color=color, spaceAfter=6, spaceBefore=4))


def section_header(story, styles, number, title):
    """Render a coloured section header band."""
    data = [[Paragraph(f"{number}  {title}", styles["section_label"])]]
    t = Table(data, colWidths=["100%"])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), DARK_BLUE),
        ("TOPPADDING",    (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
        ("LEFTPADDING",   (0, 0), (-1, -1), 10),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 10),
        ("ROUNDEDCORNERS", [4]),
    ]))
    story.append(KeepTogether([Spacer(1, 10), t, Spacer(1, 6)]))


def info_table(story, rows, col_widths=None):
    """Two-column key/value table."""
    if col_widths is None:
        col_widths = [5.5 * cm, 11.5 * cm]
    t = Table(rows, colWidths=col_widths, repeatRows=0)
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0, 0), (0, -1), LIGHT_BLUE),
        ("BACKGROUND",    (1, 0), (1, -1), WHITE),
        ("FONTNAME",      (0, 0), (0, -1), "Helvetica-Bold"),
        ("FONTNAME",      (1, 0), (1, -1), "Helvetica"),
        ("FONTSIZE",      (0, 0), (-1, -1), 9.5),
        ("LEADING",       (0, 0), (-1, -1), 14),
        ("VALIGN",        (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING",    (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LEFTPADDING",   (0, 0), (-1, -1), 8),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 8),
        ("GRID",          (0, 0), (-1, -1), 0.4, colors.HexColor("#CBD5E1")),
        ("ROWBACKGROUNDS", (0, 0), (-1, -1), [WHITE, LIGHT_GREY]),
        ("TEXTCOLOR",     (0, 0), (-1, -1), DARK_GREY),
    ]))
    story.append(t)
    story.append(Spacer(1, 8))


def flow_table(story, headers, rows):
    """Generic table with header row."""
    data = [headers] + rows
    col_w = [17 * cm / len(headers)] * len(headers)
    t = Table(data, colWidths=col_w, repeatRows=1)
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0, 0), (-1, 0), MID_BLUE),
        ("TEXTCOLOR",     (0, 0), (-1, 0), WHITE),
        ("FONTNAME",      (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE",      (0, 0), (-1, -1), 9),
        ("LEADING",       (0, 0), (-1, -1), 13),
        ("FONTNAME",      (0, 1), (-1, -1), "Helvetica"),
        ("VALIGN",        (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING",    (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LEFTPADDING",   (0, 0), (-1, -1), 7),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 7),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [WHITE, LIGHT_GREY]),
        ("GRID",          (0, 0), (-1, -1), 0.4, colors.HexColor("#CBD5E1")),
        ("TEXTCOLOR",     (0, 1), (-1, -1), DARK_GREY),
    ]))
    story.append(t)
    story.append(Spacer(1, 8))


def bullet_list(story, styles, items, bullet_char="•"):
    for item in items:
        story.append(Paragraph(f"{bullet_char}  {item}", styles["bullet"]))
    story.append(Spacer(1, 4))


def note_box(story, styles, text):
    data = [[Paragraph(f"NOTE: {text}", styles["note_box"])]]
    t = Table(data, colWidths=["100%"])
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0, 0), (-1, -1), colors.HexColor("#FEF3C7")),
        ("LEFTPADDING",   (0, 0), (-1, -1), 10),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 10),
        ("TOPPADDING",    (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("BOX", (0, 0), (-1, -1), 0.8, colors.HexColor("#F59E0B")),
        ("ROUNDEDCORNERS", [4]),
    ]))
    story.append(t)
    story.append(Spacer(1, 8))


# ──────────────────────────────────────────────
# Page callbacks
# ──────────────────────────────────────────────
def on_page(canvas, doc):
    canvas.saveState()
    W, H = A4
    # Footer line
    canvas.setStrokeColor(colors.HexColor("#CBD5E1"))
    canvas.setLineWidth(0.5)
    canvas.line(2 * cm, 1.4 * cm, W - 2 * cm, 1.4 * cm)
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(MID_GREY)
    canvas.drawString(2 * cm, 1.0 * cm, "Career Guide for Non-Traditional Learners — Methodology Documentation")
    canvas.drawRightString(W - 2 * cm, 1.0 * cm, f"Page {doc.page}")
    canvas.restoreState()


def on_first_page(canvas, doc):
    """Cover page — no header/footer."""
    canvas.saveState()
    W, H = A4
    # Full-bleed gradient-ish background (top band)
    canvas.setFillColor(DARK_BLUE)
    canvas.rect(0, H * 0.55, W, H * 0.45, fill=1, stroke=0)
    canvas.setFillColor(MID_BLUE)
    canvas.rect(0, H * 0.35, W, H * 0.21, fill=1, stroke=0)
    # Bottom half white
    canvas.setFillColor(WHITE)
    canvas.rect(0, 0, W, H * 0.35, fill=1, stroke=0)
    canvas.restoreState()


# ──────────────────────────────────────────────
# Document assembly
# ──────────────────────────────────────────────
def build_document():
    doc = SimpleDocTemplate(
        OUTPUT_PATH,
        pagesize=A4,
        rightMargin=2 * cm,
        leftMargin=2 * cm,
        topMargin=2.4 * cm,
        bottomMargin=2.4 * cm,
        title="Career Guide for Non-Traditional Learners — Methodology",
        author="RP Platform Team",
    )

    S = build_styles()
    story = []

    # ── Cover Page ──────────────────────────────
    story.append(Spacer(1, 3.2 * cm))
    story.append(Paragraph("Career Guide for", S["cover_title"]))
    story.append(Paragraph("Non-Traditional Learners", S["cover_title"]))
    story.append(Spacer(1, 0.4 * cm))
    story.append(Paragraph("System Methodology & Technical Documentation", S["cover_subtitle"]))
    story.append(Spacer(1, 0.6 * cm))

    today = datetime.date.today().strftime("%B %d, %Y")
    story.append(Paragraph(f"Generated: {today}  |  Platform: RP (E:/rp)  |  Prepared by: Imthadh Ahamed", S["cover_meta"]))
    story.append(Spacer(1, 2.6 * cm))

    # Cover summary box
    summary_data = [[
        Paragraph(
            "This document describes the complete methodology, architecture, and step-by-step workflow "
            "of the <b>Career Guide for Non-Traditional Learners</b> module within the RP platform. "
            "It covers the frontend assessment flow, backend AI-driven recommendation engine, "
            "skill-gap analysis pipeline, and personalised six-stage career roadmap generation system.",
            ParagraphStyle("cs", parent=S["body"], textColor=DARK_GREY, alignment=TA_JUSTIFY)
        )
    ]]
    t = Table(summary_data, colWidths=["100%"])
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0, 0), (-1, -1), LIGHT_BLUE),
        ("BOX",           (0, 0), (-1, -1), 1.2, ACCENT_BLUE),
        ("LEFTPADDING",   (0, 0), (-1, -1), 14),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 14),
        ("TOPPADDING",    (0, 0), (-1, -1), 12),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 12),
        ("ROUNDEDCORNERS", [6]),
    ]))
    story.append(t)
    story.append(PageBreak())

    # ── Table of Contents ────────────────────────
    story.append(Paragraph("Table of Contents", S["h1"]))
    hr(story)
    toc_items = [
        ("1", "Overview & Purpose"),
        ("2", "File & Module Inventory"),
        ("3", "System Architecture"),
        ("4", "User Assessment Flow"),
        ("5", "RAG-Based Course Recommendation Engine"),
        ("6", "Career Domain Filtering & Scoring"),
        ("7", "Skill-Gap Analysis Pipeline"),
        ("8", "Six-Stage Roadmap Generation"),
        ("9", "API Endpoints"),
        ("10", "Data Schemas & Storage"),
        ("11", "End-to-End Workflow Summary"),
        ("12", "Key Design Decisions & Assumptions"),
    ]
    for num, title in toc_items:
        story.append(Paragraph(f"<b>{num}.</b>  {title}", S["toc_entry"]))
    story.append(PageBreak())

    # ╔══════════════════════════════════════════╗
    # ║  SECTION 1 — Overview & Purpose          ║
    # ╚══════════════════════════════════════════╝
    section_header(story, S, "1", "Overview & Purpose")

    story.append(Paragraph(
        "The <b>Career Guide for Non-Traditional Learners</b> is a sub-system of the RP platform that helps "
        "Sri Lankan students who have not followed a conventional university path to discover suitable degree "
        "programmes and build a personalised career development roadmap.",
        S["body"]
    ))
    story.append(Paragraph(
        "The system is grounded in the recognition that many learners arrive with O-Level (Ordinary Level) or "
        "A-Level (Advanced Level) qualifications but without clear guidance on which tertiary programme best "
        "aligns with their academic background, language preference, financial constraints, and career ambitions. "
        "Artificial intelligence techniques — specifically Retrieval-Augmented Generation (RAG) and a multi-agent "
        "orchestration architecture — power the recommendation and roadmap engines.",
        S["body"]
    ))

    story.append(Paragraph("Core Goals", S["h2"]))
    bullet_list(story, S, [
        "Surface academically appropriate and financially feasible course options for non-traditional learners.",
        "Personalise recommendations using a rich multi-dimensional user profile.",
        "Identify skill gaps between the chosen course and the learner's target career.",
        "Produce a concrete, six-stage learning roadmap with actions, resources, and success criteria.",
        "Support multi-language learners (English, Sinhala, Tamil) and flexible study modes (Online / Onsite / Hybrid).",
    ])

    story.append(Paragraph("Target Users", S["h2"]))
    bullet_list(story, S, [
        "Students who passed O-Levels but did not sit A-Levels.",
        "Students who sat or completed A-Levels but are unsure of tertiary pathways.",
        "Mature students seeking career change or upskilling.",
        "Learners from lower-income households requiring scholarship-sensitive guidance.",
    ])

    story.append(PageBreak())

    # ╔══════════════════════════════════════════╗
    # ║  SECTION 2 — File & Module Inventory     ║
    # ╚══════════════════════════════════════════╝
    section_header(story, S, "2", "File & Module Inventory")

    story.append(Paragraph("2.1  Frontend Files (Next.js / React)", S["h2"]))
    flow_table(story,
        [Paragraph("<b>File Path</b>", S["body_left"]),
         Paragraph("<b>Role</b>", S["body_left"])],
        [
            [Paragraph("client/src/app/career-guide/page.tsx", S["code"]),
             Paragraph("Main landing page; composes all career-guide sub-components.", S["body_left"])],
            [Paragraph("client/src/components/career-guide/CareerGuideHeader.tsx", S["code"]),
             Paragraph("Animated gradient header with navigation links.", S["body_left"])],
            [Paragraph("client/src/components/career-guide/IntroductionSection.tsx", S["code"]),
             Paragraph("Static introductory copy about non-traditional pathways.", S["body_left"])],
            [Paragraph("client/src/components/career-guide/NextStepsSection.tsx", S["code"]),
             Paragraph("CTA section that opens AssessmentModal.", S["body_left"])],
            [Paragraph("client/src/components/career-guide/SuccessStories.tsx", S["code"]),
             Paragraph("Displays three real-world success story cards.", S["body_left"])],
            [Paragraph("client/src/components/career-guide/AssessmentModal.tsx", S["code"]),
             Paragraph("Modal that routes user to OLForm or ALForm based on qualification tier.", S["body_left"])],
            [Paragraph("client/src/components/career-guide/OLForm.tsx", S["code"]),
             Paragraph("14-field intake form for O-Level students.", S["body_left"])],
            [Paragraph("client/src/components/career-guide/ALForm.tsx", S["code"]),
             Paragraph("Extended intake form for A-Level students; includes stream & subject grades.", S["body_left"])],
            [Paragraph("client/src/components/ugc-course-recommender/CareerQuiz.tsx", S["code"]),
             Paragraph("12-question 1–5 rating quiz for supplementary career interest profiling.", S["body_left"])],
            [Paragraph("client/src/services/profile.service.ts", S["code"]),
             Paragraph("CRUD service for user profiles against the backend REST API.", S["body_left"])],
            [Paragraph("client/src/utils/userStorage.ts", S["code"]),
             Paragraph("localStorage helper; persists assessment data under key career_guide_user_data.", S["body_left"])],
            [Paragraph("client/src/types/profile.types.ts", S["code"]),
             Paragraph("TypeScript interfaces: ALProfile, CreateALProfileRequest, Recommendation.", S["body_left"])],
        ]
    )

    story.append(Paragraph("2.2  Backend Files (Python / FastAPI)", S["h2"]))
    flow_table(story,
        [Paragraph("<b>File Path</b>", S["body_left"]),
         Paragraph("<b>Role</b>", S["body_left"])],
        [
            [Paragraph("backend/api/routes/recommend.py", S["code"]),
             Paragraph("POST /recommend endpoint; calls orchestrator and maps results to schema.", S["body_left"])],
            [Paragraph("backend/api/routes/roadmap.py", S["code"]),
             Paragraph("POST /roadmap/generate & GET /roadmap/health endpoints.", S["body_left"])],
            [Paragraph("backend/api/schemas/recommendation.py", S["code"]),
             Paragraph("Pydantic models: UserProfile, RecommendationResult, RecommendationResponse.", S["body_left"])],
            [Paragraph("backend/api/schemas/roadmap.py", S["code"]),
             Paragraph("Pydantic models: CareerGoal enum (30+ values), RoadmapStep, RoadmapRequest/Response.", S["body_left"])],
            [Paragraph("backend/core/rag/retriever.py", S["code"]),
             Paragraph("RAG pipeline: build_user_profile(), generate_embedding(), rag_search().", S["body_left"])],
            [Paragraph("backend/core/rag/nomic_embedder.py", S["code"]),
             Paragraph("Wraps nomic-ai/nomic-embed-text-v1.5 for dense vector generation.", S["body_left"])],
            [Paragraph("backend/core/agents/orchestrator.py", S["code"]),
             Paragraph("Recommendation orchestrator: RAG + scoring + filtering → ranked list.", S["body_left"])],
            [Paragraph("backend/core/agents/career_intent.py", S["code"]),
             Paragraph("Maps career goals to allowed course domains; computes domain-mismatch penalty.", S["body_left"])],
            [Paragraph("backend/core/agents/career_path_agent.py", S["code"]),
             Paragraph("Stores validated skill requirements & journey steps for 20+ career paths.", S["body_left"])],
            [Paragraph("backend/core/agents/curriculum_agent.py", S["code"]),
             Paragraph("Parses course document to extract core skills, focus area, duration, languages.", S["body_left"])],
            [Paragraph("backend/core/agents/skill_gap_agent.py", S["code"]),
             Paragraph("Compares curriculum skills vs career requirements; identifies priority gaps.", S["body_left"])],
            [Paragraph("backend/core/agents/roadmap_planning_agent.py", S["code"]),
             Paragraph("Produces the six-stage personalised learning roadmap.", S["body_left"])],
            [Paragraph("backend/core/agents/roadmap_orchestrator.py", S["code"]),
             Paragraph("Coordinates Curriculum → CareerPath → SkillGap → RoadmapPlanning agents.", S["body_left"])],
        ]
    )

    story.append(Paragraph("2.3  Data Files", S["h2"]))
    flow_table(story,
        [Paragraph("<b>File Path</b>", S["body_left"]),
         Paragraph("<b>Description</b>", S["body_left"])],
        [
            [Paragraph("backend/data/raw/CourseData.json / .csv", S["code"]),
             Paragraph("Master course catalogue (~335 KB JSON); embedded into ChromaDB.", S["body_left"])],
            [Paragraph("backend/data/raw/Tech_Data_Cleaned.csv", S["code"]),
             Paragraph("Cleaned technology-focused course data for RAG index construction.", S["body_left"])],
            [Paragraph("backend/data/raw/Student Course & Career Path Survey…", S["code"]),
             Paragraph("Survey responses used for validation and demographic insights.", S["body_left"])],
            [Paragraph("backend/data/embeddings/chroma.sqlite3", S["code"]),
             Paragraph("ChromaDB persistent vector store for course embeddings.", S["body_left"])],
            [Paragraph("backend/data/rag_project/chroma_db/", S["code"]),
             Paragraph("Secondary ChromaDB instance (rag_project collection).", S["body_left"])],
        ]
    )

    story.append(PageBreak())

    # ╔══════════════════════════════════════════╗
    # ║  SECTION 3 — System Architecture         ║
    # ╚══════════════════════════════════════════╝
    section_header(story, S, "3", "System Architecture")

    story.append(Paragraph(
        "The system follows a <b>three-tier architecture</b>: a React/Next.js frontend, a FastAPI Python backend, "
        "and a vector-database persistence layer backed by ChromaDB.",
        S["body"]
    ))

    arch_data = [
        [Paragraph("<b>Tier</b>", S["body_left"]),
         Paragraph("<b>Technology</b>", S["body_left"]),
         Paragraph("<b>Responsibility</b>", S["body_left"])],
        ["Frontend", "Next.js 14, React, TypeScript, TailwindCSS",
         "User assessment intake, result display, roadmap visualisation"],
        ["Backend API", "FastAPI (Python 3.13), Pydantic v2",
         "Business logic, agent orchestration, REST endpoint exposure"],
        ["AI / RAG Layer", "nomic-embed-text-v1.5, ChromaDB",
         "Semantic vector search over course catalogue"],
        ["Agent Layer", "Pure Python classes",
         "Career intent, curriculum parsing, skill-gap analysis, roadmap planning"],
        ["Data Layer", "ChromaDB (SQLite + HNSW), JSON/CSV files",
         "Persistent vector index, raw course catalogue, survey data"],
    ]
    t = Table(arch_data, colWidths=[3.5 * cm, 5.5 * cm, 8 * cm], repeatRows=1)
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0, 0), (-1, 0), MID_BLUE),
        ("TEXTCOLOR",     (0, 0), (-1, 0), WHITE),
        ("FONTNAME",      (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE",      (0, 0), (-1, -1), 9),
        ("LEADING",       (0, 0), (-1, -1), 13),
        ("FONTNAME",      (0, 1), (-1, -1), "Helvetica"),
        ("VALIGN",        (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING",    (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LEFTPADDING",   (0, 0), (-1, -1), 7),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 7),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [WHITE, LIGHT_GREY]),
        ("GRID",          (0, 0), (-1, -1), 0.4, colors.HexColor("#CBD5E1")),
        ("TEXTCOLOR",     (0, 1), (-1, -1), DARK_GREY),
    ]))
    story.append(t)
    story.append(Spacer(1, 10))

    story.append(Paragraph("Component Interaction Diagram (Logical)", S["h2"]))
    diagram_code = (
        "Browser (Next.js)\n"
        "  └─ /career-guide page\n"
        "       ├─ CareerGuideHeader\n"
        "       ├─ IntroductionSection\n"
        "       ├─ NextStepsSection ──► AssessmentModal\n"
        "       │                            ├─ OLForm  ──► POST /api/profiles\n"
        "       │                            └─ ALForm  ──► POST /api/profiles\n"
        "       └─ SuccessStories\n\n"
        "FastAPI Backend\n"
        "  ├─ POST /recommend\n"
        "  │     └─ orchestrator.recommend_courses()\n"
        "  │           ├─ RAG retriever (Nomic + ChromaDB)\n"
        "  │           ├─ career_intent.infer_allowed_domains()\n"
        "  │           └─ Scoring & ranking\n"
        "  └─ POST /roadmap/generate\n"
        "        └─ RoadmapOrchestrator.generate_roadmap()\n"
        "              ├─ CurriculumAgent.analyze()\n"
        "              ├─ CareerPathAgent.infer()\n"
        "              ├─ SkillGapAgent.identify()\n"
        "              └─ RoadmapPlanningAgent.plan()"
    )
    story.append(Paragraph(diagram_code.replace("\n", "<br/>"), S["code"]))

    story.append(PageBreak())

    # ╔══════════════════════════════════════════╗
    # ║  SECTION 4 — User Assessment Flow        ║
    # ╚══════════════════════════════════════════╝
    section_header(story, S, "4", "User Assessment Flow")

    story.append(Paragraph(
        "The assessment flow is the entry point for the Career Guide. It gathers a rich multi-dimensional "
        "learner profile through a branched form workflow.",
        S["body"]
    ))

    story.append(Paragraph("4.1  Entry Point", S["h2"]))
    story.append(Paragraph(
        "The user lands on <b>/career-guide</b>. The page renders four components in sequence: "
        "CareerGuideHeader, IntroductionSection, SuccessStories, and NextStepsSection. "
        "Clicking <i>Get Started</i> in NextStepsSection opens the AssessmentModal.",
        S["body"]
    ))

    story.append(Paragraph("4.2  Qualification Tier Selection (AssessmentModal)", S["h2"]))
    story.append(Paragraph(
        "The modal presents two mutually exclusive options:",
        S["body"]
    ))
    bullet_list(story, S, [
        "Option A — 'O/L Passed Without A/L': Routes to OLForm.",
        "Option B — 'Sat A/L or With A/L Results': Routes to ALForm.",
    ])

    story.append(Paragraph("4.3  OLForm — O-Level Student Intake (14 Fields)", S["h2"]))
    flow_table(story,
        [Paragraph("<b>Field Group</b>", S["body_left"]),
         Paragraph("<b>Fields Collected</b>", S["body_left"])],
        [
            ["Personal Details",
             "Age, Gender, Native Language, Preferred Study Language"],
            ["Academic Results",
             "O/L grades: Mathematics, English, Science, ICT; IELTS score; Other qualifications"],
            ["Career & Preferences",
             "Interest area (7 domains), Career goal, Monthly family income, Funding method, Availability (weekday/weekend)"],
            ["Logistics",
             "Target completion period, Preferred study method (Online/Onsite/Hybrid), Current location, Preferred study locations"],
        ]
    )

    story.append(Paragraph("4.4  ALForm — A-Level Student Intake (14+ Fields)", S["h2"]))
    story.append(Paragraph(
        "The ALForm includes all OLForm fields plus additional A-Level specific inputs:",
        S["body"]
    ))
    bullet_list(story, S, [
        "A/L Stream: Bio Science, Physical Science, Commerce, Arts, Engineering Technology, Bio-systems Technology.",
        "A/L Subjects (3 required): dynamically rendered based on selected stream.",
        "A/L Subject Grades: grade per subject.",
    ])

    story.append(Paragraph("4.5  Form Submission & Data Persistence", S["h2"]))
    story.append(Paragraph(
        "On submission both forms:",
        S["body"]
    ))
    bullet_list(story, S, [
        "Call ProfileService.createProfile() → POST /api/profiles (backend persistence).",
        "Call userStorage.saveUserData() → localStorage under key 'career_guide_user_data'.",
        "Navigate to /course-suggestion, passing the profile for recommendation.",
    ])

    story.append(Paragraph("4.6  Supplementary Career Quiz (CareerQuiz)", S["h2"]))
    story.append(Paragraph(
        "A 12-question interest survey (1–5 star ratings) is available within the UGC Course Recommender sub-module. "
        "It measures interest intensity across 12 domains and can augment the assessment profile.",
        S["body"]
    ))
    flow_table(story,
        [Paragraph("<b>#</b>", S["body_left"]), Paragraph("<b>Domain</b>", S["body_left"])],
        [
            ["1", "Science & Technology"], ["2", "Healthcare"],
            ["3", "Design & Visual Creativity"], ["4", "Data Analysis & Numbers"],
            ["5", "Business & Entrepreneurship"], ["6", "Arts, Culture & Expression"],
            ["7", "Nature, Environment & Agriculture"], ["8", "Hands-on / Practical Work"],
            ["9", "Innovation & Research"], ["10", "People & Social Work"],
            ["11", "Urban / Corporate Environment"], ["12", "Flexible / Non-traditional Work"],
        ]
    )
    note_box(story, S,
             "The CareerQuiz ratings are not currently wired into the /recommend API call. "
             "The integration point exists but is marked for future implementation.")

    story.append(PageBreak())

    # ╔══════════════════════════════════════════╗
    # ║  SECTION 5 — RAG Recommendation Engine   ║
    # ╚══════════════════════════════════════════╝
    section_header(story, S, "5", "RAG-Based Course Recommendation Engine")

    story.append(Paragraph(
        "The recommendation engine uses <b>Retrieval-Augmented Generation (RAG)</b> to semantically match "
        "a learner's profile against a vector-indexed course catalogue.",
        S["body"]
    ))

    story.append(Paragraph("5.1  Vector Index Construction (Offline)", S["h2"]))
    story.append(Paragraph(
        "Before serving requests, an offline indexing script (<code>scripts/build_index.py</code>) processes "
        "CourseData.json and Tech_Data_Cleaned.csv:",
        S["body"]
    ))
    bullet_list(story, S, [
        "Each course document is serialised to a rich text representation.",
        "nomic-ai/nomic-embed-text-v1.5 generates a 768-dimensional normalised embedding per document.",
        "Embeddings and metadata are persisted in ChromaDB (HNSW index, SQLite metadata store).",
    ])

    story.append(Paragraph("5.2  Profile-to-Query Translation (build_user_profile)", S["h2"]))
    story.append(Paragraph(
        "At inference time the user's structured profile dictionary is converted to a <b>rich natural-language query</b> "
        "by build_user_profile() in retriever.py. The function injects all 15+ profile fields into a templated "
        "paragraph that guides the embedding model toward semantically meaningful vectors.",
        S["body"]
    ))
    story.append(Paragraph("Example profile text snippet:", S["h3"]))
    snippet = (
        "Provide course recommendations for a student with the following profile:\n"
        "  - Age: 22\n"
        "  - Native Language: Sinhala\n"
        "  - Preferred Study Language: English\n"
        "  - O/L Results: Mathematics-A, English-B, Science-B, ICT-A\n"
        "  - A/L Stream: Physical Science\n"
        "  - Career Goal: Software Engineer\n"
        "  - Monthly Family Income: LKR 50,000–100,000\n"
        "  - Study Method Preference: Online\n"
        "  ...\n"
        "The goal is to find the most academically suitable, financially suitable,\n"
        "and career-aligned degree courses."
    )
    story.append(Paragraph(snippet.replace("\n", "<br/>"), S["code"]))

    story.append(Paragraph("5.3  Semantic Retrieval (rag_search)", S["h2"]))
    bullet_list(story, S, [
        "generate_embedding() normalises the profile text and produces a query vector.",
        "ChromaDB HNSW search returns the top-k (default 25) closest course documents by cosine distance.",
        "Each result carries the course name, metadata dict, raw document text, and L2 distance score.",
    ])

    story.append(Paragraph("5.4  Scoring & Re-Ranking (orchestrator)", S["h2"]))
    story.append(Paragraph(
        "The recommendation orchestrator post-processes the raw RAG results through a multi-factor scoring pipeline:",
        S["body"]
    ))
    flow_table(story,
        [Paragraph("<b>Factor</b>", S["body_left"]),
         Paragraph("<b>Source</b>", S["body_left"]),
         Paragraph("<b>Effect on Score</b>", S["body_left"])],
        [
            ["Semantic similarity",     "ChromaDB distance",    "Base score (converted from L2 distance)"],
            ["Career domain match",     "career_intent.py",     "+boost if course domain aligns with career goal"],
            ["Domain mismatch penalty", "career_intent.py",     "–30 points if course domain conflicts with goal"],
            ["Language compatibility",  "User preferred_language vs. course Study Language",
             "Positive or neutral adjustment"],
            ["Study method match",      "User study_method vs. course Study Method",
             "Positive or neutral adjustment"],
            ["Financial filter",        "User income / funding vs. course Fees",
             "Filters out unaffordable courses pre-ranking"],
        ]
    )
    story.append(Paragraph(
        "After scoring, the top final_k (default 10) results are selected. "
        "The top explain_top_n (default 5) receive a natural-language explanation string.",
        S["body"]
    ))

    story.append(PageBreak())

    # ╔══════════════════════════════════════════╗
    # ║  SECTION 6 — Career Domain Filtering     ║
    # ╚══════════════════════════════════════════╝
    section_header(story, S, "6", "Career Domain Filtering & Scoring (career_intent.py)")

    story.append(Paragraph(
        "The CareerIntentClassifier ensures that recommended courses are <b>domain-compatible</b> with the "
        "student's stated career goal, preventing semantically close but career-irrelevant results.",
        S["body"]
    ))

    story.append(Paragraph("Key Data Structure — CAREER_DOMAIN_MAP", S["h2"]))
    story.append(Paragraph(
        "A dictionary maps each CareerGoal enum value to a list of allowed course domain keywords. Examples:",
        S["body"]
    ))
    flow_table(story,
        [Paragraph("<b>Career Goal</b>", S["body_left"]),
         Paragraph("<b>Allowed Domains (examples)</b>", S["body_left"])],
        [
            ["Software Engineer",       "Software Engineering, Computer Science, IT, Computing"],
            ["Data Scientist",          "Data Science, Statistics, Machine Learning, AI"],
            ["Mechanical Engineer",     "Mechanical Engineering, Manufacturing, Mechatronics"],
            ["Civil Engineer",          "Civil Engineering, Structural, Construction, Infrastructure"],
            ["Business Analyst",        "Business, Management, Commerce, Administration"],
            ["Teacher",                 "Education, Teaching, Pedagogy"],
            ["Doctor",                  "Medicine, Medical, Healthcare, MBBS"],
            ["Architect",               "Architecture, Urban Design, Interior Design"],
        ]
    )

    story.append(Paragraph("Functions", S["h2"]))
    bullet_list(story, S, [
        "infer_allowed_domains(career_goal) → list[str]: Returns the allowed domains for a goal.",
        "matches_career_domain(course_name, career_goal) → bool: Substring match of course name against allowed domains.",
        "get_domain_penalty(course_name, career_goal) → float: Returns 30.0 if domain mismatches, else 0.0.",
        "get_career_alignment_info(course_name, career_goal) → dict: Returns match flag and penalty metadata.",
    ])

    story.append(PageBreak())

    # ╔══════════════════════════════════════════╗
    # ║  SECTION 7 — Skill-Gap Analysis          ║
    # ╚══════════════════════════════════════════╝
    section_header(story, S, "7", "Skill-Gap Analysis Pipeline")

    story.append(Paragraph(
        "Once a student selects a recommended course, the skill-gap pipeline identifies which industry-required "
        "skills the course covers and which are missing.",
        S["body"]
    ))

    story.append(Paragraph("7.1  CurriculumAgent", S["h2"]))
    story.append(Paragraph(
        "Accepts a SelectedCourse object (name, department, description, curriculum list) and returns a "
        "CurriculumAnalysis:",
        S["body"]
    ))
    bullet_list(story, S, [
        "core_skills: list[str] — skills explicitly mentioned in the curriculum.",
        "focus_area: str — primary domain (e.g., 'Software Engineering').",
        "languages: list[str] — programming or human languages taught.",
        "duration_years: float — programme length.",
    ])

    story.append(Paragraph("7.2  CareerPathAgent", S["h2"]))
    story.append(Paragraph(
        "Looks up the CareerGoal enum in a hard-coded industry-validated dictionary of 20+ career paths. "
        "Returns a CareerRequirements object:",
        S["body"]
    ))
    bullet_list(story, S, [
        "required_skills: list[str] — must-have competencies.",
        "optional_skills: list[str] — nice-to-have competencies.",
        "role_description: str — concise job description.",
        "typical_journey: list[str] — 6–8 sequential career milestones.",
    ])

    story.append(Paragraph("7.3  SkillGapAgent", S["h2"]))
    story.append(Paragraph(
        "Compares CurriculumAnalysis.core_skills against CareerRequirements.required_skills using a "
        "fuzzy alias-based matching strategy:",
        S["body"]
    ))
    bullet_list(story, S, [
        "_match_skill(skill, curriculum_skills) → 'full' | 'partial' | 'none'.",
        "Alias dictionary maps variant names (e.g., 'OOP' ↔ 'Object-Oriented Programming').",
        "identify() returns a GapAnalysis: covered_skills, missing_skills, partial_skills, priority_gaps.",
        "_prioritize_gaps() orders missing skills by their position in required_skills (earlier = higher priority).",
        "get_gap_severity() → 'low' | 'medium' | 'high' based on proportion of missing required skills.",
    ])

    story.append(Paragraph("7.4  Gap Severity Thresholds", S["h2"]))
    flow_table(story,
        [Paragraph("<b>Severity</b>", S["body_left"]),
         Paragraph("<b>Condition</b>", S["body_left"]),
         Paragraph("<b>Action Recommended</b>", S["body_left"])],
        [
            ["Low",    "< 30% of required skills missing",  "Course largely sufficient; minor supplementation needed."],
            ["Medium", "30–60% missing",                    "Supplement with online courses or bootcamps."],
            ["High",   "> 60% missing",                     "Warning generated; learner advised to reconsider or heavily supplement."],
        ]
    )

    story.append(PageBreak())

    # ╔══════════════════════════════════════════╗
    # ║  SECTION 8 — Six-Stage Roadmap           ║
    # ╚══════════════════════════════════════════╝
    section_header(story, S, "8", "Six-Stage Roadmap Generation")

    story.append(Paragraph(
        "The RoadmapPlanningAgent produces a personalised <b>six-stage learning roadmap</b> by combining "
        "curriculum coverage, skill gaps, and career journey milestones.",
        S["body"]
    ))

    story.append(Paragraph("8.1  Stage Definitions", S["h2"]))
    flow_table(story,
        [Paragraph("<b>Stage</b>", S["body_left"]),
         Paragraph("<b>Name</b>", S["body_left"]),
         Paragraph("<b>Focus Key</b>", S["body_left"]),
         Paragraph("<b>Purpose</b>", S["body_left"])],
        [
            ["1", "Foundation Stage",         "fundamental_skills",           "Core prerequisites & foundational knowledge."],
            ["2", "Skill Development",        "core_technical_skills",        "Primary technical skill acquisition."],
            ["3", "Real-world Readiness",     "practical_application",        "Projects, internships, applied learning."],
            ["4", "Performance Strategies",   "optimization_and_best_practices", "Code quality, patterns, efficiency."],
            ["5", "Knowledge Expansion",      "advanced_topics",              "Specialisation & emerging technologies."],
            ["6", "Industry Polishing",       "job_readiness",                "Portfolio, interviews, certifications."],
        ]
    )

    story.append(Paragraph("8.2  Each Roadmap Step Contains", S["h2"]))
    bullet_list(story, S, [
        "stage_number: int (1–6)",
        "title: str — stage name.",
        "goal: str — what the learner should achieve.",
        "duration: str — recommended time investment (e.g., '3–4 months').",
        "description: str — narrative description.",
        "action_plan: list[str] — concrete tasks.",
        "resources: list[str] — tools, platforms, or references.",
        "success_criteria: list[str] — measurable indicators of stage completion.",
        "icon: str — frontend icon identifier.",
        "skills_covered: list[str] — skills addressed in this stage.",
    ])

    story.append(Paragraph("8.3  Personalisation Logic", S["h2"]))
    story.append(Paragraph(
        "The RoadmapPlanningAgent populates each stage by:",
        S["body"]
    ))
    bullet_list(story, S, [
        "Mapping gap_analysis.missing_skills to the relevant stage based on skill category.",
        "Incorporating career_requirements.typical_journey milestones into stage action plans.",
        "Adjusting stage duration based on curriculum.duration_years and existing coverage.",
        "Adding warnings to the response when gap count exceeds 5 or priority gaps are critical.",
    ])

    story.append(Paragraph("8.4  RoadmapOrchestrator — Execution Flow", S["h2"]))
    flow_table(story,
        [Paragraph("<b>Step</b>", S["body_left"]),
         Paragraph("<b>Agent Called</b>", S["body_left"]),
         Paragraph("<b>Output</b>", S["body_left"])],
        [
            ["1", "CurriculumAgent.analyze(selected_course)",
             "CurriculumAnalysis (skills, focus, duration)"],
            ["2", "CareerPathAgent.infer(career_goal, user_profile)",
             "CareerRequirements (required & optional skills, journey)"],
            ["3", "SkillGapAgent.identify(curriculum, requirements)",
             "GapAnalysis (covered, missing, partial, priority gaps)"],
            ["4", "RoadmapPlanningAgent.plan(all above)",
             "list[RoadmapStep] — 6 personalised stages"],
        ]
    )

    story.append(Paragraph("8.5  Response Metadata", S["h2"]))
    bullet_list(story, S, [
        "curriculum_focus — primary domain of the selected course.",
        "languages — languages taught.",
        "duration_years — programme length.",
        "skill_gaps_count — total missing required skills.",
        "gap_severity — 'low' / 'medium' / 'high'.",
        "priority_skills — top 3 skills the learner must acquire first.",
    ])

    story.append(PageBreak())

    # ╔══════════════════════════════════════════╗
    # ║  SECTION 9 — API Endpoints               ║
    # ╚══════════════════════════════════════════╝
    section_header(story, S, "9", "API Endpoints")

    story.append(Paragraph("9.1  POST /recommend", S["h2"]))
    info_table(story, [
        ["Method", "POST"],
        ["Path", "/recommend"],
        ["File", "backend/api/routes/recommend.py"],
        ["Input", "UserProfile (Pydantic model)"],
        ["Output", "RecommendationResponse: status, list[RecommendationResult], warnings, errors"],
        ["Process",
         "1. Converts profile to dict\n"
         "2. Calls orchestrator.recommend_courses(initial_k=25, final_k=10, explain_top_n=5)\n"
         "3. Maps raw results to RecommendationResult schema\n"
         "4. Extracts career_opportunities, study_language, study_method, fees from document text"],
    ])

    story.append(Paragraph("9.2  POST /roadmap/generate", S["h2"]))
    info_table(story, [
        ["Method", "POST"],
        ["Path", "/roadmap/generate"],
        ["File", "backend/api/routes/roadmap.py"],
        ["Input", "RoadmapRequest: user_profile, selected_course, career_goal"],
        ["Output",
         "RoadmapResponse: status, list[RoadmapStep], metadata dict, warnings, errors"],
        ["Process",
         "Delegates entirely to RoadmapOrchestrator.generate_roadmap()"],
    ])

    story.append(Paragraph("9.3  GET /roadmap/health", S["h2"]))
    info_table(story, [
        ["Method", "GET"],
        ["Path", "/roadmap/health"],
        ["Purpose", "Liveness check — returns status of all career guidance agents"],
    ])

    story.append(Paragraph("9.4  POST /api/profiles (Frontend Service)", S["h2"]))
    info_table(story, [
        ["Service", "client/src/services/profile.service.ts"],
        ["Endpoint", "POST /api/profiles"],
        ["Payload", "CreateALProfileRequest"],
        ["Purpose", "Persists complete assessment intake data in the backend database"],
    ])

    story.append(PageBreak())

    # ╔══════════════════════════════════════════╗
    # ║  SECTION 10 — Data Schemas & Storage     ║
    # ╚══════════════════════════════════════════╝
    section_header(story, S, "10", "Data Schemas & Storage")

    story.append(Paragraph("10.1  UserProfile (Pydantic — recommendation.py)", S["h2"]))
    bullet_list(story, S, [
        "age: int", "gender: str", "native_language: str", "preferred_language: str",
        "ol_results: dict  — subject → grade mapping",
        "al_stream: str | None", "al_results: dict | None",
        "other_qualifications: str | None", "ielts: float | None",
        "interest_area: str", "career_goal: str",
        "income: str  — monthly family income range",
        "funding_method: str  — Self-funded / Scholarship",
        "availability: str  — Weekdays / Weekends / Both",
        "completion_period: str  — e.g., '2 years'",
        "study_method: str  — Online / Onsite / Hybrid",
        "current_location: str", "preferred_locations: list[str]",
    ])

    story.append(Paragraph("10.2  CareerGoal Enum (roadmap.py — 30+ values)", S["h2"]))
    story.append(Paragraph(
        "The enum defines all supported career targets. A representative subset:",
        S["body"]
    ))
    goal_rows = [
        ["SOFTWARE_ENGINEER", "DATA_ENGINEER", "FULL_STACK_DEVELOPER", "DEVOPS_ENGINEER"],
        ["ML_ENGINEER", "DATA_SCIENTIST", "BUSINESS_ANALYST", "PROJECT_MANAGER"],
        ["CIVIL_ENGINEER", "MECHANICAL_ENGINEER", "ELECTRICAL_ENGINEER", "CHEMICAL_ENGINEER"],
        ["INDUSTRIAL_ENGINEER", "NURSE", "PHARMACIST", "TEACHER"],
        ["GRAPHIC_DESIGNER", "UI_UX_DESIGNER", "MARKETING_MANAGER", "ENVIRONMENTAL_SCIENTIST"],
        ["NETWORK_ENGINEER", "COMPUTER_ENGINEER", "ARCHITECT", "AGRICULTURAL_ENGINEER", "OTHER"],
    ]
    for row in goal_rows:
        story.append(Paragraph("  •  " + "     •  ".join(row), S["bullet"]))
    story.append(Spacer(1, 8))

    story.append(Paragraph("10.3  ALProfile (TypeScript — profile.types.ts)", S["h2"]))
    bullet_list(story, S, [
        "Mirrors UserProfile but stored client-side.",
        "qualificationType: 'OL' | 'AL'",
        "Includes nested recommendation: Recommendation[] for persisting prior results.",
    ])

    story.append(Paragraph("10.4  Local Storage", S["h2"]))
    info_table(story, [
        ["Storage key",  "career_guide_user_data"],
        ["Set by",       "userStorage.saveUserData() on form submission"],
        ["Read by",      "Course suggestion page on mount to pre-populate recommendation request"],
        ["Cleared by",   "userStorage.clearUserData() (manual or on logout)"],
    ])

    story.append(PageBreak())

    # ╔══════════════════════════════════════════╗
    # ║  SECTION 11 — End-to-End Workflow        ║
    # ╚══════════════════════════════════════════╝
    section_header(story, S, "11", "End-to-End Workflow Summary")

    steps = [
        ("Step 1", "Landing",
         "User visits /career-guide. Reads introduction and success stories."),
        ("Step 2", "Qualification Branching",
         "Clicks 'Get Started' → AssessmentModal appears → selects OL or AL tier."),
        ("Step 3", "Profile Intake",
         "Fills 14+ field form (OLForm or ALForm). Submits."),
        ("Step 4", "Profile Persistence",
         "ProfileService.createProfile() POSTs to /api/profiles. "
         "userStorage.saveUserData() writes to localStorage."),
        ("Step 5", "Course Recommendation",
         "Browser navigates to /course-suggestion. "
         "UserProfile is POSTed to /recommend. "
         "RAG retrieval fetches top-25 courses. "
         "Scoring pipeline applies career domain boost/penalty. "
         "Top 10 ranked courses returned with explanations."),
        ("Step 6", "Course Selection",
         "User reviews ranked recommendations (name, match score, career opportunities, fees, language, method). "
         "Selects one course."),
        ("Step 7", "Roadmap Request",
         "Frontend POSTs selected_course + user_profile + career_goal to /roadmap/generate."),
        ("Step 8", "Roadmap Orchestration",
         "RoadmapOrchestrator sequences four agents: "
         "CurriculumAgent → CareerPathAgent → SkillGapAgent → RoadmapPlanningAgent."),
        ("Step 9", "Roadmap Delivery",
         "Six-stage roadmap returned. Each stage has goal, duration, action plan, resources, success criteria."),
        ("Step 10", "Roadmap Display",
         "Frontend renders interactive six-stage roadmap. "
         "Warnings shown if skill gaps are severe. "
         "Priority skills highlighted."),
    ]

    for label, title, desc in steps:
        data = [[
            Paragraph(f"<b>{label}</b>", ParagraphStyle("sl", parent=S["body_left"], textColor=WHITE, fontName="Helvetica-Bold", fontSize=9)),
            Paragraph(f"<b>{title}</b>", ParagraphStyle("st", parent=S["body_left"], textColor=WHITE, fontName="Helvetica-Bold", fontSize=9)),
            Paragraph(desc, ParagraphStyle("sd", parent=S["body_left"], textColor=DARK_GREY, fontSize=9, leading=13)),
        ]]
        t = Table(data, colWidths=[2.2 * cm, 3.5 * cm, 11.3 * cm])
        t.setStyle(TableStyle([
            ("BACKGROUND",    (0, 0), (1, 0), MID_BLUE),
            ("BACKGROUND",    (2, 0), (2, 0), WHITE),
            ("TOPPADDING",    (0, 0), (-1, -1), 5),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
            ("LEFTPADDING",   (0, 0), (-1, -1), 7),
            ("RIGHTPADDING",  (0, 0), (-1, -1), 7),
            ("VALIGN",        (0, 0), (-1, -1), "TOP"),
            ("BOX",           (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
        ]))
        story.append(t)
        story.append(Spacer(1, 3))

    story.append(PageBreak())

    # ╔══════════════════════════════════════════╗
    # ║  SECTION 12 — Assumptions                ║
    # ╚══════════════════════════════════════════╝
    section_header(story, S, "12", "Key Design Decisions & Assumptions")

    story.append(Paragraph("12.1  Stated Assumptions", S["h2"]))
    assumptions = [
        ("A1", "Qualification scope",
         "The system currently supports two qualification tiers: O-Level only and A-Level (with or without results). "
         "Vocational qualifications (NVQ, TVEC) and foreign qualifications are captured under 'Other Qualifications' "
         "but are not separately scored."),
        ("A2", "Career goal coverage",
         "The CareerPathAgent contains hard-coded skill maps for 20+ career goals. Goals outside this set fall back "
         "to the generic 'OTHER' profile, which uses broadly applicable transferable skills."),
        ("A3", "CareerQuiz integration",
         "The 12-question interest quiz in CareerQuiz.tsx is rendered in the UGC Course Recommender sub-module. "
         "Its output is not currently passed to the /recommend endpoint; it is available as a UI feature for "
         "self-reflection purposes only."),
        ("A4", "Embedding model",
         "nomic-ai/nomic-embed-text-v1.5 is run locally (CPU or GPU). The quality of semantic matching is bounded "
         "by this model's capabilities. The course index must be rebuilt (scripts/build_index.py) after any "
         "catalogue update."),
        ("A5", "Financial filtering",
         "Income ranges and course fees are compared as string categories, not numeric values. "
         "Precise fee comparison would require structured fee data in the catalogue."),
        ("A6", "Language of instruction",
         "The preferred_language field is matched against the course's Study Language field using substring search. "
         "Mixed-medium courses may not always match cleanly."),
        ("A7", "Roadmap personalisation depth",
         "The RoadmapPlanningAgent uses the gap analysis and career journey data to customise stage content. "
         "It does not call an external LLM by default (llm_client=None); LLM-enhanced generation is an optional "
         "extension path."),
        ("A8", "Geographic scope",
         "Course locations and student preferred locations are Sri Lanka–specific. "
         "The system assumes local (LKR) currency for fee comparisons."),
    ]
    for code, title, desc in assumptions:
        story.append(Paragraph(f"<b>[{code}] {title}</b>", S["h3"]))
        story.append(Paragraph(desc, S["body"]))
        story.append(Spacer(1, 4))

    story.append(Paragraph("12.2  Key Design Decisions", S["h2"]))
    decisions = [
        "RAG over keyword search: Semantic embedding allows the engine to surface courses with relevant content "
        "even when exact keywords differ (e.g., 'BSc in Computing' for a 'Software Engineer' goal).",
        "Domain penalty (–30 pts) rather than hard exclusion: Allows edge cases (e.g., a Business & IT double-major) "
        "to still surface while pushing clearly misaligned results to the bottom.",
        "Hard-coded career skill maps: Provides consistent, auditable baseline requirements without LLM variability. "
        "The maps are based on industry standards and can be updated without retraining.",
        "Six-stage roadmap structure: Mirrors common apprenticeship/bootcamp pedagogy (Foundation → Skill Build → "
        "Practice → Optimise → Expand → Polish), giving learners a predictable progression framework.",
        "Dual persistence (backend DB + localStorage): Supports offline-first continuation and reduces latency "
        "on the /course-suggestion page by avoiding a blocking profile fetch.",
        "Qualification branching at intake: Separates O-Level and A-Level forms to avoid presenting irrelevant "
        "fields (A/L stream, subject grades) to O-Level students, reducing cognitive load.",
    ]
    for i, d in enumerate(decisions, 1):
        story.append(Paragraph(f"D{i}.  {d}", S["bullet"]))
    story.append(Spacer(1, 10))

    hr(story, color=ACCENT_BLUE, thickness=1.5)
    story.append(Spacer(1, 6))
    story.append(Paragraph(
        f"End of Document  ·  Generated {today}  ·  RP Platform  ·  Career Guide for Non-Traditional Learners",
        S["caption"]
    ))

    # ── Build PDF ────────────────────────────────
    doc.build(
        story,
        onFirstPage=on_first_page,
        onLaterPages=on_page,
    )
    print(f"[OK] PDF saved to: {OUTPUT_PATH}")


if __name__ == "__main__":
    build_document()
