document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const resetToken = urlParams.get("token");


    document.getElementById("resetToken").value = resetToken;
});

document.getElementById("resetPasswordForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const resetToken = document.getElementById("resetToken").value;

    if (newPassword !== confirmPassword) {
        showToast("New passwords do not match.");
        return;
    }

    try {
        const response = await fetch("/api/admin/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: resetToken, newPassword }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to reset password.");
        }

        const data = await response.json();
        showToast(data.message || "Password reset successfully.");
        setTimeout(() => {
            window.location.href = "/Portfolio_Frontend/admin-login.html"; // Redirect to login page
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