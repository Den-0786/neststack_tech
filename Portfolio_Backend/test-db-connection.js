const { getAllCertificates, addCertificate, updateCertificate, deleteCertificate } = require("./models/certificateModel");

(async () => {
    try {
        // Test getAllCertificates
        const certificates = await getAllCertificates();
        console.log("All Certificates:", certificates);

        // Test addCertificate
        const newCertificate = await addCertificate("Certificate 1", "Org 1", "2023-01-01", "https://example.com");
        console.log("Added Certificate:", newCertificate);

        // Test updateCertificate
        const updatedCertificate = await updateCertificate(newCertificate.id, "Updated Certificate 1", "Org 1", "2023-01-01", "https://example.com");
        console.log("Updated Certificate:", updatedCertificate);

        // Test deleteCertificate
        const deletedCertificate = await deleteCertificate(newCertificate.id);
        console.log("Deleted Certificate:", deletedCertificate);
    } catch (error) {
        console.error("Error testing model functions:", error);
    }
})();