/**
 * VELLON CV INTELLIGENCE ENGINE
 * Enterprise-grade CV analysis, rewriting, and optimization system
 * Implements ATS optimization, achievement quantification, and interview preparation
 */

// ============================================================================
// CV INTELLIGENCE ENGINE CORE
// ============================================================================

const CVIntelligenceEngine = {
    // Configuration
    config: {
        proMode: false,
        industry: 'tech',
        experienceLevel: 'mid'
    },

    // ATS Keywords by industry
    industryKeywords: {
        tech: [
            'software engineer', 'developer', 'programmer', 'full stack', 'frontend', 'backend',
            'agile', 'scrum', 'devops', 'cloud', 'aws', 'azure', 'gcp', 'docker', 'kubernetes',
            'python', 'javascript', 'java', 'react', 'angular', 'vue', 'node', 'sql', 'nosql',
            'machine learning', 'ai', 'data science', 'analytics', 'api', 'rest', 'graphql',
            'microservices', 'architecture', 'ci/cd', 'git', 'pipeline', 'testing', 'automation',
            'lead', 'senior', 'principal', 'staff', 'architect', 'tech lead', 'manager',
            'performance', 'optimization', 'scalability', 'security', 'code review'
        ],
        finance: [
            'financial analyst', 'accountant', 'audit', 'compliance', 'risk management',
            'investment', 'portfolio', 'trading', 'banking', 'fintech', 'blockchain',
            'excel', 'sql', 'python', 'financial modeling', 'valuation', 'dcf',
            'budgeting', 'forecasting', 'reporting', 'gaap', 'ifrs', 'tax', 'taxation',
            'cpa', 'cfa', 'mba', 'cfo', 'controller', 'treasury', 'audit', 'sox',
            'due diligence', 'mergers', 'acquisitions', 'ipo', 'equity', 'debt'
        ],
        marketing: [
            'digital marketing', 'seo', 'sem', 'ppc', 'content marketing', 'social media',
            'brand management', 'marketing strategy', 'campaign', 'analytics', 'google ads',
            'facebook ads', 'linkedin', 'influencer', 'email marketing', 'automation',
            'hubspot', 'salesforce', 'market research', 'competitive analysis', '定位',
            'advertising', 'copywriting', 'creative', 'design', 'video', 'production',
            'growth hacking', 'acquisition', 'retention', 'engagement', 'conversion'
        ],
        healthcare: [
            'healthcare', 'medical', 'clinical', 'patient care', 'nursing', 'physician',
            'hospital', 'clinic', 'healthcare compliance', 'hipaa', 'emr', 'ehr',
            'cpt', 'icd-10', 'medicare', 'medicaid', 'insurance', 'billing',
            'quality assurance', 'regulatory', 'fda', 'clinical trials', 'research',
            'telemedicine', 'healthtech', 'patient outcomes', 'care coordination'
        ],
        general: [
            'leadership', 'management', 'project management', 'strategic', 'planning',
            'budget', 'forecast', 'analysis', 'reporting', 'stakeholder', 'communication',
            'team', 'collaboration', 'problem solving', 'innovation', 'continuous improvement',
            'stakeholder management', 'vendor management', 'contract negotiation',
            'process improvement', 'operational excellence', 'training', 'mentoring'
        ]
    },

    // Action verbs by category
    actionVerbs: {
        leadership: ['Led', 'Directed', 'Managed', 'Spearheaded', 'Championed', 'Orchestrated', 'Governed', 'Mentored'],
        achievement: ['Achieved', 'Exceeded', 'Delivered', 'Transformed', 'Revolutionized', 'Pioneered', 'Accelerated', 'Optimized'],
        technical: ['Developed', 'Implemented', 'Architected', 'Engineered', 'Designed', 'Built', 'Created', 'Established'],
        results: ['Increased', 'Decreased', 'Reduced', 'Improved', 'Generated', 'Produced', 'Delivered', 'Executed'],
        collaboration: ['Collaborated', 'Partnered', 'Coordinated', 'Facilitated', 'Negotiated', 'Influenced', 'Aligned']
    },

    // Weak phrases to avoid
    weakPhrases: [
        'responsible for', 'duties include', 'worked on', 'helped with', 'assisted in',
        'made improvements', 'did', 'handled', 'managed some', 'participated in',
        'was involved in', 'known for', 'experienced in', 'skilled at', 'good at',
        'familiar with', 'knowledge of', 'basic understanding'
    ],

    // =========================================================================
    // PHASE 1: STRUCTURAL AUDIT
    // =========================================================================

    /**
     * Perform comprehensive ATS analysis
     */
    analyzeATS: function(cvText, jobDescription = '', options = {}) {
        const keywords = this.getIndustryKeywords(options.industry || 'tech');
        
        // Extract CV content
        const cvLower = cvText.toLowerCase();
        
        // 1. Keyword Match Analysis
        const cvWords = cvLower.split(/\s+/);
        const matchedKeywords = [];
        const missingKeywords = [];
        
        keywords.forEach(keyword => {
            if (cvLower.includes(keyword)) {
                matchedKeywords.push(keyword);
            } else if (jobDescription.toLowerCase().includes(keyword)) {
                missingKeywords.push(keyword);
            }
        });
        
        const keywordMatchScore = Math.round((matchedKeywords.length / keywords.length) * 100);
        
        // 2. Job Description Keyword Match (if provided)
        let jdKeywordMatch = 0;
        let jdMissingKeywords = [];
        if (jobDescription) {
            const jdKeywords = this.extractKeywords(jobDescription);
            const matchedJD = jdKeywords.filter(k => cvLower.includes(k));
            jdKeywordMatch = Math.round((matchedJD.length / jdKeywords.length) * 100);
            jdMissingKeywords = jdKeywords.filter(k => !cvLower.includes(k));
        }
        
        // 3. Skills Alignment
        const skillsSection = this.extractSkillsSection(cvText);
        const hasTechnicalSkills = skillsSection.technical.length > 0;
        const hasSoftSkills = skillsSection.soft.length > 0;
        const skillCount = skillsSection.technical.length + skillsSection.soft.length;
        
        let skillsScore = 0;
        if (hasTechnicalSkills) skillsScore += 30;
        if (hasSoftSkills) skillsScore += 20;
        if (skillCount >= 5) skillsScore += 15;
        if (skillCount >= 10) skillsScore += 15;
        if (skillCount >= 20) skillsScore += 20;
        
        // 4. Structure Compliance
        let structureScore = 0;
        const hasSummary = /summary|profile|objective|professional/i.test(cvText);
        const hasExperience = /experience|employment|history|work/i.test(cvText);
        const hasEducation = /education|degree|certificate|qualification/i.test(cvText);
        const hasSkills = /skill|competency|expertise|proficient/i.test(cvText);
        
        if (hasSummary) structureScore += 15;
        if (hasExperience) structureScore += 30;
        if (hasEducation) structureScore += 25;
        if (hasSkills) structureScore += 30;
        
        // 5. Formatting Compliance (no tables, special chars)
        let formatScore = 100;
        const tableCount = (cvText.match(/\|/g) || []).length;
        const specialChars = (cvText.match(/[#*@$%^&_~]/g) || []).length;
        
        if (tableCount > 5) formatScore -= 20;
        if (specialChars > 20) formatScore -= 15;
        
        // Calculate overall ATS score
        const overallATS = Math.round(
            (keywordMatchScore * 0.25) +
            (jdKeywordMatch * 0.25) +
            (skillsScore * 0.2) +
            (structureScore * 0.2) +
            (formatScore * 0.1)
        );
        
        return {
            overallATS: Math.min(overallATS, 100),
            breakdown: {
                keywordMatch: keywordMatchScore,
                jdKeywordMatch: jdKeywordMatch,
                skillsAlignment: skillsScore,
                structureCompliance: structureScore,
                formattingCompliance: formatScore
            },
            missingKeywords: [...new Set([...missingKeywords, ...jdMissingKeywords])].slice(0, 15),
            matchedKeywords: matchedKeywords.slice(0, 20),
            structureAnalysis: {
                hasSummary,
                hasExperience,
                hasEducation,
                hasSkills
            }
        };
    },

    /**
     * Identify structural weaknesses in CV
     */
    analyzeWeaknesses: function(cvText) {
        const weaknesses = {
            missingMetrics: [],
            weakBullets: [],
            passiveLanguage: [],
            vagueResponsibilities: [],
            unnecessaryContent: []
        };
        
        // Check for weak phrases
        this.weakPhrases.forEach(phrase => {
            const regex = new RegExp(phrase, 'gi');
            const matches = cvText.match(regex);
            if (matches) {
                weaknesses.weakBullets.push({
                    phrase: phrase,
                    count: matches.length,
                    suggestion: this.getStrongerAlternative(phrase)
                });
            }
        });
        
        // Check for passive language
        const passivePatterns = [
            /\b(was|were|been|being)\s+\w+ed\b/gi,
            /\b(was|were)\s+responsible\b/gi,
            /\b(was|were)\s+in charge\b/gi
        ];
        
        passivePatterns.forEach(pattern => {
            const matches = cvText.match(pattern);
            if (matches) {
                weaknesses.passiveLanguage.push(...matches);
            }
        });
        
        // Check for vague responsibilities (no action, no result)
        const lines = cvText.split('\n');
        lines.forEach(line => {
            const isVague = /managed|handled|responsible|duties/i.test(line) && 
                           !/\d+%|\$\d+|\d+x|increased|decreased|improved|achieved/i.test(line);
            if (isVague && line.length > 30) {
                weaknesses.vagueResponsibilities.push(line.trim());
            }
        });
        
        // Check for missing metrics in achievement bullets
        const achievementKeywords = ['led', 'managed', 'developed', 'created', 'implemented'];
        lines.forEach(line => {
            const isAchievement = achievementKeywords.some(k => line.toLowerCase().includes(k));
            const hasMetric = /\d+%|\$\d+|\d+\s*(year|month|day|hour)|increased|decreased|improved|achieved|saved/i.test(line);
            if (isAchievement && !hasMetric && line.length > 30) {
                weaknesses.missingMetrics.push(line.trim());
            }
        });
        
        return weaknesses;
    },

    // =========================================================================
    // PHASE 2: DEEP INTELLIGENT REWRITE
    // =========================================================================

    /**
     * Rewrite CV with improvements
     */
    rewriteCV: function(cvText, options = {}) {
        const { industry = 'tech', experienceLevel = 'mid' } = options;
        
        let rewritten = cvText;
        
        // 1. Fix weak phrases
        this.weakPhrases.forEach(phrase => {
            const regex = new RegExp(phrase, 'gi');
            rewritten = rewritten.replace(regex, (match) => {
                return this.getStrongerAlternative(phrase);
            });
        });
        
        // 2. Quantify achievements
        rewritten = this.quantifyAchievements(rewritten);
        
        // 3. Strengthen action verbs
        rewritten = this.strengthenActionVerbs(rewritten);
        
        // 4. Remove personal pronouns
        rewritten = rewritten.replace(/\b(I|me|my|we|our|us)\b/g, '');
        
        // 5. Fix tense (past for previous roles)
        rewritten = this.fixTense(rewritten);
        
        return rewritten;
    },

    /**
     * Quantify vague achievements with realistic metrics
     */
    quantifyAchievements: function(text) {
        const lines = text.split('\n');
        const quantified = lines.map(line => {
            // If line already has metrics, keep it
            if (/\d+%|\$\d+|\d+x/i.test(line)) {
                return line;
            }
            
            // Add metrics to achievement lines
            const achievementTriggers = [
                'led', 'managed', 'directed', 'spearheaded', 'championed',
                'developed', 'created', 'built', 'implemented', 'designed',
                'increased', 'improved', 'optimized', 'reduced', 'saved',
                'achieved', 'exceeded', 'delivered'
            ];
            
            const hasTrigger = achievementTriggers.some(t => 
                line.toLowerCase().includes(t)
            );
            
            if (hasTrigger && line.length > 40) {
                // Add appropriate metric based on context
                let metric = '';
                if (/team|staff|people|employee/i.test(line)) {
                    metric = ' [Impact: Led team of 5-10 members]';
                } else if (/revenue|sales|profit| income/i.test(line)) {
                    metric = ' [Impact: Drove 20-30% improvement]';
                } else if (/performance|speed|efficiency/i.test(line)) {
                    metric = ' [Impact: Achieved 40% optimization]';
                } else if (/customer|client|user/i.test(line)) {
                    metric = ' [Impact: Improved satisfaction by 25%]';
                } else {
                    metric = ' [Impact: Delivered measurable business value]';
                }
                
                return line + metric;
            }
            
            return line;
        });
        
        return quantified.join('\n');
    },

    /**
     * Strengthen weak action verbs
     */
    strengthenActionVerbs: function(text) {
        const weakToStrong = {
            'helped': 'Facilitated',
            'assisted': 'Supported',
            'worked on': 'Contributed to',
            'participated in': 'Engaged in',
            'made': 'Delivered',
            'did': 'Executed',
            'handled': 'Administered',
            'managed some': 'Oversaw',
            'known for': 'Recognized for',
            'experienced in': 'Proficient in',
            'skilled at': 'Expert in'
        };
        
        let result = text;
        Object.entries(weakToStrong).forEach(([weak, strong]) => {
            const regex = new RegExp(weak, 'gi');
            result = result.replace(regex, strong);
        });
        
        return result;
    },

    /**
     * Get stronger alternative for weak phrase
     */
    getStrongerAlternative: function(phrase) {
        const alternatives = {
            'responsible for': 'Owned',
            'duties include': 'Key responsibilities:',
            'worked on': 'Contributed to',
            'helped with': 'Supported',
            'assisted in': 'Facilitated',
            'made improvements': 'Drove improvements',
            'did': 'Executed',
            'handled': 'Administered',
            'managed some': 'Led',
            'participated in': 'Engaged in',
            'was involved in': 'Played key role in',
            'known for': 'Recognized for',
            'experienced in': 'Demonstrated expertise in',
            'skilled at': 'Proficient in',
            'good at': 'Exceled in',
            'familiar with': 'Knowledgeable in',
            'knowledge of': 'Expertise in',
            'basic understanding': 'Foundational knowledge of'
        };
        
        return alternatives[phrase.toLowerCase()] || phrase;
    },

    /**
     * Fix tense consistency
     */
    fixTense: function(text) {
        // Simple past tense fixes for common verbs
        const presentToPast = {
            'lead': 'led',
            'manage': 'managed',
            'develop': 'developed',
            'create': 'created',
            'implement': 'implemented',
            'design': 'designed',
            'build': 'built',
            'increase': 'increased',
            'improve': 'improved',
            'reduce': 'reduced',
            'achieve': 'achieved',
            'deliver': 'delivered'
        };
        
        let result = text;
        Object.entries(presentToPast).forEach(([present, past]) => {
            // Replace present tense at start of lines/bullets
            const regex = new RegExp(`^${present}\\b`, 'gim');
            result = result.replace(regex, past);
        });
        
        return result;
    },

    // =========================================================================
    // PHASE 3: ROLE-SPECIFIC OPTIMIZATION
    // =========================================================================

    /**
     * Optimize CV for specific job description
     */
    optimizeForRole: function(cvText, jobDescription, options = {}) {
        const jdKeywords = this.extractKeywords(jobDescription);
        const cvLower = cvText.toLowerCase();
        
        // Find missing keywords from JD
        const missing = jdKeywords.filter(k => !cvLower.includes(k));
        
        // Generate optimized summary
        const summary = this.generateOptimizedSummary(cvText, jobDescription, options);
        
        // Reorder and prioritize content
        const prioritized = this.prioritizeContent(cvText, jdKeywords);
        
        return {
            optimizedSummary: summary,
            priorityKeywords: missing.slice(0, 10),
            prioritizedContent: prioritized,
            alignmentScore: Math.round(((jdKeywords.length - missing.length) / jdKeywords.length) * 100)
        };
    },

    /**
     * Generate optimized professional summary
     */
    generateOptimizedSummary: function(cvText, jobDescription, options = {}) {
        const name = this.extractName(cvText) || 'Professional';
        const title = this.extractCurrentTitle(cvText) || options.title || 'Professional';
        const skills = this.extractTopSkills(cvText);
        const yearsExp = this.estimateExperience(cvText);
        
        // Get key terms from job description
        const jdTerms = this.extractKeywords(jobDescription).slice(0, 5);
        
        let summary = `${name} is a ${yearsExp}+ year experienced ${title} with demonstrated expertise in ${skills.slice(0, 3).join(', ')}.`;
        
        if (jdTerms.length > 0) {
            summary += ` Proven ability to leverage ${jdTerms.slice(0, 2).join(' and ')} to drive business results.`;
        }
        
        summary += ' Known for delivering high-impact solutions and leading cross-functional teams.';
        
        return summary;
    },

    /**
     * Prioritize content based on job description keywords
     */
    prioritizeContent: function(cvText, priorityKeywords) {
        const sections = this.extractSections(cvText);
        const scored = [];
        
        Object.entries(sections).forEach(([section, content]) => {
            const contentLower = content.toLowerCase();
            const matches = priorityKeywords.filter(k => contentLower.includes(k));
            scored.push({
                section,
                content,
                relevance: matches.length,
                keywords: matches
            });
        });
        
        // Sort by relevance
        scored.sort((a, b) => b.relevance - a.relevance);
        
        return scored;
    },

    // =========================================================================
    // PHASE 4: COMPETITIVE ENHANCEMENTS
    // =========================================================================

    /**
     * Generate enhanced skills section
     */
    enhanceSkillsSection: function(cvText) {
        const skills = this.extractSkillsSection(cvText);
        
        return {
            coreTechnical: skills.technical.slice(0, 10),
            toolsAndPlatforms: this.identifyTools(skills.technical),
            softSkills: skills.soft.slice(0, 5).map(s => this.strengthenSoftSkill(s))
        };
    },

    /**
     * Identify tools and platforms from skills
     */
    identifyTools: function(skills) {
        const toolKeywords = [
            'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'git',
            'jira', 'confluence', 'slack', 'zoom', 'teams', 'salesforce',
            'hubspot', 'tableau', 'power bi', 'excel', 'python', 'r', 'sql',
            'react', 'angular', 'vue', 'node', 'django', 'spring', 'rails'
        ];
        
        return skills.filter(s => 
            toolKeywords.some(t => s.toLowerCase().includes(t))
        );
    },

    /**
     * Strengthen soft skill phrasing
     */
    strengthenSoftSkill: function(skill) {
        const strongPhrases = {
            'leadership': 'Strategic Leadership & Team Direction',
            'communication': 'Executive-level Communication',
            'problem solving': 'Complex Problem Resolution',
            'teamwork': 'Cross-functional Collaboration',
            'time management': 'High-performance Time Management',
            'analytical': 'Strategic Analytical Thinking',
            'creative': 'Innovative Solution Design',
            'adaptable': 'Rapid Adaptation & Learning'
        };
        
        return strongPhrases[skill.toLowerCase()] || skill;
    },

    /**
     * Upgrade weak bullets to power bullets
     */
    upgradePowerBullets: function(cvText) {
        const bullets = cvText.split('\n').filter(l => l.trim().startsWith('•') || l.trim().startsWith('-'));
        const weakBullets = [];
        
        bullets.forEach((bullet, index) => {
            const hasWeakPhrase = this.weakPhrases.some(w => 
                bullet.toLowerCase().includes(w)
            );
            const hasMetric = /\d+%|\$\d+|\d+x/i.test(bullet);
            
            if (hasWeakPhrase || !hasMetric) {
                weakBullets.push({
                    original: bullet,
                    upgraded: this.upgradeBullet(bullet),
                    reason: hasWeakPhrase ? 'Weak action verb' : 'Missing metrics'
                });
            }
        });
        
        return weakBullets.slice(0, 5); // Return top 5
    },

    /**
     * Upgrade a single bullet point
     */
    upgradeBullet: function(bullet) {
        let upgraded = this.getStrongerAlternative(bullet);
        
        // Add metrics if missing
        if (!/\d+%|\$\d+|\d+x/i.test(upgraded)) {
            upgraded = this.addSuggestedMetric(upgraded);
        }
        
        return upgraded;
    },

    /**
     * Add suggested metric placeholder
     */
    addSuggestedMetric: function(text) {
        if (/team|staff|people/i.test(text)) {
            return text.replace(/[.!?]$/, ', leading a team of 5-10 members to achieve targets.');
        }
        if (/increase|improve|grow/i.test(text)) {
            return text.replace(/[.!?]$/, ', driving measurable improvements.');
        }
        return text.replace(/[.!?]$/, ', delivering quantifiable results.');
    },

    // =========================================================================
    // PHASE 5: PERSONAL BRAND ANALYSIS
    // =========================================================================

    /**
     * Analyze personal brand
     */
    analyzePersonalBrand: function(cvText) {
        const scores = {
            authority: this.scoreAuthority(cvText),
            clarity: this.scoreClarity(cvText),
            leadership: this.scoreLeadership(cvText),
            marketCompetitiveness: this.scoreMarket(cvText)
        };
        
        const total = (scores.authority + scores.clarity + scores.leadership + scores.marketCompetitiveness) / 4;
        
        return {
            ...scores,
            overall: Math.round(total),
            analysis: this.getBrandAnalysis(scores)
        };
    },

    scoreAuthority: function(cvText) {
        let score = 5;
        
        const authorityIndicators = [
            { pattern: /principal|staff|director|vp|head of|chief/i, points: 3 },
            { pattern: /expert|specialist|advisor|consultant/i, points: 2 },
            { pattern: /award|recognition|certified|featured/i, points: 2 },
            { pattern: / keynote|speaker|thought leader/i, points: 2 },
            { pattern: /published|patent|ipr/i, points: 2 }
        ];
        
        authorityIndicators.forEach(indicator => {
            if (indicator.pattern.test(cvText)) score += indicator.points;
        });
        
        return Math.min(score, 10);
    },

    scoreClarity: function(cvText) {
        let score = 6;
        
        // Check for clear structure
        if (/summary|profile|objective/i.test(cvText)) score += 1;
        if (/experience|employment/i.test(cvText)) score += 1;
        
        // Check for quantifiable achievements
        const metrics = cvText.match(/\d+%|\$\d+|\d+x|\d+\s*(year|month)/gi) || [];
        if (metrics.length > 5) score += 2;
        
        // Penalize for excessive length
        if (cvText.length > 3000) score -= 1;
        
        return Math.min(Math.max(score, 0), 10);
    },

    scoreLeadership: function(cvText) {
        let score = 4;
        
        const leadershipIndicators = [
            { pattern: /led|directed|managed|head|chief/i, points: 2 },
            { pattern: /team of \d+|\d+\s*(person|people|employee)/i, points: 2 },
            { pattern: /mentor|coach|develop/i, points: 1 },
            { pattern: /budget of|$\d+|revenue|profit/i, points: 2 },
            { pattern: /strategic|vision|roadmap/i, points: 1 }
        ];
        
        leadershipIndicators.forEach(indicator => {
            if (indicator.pattern.test(cvText)) score += indicator.points;
        });
        
        return Math.min(score, 10);
    },

    scoreMarket: function(cvText) {
        let score = 5;
        
        const marketIndicators = [
            { pattern: /amazon|google|microsoft|meta|apple|netflix/i, points: 2 },
            { pattern: /fortune 500|fortune \d+|f500/i, points: 2 },
            { pattern: /startup|series [a-z]|ipo|acquisition/i, points: 1 },
            { pattern: /consulting|investment bank|m&a/i, points: 1 },
            { pattern: /phd|mba|cfa|cpa|md/i, points: 1 }
        ];
        
        marketIndicators.forEach(indicator => {
            if (indicator.pattern.test(cvText)) score += indicator.points;
        });
        
        return Math.min(score, 10);
    },

    getBrandAnalysis: function(scores) {
        const insights = [];
        
        if (scores.authority < 6) {
            insights.push('Add credentials, certifications, or recognition to establish authority');
        }
        if (scores.clarity < 6) {
            insights.push('Use bullet points with quantified achievements for clarity');
        }
        if (scores.leadership < 6) {
            insights.push('Emphasize team leadership and strategic initiatives');
        }
        if (scores.marketCompetitiveness < 6) {
            insights.push('Highlight industry-relevant experience and notable companies');
        }
        
        return insights;
    },

    // =========================================================================
    // PHASE 6: INTERVIEW INTELLIGENCE
    // =========================================================================

    /**
     * Generate likely interview questions
     */
    generateInterviewQuestions: function(cvText, jobDescription = '') {
        const questions = [];
        
        // Extract key experiences
        const experiences = this.extractExperiences(cvText);
        const skills = this.extractSkillsSection(cvText);
        
        // Leadership questions
        questions.push({
            category: 'Leadership',
            question: 'Tell me about a time you led a team through a challenging project. What was the outcome?',
            likely: true
        });
        
        // Achievement questions
        questions.push({
            category: 'Achievement',
            question: 'What is your greatest professional achievement? How did you measure success?',
            likely: true
        });
        
        // Technical questions based on skills
        if (skills.technical.length > 0) {
            const topSkill = skills.technical[0];
            questions.push({
                category: 'Technical',
                question: `Walk me through your experience with ${topSkill}. What projects have you built?`,
                likely: true
            });
        }
        
        // Problem-solving questions
        questions.push({
            category: 'Problem Solving',
            question: 'Describe a complex technical problem you faced. How did you solve it?',
            likely: true
        });
        
        // Job-specific questions
        if (jobDescription) {
            const jdRequirements = this.extractRequirements(jobDescription);
            jdRequirements.slice(0, 2).forEach(req => {
                questions.push({
                    category: 'Role-Specific',
                    question: `How have you demonstrated experience with ${req}?`,
                    likely: true
                });
            });
        }
        
        // Behavioral questions
        questions.push({
            category: 'Behavioral',
            question: 'Where do you see yourself in 5 years? How does this role fit your career goals?',
            likely: true
        });
        
        return questions.slice(0, 5);
    },

    /**
     * Generate STAR model answers
     */
    generateSTARAnswers: function(cvText) {
        const experiences = this.extractExperiences(cvText);
        const skills = this.extractSkillsSection(cvText);
        
        return [
            {
                question: 'Tell me about a time you led a team to achieve a challenging goal.',
                star: {
                    situation: 'Led a cross-functional team of 8 members facing a tight deadline for a critical product launch',
                    task: 'Deliver a new customer-facing platform within 3 months while maintaining quality standards',
                    action: 'Implemented agile methodology, conducted daily standups, removed blockers, and coordinated efforts across engineering, design, and product teams',
                    result: 'Launched on time with 99.9% uptime, resulting in 40% increase in user engagement and positive customer feedback'
                }
            },
            {
                question: 'Describe a time you improved a process or system.',
                star: {
                    situation: 'Identified inefficient manual reporting process taking 20 hours per week',
                    task: 'Automate data collection and report generation to free up team capacity',
                    action: 'Built Python scripts to extract data from multiple sources, created automated dashboards in Tableau, and established weekly delivery schedule',
                    result: 'Reduced reporting time by 85%, saving 17 hours weekly and enabling real-time insights for stakeholders'
                }
            },
            {
                question: 'Tell me about a time you handled a difficult stakeholder or conflict.',
                star: {
                    situation: 'Faced conflicting priorities between marketing and sales teams on feature roadmap',
                    task: 'Align stakeholders and prioritize features that would drive maximum business value',
                    action: 'Facilitated joint planning sessions, gathered data on customer impact, and created shared OKRs',
                    result: 'Reached consensus on prioritized features, resulting in 25% increase in lead conversion and improved cross-team collaboration'
                }
            }
        ];
    },

    // =========================================================================
    // PHASE 7: PRO MODE FEATURES
    // =========================================================================

    /**
     * Generate LinkedIn headline
     */
    generateLinkedInHeadline: function(cvText, options = {}) {
        const title = this.extractCurrentTitle(cvText) || options.title || 'Professional';
        const skills = this.extractTopSkills(cvText).slice(0, 3);
        const yearsExp = this.estimateExperience(cvText);
        
        return `${title} | ${skills.join(' | ')} | ${yearsExp}+ Years Experience`;
    },

    /**
     * Generate LinkedIn About section
     */
    generateLinkedInAbout: function(cvText) {
        const name = this.extractName(cvText) || 'I';
        const title = this.extractCurrentTitle(cvText) || 'professional';
        const skills = this.extractTopSkills(cvText);
        const achievement = this.extractTopAchievement(cvText);
        
        return `${name} is a results-driven ${title} with expertise in ${skills.slice(0, 5).join(', ')}.\n\n${achievement}\n\nPassionate about solving complex problems and delivering impactful solutions. Always eager to connect with like-minded professionals and explore new opportunities.`;
    },

    /**
     * Generate 30-second elevator pitch
     */
    generateElevatorPitch: function(cvText) {
        const name = this.extractName(cvText) || 'I';
        const title = this.extractCurrentTitle(cvText) || 'professional';
        const skills = this.extractTopSkills(cvText).slice(0, 3);
        const yearsExp = this.estimateExperience(cvText);
        const achievement = this.extractTopAchievement(cvText);
        
        return `Hi, I'm ${name}. I'm a ${yearsExp}+ year ${title} specializing in ${skills.join(', ')}.\n\nMost recently, ${achievement.toLowerCase()}\n\nI'm passionate about leveraging my skills to drive results and am always interested in connecting with others in the industry.`;
    },

    /**
     * Generate salary negotiation talking points
     */
    generateSalaryPoints: function(cvText, jobDescription = '') {
        const skills = this.extractSkillsSection(cvText);
        const yearsExp = this.estimateExperience(cvText);
        
        const marketRate = this.estimateMarketRate(yearsExp, skills.technical.length);
        
        return {
            baseRange: `$${marketRate.minK}-${marketRate.maxK}`,
            totalComp: `$${Math.round(marketRate.maxK * 1.3)}K-${Math.round(marketRate.maxK * 1.5)}K (including bonus/equity)`,
            keyPoints: [
                `${yearsExp}+ years of proven expertise in ${skills.technical.slice(0, 3).join(', ')}`,
                'Demonstrated track record of delivering measurable business impact',
                'Strong technical depth with leadership capabilities',
                'In-demand skill set with limited talent supply',
                'Consider total compensation including equity, bonus, and benefits'
            ],
            negotiationAngle: 'Emphasize unique value proposition and specific achievements that align with company goals'
        };
    },

    /**
     * Generate 90-day onboarding strategy
     */
    generateOnboardingStrategy: function(cvText, jobDescription = '') {
        return {
            days1to30: {
                focus: 'Learning & Observation',
                goals: [
                    'Understand company culture, processes, and team dynamics',
                    'Meet with key stakeholders and team members',
                    'Review existing projects, documentation, and codebases',
                    'Identify quick wins that demonstrate value'
                ]
            },
            days31to60: {
                focus: 'Contributing & Building',
                goals: [
                    'Take ownership of initial projects or features',
                    'Propose improvements based on observations',
                    'Start delivering measurable results',
                    'Build cross-functional relationships'
                ]
            },
            days61to90: {
                focus: 'Leading & Optimizing',
                goals: [
                    'Lead a strategic initiative or project',
                    'Demonstrate thought leadership in area of expertise',
                    'Contribute to team process improvements',
                    'Present 90-day accomplishments and future roadmap'
                ]
            }
        };
    },

    // =========================================================================
    // HELPER FUNCTIONS
    // =========================================================================

    getIndustryKeywords: function(industry) {
        const general = this.industryKeywords.general || [];
        const specific = this.industryKeywords[industry] || this.industryKeywords.tech;
        return [...new Set([...specific, ...general])];
    },

    extractKeywords: function(text) {
        const commonWords = new Set([
            'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
            'of', 'with', 'by', 'from', 'is', 'was', 'are', 'were', 'be', 'been',
            'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
            'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'need',
            'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we',
            'they', 'what', 'which', 'who', 'whom', 'whose', 'where', 'when', 'why',
            'how', 'all', 'each', 'every', 'both', 'few', 'more', 'most', 'other',
            'some', 'such', 'no', 'not', 'only', 'same', 'so', 'than', 'too', 'very',
            'just', 'also', 'now', 'here', 'there', 'then', 'once', 'if', 'because',
            'as', 'until', 'while', 'about', 'against', 'between', 'into', 'through',
            'during', 'before', 'after', 'above', 'below', 'up', 'down', 'out', 'off',
            'over', 'under', 'again', 'further', 'work', 'working', 'job', 'company'
        ]);
        
        const words = text.toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter(w => w.length > 3 && !commonWords.has(w));
        
        // Return unique words that appear more than once
        const wordCounts = {};
        words.forEach(w => {
            wordCounts[w] = (wordCounts[w] || 0) + 1;
        });
        
        return Object.entries(wordCounts)
            .filter(([w, count]) => count >= 1)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 30)
            .map(([w]) => w);
    },

    extractSkillsSection: function(cvText) {
        const technical = [];
        const soft = [];
        
        const techKeywords = [
            'python', 'javascript', 'java', 'c++', 'c#', 'ruby', 'go', 'rust',
            'react', 'angular', 'vue', 'node', 'django', 'flask', 'spring',
            'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform',
            'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch',
            'machine learning', 'deep learning', 'tensorflow', 'pytorch',
            'agile', 'scrum', 'kanban', 'jira', 'git', 'ci/cd', 'devops',
            'data analysis', 'analytics', 'tableau', 'power bi', 'excel',
            'project management', 'product management', 'leadership'
        ];
        
        const softKeywords = [
            'leadership', 'communication', 'teamwork', 'problem solving',
            'analytical', 'creative', 'adaptable', 'time management',
            'strategic', 'collaboration', 'mentoring', 'presentation'
        ];
        
        const cvLower = cvText.toLowerCase();
        
        techKeywords.forEach(skill => {
            if (cvLower.includes(skill)) {
                technical.push(skill.charAt(0).toUpperCase() + skill.slice(1));
            }
        });
        
        softKeywords.forEach(skill => {
            if (cvLower.includes(skill)) {
                soft.push(skill.charAt(0).toUpperCase() + skill.slice(1));
            }
        });
        
        return { technical: [...new Set(technical)], soft: [...new Set(soft)] };
    },

    extractName: function(cvText) {
        const lines = cvText.split('\n');
        // First non-empty line often contains name
        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed && trimmed.length < 40 && !/email|phone|address|summary/i.test(trimmed)) {
                return trimmed.replace(/[^\w\s]/g, '');
            }
        }
        return null;
    },

    extractCurrentTitle: function(cvText) {
        const titlePatterns = [
            /(?:\b(title|role|position)\s*:\s*)?([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})/g,
            /(?:senior|principal|staff|lead|head|director|manager)\s+[a-z]+\s+[a-z]+/gi
        ];
        
        for (const pattern of titlePatterns) {
            const match = cvText.match(pattern);
            if (match) return match[0].replace(/title|role|position|: /gi, '').trim();
        }
        
        return null;
    },

    extractTopSkills: function(cvText) {
        const skills = this.extractSkillsSection(cvText);
        return [...skills.technical, ...skills.soft].slice(0, 8);
    },

    estimateExperience: function(cvText) {
        const yearMatches = cvText.match(/(\d+)\+?\s*years?\s+(of\s+)?experience/gi);
        if (yearMatches) {
            const years = yearMatches[0].match(/\d+/);
            return parseInt(years[0]) || 5;
        }
        
        const expPatterns = [
            /(?:19|20)\d{2}\s*-\s*(?:present|current|19|20)\d{2}/g,
            /since\s+(?:19|20)\d{2}/g
        ];
        
        let earliest = 2026;
        expPatterns.forEach(pattern => {
            const matches = cvText.match(pattern);
            if (matches) {
                matches.forEach(m => {
                    const year = m.match(/(?:19|20)\d{2}/);
                    if (year && parseInt(year[0]) < earliest) {
                        earliest = parseInt(year[0]);
                    }
                });
            }
        });
        
        const years = 2026 - earliest;
        return Math.max(years, 1);
    },

    extractTopAchievement: function(cvText) {
        const achievementKeywords = [
            'increased', 'decreased', 'improved', 'reduced', 'saved',
            'achieved', 'exceeded', 'delivered', 'led', 'built'
        ];
        
        const lines = cvText.split('\n');
        for (const line of lines) {
            const hasKeyword = achievementKeywords.some(k => 
                line.toLowerCase().includes(k)
            );
            const hasMetric = /\d+%|\$\d+|\d+x/i.test(line);
            
            if (hasKeyword && hasMetric) {
                return line.trim().replace(/^[•\-\*]\s*/, '');
            }
        }
        
        return 'Delivered significant impact through technical excellence';
    },

    extractExperiences: function(cvText) {
        const expSection = cvText.match(/experience|employment|work history[\s\S]{0,500}/i);
        if (!expSection) return [];
        
        return expSection[0].split(/(?:company|employer|position|title)[:\-]/i).slice(1);
    },

    extractSections: function(cvText) {
        const sections = {};
        const sectionHeaders = [
            'summary', 'profile', 'objective', 'experience', 'employment',
            'education', 'skills', 'certifications', 'projects'
        ];
        
        sectionHeaders.forEach(header => {
            const regex = new RegExp(`${header}[\\s\\S]{0,1000}`, 'i');
            const match = cvText.match(regex);
            if (match) {
                sections[header] = match[0];
            }
        });
        
        return sections;
    },

    extractRequirements: function(jobDescription) {
        const jdLower = jobDescription.toLowerCase();
        const requirements = [];
        
        const reqPatterns = [
            /must have[:\s]+([^•\n]+)/i,
            /required[:\s]+([^•\n]+)/i,
            /experience with[:\s]+([^•\n]+)/i,
            /proficiency in[:\s]+([^•\n]+)/i
        ];
        
        reqPatterns.forEach(pattern => {
            const match = jdLower.match(pattern);
            if (match) {
                requirements.push(...match[1].split(/,|and/).map(r => r.trim()).filter(r => r.length > 3));
            }
        });
        
        return [...new Set(requirements)].slice(0, 10);
    },

    estimateMarketRate: function(years, skillCount) {
        let base = 80000;
        
        if (years > 10) base = 150000;
        else if (years > 7) base = 130000;
        else if (years > 5) base = 110000;
        else if (years > 3) base = 95000;
        
        if (skillCount > 15) base *= 1.2;
        else if (skillCount > 10) base *= 1.1;
        
        return {
            minK: Math.round(base * 0.85 / 1000),
            maxK: Math.round(base * 1.15 / 1000)
        };
    }
};

// ============================================================================
// MAIN CV ANALYSIS FUNCTION
// ============================================================================

/**
 * Complete CV Intelligence Analysis
 */
function analyzeCV(cvText, jobDescription = '', options = {}) {
    const {
        industry = 'tech',
        experienceLevel = 'mid',
        proMode = false
    } = options;

    // Phase 1: Structural Audit
    const atsAnalysis = CVIntelligenceEngine.analyzeATS(cvText, jobDescription, { industry });
    const weaknesses = CVIntelligenceEngine.analyzeWeaknesses(cvText);

    // Phase 2: Rewrite
    const rewrittenCV = CVIntelligenceEngine.rewriteCV(cvText, { industry, experienceLevel });

    // Phase 3: Role Optimization
    let roleOptimization = null;
    if (jobDescription) {
        roleOptimization = CVIntelligenceEngine.optimizeForRole(cvText, jobDescription, { industry, experienceLevel });
    }

    // Phase 4: Enhancements
    const enhancedSkills = CVIntelligenceEngine.enhanceSkillsSection(cvText);
    const powerBullets = CVIntelligenceEngine.upgradePowerBullets(cvText);

    // Phase 5: Brand Analysis
    const brandAnalysis = CVIntelligenceEngine.analyzePersonalBrand(cvText);

    // Phase 6: Interview Intelligence
    const interviewQuestions = CVIntelligenceEngine.generateInterviewQuestions(cvText, jobDescription);
    const starAnswers = CVIntelligenceEngine.generateSTARAnswers(cvText);

    // Phase 7: PRO MODE
    let proModeContent = null;
    if (proMode) {
        proModeContent = {
            linkedInHeadline: CVIntelligenceEngine.generateLinkedInHeadline(cvText, options),
            linkedInAbout: CVIntelligenceEngine.generateLinkedInAbout(cvText),
            elevatorPitch: CVIntelligenceEngine.generateElevatorPitch(cvText),
            salaryPoints: CVIntelligenceEngine.generateSalaryPoints(cvText, jobDescription),
            onboardingStrategy: CVIntelligenceEngine.generateOnboardingStrategy(cvText, jobDescription)
        };
    }

    return {
        // Phase 1: ATS Analysis
        atsScore: atsAnalysis.overallATS,
        atsBreakdown: atsAnalysis.breakdown,
        missingKeywords: atsAnalysis.missingKeywords,
        matchedKeywords: atsAnalysis.matchedKeywords,
        structuralWeaknesses: weaknesses,

        // Phase 2: Rewrite
        rewrittenCV: rewrittenCV,

        // Phase 3: Role Optimization
        roleOptimization: roleOptimization,

        // Phase 4: Enhancements
        enhancedSkills: enhancedSkills,
        powerBulletUpgrades: powerBullets,

        // Phase 5: Brand Analysis
        personalBrand: brandAnalysis,

        // Phase 6: Interview
        interviewQuestions: interviewQuestions,
        starAnswers: starAnswers,

        // Phase 7: PRO MODE
        proMode: proModeContent
    };
}

// ============================================================================
// UI FUNCTIONS FOR VELLON INTEGRATION
// ============================================================================

function showCVIntelligenceResults(results) {
    const resultsContainer = document.getElementById('cvIntelligenceResults');
    if (!resultsContainer) return;

    const html = `
        <div class="intelligence-dashboard">
            <!-- ATS Score -->
            <div class="ats-overview">
                <div class="ats-score-circle">
                    <svg viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="#333" stroke-width="8"/>
                        <circle cx="50" cy="50" r="45" fill="none" stroke="${getATSScoreColor(results.atsScore)}" stroke-width="8"
                            stroke-dasharray="${results.atsScore * 2.83} 283" stroke-linecap="round"
                            transform="rotate(-90 50 50)"/>
                    </svg>
                    <div class="ats-score-value">${results.atsScore}</div>
                </div>
                <div class="ats-breakdown">
                    <h4>ATS Score Breakdown</h4>
                    <div class="breakdown-item">
                        <span>Keyword Match</span>
                        <div class="breakdown-bar"><div style="width: ${results.atsBreakdown.keywordMatch}%"></div></div>
                        <span>${results.atsBreakdown.keywordMatch}%</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Skills Alignment</span>
                        <div class="breakdown-bar"><div style="width: ${results.atsBreakdown.skillsAlignment}%"></div></div>
                        <span>${results.atsBreakdown.skillsAlignment}%</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Structure</span>
                        <div class="breakdown-bar"><div style="width: ${results.atsBreakdown.structureCompliance}%"></div></div>
                        <span>${results.atsBreakdown.structureCompliance}%</span>
                    </div>
                </div>
            </div>

            <!-- Missing Keywords -->
            <div class="missing-keywords">
                <h4>Missing Critical Keywords</h4>
                <div class="keywords-list">
                    ${results.missingKeywords.map(k => `<span class="keyword-tag">${k}</span>`).join('')}
                </div>
            </div>

            <!-- Structural Weaknesses -->
            <div class="weaknesses-section">
                <h4>Structural Weaknesses</h4>
                ${results.structuralWeaknesses.weakBullets.length > 0 ? `
                    <div class="weakness-group">
                        <h5>Weak Phrases to Replace</h5>
                        ${results.structuralWeaknesses.weakBullets.slice(0, 5).map(w => `
                            <div class="weakness-item">
                                <span class="weak">"${w.phrase}"</span>
                                <span class="arrow">→</span>
                                <span class="strong">"${w.suggestion}"</span>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                ${results.structuralWeaknesses.missingMetrics.length > 0 ? `
                    <div class="weakness-group">
                        <h5>Add Metrics to These Achievements</h5>
                        ${results.structuralWeaknesses.missingMetrics.slice(0, 3).map(m => `
                            <div class="weakness-item metric">${m.substring(0, 80)}...</div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>

            <!-- Enhanced Skills -->
            <div class="skills-enhancement">
                <h4>Enhanced Skills Section</h4>
                <div class="skills-category">
                    <h5>Core Technical</h5>
                    <div class="skills-tags">
                        ${results.enhancedSkills.coreTechnical.map(s => `<span class="skill-tag">${s}</span>`).join('')}
                    </div>
                </div>
                <div class="skills-category">
                    <h5>Tools & Platforms</h5>
                    <div class="skills-tags">
                        ${results.enhancedSkills.toolsAndPlatforms.map(s => `<span class="skill-tag tool">${s}</span>`).join('')}
                    </div>
                </div>
                <div class="skills-category">
                    <h5>Soft Skills</h5>
                    <div class="skills-tags">
                        ${results.enhancedSkills.softSkills.map(s => `<span class="skill-tag soft">${s}</span>`).join('')}
                    </div>
                </div>
            </div>

            <!-- Power Bullet Upgrades -->
            ${results.powerBulletUpgrades.length > 0 ? `
                <div class="power-bullets">
                    <h4>Power Bullet Upgrades</h4>
                    ${results.powerBulletUpgrades.map((b, i) => `
                        <div class="bullet-upgrade">
                            <div class="original"><strong>Original:</strong> ${b.original.substring(0, 100)}...</div>
                            <div class="upgraded"><strong>Enhanced:</strong> ${b.upgraded}</div>
                        </div>
                    `).join('')}
                </div>
            ` : ''}

            <!-- Personal Brand Score -->
            <div class="brand-score">
                <h4>Personal Brand Analysis</h4>
                <div class="brand-scores">
                    <div class="brand-item">
                        <span>Authority</span>
                        <div class="brand-bar"><div style="width: ${results.personalBrand.authority * 10}%"></div></div>
                        <span>${results.personalBrand.authority}/10</span>
                    </div>
                    <div class="brand-item">
                        <span>Clarity</span>
                        <div class="brand-bar"><div style="width: ${results.personalBrand.clarity * 10}%"></div></div>
                        <span>${results.personalBrand.clarity}/10</span>
                    </div>
                    <div class="brand-item">
                        <span>Leadership</span>
                        <div class="brand-bar"><div style="width: ${results.personalBrand.leadership * 10}%"></div></div>
                        <span>${results.personalBrand.leadership}/10</span>
                    </div>
                    <div class="brand-item">
                        <span>Market Competitiveness</span>
                        <div class="brand-bar"><div style="width: ${results.personalBrand.marketCompetitiveness * 10}%"></div></div>
                        <span>${results.personalBrand.marketCompetitiveness}/10</span>
                    </div>
                </div>
                <div class="brand-insights">
                    ${results.personalBrand.analysis.map(a => `<p>• ${a}</p>`).join('')}
                </div>
            </div>

            <!-- Interview Questions -->
            <div class="interview-section">
                <h4>Likely Interview Questions</h4>
                ${results.interviewQuestions.map((q, i) => `
                    <div class="interview-question">
                        <span class="q-number">${i + 1}</span>
                        <div class="q-content">
                            <span class="q-category">${q.category}</span>
                            <p>${q.question}</p>
                        </div>
                    </div>
                `).join('')}
            </div>

            <!-- STAR Answers -->
            <div class="star-section">
                <h4>Strategic Model Answers (STAR Method)</h4>
                ${results.starAnswers.map((a, i) => `
                    <div class="star-answer">
                        <h5>Q: ${a.question}</h5>
                        <div class="star-content">
                            <p><strong>Situation:</strong> ${a.star.situation}</p>
                            <p><strong>Task:</strong> ${a.star.task}</p>
                            <p><strong>Action:</strong> ${a.star.action}</p>
                            <p><strong>Result:</strong> ${a.star.result}</p>
                        </div>
                    </div>
                `).join('')}
            </div>

            <!-- PRO MODE Content -->
            ${results.proMode ? `
                <div class="pro-mode-section">
                    <h4>PRO MODE Content</h4>
                    
                    <div class="pro-item">
                        <h5>LinkedIn Headline</h5>
                        <p class="pro-content">${results.proMode.linkedInHeadline}</p>
                    </div>
                    
                    <div class="pro-item">
                        <h5>LinkedIn About Section</h5>
                        <p class="pro-content">${results.proMode.linkedInAbout}</p>
                    </div>
                    
                    <div class="pro-item">
                        <h5>30-Second Elevator Pitch</h5>
                        <p class="pro-content">${results.proMode.elevatorPitch}</p>
                    </div>
                    
                    <div class="pro-item">
                        <h5>Salary Negotiation Points</h5>
                        <p class="pro-content">
                            <strong>Base Range:</strong> ${results.proMode.salaryPoints.baseRange}<br>
                            <strong>Total Comp:</strong> ${results.proMode.salaryPoints.totalComp}
                        </p>
                        <ul>
                            ${results.proMode.salaryPoints.keyPoints.map(p => `<li>${p}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="pro-item">
                        <h5>90-Day Onboarding Strategy</h5>
                        <div class="onboarding">
                            <div class="phase">
                                <h6>Days 1-30: ${results.proMode.onboardingStrategy.days1to30.focus}</h6>
                                <ul>${results.proMode.onboardingStrategy.days1to30.goals.map(g => `<li>${g}</li>`).join('')}</ul>
                            </div>
                            <div class="phase">
                                <h6>Days 31-60: ${results.proMode.onboardingStrategy.days31to60.focus}</h6>
                                <ul>${results.proMode.onboardingStrategy.days31to60.goals.map(g => `<li>${g}</li>`).join('')}</ul>
                            </div>
                            <div class="phase">
                                <h6>Days 61-90: ${results.proMode.onboardingStrategy.days61to90.focus}</h6>
                                <ul>${results.proMode.onboardingStrategy.days61to90.goals.map(g => `<li>${g}</li>`).join('')}</ul>
                            </div>
                        </div>
                    </div>
                </div>
            ` : ''}
        </div>
    `;

    resultsContainer.innerHTML = html;
    resultsContainer.classList.add('active');
}

function getATSScoreColor(score) {
    if (score >= 80) return '#6bcb77';
    if (score >= 60) return '#f4d03f';
    return '#e07a5f';
}

// Export for use in other modules
window.CVIntelligenceEngine = CVIntelligenceEngine;
window.analyzeCV = analyzeCV;
window.showCVIntelligenceResults = showCVIntelligenceResults;
