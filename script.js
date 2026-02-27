// ==================== STATE MANAGEMENT ====================
let currentTheme = 'cyber';
let sidebarOpen = true;

// Department mapping
const departments = {
    'cse':        { name: 'Department of CSE',          logo: 'logo/dept.png' },
    'eee':        { name: 'Department of EEE',          logo: 'logo/eee.png' },
    'bba':        { name: 'Department of BBA',          logo: 'logo/bba.jpg' },
    'english':    { name: 'Department of English',      logo: 'logo/english.jpg' },
    'economics':  { name: 'Department of Economics',    logo: 'logo/economics.jpg' },
    'law':        { name: 'Department of Law',          logo: 'logo/law.jpg' },
    'pharmacy':   { name: 'Department of Pharmacy',     logo: 'logo/pharmacy.jpg' },
    'political':  { name: 'Dept. of Political Science', logo: 'logo/political.jpg' },
    'islamic':    { name: 'Dept. of Islamic Studies',   logo: 'logo/islamic.png' },
    'jcms':       { name: 'Department of JCMS',         logo: 'logo/jcms.png' },
    'publichealth':{ name: 'Dept. of Public Health',   logo: 'logo/Public Health Logo.jpg' },
    'sociology':  { name: 'Department of Sociology',    logo: 'logo/dept.png' }
};

// ==================== INITIALIZATION ====================
window.onload = () => {
    updatePreview();
    loadFromLocalStorage();
    updateCompletionRate();
    initializeTheme();
    initMobileDevInfo();
    // Initialize department selector
    onDeptChange();
};

// ==================== SIDEBAR HELPERS ====================
function openSidebarMobile() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const menuBtn = document.getElementById('menuToggleBtn');
    sidebar.classList.add('active');
    if (overlay) overlay.classList.add('active');
    const icon = menuBtn.querySelector('i');
    if (icon) icon.className = 'fas fa-times';
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const menuBtn = document.getElementById('menuToggleBtn');
    sidebar.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    const icon = menuBtn.querySelector('i');
    if (icon) icon.className = 'fas fa-bars';
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const layout = document.getElementById('layout');
    const menuBtn = document.getElementById('menuToggleBtn');
    const icon = menuBtn.querySelector('i');

    if (window.innerWidth <= 968) {
        // MOBILE: slide panel
        const isOpen = sidebar.classList.contains('active');
        if (isOpen) {
            closeSidebar();
        } else {
            openSidebarMobile();
        }
    } else {
        // DESKTOP: collapse grid column
        layout.classList.toggle('sidebar-hidden');
        sidebarOpen = !layout.classList.contains('sidebar-hidden');
        if (layout.classList.contains('sidebar-hidden')) {
            icon.className = 'fas fa-chevron-right';
        } else {
            icon.className = 'fas fa-bars';
        }
    }
}

// ==================== MOBILE DEV INFO ====================
function initMobileDevInfo() {
    const mobileBox = document.getElementById('mobileDevInfo');
    const previewWrapper = document.getElementById('previewWrapper');
    if (!mobileBox || !previewWrapper) return;

    const nameEl = document.querySelector('.dev-name');
    const socialLinks = document.querySelector('.social-links');

    const avatarClone = document.createElement('div');
    avatarClone.className = 'avatar-mini';
    const icon = document.createElement('i');
    icon.className = 'fas fa-user-graduate';
    avatarClone.appendChild(icon);

    const nameMini = document.createElement('div');
    nameMini.className = 'dev-name-mini';
    nameMini.textContent = nameEl ? nameEl.textContent : 'Developer';

    const socialMini = document.createElement('div');
    socialMini.className = 'social-mini';
    if (socialLinks) {
        socialLinks.querySelectorAll('a').forEach(a => {
            const link = a.cloneNode(true);
            socialMini.appendChild(link);
        });
    }

    mobileBox.appendChild(avatarClone);
    mobileBox.appendChild(nameMini);
    mobileBox.appendChild(socialMini);

    function onScroll() {
        if (window.innerWidth > 968) {
            mobileBox.classList.remove('visible');
            return;
        }
        if (previewWrapper.scrollTop > 40) {
            mobileBox.classList.add('visible');
            mobileBox.setAttribute('aria-hidden', 'false');
        } else {
            mobileBox.classList.remove('visible');
            mobileBox.setAttribute('aria-hidden', 'true');
        }
    }

    previewWrapper.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
}

// ==================== LIVE PREVIEW ====================
function updatePreview() {
    const fields = {
        'deptIn':       'deptOut',
        'uniIn':        'uniOut',
        'courseTitleIn':'courseTitleOut',
        'reportNoIn':   'reportNoOutTop',
        'expNoIn':      'expNoOutTable',
        'expNameIn':    'expNameOut',
        'stuNameIn':    'stuNameOut',
        'stuIdIn':      'stuIdOut',
        'codeIn':       'codeOut',
        't1Name':       't1NameOut',
        't2Name':       't2NameOut'
    };

    for (let key in fields) {
        const input = document.getElementById(key);
        const output = document.getElementById(fields[key]);
        if (input && output) {
            const value = input.value.trim();
            output.innerText = value.includes(':') ? value.split(':')[1].trim() : value;
        }
    }

    // Semester
    const semSelect = document.getElementById('semIn');
    const semOther  = document.getElementById('semOther');
    const semOut    = document.getElementById('semOut');
    if (semSelect && semOut) {
        const isCustom = semSelect.value === 'other';
        semOut.innerText = (isCustom && semOther && semOther.value.trim())
            ? semOther.value.trim()
            : (isCustom ? '' : semSelect.value);
    }

    // Section
    const secSelect = document.getElementById('secIn');
    const secOther  = document.getElementById('secOther');
    const secOut    = document.getElementById('secOut');
    if (secSelect && secOut) {
        const isCustom = secSelect.value === 'other';
        secOut.innerText = (isCustom && secOther && secOther.value.trim())
            ? secOther.value.trim()
            : (isCustom ? '' : secSelect.value);
    }

    // Teacher 2 visibility
    const t2Name = document.getElementById('t2Name');
    const teacher2Block = document.getElementById('teacher2Block');
    if (t2Name && teacher2Block) {
        teacher2Block.style.display = t2Name.value.trim() ? 'block' : 'none';
    }

    updateTeacherDesignations();
    updateCompletionRate();
}

// ==================== THEME SWITCHER ====================
function initializeTheme() {
    const savedTheme = localStorage.getItem('vu-theme') || 'cyber';
    setTheme(savedTheme);
}

function setTheme(theme) {
    currentTheme = theme;
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('vu-theme', theme);
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-theme') === theme);
    });
    showToast(`${theme.charAt(0).toUpperCase() + theme.slice(1)} theme activated`);
}

// ==================== QUICK ACTIONS ====================
function fillSampleData() {
    document.getElementById('deptSelect').value = 'cse';
    onDeptChange();
    document.getElementById('courseTitleIn').value = 'Digital Signal Processing Lab';
    document.getElementById('codeIn').value = 'CSE-312';
    document.getElementById('reportNoIn').value = '01';
    document.getElementById('expNoIn').value = '01';
    document.getElementById('expNameIn').value = 'Introduction to MATLAB';
    document.getElementById('stuNameIn').value = 'Mafikul Islam';
    document.getElementById('stuIdIn').value = '232311070';
    document.getElementById('semIn').value = '6th';
    document.getElementById('secIn').value = 'B';
    onSemChange();
    onSecChange();
    document.getElementById('t1Name').value = 'Dr. John Doe';
    document.getElementById('t2Name').value = 'Prof. Jane Smith';
    updatePreview();
    showToast('Sample data loaded successfully!');
}

function clearAllFields() {
    document.querySelectorAll('input[type="text"]').forEach(input => {
        if (input.id !== 'deptIn' && input.id !== 'uniIn') {
            input.value = '';
        }
    });
    document.getElementById('semIn').value = '';
    document.getElementById('secIn').value = '';
    updatePreview();
    showToast('All fields cleared!');
}

// ==================== LOCAL STORAGE ====================
function saveToLocalStorage() {
    const data = {};
    document.querySelectorAll('input[type="text"], select').forEach(el => {
        if (el.id) data[el.id] = el.value;
    });
    localStorage.setItem('vu-cover-data', JSON.stringify(data));
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const lastSavedEl = document.getElementById('lastSaved');
    if (lastSavedEl) lastSavedEl.textContent = timeStr;
    showToast('Draft saved successfully!');
}

function loadFromLocalStorage() {
    const savedData = localStorage.getItem('vu-cover-data');
    if (!savedData) return;
    try {
        const data = JSON.parse(savedData);
        for (let key in data) {
            const el = document.getElementById(key);
            if (el) el.value = data[key];
        }
        // Restore conditional visibility
        onSemChange();
        onSecChange();
        onT1DesignationChange();
        onT2DesignationChange();
        updatePreview();
    } catch (e) {
        console.warn('Failed to load saved data:', e);
    }
}

// ==================== ADVANCED OPTIONS ====================
function toggleAdvanced() {
    const content = document.getElementById('advancedContent');
    const icon = document.getElementById('advancedToggle');
    content.classList.toggle('expanded');
    icon.classList.toggle('rotated');
}

function toggleBorder() {
    const table = document.querySelector('.exp-table');
    const show = document.getElementById('showBorder').checked;
    if (!table) return;
    table.querySelectorAll('td').forEach(td => {
        td.style.border = show ? '1px solid black' : 'none';
    });
}

function toggleLogos() {
    const show = document.getElementById('showLogos').checked;
    document.querySelectorAll('.logo-box').forEach(logo => {
        logo.style.display = show ? 'block' : 'none';
    });
}

function changeFontSize() {
    const select = document.getElementById('fontSize');
    const coverPage = document.getElementById('cover-page');
    const sizes = { small: '0.9', medium: '1', large: '1.1' };
    coverPage.style.fontSize = (sizes[select.value] || '1') + 'em';
}

// ==================== DEPARTMENT HANDLER ====================
function onDeptChange() {
    const deptSelect = document.getElementById('deptSelect');
    const deptInput  = document.getElementById('deptIn');
    const deptLogo   = document.querySelector('.left-logo img');
    const selected   = deptSelect.value;

    if (selected === 'other') {
        deptInput.value = '';
        deptInput.placeholder = 'Enter custom department name';
        deptInput.focus();
        if (deptLogo) { deptLogo.src = 'logo/dept.png'; deptLogo.alt = 'Department Logo'; }
    } else if (departments[selected]) {
        deptInput.value = departments[selected].name;
        deptInput.placeholder = 'Click to edit department name';
        if (deptLogo) { deptLogo.src = departments[selected].logo; deptLogo.alt = departments[selected].name + ' Logo'; }
    }

    deptInput.removeAttribute('readonly');
    updatePreview();
}

// ==================== SEMESTER HANDLER ====================
function onSemChange() {
    const semSelect = document.getElementById('semIn');
    const semWrapper = document.getElementById('semOtherWrapper');
    const semOther   = document.getElementById('semOther');
    const isOther = semSelect.value === 'other';

    if (semWrapper) semWrapper.style.display = isOther ? 'block' : 'none';
    if (!isOther && semOther) semOther.value = '';
    if (isOther && semOther) semOther.focus();
    updatePreview();
}

// ==================== SECTION HANDLER ====================
function onSecChange() {
    const secSelect = document.getElementById('secIn');
    const secWrapper = document.getElementById('secOtherWrapper');
    const secOther   = document.getElementById('secOther');
    const isOther = secSelect.value === 'other';

    if (secWrapper) secWrapper.style.display = isOther ? 'block' : 'none';
    if (!isOther && secOther) secOther.value = '';
    if (isOther && secOther) secOther.focus();
    updatePreview();
}

// ==================== TEACHER DESIGNATION HANDLERS ====================
function onT1DesignationChange() {
    const sel     = document.getElementById('t1Designation');
    const wrapper = document.getElementById('t1DesignationOtherWrapper');
    const other   = document.getElementById('t1DesignationOther');
    const isCustom = sel.value === 'custom';
    if (wrapper) wrapper.style.display = isCustom ? 'block' : 'none';
    if (!isCustom && other) other.value = '';
    if (isCustom && other) other.focus();
    updateTeacherDesignations();
}

function onT2DesignationChange() {
    const sel     = document.getElementById('t2Designation');
    const wrapper = document.getElementById('t2DesignationOtherWrapper');
    const other   = document.getElementById('t2DesignationOther');
    const isCustom = sel.value === 'custom';
    if (wrapper) wrapper.style.display = isCustom ? 'block' : 'none';
    if (!isCustom && other) other.value = '';
    if (isCustom && other) other.focus();
    updateTeacherDesignations();
}

function updateTeacherDesignations() {
    function getDesignation(selectId, otherId) {
        const sel   = document.getElementById(selectId);
        const other = document.getElementById(otherId);
        if (!sel) return 'Lecturer';
        if (sel.value === 'custom' && other && other.value.trim()) return other.value.trim();
        if (sel.value === 'associate') return 'Associate Professor';
        if (sel.value === 'professor') return 'Professor';
        return 'Lecturer';
    }

    const t1Out = document.getElementById('t1DesignationOut');
    const t2Out = document.getElementById('t2DesignationOut');
    if (t1Out) t1Out.innerText = getDesignation('t1Designation', 't1DesignationOther');
    if (t2Out) t2Out.innerText = getDesignation('t2Designation', 't2DesignationOther');
}

// ==================== COMPLETION RATE ====================
function updateCompletionRate() {
    const trackIds = ['courseTitleIn','codeIn','reportNoIn','expNoIn','expNameIn','stuNameIn','stuIdIn','semIn','secIn','t1Name'];
    let filled = 0;
    trackIds.forEach(id => {
        const el = document.getElementById(id);
        if (el && el.value.trim() !== '' && el.value !== '') filled++;
    });
    const pct = Math.round((filled / trackIds.length) * 100);
    const el = document.getElementById('completionRate');
    if (el) el.innerHTML = 'Completed<br>' + pct + '%';
    
    // Update mobile completion rate
    const mobileEl = document.getElementById('mobileCompletionRate');
    if (mobileEl) mobileEl.innerHTML = 'Completed<br>' + pct + '%';
}

// ==================== TOAST ====================
function showToast(message) {
    const toast = document.getElementById('toast');
    const msg   = document.getElementById('toastMessage');
    if (!toast || !msg) return;
    msg.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// ==================== PDF DOWNLOAD ====================
function downloadPDF() {
    const previewElement = document.getElementById('cover-page');
    const downloadContainer = document.getElementById('download-container');
    const downloadElement = document.getElementById('download-cover-page');

    if (typeof html2pdf === 'undefined') {
        showToast('PDF library not loaded!');
        return;
    }

    showToast('Generating PDF...');

    try {
        // Clone the preview content to the hidden download container
        downloadElement.innerHTML = previewElement.innerHTML;
        
        // Temporarily make download container visible for capture
        downloadContainer.style.position = 'absolute';
        downloadContainer.style.top = '0';
        downloadContainer.style.left = '0';
        downloadContainer.style.visibility = 'visible';
        downloadContainer.style.zIndex = '99999';

        const opt = {
            margin: 0,
            filename: 'VU_Cover_Page.pdf',
            image: { type: 'jpeg', quality: 1 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                letterRendering: true,
                logging: false,
                width: 794,  // Fixed A4 width
                height: 1123, // Fixed A4 height
                scrollX: 0,
                scrollY: 0
            },
            jsPDF: {
                unit: 'px',
                format: [794, 1123], // Fixed A4 dimensions in pixels
                orientation: 'portrait',
                compress: true
            }
        };

        html2pdf()
            .set(opt)
            .from(downloadElement)
            .toPdf()
            .get('pdf')
            .then(function(pdf) {
                // Hide download container again
                downloadContainer.style.position = 'fixed';
                downloadContainer.style.top = '-9999px';
                downloadContainer.style.left = '-9999px';
                downloadContainer.style.visibility = 'hidden';
                downloadContainer.style.zIndex = '-1';
                
                // Remove extra pages if any
                const totalPages = pdf.internal.getNumberOfPages();
                for (let i = totalPages; i > 1; i--) {
                    pdf.deletePage(i);
                }
                showToast('PDF generated successfully!');
            })
            .save()
            .catch(function(error) {
                console.error('PDF generation error:', error);
                showToast('PDF generation failed. Please try again.');
                
                // Ensure container is hidden on error
                downloadContainer.style.position = 'fixed';
                downloadContainer.style.top = '-9999px';
                downloadContainer.style.left = '-9999px';
                downloadContainer.style.visibility = 'hidden';
                downloadContainer.style.zIndex = '-1';
            });
            
    } catch (error) {
        console.error('PDF setup error:', error);
        showToast('PDF setup failed. Please try again.');
        
        // Ensure container is hidden on error
        downloadContainer.style.position = 'fixed';
        downloadContainer.style.top = '-9999px';
        downloadContainer.style.left = '-9999px';
        downloadContainer.style.visibility = 'hidden';
        downloadContainer.style.zIndex = '-1';
    }
}

// ==================== KEYBOARD SHORTCUTS ====================
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); saveToLocalStorage(); }
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') { e.preventDefault(); downloadPDF(); }
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); toggleSidebar(); }
    if (e.key === 'Escape' && window.innerWidth <= 968) closeSidebar();
});

// ==================== RESPONSIVE HANDLING ====================
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        const layout  = document.getElementById('layout');
        const sidebar = document.getElementById('sidebar');
        const menuBtn = document.getElementById('menuToggleBtn');
        const icon = menuBtn ? menuBtn.querySelector('i') : null;

        if (window.innerWidth > 968) {
            // Desktop: Only update icon, don't close sidebar automatically
            const ov = document.getElementById('sidebarOverlay');
            if (ov) ov.classList.remove('active');
            sidebar.classList.remove('active'); // Remove mobile active class
            if (icon) {
                icon.className = layout.classList.contains('sidebar-hidden')
                    ? 'fas fa-chevron-right' : 'fas fa-bars';
            }
        } else {
            // Mobile: Don't auto-close if user is actively using the form
            const activeElement = document.activeElement;
            const isUserTyping = activeElement && (
                activeElement.tagName === 'INPUT' || 
                activeElement.tagName === 'SELECT' || 
                activeElement.tagName === 'TEXTAREA'
            );
            
            // Only auto-close if user is not actively typing
            if (!isUserTyping) {
                const ov = document.getElementById('sidebarOverlay');
                if (ov) ov.classList.remove('active');
                sidebar.classList.remove('active');
            }
            if (icon) icon.className = 'fas fa-bars';
        }
    }, 250);
});

// ==================== RIPPLE EFFECT ====================
document.addEventListener('click', function(e) {
    const btn = e.target.closest('button');
    if (!btn) return;
    const ripple = document.createElement('span');
    const rect   = btn.getBoundingClientRect();
    const size   = Math.max(rect.width, rect.height);
    ripple.style.width  = ripple.style.height = size + 'px';
    ripple.style.left   = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top    = (e.clientY - rect.top  - size / 2) + 'px';
    ripple.classList.add('ripple');
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
});

// ==================== DEBOUNCED INPUT ====================
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

const debouncedUpdate = debounce(updatePreview, 150);
document.querySelectorAll('input[type="text"]').forEach(input => {
    input.removeEventListener('input', updatePreview);
    input.addEventListener('input', debouncedUpdate);
});

// ==================== SCROLL TO TOP ====================
function scrollToTop() {
    const formScroll = document.querySelector('.form-scroll');
    if (formScroll) {
        formScroll.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// ==================== EXPOSE GLOBALS ====================
window.toggleSidebar     = toggleSidebar;
window.closeSidebar      = closeSidebar;
window.updatePreview     = updatePreview;
window.setTheme          = setTheme;
window.fillSampleData    = fillSampleData;
window.clearAllFields    = clearAllFields;
window.saveToLocalStorage   = saveToLocalStorage;
window.loadFromLocalStorage = loadFromLocalStorage;
window.toggleAdvanced    = toggleAdvanced;
window.toggleBorder      = toggleBorder;
window.toggleLogos       = toggleLogos;
window.changeFontSize    = changeFontSize;
window.downloadPDF       = downloadPDF;
window.onDeptChange      = onDeptChange;
window.onSemChange       = onSemChange;
window.onSecChange       = onSecChange;
window.onT1DesignationChange = onT1DesignationChange;
window.onT2DesignationChange = onT2DesignationChange;
window.updateTeacherDesignations = updateTeacherDesignations;
window.updateCompletionRate      = updateCompletionRate;
window.scrollToTop               = scrollToTop;
