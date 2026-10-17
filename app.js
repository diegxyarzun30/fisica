const pdfData = [
    { id: 't1-res', theme: 1, type: 'resumen', title: 'Resumen Tema 1', path: 'pdfs/resumen-t1.pdf' },
    { id: 't1-eje', theme: 1, type: 'ejercicios', title: 'Ejercicios Tema 1', path: 'pdfs/ejercicios-t1.pdf' },
    { id: 't1-sol', theme: 1, type: 'soluciones', title: 'Soluciones Tema 1', path: 'pdfs/soluciones-t1.pdf' },
    { id: 't1-c10', theme: 1, type: 'clases', title: 'Clase 10: Ley de Hooke y dinámica circular', path: 'pdfs/clases/Clase 10.pdf' },
    { id: 't1-c11', theme: 1, type: 'clases', title: 'Clase 11: Dinámica en movimiento circular', path: 'pdfs/clases/Clase 11.pdf' },
    
    { id: 't2-res', theme: 2, type: 'resumen', title: 'Resumen Tema 2', path: 'pdfs/resumen-t2.pdf' },
    { id: 't2-eje', theme: 2, type: 'ejercicios', title: 'Ejercicios Tema 2', path: 'pdfs/ejercicios-t2.pdf' },
    { id: 't2-sol', theme: 2, type: 'soluciones', title: 'Soluciones Tema 2', path: 'pdfs/soluciones-t2.pdf' },
    { id: 't2-c12', theme: 2, type: 'clases', title: 'Clase 12: Trabajo y energía cinética', path: 'pdfs/clases/Clase 12.pdf' },
    
    { id: 't3-res', theme: 3, type: 'resumen', title: 'Resumen Tema 3', path: 'pdfs/resumen-t3.pdf' },
    { id: 't3-eje', theme: 3, type: 'ejercicios', title: 'Ejercicios Tema 3', path: 'pdfs/ejercicios-t3.pdf' },
    { id: 't3-sol', theme: 3, type: 'soluciones', title: 'Soluciones Tema 3', path: 'pdfs/soluciones-t3.pdf' },
    { id: 't3-c13', theme: 3, type: 'clases', title: 'Clase 13: Trabajo por fuerzas conservativas', path: 'pdfs/clases/Clase 13.pdf' },
    { id: 't3-c14', theme: 3, type: 'clases', title: 'Clase 14: Energía mecánica', path: 'pdfs/clases/Clase 14.pdf' },
    { id: 't3-c15', theme: 3, type: 'clases', title: 'Clase 15: Ejercitación energía mecánica', path: 'pdfs/clases/Clase 15.pdf' },
    
    { id: 'c2-c17', theme: 4, type: 'clases', title: 'Clase 17: Ejercitación certamen 2', path: 'pdfs/clases/Clase 17.pdf' }
];

const themes = [
    { id: 1, title: 'Tema 1: Dinámica circular y ley de Hooke' },
    { id: 2, title: 'Tema 2: Trabajo y energía cinética' },
    { id: 3, title: 'Tema 3: Energía potencial y energía mecánica' },
    { id: 4, title: 'Ejercitación del certamen 2' }
];

let progressState = JSON.parse(localStorage.getItem('fisica-certamen2-progress')) || {};
const totalFiles = pdfData.length;

const container = document.getElementById('content-container');
const progressText = document.getElementById('progress-text');
const progressPercent = document.getElementById('progress-percent');
const progressBar = document.getElementById('progress-bar');
const filterBtns = document.querySelectorAll('.filter-btn');

function init() {
    renderContent();
    updateProgressUI();
    setupFilters();
}

function renderContent() {
    container.innerHTML = '';
    
    themes.forEach(theme => {
        const themeFiles = pdfData.filter(f => f.theme === theme.id);
        
        const card = document.createElement('section');
        card.className = 'tema-card';
        card.id = `theme-card-${theme.id}`;
        
        const title = document.createElement('h2');
        title.textContent = theme.title;
        card.appendChild(title);
        
        themeFiles.forEach(file => {
            const isChecked = progressState[file.id] ? 'checked' : '';
            
            const fileEl = document.createElement('article');
            fileEl.className = 'file-item';
            fileEl.dataset.type = file.type;
            
            fileEl.innerHTML = `
                <div class="file-info">
                    <label class="checkbox-container">
                        <input type="checkbox" class="file-checkbox" data-id="${file.id}" ${isChecked}>
                        <span class="sr-only">Marcar ${file.title} como listo</span>
                    </label>
                    <div>
                        <div class="file-title">${file.title}</div>
                        <div class="file-type-badge">${file.type}</div>
                    </div>
                </div>
                <div class="file-actions">
                    <a href="${file.path}" class="btn btn-view" target="_blank" rel="noopener noreferrer" title="Abrir en pestaña nueva">Ver</a>
                    <a href="${file.path}" class="btn btn-download" download title="Descargar PDF">Descargar</a>
                </div>
            `;
            card.appendChild(fileEl);
        });
        
        container.appendChild(card);
    });

    document.querySelectorAll('.file-checkbox').forEach(cb => {
        cb.addEventListener('change', (e) => {
            const fileId = e.target.dataset.id;
            progressState[fileId] = e.target.checked;
            localStorage.setItem('fisica-certamen2-progress', JSON.stringify(progressState));
            updateProgressUI();
        });
    });
}

function updateProgressUI() {
    const completedCount = Object.values(progressState).filter(Boolean).length;
    const percentage = Math.round((completedCount / totalFiles) * 100);
    
    progressText.textContent = `${completedCount} de ${totalFiles} listos`;
    progressPercent.textContent = `${percentage}%`;
    progressBar.style.width = `${percentage}%`;
}

function setupFilters() {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            const filterValue = e.target.dataset.filter;
            
            document.querySelectorAll('.file-item').forEach(item => {
                if (filterValue === 'todo' || item.dataset.type === filterValue) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });

            themes.forEach(theme => {
                const card = document.getElementById(`theme-card-${theme.id}`);
                const visibleItems = card.querySelectorAll('.file-item:not(.hidden)');
                if (visibleItems.length === 0) {
                    card.classList.add('hidden');
                } else {
                    card.classList.remove('hidden');
                }
            });
        });
    });
}

document.addEventListener('DOMContentLoaded', init);
