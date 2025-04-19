document.addEventListener("DOMContentLoaded", () => {
    // Hamburger menu functionality
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");

    if (hamburger && navLinks) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navLinks.classList.toggle("active");

            // Update aria-expanded attribute
            let expanded = hamburger.classList.contains("active");
            hamburger.setAttribute("aria-expanded", expanded);
        });
    }

    // Tooltip functionality for send button
    const sendButton = document.querySelector(".email-container button");
    const tooltip = document.querySelector(".tooltip-text");

    if (sendButton && tooltip) {
        sendButton.addEventListener("mouseenter", () => {
            tooltip.style.visibility = "visible";
            tooltip.style.opacity = "1";
        });

        sendButton.addEventListener("mouseleave", () => {
            tooltip.style.visibility = "hidden";
            tooltip.style.opacity = "0";
        });
    }

    // Newsletter form functionality
    const newsletterForm = document.getElementById("newsletterForm");

    if (newsletterForm) {
        newsletterForm.addEventListener("submit", function (event) {
            event.preventDefault(); // Prevent the form from submitting

            const emailInput = document.getElementById("newsletter-email");
            const email = emailInput.value;

            // Validate the email
            if (!email || !email.includes("@")) {
                showToast("Please enter a valid email address.");
                return;
            }

            // Show loading spinner
            const sendBtn = document.getElementById("sendBtn");
            sendBtn.innerHTML = '<div class="loader"></div>'; // Replace button content with spinner
            sendBtn.disabled = true; // Disable the button during "processing"

            // Simulate a subscription process (2 seconds delay)
            setTimeout(() => {
                // Hide loading spinner and reset button
                sendBtn.innerHTML = '<img src="portimages/arrow.png" alt="Send">';
                sendBtn.disabled = false;

                // Show success message
                showToast(`Thank you for subscribing, ${email}! You'll receive updates about my latest projects.`);

                // Clear the input field
                emailInput.value = "";
            }, 2000); // Simulate a 2-second delay
        });
    }

    // Toast Notification Function
    function showToast(message) {
        const toast = document.getElementById("toast");
        const toastMessage = document.getElementById("toastMessage");

        if (toast && toastMessage) {
            // Set the toast message
            toastMessage.textContent = message;

            // Show the toast
            toast.classList.add("show");

            // Hide the toast after 3 seconds
            setTimeout(() => {
                toast.classList.remove("show");
            }, 3000);
        }
    }
});