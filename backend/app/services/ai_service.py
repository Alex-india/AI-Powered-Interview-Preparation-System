import os
import json
import random
import re
import requests
from app.config import Config
from app.services.market_questions import COMPANY_MARKET_QUESTIONS, get_questions_by_company
from app.services.coding_questions import CODING_CHALLENGES, get_coding_challenges
from app.services.answer_bank import evaluate_smart_submission, get_verified_model_answer

# Massive Dynamic Question Bank for Realistic & Non-Repetitive Mock Interviews
EXPANDED_MOCK_QUESTIONS = {
    "software developer": {
        "technical": [
            {"question": "Explain the difference between a process and a thread. When would you use multi-threading over multi-processing in high-throughput applications?", "category": "Operating Systems", "difficulty": "intermediate", "question_type": "theory"},
            {"question": "What is a deadlock in OS? What are Coffman's four necessary conditions for it to occur, and how do modern systems prevent them?", "category": "Operating Systems", "difficulty": "advanced", "question_type": "theory"},
            {"question": "How does dynamic memory allocation work (Heap vs Stack)? Explain memory leaks and how Garbage Collection works in Java or Python.", "category": "Memory Management", "difficulty": "intermediate", "question_type": "theory"},
            {"question": "Explain the difference between HTTP/1.1, HTTP/2, and HTTP/3 (QUIC). What happens during a TLS 1.3 handshake?", "category": "Networking", "difficulty": "advanced", "question_type": "theory"},
            {"question": "Compare SQL vs NoSQL databases. Under what scenarios would you choose MongoDB/Cassandra over PostgreSQL/MySQL?", "category": "Databases", "difficulty": "intermediate", "question_type": "theory"},
            {"question": "What is Database Sharding vs Partitioning? How do virtual nodes in Consistent Hashing prevent cache stampede during node rebalancing?", "category": "System Design", "difficulty": "advanced", "question_type": "theory"},
            {"question": "Explain the Time and Space complexity of QuickSort vs MergeSort. Why is QuickSort often faster in practice than MergeSort despite O(N^2) worst case?", "category": "Data Structures & Algorithms", "difficulty": "advanced", "question_type": "theory"},
            {"question": "Explain B-Trees and B+ Trees. Why do relational database engines like InnoDB use B+ Trees for index structures instead of Red-Black Trees or Hash Tables?", "category": "Databases", "difficulty": "advanced", "question_type": "theory"},
            {"question": "What is Git rebase vs Git merge? Explain the difference between interactive rebase and fast-forward merge.", "category": "Software Engineering", "difficulty": "beginner", "question_type": "theory"},
            {"question": "Explain the SOLID principles of Object-Oriented Design with practical real-world software architecture examples.", "category": "OOP & Clean Code", "difficulty": "intermediate", "question_type": "theory"},
            {"question": "What is connection pooling in backend databases? How does it prevent connection starvation under 100k requests/minute?", "category": "Backend Architecture", "difficulty": "intermediate", "question_type": "theory"},
            {"question": "Explain optimistic locking vs pessimistic locking. How do you implement optimistic concurrency control using version timestamps?", "category": "Databases & Concurrency", "difficulty": "advanced", "question_type": "theory"},
            {"question": "What is an API Gateway? Explain rate limiting algorithms like Token Bucket, Leaky Bucket, and Sliding Window Log.", "category": "System Design", "difficulty": "advanced", "question_type": "theory"},
            {"question": "What is CORS (Cross-Origin Resource Sharing)? Explain preflight OPTIONS requests and how to safely configure allowed origins.", "category": "Web Security", "difficulty": "intermediate", "question_type": "theory"},
            {"question": "Explain the differences between Synchronous, Asynchronous, and Non-blocking I/O. How does the Node.js event loop or Python asyncio handle high concurrency?", "category": "Concurrency & I/O", "difficulty": "advanced", "question_type": "theory"},
            {"question": "What is SQL Injection and how do Prepared Statements / Parameterized Queries completely prevent it at the driver level?", "category": "Application Security", "difficulty": "beginner", "question_type": "theory"},
            {"question": "What is the CAP Theorem in distributed databases? Explain why CP or AP systems make distinct tradeoffs during network partitions.", "category": "Distributed Systems", "difficulty": "advanced", "question_type": "theory"},
            {"question": "Explain Docker containerization vs Virtual Machines. How do Linux cgroups and namespaces provide resource isolation?", "category": "DevOps & Cloud", "difficulty": "intermediate", "question_type": "theory"},
            {"question": "What is Message Queue architecture (e.g. RabbitMQ, Apache Kafka)? When do you decouple services with event-driven pub/sub vs direct REST APIs?", "category": "System Design", "difficulty": "advanced", "question_type": "theory"},
            {"question": "Explain Idempotency in REST APIs. How do you design an idempotent payment processing endpoint to avoid duplicate charges?", "category": "API Design", "difficulty": "advanced", "question_type": "theory"}
        ],
        "behavioral": [
            {"question": "Tell me about a time when you had to debug a critical production bug under time pressure. Walk me through your diagnostic process and how you prevented regression.", "category": "Problem Solving", "difficulty": "intermediate", "question_type": "theory"},
            {"question": "Describe a situation where you had a strong technical disagreement with a senior engineer or architect. How did you handle the debate and what was the resolution?", "category": "Conflict Resolution", "difficulty": "intermediate", "question_type": "theory"},
            {"question": "Tell me about a project where the requirements changed significantly midway through development. How did you manage scope and meet deadlines?", "category": "Adaptability", "difficulty": "intermediate", "question_type": "theory"},
            {"question": "Describe an instance where you pushed back against unrealistic deadlines or technical debt. How did you balance business velocity with software quality?", "category": "Leadership", "difficulty": "advanced", "question_type": "theory"},
            {"question": "Tell me about a time you took ownership of a feature outside your normal responsibilities. What motivated you and what impact did it create?", "category": "Ownership & Initiative", "difficulty": "beginner", "question_type": "theory"}
        ],
        "hr": [
            {"question": "Why do you want to join our engineering team? How do your personal career goals align with our product roadmap?", "category": "Motivation", "difficulty": "beginner", "question_type": "theory"},
            {"question": "Where do you envision yourself in 3 to 5 years as an engineer? What technical depth or leadership responsibilities do you aim to master?", "category": "Career Goals", "difficulty": "beginner", "question_type": "theory"},
            {"question": "What is your greatest technical strength, and what is one area of technology you are currently actively working to improve?", "category": "Self Awareness", "difficulty": "beginner", "question_type": "theory"},
            {"question": "Describe your ideal working culture and team environment. How do you stay productive in collaborative or remote team setups?", "category": "Culture Fit", "difficulty": "beginner", "question_type": "theory"}
        ]
    },
    "data analyst": {
        "technical": [
            {"question": "Explain the difference between WHERE and HAVING clauses in SQL. Write an example showing when HAVING is strictly required.", "category": "SQL", "difficulty": "beginner", "question_type": "theory"},
            {"question": "What are SQL Window Functions (e.g. ROW_NUMBER, RANK, DENSE_RANK)? Explain when to use each for analytical queries.", "category": "SQL Analytics", "difficulty": "intermediate", "question_type": "theory"},
            {"question": "How do you detect and handle outliers in skewed distributions? Compare Z-Score method vs Interquartile Range (IQR).", "category": "Statistics", "difficulty": "intermediate", "question_type": "theory"},
            {"question": "Explain the Central Limit Theorem and its significance when running hypothesis testing on business conversion rates.", "category": "Statistics", "difficulty": "advanced", "question_type": "theory"},
            {"question": "Describe how you would design an automated ETL pipeline to ingest raw sales data from multiple CSV sources into a clean PostgreSQL data warehouse.", "category": "Data Engineering", "difficulty": "advanced", "question_type": "theory"}
        ],
        "behavioral": [
            {"question": "Tell me about a time when your analytical findings contradicted a stakeholder's hypothesis. How did you present the data effectively?", "category": "Stakeholder Management", "difficulty": "intermediate", "question_type": "theory"},
            {"question": "Describe how you prioritize conflicting analytics requests from product, marketing, and finance teams.", "category": "Prioritization", "difficulty": "intermediate", "question_type": "theory"}
        ],
        "hr": [
            {"question": "Why do you want to pursue data analytics rather than pure software development?", "category": "Motivation", "difficulty": "beginner", "question_type": "theory"},
            {"question": "Where do you see analytics and AI transforming business decision-making in the next 3 to 5 years?", "category": "Industry Vision", "difficulty": "beginner", "question_type": "theory"}
        ]
    },
    "ui/ux designer": {
        "technical": [
            {"question": "Explain the key differences between atomic design principles and standard component libraries in design systems.", "category": "Design Systems", "difficulty": "intermediate", "question_type": "theory"},
            {"question": "How do you apply Jakob Nielsen's 10 usability heuristics when conducting an end-to-end heuristic evaluation of a SaaS web app?", "category": "Usability Heuristics", "difficulty": "advanced", "question_type": "theory"},
            {"question": "What is WCAG 2.1 AA accessibility compliance? How do color contrast ratios, focus states, and aria-labels impact user experience?", "category": "Accessibility & WCAG", "difficulty": "intermediate", "question_type": "theory"},
            {"question": "Describe your process for structuring Information Architecture (IA) and user journey flows for complex data-dense interfaces.", "category": "Information Architecture", "difficulty": "intermediate", "question_type": "theory"},
            {"question": "How do you design for responsive breakpoints (mobile, tablet, desktop)? Explain fluid typography and container queries.", "category": "Responsive Layout", "difficulty": "beginner", "question_type": "theory"}
        ],
        "behavioral": [
            {"question": "Describe a scenario where developers pushed back on your design due to implementation complexity. How did you reach a balanced compromise?", "category": "Cross-functional Collaboration", "difficulty": "intermediate", "question_type": "theory"},
            {"question": "Tell me about a time user research revealed that users were using your feature differently than intended. What did you adapt?", "category": "User Empathy", "difficulty": "intermediate", "question_type": "theory"}
        ],
        "hr": [
            {"question": "What inspired you to specialize in UI/UX design, and what design system or digital product do you admire most today?", "category": "Motivation", "difficulty": "beginner", "question_type": "theory"},
            {"question": "How do you stay up-to-date with emerging UX research methodologies, micro-interactions, and AI design tools?", "category": "Continuous Learning", "difficulty": "beginner", "question_type": "theory"}
        ]
    },
    "generic": {
        "technical": [
            {"question": "Explain how DNS resolution works step-by-step from when a user types a URL in their browser to when the IP address is returned.", "category": "Networking", "difficulty": "intermediate", "question_type": "theory"},
            {"question": "What is caching? Explain cache invalidation strategies (Write-Through, Write-Back, Cache-Aside) and their trade-offs.", "category": "System Design", "difficulty": "intermediate", "question_type": "theory"},
            {"question": "What is the difference between synchronous and asynchronous communication in microservices architecture?", "category": "Architecture", "difficulty": "intermediate", "question_type": "theory"}
        ],
        "behavioral": [
            {"question": "Tell me about a time you made a noticeable mistake on a team project. How did you communicate it, take accountability, and remediate the issue?", "category": "Accountability", "difficulty": "beginner", "question_type": "theory"},
            {"question": "Describe a project where you had to collaborate with team members across different time zones or technical proficiencies. How did you ensure alignment?", "category": "Communication", "difficulty": "intermediate", "question_type": "theory"}
        ],
        "hr": [
            {"question": "Walk me through your background, your key technical projects, and what sparked your passion for software development.", "category": "Self Introduction", "difficulty": "beginner", "question_type": "theory"},
            {"question": "How do you prioritize competing deadlines when multiple stakeholders request high-priority features simultaneously?", "category": "Work Ethic", "difficulty": "intermediate", "question_type": "theory"}
        ]
    }
}

class AIService:
    @staticmethod
    def _get_client():
        if Config.DEMO_MODE or not Config.AI_API_KEY:
            return None
        try:
            from google import genai
            client = genai.Client(api_key=Config.AI_API_KEY)
            return client
        except Exception as e:
            print(f"Failed to initialize live Gemini Client: {e}. Falling back to dynamic offline question engine.")
            return None

    @classmethod
    def generate_questions(cls, role, interview_type, difficulty, experience_level, count, company="", resume_text="", jd_text="", excluded_questions=None):
        """
        Generates structured interview questions based on the configuration and target company.
        Guarantees non-repetitive, diverse questions including hands-on coding challenges.
        """
        role_lower = role.lower() if role else "generic"
        excluded_list = []
        if excluded_questions:
            for q in excluded_questions:
                s = str(q).strip().lower()
                if s and s not in excluded_list:
                    excluded_list.append(s)
        excluded_set = set(excluded_list)

        # 1. LIVE GEMINI MODE
        client = cls._get_client()
        if client:
            try:
                system_instruction = (
                    "You are a principal technical interviewer at Google, Amazon, and top MNCs. "
                    "Generate fresh, non-repetitive, modern interview questions. "
                    "Include practical coding challenges when interview_type is 'coding', 'technical', or 'mixed'."
                )
                
                exclude_prompt = ""
                if excluded_list:
                    exclude_samples = excluded_list[:25]
                    exclude_prompt = f"- DO NOT REPEAT ANY OF THESE PREVIOUSLY ASKED QUESTIONS:\n" + "\n".join([f"  * {q}" for q in exclude_samples])

                prompt = f"""
                Generate a list of exactly {count} interview questions for:
                - Role: {role}
                - Interview Type: {interview_type} (coding, technical, behavioral, hr, mixed)
                - Difficulty: {difficulty} (beginner, intermediate, advanced)
                - Experience: {experience_level}
                - Company: {company if company else 'Standard Tech'}
                {exclude_prompt}
                - Resume Context: {resume_text if resume_text else 'None'}
                - JD Context: {jd_text if jd_text else 'None'}
                
                CRITICAL REQUIREMENTS:
                - If interview_type is 'coding', every question MUST be an interactive coding problem with starter_code and test_cases.
                - If interview_type is 'technical' or 'mixed', include at least 1-2 coding problems alongside system design and core CS theory questions.
                
                You MUST return a valid JSON array of objects. Schema:
                [
                  {{
                    "question": "Full problem statement or question text",
                    "category": "e.g. Arrays & Hashing, System Design, SQL Queries, OOP",
                    "difficulty": "{difficulty}",
                    "question_type": "coding" or "theory",
                    "starter_code": "def solution():\\n    pass\\n" (required if coding, empty if theory),
                    "test_cases": [
                      {{"input": "nums = [2, 7, 11, 15], target = 9", "expected_output": "[0, 1]", "description": "Basic test case"}}
                    ],
                    "evaluation_points": ["Correctness", "Optimal Time Complexity", "Clean Code"]
                  }}
                ]
                """
                
                response = client.interactions.create(
                    model=Config.AI_MODEL,
                    input=prompt,
                    system_instruction=system_instruction,
                    generation_config={
                        "response_mime_type": "application/json"
                    }
                )
                
                output = response.output_text
                try:
                    questions = json.loads(output)
                    if isinstance(questions, list) and len(questions) > 0:
                        for i, q in enumerate(questions):
                            q['order_number'] = i + 1
                            if 'question_type' not in q:
                                q['question_type'] = 'coding' if q.get('starter_code') else 'theory'
                        return questions
                except Exception:
                    pass
            except Exception as e:
                print(f"Live Gemini API error: {e}. Falling back to dynamic multi-source question engine.")

        # 2. DYNAMIC OFFLINE ENGINE WITH CODING CHALLENGES & NON-REPETITIVE SELECTION
        return cls._generate_mock_questions(role_lower, interview_type, difficulty, count, company=company, excluded_set=excluded_set, excluded_list=excluded_list)

    @classmethod
    def _generate_mock_questions(cls, role, interview_type, difficulty, count, company="", excluded_set=None, excluded_list=None):
        if excluded_set is None:
            excluded_set = set()
        if excluded_list is None:
            excluded_list = []

        itype = interview_type.lower()
        selected_questions = []

        # 1. Determine coding questions ratio
        coding_needed = 0
        if itype in ("coding", "hands-on coding", "dsa"):
            coding_needed = count
        elif itype == "technical":
            coding_needed = max(1, count // 2)
        elif itype == "mixed":
            coding_needed = 1 if count >= 3 else 0

        # Pull fresh coding challenges
        if coding_needed > 0:
            available_coding = [
                q for q in CODING_CHALLENGES 
                if q["question"].strip().lower() not in excluded_set
            ]
            if len(available_coding) < coding_needed:
                # Exclude at least the immediate recent session to prevent consecutive duplication
                recent_subset = set(excluded_list[:max(count, 5)])
                recycled = [q for q in CODING_CHALLENGES if q["question"].strip().lower() not in recent_subset]
                available_coding = recycled if len(recycled) >= coding_needed else list(CODING_CHALLENGES)
            
            random.shuffle(available_coding)
            chosen_coding = available_coding[:coding_needed]
            for q in chosen_coding:
                starter = q.get("starter_codes") or q.get("starter_code") or "def solution():\n    pass\n"
                selected_questions.append({
                    "question": q["question"],
                    "category": q.get("category", "Coding Challenge"),
                    "difficulty": q.get("difficulty", difficulty),
                    "question_type": "coding",
                    "starter_code": starter,
                    "test_cases": q.get("test_cases", []),
                    "evaluation_points": ["Algorithmic correctness", "Optimal Time & Space complexity", "Edge cases handling"]
                })

        theory_needed = count - len(selected_questions)
        if theory_needed <= 0:
            for i, q in enumerate(selected_questions[:count]):
                q["order_number"] = i + 1
            return selected_questions[:count]

        # 2. Pull theory/system questions from Company Market questions or Role bank
        theory_pool = []
        if company:
            company_questions = get_questions_by_company(company)
            if company_questions:
                for cq in company_questions:
                    cq_copy = dict(cq)
                    cq_copy["question_type"] = "coding" if any(w in cq_copy.get("question", "").lower() for w in ["write a sql", "write a query", "write a function", "reverse a singly linked list"]) else "theory"
                    theory_pool.append(cq_copy)

        matched_role = "software developer" if "software" in role or "dev" in role or "python" in role or "java" in role else ("data analyst" if "data" in role else "generic")
        types_to_fetch = ["technical"]
        if itype == "mixed":
            types_to_fetch = ["technical", "behavioral", "hr"]
        elif itype in ("behavioral", "leadership"):
            types_to_fetch = ["behavioral"]
        elif itype == "hr":
            types_to_fetch = ["hr"]

        for t in types_to_fetch:
            role_items = EXPANDED_MOCK_QUESTIONS.get(matched_role, {}).get(t, [])
            if not role_items:
                role_items = EXPANDED_MOCK_QUESTIONS["generic"].get(t, [])
            theory_pool.extend(role_items)

        # Filter out questions already asked recently to avoid repetition
        unseen_theory = [
            q for q in theory_pool 
            if q.get("question", "").strip().lower() not in excluded_set
        ]
        if len(unseen_theory) < theory_needed:
            recent_subset = set(excluded_list[:max(count, 5)])
            recycled = [q for q in theory_pool if q.get("question", "").strip().lower() not in recent_subset]
            unseen_theory = recycled if len(recycled) >= theory_needed else list(theory_pool)

        random.shuffle(unseen_theory)

        for q in unseen_theory:
            if len(selected_questions) >= count:
                break
            q_text = q.get("question", "")
            if not any(sq["question"] == q_text for sq in selected_questions):
                selected_questions.append({
                    "question": q_text,
                    "category": q.get("category", "Technical Concept"),
                    "difficulty": q.get("difficulty", difficulty),
                    "question_type": q.get("question_type", "theory"),
                    "starter_code": q.get("starter_code", ""),
                    "test_cases": q.get("test_cases", []),
                    "evaluation_points": ["Conceptual understanding", "Depth of explanation", "Real-world trade-offs"]
                })

        # Pad with coding challenges if still short
            filler = random.choice(CODING_CHALLENGES)
            filler_starter = filler.get("starter_codes") or filler.get("starter_code") or ""
            selected_questions.append({
                "question": filler["question"],
                "category": filler.get("category", "Algorithms & Coding"),
                "difficulty": filler.get("difficulty", difficulty),
                "question_type": "coding",
                "starter_code": filler_starter,
                "test_cases": filler.get("test_cases", []),
                "evaluation_points": ["Correctness", "Complexity", "Code style"]
            })

        # Shuffle the order so coding problems aren't always clumped together
        random.shuffle(selected_questions)
        for i, q in enumerate(selected_questions[:count]):
            q["order_number"] = i + 1

        return selected_questions[:count]

    @classmethod
    def evaluate_answer(cls, question_text, user_answer, role, interview_type, difficulty, category="", question_type="theory"):
        """
        Evaluates candidate's answer with rigorous checks for gibberish/spam/wrong content,
        deep semantic topic matching, and attaches complete verified model answers.
        """
        clean_ans = (user_answer or "").strip()
        is_coding = (question_type == 'coding') or any(keyword in question_text.lower() for keyword in [
            "write a function", "write code", "implement", "return indices", "two sum",
            "linked list", "valid parentheses", "sql query", "algorithm", "max_profit"
        ])

        # 1. LIVE GEMINI MODE (if active API key is provided)
        client = cls._get_client()
        if client:
            try:
                system_instruction = (
                    "You are a strict, world-class technical interviewer and code reviewer. "
                    "CRITICAL GRADING RULES: "
                    "1. If the candidate's answer is gibberish, random letters (e.g. 'asdf', 'dfkjhsdf'), joke answers, or totally incorrect/off-topic content, you MUST assign 0.0 to 1.5 across all dimensions and clearly state in feedback that the submission is incorrect/invalid. "
                    "2. Do NOT give passing or high marks to nonsense or incorrect answers. "
                    "3. If partially correct, assign 4.0 to 6.5. "
                    "4. If strong, assign 7.5 to 9.5. "
                    "5. In 'ideal_answer', provide a complete, verified, accurate solution (with working code and Big-O complexity for coding, or structured deep explanation for theory)."
                )

                prompt = f"""
                Question:
                {question_text}

                Candidate's Answer / Code Submission:
                {clean_ans}

                Context: Role: {role}, Type: {interview_type}, Difficulty: {difficulty}, Category: {category}
                Is Coding Problem: {is_coding}

                Provide output strictly as JSON object with schema:
                {{
                    "overall_score": 8.5,
                    "correctness": 8.5,
                    "relevance": 9.0,
                    "clarity": 8.0,
                    "completeness": 8.5,
                    "feedback": "Granular analysis covering logic, edge cases, time/space complexity.",
                    "ideal_answer": "Complete, working model code solution with Big-O complexity analysis."
                }}
                """

                response = client.interactions.create(
                    model=Config.AI_MODEL,
                    input=prompt,
                    system_instruction=system_instruction,
                    generation_config={"response_mime_type": "application/json"}
                )
                output = response.output_text
                parsed = json.loads(output.strip().replace("```json", "").replace("```", "").strip())
                if not parsed.get('ideal_answer') or len(parsed.get('ideal_answer', '')) < 50:
                    parsed['ideal_answer'] = get_verified_model_answer(question_text, category=category, question_type='coding' if is_coding else 'theory')
                return parsed
            except Exception as e:
                print(f"Live Gemini evaluation error: {e}. Falling back to Smart Evaluator.")

        # 2. DYNAMIC SMART EVALUATOR & VERIFIED ANSWER BANK
        return evaluate_smart_submission(
            question_text=question_text,
            user_answer=clean_ans,
            role=role,
            interview_type=interview_type,
            difficulty=difficulty,
            category=category,
            question_type=question_type,
            is_coding=is_coding
        )

    @classmethod
    def _generate_mock_evaluation(cls, question_text, user_answer, is_coding=False, category="", question_type="theory"):
        return evaluate_smart_submission(
            question_text=question_text,
            user_answer=user_answer,
            category=category,
            question_type=question_type,
            is_coding=is_coding
        )

    @classmethod
    def generate_final_report(cls, role, interview_type, difficulty, experience_level, answers_evaluations):
        """
        Generates overall strengths, weaknesses, and personalized 7-day study plan.
        Follows the fixed teaching order described in Section 4.8.4 and Listing A.4:
        Day 1: core foundations, Day 2: a deeper study, Day 3: practical coding,
        Day 4: advanced scenarios, Day 5: verbal communication, Day 6: error handling,
        Day 7: final mock session.
        """
        count = len(answers_evaluations)
        if count == 0:
            return {
                "strengths": ["Completed session initiative", "Demonstrated problem-solving intent", "Engaged with interview format"],
                "weaknesses": ["Practice answering questions more completely", "Provide concrete technical examples"],
                "study_plan": {
                    "Day 1": f"Core foundations: Review fundamental principles and core concepts in {role}.",
                    "Day 2": "Deep dive: Deeper study of underlying data structures, mechanisms, and syntax.",
                    "Day 3": "Practical coding: Implement algorithms, write hands-on functions, and solve problems.",
                    "Day 4": "Advanced scenarios: Study scalability, system design trade-offs, and architectural choices.",
                    "Day 5": "Verbal communication: Practice explaining technical decisions aloud using STAR method.",
                    "Day 6": "Error handling: Review debugging methods, exception handling, and edge cases.",
                    "Day 7": "Final mock session: Conduct a full timed interview simulation under test conditions."
                }
            }

        avg_overall = sum(a['overall'] for a in answers_evaluations) / count
        avg_correctness = sum(a['correctness'] for a in answers_evaluations) / count
        avg_clarity = sum(a['clarity'] for a in answers_evaluations) / count

        strengths = []
        weaknesses = []

        if avg_overall >= 7.5:
            strengths.append("High overall problem-solving accuracy and domain readiness")
        if avg_correctness >= 7.0:
            strengths.append("Accurate technical terminology and correct core concepts")
        if avg_clarity >= 7.0:
            strengths.append("Clear communication and structured explanation flow")
        if not strengths:
            strengths.append("Good effort under timed interview conditions")
            strengths.append("Demonstrated foundational familiarity with primary concepts")
            strengths.append("Consistent engagement across question rounds")

        if avg_correctness < 7.0:
            weaknesses.append("Deepen knowledge of algorithmic edge cases and core domain mechanisms")
        if avg_clarity < 7.0:
            weaknesses.append("Practice concise explanation frameworks (Problem -> Approach -> Complexity)")
        if avg_overall < 7.0:
            weaknesses.append("Strengthen answer completeness and speed under timed interview limits")
        if not weaknesses:
            weaknesses.append("Explore advanced system design scalability patterns (e.g. distributed caches, sharding)")
            weaknesses.append("Fine-tune verbal delivery to explain trade-offs even more concisely")

        study_plan = {
            "Day 1": f"Core foundations: Review fundamental principles and core concepts in {role}.",
            "Day 2": "Deep dive: Deeper study of underlying mechanisms, internal data structures, and edge cases.",
            "Day 3": "Practical coding: Implement algorithms, write hands-on functions, and solve problems.",
            "Day 4": "Advanced scenarios: Study scalability, system design trade-offs, and architectural choices.",
            "Day 5": "Verbal communication: Practice explaining technical decisions aloud using STAR method.",
            "Day 6": "Error handling: Review debugging methods, exception handling, and recovery patterns.",
            "Day 7": "Final mock session: Conduct a full timed interview simulation under test conditions."
        }

        return {
            "strengths": strengths[:3],
            "weaknesses": weaknesses[:3],
            "study_plan": study_plan
        }
