document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('username');
    if (!username) {
        window.location.href = 'login.html';
        return;
    }

    const welcomeMessage = document.getElementById('welcome-message');
    welcomeMessage.textContent = `Welcome, ${username}!`;

    const logoutBtn = document.getElementById('logout-btn');
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('username');
        localStorage.removeItem('careerEntries'); // Optional: clear data on logout
        window.location.href = 'login.html';
    });

    const addEntryBtn = document.getElementById('add-entry-btn');
    const addEntryModal = document.getElementById('add-entry-modal');
    const statsModal = document.getElementById('stats-modal');
    const closeButtons = document.querySelectorAll('.close-btn');
    const addEntryForm = document.getElementById('add-entry-form');
    const timelineList = document.getElementById('timeline-list');
    const searchInput = document.getElementById('search-input');
    const filterCategory = document.getElementById('filter-category');
    const viewStatsBtn = document.getElementById('view-stats-btn');

    let entries = JSON.parse(localStorage.getItem('careerEntries')) || [];

    const saveEntries = () => {
        localStorage.setItem('careerEntries', JSON.stringify(entries));
    };

    const renderEntries = (filter = '', category = 'all') => {
        timelineList.innerHTML = '';
        const filteredEntries = entries
            .filter(entry => entry.title.toLowerCase().includes(filter.toLowerCase()))
            .filter(entry => category === 'all' || entry.category === category);

        if (filteredEntries.length === 0) {
            timelineList.innerHTML = '<p>No entries found. Add one to get started!</p>';
            return;
        }
        
        filteredEntries.sort((a, b) => new Date(b.date) - new Date(a.date));

        filteredEntries.forEach(entry => {
            const li = document.createElement('li');
            li.className = `timeline-item ${entry.category}`;
            li.innerHTML = `
                <button class="delete-btn" data-id="${entry.id}">&times;</button>
                <h3>${entry.title}</h3>
                <div class="meta">
                    <span>${entry.category.charAt(0).toUpperCase() + entry.category.slice(1)}</span> | 
                    <span>${new Date(entry.date).toLocaleDateString()}</span>
                </div>
                <p>${entry.description}</p>
            `;
            timelineList.appendChild(li);
        });
    };

    const updateDashboard = () => {
        document.getElementById('total-activities').textContent = entries.length;
        document.getElementById('courses-completed').textContent = entries.filter(e => e.category === 'course').length;
        document.getElementById('skills-learned').textContent = entries.filter(e => e.category === 'skill').length;
        document.getElementById('internships-total').textContent = entries.filter(e => e.category === 'internship').length;
        document.getElementById('certifications-total').textContent = entries.filter(e => e.category === 'certification').length;
    };
    
    const openModal = (modal) => modal.style.display = 'block';
    const closeModal = (modal) => modal.style.display = 'none';

    addEntryBtn.addEventListener('click', () => openModal(addEntryModal));
    viewStatsBtn.addEventListener('click', () => {
        renderStats();
        openModal(statsModal);
    });

    closeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            closeModal(e.target.closest('.modal'));
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });

    addEntryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newEntry = {
            id: Date.now(),
            category: document.getElementById('entry-category').value,
            title: document.getElementById('entry-title').value,
            description: document.getElementById('entry-description').value,
            date: document.getElementById('entry-date').value,
        };
        entries.push(newEntry);
        saveEntries();
        renderEntries();
        updateDashboard();
        addEntryForm.reset();
        closeModal(addEntryModal);
    });

    timelineList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const entryId = parseInt(e.target.dataset.id);
            entries = entries.filter(entry => entry.id !== entryId);
            saveEntries();
            renderEntries(searchInput.value, filterCategory.value);
            updateDashboard();
        }
    });

    searchInput.addEventListener('input', () => {
        renderEntries(searchInput.value, filterCategory.value);
    });

    filterCategory.addEventListener('change', () => {
        renderEntries(searchInput.value, filterCategory.value);
    });

    const renderStats = () => {
        const statsContent = document.getElementById('stats-content');
        const categoryCounts = entries.reduce((acc, entry) => {
            acc[entry.category] = (acc[entry.category] || 0) + 1;
            return acc;
        }, {});

        statsContent.innerHTML = `
            <div class="stat-item">
                <h4>Total Activities</h4>
                <p>${entries.length}</p>
            </div>
            <div class="stat-item">
                <h4>Courses</h4>
                <p>${categoryCounts['course'] || 0}</p>
            </div>
            <div class="stat-item">
                <h4>Certifications</h4>
                <p>${categoryCounts['certification'] || 0}</p>
            </div>
            <div class="stat-item">
                <h4>Skills</h4>
                <p>${categoryCounts['skill'] || 0}</p>
            </div>
            <div class="stat-item">
                <h4>Internships</h4>
                <p>${categoryCounts['internship'] || 0}</p>
            </div>
            <div class="stat-item">
                <h4>Goals</h4>
                <p>${categoryCounts['goal'] || 0}</p>
            </div>
        `;
    };


    // Initial render
    renderEntries();
    updateDashboard();
}); 