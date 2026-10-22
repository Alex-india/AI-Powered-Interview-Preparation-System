"""
Real-time Market Questions Database for Top MNCs & Big Tech
Covers realistic interview questions asked by TCS, Infosys, Wipro, Accenture, Amazon, Google, Microsoft, etc.
"""

COMPANY_MARKET_QUESTIONS = {
    "TCS": {
        "name": "Tata Consultancy Services (TCS NQT / Digital / Ninja)",
        "logo_text": "TCS",
        "description": "Focuses on OOPs, DBMS Normalization, SQL Queries, OS Concepts, and Situational HR.",
        "questions": [
            {
                "id": "tcs-1",
                "question": "Explain the 4 core pillars of Object-Oriented Programming (OOP) with real-world examples. How is Abstraction different from Encapsulation?",
                "category": "OOPs Concepts",
                "difficulty": "intermediate",
                "company": "TCS"
            },
            {
                "id": "tcs-2",
                "question": "What is Database Normalization? Explain 1NF, 2NF, and 3NF with an example of an unnormalized student record table.",
                "category": "DBMS",
                "difficulty": "intermediate",
                "company": "TCS"
            },
            {
                "id": "tcs-3",
                "question": "Write a SQL query to find the 2nd highest salary from an Employee table without using the LIMIT or TOP keywords.",
                "category": "SQL",
                "difficulty": "intermediate",
                "company": "TCS"
            },
            {
                "id": "tcs-4",
                "question": "What is the difference between Call by Value and Call by Reference? Explain how memory allocation differs in each.",
                "category": "Core Programming",
                "difficulty": "beginner",
                "company": "TCS"
            },
            {
                "id": "tcs-5",
                "question": "Explain the TCP 3-way handshake process. Why is TCP preferred for web browsing while UDP is preferred for live video streaming?",
                "category": "Networking",
                "difficulty": "intermediate",
                "company": "TCS"
            },
            {
                "id": "tcs-6",
                "question": "What is Paging in Operating Systems? How does it help resolve external fragmentation, and what is a page fault?",
                "category": "Operating Systems",
                "difficulty": "intermediate",
                "company": "TCS"
            },
            {
                "id": "tcs-7",
                "question": "How do you reverse a singly linked list iteratively and recursively? What are the respective time and space complexities?",
                "category": "Data Structures",
                "difficulty": "intermediate",
                "company": "TCS"
            },
            {
                "id": "tcs-8",
                "question": "Why do you want to join TCS, and how do your technical skills align with our global client transformation initiatives?",
                "category": "HR & Motivation",
                "difficulty": "beginner",
                "company": "TCS"
            },
            {
                "id": "tcs-9",
                "question": "Describe a project conflict you experienced with a peer on technical architecture. How did you resolve it and deliver on time?",
                "category": "Behavioral",
                "difficulty": "beginner",
                "company": "TCS"
            }
        ]
    },
    "Infosys": {
        "name": "Infosys (InfyTQ / Specialist Programmer / System Engineer)",
        "logo_text": "INFY",
        "description": "Focuses on Data Structures, Java/Python internals, Database Joins, and Problem Solving.",
        "questions": [
            {
                "id": "infy-1",
                "question": "Explain the internal working of HashMap in Java or dictionaries in Python. How does it handle hash collisions?",
                "category": "Data Structures",
                "difficulty": "intermediate",
                "company": "Infosys"
            },
            {
                "id": "infy-2",
                "question": "Explain ACID properties in relational databases. Illustrate each property using a real-world banking fund transfer scenario.",
                "category": "DBMS",
                "difficulty": "intermediate",
                "company": "Infosys"
            },
            {
                "id": "infy-3",
                "question": "How do you detect a cycle or loop in a singly linked list? Explain Floyd’s Cycle-Finding algorithm (Tortoise and Hare).",
                "category": "Data Structures & Algorithms",
                "difficulty": "intermediate",
                "company": "Infosys"
            },
            {
                "id": "infy-4",
                "question": "What is the difference between Clustered Index and Non-Clustered Index in SQL? When would an index degrade write performance?",
                "category": "Database Indexing",
                "difficulty": "intermediate",
                "company": "Infosys"
            },
            {
                "id": "infy-5",
                "question": "Explain the difference between Checked and Unchecked exceptions in Java. How should exceptions be propagated across application layers?",
                "category": "Core Programming",
                "difficulty": "beginner",
                "company": "Infosys"
            },
            {
                "id": "infy-6",
                "question": "Can you override a static or private method in Object-Oriented languages? Explain method hiding vs method overriding.",
                "category": "OOPs Concepts",
                "difficulty": "intermediate",
                "company": "Infosys"
            },
            {
                "id": "infy-7",
                "question": "Tell me about a time you had to learn a completely new framework or tool within a few days to complete a milestone. How did you approach it?",
                "category": "Adaptability",
                "difficulty": "beginner",
                "company": "Infosys"
            },
            {
                "id": "infy-8",
                "question": "What is your approach when a production bug is reported by a client with incomplete reproduction steps?",
                "category": "Situational",
                "difficulty": "intermediate",
                "company": "Infosys"
            }
        ]
    },
    "Wipro": {
        "name": "Wipro (Elite National Talent Hunt / Turbo)",
        "logo_text": "WIPRO",
        "description": "Focuses on SDLC, Core Programming, Cloud Fundamentals, and Client Relationship basics.",
        "questions": [
            {
                "id": "wip-1",
                "question": "What is the Software Development Life Cycle (SDLC)? Compare Agile Scrum methodology with the traditional Waterfall model.",
                "category": "Software Engineering",
                "difficulty": "beginner",
                "company": "Wipro"
            },
            {
                "id": "wip-2",
                "question": "Explain String immutability in Java/Python. Why was String designed to be immutable, and what role does the String Constant Pool play?",
                "category": "Memory Management",
                "difficulty": "intermediate",
                "company": "Wipro"
            },
            {
                "id": "wip-3",
                "question": "What is the difference between Stack Memory and Heap Memory during runtime execution? What happens during a StackOverflow error?",
                "category": "Operating Systems & Memory",
                "difficulty": "intermediate",
                "company": "Wipro"
            },
            {
                "id": "wip-4",
                "question": "Explain Cloud Computing service models: IaaS, PaaS, and SaaS with practical examples of each.",
                "category": "Cloud Computing",
                "difficulty": "beginner",
                "company": "Wipro"
            },
            {
                "id": "wip-5",
                "question": "What is the difference between PUT, POST, and PATCH HTTP methods in RESTful API development?",
                "category": "Web Services",
                "difficulty": "beginner",
                "company": "Wipro"
            },
            {
                "id": "wip-6",
                "question": "Describe a situation where you received critical or negative feedback on your code or assignment. How did you incorporate it?",
                "category": "Coachability",
                "difficulty": "beginner",
                "company": "Wipro"
            },
            {
                "id": "wip-7",
                "question": "Why should Wipro hire you today, and how do you plan to contribute to our digital technology practices?",
                "category": "HR & Culture",
                "difficulty": "beginner",
                "company": "Wipro"
            }
        ]
    },
    "Amazon": {
        "name": "Amazon (SDE 1 / SDE 2 & Leadership Principles)",
        "logo_text": "AMZN",
        "description": "Rigorous focus on Amazon Leadership Principles, System Scalability, and Algorithmic problem solving.",
        "questions": [
            {
                "id": "amz-1",
                "question": "Design an LRU (Least Recently Used) Cache supporting get(key) and put(key, value) in O(1) time complexity. Explain the underlying data structures.",
                "category": "Data Structures & Algorithms",
                "difficulty": "advanced",
                "company": "Amazon"
            },
            {
                "id": "amz-2",
                "question": "Design a scalable URL Shortening Service (like TinyURL) capable of handling 100M writes and 1B reads daily. Discuss database schema and key generation.",
                "category": "System Design",
                "difficulty": "advanced",
                "company": "Amazon"
            },
            {
                "id": "amz-3",
                "question": "Given a continuous stream of integer numbers, how would you design an algorithm to find the median in real-time? Explain the Two-Heap approach.",
                "category": "Algorithms (Heaps)",
                "difficulty": "advanced",
                "company": "Amazon"
            },
            {
                "id": "amz-4",
                "question": "Explain Consistent Hashing and Virtual Nodes. Why is it indispensable for distributed key-value stores like Amazon DynamoDB?",
                "category": "Distributed Systems",
                "difficulty": "advanced",
                "company": "Amazon"
            },
            {
                "id": "amz-5",
                "question": "[Customer Obsession]: Tell me about a time when you went above and beyond to solve an end-user pain point, even when it required pushing back against immediate business constraints.",
                "category": "Amazon Leadership Principles",
                "difficulty": "intermediate",
                "company": "Amazon"
            },
            {
                "id": "amz-6",
                "question": "[Ownership]: Give an example of a time when you stepped up to resolve a critical failure outside your assigned area of responsibility without being asked.",
                "category": "Amazon Leadership Principles",
                "difficulty": "intermediate",
                "company": "Amazon"
            },
            {
                "id": "amz-7",
                "question": "[Bias for Action]: Describe a situation where you had to make a high-stakes technical decision with incomplete information. What was your calculated risk?",
                "category": "Amazon Leadership Principles",
                "difficulty": "intermediate",
                "company": "Amazon"
            },
            {
                "id": "amz-8",
                "question": "How do you detect, handle, and prevent deadlocks and race conditions in a distributed payment order processing pipeline?",
                "category": "Concurrency & Transactions",
                "difficulty": "advanced",
                "company": "Amazon"
            }
        ]
    },
    "Google": {
        "name": "Google (Software Engineer & Googleyness)",
        "logo_text": "GOOG",
        "description": "Deep emphasis on Algorithmic optimization, High-Scale Distributed Architecture, and Googleyness.",
        "questions": [
            {
                "id": "goog-1",
                "question": "Design a distributed Web Crawler that parses billions of web pages concurrently without getting stuck in infinite redirects or violating robots.txt.",
                "category": "System Design",
                "difficulty": "advanced",
                "company": "Google"
            },
            {
                "id": "goog-2",
                "question": "Design a real-time Typeahead / Autocomplete suggestion system (like Google Search) that returns top 5 relevant queries within 50ms latency.",
                "category": "System Design (Tries & Caching)",
                "difficulty": "advanced",
                "company": "Google"
            },
            {
                "id": "goog-3",
                "question": "Given a directed graph, explain how to determine Strongly Connected Components (SCC) using Tarjan’s or Kosaraju’s algorithm.",
                "category": "Advanced Graph Algorithms",
                "difficulty": "advanced",
                "company": "Google"
            },
            {
                "id": "goog-4",
                "question": "Given an unsorted array of N elements, find the Kth largest element in O(N) average time complexity without sorting the entire array.",
                "category": "Algorithms (QuickSelect)",
                "difficulty": "intermediate",
                "company": "Google"
            },
            {
                "id": "goog-5",
                "question": "Explain how distributed consensus works in algorithms like Raft or Paxos, and why standard two-phase locking is insufficient for global fault tolerance.",
                "category": "Distributed Systems",
                "difficulty": "advanced",
                "company": "Google"
            },
            {
                "id": "goog-6",
                "question": "[Googleyness]: Describe an instance where data or benchmarks contradicted your strongly held technical intuition. How did you pivot?",
                "category": "Googleyness & Humility",
                "difficulty": "intermediate",
                "company": "Google"
            },
            {
                "id": "goog-7",
                "question": "Tell me about a highly ambiguous problem you tackled with zero predefined guidelines. How did you structure your scope and iterate?",
                "category": "Navigating Ambiguity",
                "difficulty": "intermediate",
                "company": "Google"
            }
        ]
    },
    "Microsoft": {
        "name": "Microsoft (Software Engineer / Cloud & Services)",
        "logo_text": "MSFT",
        "description": "Evaluates Problem Solving, Low-Level Object Oriented Design (LLD), Microservices, and Growth Mindset.",
        "questions": [
            {
                "id": "msft-1",
                "question": "Design a Distributed Rate Limiter to protect public endpoints. Compare Token Bucket, Leaky Bucket, and Sliding Window Log algorithms.",
                "category": "System Design & Algorithms",
                "difficulty": "advanced",
                "company": "Microsoft"
            },
            {
                "id": "msft-2",
                "question": "Write an algorithm to serialize a Binary Tree into a string representation and deserialize that string back into the original binary tree structure.",
                "category": "Binary Trees & Serialization",
                "difficulty": "intermediate",
                "company": "Microsoft"
            },
            {
                "id": "msft-3",
                "question": "Design an Object-Oriented Parking Lot or Elevator Dispatch system applying SOLID design principles and standard design patterns.",
                "category": "Low-Level Design (LLD)",
                "difficulty": "intermediate",
                "company": "Microsoft"
            },
            {
                "id": "msft-4",
                "question": "Find the length of the longest substring without repeating characters in O(N) time complexity using the sliding window technique.",
                "category": "Two Pointers & Sliding Window",
                "difficulty": "intermediate",
                "company": "Microsoft"
            },
            {
                "id": "msft-5",
                "question": "Explain the difference between Optimistic Concurrency Control (OCC) and Pessimistic Locking in database transactions with trade-offs.",
                "category": "Database Architecture",
                "difficulty": "intermediate",
                "company": "Microsoft"
            },
            {
                "id": "msft-6",
                "question": "[Growth Mindset]: Describe an experience where a production incident or architecture choice failed. What did you learn and how did you prevent recurrence?",
                "category": "Growth Mindset",
                "difficulty": "intermediate",
                "company": "Microsoft"
            },
            {
                "id": "msft-7",
                "question": "Tell me about a project where you collaborated with cross-functional disciplines (Designers, Product Managers, QA) to ship a high-impact release.",
                "category": "Collaboration & Impact",
                "difficulty": "beginner",
                "company": "Microsoft"
            }
        ]
    },
    "Accenture": {
        "name": "Accenture / Cognizant / Capgemini (Consulting & Digital)",
        "logo_text": "ACN",
        "description": "Focuses on Microservices, REST APIs, Cloud Containers, Security, and Client Communication.",
        "questions": [
            {
                "id": "acn-1",
                "question": "Compare Monolithic and Microservices architecture. What are the key architectural advantages and challenges in microservice communication?",
                "category": "System Architecture",
                "difficulty": "intermediate",
                "company": "Accenture"
            },
            {
                "id": "acn-2",
                "question": "What is Docker and containerization? Explain how a Docker container differs from a Virtual Machine (VM) at the kernel level.",
                "category": "DevOps & Cloud",
                "difficulty": "intermediate",
                "company": "Accenture"
            },
            {
                "id": "acn-3",
                "question": "Explain SQL Injection (SQLi) and Cross-Site Scripting (XSS). How do modern backend and frontend frameworks safeguard against these vulnerabilities?",
                "category": "Web Security",
                "difficulty": "intermediate",
                "company": "Accenture"
            },
            {
                "id": "acn-4",
                "question": "Explain the GitFlow branching strategy. How do you resolve a complex merge conflict between development and release branches?",
                "category": "Version Control",
                "difficulty": "beginner",
                "company": "Accenture"
            },
            {
                "id": "acn-5",
                "question": "Describe how you would explain a technical root-cause incident or server downtime to a non-technical business client.",
                "category": "Client Communication",
                "difficulty": "beginner",
                "company": "Accenture"
            },
            {
                "id": "acn-6",
                "question": "Tell me about a time when you had to adapt quickly to unexpected client change requests midway through a sprint.",
                "category": "Agile & Flexibility",
                "difficulty": "beginner",
                "company": "Accenture"
            }
        ]
    }
}


def get_all_companies():
    """Returns list of all available companies with their metadata."""
    return [
        {
            "id": key,
            "name": val["name"],
            "logo_text": val["logo_text"],
            "description": val["description"],
            "question_count": len(val["questions"])
        }
        for key, val in COMPANY_MARKET_QUESTIONS.items()
    ]


def get_questions_by_company(company_id=None):
    """Returns questions filtered by company or all company questions including coding challenges."""
    try:
        from app.services.coding_questions import CODING_CHALLENGES
    except Exception:
        CODING_CHALLENGES = []

    if not company_id or company_id.upper() == "ALL":
        all_q = []
        for c_data in COMPANY_MARKET_QUESTIONS.values():
            all_q.extend(c_data["questions"])
        for cc in CODING_CHALLENGES:
            all_q.append({
                "id": cc["id"],
                "question": cc["question"],
                "category": cc["category"],
                "difficulty": cc["difficulty"],
                "company": "Coding Challenge",
                "question_type": "coding",
                "starter_code": cc.get("starter_codes") or cc.get("starter_code", ""),
                "test_cases": cc.get("test_cases", [])
            })
        return all_q

    # Check case-insensitive match
    for key, val in COMPANY_MARKET_QUESTIONS.items():
        if key.lower() == company_id.lower() or company_id.lower() in val["name"].lower():
            return val["questions"]

    if company_id.lower() in ("coding", "dsa", "algorithms"):
        return [
            {
                "id": cc["id"],
                "question": cc["question"],
                "category": cc["category"],
                "difficulty": cc["difficulty"],
                "company": "Coding Challenge",
                "question_type": "coding",
                "starter_code": cc.get("starter_codes") or cc.get("starter_code", ""),
                "test_cases": cc.get("test_cases", [])
            }
            for cc in CODING_CHALLENGES
        ]

    # Fallback to general pool
    return get_questions_by_company("ALL")
