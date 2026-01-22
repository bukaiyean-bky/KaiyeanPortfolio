// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute("href"))
            .scrollIntoView({ behavior: "smooth" });
    });
});

const toggleBtn = document.getElementById("theme-toggle");
const body = document.body;

// Load saved theme
if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark");
    toggleBtn.textContent = "☀️";
}

toggleBtn.addEventListener("click", () => {
    body.classList.toggle("dark");

    const isDark = body.classList.contains("dark");
    toggleBtn.textContent = isDark ? "☀️" : "🌙";
    localStorage.setItem("theme", isDark ? "dark" : "light");
});

const faders = document.querySelectorAll('.fade-up');

const appearOptions = {
    threshold: 0.1,
};

const appearOnScroll = new IntersectionObserver(function(entries, observer){
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
    });
}, appearOptions);

faders.forEach(fader => {
    appearOnScroll.observe(fader);
});

// Animate each letter of the name
const animatedText = document.querySelector('.animated-text');
const text = animatedText.textContent;
animatedText.textContent = ''; // Clear original text

text.split('').forEach((letter, index) => {
    if (letter === ' ') {
        animatedText.appendChild(document.createTextNode(' ')); // preserve spaces
    } else {
        const span = document.createElement('span');
        span.textContent = letter;
        // Add stagger animation to letters except first
        if (index !== 0) {
            span.style.animationDelay = `${index * 0.1}s`;
        }
        animatedText.appendChild(span);
    }
});

// Get form and popup elements
const form = document.getElementById("contactForm");
const popup = document.getElementById("successPopup");
const closeBtn = document.getElementById("closePopup");

form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent default page reload

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
        const res = await fetch("/send-message", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await res.json();
        if (result.success) {
            popup.style.display = "block"; // Show popup
            form.reset();
        } else {
            alert(result.message || "Something went wrong!");
        }
    } catch (err) {
        alert("Error sending message!");
    }
});

closeBtn.addEventListener("click", () => {
    popup.style.display = "none";
});
