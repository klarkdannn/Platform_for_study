/* =====================================================
   Java Portal — Main Application
   ===================================================== */
'use strict';

window.COURSES = window.COURSES || [];

const app = (() => {
    /* ── State ──────────────────────────────────────── */
    let currentCourse   = null;
    let currentChapter  = null;
    let currentTask     = null;
    let currentTab      = 'lecture';
    let monacoEditor    = null;
    let sidebarOpen     = true;
    let solvedTasks     = new Set(JSON.parse(localStorage.getItem('solvedTasks') || '[]'));
    let snippetMode     = false;

    // Multi-file editor state
    let editorFiles     = [];   // [{name, code}]
    let activeFileIdx   = 0;
    let isMultiFile     = false;

    let currentFontSize = 15;

    const DEFAULT_CODE = `public class Main {
    public static void main(String[] args) {
        // Ваш код здесь
        System.out.println("Hello, Java!");
    }
}`;

    const SNIPPET_CODE = `// ⚡ Snippet-режим: пишите команды Java прямо здесь
// Класс Main и main() создаются автоматически
// Можно использовать любые стандартные классы

System.out.println("Hello, Java!");

int x = 42;
double y = Math.sqrt(x);
System.out.printf("√%d = %.4f%n", x, y);

String s = "Java Portal";
System.out.println(s.toUpperCase());
System.out.println(s.length() + " символов");`;

    /* ── INIT ───────────────────────────────────────── */
    function init() {
        buildSidebar();
        buildCourseGrid();
        updateProgress();
        initMonaco();
        initSearch();
        document.getElementById('sidebar-toggle').addEventListener('click', toggleSidebar);
        window.addEventListener('beforeunload', () => { if (currentTask) saveTaskCode(); });
        showPage('welcome');
    }

    /* ── SIDEBAR ────────────────────────────────────── */
    function buildSidebar() {
        const nav = document.getElementById('course-nav');
        nav.innerHTML = '';
        window.COURSES.forEach(course => {
            const courseEl = document.createElement('div');
            courseEl.className = 'nav-course';
            courseEl.id = 'nav-course-' + course.id;

            const header = document.createElement('div');
            header.className = 'nav-course-header';
            header.innerHTML = `
                <span class="nav-course-icon">${course.icon}</span>
                <div class="nav-course-info">
                    <div class="nav-course-title">${course.title}</div>
                    <div class="nav-course-count">${course.chapters.length} глав</div>
                </div>
                <span class="nav-course-arrow">▶</span>`;
            header.addEventListener('click', () => toggleCourseNav(course.id));

            const chaptersEl = document.createElement('div');
            chaptersEl.className = 'nav-chapters';
            chaptersEl.id = 'nav-chapters-' + course.id;

            course.chapters.forEach(ch => {
                const total = ch.tasks.length;
                const done  = ch.tasks.filter(t => solvedTasks.has(t.id)).length;
                const allDone = total > 0 && done === total;

                const chEl = document.createElement('div');
                chEl.className = 'nav-chapter' + (allDone ? ' nav-chapter-done' : '');
                chEl.id = 'nav-ch-' + ch.id;
                chEl.innerHTML = `
                    <span class="nav-ch-text">${ch.title}</span>
                    ${total > 0 ? `<span class="nav-ch-progress">${done}/${total}</span>` : ''}`;
                chEl.addEventListener('click', () => openChapter(course.id, ch.id));
                chaptersEl.appendChild(chEl);
            });

            courseEl.appendChild(header);
            courseEl.appendChild(chaptersEl);
            nav.appendChild(courseEl);
        });
    }

    function toggleCourseNav(id) {
        document.querySelector(`#nav-course-${id} .nav-course-header`).classList.toggle('open');
        document.getElementById('nav-chapters-' + id).classList.toggle('open');
    }

    function toggleSidebar() {
        sidebarOpen = !sidebarOpen;
        document.getElementById('sidebar').classList.toggle('collapsed', !sidebarOpen);
        document.getElementById('main-content').classList.toggle('sidebar-collapsed', !sidebarOpen);
    }

    function openCourseInSidebar(id) {
        const h = document.querySelector(`#nav-course-${id} .nav-course-header`);
        const c = document.getElementById('nav-chapters-' + id);
        if (h && !h.classList.contains('open')) { h.classList.add('open'); c.classList.add('open'); }
    }

    /* ── COURSE GRID ─────────────────────────────────── */
    function buildCourseGrid() {
        const grid = document.getElementById('course-grid');
        grid.innerHTML = '';
        document.getElementById('stat-courses').textContent = window.COURSES.length;
        let totalTasks = 0;

        window.COURSES.forEach((course, i) => {
            const ct    = course.chapters.reduce((s, ch) => s + ch.tasks.length, 0);
            totalTasks += ct;
            const done  = course.chapters.reduce((s, ch) =>
                s + ch.tasks.filter(t => solvedTasks.has(t.id)).length, 0);
            const pct = ct > 0 ? Math.round(done / ct * 100) : 0;

            const card = document.createElement('div');
            card.className = 'course-card';
            card.style.animationDelay = (i * 0.05) + 's';
            card.innerHTML = `
                <div class="course-card-icon">${course.icon}</div>
                <div class="course-card-title">${course.title}</div>
                <div class="course-card-desc">${course.description || ''}</div>
                <div class="course-card-stats">
                    <span class="course-card-stat">📚 ${course.chapters.length} глав</span>
                    <span class="course-card-stat">✏️ ${ct} задач</span>
                </div>
                <div class="course-card-progress-wrap">
                    <div class="course-card-progress">
                        <div class="course-card-progress-fill" style="width:${pct}%"></div>
                    </div>
                    <span class="course-card-pct">${pct}%</span>
                </div>`;
            card.addEventListener('click', () => {
                openCourseInSidebar(course.id);
                if (course.chapters.length > 0) openChapter(course.id, course.chapters[0].id);
            });
            grid.appendChild(card);
        });
        document.getElementById('stat-tasks').textContent = totalTasks + '+';
    }

    /* ── CHAPTER ─────────────────────────────────────── */
    function openChapter(courseId, chapterId) {
        currentCourse  = window.COURSES.find(c => c.id === courseId);
        currentChapter = currentCourse?.chapters.find(ch => ch.id === chapterId);
        if (!currentChapter) return;

        document.querySelectorAll('.nav-chapter').forEach(el => el.classList.remove('active'));
        const navEl = document.getElementById('nav-ch-' + chapterId);
        if (navEl) navEl.classList.add('active');

        document.getElementById('chapter-course-name').textContent  = currentCourse.title;
        document.getElementById('chapter-title-header').textContent = currentChapter.title;
        document.getElementById('lecture-body').innerHTML = currentChapter.lecture || '<p>Лекция в разработке.</p>';

        renderTaskList('easy');
        renderTaskList('medium');
        renderTaskList('hard');

        showTab('lecture');
        showPage('chapter');
    }

    function renderTaskList(difficulty) {
        const tasks     = (currentChapter.tasks || []).filter(t => t.difficulty === difficulty);
        const container = document.getElementById('task-list-' + difficulty);
        container.innerHTML = '';

        if (tasks.length === 0) {
            container.innerHTML = `<div class="empty-state"><div class="empty-state-icon">📭</div><p>Задания в разработке</p></div>`;
            return;
        }

        const icons = { easy: '🟢', medium: '🟡', hard: '🔴' };

        tasks.forEach((task, idx) => {
            const done    = solvedTasks.has(task.id);
            const isMulti = !!(task.multiFile || (Array.isArray(task.files) && task.files.length > 1));
            const hasSaved = !!localStorage.getItem('task_code_' + task.id);
            const hasTests = !!(task.tests && task.tests.length > 0);

            const card = document.createElement('div');
            card.className = 'task-card' + (done ? ' done' : '');
            card.style.animationDelay = (idx * 0.04) + 's';
            card.innerHTML = `
                <span class="task-card-num">#${idx + 1}</span>
                <span class="task-card-icon">${done ? '✅' : icons[difficulty]}</span>
                <div class="task-card-body">
                    <div class="task-card-title">
                        ${task.title}
                        ${isMulti   ? '<span class="multi-file-badge">📂 Multi-file</span>' : ''}
                        ${hasTests  ? '<span class="tests-badge">🧪 Тесты</span>'           : ''}
                        ${hasSaved && !done ? '<span class="saved-badge">💾 Черновик</span>' : ''}
                    </div>
                    <div class="task-card-desc">${stripHtml(task.description)}</div>
                </div>
                ${done ? '<span class="task-card-done-mark">✓</span>' : ''}`;
            card.addEventListener('click', () => openTask(task));
            container.appendChild(card);
        });
    }

    /* ── TASK ────────────────────────────────────────── */
    function openTask(task) {
        currentTask = task;

        document.getElementById('task-title').textContent     = task.title;
        document.getElementById('task-description').innerHTML = task.description;

        const badge = document.getElementById('task-difficulty-badge');
        badge.textContent = { easy: '🟢 Лёгкое', medium: '🟡 Среднее', hard: '🔴 Сложное' }[task.difficulty];
        badge.className   = 'difficulty-badge ' + task.difficulty;

        const hintsList = document.getElementById('hints-list');
        hintsList.innerHTML   = (task.hints || []).map(h => `<div class="hint-item">${escHtml(h)}</div>`).join('');
        hintsList.style.display = 'none';
        document.getElementById('hint-toggle').textContent = '💡 Показать подсказки';

        const solvedBtn = document.getElementById('btn-solved');
        if (solvedTasks.has(task.id)) {
            solvedBtn.textContent = '✅ Выполнено';
            solvedBtn.classList.add('solved');
        } else {
            solvedBtn.textContent = '✓ Отметить как выполненное';
            solvedBtn.classList.remove('solved');
        }

        // Reset snippet mode and UI
        snippetMode = false;
        updateSnippetModeUI();

        // Clear output and tests
        clearOutput();
        clearTestResults();

        // Setup editor with starter code, then overlay with any saved progress
        setupEditor(task);
        loadTaskCode(task);

        showPage('task');
    }

    /* ── CODE PERSISTENCE ────────────────────────────── */
    function saveTaskCode() {
        if (!currentTask) return;
        const key = 'task_code_' + currentTask.id;
        try {
            if (isMultiFile && editorFiles.length > 0) {
                if (monacoEditor) editorFiles[activeFileIdx].code = monacoEditor.getValue();
                localStorage.setItem(key, JSON.stringify({
                    multi: true,
                    files: editorFiles.map(f => ({ name: f.name, code: f.code }))
                }));
            } else {
                const code = getEditorCode();
                localStorage.setItem(key, JSON.stringify({ multi: false, code }));
            }
        } catch (e) { /* storage full or unavailable */ }
    }

    function loadTaskCode(task) {
        const key = 'task_code_' + task.id;
        const raw = localStorage.getItem(key);
        if (!raw) return;
        try {
            const data = JSON.parse(raw);
            if (isMultiFile && data.multi && Array.isArray(data.files) && data.files.length > 0) {
                editorFiles   = data.files;
                activeFileIdx = Math.max(0, editorFiles.findIndex(f => f.name === 'Main.java'));
                if (monacoEditor) {
                    monacoEditor.setValue(editorFiles[activeFileIdx]?.code || '');
                    monacoEditor.setScrollPosition({ scrollTop: 0 });
                }
                renderFileTabs();
            } else if (!isMultiFile && !data.multi && typeof data.code === 'string') {
                setEditorCode(data.code);
            }
        } catch (e) { /* corrupt data */ }
    }

    /* ── SNIPPET MODE ────────────────────────────────── */
    function toggleSnippetMode() {
        snippetMode = !snippetMode;
        updateSnippetModeUI();
        if (snippetMode) {
            const cur = getEditorCode().trim();
            if (!cur || cur === DEFAULT_CODE.trim()) setEditorCode(SNIPPET_CODE);
        }
    }

    function updateSnippetModeUI() {
        const btn   = document.getElementById('snippet-mode-btn');
        const badge = document.getElementById('snippet-badge');
        if (btn)   btn.classList.toggle('active', snippetMode);
        if (badge) badge.style.display = snippetMode ? 'inline-flex' : 'none';
    }

    /* ── AUTO-TESTS ──────────────────────────────────── */
    function runTests(task, output, hasError) {
        if (!task?.tests?.length) return;

        const results = task.tests.map(test => {
            let passed = false;
            const val  = (test.value || '').trim();
            switch (test.check) {
                case 'contains':    passed = output.includes(test.value || ''); break;
                case 'notContains': passed = !output.includes(test.value || ''); break;
                case 'startsWith':  passed = output.trimStart().startsWith(val); break;
                case 'noError':     passed = !hasError; break;
                case 'outputIs':    passed = output.trim() === val; break;
                case 'lineCount': {
                    const lines = output.trim().split('\n').filter(l => l.trim()).length;
                    passed = lines === parseInt(val);
                    break;
                }
                case 'matches':
                    try { passed = new RegExp(test.value || '').test(output); } catch { passed = false; }
                    break;
            }
            return { ...test, passed };
        });

        renderTestResults(results);
    }

    function renderTestResults(results) {
        const container = document.getElementById('test-results');
        if (!container) return;

        const passed  = results.filter(r => r.passed).length;
        const total   = results.length;
        const allPass = passed === total;

        container.style.display = 'block';
        container.className = 'test-results ' + (allPass ? 'all-pass' : 'has-failures');
        container.innerHTML = `
            <div class="test-results-header">
                <span class="test-results-icon">${allPass ? '🎯' : '🧪'}</span>
                <strong>Тесты: ${passed}/${total} пройдено</strong>
                ${allPass ? '<span class="test-all-pass-badge">Все тесты пройдены! 🎉</span>' : ''}
            </div>
            <div class="test-results-list">
                ${results.map(r => `
                    <div class="test-result-item ${r.passed ? 'pass' : 'fail'}">
                        <span class="test-result-status">${r.passed ? '✅' : '❌'}</span>
                        <span class="test-result-desc">${escHtml(r.description)}</span>
                    </div>`).join('')}
            </div>`;
    }

    function clearTestResults() {
        const c = document.getElementById('test-results');
        if (c) { c.style.display = 'none'; c.innerHTML = ''; }
    }

    /* ── MULTI-FILE EDITOR ───────────────────────────── */
    function setupEditor(task) {
        isMultiFile  = !!(task.multiFile || (Array.isArray(task.files) && task.files.length > 1));
        const tabsEl = document.getElementById('editor-file-tabs');

        if (isMultiFile) {
            editorFiles = (task.files || []).map(f => ({ name: f.name, code: f.code || '' }));
            if (!editorFiles.find(f => f.name === 'Main.java')) {
                editorFiles.push({ name: 'Main.java', code: DEFAULT_CODE });
            }
            activeFileIdx = editorFiles.findIndex(f => f.name === 'Main.java');
            if (activeFileIdx < 0) activeFileIdx = 0;

            tabsEl.style.display = 'flex';
            renderFileTabs();

            if (monacoEditor) {
                monacoEditor.setValue(editorFiles[activeFileIdx].code);
                monacoEditor.setScrollPosition({ scrollTop: 0 });
            }
        } else {
            editorFiles   = [];
            activeFileIdx = 0;
            tabsEl.style.display = 'none';
            setEditorCode(task.startCode || task.starterCode || DEFAULT_CODE);
        }
    }

    function renderFileTabs() {
        const tabsEl = document.getElementById('editor-file-tabs');
        const addBtn = tabsEl.querySelector('.file-tab-add');
        tabsEl.querySelectorAll('.file-tab').forEach(t => t.remove());

        editorFiles.forEach((file, idx) => {
            const tab = document.createElement('div');
            tab.className = 'file-tab' + (idx === activeFileIdx ? ' active' : '');
            tab.innerHTML = `
                <span class="file-tab-icon">${file.name === 'Main.java' ? '⭐' : '☕'}</span>
                <span class="file-tab-name">${file.name}</span>
                ${file.name !== 'Main.java'
                    ? `<button class="file-tab-close" title="Закрыть">×</button>`
                    : ''}`;
            tab.addEventListener('click', e => {
                if (e.target.classList.contains('file-tab-close')) return;
                switchFileTab(idx);
            });
            const closeBtn = tab.querySelector('.file-tab-close');
            if (closeBtn) closeBtn.addEventListener('click', e => { e.stopPropagation(); removeEditorFile(idx); });
            tabsEl.insertBefore(tab, addBtn);
        });
    }

    function switchFileTab(idx) {
        if (monacoEditor && editorFiles.length > 0) editorFiles[activeFileIdx].code = monacoEditor.getValue();
        activeFileIdx = idx;
        if (monacoEditor) {
            monacoEditor.setValue(editorFiles[idx].code);
            monacoEditor.setScrollPosition({ scrollTop: 0 });
        }
        renderFileTabs();
    }

    function addEditorFile() {
        const raw = prompt('Имя нового класса (например: Animal):');
        if (!raw || !raw.trim()) return;
        const className = raw.trim().replace(/[^a-zA-Z0-9_$]/g, '');
        const filename  = className + '.java';
        if (editorFiles.find(f => f.name === filename)) { alert('Файл ' + filename + ' уже существует'); return; }
        editorFiles.push({ name: filename, code: `public class ${className} {\n    // Ваш код здесь\n}\n` });
        switchFileTab(editorFiles.length - 1);
    }

    function removeEditorFile(idx) {
        if (editorFiles[idx]?.name === 'Main.java') return;
        if (!confirm(`Удалить файл ${editorFiles[idx].name}?`)) return;
        // Save current editor content before restructuring the array
        if (monacoEditor && editorFiles.length > 0) {
            editorFiles[activeFileIdx].code = monacoEditor.getValue();
        }
        editorFiles.splice(idx, 1);
        // Keep pointing to the same logical file after splice
        if (idx < activeFileIdx) {
            activeFileIdx--;
        } else if (activeFileIdx >= editorFiles.length) {
            activeFileIdx = editorFiles.length - 1;
        }
        if (monacoEditor) monacoEditor.setValue(editorFiles[activeFileIdx]?.code || '');
        renderFileTabs();
    }

    /* ── CLOSE TASK ──────────────────────────────────── */
    function closeTask() {
        saveTaskCode();
        if (currentChapter && currentCourse) {
            renderTaskList('easy');
            renderTaskList('medium');
            renderTaskList('hard');
            showPage('chapter');
            showTab(currentTab);
        } else {
            showPage('welcome');
        }
    }

    /* ── TABS ────────────────────────────────────────── */
    function showTab(tab) {
        currentTab = tab;
        ['lecture', 'easy', 'medium', 'hard'].forEach(t => {
            const btnId   = (t === 'easy' || t === 'medium' || t === 'hard') ? 'tab-tasks-' + t : 'tab-' + t;
            const btn     = document.getElementById(btnId);
            const content = document.getElementById('tab-content-' + t);
            if (btn)     btn.classList.toggle('active', t === tab);
            if (content) content.style.display = t === tab ? 'block' : 'none';
        });
    }

    /* ── PROGRESS ────────────────────────────────────── */
    function updateProgress() {
        const total = window.COURSES.reduce((s, c) =>
            s + c.chapters.reduce((cs, ch) => cs + ch.tasks.length, 0), 0);
        const done  = solvedTasks.size;
        const pct   = total > 0 ? Math.round(done / total * 100) : 0;
        document.getElementById('progress-label').textContent    = `${done} / ${total} задач`;
        document.getElementById('progress-bar-fill').style.width = pct + '%';
    }

    function markSolved() {
        if (!currentTask) return;
        const isNew = !solvedTasks.has(currentTask.id);
        solvedTasks.add(currentTask.id);
        saveSolved();
        if (isNew) {
            updateProgress();
            showConfetti();
        }
        const btn = document.getElementById('btn-solved');
        btn.textContent = '✅ Выполнено';
        btn.classList.add('solved');

        if (currentChapter) {
            const total = currentChapter.tasks.length;
            const done  = currentChapter.tasks.filter(t => solvedTasks.has(t.id)).length;
            buildSidebar();
            if (done === total) {
                const navEl = document.getElementById('nav-ch-' + currentChapter.id);
                if (navEl) navEl.classList.add('nav-chapter-done');
            }
        }
    }

    function showConfetti() {
        const overlay = document.createElement('div');
        overlay.className = 'confetti-overlay';

        const text = document.createElement('div');
        text.className   = 'confetti-text';
        text.textContent = '🎉 Задание выполнено!';
        overlay.appendChild(text);

        const colors = ['#f89820','#4ade80','#60a5fa','#f87171','#c792ea','#facc15','#34d399'];
        for (let i = 0; i < 70; i++) {
            const p    = document.createElement('div');
            p.className = 'confetti-particle';
            const size = 6 + Math.random() * 9;
            p.style.cssText = `
                left:${Math.random()*100}vw;
                top:-${10+Math.random()*30}px;
                width:${size}px;height:${size}px;
                background:${colors[Math.floor(Math.random()*colors.length)]};
                border-radius:${Math.random()>0.45?'50%':'2px'};
                animation:confettiFall ${1.4+Math.random()*1.6}s ${Math.random()*0.7}s ease-in forwards;`;
            overlay.appendChild(p);
        }

        document.body.appendChild(overlay);
        setTimeout(() => {
            overlay.style.opacity    = '0';
            overlay.style.transition = 'opacity 0.5s';
            setTimeout(() => overlay.remove(), 550);
        }, 3200);
    }

    function saveSolved() {
        localStorage.setItem('solvedTasks', JSON.stringify([...solvedTasks]));
    }

    /* ── CODE EXECUTION ──────────────────────────────── */
    async function runCode() {
        saveTaskCode();

        const output  = document.getElementById('code-output');
        const overlay = document.getElementById('loading-overlay');
        const runBtn  = document.getElementById('run-btn');

        let requestBody;
        if (isMultiFile && editorFiles.length > 0) {
            editorFiles[activeFileIdx].code = monacoEditor ? monacoEditor.getValue() : '';
            requestBody = { files: editorFiles };
        } else {
            const code = getEditorCode();
            if (!code.trim()) return;
            requestBody = snippetMode ? { code, snippet: true } : { code };
        }

        output.className  = 'code-output running';
        output.textContent = '⏳ Компилирую и выполняю...';
        overlay.style.display = 'flex';
        runBtn.disabled   = true;
        runBtn.textContent = '⏳ Выполняю...';
        clearTestResults();

        try {
            const response = await fetch('/api/run/java', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json; charset=utf-8' },
                body: JSON.stringify(requestBody)
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();

            const hasError = !!(data.error && data.error.trim());

            if (hasError) {
                output.className  = 'code-output has-error';
                output.textContent = '❌ Ошибка компиляции / выполнения:\n' + data.error;
            } else {
                output.className  = 'code-output has-success';
                output.textContent = data.output?.trim()
                    ? data.output
                    : '(программа завершилась без вывода)';
            }

            if (currentTask?.tests?.length) {
                runTests(currentTask, data.output || '', hasError);
            }

        } catch (e) {
            output.className  = 'code-output has-error';
            output.textContent = '❌ Не удалось подключиться к серверу: ' + e.message;
        } finally {
            overlay.style.display  = 'none';
            runBtn.disabled        = false;
            runBtn.textContent     = '▶ Запустить';
        }
    }

    function clearOutput() {
        const out = document.getElementById('code-output');
        if (out) {
            out.textContent = '// Нажмите ▶ Запустить или Ctrl+Enter';
            out.className   = 'code-output';
        }
    }

    function resetCode() {
        if (isMultiFile && currentTask?.files) {
            if (confirm('Сбросить все файлы к начальному состоянию?')) {
                localStorage.removeItem('task_code_' + currentTask.id);
                setupEditor(currentTask);
            }
        } else if (currentTask) {
            localStorage.removeItem('task_code_' + currentTask.id);
            setEditorCode(currentTask.startCode || currentTask.starterCode || DEFAULT_CODE);
        }
    }

    /* ── MONACO EDITOR ───────────────────────────────── */
    function initMonaco() {
        require.config({
            paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' }
        });
        require(['vs/editor/editor.main'], () => {
            monaco.editor.defineTheme('javaPortal', {
                base:    'vs-dark',
                inherit: true,
                rules: [
                    { token: 'keyword',  foreground: 'C792EA', fontStyle: 'bold' },
                    { token: 'string',   foreground: 'C3E88D' },
                    { token: 'comment',  foreground: '637777', fontStyle: 'italic' },
                    { token: 'number',   foreground: 'F78C6C' },
                    { token: 'type',     foreground: 'FFCB6B' },
                    { token: 'class',    foreground: 'FFCB6B', fontStyle: 'bold' },
                    { token: 'variable', foreground: 'EEFFFF' },
                ],
                colors: {
                    'editor.background':                 '#0d1117',
                    'editor.foreground':                 '#EEFFFF',
                    'editor.lineHighlightBackground':    '#1a2035',
                    'editor.lineHighlightBorder':        '#1e2d4a',
                    'editorLineNumber.foreground':       '#3d4f6e',
                    'editorLineNumber.activeForeground': '#f89820',
                    'editor.selectionBackground':        '#264f78',
                    'editorCursor.foreground':           '#f89820',
                    'editorGutter.background':           '#0a0e16',
                    'editorIndentGuide.background':      '#1e2d4a',
                    'editorBracketMatch.background':     '#264f7840',
                    'editorBracketMatch.border':         '#f89820',
                }
            });

            monacoEditor = monaco.editor.create(document.getElementById('monaco-editor'), {
                value:          DEFAULT_CODE,
                language:       'java',
                theme:          'javaPortal',
                fontSize:       currentFontSize,
                lineHeight:     26,
                fontFamily:     "'JetBrains Mono','Fira Code','Consolas',monospace",
                fontLigatures:  true,
                minimap:        { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers:    'on',
                lineNumbersMinChars: 4,
                lineDecorationsWidth: 12,
                glyphMargin:    true,
                renderLineHighlight: 'all',
                renderLineHighlightOnlyWhenFocus: false,
                automaticLayout: true,
                tabSize:        4,
                insertSpaces:   true,
                wordWrap:       'off',
                bracketPairColorization: { enabled: true },
                suggest:        { enabled: true, showKeywords: true },
                quickSuggestions: { other: true, comments: false, strings: false },
                parameterHints: { enabled: true },
                autoIndent:     'full',
                formatOnPaste:  true,
                cursorBlinking: 'expand',
                cursorSmoothCaretAnimation: 'on',
                cursorStyle:    'line',
                cursorWidth:    2,
                smoothScrolling: true,
                padding:        { top: 16, bottom: 16 },
                scrollbar: {
                    useShadows: false,
                    verticalScrollbarSize: 8,
                    horizontalScrollbarSize: 8,
                },
                hover:          { enabled: true, delay: 600 },
                folding:        true,
                showFoldingControls: 'always',
                overviewRulerBorder: false,
                occurrencesHighlight: true,
                selectionHighlight: true,
                contextmenu:    true,
            });

            monacoEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, runCode);
            initEditorResize();
            window.addEventListener('resize', () => monacoEditor?.layout());
            // Restore task state if a task was opened before Monaco finished loading
            if (currentTask) {
                setupEditor(currentTask);
                loadTaskCode(currentTask);
            }
        });
    }

    function initEditorResize() {
        const handle   = document.getElementById('editor-resize-handle');
        const editorEl = document.getElementById('monaco-editor');
        if (!handle || !editorEl) return;
        let startY, startH;
        handle.addEventListener('mousedown', e => {
            startY = e.clientY;
            startH = editorEl.offsetHeight;
            document.body.style.userSelect = 'none';
            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onUp);
            e.preventDefault();
        });
        function onMove(e) {
            const h = Math.max(260, Math.min(900, startH + e.clientY - startY));
            editorEl.style.height = h + 'px';
            monacoEditor?.layout();
        }
        function onUp() {
            document.body.style.userSelect = '';
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
        }
    }

    function changeFontSize(delta) {
        if (!monacoEditor) return;
        currentFontSize = Math.max(11, Math.min(26, currentFontSize + delta));
        monacoEditor.updateOptions({ fontSize: currentFontSize });
        const d = document.getElementById('font-size-display');
        if (d) d.textContent = currentFontSize + 'px';
    }

    function getEditorCode() { return monacoEditor ? monacoEditor.getValue() : ''; }

    function setEditorCode(code) {
        if (monacoEditor) {
            monacoEditor.setValue(code || '');
            monacoEditor.setScrollPosition({ scrollTop: 0 });
        }
    }

    /* ── SEARCH ──────────────────────────────────────── */
    function initSearch() {
        const input    = document.getElementById('search-input');
        const dropdown = document.getElementById('search-results');
        let timer;
        let selIdx = -1;

        input.addEventListener('input', () => {
            clearTimeout(timer);
            selIdx = -1;
            timer  = setTimeout(() => performSearch(input.value.trim()), 150);
        });

        input.addEventListener('focus', () => {
            if (input.value.trim().length >= 2) dropdown.style.display = 'block';
        });

        input.addEventListener('keydown', e => {
            const items = [...dropdown.querySelectorAll('.search-item')];
            if (!items.length) return;
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                selIdx = Math.min(selIdx + 1, items.length - 1);
                items.forEach((el, i) => el.classList.toggle('selected', i === selIdx));
                items[selIdx]?.scrollIntoView({ block: 'nearest' });
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                selIdx = Math.max(selIdx - 1, 0);
                items.forEach((el, i) => el.classList.toggle('selected', i === selIdx));
                items[selIdx]?.scrollIntoView({ block: 'nearest' });
            } else if (e.key === 'Enter' && selIdx >= 0) {
                e.preventDefault();
                items[selIdx]?.click();
            } else if (e.key === 'Escape') {
                dropdown.style.display = 'none';
                input.blur();
            }
        });

        document.addEventListener('click', e => {
            if (!e.target.closest('.header-center')) dropdown.style.display = 'none';
        });
    }

    function performSearch(query) {
        const dropdown = document.getElementById('search-results');
        if (!query || query.length < 2) { dropdown.style.display = 'none'; return; }

        const q       = query.toLowerCase();
        const results = [];

        window.COURSES.forEach(course => {
            if (course.title.toLowerCase().includes(q)) {
                results.push({ type:'course', course, chapter:course.chapters[0]||null, task:null, score:3 });
            }
            course.chapters.forEach(ch => {
                if (ch.title.toLowerCase().includes(q)) {
                    results.push({ type:'chapter', course, chapter:ch, task:null, score:2 });
                }
                ch.tasks.forEach(task => {
                    const inTitle = task.title.toLowerCase().includes(q);
                    const inDesc  = stripHtml(task.description).toLowerCase().includes(q);
                    if (inTitle || inDesc) {
                        results.push({ type:'task', course, chapter:ch, task, score: inTitle ? 2 : 1 });
                    }
                });
            });
        });

        results.sort((a, b) => b.score - a.score);

        if (results.length === 0) {
            dropdown.innerHTML = `<div class="search-empty">
                <span>🔍</span>
                <span>Ничего не найдено по запросу "<strong>${escHtml(query)}</strong>"</span>
            </div>`;
        } else {
            dropdown.innerHTML = results.slice(0, 10).map(r => {
                const icon  = r.type === 'course'  ? (r.course.icon || '📚') :
                              r.type === 'chapter' ? '📖' :
                              ({ easy:'🟢', medium:'🟡', hard:'🔴' }[r.task?.difficulty] || '📝');
                const title = r.type === 'course' ? r.course.title :
                              r.type === 'task'   ? r.task.title : r.chapter.title;
                const meta  = r.type === 'course' ? `${r.course.chapters.length} глав` :
                              r.course.title + (r.type === 'task' ? ' › ' + r.chapter.title : '');
                const label = r.type === 'course' ? 'Курс' : r.type === 'chapter' ? 'Глава' : 'Задание';
                return `<div class="search-item"
                    data-course="${r.course.id}"
                    data-chapter="${r.chapter?.id || ''}"
                    data-task="${r.task?.id || ''}"
                    data-type="${r.type}">
                    <span class="search-item-icon">${icon}</span>
                    <div>
                        <div class="search-item-title">${highlightMatch(title, query)}</div>
                        <div class="search-item-meta">${meta}</div>
                    </div>
                    <span class="search-item-type">${label}</span>
                </div>`;
            }).join('');

            dropdown.querySelectorAll('.search-item').forEach(el => {
                el.addEventListener('click', () => {
                    const cId  = el.dataset.course;
                    const chId = el.dataset.chapter;
                    const tId  = el.dataset.task;
                    const type = el.dataset.type;
                    dropdown.style.display = 'none';
                    document.getElementById('search-input').value = '';
                    openCourseInSidebar(cId);
                    if (type === 'course') {
                        const course = window.COURSES.find(c => c.id === cId);
                        if (course?.chapters.length) openChapter(cId, course.chapters[0].id);
                    } else if (chId) {
                        openChapter(cId, chId);
                        if (tId) {
                            const course  = window.COURSES.find(c => c.id === cId);
                            const chapter = course?.chapters.find(c => c.id === chId);
                            const task    = chapter?.tasks.find(t => t.id === tId);
                            if (task) setTimeout(() => {
                                showTab(task.difficulty);
                                setTimeout(() => openTask(task), 80);
                            }, 60);
                        }
                    }
                });
            });
        }
        dropdown.style.display = 'block';
    }

    function highlightMatch(text, query) {
        const safe = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return text.replace(new RegExp(`(${safe})`, 'gi'), '<mark>$1</mark>');
    }

    /* ── PAGES ───────────────────────────────────────── */
    function showPage(name) {
        document.querySelectorAll('.page').forEach(p => {
            p.style.display = 'none';
            p.classList.remove('fade-in');
        });
        const page = document.getElementById('page-' + name);
        if (page) {
            page.style.display = 'block';
            requestAnimationFrame(() => page.classList.add('fade-in'));
            document.getElementById('main-content').scrollTop = 0;
        }
    }

    function goBack() {
        currentCourse  = null;
        currentChapter = null;
        document.querySelectorAll('.nav-chapter').forEach(el => el.classList.remove('active'));
        buildCourseGrid();
        showPage('welcome');
    }

    function toggleHints() {
        const list = document.getElementById('hints-list');
        const btn  = document.getElementById('hint-toggle');
        const vis  = list.style.display !== 'none';
        list.style.display = vis ? 'none' : 'block';
        btn.textContent    = vis ? '💡 Показать подсказки' : '💡 Скрыть подсказки';
    }

    /* ── UTILS ───────────────────────────────────────── */
    function stripHtml(html) {
        return (html || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    }

    function escHtml(str) {
        return (str || '').replace(/[&<>"']/g, c =>
            ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
    }

    /* ── PUBLIC API ──────────────────────────────────── */
    return {
        init, openChapter, openTask, closeTask, showTab, goBack,
        runCode, clearOutput, resetCode, markSolved, toggleHints,
        changeFontSize, addEditorFile, toggleSnippetMode
    };
})();

document.addEventListener('DOMContentLoaded', () => app.init());
