// Initialize Lucide Icons
lucide.createIcons();

// Header Scroll Effect
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// GSAP Animations
gsap.registerPlugin(ScrollTrigger);

// Legal Modal Logic
const legalContent = {
    aviso: {
        title: "Aviso Legal",
        content: `
            <h3>1. Información General</h3>
            <p>En cumplimiento con el artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y del Comercio Electrónico, se informa que ESTEBAN PLADUR es el titular de este sitio web.</p>
            <p>Domicilio Social: Madrid, España. Email: info@estebanpladur.com</p>
            <h3>2. Propiedad Intelectual</h3>
            <p>Todos los contenidos del sitio web (textos, imágenes, diseños, logotipos) son propiedad exclusiva de Esteban Pladur o de terceros que han autorizado su uso.</p>
            <h3>3. Responsabilidad</h3>
            <p>Esteban Pladur no se hace responsable de los daños y perjuicios de cualquier naturaleza que pudieran ocasionar, a título enunciativo: errores u omisiones en los contenidos, falta de disponibilidad del portal o la transmisión de virus o programas maliciosos.</p>
        `
    },
    privacidad: {
        title: "Política de Privacidad",
        content: `
            <h3>1. Protección de Datos</h3>
            <p>Esteban Pladur cumple con las directrices del Reglamento General de Protección de Datos (RGPD) y la normativa española vigente.</p>
            <h3>2. Uso de la Información</h3>
            <p>Los datos recogidos a través de los formularios de contacto se utilizarán exclusivamente para atender las solicitudes de los usuarios y proporcionar información sobre nuestros servicios.</p>
            <h3>3. Derechos del Usuario</h3>
            <p>Los usuarios pueden ejercer sus derechos de acceso, rectificación, cancelación y oposición enviando un correo electrónico a info@estebanpladur.com.</p>
        `
    },
    cookies: {
        title: "Política de Cookies",
        content: `
            <h3>1. ¿Qué son las cookies?</h3>
            <p>Una cookie es un fichero que se descarga en su ordenador al acceder a determinadas páginas web. Las cookies permiten a una página web almacenar y recuperar información sobre los hábitos de navegación de un usuario.</p>
            <h3>2. Tipos de cookies utilizadas</h3>
            <p>Este sitio utiliza cookies técnicas necesarias para el funcionamiento del sitio y cookies analíticas para mejorar la experiencia del usuario.</p>
            <h3>3. Gestión de cookies</h3>
            <p>Usted puede permitir, bloquear o eliminar las cookies instaladas en su equipo mediante la configuración de las opciones del navegador instalado en su ordenador.</p>
        `
    }
};

function openLegalModal(type) {
    const modal = document.getElementById('legal-modal');
    const title = document.getElementById('legal-modal-title');
    const content = document.getElementById('legal-modal-body');
    
    if (legalContent[type]) {
        title.innerHTML = legalContent[type].title;
        content.innerHTML = legalContent[type].content;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeLegalModal() {
    const modal = document.getElementById('legal-modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Reveal elements on scroll
const reveals = document.querySelectorAll('.reveal');
reveals.forEach((el) => {
    ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        onEnter: () => el.classList.add('active'),
        once: true
    });
});

// Event Listeners for Modals
document.addEventListener('DOMContentLoaded', () => {
    const modalClose = document.querySelector('.close-modal');
    const modalOverlay = document.querySelector('.legal-modal-overlay');

    if (modalClose) modalClose.addEventListener('click', closeLegalModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeLegalModal);

    // Global modal triggers
    document.body.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-legal]');
        if (trigger) {
            e.preventDefault();
            openLegalModal(trigger.getAttribute('data-legal'));
        }
    });
});

// Advanced Magnetic Buttons
const magneticBtns = document.querySelectorAll('.magnetic-btn');
magneticBtns.forEach(btn => {
    const inner = btn.querySelector('span');
    
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        // Move the button itself
        gsap.to(btn, {
            x: x * 0.3,
            y: y * 0.3,
            duration: 0.6,
            ease: "power2.out"
        });

        // Move the inner text (parallax)
        if (inner) {
            gsap.to(inner, {
                x: x * 0.1,
                y: y * 0.1,
                duration: 0.6,
                ease: "power2.out"
            });
        }
    });
    
    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 0.6,
            ease: "elastic.out(1, 0.3)"
        });

        if (inner) {
            gsap.to(inner, {
                x: 0,
                y: 0,
                duration: 0.6,
                ease: "elastic.out(1, 0.3)"
            });
        }
    });
});

// Parallax Hero Image
const heroImg = document.getElementById('hero-img');
if (heroImg) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        heroImg.style.transform = `translateY(${scrolled * 0.2}px) scale(1.1)`;
    });
}

// Background Orbs Parallax (Subtle)
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const premiumBg = document.querySelector('.bg-premium');
    if (premiumBg) {
        gsap.to(premiumBg, {
            y: scrolled * 0.1,
            duration: 0.5,
            ease: "none"
        });
    }
});

// Page Transitions
const links = document.querySelectorAll('nav a, footer a');
const transitionOverlay = document.getElementById('transition');

links.forEach(link => {
    link.addEventListener('click', (e) => {
        if (link.href.includes('#') || link.getAttribute('target')) return;
        if (link.hasAttribute('data-legal')) return; // Don't trigger transition for legal modals
        
        e.preventDefault();
        const destination = link.href;
        
        transitionOverlay.classList.add('active');
        
        setTimeout(() => {
            window.location.href = destination;
        }, 600);
    });
});

// Remove transition overlay on page load
window.addEventListener('load', () => {
    transitionOverlay.style.transformOrigin = 'top';
    transitionOverlay.style.transform = 'scaleY(0)';
});
// Contact Form Logic (Hybrid: Internal DB + Optional Formspree)
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const contactPopup = document.getElementById('contact-success-popup');
    
    if (contactForm && contactPopup) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerHTML;
            
            // Premium Loading State
            btn.disabled = true;
            btn.innerHTML = '<span><i data-lucide="loader-2" class="animate-spin inline-block mr-2"></i> ENVIANDO...</span>';
            if (window.lucide) lucide.createIcons();

            const name = document.getElementById('contact-name').value;
            const email = document.getElementById('contact-email').value;
            const message = document.getElementById('contact-message').value;

            try {
                // 1. Save to Internal Database (Always works)
                await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, message })
                });

                // 2. Optional: Send to Formspree for Email delivery
                // Si tienes un ID de Formspree, ponlo aquí:
                const FORMSPREE_ID = ""; // Deja vacío si no tienes uno todavía
                if (FORMSPREE_ID && FORMSPREE_ID !== "TU_ID_AQUÍ") {
                    await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
                        method: 'POST',
                        body: new FormData(contactForm),
                        headers: { 'Accept': 'application/json' }
                    });
                }

                // Show Success Popup (Always show if internal save worked)
                contactPopup.style.display = 'flex';
                const card = contactPopup.querySelector('.success-card');
                
                // Ensure popup text is correct
                const popupTitle = contactPopup.querySelector('h3');
                const popupText = contactPopup.querySelector('p');
                if (popupTitle) popupTitle.innerText = "¡Mensaje Recibido!";
                if (popupText) popupText.innerHTML = "Su solicitud ha sido guardada correctamente. <br><br> ¡Le contactaremos muy pronto!";

                gsap.to(card, { 
                    scale: 1, 
                    opacity: 1, 
                    duration: 0.8, 
                    ease: "elastic.out(1, 0.75)" 
                });

                contactForm.reset();

                // Auto-close after 2 seconds
                setTimeout(() => {
                    gsap.to(card, { 
                        scale: 0.8, 
                        opacity: 0, 
                        duration: 0.4, 
                        onComplete: () => {
                            contactPopup.style.display = 'none';
                        }
                    });
                }, 2000);

            } catch (error) {
                console.error("Error:", error);
                alert("Hubo un problema al procesar su solicitud. Inténtalo de nuevo.");
            } finally {
                btn.disabled = false;
                btn.innerHTML = originalText;
            }
        });

        // Close popup on click
        contactPopup.addEventListener('click', () => {
            const card = contactPopup.querySelector('.success-card');
            gsap.to(card, { 
                scale: 0.8, 
                opacity: 0, 
                duration: 0.4, 
                onComplete: () => {
                    contactPopup.style.display = 'none';
                }
            });
        });
    }
});
