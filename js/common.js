// --- LÓGICA COMPARTIDA (index.html y tools.html) ---
document.addEventListener('DOMContentLoaded', () => {

  // Menú móvil
  const menuBtn = document.getElementById('mobile-menu-button');
  const menu = document.getElementById('mobile-menu');
  if (menuBtn && menu) {
    const icon = menuBtn.querySelector("i");
    const setMenu = (open) => {
      menu.classList.toggle("hidden", !open);
      menuBtn.setAttribute("aria-expanded", String(open));
      menuBtn.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
      if (icon) { icon.classList.toggle("fa-bars", !open); icon.classList.toggle("fa-times", open); }
    };
    menuBtn.onclick = () => setMenu(menu.classList.contains("hidden"));
    // Cierra el menú móvil al pulsar un link, al tocar fuera, con Escape o al pasar a escritorio
    menu.querySelectorAll("a").forEach(link => link.addEventListener("click", () => setMenu(false)));
    document.addEventListener("click", (e) => {
      if (!menu.classList.contains("hidden") && !menu.contains(e.target) && !menuBtn.contains(e.target)) setMenu(false);
    });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });
    window.matchMedia("(min-width: 1280px)").addEventListener("change", (e) => { if (e.matches) setMenu(false); });
  }

  // Fondo de partículas (más denso en escritorio; en móvil, cantidad fija y ligera para no gastar batería)
  if (typeof particlesJS === "function" && document.getElementById("particles-js")) {
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    particlesJS("particles-js", {
      "particles": {
        "number": isMobile
          ? { "value": 45, "density": { "enable": false } }
          : { "value": Math.min(150, Math.max(70, Math.round(window.innerWidth / 10))), "density": { "enable": false } },
        "color": { "value": "#64ffda" },
        "shape": { "type": "triangle" },
        "opacity": { "value": 0.35, "random": true },
        "size": { "value": isMobile ? 2.5 : 3, "random": true },
        "line_linked": { "enable": true, "distance": isMobile ? 110 : 140, "color": "#64ffda", "opacity": 0.14, "width": 1 },
        "move": { "enable": !reduceMotion, "speed": isMobile ? 1 : 1.5, "direction": "none", "random": true, "out_mode": "out", "bounce": false }
      },
      "interactivity": {
        "events": { "onhover": { "enable": false }, "onclick": { "enable": false }, "resize": true }
      },
      "retina_detect": false
    });
  }

  // Animación de aparición al hacer scroll
  const obs = new IntersectionObserver(
    ents => ents.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
    { threshold: 0.1 }
  );
  document.querySelectorAll('.section').forEach(s => obs.observe(s));
});
