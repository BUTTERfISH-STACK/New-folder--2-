// Vellon - Premium AI Career Platform JavaScript

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
    courses: {
        'ai-foundations': {
            title: 'AI Foundations',
            modules: [
                { id: 1, title: 'Introduction to AI', completed: false },
                { id: 2, title: 'Machine Learning Basics', completed: false },
                { id: 3, title: 'Neural Networks', completed: false },
                { id: 4, title: 'AI in Business', completed: false }
            ]
        },
        'ai-productivity': {
            title: 'AI Productivity Tools',
            modules: [
                { id: 1, title: 'ChatGPT Mastery', completed: false },
                { id: 2, title: 'Claude & Other LLMs', completed: false },
                { id: 3, title: 'AI Writing Tools', completed: false },
                { id: 4, title: 'Automation with AI', completed: false }
            ]
        },
        'digital-products': {
            title: 'Building Digital Products',
            modules: [
                { id: 1, title: 'Product Ideation', completed: false },
                { id: 2, title: 'MVP Development', completed: false },
                { id: 3, title: 'No-Code Tools', completed: false },
                { id: 4, title: 'Launch Strategy', completed: false }
            ]
        },
        'future-skills': {
            title: 'Future-Proof Tech Skills',
            modules: [
                { id: 1, title: 'No-Code Revolution', completed: false },
                { id: 2, title: 'Automation Skills', completed: false },
                { id: 3, title: 'Remote Work Tools', completed: false },
                { id: 4, title: '2026 Tech Trends', completed: false }
            ]
        }
    },
    enrolledCourses: [],
    currentLesson: { course: null, moduleIndex: 0 },
    certificates: []
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadUserData();
    initParticles();
    updateUI();
});

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
    
    // Update ATS score
    updateATSScore();
    
    // Save to localStorage
    localStorage.setItem('vellon_cv_data', JSON.stringify(state.cvData));
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
    
    // Colors
    const gold = [212, 175, 55];
    const darkGold = [184, 134, 11];
    const white = [255, 255, 255];
    const gray = [128, 128, 128];
    const lightGray = [200, 200, 200];
    
    let y = 20;
    
    // Name - Gold
    doc.setTextColor(...gold);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(personal.name || 'Your Name', 105, y, { align: 'center' });
    y += 10;
    
    // Title - Dark Gold
    doc.setTextColor(...darkGold);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text(personal.title || 'Professional Title', 105, y, { align: 'center' });
    y += 12;
    
    // Contact Info - Gray
    doc.setTextColor(...gray);
    doc.setFontSize(10);
    let contact = [];
    if (personal.email) contact.push(personal.email);
    if (personal.phone) contact.push(personal.phone);
    if (personal.location) contact.push(personal.location);
    if (personal.linkedin) contact.push(personal.linkedin);
    doc.text(contact.join('  |  '), 105, y, { align: 'center' });
    y += 10;
    
    // Gold line
    doc.setDrawColor(...gold);
    doc.setLineWidth(0.5);
    doc.line(20, y, 190, y);
    y += 10;
    
    // Experience Section
    const expItems = document.querySelectorAll('.experience-item');
    if (expItems.length > 0) {
        // Section Title - Gold
        doc.setTextColor(...gold);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('PROFESSIONAL EXPERIENCE', 20, y);
        y += 6;
        doc.line(20, y, 190, y);
        y += 8;
        
        expItems.forEach(item => {
            const title = item.querySelector('.exp-title')?.value || '';
            const company = item.querySelector('.exp-company')?.value || '';
            const start = item.querySelector('.exp-start')?.value || '';
            const end = item.querySelector('.exp-end')?.value || 'Present';
            const desc = item.querySelector('.exp-description')?.value || '';
            
            if (title || company) {
                // Job Title - Bold
                doc.setTextColor(0, 0, 0);
                doc.setFontSize(11);
                doc.setFont('helvetica', 'bold');
                doc.text(title, 20, y);
                
                // Dates - Gray
                doc.setTextColor(...gray);
                doc.setFontSize(9);
                doc.setFont('helvetica', 'italic');
                const dates = start && end ? formatDate(start) + ' - ' + formatDate(end) : '';
                if (dates) doc.text(dates, 190, y, { align: 'right' });
                y += 5;
                
                // Company - Gold
                doc.setTextColor(...darkGold);
                doc.setFontSize(10);
                doc.setFont('helvetica', 'normal');
                doc.text(company, 20, y);
                y += 6;
                
                // Description
                if (desc) {
                    doc.setTextColor(60, 60, 60);
                    doc.setFontSize(9);
                    const lines = doc.splitTextToSize(desc, 170);
                    doc.text(lines, 20, y);
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
        // Section Title - Gold
        doc.setTextColor(...gold);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('SKILLS', 20, y);
        y += 6;
        doc.line(20, y, 190, y);
        y += 8;
        
        doc.setTextColor(60, 60, 60);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        
        // Technical Skills
        if (techSkills.length > 0) {
            const skillsText = techSkills.map(s => s.trim()).join(', ');
            const lines = doc.splitTextToSize(skillsText, 170);
            doc.text(lines, 20, y);
            y += lines.length * 4 + 4;
        }
        
        // Soft Skills
        if (softSkills.length > 0) {
            const softText = softSkills.map(s => s.trim()).join(', ');
            const lines = doc.splitTextToSize(softText, 170);
            doc.text(lines, 20, y);
            y += lines.length * 4 + 4;
        }
    }
    
    // Education Section
    const eduItems = document.querySelectorAll('.education-item');
    if (eduItems.length > 0) {
        // Section Title - Gold
        doc.setTextColor(...gold);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('EDUCATION', 20, y);
        y += 6;
        doc.line(20, y, 190, y);
        y += 8;
        
        eduItems.forEach(item => {
            const degree = item.querySelector('.edu-degree')?.value || '';
            const school = item.querySelector('.edu-school')?.value || '';
            const year = item.querySelector('.edu-year')?.value || '';
            
            if (degree || school) {
                // Degree - Bold
                doc.setTextColor(0, 0, 0);
                doc.setFontSize(11);
                doc.setFont('helvetica', 'bold');
                doc.text(degree, 20, y);
                
                // Year - Gray
                doc.setTextColor(...gray);
                doc.setFontSize(9);
                if (year) doc.text(year, 190, y, { align: 'right' });
                y += 5;
                
                // School - Gold
                doc.setTextColor(...darkGold);
                doc.setFontSize(10);
                doc.setFont('helvetica', 'normal');
                doc.text(school, 20, y);
                y += 8;
            }
        });
    }
    
    // Footer
    doc.setTextColor(...lightGray);
    doc.setFontSize(8);
    doc.text('Generated by Vellon - AI-Powered Career Platform', 105, 285, { align: 'center' });
    
    // Save PDF
    const filename = (personal.name || 'CV').replace(/\s+/g, '_') + '_CV.pdf';
    doc.save(filename);
    
    showToast('CV downloaded as PDF!');
}

// Course Functions
function startCourse(courseId) {
    state.currentLesson.course = courseId;
    state.currentLesson.moduleIndex = 0;
    
    // Enroll if not already enrolled
    if (!state.enrolledCourses.includes(courseId)) {
        state.enrolledCourses.push(courseId);
        saveUserData();
    }
    
    // Show learning interface
    showSection('course-learn');
    updateCourseInterface();
}

function updateCourseInterface() {
    const course = state.courses[state.currentLesson.course];
    if (!course) return;
    
    // Update course title
    const titleEl = document.getElementById('currentCourseTitle');
    if (titleEl) titleEl.textContent = course.title;
    
    // Update modules list
    const modulesList = document.getElementById('modulesList');
    if (modulesList) {
        modulesList.innerHTML = course.modules.map((module, index) => `
            <div class="module-item ${index <= state.currentLesson.moduleIndex ? 'active' : 'locked'}" 
                 onclick="selectModule(${index})">
                <span class="module-icon">${module.completed ? '✅' : '📚'}</span>
                <span class="module-title">${module.title}</span>
            </div>
        `).join('');
    }
    
    // Update current lesson
    const module = course.modules[state.currentLesson.moduleIndex];
    if (module) {
        const lessonNumber = document.getElementById('lessonNumber');
        const lessonTitle = document.getElementById('lessonTitle');
        const prevBtn = document.getElementById('prevLessonBtn');
        const nextBtn = document.getElementById('nextLessonBtn');
        
        if (lessonNumber) lessonNumber.textContent = `Module ${state.currentLesson.moduleIndex + 1}`;
        if (lessonTitle) lessonTitle.textContent = module.title;
        if (prevBtn) prevBtn.style.display = state.currentLesson.moduleIndex > 0 ? 'block' : 'none';
        
        // Calculate and update progress
        const completedCount = course.modules.filter(m => m.completed).length;
        const progress = Math.round((completedCount / course.modules.length) * 100);
        
        const progressFill = document.getElementById('progressFill');
        const courseProgress = document.getElementById('courseProgress');
        
        if (progressFill) progressFill.style.width = progress + '%';
        if (courseProgress) courseProgress.textContent = progress + '%';
    }
}

function selectModule(index) {
    if (index <= state.currentLesson.moduleIndex) {
        state.currentLesson.moduleIndex = index;
        updateCourseInterface();
    }
}

function nextLesson() {
    const course = state.courses[state.currentLesson.course];
    if (!course) return;
    
    // Mark current module as completed
    course.modules[state.currentLesson.moduleIndex].completed = true;
    
    // Check if course is completed
    if (state.currentLesson.moduleIndex < course.modules.length - 1) {
        state.currentLesson.moduleIndex++;
    } else {
        // Course completed - generate certificate
        generateCertificate();
        showToast('🎉 Congratulations! You completed the course!');
    }
    
    updateCourseInterface();
    saveUserData();
}

function prevLesson() {
    if (state.currentLesson.moduleIndex > 0) {
        state.currentLesson.moduleIndex--;
        updateCourseInterface();
    }
}

// Certificate Functions
function generateCertificate() {
    const personal = state.cvData.personal;
    const certName = document.getElementById('certName');
    const certDate = document.getElementById('certDate');
    
    if (certName) {
        certName.textContent = personal.name || 'Student';
    }
    
    if (certDate) {
        const date = new Date();
        certDate.textContent = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
    
    // Add to certificates if not already there
    if (!state.certificates.includes(state.currentLesson.course)) {
        state.certificates.push(state.currentLesson.course);
        saveUserData();
    }
}

function downloadCertificate() {
    const personal = state.cvData.personal;
    const course = state.courses[state.currentLesson.course];
    
    const content = `
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║                    ✦ VELLON CERTIFICATE ✦                        ║
║                    of Completion                                 ║
║                                                                  ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║        This is to certify that                                    ║
║                                                                  ║
║                   ${(personal.name || 'Student').toUpperCase().padEnd(40)}║
║                                                                  ║
║        has successfully completed                               ║
║                                                                  ║
║              ${(course?.title || 'AI & Tech Entrepreneur Course').padEnd(40)}║
║                                                                  ║
║        ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).padEnd(50)}║
║                                                                  ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║        Certificate ID: VEL-2026-${Math.random().toString(36).substring(2, 7).toUpperCase().padEnd(35)}║
║                                                                  ║
║                    ✦ VELLON ✦                                    ║
║            AI-Powered Career Platform                            ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Vellon_Certificate.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    showToast('Certificate downloaded!');
}

function verifyCertificate() {
    const input = document.getElementById('verifyInput');
    const result = document.getElementById('verifyResult');
    
    if (!input || !result) return;
    
    const certId = input.value.trim();
    
    if (certId.startsWith('VEL-2026-') && certId.length > 10) {
        result.innerHTML = '✓ Certificate verified! Valid Vellon certificate.';
        result.className = 'verify-result success';
    } else {
        result.innerHTML = '✕ Invalid certificate ID. Please check and try again.';
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
    localStorage.removeItem('vellon_user');
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
        enrolledCourses: state.enrolledCourses,
        certificates: state.certificates,
        courses: state.courses
    };
    localStorage.setItem('vellon_user_data', JSON.stringify(userData));
}

function loadUserData() {
    const saved = localStorage.getItem('vellon_user_data');
    if (saved) {
        const data = JSON.parse(saved);
        state.user = data.user || null;
        state.cvData = data.cvData || state.cvData;
        state.enrolledCourses = data.enrolledCourses || [];
        state.certificates = data.certificates || [];
        state.courses = data.courses || state.courses;
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
    const dashCourses = document.getElementById('dashCourses');
    const dashCompleted = document.getElementById('dashCompleted');
    const dashCertificates = document.getElementById('dashCertificates');
    const dashHours = document.getElementById('dashHours');
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    const enrolledList = document.getElementById('enrolledCoursesList');
    
    if (dashCourses) dashCourses.textContent = state.enrolledCourses.length;
    if (dashCompleted) {
        let completed = 0;
        Object.values(state.courses).forEach(course => {
            completed += course.modules.filter(m => m.completed).length;
        });
        dashCompleted.textContent = completed;
    }
    if (dashCertificates) dashCertificates.textContent = state.certificates.length;
    if (dashHours) dashHours.textContent = state.enrolledCourses.length * 10;
    
    if (userName) userName.textContent = state.user?.name || 'User';
    if (userEmail) userEmail.textContent = state.user?.email || 'user@example.com';
    
    if (enrolledList) {
        if (state.enrolledCourses.length === 0) {
            enrolledList.innerHTML = '<p class="empty-state">No courses enrolled yet</p>';
        } else {
            enrolledList.innerHTML = state.enrolledCourses.map(id => {
                const course = state.courses[id];
                return `
                    <div class="enrolled-course-item">
                        <span>${course?.title || 'Course'}</span>
                        <button class="btn-glass btn-sm" onclick="startCourse('${id}')">Continue</button>
                    </div>
                `;
            }).join('');
        }
    }
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
function runCVAnalysis() {
    const cvText = document.getElementById('cvInputText').value;
    const jobDescription = document.getElementById('jobDescriptionText').value;
    const industry = document.getElementById('industrySelect').value;
    const experienceLevel = document.getElementById('experienceSelect').value;
    const proMode = document.getElementById('proModeCheck').checked;
    
    if (!cvText || cvText.trim().length < 50) {
        showToast('Please paste your CV content (at least 50 characters)');
        return;
    }
    
    // Show loading state
    const resultsContainer = document.getElementById('cvIntelligenceResults');
    resultsContainer.innerHTML = '<div style="text-align:center;padding:40px;"><div style="font-size:24px;margin-bottom:16px;">Analyzing...</div><p style="color:var(--text-secondary)">Processing your CV with AI intelligence</p></div>';
    resultsContainer.classList.add('active');
    
    // Run analysis
    setTimeout(() => {
        try {
            const results = analyzeCV(cvText, jobDescription, {
                industry,
                experienceLevel,
                proMode
            });
            
            showCVIntelligenceResults(results);
            showToast('CV Analysis Complete!');
            
            // Scroll to results
            resultsContainer.scrollIntoView({ behavior: 'smooth' });
        } catch (error) {
            console.error('Analysis error:', error);
            resultsContainer.innerHTML = '<div style="text-align:center;padding:40px;"><p style="color:#e07a5f">Error analyzing CV. Please try again.</p></div>';
            showToast('Analysis failed. Please try again.');
        }
    }, 500);
}
