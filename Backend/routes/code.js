const express = require('express');
const router = express.Router();
const axios = require('axios');
const User = require('../models/User');

// Language ID mapping for Judge0 API (latest versions for unauthenticated users)
const LANGUAGE_IDS = {
    cpp: 54,     // C++ (GCC 9.2.0)
    python: 71,  // Python (3.8.1)
    python3: 71, // Python 3 alias
    c: 50,       // C (GCC 9.2.0)
    java: 62,    // Java (OpenJDK 13.0.1)
    javascript: 63, // JavaScript (Node.js 12.14.0)
};

// @route   POST /api/code/run-submit
// @desc    Run or submit code via Judge0 API
// @access  Public

// utility: parse a LeetCode-style input string into an array of test-case blocks.
// If the first line is a positive integer t, we assume the next lines represent
// t cases and distribute the remaining lines evenly among them. This handles
// the common pattern where each case has the same number of lines, and it
// preserves the full multi-line block for each case. If the leading line is not
// a number, the entire string is returned as a single block.
function parseTestCases(str) {
    if (typeof str !== 'string' || str.length === 0) {
        return [];
    }

    // normalize line endings to Unix style so split works reliably
    const cleaned = str.replace(/\r/g, '');
    const lines = cleaned.split('\n');
    const first = lines[0].trim();
    const t = parseInt(first, 10);

    if (!isNaN(t) && t > 0) {
        const rest = lines.slice(1);
        const blocks = [];

        if (rest.length === 0) {
            // nothing after the count; return t empty blocks
            for (let i = 0; i < t; i++) blocks.push('');
            return blocks;
        }

        // if we can split evenly, that's the simplest
        if (rest.length % t === 0) {
            const linesPer = rest.length / t;
            for (let i = 0; i < t; i++) {
                blocks.push(rest.slice(i * linesPer, (i + 1) * linesPer).join('\n'));
            }
            return blocks;
        }

        // otherwise distribute the remainder so earlier cases get one extra line
        let base = Math.floor(rest.length / t);
        let extra = rest.length % t;
        let idx = 0;
        for (let i = 0; i < t; i++) {
            const count = base + (extra > 0 ? 1 : 0);
            extra--;
            blocks.push(rest.slice(idx, idx + count).join('\n'));
            idx += count;
        }
        return blocks;
    }

    // fallback: treat the whole input as a single case
    return [str];
}

router.post('/run-submit', async (req, res) => {
    const { code, input, language, reqType, username, problem } = req.body;

    console.log('[DEBUG] Received request:', {
        language,
        reqType,
        username,
        codeLength: code?.length,
        inputLength: input?.length,
    });

    // Validate required fields
    if (!code || input === undefined || input === null || !language || !reqType) {
        console.error('[VALIDATION ERROR] Missing required fields:', {
            hasCode: !!code,
            hasInput: input !== undefined && input !== null,
            hasLanguage: !!language,
            hasReqType: !!reqType,
        });
        return res.status(400).json({ error: "Code, input, language and reqType are required" });
    }

    // Map language to Judge0 language ID
    const languageId = LANGUAGE_IDS[language.toLowerCase()];
    if (!languageId) {
        console.error('[LANGUAGE ERROR] Unsupported language:', language);
        return res.status(400).json({
            error: `Unsupported language: ${language}. Supported: ${Object.keys(LANGUAGE_IDS).join(', ')}`
        });
    }

    console.log('[DEBUG] Language mapped:', { language, languageId });

    // for run mode we only want to feed the first test case to the judge
    let judgeInput = input;
    if (reqType === 'run') {
    const runInputStr = problem?.runInput || input;

    const blocks = parseTestCases(runInputStr);

    const firstCase = blocks[0] || "";

    judgeInput = "1\n" + firstCase;
}

    const payload = {
        source_code: code,
        language_id: languageId,
        stdin: judgeInput,
    };

    console.log('[DEBUG] Judge0 payload:', { languageId, inputLength: input.length });

    try {
        const response = await axios.post(
            'https://judge0-ce.p.rapidapi.com/submissions',
            payload,
            {
                params: { base64_encoded: false, wait: true },
                headers: {
                    'X-RapidAPI-Key': process.env.RAPIDAPI_KEY || "3516332cffmshc0d34525892c996p1f3d4bjsn8c894003db61",
                    'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log('[DEBUG] Judge0 response status:', response.status);
        console.log('[DEBUG] Judge0 response data:', {
            statusId: response.data?.status?.id,
            output: response.data?.stdout ? 'received' : 'null',
            stderr: response.data?.stderr ? 'received' : 'null',
        });

        if (reqType === 'run') {
            // run mode should evaluate only the first test case
            const runInputStr = problem?.runInput || input;
            const runOutputStr = problem?.runOutput || '';

            const inputBlocks = parseTestCases(runInputStr);
            // runOutput usually doesn't include the leading count; treat as simple lines
            const outputLines = runOutputStr.split('\n');

            const expected = outputLines[0] || '';
            const receivedOutput = response.data?.stdout || '';
            const receivedLines = receivedOutput.split('\n');

            let runResult;
            if (expected.replaceAll(' ', '').trim() === receivedLines[0]?.replaceAll(' ', '').trim()) {
                runResult = { status: 'Accepted' };
            } else {
                runResult = {
                    status: 'Wrong Answer',
                    failedTestCase: {
                        index: 1,
                        input: inputBlocks[0] || runInputStr,
                        expected: expected,
                        output: receivedLines[0] || ''
                    }
                };
            }

            return res.json({ ...response.data, runResult });
        } else if (reqType === 'submit') {
            // LeetCode-style evaluation: Stop at FIRST failing test case
            const inputBlocks = parseTestCases(problem.submitInput || '');
            const expectedLines = (problem.submitOutput || '').split('\n');
            const totalTestCases = inputBlocks.length;
            
            const receivedOutput = response.data?.stdout || '';
            const receivedOutputArr = receivedOutput.split('\n');
            
            let totalSuccessfulTestCases = 0;
            let failedTestCase = null;

            // evaluate sequentially, stopping on the first mismatch
            for (let i = 0; i < totalTestCases; i++) {
                const expectedStr = (expectedLines[i] || '').replaceAll(' ', '').trim();
                const receivedStr = (receivedOutputArr[i] || '').replaceAll(' ', '').trim();

                if (expectedStr) {
                    if (expectedStr === receivedStr) {
                        totalSuccessfulTestCases++;
                    } else {
                        failedTestCase = {
                            index: i + 1,
                            input: inputBlocks[i] || "N/A",
                            expected: expectedLines[i] || "N/A",
                            output: receivedOutputArr[i] || "N/A"
                        };
                        break;
                    }
                }
            }

            console.log('[DEBUG] Test case evaluation:', {
                totalTestCases,
                totalSuccessfulTestCases,
                hasFailed: failedTestCase !== null,
            });

            // Prepare submit result
            let submitResult;
            if (failedTestCase) {
                // Wrong Answer - return first failed test case details
                submitResult = {
                    status: "Wrong Answer",
                    totalPassed: totalSuccessfulTestCases,
                    totalTestCases: totalTestCases,
                    failedTestCase: failedTestCase
                };
            } else {
                // All passed
                submitResult = {
                    status: "Accepted",
                    totalPassed: totalSuccessfulTestCases,
                    totalTestCases: totalTestCases
                };
            }

            // If username and problem details are provided, update user state
            let updatedUser = null;
            if (username && problem) {
                updatedUser = await updateUserProblemStatus(
                    username,
                    problem,
                    language,
                    totalTestCases,
                    totalSuccessfulTestCases
                );
            }

            if (updatedUser) {
                console.log('[DEBUG] Sending updated user back to client for', updatedUser.name || updatedUser._id);
            }

            return res.json({
                ...response.data,
                submitResult,
                updatedUser,
            });
        }
    } catch (error) {
        console.error('[ERROR] Judge0 API error:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message,
        });

        // Forward the exact status from Judge0 if it's a client error (4xx)
        if (error.response?.status >= 400 && error.response?.status < 500) {
            return res.status(error.response.status).json({
                error: error.response?.data?.message || error.response?.data || error.message,
            });
        }

        // Default to 500 for server errors or unknown issues
        return res.status(500).json({
            error: 'Error executing code on Judge0 API',
        });
    }
});


/**
 * Helper fn equivalent to addQuestionSolvedInFirebase
 */
async function updateUserProblemStatus(username, problem, language, totalTestCases, testCasesPassed) {
    try {
        console.log('[DEBUG] Updating user problem status:', { username, problemId: Number(problem.id) });

        const user = await User.findOne({ name: username });
        if (!user) {
            console.warn('[WARN] User not found:', username);
            return null;
        }

        // convert id to number to avoid string/number mismatches
        const incomingProblem = { ...problem, id: Number(problem.id) };

        // compute whether this submission solved the problem
        const solvedNow = totalTestCases > 0 && totalTestCases === testCasesPassed;

        // make a defensive copy of the array so we don't accidentally mutate original reference
        let problemsSolved = user.problemsSolved || [];

        // try to locate existing entry by its problem id
        const idx = problemsSolved.findIndex(
            (p) => Number(p.problem?.id ?? p.problemId) === incomingProblem.id
        );

        if (idx !== -1) {
            // update existing entry
            console.log('[DEBUG] Problem exists, updating fields at index', idx);
            const entry = problemsSolved[idx];

            const alreadySolved = entry.isSolved === true;

            entry.language = language;
            entry.submittedOn = new Date();
            entry.totalTestCases = totalTestCases;
            entry.testCasesPassed = testCasesPassed;
            // once solved, never go back to false
            entry.isSolved = alreadySolved || solvedNow;
            if (!alreadySolved && solvedNow) {
                entry.solvedAt = new Date();
            }
            // maintain the full problem object (converted id)
            entry.problem = incomingProblem;
        } else {
            console.log('[DEBUG] Adding new problem to user profile');
            problemsSolved.push({
                problem: incomingProblem,
                language,
                submittedOn: new Date(),
                totalTestCases,
                testCasesPassed,
                isSolved: solvedNow,
                solvedAt: solvedNow ? new Date() : null,
            });
        }

        // update heatmap - use 1-based month for human readability
        const today = new Date();
        const dateStr = `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`;
        const currentMapVal = user.heatmapData.get(dateStr) || 0;
        // create a new Map instance so Mongoose sees a change
        user.heatmapData = new Map(user.heatmapData);
        user.heatmapData.set(dateStr, currentMapVal + 1);
        user.markModified('heatmapData');

        user.problemsSolved = problemsSolved;
        const saved = await user.save();

        console.log('[SUCCESS] User problem status updated');

        // convert to plain object and ensure heatmapData is a normal object
        let result = saved.toObject();
        if (result.heatmapData instanceof Map) {
            result.heatmapData = Object.fromEntries(result.heatmapData);
        }
        return result;
    } catch (error) {
        console.error('[ERROR] Updating user problem status:', error);
        return null;
    }
}

module.exports = router;
