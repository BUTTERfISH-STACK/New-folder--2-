// vellon x - Premium AI Career Platform JavaScript

// AI Configuration - Set your HuggingFace API key here
const AI_CONFIG = {
    // To use HuggingFace AI, set your token here:
    // hf_token: "your_huggingface_token_here"
    // 
    // Get your free token at: https://huggingface.co/settings/tokens
    // The Qwen3.5-35B model is available for free through HuggingFace inference
    hf_token: null, // Set this to use AI-powered analysis
    useLocalFallback: true // Use local analysis if no token
};

// Initialize AI Service when token is set
if (AI_CONFIG.hf_token) {
    AIService.init(AI_CONFIG.hf_token);
    console.log("🤖 HuggingFace AI Service initialized");
} else {
    console.log("📝 Using local AI analysis. Set AI_CONFIG.hf_token for AI-powered analysis.");
}

// State Management
const state = {
    currentSection: 'home',
    cvData: {
        personal: {},
        experience: [],
        skills: '',
        softSkills: '',
        education: []
    },
    currentCVStep: 1,
    user: null,
    certificates: []
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadUserData();
    initParticles();
    updateUI();
    initIntelligenceTabs();
    initFileUpload();
    initGlobeAnimation();
    initScrollParallax();
});

// Update Certificates Grid
function updateCertificatesGrid() {
    const grid = document.getElementById('certificatesGrid');
    if (!grid) return;
    
    if (state.certificates.length === 0) {
        grid.innerHTML = `
            <div class="certificate-preview glass-card">
                <div class="certificate-content">
                    <div class="cert-header">
                        <div class="cert-logo">✦ vellon x</div>
                        <div class="cert-title">Certificate of Completion</div>
                    </div>
                    <div class="cert-body">
                        <p class="cert-presented">This is to certify that</p>
                        <h2 class="cert-name" id="certName">Your Name</h2>
                        <p class="cert-course">has successfully completed</p>
                        <h3 class="cert-course-name">AI & Tech Entrepreneur Course</h3>
                        <p class="cert-date" id="certDate">March 2026</p>
                    </div>
                    <div class="cert-footer">
                        <div class="cert-signature">
                            <div class="signature-line"></div>
                            <span>Program Director</span>
                        </div>
                        <div class="cert-id">
                            <span id="certIdDisplay">ID: VEL-2026-XXXXX</span>
                            <div class="qr-placeholder">⬜</div>
                        </div>
                    </div>
                    <div class="cert-badge">VERIFIED</div>
                </div>
                <div class="cert-actions">
                    <button class="btn-gold" onclick="downloadCertificate()">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                        Download PDF
                    </button>
                </div>
            </div>
        `;
    } else {
        // Show earned certificates
        grid.innerHTML = state.certificates.map(cert => `
            <div class="certificate-preview glass-card">
                <div class="certificate-content">
                    <div class="cert-header">
                        <div class="cert-logo">✦ vellon x</div>
                        <div class="cert-title">Certificate of Completion</div>
                    </div>
                    <div class="cert-body">
                        <p class="cert-presented">This is to certify that</p>
                        <h2 class="cert-name">${state.cvData.personal.name || 'Student'}</h2>
                        <p class="cert-course">has successfully completed</p>
                        <h3 class="cert-course-name">${cert.courseName}</h3>
                        <p class="cert-date">${new Date(cert.completedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                    </div>
                    <div class="cert-footer">
                        <div class="cert-signature">
                            <div class="signature-line"></div>
                            <span>Program Director</span>
                        </div>
                        <div class="cert-id">
                            <span>ID: ${cert.certId}</span>
                            <div class="qr-placeholder">⬜</div>
                        </div>
                    </div>
                    <div class="cert-badge">VERIFIED</div>
                </div>
                <div class="cert-actions">
                    <button class="btn-gold" onclick="downloadCertificate()">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                        Download
                    </button>
                </div>
            </div>
        `).join('');
    }
}

// Section Navigation
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('main > section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        state.currentSection = sectionId;
        
        // Update nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + sectionId) {
                link.classList.add('active');
            }
        });
        
        // Scroll to top
        window.scrollTo(0, 0);
    }
}

// CV Builder Functions
// Template Selection
let selectedTemplate = 'modern';

function selectTemplate(template) {
    selectedTemplate = template;
    document.querySelectorAll('.template-card').forEach(card => {
        card.classList.remove('active');
    });
    document.querySelector(`[data-template="${template}"]`).classList.add('active');
    updateCVPreview();
    saveCVData();
}

function nextCVStep() {
    if (validateCurrentStep()) {
        if (state.currentCVStep < 5) {
            state.currentCVStep++;
            updateCVSteps();
        }
    }
}

function prevCVStep() {
    if (state.currentCVStep > 1) {
        state.currentCVStep--;
        updateCVSteps();
    }
}

function validateCurrentStep() {
    const currentStep = state.currentCVStep;
    let isValid = true;
    
    if (currentStep === 1) {
        const name = document.getElementById('cvName');
        const email = document.getElementById('cvEmail');
        if (name && !name.value.trim()) {
            name.classList.add('invalid');
            isValid = false;
            setTimeout(() => name.classList.remove('invalid'), 2000);
        }
    }
    
    if (!isValid) {
        showToast('Please fill in required fields');
    }
    
    return isValid;
}

function updateCVSteps() {
    // Update step indicators
    document.querySelectorAll('.cv-step').forEach(step => {
        const stepNum = parseInt(step.dataset.step);
        if (stepNum < state.currentCVStep) {
            step.classList.add('completed');
            step.classList.remove('active');
        } else if (stepNum === state.currentCVStep) {
            step.classList.add('active');
            step.classList.remove('completed');
        } else {
            step.classList.remove('active', 'completed');
        }
    });
    
    // Update form steps
    document.querySelectorAll('.cv-form-step').forEach(step => {
        const stepNum = parseInt(step.dataset.step);
        step.classList.toggle('active', stepNum === state.currentCVStep);
    });
    
    // Update preview
    updateCVPreview();
    saveCVData();
    
    // Run AI Enhancement analysis when entering step 5
    if (state.currentCVStep === 5) {
        runAIEnhancement();
    }
}

// Re-run AI analysis when CV data changes (for step 5)
function refreshAIEnhancement() {
    if (state.currentCVStep === 5) {
        runAIEnhancement();
    }
}

function saveCVData() {
    // Personal Details
    state.cvData.personal = {
        name: document.getElementById('cvName')?.value || '',
        title: document.getElementById('cvTitle')?.value || '',
        email: document.getElementById('cvEmail')?.value || '',
        phone: document.getElementById('cvPhone')?.value || '',
        location: document.getElementById('cvLocation')?.value || '',
        linkedin: document.getElementById('cvLinkedIn')?.value || ''
    };
    
    // Skills
    state.cvData.skills = document.getElementById('cvSkills')?.value || '';
    state.cvData.softSkills = document.getElementById('cvSoftSkills')?.value || '';
    
    // Experience - collect from DOM
    const expItems = document.querySelectorAll('.experience-item');
    state.cvData.experience = [];
    expItems.forEach(item => {
        state.cvData.experience.push({
            title: item.querySelector('.exp-title')?.value || '',
            company: item.querySelector('.exp-company')?.value || '',
            start: item.querySelector('.exp-start')?.value || '',
            end: item.querySelector('.exp-end')?.value || '',
            description: item.querySelector('.exp-description')?.value || ''
        });
    });
    
    // Education - collect from DOM
    const eduItems = document.querySelectorAll('.education-item');
    state.cvData.education = [];
    eduItems.forEach(item => {
        state.cvData.education.push({
            degree: item.querySelector('.edu-degree')?.value || '',
            school: item.querySelector('.edu-school')?.value || '',
            year: item.querySelector('.edu-year')?.value || '',
            achievements: item.querySelector('.edu-achievements')?.value || ''
        });
    });
    
    // Template
    state.cvData.template = selectedTemplate;
    
    // Update ATS score
    updateATSScore();
    
    // Save to localStorage
    localStorage.setItem('vellon_x_cv_data', JSON.stringify(state.cvData));
}

function updateATSScore() {
    const skills = state.cvData.skills.toLowerCase();
    const softSkills = state.cvData.softSkills.toLowerCase();
    const personal = state.cvData.personal;
    
    let score = 0;
    
    // Personal info (25%)
    if (personal.name) score += 5;
    if (personal.title) score += 5;
    if (personal.email) score += 5;
    if (personal.phone) score += 5;
    if (personal.location) score += 3;
    if (personal.linkedin) score += 2;
    
    // Skills (35%)
    if (skills.length > 30) score += 10;
    if (skills.length > 80) score += 10;
    if (skills.length > 150) score += 10;
    if (softSkills.length > 20) score += 5;
    
    // Count skill items
    const skillCount = skills.split(',').filter(s => s.trim()).length;
    if (skillCount >= 5) score += 5;
    if (skillCount >= 10) score += 5;
    
    // Experience (30%)
    const expItems = document.querySelectorAll('.experience-item');
    if (expItems.length > 0) score += 10;
    if (expItems.length > 1) score += 10;
    if (expItems.length > 2) score += 10;
    
    // Check for quantifiable achievements
    let hasQuantifiable = false;
    expItems.forEach(item => {
        const desc = item.querySelector('.exp-description')?.value || '';
        if (/\d+%?|\$\d+[kK]?/i.test(desc)) {
            hasQuantifiable = true;
        }
    });
    if (hasQuantifiable) score += 5;
    
    // Education (10%)
    const eduItems = document.querySelectorAll('.education-item');
    if (eduItems.length > 0) score += 10;
    
    score = Math.min(score, 100);
    
    const atsFill = document.getElementById('atsScore');
    if (atsFill) {
        atsFill.style.width = score + '%';
        atsFill.textContent = score + '%';
        
        // Remove previous classes
        atsFill.classList.remove('low', 'medium', 'high');
        
        // Add appropriate class
        if (score < 40) {
            atsFill.classList.add('low');
        } else if (score < 70) {
            atsFill.classList.add('medium');
        } else {
            atsFill.classList.add('high');
        }
    }
}

function updateCVPreview() {
    const personal = state.cvData.personal;
    
    // Update preview element with template class
    const preview = document.getElementById('cvPreview');
    if (preview) {
        // Remove all template classes
        preview.classList.remove('modern', 'classic', 'executive', 'technical', 'creative', 'graduate');
        // Add selected template class
        preview.classList.add(selectedTemplate);
    }
    
    // Update preview elements
    const previewName = document.querySelector('.preview-name');
    const previewTitle = document.querySelector('.preview-title');
    const previewContact = document.querySelector('.preview-contact');
    const previewSkills = document.querySelector('.preview-skills');
    const previewExperience = document.querySelector('.preview-experience');
    const previewEducation = document.querySelector('.preview-education');
    
    if (previewName) previewName.textContent = personal.name || 'Your Name';
    if (previewTitle) previewTitle.textContent = personal.title || 'Job Title';
    
    if (previewContact) {
        let contactHtml = '';
        if (personal.email) contactHtml += `<span>${personal.email}</span>`;
        if (personal.phone) contactHtml += `<span>${personal.phone}</span>`;
        if (personal.location) contactHtml += `<span>${personal.location}</span>`;
        if (personal.linkedin) contactHtml += `<span>${personal.linkedin}</span>`;
        previewContact.innerHTML = contactHtml || '<span class="preview-empty">Contact info will appear here</span>';
    }
    
    if (previewSkills) {
        const techSkills = state.cvData.skills.split(',').filter(s => s.trim());
        const soft = state.cvData.softSkills.split(',').filter(s => s.trim());
        
        let skillsHtml = '';
        techSkills.forEach(skill => {
            skillsHtml += `<span class="preview-skill-tag">${skill.trim()}</span>`;
        });
        soft.forEach(skill => {
            skillsHtml += `<span class="preview-skill-tag" style="background: rgba(212, 175, 55, 0.1); border-color: #888;">${skill.trim()}</span>`;
        });
        previewSkills.innerHTML = skillsHtml || '<span class="preview-empty">Add your skills in Step 3</span>';
    }
    
    // Update experience preview
    if (previewExperience) {
        const expItems = document.querySelectorAll('.experience-item');
        if (expItems.length > 0) {
            let expHtml = '';
            expItems.forEach(item => {
                const title = item.querySelector('.exp-title')?.value || 'Job Title';
                const company = item.querySelector('.exp-company')?.value || 'Company';
                const start = item.querySelector('.exp-start')?.value || '';
                const end = item.querySelector('.exp-end')?.value || 'Present';
                const desc = item.querySelector('.exp-description')?.value || '';
                
                const dates = start && end ? `${formatDate(start)} - ${formatDate(end)}` : '';
                
                expHtml += `
                    <div class="preview-experience-item">
                        <div class="preview-job-title">${title}</div>
                        <div class="preview-company">${company}</div>
                        ${dates ? `<div class="preview-dates">${dates}</div>` : ''}
                        ${desc ? `<div class="preview-description">${desc.replace(/\n/g, '<br>')}</div>` : ''}
                    </div>
                `;
            });
            previewExperience.innerHTML = expHtml;
        } else {
            previewExperience.innerHTML = '<span class="preview-empty">Add your experience in Step 2</span>';
        }
    }
    
    // Update education preview
    if (previewEducation) {
        const eduItems = document.querySelectorAll('.education-item');
        if (eduItems.length > 0) {
            let eduHtml = '';
            eduItems.forEach(item => {
                const degree = item.querySelector('.edu-degree')?.value || 'Degree';
                const school = item.querySelector('.edu-school')?.value || 'Institution';
                const year = item.querySelector('.edu-year')?.value || '';
                
                eduHtml += `
                    <div class="preview-education-item">
                        <div class="preview-degree">${degree}</div>
                        <div class="preview-school">${school}${year ? ', ' + year : ''}</div>
                    </div>
                `;
            });
            previewEducation.innerHTML = eduHtml;
        } else {
            previewEducation.innerHTML = '<span class="preview-empty">Add education in Step 4</span>';
        }
    }
    
    // Update certificate name
    const certName = document.getElementById('certName');
    if (certName) {
        certName.textContent = personal.name || 'Your Name';
    }
}

function formatDate(monthYear) {
    if (!monthYear) return '';
    const [year, month] = monthYear.split('-');
    const date = new Date(year, month - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function addExperience() {
    const list = document.getElementById('experienceList');
    const itemCount = list.querySelectorAll('.experience-item').length + 1;
    const item = document.createElement('div');
    item.className = 'experience-item';
    item.innerHTML = `
        <div class="item-header">
            <h4>Experience #${itemCount}</h4>
            <button class="btn-delete-item" onclick="removeExperience(this)" title="Remove">×</button>
        </div>
        <div class="form-grid">
            <div class="form-group full-width">
                <label>Job Title <span class="required">*</span></label>
                <input type="text" class="exp-title" placeholder="Senior Software Engineer" oninput="saveCVData()">
            </div>
            <div class="form-group full-width">
                <label>Company</label>
                <input type="text" class="exp-company" placeholder="Tech Corp Inc." oninput="saveCVData()">
            </div>
            <div class="form-group">
                <label>Start Date</label>
                <input type="month" class="exp-start" oninput="saveCVData()">
            </div>
            <div class="form-group">
                <label>End Date</label>
                <input type="month" class="exp-end" placeholder="Present" oninput="saveCVData()">
            </div>
            <div class="form-group full-width">
                <label>Achievements & Responsibilities</label>
                <textarea class="exp-description" rows="4" placeholder="• Led development of microservices
• Increased system performance by 40%" oninput="saveCVData()"></textarea>
            </div>
        </div>
    `;
    list.appendChild(item);
    updateATSScore();
}

function removeExperience(btn) {
    const item = btn.closest('.experience-item');
    if (item) {
        item.remove();
        // Renumber remaining items
        const items = document.querySelectorAll('.experience-item');
        items.forEach((item, index) => {
            const header = item.querySelector('.item-header h4');
            if (header) header.textContent = `Experience #${index + 1}`;
        });
        saveCVData();
        updateATSScore();
    }
}

function addEducation() {
    const list = document.getElementById('educationList');
    const itemCount = list.querySelectorAll('.education-item').length + 1;
    const item = document.createElement('div');
    item.className = 'education-item';
    item.innerHTML = `
        <div class="item-header">
            <h4>Education #${itemCount}</h4>
            <button class="btn-delete-item" onclick="removeEducation(this)" title="Remove">×</button>
        </div>
        <div class="form-grid">
            <div class="form-group full-width">
                <label>Degree <span class="required">*</span></label>
                <input type="text" class="edu-degree" placeholder="Master of Computer Science" oninput="saveCVData()">
            </div>
            <div class="form-group full-width">
                <label>Institution</label>
                <input type="text" class="edu-school" placeholder="Stanford University" oninput="saveCVData()">
            </div>
            <div class="form-group">
                <label>Graduation Year</label>
                <input type="number" class="edu-year" placeholder="2024" oninput="saveCVData()">
            </div>
            <div class="form-group full-width">
                <label>Achievements (Optional)</label>
                <input type="text" class="edu-achievements" placeholder="Dean's List, Thesis Award..." oninput="saveCVData()">
            </div>
        </div>
    `;
    list.appendChild(item);
}

function removeEducation(btn) {
    const item = btn.closest('.education-item');
    if (item) {
        item.remove();
        // Renumber remaining items
        const items = document.querySelectorAll('.education-item');
        items.forEach((item, index) => {
            const header = item.querySelector('.item-header h4');
            if (header) header.textContent = `Education #${index + 1}`;
        });
        saveCVData();
    }
}

function downloadCV() {
    // Generate PDF using jsPDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const personal = state.cvData.personal;
    
    // Apply template-specific styling
    const template = selectedTemplate || 'modern';
    
    // Template configurations
    const templates = {
        modern: {
            primaryColor: [212, 175, 55],    // Gold
            secondaryColor: [33, 33, 33],    // Dark gray
            accentColor: [184, 134, 11],      // Dark gold
            font: 'helvetica',
            layout: 'single-column',
            headerAlign: 'center',
            showBorder: false
        },
        classic: {
            primaryColor: [0, 0, 0],          // Black
            secondaryColor: [80, 80, 80],     // Gray
            accentColor: [100, 100, 100],     // Medium gray
            font: 'times',
            layout: 'single-column',
            headerAlign: 'left',
            showBorder: true
        },
        executive: {
            primaryColor: [0, 51, 102],       // Navy blue
            secondaryColor: [128, 128, 128],  // Gray
            accentColor: [192, 192, 192],      // Silver
            font: 'helvetica',
            layout: 'two-column',
            headerAlign: 'center',
            showBorder: true
        },
        creative: {
            primaryColor: [255, 107, 107],    // Coral
            secondaryColor: [64, 64, 64],     // Dark gray
            accentColor: [255, 195, 0],       // Yellow
            font: 'helvetica',
            layout: 'single-column',
            headerAlign: 'center',
            showBorder: false
        },
        technical: {
            primaryColor: [0, 100, 80],        // Teal
            secondaryColor: [70, 70, 70],      // Dark gray
            accentColor: [0, 150, 136],        // Cyan
            font: 'courier',
            layout: 'single-column',
            headerAlign: 'left',
            showBorder: false
        },
        graduate: {
            primaryColor: [106, 90, 205],      // Slate blue
            secondaryColor: [100, 100, 100],   // Gray
            accentColor: [147, 112, 219],      // Medium purple
            font: 'helvetica',
            layout: 'single-column',
            headerAlign: 'center',
            showBorder: false
        }
    };
    
    const config = templates[template] || templates.modern;
    const { primaryColor, secondaryColor, accentColor, font, layout, headerAlign, showBorder } = config;
    
    // Page dimensions
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    
    let y = margin;
    
    // Add border if template requires
    if (showBorder) {
        doc.setDrawColor(...primaryColor);
        doc.setLineWidth(0.5);
        doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
    }
    
    // Header - Name
    doc.setTextColor(...primaryColor);
    doc.setFontSize(layout === 'two-column' ? 22 : 24);
    doc.setFont(font, 'bold');
    
    const nameX = headerAlign === 'center' ? pageWidth / 2 : margin;
    doc.text(personal.name || 'Your Name', nameX, y, { align: headerAlign === 'center' ? 'center' : 'left' });
    y += 8;
    
    // Title
    doc.setTextColor(...accentColor);
    doc.setFontSize(layout === 'two-column' ? 12 : 14);
    doc.setFont(font, 'normal');
    doc.text(personal.title || 'Professional Title', nameX, y, { align: headerAlign === 'center' ? 'center' : 'left' });
    y += 8;
    
    // Contact Info
    doc.setTextColor(...secondaryColor);
    doc.setFontSize(9);
    let contact = [];
    if (personal.email) contact.push(personal.email);
    if (personal.phone) contact.push(personal.phone);
    if (personal.location) contact.push(personal.location);
    if (personal.linkedin) contact.push(personal.linkedin);
    
    const contactText = contact.join('  |  ');
    doc.text(contactText, nameX, y, { align: headerAlign === 'center' ? 'center' : 'left' });
    y += 10;
    
    // Gold/Color line
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;
    
    // Experience Section
    const expItems = document.querySelectorAll('.experience-item');
    if (expItems.length > 0) {
        // Section Title
        doc.setTextColor(...primaryColor);
        doc.setFontSize(12);
        doc.setFont(font, 'bold');
        doc.text('PROFESSIONAL EXPERIENCE', margin, y);
        y += 5;
        doc.line(margin, y, pageWidth - margin, y);
        y += 8;
        
        expItems.forEach(item => {
            const title = item.querySelector('.exp-title')?.value || '';
            const company = item.querySelector('.exp-company')?.value || '';
            const start = item.querySelector('.exp-start')?.value || '';
            const end = item.querySelector('.exp-end')?.value || 'Present';
            const desc = item.querySelector('.exp-description')?.value || '';
            
            if (title || company) {
                // Job Title
                doc.setTextColor(0, 0, 0);
                doc.setFontSize(11);
                doc.setFont(font, 'bold');
                doc.text(title, margin, y);
                
                // Dates
                doc.setTextColor(...secondaryColor);
                doc.setFontSize(9);
                doc.setFont(font, 'italic');
                const dates = start && end ? formatDate(start) + ' - ' + formatDate(end) : '';
                if (dates) doc.text(dates, pageWidth - margin, y, { align: 'right' });
                y += 5;
                
                // Company
                doc.setTextColor(...accentColor);
                doc.setFontSize(10);
                doc.setFont(font, 'normal');
                doc.text(company, margin, y);
                y += 6;
                
                // Description
                if (desc) {
                    doc.setTextColor(60, 60, 60);
                    doc.setFontSize(9);
                    const lines = doc.splitTextToSize(desc, contentWidth);
                    doc.text(lines, margin, y);
                    y += lines.length * 4 + 4;
                }
                y += 4;
            }
        });
    }
    
    // Skills Section
    const techSkills = state.cvData.skills.split(',').filter(s => s.trim());
    const softSkills = state.cvData.softSkills.split(',').filter(s => s.trim());
    if (techSkills.length > 0 || softSkills.length > 0) {
        // Check if we need a new page
        if (y > pageHeight - 60) {
            doc.addPage();
            y = margin;
        }
        
        // Section Title
        doc.setTextColor(...primaryColor);
        doc.setFontSize(12);
        doc.setFont(font, 'bold');
        doc.text('SKILLS', margin, y);
        y += 5;
        doc.line(margin, y, pageWidth - margin, y);
        y += 8;
        
        doc.setTextColor(60, 60, 60);
        doc.setFontSize(9);
        doc.setFont(font, 'normal');
        
        if (techSkills.length > 0) {
            doc.setFont(font, 'bold');
            doc.text('Technical:', margin, y);
            y += 5;
            doc.setFont(font, 'normal');
            const skillsText = techSkills.map(s => s.trim()).join(', ');
            const lines = doc.splitTextToSize(skillsText, contentWidth);
            doc.text(lines, margin, y);
            y += lines.length * 4 + 4;
        }
        
        if (softSkills.length > 0) {
            if (y > pageHeight - 40) {
                doc.addPage();
                y = margin;
            }
            doc.setFont(font, 'bold');
            doc.text('Soft Skills:', margin, y);
            y += 5;
            doc.setFont(font, 'normal');
            const softText = softSkills.map(s => s.trim()).join(', ');
            const lines = doc.splitTextToSize(softText, contentWidth);
            doc.text(lines, margin, y);
            y += lines.length * 4 + 4;
        }
    }
    
    // Education Section
    const eduItems = document.querySelectorAll('.education-item');
    if (eduItems.length > 0) {
        if (y > pageHeight - 60) {
            doc.addPage();
            y = margin;
        }
        
        // Section Title
        doc.setTextColor(...primaryColor);
        doc.setFontSize(12);
        doc.setFont(font, 'bold');
        doc.text('EDUCATION', margin, y);
        y += 5;
        doc.line(margin, y, pageWidth - margin, y);
        y += 8;
        
        eduItems.forEach(item => {
            const degree = item.querySelector('.edu-degree')?.value || '';
            const school = item.querySelector('.edu-school')?.value || '';
            const year = item.querySelector('.edu-year')?.value || '';
            const achievements = item.querySelector('.edu-achievements')?.value || '';
            
            if (degree || school) {
                // Degree
                doc.setTextColor(0, 0, 0);
                doc.setFontSize(11);
                doc.setFont(font, 'bold');
                doc.text(degree, margin, y);
                
                // Year
                doc.setTextColor(...secondaryColor);
                doc.setFontSize(9);
                if (year) doc.text(year, pageWidth - margin, y, { align: 'right' });
                y += 5;
                
                // School
                doc.setTextColor(...accentColor);
                doc.setFontSize(10);
                doc.setFont(font, 'normal');
                doc.text(school, margin, y);
                y += 5;
                
                // Achievements
                if (achievements) {
                    doc.setTextColor(60, 60, 60);
                    doc.setFontSize(9);
                    doc.text(achievements, margin, y);
                    y += 5;
                }
                y += 6;
            }
        });
    }
    
    // Footer
    doc.setTextColor(180, 180, 180);
    doc.setFontSize(8);
    doc.text('Generated by vellon x - AI-Powered Career Platform', pageWidth / 2, pageHeight - 10, { align: 'center' });
    
    // Add template watermark
    doc.setTextColor(220, 220, 220);
    doc.setFontSize(6);
    doc.text('Template: ' + template.charAt(0).toUpperCase() + template.slice(1), pageWidth / 2, pageHeight - 5, { align: 'center' });
    
    // Save PDF
    const filename = (personal.name || 'CV').replace(/\s+/g, '_') + '_' + template.charAt(0).toUpperCase() + template.slice(1) + '.pdf';
    doc.save(filename);
    
    showToast('CV downloaded as PDF (' + template + ' template)!');
}

// Certificate Functions - Enhanced
function generateCertificate() {
    const personal = state.cvData.personal;
    const certName = document.getElementById('certName');
    const certDate = document.getElementById('certDate');
    
    const studentName = personal.name || 'Student';
    const completedDate = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const certId = `VEL-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    
    if (certName) certName.textContent = studentName;
    if (certDate) certDate.textContent = completedDate;
    
    // Add to certificates
    state.certificates.push({
        completedDate: new Date().toISOString(),
        certId: certId
    });
    saveUserData();
    
    // Update certificate ID display
    const certIdEl = document.getElementById('certIdDisplay');
    if (certIdEl) certIdEl.textContent = certId;
}

function downloadCertificate() {
    const personal = state.cvData.personal;
    
    const studentName = personal.name || 'Student';
    const completedDate = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const certId = 'VEL-' + new Date().getFullYear() + '-' + Math.random().toString(36).substring(2, 7).toUpperCase();
    const courseName = 'AI & Tech Entrepreneur Course';
    
    // Generate PDF using jsPDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Certificate template configuration
    const certConfig = {
        primaryColor: [212, 175, 55],  // Gold
        secondaryColor: [33, 33, 33],   // Dark gray
        accentColor: [184, 134, 11]     // Dark gold
    };
    
    const primaryColor = certConfig.primaryColor;
    const secondaryColor = certConfig.secondaryColor;
    const accentColor = certConfig.accentColor;
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 25;
    
    // Background
    doc.setFillColor(250, 250, 250);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
    
    // Border
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(1);
    doc.rect(15, 15, pageWidth - 30, pageHeight - 30);
    
    // Inner border
    doc.setLineWidth(0.3);
    doc.rect(18, 18, pageWidth - 36, pageHeight - 36);
    
    let y = 45;
    
    // Logo/Header symbol
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFontSize(40);
    doc.setFont('helvetica', 'bold');
    doc.text('✦', pageWidth / 2, y, { align: 'center' });
    y += 15;
    
    // vellon x text
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('vellon x', pageWidth / 2, y, { align: 'center' });
    y += 15;
    
    // Subtitle
    doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('AI-Powered Career Platform', pageWidth / 2, y, { align: 'center' });
    y += 20;
    
    // Certificate title
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Certificate of Completion', pageWidth / 2, y, { align: 'center' });
    y += 25;
    
    // Decorative line
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(0.5);
    doc.line(margin + 30, y, pageWidth - margin - 30, y);
    y += 20;
    
    // This is to certify that
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('This is to certify that', pageWidth / 2, y, { align: 'center' });
    y += 15;
    
    // Student Name
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(studentName.toUpperCase(), pageWidth / 2, y, { align: 'center' });
    y += 20;
    
    // Name underline
    doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.setLineWidth(0.5);
    doc.line(margin + 20, y - 5, pageWidth - margin - 20, y - 5);
    
    // has successfully completed
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('has successfully completed', pageWidth / 2, y + 10, { align: 'center' });
    y += 30;
    
    // Course Name
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(courseName, pageWidth / 2, y, { align: 'center' });
    y += 20;
    
    // Date
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(completedDate, pageWidth / 2, y, { align: 'center' });
    y += 30;
    
    // Certificate ID
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(margin + 20, y, pageWidth - margin - 20, y);
    y += 10;
    
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(9);
    doc.text('Certificate ID: ' + certId, pageWidth / 2, y, { align: 'center' });
    y += 15;
    
    // Verification text
    doc.setFontSize(8);
    doc.text('VERIFICATION: Visit vellon x/verify and enter Certificate ID above', pageWidth / 2, y, { align: 'center' });
    
    // Footer badges area - Signature line
    y = pageHeight - 55;
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(margin, y, margin + 50, y);
    doc.line(pageWidth - margin - 50, y, pageWidth - margin, y);
    
    y += 8;
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Program Director', margin + 25, y, { align: 'center' });
    doc.text('Date', pageWidth - margin - 25, y, { align: 'center' });
    
    // Verified badge
    y = 35;
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.roundedRect(pageWidth - margin - 35, y - 5, 30, 10, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text('VERIFIED', pageWidth - margin - 20, y, { align: 'center' });
    
    // Save PDF
    doc.save('VellonX_Certificate_' + studentName.replace(/ /g, '_') + '.pdf');
    
    // Update certificate ID display
    const certIdEl = document.getElementById('certIdDisplay');
    if (certIdEl) certIdEl.textContent = certId;
    
    showToast('Certificate downloaded!');
}

function verifyCertificate() {
    const input = document.getElementById('verifyInput');
    const result = document.getElementById('verifyResult');
    
    if (!input || !result) return;
    
    const certId = input.value.trim().toUpperCase();
    
    // Check if it's a valid format
    if (certId.startsWith('VEL-') && certId.length >= 10) {
        // In production, this would verify against a backend
        const isValid = true; // Simulated validation
        
        if (isValid) {
            result.innerHTML = `
                <div class="verify-success">
                    <span class="verify-icon">✓</span>
                    <div class="verify-details">
                        <strong>Certificate Verified!</strong>
                        <p>This is a valid vellon x certificate issued by AI-Powered Career Platform</p>
                        <p class="cert-id-display">Certificate ID: ${certId}</p>
                    </div>
                </div>
            `;
            result.className = 'verify-result success';
        } else {
            result.innerHTML = `<span class="error-icon">✕</span> Certificate not found in our records.`;
            result.className = 'verify-result error';
        }
    } else {
        result.innerHTML = `<span class="error-icon">✕</span> Invalid certificate format. Please check and try again.`;
        result.className = 'verify-result error';
    }
}

// Authentication Functions
function showAuthModal() {
    document.getElementById('authModal').classList.add('active');
}

function closeAuthModal() {
    document.getElementById('authModal').classList.remove('active');
}

function switchAuthMode() {
    showToast('Sign up functionality coming soon!');
}

function handleGoogleSignIn(response) {
    if (response && response.credential) {
        const token = response.credential;
        const payload = JSON.parse(atob(token.split('.')[1]));
        
        state.user = {
            name: payload.name || 'User',
            email: payload.email || '',
            picture: payload.picture || null,
            loginMethod: 'google'
        };
        
        saveUserData();
        updateUI();
        closeAuthModal();
        
        showToast(`Welcome ${state.user.name}!`);
    }
}

function handleEmailLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Simple validation (in production, this would go to a backend)
    if (email && password.length >= 6) {
        state.user = {
            name: email.split('@')[0],
            email: email,
            loginMethod: 'email'
        };
        
        saveUserData();
        updateUI();
        closeAuthModal();
        
        showToast(`Welcome ${state.user.name}!`);
    } else {
        showToast('Please enter valid credentials');
    }
}

function logout() {
    state.user = null;
    localStorage.removeItem('vellon_x_user');
    updateUI();
    showSection('home');
    showToast('Signed out successfully');
}

function toggleUserDropdown() {
    document.getElementById('userDropdown').classList.toggle('active');
}

// Data Persistence
function saveUserData() {
    const userData = {
        user: state.user,
        cvData: state.cvData,
        certificates: state.certificates
    };
    localStorage.setItem('vellon_x_user_data', JSON.stringify(userData));
}

function loadUserData() {
    const saved = localStorage.getItem('vellon_x_user_data');
    if (saved) {
        const data = JSON.parse(saved);
        state.user = data.user || null;
        state.cvData = data.cvData || state.cvData;
        state.certificates = data.certificates || [];
    }
    
    // Load CV data into form
    if (state.cvData.personal) {
        setTimeout(() => {
            const fields = ['cvName', 'cvTitle', 'cvEmail', 'cvPhone', 'cvLocation', 'cvLinkedIn'];
            fields.forEach(id => {
                const el = document.getElementById(id);
                if (el && state.cvData.personal[id.replace('cv', '').toLowerCase()]) {
                    el.value = state.cvData.personal[id.replace('cv', '').toLowerCase()];
                }
            });
            updateCVPreview();
        }, 100);
    }
}

function updateUI() {
    const authButtons = document.getElementById('authButtons');
    const userMenu = document.getElementById('userMenu');
    
    if (state.user) {
        if (authButtons) authButtons.style.display = 'none';
        if (userMenu) {
            userMenu.style.display = 'block';
            const avatar = userMenu.querySelector('.avatar-text');
            if (avatar) avatar.textContent = state.user.name.charAt(0).toUpperCase();
        }
        
        // Update dashboard
        updateDashboard();
    } else {
        if (authButtons) authButtons.style.display = 'flex';
        if (userMenu) userMenu.style.display = 'none';
    }
}

function updateDashboard() {
    const dashCertificates = document.getElementById('dashCertificates');
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    
    if (dashCertificates) dashCertificates.textContent = state.certificates.length;
    
    if (userName) userName.textContent = state.user?.name || 'User';
    if (userEmail) userEmail.textContent = state.user?.email || 'user@example.com';
}

// Mobile Menu
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
}

// Particles Animation
function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: rgba(212, 175, 55, ${Math.random() * 0.5 + 0.2});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${Math.random() * 10 + 10}s infinite ease-in-out;
            animation-delay: ${Math.random() * 5}s;
        `;
        container.appendChild(particle);
    }
}

// Toast Notification
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = toast.querySelector('.toast-message');
    
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target.closest('.user-menu')) {
        const dropdown = document.getElementById('userDropdown');
        if (dropdown) dropdown.classList.remove('active');
    }
});

// Initialize CV preview on load
window.addEventListener('load', function() {
    setTimeout(updateCVPreview, 500);
});

// CV Intelligence Analysis Function
async function runCVAnalysis() {
    // Check which tab is active
    const activeTab = document.querySelector('.input-tab.active')?.dataset.tab || 'paste';
    
    let cvText = '';
    let jobDescription = '';
    let industry = '';
    let experienceLevel = '';
    let proMode = false;
    
    if (activeTab === 'paste') {
        cvText = document.getElementById('cvInputText').value;
        jobDescription = document.getElementById('jobDescriptionText').value;
        
        // Validation
        if (!cvText || cvText.trim().length < 20) {
            showToast('Please paste your CV content (at least 20 characters)');
            // Add visual feedback
            const textarea = document.getElementById('cvInputText');
            textarea.classList.add('error');
            setTimeout(() => textarea.classList.remove('error'), 2000);
            return;
        }
        
    } else if (activeTab === 'upload') {
        cvText = window.uploadedCVContent || '';
        jobDescription = document.getElementById('jobDescriptionText')?.value || '';
        
        if (!cvText || cvText.trim().length < 20) {
            showToast('Please upload a CV file first');
            return;
        }
        
    } else if (activeTab === 'quick') {
        // Build CV text from quick inputs
        const title = document.getElementById('quickTitle')?.value || '';
        const years = document.getElementById('quickYears')?.value || '';
        const skills = document.getElementById('quickSkills')?.value || '';
        
        if (!title && !years && !skills) {
            showToast('Please enter at least your job title to analyze');
            return;
        }
        
        cvText = `Job Title: ${title}\nYears of Experience: ${years}\nSkills: ${skills}`;
    }
    
    industry = document.getElementById('industrySelect')?.value || 'tech';
    experienceLevel = document.getElementById('experienceSelect')?.value || 'mid';
    proMode = document.getElementById('proModeCheck')?.checked || false;
    
    // Show what we're analyzing
    const analyzeBtn = document.querySelector('.analyze-btn');
    if (analyzeBtn) {
        analyzeBtn.innerHTML = '<span class="btn-content"><span class="btn-icon">⏳</span><span class="btn-text">Analyzing...</span></span>';
        analyzeBtn.disabled = true;
    }
    
    // Show loading state
    const resultsContainer = document.getElementById('cvIntelligenceResults');
    
    // Custom loading message based on input
    let loadingMessage = 'Analyzing your CV...';
    if (jobDescription.trim().length > 20) {
        loadingMessage = 'Comparing with job requirements...';
    }
    if (proMode) {
        loadingMessage = 'Running PRO analysis...';
    }
    
    // Check if AI service is available
    const useAI = AI_CONFIG.hf_token && AIService;
    if (useAI) {
        loadingMessage = '🤖 AI is analyzing your CV...';
    }
    
    resultsContainer.innerHTML = `<div class="analysis-loading"><div class="loading-spinner"></div><h3>${loadingMessage}</h3><p>${useAI ? 'Using Qwen3.5 AI Model' : 'Using local analysis engine'}</p></div>`;
    resultsContainer.classList.add('active');
    
    try {
        let results;
        
        if (useAI) {
            // Use HuggingFace AI Service
            try {
                results = await AIService.analyzeCVWithAI(cvText, jobDescription, {
                    industry,
                    experienceLevel,
                    proMode
                });
                console.log("🤖 AI Analysis completed");
            } catch (aiError) {
                console.error("AI failed, falling back to local:", aiError);
                results = analyzeCV(cvText, jobDescription, { industry, experienceLevel, proMode });
            }
        } else {
            // Use local analysis engine
            results = analyzeCV(cvText, jobDescription, { industry, experienceLevel, proMode });
        }
        
        showCVIntelligenceResults(results);
        
        // Restore button
        if (analyzeBtn) {
            analyzeBtn.innerHTML = '<span class="btn-content"><span class="btn-icon">🔍</span><span class="btn-text">Analyze My CV</span></span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>';
            analyzeBtn.disabled = false;
        }
        
        // Show success toast with score
        if (results && results.atsScore !== undefined) {
            const aiBadge = useAI ? ' 🤖' : '';
            showToast(`Analysis Complete!${aiBadge} ATS Score: ${results.atsScore}%`);
        } else {
            showToast('CV Analysis Complete!');
        }
        
        // Scroll to results
        resultsContainer.scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        console.error('Analysis error:', error);
        resultsContainer.innerHTML = '<div style="text-align:center;padding:40px;"><p style="color:#e07a5f">Error analyzing CV. Please try again.</p></div>';
        showToast('Analysis failed. Please try again.');
        
        // Restore button
        if (analyzeBtn) {
            analyzeBtn.innerHTML = '<span class="btn-content"><span class="btn-icon">🔍</span><span class="btn-text">Analyze My CV</span></span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>';
            analyzeBtn.disabled = false;
        }
    }
}

// AI Enhancement for CV Builder Step 5
async function runAIEnhancement() {
    // Gather CV data from form
    const cvText = buildCVTextFromForm();
    
    // Show analyzing indicator
    const aiSuggestionsContainer = document.querySelector('.ai-suggestions');
    const keywordSuggestionsContainer = document.getElementById('keywordSuggestions');
    
    // Check if AI is available
    const useAI = AI_CONFIG.hf_token && AIService;
    
    if (aiSuggestionsContainer) {
        const aiIndicator = useAI ? '🤖 ' : '';
        aiSuggestionsContainer.innerHTML = `
            <div class="ai-analyzing">
                <div class="analyzing-spinner"></div>
                <span>${aiIndicator}Analyzing your CV with AI...</span>
            </div>
        `;
    }
    
    try {
        let results;
        
        if (useAI) {
            try {
                results = await AIService.analyzeCVWithAI(cvText, '', {
                    industry: 'tech',
                    experienceLevel: 'mid',
                    proMode: false
                });
                console.log("🤖 CV Builder AI Enhancement completed");
            } catch (aiError) {
                console.error("AI failed, using local:", aiError);
                results = analyzeCV(cvText, '', { industry: 'tech', experienceLevel: 'mid', proMode: false });
            }
        } else {
            results = analyzeCV(cvText, '', { industry: 'tech', experienceLevel: 'mid', proMode: false });
        }
        
        // Update AI Suggestions
        if (aiSuggestionsContainer) {
            updateAISuggestions(results);
        }
        
        // Update Keywords
        if (keywordSuggestionsContainer) {
            updateKeywordSuggestions(results);
        }
        
        // Show success toast
        const aiBadge = useAI ? ' 🤖' : '';
        showToast(`CV Analysis Complete${aiBadge}!`);
        
    } catch (error) {
        console.error('AI Enhancement error:', error);
        // Show error state with fallback suggestions
        if (aiSuggestionsContainer) {
            aiSuggestionsContainer.innerHTML = `
                <div class="ai-suggestion-item">
                    <div class="ai-badge">AI Suggestion</div>
                    <p>Add quantifiable achievements to stand out. Use numbers like "40% increase" or "$100K saved".</p>
                </div>
                <div class="ai-suggestion-item">
                    <div class="ai-badge">AI Suggestion</div>
                    <p>Include relevant keywords from job descriptions to pass ATS systems.</p>
                </div>
                <div class="ai-suggestion-item">
                    <div class="ai-badge">AI Suggestion</div>
                    <p>Keep your CV concise - 2 pages maximum for experienced professionals.</p>
                </div>
            `;
        }
    }
}

// Build CV text from form data
function buildCVTextFromForm() {
    const personal = state.cvData.personal;
    let cvText = '';
    
    // Add personal details
    if (personal.name) cvText += personal.name + '\n';
    if (personal.title) cvText += personal.title + '\n';
    if (personal.email) cvText += personal.email + '\n';
    if (personal.phone) cvText += personal.phone + '\n';
    if (personal.location) cvText += personal.location + '\n';
    
    cvText += '\nEXPERIENCE\n';
    
    // Add experience
    const expItems = document.querySelectorAll('.experience-item');
    expItems.forEach(item => {
        const title = item.querySelector('.exp-title')?.value;
        const company = item.querySelector('.exp-company')?.value;
        const start = item.querySelector('.exp-start')?.value;
        const end = item.querySelector('.exp-end')?.value;
        const desc = item.querySelector('.exp-description')?.value;
        
        if (title) {
            cvText += title + '\n';
            if (company) cvText += company + '\n';
            if (start || end) cvText += (start || '') + ' - ' + (end || 'Present') + '\n';
            if (desc) cvText += desc + '\n';
            cvText += '\n';
        }
    });
    
    // Add skills
    const skills = state.cvData.skills;
    const softSkills = state.cvData.softSkills;
    
    if (skills || softSkills) {
        cvText += 'SKILLS\n';
        if (skills) cvText += skills + '\n';
        if (softSkills) cvText += softSkills + '\n';
    }
    
    cvText += '\nEDUCATION\n';
    
    // Add education
    const eduItems = document.querySelectorAll('.education-item');
    eduItems.forEach(item => {
        const degree = item.querySelector('.edu-degree')?.value;
        const school = item.querySelector('.edu-school')?.value;
        const year = item.querySelector('.edu-year')?.value;
        
        if (degree) {
            cvText += degree + '\n';
            if (school) cvText += school + '\n';
            if (year) cvText += year + '\n';
            cvText += '\n';
        }
    });
    
    return cvText;
}

// Update AI suggestions with analysis results
function updateAISuggestions(results) {
    const container = document.querySelector('.ai-suggestions');
    if (!container) return;
    
    const suggestions = [];
    
    // Add suggestions based on weaknesses found
    const weaknesses = results.structuralWeaknesses;
    
    if (weaknesses.weakBullets && weaknesses.weakBullets.length > 0) {
        suggestions.push({
            title: 'Weak Phrases Detected',
            text: `Found ${weaknesses.weakBullets.length} weak phrases like "responsible for". Replace with stronger action verbs for more impact.`
        });
    }
    
    if (weaknesses.missingMetrics && weaknesses.missingMetrics.length > 0) {
        suggestions.push({
            title: 'Add Quantifiable Metrics',
            text: `${weaknesses.missingMetrics.length} achievements lack metrics. Add numbers like "40% increase" or "$100K saved" to stand out.`
        });
    }
    
    // ATS Score suggestion
    if (results.atsScore < 70) {
        suggestions.push({
            title: 'ATS Score Needs Improvement',
            text: `Your CV scores ${results.atsScore}% on ATS. Add more relevant keywords to improve visibility.`
        });
    } else {
        suggestions.push({
            title: 'Great ATS Score',
            text: `Your CV scores ${results.atsScore}% on ATS - well optimized for applicant tracking systems!`
        });
    }
    
    // Personal brand suggestions
    const brand = results.personalBrand;
    if (brand.analysis && brand.analysis.length > 0) {
        suggestions.push({
            title: 'Personal Brand Tips',
            text: brand.analysis[0]
        });
    }
    
    // Power bullet upgrade suggestion
    if (results.powerBulletUpgrades && results.powerBulletUpgrades.length > 0) {
        suggestions.push({
            title: 'Bullet Point Upgrades Available',
            text: `Found ${results.powerBulletUpgrades.length} bullet points that can be enhanced with stronger action verbs and metrics.`
        });
    }
    
    // Fallback suggestions if not enough analysis
    if (suggestions.length < 3) {
        suggestions.push({
            title: 'Keyword Optimization',
            text: 'Include relevant industry keywords from job descriptions to pass ATS screenings.'
        });
        suggestions.push({
            title: 'Keep It Concise',
            text: 'Aim for 2 pages maximum. Use bullet points for easy scanning by recruiters.'
        });
    }
    
    // Render suggestions
    container.innerHTML = suggestions.slice(0, 5).map(s => `
        <div class="ai-suggestion-item">
            <div class="ai-badge">${s.title}</div>
            <p>${s.text}</p>
        </div>
    `).join('');
}

// Update keyword suggestions
function updateKeywordSuggestions(results) {
    const container = document.getElementById('keywordSuggestions');
    if (!container) return;
    
    // Combine missing and matched keywords
    const keywords = [
        ...(results.missingKeywords || []).slice(0, 5),
        ...(results.matchedKeywords || []).slice(0, 5)
    ];
    
    // Remove duplicates and get unique
    const uniqueKeywords = [...new Set(keywords)];
    
    if (uniqueKeywords.length > 0) {
        container.innerHTML = uniqueKeywords.slice(0, 8).map(k => 
            `<span class="keyword">${k}</span>`
        ).join('');
    }
}

// Initialize Intelligence Tabs
function initIntelligenceTabs() {
    const tabs = document.querySelectorAll('.input-tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;
            
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Hide all tab contents
            tabContents.forEach(content => content.classList.remove('active'));
            // Show target tab content
            document.getElementById(`tab-${targetTab}`).classList.add('active');
        });
    });
}

// Initialize File Upload
function initFileUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('cvFileInput');
    
    if (!uploadArea || !fileInput) return;
    
    // Click to browse
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });
    
    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileUpload(files[0]);
        }
    });
    
    // File input change
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFileUpload(e.target.files[0]);
        }
    });
}

// Handle File Upload
function handleFileUpload(file) {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!validTypes.includes(file.type)) {
        showToast('Invalid file type. Please upload PDF, DOCX, or TXT');
        return;
    }
    
    if (file.size > maxSize) {
        showToast('File too large. Maximum size is 5MB');
        return;
    }
    
    // Show file preview
    const uploadArea = document.getElementById('uploadArea');
    const uploadPreview = document.getElementById('uploadPreview');
    const fileName = document.getElementById('fileName');
    
    if (uploadArea) uploadArea.style.display = 'none';
    if (uploadPreview) {
        uploadPreview.style.display = 'block';
        if (fileName) fileName.textContent = file.name;
    }
    
    // Show processing indicator
    showToast('Processing file...');
    
    // Read file content
    const reader = new FileReader();
    reader.onload = (e) => {
        const content = e.target.result;
        // Store the content for analysis
        window.uploadedCVContent = content;
        
        // Show success with details
        const wordCount = content.split(/\s+/).length;
        showToast(`✓ "${file.name}" loaded! ${wordCount} words detected.`);
        
        // Add a note about analysis
        setTimeout(() => {
            showToast('Click "Analyze My CV" to get detailed insights!');
        }, 1500);
    };
    
    reader.onerror = () => {
        showToast('Error reading file. Please try again.');
    };
    
    if (file.type === 'text/plain') {
        reader.readAsText(file);
    } else {
        // For PDF/DOCX - simulate content extraction
        // In production, you'd use pdf.js or mammoth.js
        setTimeout(() => {
            window.uploadedCVContent = `[File uploaded: ${file.name}]\n\nNote: For PDF/DOCX files, please ensure the text is properly formatted. The analysis will work best with plain text content.\n\nYou can also copy-paste your CV content in the Paste Text tab for more accurate analysis.`;
            showToast(`✓ File "${file.name}" uploaded! For best results, also paste text.`);
        }, 500);
    }
}

// Remove Uploaded File
function removeUploadedFile() {
    const uploadArea = document.getElementById('uploadArea');
    const uploadPreview = document.getElementById('uploadPreview');
    const fileInput = document.getElementById('cvFileInput');
    
    if (uploadArea) uploadArea.style.display = 'block';
    if (uploadPreview) uploadPreview.style.display = 'none';
    if (fileInput) fileInput.value = '';
    
    window.uploadedCVContent = null;
}

// Quick Score Calculator - Shows quick ATS score without full analysis
function calculateQuickScore() {
    const title = document.getElementById('quickTitle')?.value || '';
    const years = parseInt(document.getElementById('quickYears')?.value || '0');
    const skills = document.getElementById('quickSkills')?.value || '';
    
    if (!title && years === 0 && !skills) {
        showToast('Please enter at least one field to calculate score');
        return;
    }
    
    let score = 0;
    let tips = [];
    
    // Title presence
    if (title.length > 0) {
        score += 20;
        if (title.toLowerCase().includes('senior') || title.toLowerCase().includes('lead')) {
            score += 10;
            tips.push('Senior/Lead titles boost credibility');
        }
    } else {
        tips.push('Add your job title to improve score');
    }
    
    // Years of experience
    if (years >= 1) score += 15;
    if (years >= 3) score += 15;
    if (years >= 5) score += 10;
    if (years >= 10) score += 10;
    
    if (years === 0) {
        tips.push('Add years of experience');
    }
    
    // Skills
    const skillCount = skills.split(',').filter(s => s.trim()).length;
    if (skillCount >= 3) score += 15;
    if (skillCount >= 5) score += 15;
    if (skillCount >= 10) score += 10;
    
    if (skillCount < 3) {
        tips.push('Add at least 3 skills for better score');
    } else if (skillCount >= 5) {
        tips.push('Great skill variety!');
    }
    
    // Cap at 100
    score = Math.min(score, 100);
    
    // Update score display
    const scoreValue = document.getElementById('quickAtsScore');
    if (scoreValue) {
        scoreValue.textContent = score + '%';
        
        // Add color based on score
        if (score < 40) {
            scoreValue.style.color = '#e07a5f';
        } else if (score < 70) {
            scoreValue.style.color = '#f4d03f';
        } else {
            scoreValue.style.color = '#6bcb77';
        }
    }
    
    // Show quick tips based on score
    let message = `Quick ATS Score: ${score}%`;
    if (tips.length > 0 && score < 70) {
        message += ` - ${tips[0]}`;
    }
    showToast(message);
    
    // Also show a quick result popup
    showQuickResult(score, tips);
}

// Show quick result in a modal-like display
function showQuickResult(score, tips) {
    const quickSection = document.querySelector('.quick-analyze');
    if (!quickSection) return;
    
    // Remove any existing quick result
    const existingResult = document.getElementById('quickResultDisplay');
    if (existingResult) existingResult.remove();
    
    // Create result display
    const resultDiv = document.createElement('div');
    resultDiv.id = 'quickResultDisplay';
    resultDiv.className = 'quick-result-display';
    
    let scoreClass = score < 40 ? 'low' : score < 70 ? 'medium' : 'high';
    let scoreMessage = score < 40 ? 'Needs Improvement' : score < 70 ? 'Good' : 'Excellent';
    
    resultDiv.innerHTML = `
        <div class="quick-result-header">
            <span class="quick-result-score ${scoreClass}">${score}%</span>
            <span class="quick-result-label">${scoreMessage}</span>
        </div>
        <div class="quick-result-tips">
            ${tips.map(tip => `<span class="quick-tip">💡 ${tip}</span>`).join('')}
        </div>
        <button class="btn-full-analyze" onclick="switchToFullAnalysis()">
            Get Full Analysis →
        </button>
    `;
    
    quickSection.appendChild(resultDiv);
}

// Switch to full analysis tab
function switchToFullAnalysis() {
    const pasteTab = document.querySelector('.input-tab[data-tab="paste"]');
    if (pasteTab) {
        pasteTab.click();
    }
}

// AI Settings Functions
function saveAISettings() {
    const tokenInput = document.getElementById('hfTokenInput');
    const token = tokenInput?.value.trim();
    
    if (!token) {
        showToast('Please enter a HuggingFace token');
        return;
    }
    
    if (!token.startsWith('hf_')) {
        showToast('Invalid token format. Token should start with hf_');
        return;
    }
    
    // Save to config
    AI_CONFIG.hf_token = token;
    
    // Initialize AI Service
    AIService.init(token);
    
    // Save to localStorage
    localStorage.setItem('vellon_x_ai_token', token);
    
    // Update status
    updateAIStatus(true);
    
    showToast('🤖 AI Settings Saved! AI is now active.');
    
    // Close modal
    document.getElementById('aiSettingsModal').classList.remove('active');
}

function updateAIStatus(isActive) {
    const statusText = document.getElementById('aiStatusText');
    if (statusText) {
        if (isActive) {
            statusText.innerHTML = '🟢 AI Active - Qwen3.5 Model';
            statusText.style.color = '#6bcb77';
        } else {
            statusText.innerHTML = '🔴 AI Not Configured';
            statusText.style.color = '#888';
        }
    }
}

async function testAIConnection() {
    const tokenInput = document.getElementById('hfTokenInput');
    const token = tokenInput?.value.trim();
    
    if (!token) {
        showToast('Please enter a token first');
        return;
    }
    
    const btn = event.target;
    btn.disabled = true;
    btn.textContent = 'Testing...';
    
    try {
        // Initialize with token
        AIService.init(token);
        
        // Quick test
        const response = await AIService.complete("Say 'Hello' if you can hear me.", { max_tokens: 50 });
        
        if (response && response.toLowerCase().includes('hello')) {
            showToast('✅ AI Connection Successful!');
            updateAIStatus(true);
        } else {
            showToast('⚠️ AI responded but may not be working correctly');
        }
    } catch (error) {
        console.error('AI Test error:', error);
        showToast('❌ AI Connection Failed: ' + error.message);
    }
    
    btn.disabled = false;
    btn.textContent = 'Test Connection';
}

// Load saved AI token on startup
function loadAISettings() {
    const savedToken = localStorage.getItem('vellon_x_ai_token');
    if (savedToken) {
        AI_CONFIG.hf_token = savedToken;
        AIService.init(savedToken);
        updateAIStatus(true);
        console.log('🤖 AI Service loaded from saved settings');
    }
}

// Initialize AI settings on load
window.addEventListener('load', function() {
    loadAISettings();
});

// 3D Globe Animation with Mouse Follow
function initGlobeAnimation() {
    const globe = document.getElementById('globe');
    if (!globe) return;
    
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    
    document.addEventListener('mousemove', function(e) {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        // Calculate mouse position as percentage from center
        targetX = ((e.clientX - windowWidth / 2) / windowWidth) * 30; // -15 to 15 degrees
        targetY = ((e.clientY - windowHeight / 2) / windowHeight) * 30; // -15 to 15 degrees
    });
    
    // Smooth animation loop
    function animateGlobe() {
        // Smooth interpolation
        currentX += (targetX - currentX) * 0.05;
        currentY += (targetY - currentY) * 0.05;
        
        // Apply rotation with perspective
        globe.style.transform = `perspective(1000px) rotateX(${-currentY}deg) rotateY(${currentX}deg)`;
        
        requestAnimationFrame(animateGlobe);
    }
    
    animateGlobe();
}

// Scroll-based Parallax Animation
function initScrollParallax() {
    const parallaxElements = document.querySelectorAll('.parallax-element, .gradient-orb, .floating-element');
    
    if (parallaxElements.length === 0) return;
    
    window.addEventListener('scroll', function() {
        const scrollY = window.scrollY;
        
        parallaxElements.forEach((el, index) => {
            const speed = 0.1 + (index * 0.05);
            const yPos = scrollY * speed;
            
            if (el.classList.contains('gradient-orb')) {
                el.style.transform = `translateY(${yPos * 0.5}px)`;
            } else if (el.classList.contains('globe')) {
                // Globe moves opposite to scroll
                el.style.marginTop = `${scrollY * 0.1}px`;
            }
        });
    });
    
    // Add parallax class to existing elements
    const orbs = document.querySelectorAll('.gradient-orb');
    orbs.forEach((orb, index) => {
        orb.style.transition = 'transform 0.1s ease-out';
    });
}
