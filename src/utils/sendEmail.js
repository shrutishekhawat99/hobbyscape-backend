// ================================================
// Sends emails via Resend (https://resend.com).
// Uses plain fetch — no extra npm package needed.
// ================================================

async function sendEmail({ to, subject, html }) {

    const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`
        },
        body: JSON.stringify({
            from: process.env.EMAIL_FROM || "DIY.HobbyScape <onboarding@resend.dev>",
            to,
            subject,
            html
        })
    });

    if (!response.ok) {

        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to send email.");

    }

    return response.json();

}

module.exports = sendEmail;
