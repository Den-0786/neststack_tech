document.getElementById("requestPasswordResetForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;

    try {
        const response = await fetch("/api/admin/request-password-reset", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });
        
        console.log("Response status:", response.status);

        if (response.ok){
            let message = "Password reset link sent to your email";

            try{
                const data = await response.json();
                if (data && data.message ){
                    message = data.message;
                }
            } catch(e){
                console.error("Error parsing success response:", e); 
            }
            showToast(message);
            return;
        }
        
        let errorMessage = "Failed to send reset link";
        try{
            const errorData = await response.json();
            console.log("Error response data:", errorMessage);
            if (errorData && errorData.message ){
                errorMessage = errorData.message;
            }
            
        } catch(e){
            console.error("Error parsing error response:", e);
        }
        throw new Error(errorMessage);
        
        // showToast(data.message || "Password reset link sent to your email.");
    } catch (error) {
        console.error("Fetch error:", error);
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