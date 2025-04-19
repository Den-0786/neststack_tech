// document.addEventListener("DOMContentLoaded", () => {
//     const themeSwitch = document.getElementById("themeSwitch");
//     const body = document.body;
//     const logoutBtn = document.getElementById("logoutBtn");

//     // Load dark mode preference
//     const darkMode = localStorage.getItem("darkMode");

//     // Set the default theme to light mode
//     if (darkMode === null){
//         localStorage.setItem("darkMode", "false");
//     }
//     // Apply dark mode theme based on saved preference
//     if (darkMode === "true") {
//         body.classList.add("dark-mode");
//         themeSwitch.checked = true;
//     } else {
//         body.classList.remove("dark-mode");
//         themeSwitch.checked = false;
//     }

//     // Dark Mode Toggle
//     themeSwitch.addEventListener("change", () => {
//         if (themeSwitch.checked) {
//             body.classList.add("dark-mode");
//             localStorage.setItem("darkMode", "true");
//         } else {
//             body.classList.remove("dark-mode");
//             localStorage.setItem("darkMode", "false");
//         }
//     });

//     // Logout functionality
//     logoutBtn.addEventListener("click", () => {
//         localStorage.removeItem("adminToken");
//         showToast("Logged out successfully!");
//         // Redirect to login page
//         setTimeout(()=>{
//             window.location.href = "/Portfolio_Frontend/admin-login.html";
//         }, 1000)
        
//     });

//     //Toast Notification function
//     function showToast(message) {
//         const toast = document.getElementById('toast');
//         const toastMessage = document.getElementById('toastMessage');
    
//         if (toast && toastMessage){
//             toastMessage.textContent = message;
    
//             //Show the toast
//             toast.classList.add('show');
    
//             //After 3 seconds, hide the toast
//             setTimeout(() => {
//                 toast.classList.remove('show');
//             }, 7000);
//         }
//     }

// });
document.addEventListener("DOMContentLoaded", () => {
    const themeSwitch = document.getElementById("themeSwitch");
    const body = document.body;
    const logoutBtn = document.getElementById("logoutBtn");

    // Load dark mode preference
    const darkMode = localStorage.getItem("darkMode");

    // Set the default theme to light mode
    if (darkMode === null) {
        localStorage.setItem("darkMode", "false");
    }
    // Apply dark mode theme based on saved preference
    if (darkMode === "true") {
        body.classList.add("dark-mode");
        themeSwitch.checked = true;
    } else {
        body.classList.remove("dark-mode");
        themeSwitch.checked = false;
    }

    // Dark Mode Toggle
    themeSwitch.addEventListener("change", () => {
        if (themeSwitch.checked) {
            body.classList.add("dark-mode");
            localStorage.setItem("darkMode", "true");
        } else {
            body.classList.remove("dark-mode");
            localStorage.setItem("darkMode", "false");
        }
    });

    // Logout functionality
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("adminToken");
        showToast("Logged out successfully!");
        setTimeout(() => {
            window.location.href = "/Portfolio_Frontend/admin-login.html";
        }, 1000);
    });

    // Handle Delete Account
    const deleteAccountBtn = document.getElementById("deleteAccountBtn");
    deleteAccountBtn.addEventListener("click", function () {
        if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            showToast("Account deleted.");
            // Send delete request to backend (to be implemented)
        }
    });

    // Show About Info
    const aboutInfo = document.getElementById("aboutInfo");
    aboutInfo.addEventListener("click", function () {
        showToast("Admin Dashboard v1.0. Developed by Prof Dennis.");
    });

    // Toggle Notification Settings
    const notificationToggle = document.getElementById("notificationToggle");
    notificationToggle.addEventListener("click", function () {
        showToast("Notification settings coming soon!");
    });

    // Toast Notification function
    function showToast(message) {
        const toast = document.getElementById("toast");
        const toastMessage = document.getElementById("toastMessage");

        if (toast && toastMessage) {
            toastMessage.textContent = message;
            toast.classList.add("show");
            setTimeout(() => {
                toast.classList.remove("show");
            }, 7000);
        }
    }
});