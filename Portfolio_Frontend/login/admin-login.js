document.addEventListener("DOMContentLoaded", () => {
    // Inject the settings icon using Lucide
    const settingsIcon = document.getElementById("settings-icon");
    if (settingsIcon) {
        settingsIcon.innerHTML = '<i data-lucide="settings"></i>';
        lucide.createIcons(); // Initialize Lucide icons
    }

    // Admin Login Form Submission
    const adminLoginForm = document.getElementById('adminLoginForm');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const username = document.getElementById('username')?.value.trim();
            const password = document.getElementById('password')?.value.trim();

            if (!username || !password) {
                alert('Please enter both username and password.');
                return;
            }

            console.log('Sending Request Payload:', { username, password }); // Log the request payload
            
         fetch('http://localhost:5000/api/admin/login', { // Use full backend URL
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        })
        
        .then(response => {
        console.log('Server Response Status:', response.status); // Log the response status
        if (!response.ok) {
            return response.text().then(text => {
                console.error('Server Response Body:', text); // Log the response body
                throw new Error(text || 'Login failed. Please try again.');
            });
        }
        return response.json();
        })
        .then(data => {
            console.log('Server Response Data:', data); // Log the response data
            if (data.token) {
                localStorage.setItem('adminToken', data.token);
                console.log('Login successful, token stored:', data.token);
                window.location.href = '/Portfolio_Frontend/dashboard/admin-dashboard.html'; // Redirect to dashboard
        } else {
            alert(data.error || 'Login failed. Please try again.');
            }
        })
        .catch(error => {
          console.error('Login Error:', error); // Log the error
                alert(error.message || 'An unexpected error occurred. Please try again.');
        });
    });
}

    // Check Admin Token on Dashboard Load
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken && window.location.pathname.includes('/dashboard/admin-dashboard.html')) {
        alert("Unauthorized! Please log in.");
        window.location.href = "/Portfolio_Frontend/login/admin-login.html";
        return;
    }

    const headers = { "Authorization": `Bearer ${adminToken}`, "Content-Type": "application/json" };

    // Fetch and Display Data
    function fetchData(endpoint, listElement, itemTemplate) {
        fetch(endpoint, { headers })
            .then(response => response.json())
            .then(data => {
                document.getElementById(listElement).innerHTML = data.length ?
                    data.map(itemTemplate).join('') : "<p>No records found.</p>";
            })
            .catch(error => alert(`Error fetching ${endpoint}: ${error.message}`));
    }

    // Universal Delete Function
    function deleteItem(endpoint, id, fetchFunction) {
        if (confirm("Are you sure you want to delete this item?")) {
            fetch(`${endpoint}/${id}`, { method: "DELETE", headers })
                .then(response => response.json())
                .then(data => {
                    alert(data.message || "Deleted successfully!");
                    logAdminActivity(`Deleted item from ${endpoint}`);
                    fetchFunction();
                })
                .catch(error => alert(`Error deleting from ${endpoint}: ${error.message}`));
        }
    }

    // Log Admin Activity
    function logAdminActivity(action) {
        fetch("/api/admin-logs", {
            method: "POST",
            headers,
            body: JSON.stringify({ action })
        })
            .catch(error => alert("Error logging admin activity: " + error.message));
    }

    // Fetch Admin Logs
    function fetchAdminLogs() {
        fetchData("/api/admin-logs", "adminLogsList", log => `
            <div class="log-item">
                <p>${log.timestamp}: ${log.action}</p>
            </div>`);
    }

    // Fetch and Display Sections
    const sections = ["skills", "projects", "education", "experience", "certificates", "subscriptions", "contacts"];
    sections.forEach(section => window[`fetch${section.charAt(0).toUpperCase() + section.slice(1)}`] = () => {
        fetchData(`/api/${section}`, `${section}List`, item => `
            <div class="${section}-item">
                <h4>${item.name || item.title || item.institution || item.company}</h4>
                <p>${item.description || item.degree || item.position || item.issuing_organization}</p>
                <button onclick="deleteItem('/api/${section}', ${item.id}, fetch${section.charAt(0).toUpperCase() + section.slice(1)})">Delete</button>
            </div>`);
    });

    // File Upload for Projects & Certificates
    document.querySelectorAll("[data-upload]").forEach(input => input.addEventListener("change", (event) => uploadFile(event, input.dataset.upload)));

    function uploadFile(event, type) {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        fetch(`/api/upload/${type}`, { method: "POST", headers: { "Authorization": `Bearer ${adminToken}` }, body: formData })
            .then(response => response.json())
            .then(data => {
                alert(data.message || "File uploaded successfully!");
                logAdminActivity(`Uploaded a ${type} file`);
            })
            .catch(error => alert(`Error uploading ${type}: ${error.message}`));
    }

    // Logout Functionality
    document.getElementById("logoutBtn")?.addEventListener("click", () => {
        localStorage.removeItem("adminToken");
        window.location.href = "/Portfolio_Frontend/login/admin-login.html?loggedOut=true";
    });

    // Export Data Buttons
    document.querySelectorAll("[data-export]").forEach(btn => btn.addEventListener("click", () => {
        window.location.href = `/api/admin/export-${btn.dataset.export}`;
    }));

    // Draggable Sidebar Functionality
    const sidebar = document.getElementById("sidebar");
    const sidebarHandleImg = document.querySelector(".sidebar-handle-img"); // The image inside the sidebar-header

    let isDragging = false;
    let startX;

    // Add event listeners for dragging
    sidebarHandleImg?.addEventListener("mousedown", (e) => {
        isDragging = true;
        startX = e.clientX; // Record the starting X position of the mouse
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    });

    function onMouseMove(e) {
        if (!isDragging) return;
        const deltaX = e.clientX - startX; // Calculate the horizontal drag distance

        // If dragged to the right, open the sidebar
        if (deltaX > 50) {
            sidebar.classList.remove("collapsed");
        }
        // If dragged to the left, close the sidebar
        else if (deltaX < -50) {
            sidebar.classList.add("collapsed");
        }
    }

    function onMouseUp() {
        isDragging = false;
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
    }

    // Initial Fetch Calls for Dashboard
    if (window.location.pathname.includes('/dashboard/admin-dashboard.html')) {
        sections.forEach(section => window[`fetch${section.charAt(0).toUpperCase() + section.slice(1)}`]());
        fetchAdminLogs();
    }

    // Function for visibility icons
    function togglePassword(){
        const passwordInput = document.getElementById('password');
        const toggleIcon = document.querySelector('.toggle-icon');

        if (toggleIcon && passwordInput){
            toggleIcon.addEventListener('click', () => {
                if(passwordInput.type == 'password'){
                    passwordInput.type = 'text';
                    toggleIcon.textContent = 'visibility_off';
                } else {
                    passwordInput.type = 'password';
                    toggleIcon.textContent = 'visibility';
                }
            })
        }
    };
    // Attach the event listener to the toggle icon
    const toggleIcon = document.querySelector('.toggle-icon');
    if (toggleIcon) {
        toggleIcon.addEventListener('click', togglePassword);
    }
});
