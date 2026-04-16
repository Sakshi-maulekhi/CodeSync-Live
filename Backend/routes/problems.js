const express = require('express');
const router = express.Router();
const Problem = require('../models/Problem');

// The original hardcoded problems from firebase.js
const defaultProblems = [
    {
        id: 2,
        title: "Linear Search",
        description: "Given an array of integers nums and an integer target, return the index of the target if it exists in the array, otherwise return -1.",
        input: "First Line contains one integer t - The number of test case.\nEach test case consists of two lines.\nFirst Line of each test case contains n,target - number of elements in arrayand the target value.\nSecond Line of each test case contains an integer array of n elements",
        output: "For each test case output the index of the target if found, otherwise -1.",
        runInput: "2\n4 11\n2 7 11 15\n9 20\n3 2 4 8 9 12 4 2 11",
        runOutput: "2\n-1",
        submitInput: "5\n4 11\n2 7 11 15\n9 20\n3 2 4 8 9 12 4 2 11\n10 19\n1 2 3 4 5 6 7 8 9 10\n5 -8\n-1 -2 -3 -4 -5\n4 5\n2 5 5 11",
        submitOutput: "2\n-1\n-1\n-1\n1",
        difficulty: "Easy",
        video: "https://www.youtube.com/watch?v=oZZ8gNP4V1g",
        tags: ["Array", "Search"],
        explanation: "In first test case, 9 is found at index 1.\nIn the second test case, 20 is not found in the array.",
    }
    // Add more problem objects as needed
];

// @route   GET /getProblems
// @desc    Get all problems (like old firebase route)
// @access  Public
router.get('/', async (req, res) => {
    try {
        const problems = await Problem.find().sort({ id: 1 });
        res.json(problems);
        console.log("Problems sent", Date(Date.now()));
    } catch (error) {
        console.error("Error getting problems:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// @route   POST /api/problems
// @desc    Add a new problem to the database
// @access  Public (adjust authentication as needed)
router.post('/', async (req, res) => {
    try {
        const {
            id,
            title,
            description,
            input,
            output,
            runInput,
            runOutput,
            submitInput,
            submitOutput,
            difficulty,
            video,
            tags,
            explanation,
        } = req.body;

        // basic validation
        if (typeof id !== 'number' || !title) {
            return res.status(400).json({ error: 'id (number) and title are required' });
        }

        const existing = await Problem.findOne({ id });
        if (existing) {
            return res.status(409).json({ error: 'Problem with this id already exists' });
        }

        const problem = new Problem({
            id,
            title,
            description,
            input,
            output,
            runInput,
            runOutput,
            submitInput,
            submitOutput,
            difficulty,
            video,
            tags,
            explanation,
        });

        await problem.save();
        res.status(201).json(problem);
    } catch (error) {
        console.error('Error creating problem:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// @route   GET /setAllProblems
// @desc    Set all problems to Mongo (like old firebase route)
// @access  Public
router.get('/setup', async (req, res) => {
    try {
        // Clear and insert
        await Problem.deleteMany({});
        await Problem.insertMany(defaultProblems);
        res.json({ success: true, message: "Problems inserted successfully" });
    } catch (error) {
        console.error("Error setting problems:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

module.exports = router;
