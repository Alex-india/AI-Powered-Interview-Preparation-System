"""
Comprehensive Database of Real-World Technical Coding Questions
Includes LeetCode Hard/Medium/Easy, MNC Coding rounds (TCS Digital, Amazon SDE, Google, Microsoft),
and Full-Stack/Backend implementation problems.
"""

CODING_CHALLENGES = [
    {
        "id": "code-1",
        "title": "Two Sum",
        "question": "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nExample 1:\nInput: nums = [2, 7, 11, 15], target = 9\nOutput: [0, 1] (Because nums[0] + nums[1] == 9)\n\nConstraints:\n- 2 <= nums.length <= 10^4\n- -10^9 <= nums[i] <= 10^9\n- Target Time Complexity: O(N) using Hash Map.",
        "category": "Arrays & Hash Map",
        "difficulty": "beginner",
        "question_type": "coding",
        "starter_code": "def two_sum(nums: list[int], target: int) -> list[int]:\n    # Write your O(N) solution here\n    hash_map = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in hash_map:\n            return [hash_map[complement], i]\n        hash_map[num] = i\n    return []\n",
        "starter_codes": {
            "python": "def two_sum(nums: list[int], target: int) -> list[int]:\n    # Write your solution here\n    pass\n",
            "javascript": "function twoSum(nums, target) {\n    // Write your solution here\n    const map = new Map();\n    \n}\n",
            "java": "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your solution here\n        return new int[]{};\n    }\n}\n",
            "cpp": "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your solution here\n        return {};\n    }\n};\n",
            "sql": "-- Not applicable for algorithmic DSA problems\n"
        },
        "test_cases": [
            {"input": "nums = [2, 7, 11, 15], target = 9", "expected_output": "[0, 1]", "description": "Standard two elements matching target"},
            {"input": "nums = [3, 2, 4], target = 6", "expected_output": "[1, 2]", "description": "Elements not starting at index 0"},
            {"input": "nums = [3, 3], target = 6", "expected_output": "[0, 1]", "description": "Duplicate values adding up to target"}
        ]
    },
    {
        "id": "code-2",
        "title": "Reverse a Singly Linked List",
        "question": "Given the `head` of a singly linked list, reverse the list, and return the reversed list.\n\nExample:\nInput: head = [1, 2, 3, 4, 5]\nOutput: [5, 4, 3, 2, 1]\n\nConstraints:\n- Number of nodes in the list is between 0 and 5000.\n- -5000 <= Node.val <= 5000\n- Follow-up: Implement both iteratively and recursively.",
        "category": "Linked Lists",
        "difficulty": "beginner",
        "question_type": "coding",
        "starter_code": "# Definition for singly-linked list node:\n# class ListNode:\n#     def __init__(self, val=0, next=None):\n#         self.val = val\n#         self.next = next\n\ndef reverse_list(head):\n    prev = None\n    curr = head\n    while curr:\n        nxt = curr.next\n        curr.next = prev\n        prev = curr\n        curr = nxt\n    return prev\n",
        "starter_codes": {
            "python": "def reverse_list(head):\n    # Write your iterative or recursive reversal here\n    pass\n",
            "javascript": "function reverseList(head) {\n    // Reverses a singly linked list in O(N) time and O(1) space\n    let prev = null;\n    let curr = head;\n    while (curr) {\n        let next = curr.next;\n        curr.next = prev;\n        prev = curr;\n        curr = next;\n    }\n    return prev;\n}\n",
            "java": "class Solution {\n    public ListNode reverseList(ListNode head) {\n        ListNode prev = null;\n        ListNode curr = head;\n        while (curr != null) {\n            ListNode next = curr.next;\n            curr.next = prev;\n            prev = curr;\n            curr = next;\n        }\n        return prev;\n    }\n}\n",
            "cpp": "class Solution {\npublic:\n    ListNode* reverseList(ListNode* head) {\n        ListNode *prev = nullptr, *curr = head;\n        while (curr) {\n            ListNode* next = curr->next;\n            curr->next = prev;\n            prev = curr;\n            curr = next;\n        }\n        return prev;\n    }\n};\n"
        },
        "test_cases": [
            {"input": "head = [1, 2, 3, 4, 5]", "expected_output": "[5, 4, 3, 2, 1]", "description": "Multi-node list reversal"},
            {"input": "head = [1, 2]", "expected_output": "[2, 1]", "description": "Two-node list reversal"},
            {"input": "head = []", "expected_output": "[]", "description": "Empty list edge case"}
        ]
    },
    {
        "id": "code-3",
        "title": "Valid Parentheses",
        "question": "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.\n\nExample 1: Input: s = \"()[]{}\" -> Output: true\nExample 2: Input: s = \"(]\" -> Output: false",
        "category": "Stack",
        "difficulty": "beginner",
        "question_type": "coding",
        "starter_code": "def is_valid_parentheses(s: str) -> bool:\n    stack = []\n    mapping = {')': '(', '}': '{', ']': '['}\n    for char in s:\n        if char in mapping:\n            top = stack.pop() if stack else '#'\n            if mapping[char] != top:\n                return False\n        else:\n            stack.append(char)\n    return not stack\n",
        "starter_codes": {
            "python": "def is_valid_parentheses(s: str) -> bool:\n    # Write your solution using a Stack\n    pass\n",
            "javascript": "function isValid(s) {\n    // Stack-based bracket balance validation\n    const stack = [];\n    \n}\n",
            "java": "class Solution {\n    public boolean isValid(String s) {\n        Stack<Character> stack = new Stack<>();\n        return false;\n    }\n}\n",
            "cpp": "class Solution {\npublic:\n    bool isValid(string s) {\n        stack<char> st;\n        return false;\n    }\n};\n"
        },
        "test_cases": [
            {"input": "s = \"()[]{}\"", "expected_output": "true", "description": "Standard balanced sequence"},
            {"input": "s = \"([{}])\"", "expected_output": "true", "description": "Nested balanced brackets"},
            {"input": "s = \"([)]\"", "expected_output": "false", "description": "Mismatched closing order"}
        ]
    },
    {
        "id": "code-4",
        "title": "Best Time to Buy and Sell Stock",
        "question": "You are given an array `prices` where `prices[i]` is the price of a given stock on the `i-th` day.\n\nYou want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.\n\nReturn the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.\n\nExample:\nInput: prices = [7, 1, 5, 3, 6, 4]\nOutput: 5 (Buy on day 2 at price 1 and sell on day 5 at price 6, profit = 6 - 1 = 5).",
        "category": "Greedy & Dynamic Programming",
        "difficulty": "intermediate",
        "question_type": "coding",
        "starter_code": "def max_profit(prices: list[int]) -> int:\n    min_price = float('inf')\n    max_prof = 0\n    for p in prices:\n        if p < min_price:\n            min_price = p\n        elif p - min_price > max_prof:\n            max_prof = p - min_price\n    return max_prof\n",
        "starter_codes": {
            "python": "def max_profit(prices: list[int]) -> int:\n    # Write your one-pass O(N) solution\n    pass\n",
            "javascript": "function maxProfit(prices) {\n    let minPrice = Infinity;\n    let maxProfit = 0;\n    for (let p of prices) {\n        if (p < minPrice) minPrice = p;\n        else if (p - minPrice > maxProfit) maxProfit = p - minPrice;\n    }\n    return maxProfit;\n}\n",
            "java": "class Solution {\n    public int maxProfit(int[] prices) {\n        int minPrice = Integer.MAX_VALUE, maxProfit = 0;\n        for (int p : prices) {\n            if (p < minPrice) minPrice = p;\n            else if (p - minPrice > maxProfit) maxProfit = p - minPrice;\n        }\n        return maxProfit;\n    }\n}\n",
            "cpp": "class Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        int minPrice = INT_MAX, maxProfit = 0;\n        for (int p : prices) {\n            if (p < minPrice) minPrice = p;\n            else if (p - minPrice > maxProfit) maxProfit = p - minPrice;\n        }\n        return maxProfit;\n    }\n};\n"
        },
        "test_cases": [
            {"input": "prices = [7, 1, 5, 3, 6, 4]", "expected_output": "5", "description": "Peak after valley"},
            {"input": "prices = [7, 6, 4, 3, 1]", "expected_output": "0", "description": "Descending prices yield 0 profit"},
            {"input": "prices = [2, 4, 1]", "expected_output": "2", "description": "Valley at the end does not invalidate earlier profit"}
        ]
    },
    {
        "id": "code-5",
        "title": "Longest Substring Without Repeating Characters",
        "question": "Given a string `s`, find the length of the longest substring without duplicate characters.\n\nExample 1:\nInput: s = \"abcabcbb\"\nOutput: 3 (The answer is \"abc\", with the length of 3).\n\nExample 2:\nInput: s = \"bbbbb\"\nOutput: 1 (The answer is \"b\", with length 1).\n\nConstraints:\n- 0 <= s.length <= 5 * 10^4\n- s consists of English letters, digits, symbols and spaces.",
        "category": "Sliding Window",
        "difficulty": "intermediate",
        "question_type": "coding",
        "starter_code": "def length_of_longest_substring(s: str) -> int:\n    char_map = {}\n    left = 0\n    max_len = 0\n    for right, char in enumerate(s):\n        if char in char_map and char_map[char] >= left:\n            left = char_map[char] + 1\n        char_map[char] = right\n        max_len = max(max_len, right - left + 1)\n    return max_len\n",
        "starter_codes": {
            "python": "def length_of_longest_substring(s: str) -> int:\n    # Implement sliding window with dynamic index tracker\n    pass\n",
            "javascript": "function lengthOfLongestSubstring(s) {\n    let map = new Map();\n    let left = 0, maxLen = 0;\n    for (let right = 0; right < s.length; right++) {\n        if (map.has(s[right]) && map.get(s[right]) >= left) {\n            left = map.get(s[right]) + 1;\n        }\n        map.set(s[right], right);\n        maxLen = Math.max(maxLen, right - left + 1);\n    }\n    return maxLen;\n}\n"
        },
        "test_cases": [
            {"input": "s = \"abcabcbb\"", "expected_output": "3", "description": "Repeated sequence with length 3"},
            {"input": "s = \"bbbbb\"", "expected_output": "1", "description": "Single repeating character"},
            {"input": "s = \"pwwkew\"", "expected_output": "3", "description": "Substring is \"wke\", not subsequence"}
        ]
    },
    {
        "id": "code-6",
        "title": "SQL: Second Highest Salary",
        "question": "Write a SQL query to report the second highest salary from the `Employee` table. If there is no second highest salary, the query should report `null`.\n\nTable: Employee\n+----+--------+\n| id | salary |\n+----+--------+\n| 1  | 100    |\n| 2  | 200    |\n| 3  | 300    |\n+----+--------+\nOutput:\n+---------------------+\n| SecondHighestSalary |\n+---------------------+\n| 200                 |\n+---------------------+",
        "category": "SQL Queries",
        "difficulty": "intermediate",
        "question_type": "coding",
        "starter_code": "-- Write a SQL query returning SecondHighestSalary\nSELECT MAX(salary) AS SecondHighestSalary\nFROM Employee\nWHERE salary < (SELECT MAX(salary) FROM Employee);\n",
        "starter_codes": {
            "sql": "-- Write a standard SQL query to find the second highest distinct salary\nSELECT \n    -- Write your query here\n;\n"
        },
        "test_cases": [
            {"input": "Salaries: [100, 200, 300]", "expected_output": "200", "description": "Normal 3-tier distribution"},
            {"input": "Salaries: [100]", "expected_output": "null", "description": "Single entry returns null"}
        ]
    },
    {
        "id": "code-7",
        "title": "Merge Two Sorted Lists",
        "question": "You are given the heads of two sorted linked lists `list1` and `list2`.\n\nMerge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.\n\nReturn the head of the merged linked list.\n\nExample:\nInput: list1 = [1, 2, 4], list2 = [1, 3, 4]\nOutput: [1, 1, 2, 3, 4, 4]",
        "category": "Linked Lists & Two Pointers",
        "difficulty": "beginner",
        "question_type": "coding",
        "starter_code": "def merge_two_lists(list1, list2):\n    dummy = ListNode(0)\n    tail = dummy\n    while list1 and list2:\n        if list1.val < list2.val:\n            tail.next = list1\n            list1 = list1.next\n        else:\n            tail.next = list2\n            list2 = list2.next\n        tail = tail.next\n    tail.next = list1 or list2\n    return dummy.next\n",
        "starter_codes": {
            "python": "def merge_two_lists(list1, list2):\n    # Merge two sorted linked lists in O(N + M)\n    pass\n",
            "javascript": "function mergeTwoLists(list1, list2) {\n    let dummy = { val: 0, next: null };\n    let tail = dummy;\n    while (list1 && list2) {\n        if (list1.val < list2.val) {\n            tail.next = list1; list1 = list1.next;\n        } else {\n            tail.next = list2; list2 = list2.next;\n        }\n        tail = tail.next;\n    }\n    tail.next = list1 || list2;\n    return dummy.next;\n}\n"
        },
        "test_cases": [
            {"input": "list1 = [1, 2, 4], list2 = [1, 3, 4]", "expected_output": "[1, 1, 2, 3, 4, 4]", "description": "Merged sorted list"},
            {"input": "list1 = [], list2 = []", "expected_output": "[]", "description": "Both empty"},
            {"input": "list1 = [], list2 = [0]", "expected_output": "[0]", "description": "One empty list"}
        ]
    },
    {
        "id": "code-8",
        "title": "Maximum Subarray (Kadane's Algorithm)",
        "question": "Given an integer array `nums`, find the subarray with the largest sum, and return its sum.\n\nExample 1:\nInput: nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]\nOutput: 6 (The subarray [4, -1, 2, 1] has the largest sum = 6).\n\nConstraints:\n- 1 <= nums.length <= 10^5\n- -10^4 <= nums[i] <= 10^4\n- Optimal Time Complexity: O(N) using Kadane's Algorithm.",
        "category": "Dynamic Programming",
        "difficulty": "intermediate",
        "question_type": "coding",
        "starter_code": "def max_sub_array(nums: list[int]) -> int:\n    max_so_far = nums[0]\n    current_sum = nums[0]\n    for x in nums[1:]:\n        current_sum = max(x, current_sum + x)\n        max_so_far = max(max_so_far, current_sum)\n    return max_so_far\n",
        "starter_codes": {
            "python": "def max_sub_array(nums: list[int]) -> int:\n    # Implement Kadane's Algorithm in O(N)\n    pass\n",
            "javascript": "function maxSubArray(nums) {\n    let maxSoFar = nums[0], curr = nums[0];\n    for (let i = 1; i < nums.length; i++) {\n        curr = Math.max(nums[i], curr + nums[i]);\n        maxSoFar = Math.max(maxSoFar, curr);\n    }\n    return maxSoFar;\n}\n"
        },
        "test_cases": [
            {"input": "nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]", "expected_output": "6", "description": "Mixed negative and positive elements"},
            {"input": "nums = [1]", "expected_output": "1", "description": "Single element array"},
            {"input": "nums = [5, 4, -1, 7, 8]", "expected_output": "23", "description": "Entire array largely positive"}
        ]
    },
    {
        "id": "code-9",
        "title": "Implement an LRU Cache",
        "question": "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.\n\nImplement the `LRUCache` class:\n- `LRUCache(int capacity)`: Initialize the LRU cache with positive size `capacity`.\n- `int get(int key)`: Return the value of the `key` if it exists, otherwise return -1.\n- `void put(int key, int value)`: Update the value of `key` if it exists. Otherwise, add the key-value pair to the cache. If the number of keys exceeds capacity, evict the least recently used key.\n\nThe functions `get` and `put` must each run in O(1) average time complexity.",
        "category": "System Design & Data Structures",
        "difficulty": "advanced",
        "question_type": "coding",
        "starter_code": "class LRUCache:\n    def __init__(self, capacity: int):\n        from collections import OrderedDict\n        self.cap = capacity\n        self.cache = OrderedDict()\n\n    def get(self, key: int) -> int:\n        if key not in self.cache:\n            return -1\n        self.cache.move_to_end(key)\n        return self.cache[key]\n\n    def put(self, key: int, value: int) -> None:\n        if key in self.cache:\n            self.cache.move_to_end(key)\n        self.cache[key] = value\n        if len(self.cache) > self.cap:\n            self.cache.popitem(last=False)\n",
        "starter_codes": {
            "python": "class LRUCache:\n    def __init__(self, capacity: int):\n        # Initialize doubly-linked list and hash map\n        pass\n\n    def get(self, key: int) -> int:\n        pass\n\n    def put(self, key: int, value: int) -> None:\n        pass\n",
            "javascript": "class LRUCache {\n    constructor(capacity) {\n        this.capacity = capacity;\n        this.cache = new Map();\n    }\n    get(key) {\n        if (!this.cache.has(key)) return -1;\n        const val = this.cache.get(key);\n        this.cache.delete(key);\n        this.cache.set(key, val);\n        return val;\n    }\n    put(key, value) {\n        if (this.cache.has(key)) this.cache.delete(key);\n        this.cache.set(key, value);\n        if (this.cache.size > this.capacity) {\n            this.cache.delete(this.cache.keys().next().value);\n        }\n    }\n}\n"
        },
        "test_cases": [
            {"input": "put(1, 1), put(2, 2), get(1), put(3, 3), get(2)", "expected_output": "[1, -1]", "description": "Key 2 evicted because key 1 was accessed"},
            {"input": "put(1, 10), get(1)", "expected_output": "10", "description": "Basic single key storage"}
        ]
    },
    {
        "id": "code-10",
        "title": "Debounce Function (Frontend Core)",
        "question": "Implement a `debounce` higher-order function that delays invoking the provided `func` until after `wait` milliseconds have elapsed since the last time the debounced function was invoked.\n\nExample usage:\n```javascript\nconst debouncedLog = debounce((msg) => console.log(msg), 300);\ndebouncedLog('A');\ndebouncedLog('B');\ndebouncedLog('C');\n// Only 'C' is executed after 300ms of inactivity.\n```\n\nRequirements:\n- Handle context (`this`) and arguments correctly.\n- Include a `cancel()` method to clear pending executions.",
        "category": "Frontend Core & JavaScript",
        "difficulty": "intermediate",
        "question_type": "coding",
        "starter_code": "function debounce(func, wait) {\n    let timeoutId = null;\n    \n    const debounced = function(...args) {\n        const context = this;\n        if (timeoutId) clearTimeout(timeoutId);\n        timeoutId = setTimeout(() => {\n            func.apply(context, args);\n        }, wait);\n    };\n    \n    debounced.cancel = function() {\n        if (timeoutId) {\n            clearTimeout(timeoutId);\n            timeoutId = null;\n        }\n    };\n    \n    return debounced;\n}\n",
        "starter_codes": {
            "javascript": "function debounce(func, wait) {\n    // Implement debounce closure with clearTimeout\n    let timeout;\n    return function(...args) {\n        \n    };\n}\n",
            "python": "import time\nimport threading\n\ndef debounce(wait_seconds):\n    # Python decorator implementation of debounce\n    def decorator(fn):\n        return fn\n    return decorator\n"
        },
        "test_cases": [
            {"input": "Calls at 0ms, 50ms, 100ms with wait=200ms", "expected_output": "Single execution at 300ms", "description": "Coalesces rapid burst calls"},
            {"input": "debounced.cancel() called before timer fires", "expected_output": "No execution", "description": "Cancellation cleans up timer handle"}
        ]
    },
    {
        "id": "code-11",
        "title": "Coin Change (Minimum Coins)",
        "question": "You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money.\n\nReturn the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.\n\nYou may assume that you have an infinite number of each kind of coin.\n\nExample:\nInput: coins = [1, 2, 5], amount = 11\nOutput: 3 (11 = 5 + 5 + 1)",
        "category": "Dynamic Programming",
        "difficulty": "advanced",
        "question_type": "coding",
        "starter_code": "def coin_change(coins: list[int], amount: int) -> int:\n    dp = [float('inf')] * (amount + 1)\n    dp[0] = 0\n    for c in coins:\n        for i in range(c, amount + 1):\n            dp[i] = min(dp[i], dp[i - c] + 1)\n    return dp[amount] if dp[amount] != float('inf') else -1\n",
        "starter_codes": {
            "python": "def coin_change(coins: list[int], amount: int) -> int:\n    # Implement bottom-up dynamic programming\n    pass\n",
            "javascript": "function coinChange(coins, amount) {\n    const dp = new Array(amount + 1).fill(Infinity);\n    dp[0] = 0;\n    for (let c of coins) {\n        for (let i = c; i <= amount; i++) {\n            dp[i] = Math.min(dp[i], dp[i - c] + 1);\n        }\n    }\n    return dp[amount] === Infinity ? -1 : dp[amount];\n}\n"
        },
        "test_cases": [
            {"input": "coins = [1, 2, 5], amount = 11", "expected_output": "3", "description": "Optimal combination: 5 + 5 + 1"},
            {"input": "coins = [2], amount = 3", "expected_output": "-1", "description": "Impossible amount returns -1"},
            {"input": "coins = [1], amount = 0", "expected_output": "0", "description": "Amount 0 requires 0 coins"}
        ]
    },
    {
        "id": "code-12",
        "title": "Validate Binary Search Tree",
        "question": "Given the `root` of a binary tree, determine if it is a valid binary search tree (BST).\n\nA valid BST is defined as follows:\n- The left subtree of a node contains only nodes with keys strictly less than the node's key.\n- The right subtree of a node contains only nodes with keys strictly greater than the node's key.\n- Both the left and right subtrees must also be binary search trees.\n\nExample 1:\nInput: root = [2, 1, 3]\nOutput: true\n\nExample 2:\nInput: root = [5, 1, 4, null, null, 3, 6]\nOutput: false (Node 4's right child is 6, but 4 is on root 5's right child which violates BST rules).",
        "category": "Trees & Recursion",
        "difficulty": "intermediate",
        "question_type": "coding",
        "starter_code": "def is_valid_bst(root) -> bool:\n    def validate(node, low=-float('inf'), high=float('inf')):\n        if not node:\n            return True\n        if not (low < node.val < high):\n            return False\n        return validate(node.left, low, node.val) and validate(node.right, node.val, high)\n    return validate(root)\n",
        "starter_codes": {
            "python": "def is_valid_bst(root) -> bool:\n    # Validate range bounds with low and high limits\n    pass\n",
            "javascript": "function isValidBST(root) {\n    function validate(node, low, high) {\n        if (!node) return true;\n        if (node.val <= low || node.val >= high) return false;\n        return validate(node.left, low, node.val) && validate(node.right, node.val, high);\n    }\n    return validate(root, -Infinity, Infinity);\n}\n"
        },
        "test_cases": [
            {"input": "root = [2, 1, 3]", "expected_output": "true", "description": "Valid 3-node BST"},
            {"input": "root = [5, 1, 4, null, null, 3, 6]", "expected_output": "false", "description": "Subtree property violated"}
        ]
    }
]

def get_coding_challenges(difficulty=None, category=None, count=5):
    """
    Returns filtered and shuffled coding questions.
    """
    import random
    pool = list(CODING_CHALLENGES)
    if difficulty:
        diff_lower = difficulty.lower()
        matched = [q for q in pool if q.get("difficulty") == diff_lower]
        if matched:
            pool = matched
    if category:
        cat_lower = category.lower()
        matched = [q for q in pool if cat_lower in q.get("category", "").lower()]
        if matched:
            pool = matched
            
    random.shuffle(pool)
    return pool[:count]
