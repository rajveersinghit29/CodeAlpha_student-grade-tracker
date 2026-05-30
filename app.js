/**
 * ============================================
 * GradeSync — Student Grade Tracker
 * Core Application Logic (Java → JavaScript)
 * ============================================
 * 
 * This module mirrors the Java StudentGradeTracker class,
 * converting ArrayList-based logic to JavaScript arrays.
 * Designed for easy conversion to Spring Boot REST API calls.
 */

// ============================================
// Student Class (mirrors Java Student class)
// ============================================
class Student {
    constructor(name, grade) {
        this.id = Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
        this.name = name;
        this.grade = parseFloat(grade);
        this.timestamp = new Date().toISOString();
    }

    getName() { return this.name; }
    getGrade() { return this.grade; }
    getId() { return this.id; }
    getTimestamp() { return this.timestamp; }

    // Get letter grade
    getLetterGrade() {
        if (this.grade >= 90) return 'A';
        if (this.grade >= 80) return 'B';
        if (this.grade >= 70) return 'C';
        if (this.grade >= 60) return 'D';
        return 'F';
    }

    // Get pass/fail status
    getStatus() {
        return this.grade >= 50 ? 'Pass' : 'Fail';
    }

    // Serialize for localStorage
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            grade: this.grade,
            timestamp: this.timestamp
        };
    }

    // Deserialize from localStorage
    static fromJSON(json) {
        const student = new Student(json.name, json.grade);
        student.id = json.id;
        student.timestamp = json.timestamp;
        return student;
    }
}


// ============================================
// StudentGradeTracker Class (mirrors Java class)
// ============================================
class StudentGradeTracker {
    constructor() {
        // ArrayList<Student> → JavaScript Array
        this.students = [];
        this.loadFromStorage();
    }

    // ---- Core Methods (same as Java) ----

    /**
     * Add a student (mirrors Java addStudent)
     * @param {string} name 
     * @param {number} grade 
     * @returns {Student|null}
     */
    addStudent(name, grade) {
        // Validation
        if (!name || name.trim() === '') return null;
        const g = parseFloat(grade);
        if (isNaN(g) || g < 0 || g > 100) return null;

        const student = new Student(name.trim(), g);
        this.students.push(student);
        this.saveToStorage();
        return student;
    }

    /**
     * Remove a student by ID (upgrade over Java version)
     * @param {string} id 
     * @returns {boolean}
     */
    removeStudent(id) {
        const index = this.students.findIndex(s => s.getId() === id);
        if (index === -1) return false;
        this.students.splice(index, 1);
        this.saveToStorage();
        return true;
    }

    /**
     * Calculate Average Score (same logic as Java)
     * @returns {number}
     */
    calculateAverage() {
        if (this.students.length === 0) return 0.0;
        let sum = 0;
        for (const s of this.students) {
            sum += s.getGrade();
        }
        return sum / this.students.length;
    }

    /**
     * Find Highest Score (same logic as Java)
     * @returns {number}
     */
    findHighestScore() {
        if (this.students.length === 0) return 0.0;
        let max = this.students[0].getGrade();
        for (const s of this.students) {
            if (s.getGrade() > max) {
                max = s.getGrade();
            }
        }
        return max;
    }

    /**
     * Find Lowest Score (same logic as Java)
     * @returns {number}
     */
    findLowestScore() {
        if (this.students.length === 0) return 0.0;
        let min = this.students[0].getGrade();
        for (const s of this.students) {
            if (s.getGrade() < min) {
                min = s.getGrade();
            }
        }
        return min;
    }

    // ---- Extended Methods (beyond Java version) ----

    /**
     * Get total student count
     * @returns {number}
     */
    getStudentCount() {
        return this.students.length;
    }

    /**
     * Get grade distribution for chart
     * @returns {Object}
     */
    getGradeDistribution() {
        const dist = { A: 0, B: 0, C: 0, D: 0, F: 0 };
        for (const s of this.students) {
            dist[s.getLetterGrade()]++;
        }
        return dist;
    }

    /**
     * Search students by name
     * @param {string} query 
     * @returns {Student[]}
     */
    searchStudents(query) {
        if (!query || query.trim() === '') return [...this.students];
        const q = query.toLowerCase().trim();
        return this.students.filter(s => 
            s.getName().toLowerCase().includes(q)
        );
    }

    /**
     * Get all students (sorted by most recent first)
     * @returns {Student[]}
     */
    getAllStudents() {
        return [...this.students].reverse();
    }

    /**
     * Get pass rate percentage
     * @returns {number}
     */
    getPassRate() {
        if (this.students.length === 0) return 0;
        const passing = this.students.filter(s => s.getGrade() >= 50).length;
        return (passing / this.students.length) * 100;
    }

    // ---- Persistence ----

    saveToStorage() {
        try {
            const data = this.students.map(s => s.toJSON());
            localStorage.setItem('gradesync_students', JSON.stringify(data));
        } catch (e) {
            console.warn('LocalStorage save failed:', e);
        }
    }

    loadFromStorage() {
        try {
            const data = localStorage.getItem('gradesync_students');
            if (data) {
                const parsed = JSON.parse(data);
                this.students = parsed.map(json => Student.fromJSON(json));
            }
        } catch (e) {
            console.warn('LocalStorage load failed:', e);
            this.students = [];
        }
    }
}


// ============================================
// Toast Notification System
// ============================================
class ToastManager {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    show(message, type = 'success', duration = 3500) {
        const icons = {
            success: 'check_circle',
            error: 'error',
            warning: 'warning',
            info: 'info'
        };

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <span class="material-symbols-outlined" style="font-size:20px;font-variation-settings:'FILL' 1;">${icons[type]}</span>
            <span>${message}</span>
        `;

        this.container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('removing');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
}


// ============================================
// DOM Controller — Connects Logic to UI
// ============================================
class GradeSyncApp {
    constructor() {
        this.tracker = new StudentGradeTracker();
        this.toast = new ToastManager('toast-container');
        this.currentSearch = '';
        this.pendingDeleteId = null;

        this.init();
    }

    init() {
        this.bindEvents();
        this.render();
    }

    bindEvents() {
        // Desktop form
        const desktopBtn = document.getElementById('desktop-add-btn');
        if (desktopBtn) {
            desktopBtn.addEventListener('click', () => this.handleAddStudent('desktop'));
        }

        // Mobile form
        const mobileBtn = document.getElementById('mobile-add-btn');
        if (mobileBtn) {
            mobileBtn.addEventListener('click', () => this.handleAddStudent('mobile'));
        }

        // Enter key on inputs
        ['desktop-name', 'desktop-grade', 'mobile-name', 'mobile-grade'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        const platform = id.startsWith('desktop') ? 'desktop' : 'mobile';
                        this.handleAddStudent(platform);
                    }
                });
            }
        });

        // Search
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.currentSearch = e.target.value;
                this.renderStudentTable();
            });
        }

        // Modal
        const modalOverlay = document.getElementById('modal-overlay');
        if (modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) this.toggleModal(false);
            });
        }

        // Mobile FAB
        const fabBtn = document.getElementById('fab-add');
        if (fabBtn) {
            fabBtn.addEventListener('click', () => this.toggleModal(true));
        }

        // Confirm dialog buttons
        const confirmYes = document.getElementById('confirm-yes');
        const confirmNo = document.getElementById('confirm-no');
        if (confirmYes) confirmYes.addEventListener('click', () => this.confirmDelete());
        if (confirmNo) confirmNo.addEventListener('click', () => this.cancelDelete());
    }

    // ---- Add Student Handler ----
    handleAddStudent(platform) {
        const nameId = platform === 'desktop' ? 'desktop-name' : 'mobile-name';
        const gradeId = platform === 'desktop' ? 'desktop-grade' : 'mobile-grade';

        const nameInput = document.getElementById(nameId);
        const gradeInput = document.getElementById(gradeId);

        const name = nameInput.value.trim();
        const grade = gradeInput.value;

        // Validation
        if (!name) {
            this.toast.show('Please enter a student name.', 'warning');
            nameInput.focus();
            return;
        }
        if (!grade || isNaN(grade) || grade < 0 || grade > 100) {
            this.toast.show('Grade must be between 0 and 100.', 'error');
            gradeInput.focus();
            return;
        }

        const student = this.tracker.addStudent(name, grade);
        if (student) {
            this.toast.show(`✅ ${student.getName()} added successfully!`, 'success');
            nameInput.value = '';
            gradeInput.value = '';
            nameInput.focus();

            if (platform === 'mobile') {
                this.toggleModal(false);
            }

            this.render();
        }
    }

    // ---- Delete Handlers ----
    requestDelete(id) {
        this.pendingDeleteId = id;
        const student = this.tracker.students.find(s => s.getId() === id);
        const dialog = document.getElementById('confirm-overlay');
        const nameEl = document.getElementById('confirm-student-name');
        if (nameEl && student) {
            nameEl.textContent = student.getName();
        }
        if (dialog) {
            dialog.classList.remove('hidden');
        }
    }

    confirmDelete() {
        if (this.pendingDeleteId) {
            const student = this.tracker.students.find(s => s.getId() === this.pendingDeleteId);
            const name = student ? student.getName() : 'Student';
            this.tracker.removeStudent(this.pendingDeleteId);
            this.toast.show(`${name} removed from records.`, 'info');
            this.pendingDeleteId = null;
            this.render();
        }
        this.cancelDelete();
    }

    cancelDelete() {
        this.pendingDeleteId = null;
        const dialog = document.getElementById('confirm-overlay');
        if (dialog) dialog.classList.add('hidden');
    }

    // ---- Modal ----
    toggleModal(show) {
        const overlay = document.getElementById('modal-overlay');
        const content = document.getElementById('modal-content');
        if (!overlay || !content) return;

        if (show) {
            overlay.classList.remove('hidden');
            setTimeout(() => {
                overlay.classList.add('opacity-100');
                content.classList.remove('translate-y-full');
            }, 10);
        } else {
            overlay.classList.remove('opacity-100');
            content.classList.add('translate-y-full');
            setTimeout(() => overlay.classList.add('hidden'), 300);
        }
    }

    // ---- Rendering ----
    render() {
        this.renderMetrics();
        this.renderStudentTable();
        this.renderChart();
        this.renderStudentCount();
    }

    renderMetrics() {
        const avg = this.tracker.calculateAverage();
        const high = this.tracker.findHighestScore();
        const low = this.tracker.findLowestScore();
        const count = this.tracker.getStudentCount();

        // Average
        const avgEl = document.getElementById('metric-average');
        const avgBar = document.getElementById('bar-average');
        if (avgEl) {
            avgEl.textContent = count > 0 ? avg.toFixed(1) : '—';
            avgEl.classList.add('metric-value');
        }
        if (avgBar) avgBar.style.width = `${avg}%`;

        // Highest
        const highEl = document.getElementById('metric-highest');
        const highBar = document.getElementById('bar-highest');
        if (highEl) {
            highEl.textContent = count > 0 ? high.toFixed(0) : '—';
        }
        if (highBar) highBar.style.width = `${high}%`;

        // Lowest
        const lowEl = document.getElementById('metric-lowest');
        const lowBar = document.getElementById('bar-lowest');
        if (lowEl) {
            lowEl.textContent = count > 0 ? low.toFixed(0) : '—';
        }
        if (lowBar) lowBar.style.width = `${low}%`;

        // Pass rate
        const passEl = document.getElementById('metric-passrate');
        const passBar = document.getElementById('bar-passrate');
        if (passEl) {
            passEl.textContent = count > 0 ? this.tracker.getPassRate().toFixed(0) + '%' : '—';
        }
        if (passBar) passBar.style.width = `${this.tracker.getPassRate()}%`;
    }

    renderStudentCount() {
        const el = document.getElementById('student-count');
        if (el) {
            const count = this.tracker.getStudentCount();
            el.textContent = count > 0 ? `${count} student${count !== 1 ? 's' : ''} enrolled` : '';
        }
    }

    renderStudentTable() {
        const tbody = document.getElementById('student-list');
        if (!tbody) return;

        const students = this.currentSearch
            ? this.tracker.searchStudents(this.currentSearch)
            : this.tracker.getAllStudents();

        if (students.length === 0) {
            const message = this.currentSearch
                ? `No students match "${this.currentSearch}"`
                : 'No students added yet. Add your first student above!';
            const icon = this.currentSearch ? 'search_off' : 'school';

            tbody.innerHTML = `
                <tr>
                    <td colspan="4">
                        <div class="empty-state">
                            <span class="material-symbols-outlined">${icon}</span>
                            <p class="text-on-surface-variant text-body-lg font-body-lg">${message}</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = students.map((s, i) => {
            const gradeClass = this.getGradeChipClass(s.getGrade());
            const statusText = s.getStatus();
            const letterGrade = s.getLetterGrade();

            return `
                <tr class="student-row hover:bg-surface-container-low transition-colors group" 
                    style="animation-delay: ${i * 0.04}s"
                    data-id="${s.getId()}">
                    <td class="px-6 py-4">
                        <div class="flex items-center gap-3">
                            <div class="w-9 h-9 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed font-bold text-sm shrink-0">
                                ${s.getName().charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div class="font-headline-md text-body-lg text-primary">${this.escapeHtml(s.getName())}</div>
                                <div class="text-on-surface-variant text-xs font-label-caps hidden md:block">${this.formatDate(s.getTimestamp())}</div>
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-4 text-center">
                        <span class="font-bold text-on-surface text-lg">${s.getGrade().toFixed(1)}%</span>
                    </td>
                    <td class="px-6 py-4 text-center hidden md:table-cell">
                        <span class="grade-chip grade-${letterGrade.toLowerCase()}">${letterGrade}</span>
                    </td>
                    <td class="px-6 py-4 text-right">
                        <div class="flex items-center justify-end gap-2">
                            <span class="${gradeClass} px-3 py-1 rounded-full font-label-caps text-[10px] uppercase tracking-wider">${statusText}</span>
                            <button class="delete-btn student-actions" onclick="app.requestDelete('${s.getId()}')" title="Remove student">
                                <span class="material-symbols-outlined" style="font-size:18px;">delete</span>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    renderChart() {
        const chartArea = document.getElementById('chart-bars');
        const chartEmpty = document.getElementById('chart-empty');
        if (!chartArea) return;

        const dist = this.tracker.getGradeDistribution();
        const total = this.tracker.getStudentCount();

        if (total === 0) {
            chartArea.classList.add('hidden');
            if (chartEmpty) chartEmpty.classList.remove('hidden');
            return;
        }

        chartArea.classList.remove('hidden');
        if (chartEmpty) chartEmpty.classList.add('hidden');

        const maxCount = Math.max(...Object.values(dist), 1);
        const colors = {
            A: { bg: '#91f8b8', label: '#002110' },
            B: { bg: '#66affe', label: '#001d37' },
            C: { bg: '#ffc970', label: '#281900' },
            D: { bg: '#ffdad6', label: '#93000a' },
            F: { bg: '#ba1a1a', label: '#ffffff' }
        };

        chartArea.innerHTML = Object.entries(dist).map(([grade, count]) => {
            const heightPct = total > 0 ? (count / maxCount) * 100 : 0;
            const color = colors[grade];

            return `
                <div class="flex flex-col items-center gap-2 flex-1">
                    <span class="text-xs font-bold text-on-surface-variant">${count}</span>
                    <div class="w-full relative" style="height: 160px;">
                        <div class="chart-bar absolute bottom-0 w-full" 
                             style="height: ${Math.max(heightPct, 4)}%; background: ${color.bg};"
                             title="${grade}: ${count} student${count !== 1 ? 's' : ''}">
                        </div>
                    </div>
                    <div class="flex flex-col items-center">
                        <span class="font-bold text-sm text-on-surface">${grade}</span>
                        <span class="text-[10px] text-on-surface-variant">${this.getGradeRange(grade)}</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    // ---- Helpers ----
    getGradeChipClass(grade) {
        if (grade >= 85) return 'bg-tertiary-fixed text-on-tertiary-fixed-variant';
        if (grade >= 50) return 'bg-secondary-fixed text-on-secondary-fixed-variant';
        return 'bg-error-container text-on-error-container';
    }

    getGradeRange(letter) {
        const ranges = { A: '90-100', B: '80-89', C: '70-79', D: '60-69', F: '0-59' };
        return ranges[letter] || '';
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatDate(isoString) {
        try {
            const d = new Date(isoString);
            return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
        } catch {
            return '';
        }
    }
}


// ============================================
// Initialize App on DOM Ready
// ============================================
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new GradeSyncApp();
});
