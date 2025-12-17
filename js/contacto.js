document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("contactForm");
    const container = document.querySelector(".profile-container.contact-page");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value || "amigx";


        container.innerHTML = `
            <section class="profile-text" style="text-align:center;">
                <h1 style="margin-bottom:1rem;">¡Muchas gracias, ${escapeHtml(name)}!</h1>
                <p style="font-size:1rem; opacity:0.85;">
                    Hemos recibido tu mensaje correctamente.
                </p>

                <a class="back-link" href="index.html?mode=skipintro" style="margin-top:2rem; display:inline-block;">
                    ← Volver al hub
                </a>
            </section>
        `;
    });


    function escapeHtml(str) {
        return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }
});
