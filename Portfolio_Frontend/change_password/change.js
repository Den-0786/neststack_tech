document.getElementById("changePasswordForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const oldPassword = document.getElementById("oldPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Validate that new password and confirm password match
    if (newPassword !== confirmPassword) {
        showToast("New passwords do not match.");
        return;
    }

    try {
        const response = await fetch("/api/admin/change-password", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ oldPassword, newPassword }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Password change failed.");
        }

        const data = await response.json();
        showToast(data.message || "Password changed successfully.");
        setTimeout(() => {
            window.location.href = "/Portfolio_Frontend/settings.html"; // Redirect to settings page
        }, 2000);
    } catch (error) {
        showToast(error.message || "An error occurred. Please try again.");
    }
});

// Toast notification function
function showToast(message) {
    const toast = document.getElementById("toast");
    const toastMessage = document.getElementById("toastMessage");

    if (toast && toastMessage) {
        toastMessage.textContent = message;
        toast.classList.add("show");
        setTimeout(() => {
            toast.classList.remove("show");
        }, 3000);
    }
}