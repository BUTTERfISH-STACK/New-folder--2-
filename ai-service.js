/**
 * vellon x AI Service
 * Integrates HuggingFace Qwen3.5-35B for all AI-powered features
 */

const AIService = {
    // Configuration
    config: {
        baseURL: "https://router.huggingface.co/v1",
        model: "Qwen/Qwen3.5-35B-A3B:novita",
        timeout: 60000,
        maxRetries: 2
    },

    // Initialize - should be called with API key
    init: function(apiKey) {
        this.apiKey = apiKey;
    },

    // Make API request to HuggingFace
    async chat(messages, options = {}) {
        const { temperature = 0.7, max_tokens = 2000 } = options;
        
        const response = await fetch(`${this.config.baseURL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: this.config.model,
                messages: messages,
                temperature: temperature,
                max_tokens: max_tokens
            })
        });

        if (!response.ok) {
            throw new Error(`AI request failed: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    },

    // Simple text completion
    async complete(prompt, options = {}) {
        const messages = [{ role: "user", content: prompt }];
        return this.chat(messages, options);
    },

    // Analyze CV with job description
    async analyzeCVWithAI(cvText, jobDescription = "", options = {}) {
        const { industry = "tech", experienceLevel = "mid", proMode = false } = options;
        
        const prompt = `You are an expert CV/resume analyst and career coach. Analyze the following CV and provide detailed feedback.

CV CONTENT:
${cvText}

${jobDescription ? `JOB DESCRIPTION:\n${jobDescription}\n` : ''}

INDUSTRY: ${industry}
EXPERIENCE LEVEL: ${experienceLevel}

Please provide your analysis in the following JSON format:
{
    "atsScore": <number 0-100>,
    "atsBreakdown": {
        "keywordMatch": <number 0-100>,
        "skillsAlignment": <number 0-100>,
        "structureCompliance": <number 0-100>
    },
    "missingKeywords": [<array of missing important keywords>],
    "matchedKeywords": [<array of keywords found in CV>],
    "structuralWeaknesses": {
        "weakBullets": [<array of phrases to improve>],
        "missingMetrics": [<achievements that need numbers>]
    },
    "personalBrand": {
        "authority": <number 0-10>,
        "clarity": <number 0-10>,
        "leadership": <number 0-10>,
        "analysis": [<array of improvement suggestions>]
    },
    "enhancedSkills": {
        "coreTechnical": [<technical skills to highlight>],
        "toolsAndPlatforms": [<tools to mention>],
        "softSkills": [<soft skills to emphasize>]
    },
    "powerBulletUpgrades": [
        {"original": "<original bullet>", "upgraded": "<improved version>"}
    ],
    "interviewQuestions": [
        {"category": "<category>", "question": "<likely question>"}
    ]
}

Return ONLY valid JSON, no other text.`;

        try {
            const result = await this.complete(prompt, { temperature: 0.3, max_tokens: 3000 });
            return JSON.parse(result);
        } catch (error) {
            console.error("AI CV Analysis error:", error);
            throw error;
        }
    },

    // Generate CV rewrite
    async rewriteCVWithAI(cvText, options = {}) {
        const { industry = "tech" } = options;
        
        const prompt = `You are an expert resume writer. Rewrite the following CV to make it more impactful, professional, and ATS-optimized.

CV CONTENT:
${cvText}

INDUSTRY: ${industry}

Requirements:
1. Replace weak phrases with strong action verbs
2. Add quantifiable metrics where appropriate
3. Improve clarity and impact
4. Keep the same structure but enhance each bullet point
5. Remove personal pronouns (I, me, my)

Provide ONLY the rewritten CV text, no explanations or JSON.`;

        try {
            return await this.complete(prompt, { temperature: 0.5, max_tokens: 4000 });
        } catch (error) {
            console.error("AI CV Rewrite error:", error);
            throw error;
        }
    },

    // Optimize CV for specific job
    async optimizeForJobWithAI(cvText, jobDescription) {
        const prompt = `You are an ATS (Applicant Tracking System) expert. Optimize this CV to match the job description.

CV:
${cvText}

JOB DESCRIPTION:
${jobDescription}

Provide:
1. A list of missing keywords from the job description that should be added to the CV
2. An optimized professional summary tailored to this role
3. Suggestions for reordering or emphasizing content

Return as JSON:
{
    "missingKeywords": [<array>],
    "optimizedSummary": "<summary text>",
    "contentSuggestions": [<array of suggestions>]
}`;

        try {
            const result = await this.complete(prompt, { temperature: 0.3, max_tokens: 2000 });
            return JSON.parse(result);
        } catch (error) {
            console.error("AI Job Optimization error:", error);
            throw error;
        }
    },

    // Generate interview questions
    async generateInterviewQuestionsWithAI(cvText, jobDescription = "") {
        const prompt = `Based on this CV${jobDescription ? " and job description" : ""}, generate the most likely interview questions.

CV:
${cvText}
${jobDescription ? `\nJOB DESCRIPTION:\n${jobDescription}` : ""}

Generate 5 likely interview questions in JSON format:
[
    {"category": "<category>", "question": "<question>"}
]

Categories could be: Leadership, Technical, Behavioral, Problem-Solving, Role-Specific, Achievements`;

        try {
            const result = await this.complete(prompt, { temperature: 0.5, max_tokens: 1500 });
            return JSON.parse(result);
        } catch (error) {
            console.error("AI Interview Questions error:", error);
            throw error;
        }
    },

    // Generate STAR method answers
    async generateSTARAnswersWithAI(cvText) {
        const prompt = `Based on this CV, generate 3 STAR method interview answers for common questions.

CV:
${cvText}

Generate in JSON format:
[
    {
        "question": "<common interview question>",
        "star": {
            "situation": "<describe the situation>",
            "task": "<describe your responsibility>",
            "action": "<describe what you did>",
            "result": "<describe the outcome with numbers if possible>"
        }
    }
]`;

        try {
            const result = await this.complete(prompt, { temperature: 0.6, max_tokens: 2000 });
            return JSON.parse(result);
        } catch (error) {
            console.error("AI STAR Answers error:", error);
            throw error;
        }
    },

    // Generate LinkedIn content
    async generateLinkedInContentWithAI(cvText, contentType = "headline") {
        const prompt = `Generate a ${contentType === "headline" ? "LinkedIn headline (under 220 characters)" : "LinkedIn About section (under 2600 characters)"} for this professional.

CV:
${cvText}

${contentType === "headline" 
    ? "Format: Job Title | Key Skills | Years Experience" 
    : "Write in first person, highlight achievements and value proposition"}

Return ONLY the ${contentType}, no explanations.`;

        try {
            return await this.complete(prompt, { temperature: 0.6, max_tokens: contentType === "headline" ? 300 : 3000 });
        } catch (error) {
            console.error("AI LinkedIn generation error:", error);
            throw error;
        }
    },

    // Generate interview preparation
    async generateInterviewPrepWithAI(cvText, jobDescription = "") {
        const prompt = `Create interview preparation materials for this candidate.

CV:
${cvText}
${jobDescription ? `\nTARGET JOB:\n${jobDescription}` : ""}

Provide:
1. Key talking points from their experience
2. 3-5 strength examples they should mention
3. 2-3 potential weakness/area for improvement to address
4. Questions they should ask the interviewer

Return as JSON:
{
    "talkingPoints": [<array>],
    "strengthExamples": [<array>],
    "weaknessToAddress": [<array>],
    "questionsToAsk": [<array>]
}`;

        try {
            const result = await this.complete(prompt, { temperature: 0.4, max_tokens: 2000 });
            return JSON.parse(result);
        } catch (error) {
            console.error("AI Interview Prep error:", error);
            throw error;
        }
    },

    // Generate cover letter
    async generateCoverLetterWithAI(cvText, jobDescription, companyName = "") {
        const prompt = `Write a professional cover letter for this job application.

CANDIDATE CV:
${cvText}

JOB DESCRIPTION:
${jobDescription}

${companyName ? `COMPANY: ${companyName}` : ""}

Requirements:
- Professional tone
- Highlight relevant experience
- Match skills to job requirements
- Call to action at the end
- No placeholder text

Return ONLY the cover letter, no JSON or explanations.`;

        try {
            return await this.complete(prompt, { temperature: 0.5, max_tokens: 2000 });
        } catch (error) {
            console.error("AI Cover Letter error:", error);
            throw error;
        }
    },

    // Analyze image (for image descriptions)
    async analyzeImageWithAI(imageUrl, question = "Describe this image in detail.") {
        const messages = [
            {
                role: "user",
                content: [
                    { type: "text", text: question },
                    { type: "image_url", image_url: { url: imageUrl } }
                ]
            }
        ];

        try {
            return await this.chat(messages, { temperature: 0.5, max_tokens: 1000 });
        } catch (error) {
            console.error("AI Image Analysis error:", error);
            throw error;
        }
    }
};

// Export for use in browser
window.AIService = AIService;
