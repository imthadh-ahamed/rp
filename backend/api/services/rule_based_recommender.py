"""
Rule-based UGC course recommendation engine.
No ML models — uses stream eligibility, Z-score, island rank, and Q-score bias.
"""

from api.schemas.prediction import StudentProfileRequest, CourseRecommendation

# ─── Stream Eligibility Map ────────────────────────────────────────────────────
STREAM_ELIGIBILITY: dict[str, list[tuple[str, str, str, str]]] = {
    "Arts": [
        ("Arts", "019A", "University of Colombo", "No"),
        ("Arts", "019B", "University of Peradeniya", "No"),
        ("Arts", "019C", "University of Sri Jayewardenepura", "No"),
        ("Arts", "019D", "University of Kelaniya", "No"),
        ("Arts", "019E", "University of Jaffna", "No"),
        ("Arts", "019F", "University of Ruhuna", "No"),
        ("Arts", "019H", "Eastern University, Sri Lanka", "No"),
        ("Arts", "019J", "South Eastern University of Sri Lanka", "No"),
        ("Arts", "019K", "Rajarata University of Sri Lanka", "No"),
        ("Arts (SP) - Mass Media", "020S", "Sripalee Campus, University of Colombo", "Yes"),
        ("Arts (SP) - Performing Arts", "041S", "Sripalee Campus, University of Colombo", "Yes"),
        ("Arts (SAB)", "021L", "Sabaragamuwa University of Sri Lanka", "No"),
        ("Communication Studies", "029W", "Trincomalee Campus, Eastern University", "No"),
        ("Peace & Conflict Resolution", "031D", "University of Kelaniya", "No"),
        ("Islamic Studies", "063J", "South Eastern University of Sri Lanka", "No"),
        ("Arabic Language", "084J", "South Eastern University of Sri Lanka", "No"),
        ("Teaching English as a Second Language (TESL)", "105C", "University of Sri Jayewardenepura", "No"),
        ("Teaching English as a Second Language (TESL)", "105D", "University of Kelaniya", "No"),
        ("Teaching English as a Second Language (TESL)", "105L", "Sabaragamuwa University of Sri Lanka", "No"),
        ("Social Work", "112B", "University of Peradeniya", "No"),
        ("Social Work", "112C", "University of Sri Jayewardenepura", "No"),
        ("Arts - Information Technology", "128C", "University of Sri Jayewardenepura", "No"),
    ],
    "Commerce": [
        ("Management", "016A", "University of Colombo", "No"),
        ("Management", "016B", "University of Peradeniya", "No"),
        ("Management", "016C", "University of Sri Jayewardenepura", "No"),
        ("Management", "016D", "University of Kelaniya", "No"),
        ("Management", "016E", "University of Jaffna", "No"),
        ("Management", "016F", "University of Ruhuna", "No"),
        ("Management", "016H", "Eastern University", "No"),
        ("Management", "016J", "South Eastern University", "No"),
        ("Management", "016K", "Rajarata University", "No"),
        ("Management", "016L", "Sabaragamuwa University", "No"),
        ("Management", "016M", "Wayamba University", "No"),
        ("Management and Public Policy", "028C", "University of Sri Jayewardenepura", "No"),
        ("Real Estate Management and Valuation", "017C", "University of Sri Jayewardenepura", "No"),
        ("Commerce", "018C", "University of Sri Jayewardenepura", "No"),
        ("Commerce", "018D", "University of Kelaniya", "No"),
        ("Commerce", "018E", "University of Jaffna", "No"),
        ("Commerce", "018H", "Eastern University", "No"),
        ("Commerce", "018J", "South Eastern University", "No"),
        ("Management Studies (TV)", "022W", "Trincomalee Campus", "No"),
        ("Management Studies (TV)", "022R", "University of Vavuniya", "No"),
        ("Business Information Systems (Honours) (BIS)", "077C", "University of Sri Jayewardenepura", "No"),
        ("Accounting Information Systems", "127D", "University of Kelaniya", "No"),
        ("Banking and Insurance", "133R", "University of Vavuniya", "No"),
        ("Service Management", "140P", "Gampaha Wickramarachchi University", "No"),
    ],
    "Biological Science": [
        ("Medicine", "001A", "University of Colombo", "No"),
        ("Medicine", "001B", "University of Peradeniya", "No"),
        ("Medicine", "001C", "University of Sri Jayewardenepura", "No"),
        ("Medicine", "001D", "University of Kelaniya", "No"),
        ("Medicine", "001E", "University of Jaffna", "No"),
        ("Medicine", "001F", "University of Ruhuna", "No"),
        ("Medicine", "001G", "University of Moratuwa", "No"),
        ("Medicine", "001H", "Eastern University", "No"),
        ("Medicine", "001K", "Rajarata University", "No"),
        ("Medicine", "001L", "Sabaragamuwa University", "No"),
        ("Medicine", "001M", "Wayamba University", "No"),
        ("Medicine", "001U", "Uva Wellassa University", "No"),
        ("Dental Surgery", "002B", "University of Peradeniya", "No"),
        ("Dental Surgery", "002C", "University of Sri Jayewardenepura", "No"),
        ("Veterinary Science", "003B", "University of Peradeniya", "No"),
        ("Agriculture", "004E", "University of Jaffna", "No"),
        ("Agriculture", "004H", "Eastern University", "No"),
        ("Agriculture", "004K", "Rajarata University", "No"),
        ("Agriculture", "004L", "Sabaragamuwa University", "No"),
        ("Agriculture", "004M", "Wayamba University", "No"),
        ("Food Science & Nutrition", "005M", "Wayamba University", "No"),
        ("Biological Science", "006A", "University of Colombo", "No"),
        ("Biological Science", "006B", "University of Peradeniya", "No"),
        ("Biological Science", "006C", "University of Sri Jayewardenepura", "No"),
        ("Biological Science", "006D", "University of Kelaniya", "No"),
        ("Biological Science", "006E", "University of Jaffna", "No"),
        ("Biological Science", "006F", "University of Ruhuna", "No"),
        ("Biological Science", "006H", "Eastern University", "No"),
        ("Biological Science", "006J", "South Eastern University", "No"),
        ("Applied Sciences (Biological Sc.)", "007K", "Rajarata University", "No"),
        ("Applied Sciences (Biological Sc.)", "007L", "Sabaragamuwa University", "No"),
        ("Applied Sciences (Biological Sc.)", "007R", "University of Vavuniya", "No"),
        ("Ayurveda Medicine and Surgery", "032A", "University of Colombo", "No"),
        ("Ayurveda Medicine and Surgery", "032P", "Gampaha Wickramarachchi University", "No"),
        ("Unani Medicine and Surgery", "033A", "University of Colombo", "No"),
        ("Siddha Medicine and Surgery", "036E", "University of Jaffna", "No"),
        ("Siddha Medicine and Surgery", "036W", "Trincomalee Campus", "No"),
        ("Nursing", "037A", "University of Colombo", "No"),
        ("Nursing", "037B", "University of Peradeniya", "No"),
        ("Nursing", "037C", "University of Sri Jayewardenepura", "No"),
        ("Nursing", "037E", "University of Jaffna", "No"),
        ("Nursing", "037F", "University of Ruhuna", "No"),
        ("Nursing", "037H", "Eastern University", "No"),
        ("Pharmacy", "051B", "University of Peradeniya", "No"),
        ("Pharmacy", "051C", "University of Sri Jayewardenepura", "No"),
        ("Pharmacy", "051E", "University of Jaffna", "No"),
        ("Pharmacy", "051F", "University of Ruhuna", "No"),
        ("Medical Laboratory Sciences", "052B", "University of Peradeniya", "No"),
        ("Medical Laboratory Sciences", "052C", "University of Sri Jayewardenepura", "No"),
        ("Medical Laboratory Sciences", "052E", "University of Jaffna", "No"),
        ("Medical Laboratory Sciences", "052F", "University of Ruhuna", "No"),
        ("Radiography", "053B", "University of Peradeniya", "No"),
        ("Physiotherapy", "054A", "University of Colombo", "No"),
        ("Physiotherapy", "054B", "University of Peradeniya", "No"),
        ("Health Promotion", "050K", "Rajarata University", "No"),
    ],
    "Physical Science": [
        ("Engineering", "008B", "University of Peradeniya", "No"),
        ("Engineering", "008C", "University of Sri Jayewardenepura", "No"),
        ("Engineering", "008E", "University of Jaffna", "No"),
        ("Engineering", "008F", "University of Ruhuna", "No"),
        ("Engineering", "008G", "University of Moratuwa", "No"),
        ("Engineering", "008J", "South Eastern University", "No"),
        ("Engineering (EM)", "009G", "University of Moratuwa", "No"),
        ("Engineering (TM)", "010G", "University of Moratuwa", "No"),
        ("Quantity Surveying", "011G", "University of Moratuwa", "No"),
        ("Computer Science", "012C", "University of Sri Jayewardenepura", "No"),
        ("Computer Science", "012D", "University of Kelaniya", "No"),
        ("Computer Science", "012E", "University of Jaffna", "No"),
        ("Computer Science", "012F", "University of Ruhuna", "No"),
        ("Computer Science", "012T", "University of Colombo School of Computing", "No"),
        ("Computer Science", "012W", "Trincomalee Campus", "No"),
        ("Physical Science", "013A", "University of Colombo", "No"),
        ("Physical Science", "013B", "University of Peradeniya", "No"),
        ("Physical Science", "013C", "University of Sri Jayewardenepura", "No"),
        ("Physical Science", "013D", "University of Kelaniya", "No"),
        ("Physical Science", "013E", "University of Jaffna", "No"),
        ("Physical Science", "013F", "University of Ruhuna", "No"),
        ("Physical Science", "013H", "Eastern University", "No"),
        ("Physical Science", "013J", "South Eastern University", "No"),
        ("Surveying Science", "014L", "Sabaragamuwa University", "No"),
        ("Applied Sciences (Physical Sc.)", "015K", "Rajarata University", "No"),
        ("Applied Sciences (Physical Sc.)", "015L", "Sabaragamuwa University", "No"),
        ("Applied Sciences (Physical Sc.)", "015M", "Wayamba University", "No"),
        ("Applied Sciences (Physical Sc.)", "015R", "University of Vavuniya", "No"),
        ("Applied Sciences (Physical Sc.)", "015W", "Trincomalee Campus", "No"),
    ],
    "Engineering Technology": [
        ("Engineering Technology (ET)", "102A", "University of Colombo", "No"),
        ("Engineering Technology (ET)", "102C", "University of Sri Jayewardenepura", "No"),
        ("Engineering Technology (ET)", "102D", "University of Kelaniya", "No"),
        ("Engineering Technology (ET)", "102E", "University of Jaffna", "No"),
        ("Engineering Technology (ET)", "102F", "University of Ruhuna", "No"),
        ("Engineering Technology (ET)", "102K", "Rajarata University", "No"),
        ("Engineering Technology (ET)", "102L", "Sabaragamuwa University", "No"),
        ("Engineering Technology (ET)", "102M", "Wayamba University", "No"),
        ("Engineering Technology (ET)", "102U", "Uva Wellassa University", "No"),
    ],
    "Biosystems Technology": [
        ("Biosystems Technology (BST)", "103A", "University of Colombo", "No"),
        ("Biosystems Technology (BST)", "103C", "University of Sri Jayewardenepura", "No"),
        ("Biosystems Technology (BST)", "103D", "University of Kelaniya", "No"),
        ("Biosystems Technology (BST)", "103E", "University of Jaffna", "No"),
        ("Biosystems Technology (BST)", "103F", "University of Ruhuna", "No"),
        ("Biosystems Technology (BST)", "103H", "Eastern University", "No"),
        ("Biosystems Technology (BST)", "103J", "South Eastern University", "No"),
        ("Biosystems Technology (BST)", "103K", "Rajarata University", "No"),
        ("Biosystems Technology (BST)", "103L", "Sabaragamuwa University", "No"),
        ("Biosystems Technology (BST)", "103M", "Wayamba University", "No"),
        ("Biosystems Technology (BST)", "103U", "Uva Wellassa University", "No"),
    ],
    "Common / Multi-Stream": [
        ("Information Technology (IT)", "026G", "University of Moratuwa", "No"),
        ("Management and Information Technology (MIT)", "027D", "University of Kelaniya", "No"),
        ("Quantity Surveying", "011G", "University of Moratuwa", "No"),
        ("Surveying Science", "014L", "Sabaragamuwa University", "No"),
        ("Urban Informatics and Planning", "030G", "University of Moratuwa", "No"),
        ("Architecture", "023G", "University of Moratuwa", "Yes"),
        ("Fashion Design & Product Development", "034G", "University of Moratuwa", "Yes"),
        ("Landscape Architecture", "097G", "University of Moratuwa", "Yes"),
        ("Design", "024G", "University of Moratuwa", "Yes"),
        ("Law", "025A", "University of Colombo", "Yes"),
        ("Law", "025B", "University of Peradeniya", "Yes"),
        ("Law", "025E", "University of Jaffna", "Yes"),
        ("Facilities Management", "056G", "University of Moratuwa", "No"),
        ("Management and Information Technology (SEUSL)", "079J", "South Eastern University", "No"),
        ("Science and Technology", "064U", "Uva Wellassa University", "No"),
        ("Computer Science & Technology", "065U", "Uva Wellassa University", "No"),
        ("Entrepreneurship and Management", "066U", "Uva Wellassa University", "No"),
        ("Industrial Information Technology", "075U", "Uva Wellassa University", "No"),
        ("Mineral Resources and Technology", "076U", "Uva Wellassa University", "No"),
        ("Hospitality, Tourism and Events Management", "090U", "Uva Wellassa University", "No"),
        ("Physical Education", "081E", "University of Jaffna", "Yes"),
        ("Physical Education", "081L", "Sabaragamuwa University", "Yes"),
        ("Sports Science & Management", "082C", "University of Sri Jayewardenepura", "Yes"),
        ("Sports Science & Management", "082D", "University of Kelaniya", "Yes"),
        ("Sports Science & Management", "082L", "Sabaragamuwa University", "Yes"),
        ("Information Technology & Management", "091G", "University of Moratuwa", "No"),
        ("Tourism & Hospitality Management", "092K", "Rajarata University", "No"),
        ("Tourism & Hospitality Management", "092L", "Sabaragamuwa University", "No"),
        ("Agricultural Resource Management and Technology", "093F", "University of Ruhuna", "No"),
        ("Agribusiness Management", "094F", "University of Ruhuna", "No"),
        ("Green Technology", "095F", "University of Ruhuna", "No"),
        ("Information Systems", "096C", "University of Sri Jayewardenepura", "No"),
        ("Information Systems", "096L", "Sabaragamuwa University", "No"),
        ("Information Systems", "096T", "UCSC", "No"),
        ("Translation Studies", "098D", "University of Kelaniya", "No"),
        ("Translation Studies", "098E", "University of Jaffna", "No"),
        ("Translation Studies", "098H", "Eastern University", "No"),
        ("Translation Studies", "098L", "Sabaragamuwa University", "No"),
        ("Software Engineering", "099C", "University of Sri Jayewardenepura", "No"),
        ("Software Engineering", "099D", "University of Kelaniya", "No"),
        ("Software Engineering", "099L", "Sabaragamuwa University", "No"),
        ("Film & Television Studies", "100D", "University of Kelaniya", "Yes"),
        ("Project Management", "101R", "University of Vavuniya", "No"),
        ("Data Science", "136L", "Sabaragamuwa University", "No"),
        ("Primary Education", "137A", "University of Colombo", "No"),
        ("Medical Imaging Technology", "138A", "University of Colombo", "No"),
        ("Polymer Science and Industrial Management", "139C", "University of Sri Jayewardenepura", "No"),
        ("Service Management", "140P", "Gampaha Wickramarachchi University", "No"),
    ],
}

# ─── Prestige & Demand Weights ────────────────────────────────────────────────
UNIVERSITY_PRESTIGE: dict[str, float] = {
    "University of Colombo": 1.0,
    "University of Peradeniya": 0.98,
    "University of Moratuwa": 0.97,
    "University of Sri Jayewardenepura": 0.95,
    "University of Kelaniya": 0.92,
    "University of Jaffna": 0.88,
    "University of Ruhuna": 0.87,
    "Eastern University": 0.85,
    "South Eastern University": 0.83,
    "Rajarata University": 0.82,
    "Sabaragamuwa University": 0.81,
    "Wayamba University": 0.80,
    "Uva Wellassa University": 0.79,
    "Gampaha Wickramarachchi University": 0.78,
    "UCSC": 0.90,
    "Trincomalee Campus": 0.75,
    "University of Vavuniya": 0.74,
    "Sripalee Campus, University of Colombo": 0.76,
    "Swamy Vipulananda Institute": 0.77,
}

COURSE_DEMAND: dict[str, float] = {
    "Medicine": 1.0,
    "Dental Surgery": 0.99,
    "Engineering": 0.98,
    "Computer Science": 0.97,
    "Software Engineering": 0.96,
    "Information Technology": 0.95,
    "Pharmacy": 0.94,
    "Nursing": 0.93,
    "Physiotherapy": 0.92,
    "Quantity Surveying": 0.91,
    "Management": 0.90,
    "Accountancy": 0.89,
    "Architecture": 0.88,
    "Law": 0.87,
    "Biological Science": 0.86,
    "Physical Science": 0.85,
    "Arts": 0.84,
    "Commerce": 0.83,
    "Engineering Technology": 0.82,
    "Biosystems Technology": 0.81,
}
DEFAULT_DEMAND = 0.70

# ─── Q-Score stream importance weights ────────────────────────────────────────
STREAM_Q_IMPORTANCE: dict[str, dict[str, float]] = {
    "Physical Science": {
        "q1_science_tech": 1.0, "q4_data": 0.9, "q8_hands_on": 0.8, "q9_innovation": 0.8,
        "q2_healthcare": 0.3, "q3_design": 0.4, "q5_business": 0.3, "q6_arts_culture": 0.1,
        "q7_nature_env": 0.3, "q10_people_social": 0.2, "q11_urban_corporate": 0.4, "q12_flexible_path": 0.5,
    },
    "Biological Science": {
        "q2_healthcare": 1.0, "q7_nature_env": 0.9, "q10_people_social": 0.7, "q1_science_tech": 0.6,
        "q4_data": 0.4, "q8_hands_on": 0.5, "q3_design": 0.2, "q5_business": 0.2, "q6_arts_culture": 0.1,
        "q9_innovation": 0.5, "q11_urban_corporate": 0.2, "q12_flexible_path": 0.3,
    },
    "Commerce": {
        "q5_business": 1.0, "q4_data": 0.9, "q11_urban_corporate": 0.8, "q10_people_social": 0.7,
        "q12_flexible_path": 0.6, "q1_science_tech": 0.3, "q2_healthcare": 0.2, "q3_design": 0.4,
        "q6_arts_culture": 0.3, "q7_nature_env": 0.2, "q8_hands_on": 0.3, "q9_innovation": 0.5,
    },
    "Arts": {
        "q6_arts_culture": 1.0, "q3_design": 0.9, "q10_people_social": 0.8, "q12_flexible_path": 0.7,
        "q1_science_tech": 0.2, "q2_healthcare": 0.2, "q4_data": 0.3, "q5_business": 0.3,
        "q7_nature_env": 0.4, "q8_hands_on": 0.5, "q9_innovation": 0.6, "q11_urban_corporate": 0.4,
    },
    "Engineering Technology": {
        "q1_science_tech": 1.0, "q8_hands_on": 0.9, "q9_innovation": 0.8, "q4_data": 0.7, "q3_design": 0.6,
        "q2_healthcare": 0.3, "q5_business": 0.4, "q6_arts_culture": 0.2, "q7_nature_env": 0.4,
        "q10_people_social": 0.3, "q11_urban_corporate": 0.5, "q12_flexible_path": 0.5,
    },
    "Biosystems Technology": {
        "q7_nature_env": 1.0, "q2_healthcare": 0.8, "q1_science_tech": 0.7, "q8_hands_on": 0.6,
        "q3_design": 0.4, "q4_data": 0.4, "q5_business": 0.3, "q6_arts_culture": 0.2, "q9_innovation": 0.5,
        "q10_people_social": 0.4, "q11_urban_corporate": 0.3, "q12_flexible_path": 0.4,
    },
}


# ─── Scoring helpers ──────────────────────────────────────────────────────────

def _q_bias(stream: str, q_scores: dict[str, float]) -> float:
    weights = STREAM_Q_IMPORTANCE.get(stream)
    if not weights:
        return 1.0
    total_score = total_weight = 0.0
    for q, w in weights.items():
        if q in q_scores:
            total_score += q_scores[q] * w
            total_weight += w
    if total_weight == 0:
        return 1.0
    return 0.8 + (total_score / total_weight) / 25.0


def _score(course_name: str, university: str, z_score: float, rank: float,
           q_scores: dict[str, float], stream: str) -> float:
    z_factor = min(1.0, z_score / 4.0)
    rank_factor = max(0.5, 1.0 - rank / 5000.0)
    perf = (z_factor * 0.6 + rank_factor * 0.4) * 0.30

    uni_up = university.upper()
    prestige = 0.70
    for name, p in UNIVERSITY_PRESTIGE.items():
        if name.upper() in uni_up or uni_up in name.upper():
            prestige = p
            break
    prest = prestige * 0.25

    course_up = course_name.upper()
    demand = DEFAULT_DEMAND
    for name, d in COURSE_DEMAND.items():
        if name.upper() in course_up or course_up in name.upper():
            demand = d
            break
    dem = demand * 0.25

    q_part = _q_bias(stream, q_scores) * 0.20
    return perf + prest + dem + q_part


# ─── Public API ───────────────────────────────────────────────────────────────

def recommend(req: StudentProfileRequest, top_n: int = 10, diversity: bool = True) -> list[CourseRecommendation]:
    """
    Rule-based course recommendation.

    Parameters
    ----------
    req       : validated StudentProfileRequest
    top_n     : number of recommendations (clipped to 0–30)
    diversity : if True, max 2 courses per university

    Returns
    -------
    list of CourseRecommendation
    """
    top_n = max(0, min(30, top_n))
    if top_n == 0:
        return []

    stream = req.Stream
    eligible = STREAM_ELIGIBILITY.get(stream, [])
    if not eligible:
        return []

    q_scores: dict[str, float] = {
        "q1_science_tech":    req.q1_science_tech,
        "q2_healthcare":     req.q2_healthcare,
        "q3_design":         req.q3_design,
        "q4_data":           req.q4_data,
        "q5_business":       req.q5_business,
        "q6_arts_culture":   req.q6_arts_culture,
        "q7_nature_env":     req.q7_nature_env,
        "q8_hands_on":       req.q8_hands_on,
        "q9_innovation":     req.q9_innovation,
        "q10_people_social": req.q10_people_social,
        "q11_urban_corporate": req.q11_urban_corporate,
        "q12_flexible_path": req.q12_flexible_path,
    }

    scored: list[dict] = []
    seen: set[str] = set()
    for name, code, uni, apt in eligible:
        key = f"{name}|{uni}"
        if key in seen:
            continue
        seen.add(key)
        s = _score(name, uni, req.Z_Score, req.Island_Rank, q_scores, stream)
        scored.append({"name": name, "uni_code": code, "university": uni, "aptitude": apt, "score": s})

    scored.sort(key=lambda x: x["score"], reverse=True)

    recs: list[CourseRecommendation] = []
    uni_count: dict[str, int] = {}

    for c in scored:
        if len(recs) >= top_n:
            break
        if diversity and uni_count.get(c["university"], 0) >= 2:
            continue
        recs.append(CourseRecommendation(
            rank=len(recs) + 1,
            course=c["name"],
            score=round(c["score"], 4),
            university=c["university"],
            uni_code=c["uni_code"],
            aptitude_required=c["aptitude"],
        ))
        uni_count[c["university"]] = uni_count.get(c["university"], 0) + 1

    # fill remaining slots if diversity pruned too many
    if len(recs) < top_n:
        already = {r.course for r in recs}
        for c in scored:
            if len(recs) >= top_n:
                break
            if c["name"] in already:
                continue
            recs.append(CourseRecommendation(
                rank=len(recs) + 1,
                course=c["name"],
                score=round(c["score"], 4),
                university=c["university"],
                uni_code=c["uni_code"],
                aptitude_required=c["aptitude"],
            ))

    return recs


ELIGIBLE_STREAMS: list[str] = list(STREAM_ELIGIBILITY.keys())
