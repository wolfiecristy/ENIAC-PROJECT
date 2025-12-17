const introSection = document.getElementById("intro");
const hubSection = document.getElementById("hub");
const video = document.getElementById("introVideo");
const skipButton = document.getElementById("skipButton");
const soundToggle = document.getElementById("soundToggle");

// 1) Leemos el parámetro ?mode=skipintro de la URL
const params = new URLSearchParams(window.location.search);
const skipIntro = params.get("mode") === "skipintro";

// Pasar de intro a hub con animación
function showHubWithAnimation() {
    if (!introSection || !hubSection) return;

    // Evitar repetir animación si ya está en proceso o ya está oculta
    if (introSection.classList.contains("hidden") ||
        introSection.classList.contains("fade-out")) {
        return;
    }

    introSection.classList.add("fade-out");

    setTimeout(() => {
        introSection.classList.add("hidden");
        introSection.classList.remove("fade-out");

        hubSection.classList.remove("hidden");
        hubSection.classList.add("fade-in");
        document.body.style.overflow = "auto";
    }, 700);
}

// Pasar de intro → hub directamente (sin vídeo)
function goDirectToHub() {
    if (!introSection || !hubSection) return;

    introSection.classList.add("hidden");
    hubSection.classList.remove("hidden");
    hubSection.classList.add("fade-in");
    document.body.style.overflow = "auto";
}

// 2) Lógica al cargar la página
if (skipIntro) {
    // Venimos desde una entrada: vamos directos al hub
    if (video) {
        video.pause();
        video.currentTime = 0;
    }
    goDirectToHub();
} else {
    // Modo normal: se ve el vídeo y luego pasa al hub

    // Cuando termine el vídeo
    if (video) {
        video.addEventListener("ended", showHubWithAnimation);
    }

    // Botón "Entrar al proyecto"
    if (skipButton) {
        skipButton.addEventListener("click", showHubWithAnimation);
    }
}

// 3) Botón "Activar sonido" - quitar/poner mute
if (soundToggle && video) {
    soundToggle.addEventListener("click", () => {
        video.muted = !video.muted;

        // Aseguramos que el vídeo se esté reproduciendo
        if (video.paused) {
            video.play().catch(() => {});
        }

        // Cambiamos el texto del botón
        soundToggle.textContent = video.muted
            ? "Activar sonido"
            : "Silenciar vídeo";
    });
}

// Logo flotante — control intro

(function () {
    const logo = document.querySelector('.site-logo');
    const video = document.getElementById('introVideo');

    if (!logo) return;

    if (video) {
        const hideDuringVideo = true; // <- TÚ quieres esto en true

        if (hideDuringVideo) {
            const update = () => {
                if (!video.paused && 
                    !document.documentElement.classList.contains('skip-intro')) {
                    document.body.classList.add('hide-logo');
                } else {
                    document.body.classList.remove('hide-logo');
                }
            };

            video.addEventListener('play', update);
            video.addEventListener('pause', update);
            video.addEventListener('ended', update);

            update();

            window.addEventListener('DOMContentLoaded', update);
        }
    }
})();

// THEME TOGGLER
(function () {
  const KEY = 'theme';
  const Themes = { Dark: 'dark', Light: 'light' };
  const ModeLabel = { dark: 'luminoso', light: 'oscuro' };

  function initToggler() {
    const root = document.documentElement;
    const button = document.querySelector('.color-scheme-toggler');

    if (!button) {
      console.warn('[theme-toggle] No se encontró .color-scheme-toggler en el DOM.');
      return;
    }

    // Aseguramos valor inicial
    let current = root.dataset.theme || 'dark';

    try {
      const saved = localStorage.getItem(KEY);
      if (saved === Themes.Dark || saved === Themes.Light) current = saved;
    } catch (e) {
      console.warn('[theme-toggle] localStorage no disponible', e);
    }

    const setUI = () => {
      root.dataset.theme = current;
      button.setAttribute('aria-label', `Cambiar a modo ${ModeLabel[current]}`);
      console.info(`[theme-toggle] theme aplicado -> ${current}`);
    };

    const toggle = () => {
      current = (current === Themes.Dark) ? Themes.Light : Themes.Dark;
      try { localStorage.setItem(KEY, current); } catch (e) { /* ignore */ }
      setUI();
    };

    // Inicializa UI
    setUI();

    // listener
    button.addEventListener('click', (e) => {
      e.preventDefault();
      toggle();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initToggler);
  } else {
    initToggler();
  }
})();

// BIND BIBLIOGRAFÍAS
(function bindBibToggles() {
  function init() {
    const buttons = Array.from(document.querySelectorAll('.bib-toggle'));
    buttons.forEach(btn => {
      // evitar duplicar listeners
      if (btn.dataset.bibBound) return;
      btn.dataset.bibBound = '1';

      btn.addEventListener('click', () => {
        const bib = btn.nextElementSibling;
        if (!bib || !bib.classList.contains('bibliography')) return;

        const isOpen = bib.classList.toggle('open');
        btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        bib.setAttribute('aria-hidden', isOpen ? 'false' : 'true');

        // animación: usar maxHeight para transición suave
        if (isOpen) {
          // forzamos repaint y luego aplicamos maxHeight en px
          bib.style.maxHeight = bib.scrollHeight + 'px';
        } else {
          // colapsar
          bib.style.maxHeight = null;
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
