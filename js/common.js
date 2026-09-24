// --- LÓGICA COMPARTIDA (index.html y tools.html) ---
document.addEventListener('DOMContentLoaded', () => {

  // Menú móvil
  const menuBtn = document.getElementById('mobile-menu-button');
  const menu = document.getElementById('mobile-menu');
  if (menuBtn && menu) {
    menuBtn.onclick = () => {
      const isHidden = menu.classList.toggle('hidden');
      menuBtn.setAttribute('aria-expanded', String(!isHidden));
    };
    // Cierra el menú móvil al pulsar cualquier link dentro de él
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.add('hidden');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Fondo de partículas
  if (typeof particlesJS === 'function' && document.getElementById('particles-js')) {
    particlesJS('particles-js', {
      "particles": {
        "number": { "value": 60, "density": { "enable": true, "value_area": 800 } },
        "color": { "value": "#64ffda" },
        "shape": { "type": "triangle" },
        "opacity": { "value": 0.2, "random": true },
        "size": { "value": 2, "random": true },
        "line_linked": { "enable": true, "distance": 150, "color": "#64ffda", "opacity": 0.1, "width": 1 },
        "move": { "enable": true, "speed": 1.5, "direction": "none", "random": true, "out_mode": "out", "bounce": false }
      }
    });
  }

  // Animación de aparición al hacer scroll
  const obs = new IntersectionObserver(
    ents => ents.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
    { threshold: 0.1 }
  );
  document.querySelectorAll('.section').forEach(s => obs.observe(s));
});
