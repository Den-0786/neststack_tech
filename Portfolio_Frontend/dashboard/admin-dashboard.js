document.addEventListener("DOMContentLoaded", () => {
    // Check authentication
    const adminToken = localStorage.getItem("adminToken");
    const adminName = localStorage.getItem("adminName") || "Admin"; // Get name from localStorage
    
    if (!adminToken && window.location.pathname.includes("admin-dashboard.html")) {
        alert("Unauthorized! Please log in.");
        window.location.href = "admin-login.html";
        return;
    }

    // Set the welcome message with dynamic name
    document.getElementById("welcomeMessage").textContent = `Welcome back, ${adminName}!`;

    const headers = {
        "Authorization": `Bearer ${adminToken}`,
        "Content-Type": "application/json"
    };

    // Sidebar Toggle
    const sidebar = document.getElementById("sidebar");
    const sidebarHandle = document.getElementById("sidebarHandle");
    const sidebarIcon = sidebarHandle.querySelector("material-symbols-outlined");
    
    sidebarHandle.addEventListener("click", () => {
        sidebar.classList.toggle("collapsed");

        if (sidebarIcon.classList.contains("collapsed")){
            sidebaIcon.textContent = "left_panel_open";
        } else{
            sidebarIcon.textContent = "right_panel_open";
        }
    });

    // Logout Functionality
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("adminToken");
            localStorage.removeItem("adminName");
            showToast("You have been logged out.");
            setTimeout(() => {
                window.location.href = "admin-login.html";
            }, 1000);
        });
    }

    // Modal Elements
    const editModal = document.getElementById("editModal");
    const addModal = document.getElementById("addModal");
    const closeEditModal = document.querySelector(".close-modal");
    const closeAddModal = document.querySelector(".close-add-modal");
    const modalTitle = document.getElementById("modalTitle");
    const modalFields = document.getElementById("modalFields");
    const editForm = document.getElementById("editForm");
    const addForm = document.getElementById("addForm");

    // Close modals
    closeEditModal.addEventListener("click", () => editModal.style.display = "none");
    closeAddModal.addEventListener("click", () => addModal.style.display = "none");

    window.addEventListener("click", (event) => {
        if (event.target === editModal) editModal.style.display = "none";
        if (event.target === addModal) addModal.style.display = "none";
    });

    // Initialize Calendar
    const calendarEl = document.getElementById('calendar');
    if (calendarEl) {
        const calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            },
            events: [
                // You can load events from your API here
                // Example:
                // {
                //     title: 'Meeting',
                //     start: '2023-05-12T10:30:00',
                //     end: '2023-05-12T12:30:00'
                // }
            ],
            editable: true,
            selectable: true
        });
        calendar.render();
    }

    // Universal Fetch Function
    function fetchData(endpoint, listElement) {
        fetch(`http://localhost:5000/api${endpoint}`, { headers })
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                const list = document.getElementById(listElement);
                list.innerHTML = data.length ? data.map(item => `
                    <div class="item-card">
                        <div class="item-content">
                            <div class="item-title">${item.name || item.title || item.email || item.subject || 'Untitled'}</div>
                            ${item.description ? `<div class="item-description">${item.description.substring(0, 50)}${item.description.length > 50 ? '...' : ''}</div>` : ''}
                        </div>
                        <div class="item-actions">
                            <button class="action-btn edit-btn" onclick="openEditModal('${endpoint}', '${item._id || item.id}')">
                                <span class="material-symbols-outlined" style="font-size:18px">edit</span>
                            </button>
                            <button class="action-btn delete-btn" onclick="deleteItem('${endpoint}', '${item._id || item.id}')">
                                <span class="material-symbols-outlined" style="font-size:18px">delete</span>
                            </button>
                        </div>
                    </div>
                `).join('') : "<p>No records found.</p>";
                
                // Update stats counters
                updateStatsCounters();
            })
            .catch(error => {
                console.error(`Error fetching ${endpoint}:`, error);
                showToast(`Error loading ${endpoint.replace('/', '')}. Check console for details.`);
            });
    }

    // Update stats counters
    function updateStatsCounters() {
        // These would normally come from your API
        document.getElementById("totalProjects").textContent = document.getElementById("projectsList").children.length || 0;
        document.getElementById("totalMessages").textContent = document.getElementById("contactsList").children.length || 0;
        // Add similar updates for other counters
    }

    // Open edit modal
    window.openEditModal = (endpoint, id) => {
        fetch(`http://localhost:5000/api${endpoint}/${id}`, { headers })
            .then(response => response.json())
            .then(data => {
                modalTitle.textContent = `Edit ${endpoint.slice(1)}`;
                modalFields.innerHTML = generateFormFields(data, endpoint);
                
                editForm.onsubmit = (e) => {
                    e.preventDefault();
                    const formData = new FormData(editForm);
                    const updatedData = {};
                    formData.forEach((value, key) => updatedData[key] = value);
                    
                    fetch(`http://localhost:5000/api${endpoint}/${id}`, {
                        method: "PUT",
                        headers,
                        body: JSON.stringify(updatedData)
                    })
                    .then(response => response.json())
                    .then(data => {
                        showToast("Item updated successfully!");
                        fetchData(endpoint, `${endpoint.slice(1)}List`);
                        editModal.style.display = "none";
                    })
                    .catch(error => {
                        showToast(`Error updating item: ${error.message}`);
                    });
                };
                
                editModal.style.display = "block";
            })
            .catch(error => {
                showToast(`Error fetching item: ${error.message}`);
            });
    };

    // Generate form fields
    function generateFormFields(data, endpoint) {
        let fields = '';
        
        switch(endpoint) {
            case '/skills':
                fields = `
                    <div class="form-group">
                        <label for="name">Skill Name</label>
                        <input type="text" id="name" name="name" value="${data.name || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="level">Level</label>
                        <select id="level" name="level">
                            <option value="Beginner" ${data.level === 'Beginner' ? 'selected' : ''}>Beginner</option>
                            <option value="Intermediate" ${data.level === 'Intermediate' ? 'selected' : ''}>Intermediate</option>
                            <option value="Advanced" ${data.level === 'Advanced' ? 'selected' : ''}>Advanced</option>
                            <option value="Expert" ${data.level === 'Expert' ? 'selected' : ''}>Expert</option>
                        </select>
                    </div>
                `;
                break;
                
            case '/projects':
                fields = `
                    <div class="form-group">
                        <label for="title">Project Title</label>
                        <input type="text" id="title" name="title" value="${data.title || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="description">Description</label>
                        <textarea id="description" name="description" rows="4" required>${data.description || ''}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="startDate">Start Date</label>
                        <input type="date" id="startDate" name="startDate" value="${data.startDate || ''}">
                    </div>
                    <div class="form-group">
                        <label for="endDate">End Date</label>
                        <input type="date" id="endDate" name="endDate" value="${data.endDate || ''}">
                    </div>
                `;
                break;
                
            case '/contacts':
                fields = `
                    <div class="form-group">
                        <label for="name">Name</label>
                        <input type="text" id="name" name="name" value="${data.name || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" value="${data.email || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="message">Message</label>
                        <textarea id="message" name="message" rows="4" required>${data.message || ''}</textarea>
                    </div>
                `;
                break;
                
            default:
                for (const key in data) {
                    if (key !== 'id' && key !== '_id' && key !== '__v') {
                        fields += `
                            <div class="form-group">
                                <label for="${key}">${key.charAt(0).toUpperCase() + key.slice(1)}</label>
                                <input type="text" id="${key}" name="${key}" value="${data[key] || ''}">
                            </div>
                        `;
                    }
                }
        }
        
        return fields;
    }

    // Delete item function
    window.deleteItem = (endpoint, id) => {
        if (confirm("Are you sure you want to delete this item?")) {
            fetch(`http://localhost:5000/api${endpoint}/${id}`, { 
                method: "DELETE", 
                headers 
            })
            .then(response => response.json())
            .then(data => {
                showToast("Item deleted successfully!");
                fetchData(endpoint, `${endpoint.slice(1)}List`);
            })
            .catch(error => {
                showToast(`Error deleting item: ${error.message}`);
            });
        }
    };

    // Setup Add Buttons
    function setupAddButtons() {
        // Add Skill
        const addSkillBtn = document.getElementById('addSkillBtn');
        if (addSkillBtn) {
            addSkillBtn.addEventListener('click', () => showAddModal('/skills', {
                name: { type: 'text', required: true },
                level: { 
                    type: 'select', 
                    options: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
                    required: true 
                }
            }));
        }

        // Add Project
        const addProjectBtn = document.getElementById('addProjectBtn');
        if (addProjectBtn) {
            addProjectBtn.addEventListener('click', () => showAddModal('/projects', {
                title: { type: 'text', required: true },
                description: { type: 'textarea', required: true },
                startDate: { type: 'date', required: true },
                endDate: { type: 'date' }
            }));
        }

        // Add Message (Reply)
        const addMessageBtn = document.getElementById('addMessageBtn');
        if (addMessageBtn) {
            addMessageBtn.addEventListener('click', () => showAddModal('/contacts', {
                name: { type: 'text', required: true },
                email: { type: 'email', required: true },
                message: { type: 'textarea', required: true }
            }));
        }
    }

    function showAddModal(endpoint, fields) {
        document.getElementById("addModalTitle").textContent = `Add New ${endpoint.split('/')[1]}`;
        const addModalFields = document.getElementById("addModalFields");
        addModalFields.innerHTML = '';
        
        for (const [field, config] of Object.entries(fields)) {
            const div = document.createElement('div');
            div.className = 'form-group';
            
            const label = document.createElement('label');
            label.htmlFor = field;
            label.textContent = field.charAt(0).toUpperCase() + field.slice(1);
            div.appendChild(label);
            
            let input;
            if (config.type === 'textarea') {
                input = document.createElement('textarea');
                input.rows = 4;
            } else if (config.type === 'select') {
                input = document.createElement('select');
                config.options.forEach(option => {
                    const opt = document.createElement('option');
                    opt.value = option;
                    opt.textContent = option;
                    input.appendChild(opt);
                });
            } else {
                input = document.createElement('input');
                input.type = config.type || 'text';
            }
            
            input.id = field;
            input.name = field;
            if (config.required) input.required = true;
            div.appendChild(input);
            addModalFields.appendChild(div);
        }
        
        document.getElementById("addForm").onsubmit = (e) => {
            e.preventDefault();
            const formData = new FormData(document.getElementById("addForm"));
            const newData = {};
            formData.forEach((value, key) => newData[key] = value);
            
            fetch(`http://localhost:5000/api${endpoint}`, {
                method: "POST",
                headers,
                body: JSON.stringify(newData)
            })
            .then(response => response.json())
            .then(data => {
                showToast("Item added successfully!");
                fetchData(endpoint, `${endpoint.split('/')[1]}List`);
                document.getElementById("addModal").style.display = "none";
            })
            .catch(error => {
                showToast(`Error adding item: ${error.message}`);
            });
        };
        
        document.getElementById("addModal").style.display = "block";
    }

    // Toast Notification
    function showToast(message) {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
    
        if (toast && toastMessage) {
            toastMessage.textContent = message;
            toast.classList.add('show');
    
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }
    }

    // Initialize everything
    setupAddButtons();
    const sections = [
        '/skills', 
        '/projects', 
        '/education', 
        '/experience', 
        '/certificates', 
        '/subscriptions', 
        '/contacts'
    ];
    sections.forEach(section => fetchData(section, `${section.slice(1)}List`));
});