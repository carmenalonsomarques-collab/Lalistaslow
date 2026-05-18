// app.js

// Estado simulado de los regalos (En un entorno real esto vendría de una base de datos)
let gifts = [
    {
        id: 1,
        title: "Vale de 200€",
        storeInfo: "Comprar en Tienda Ecológica",
        storeLink: "#",
        description: "Para llenar nuestra despensa de productos sostenibles, a granel y de proximidad.",
        image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80",
        reserved: false
    },
    {
        id: 2,
        title: "Vajilla de Cerámica",
        storeInfo: "Comprar en Cerámicas Ortiz",
        storeLink: "https://www.ceramicasortiz.com/",
        description: "Vajilla artesanal para vestir nuestra mesa de domingo durante muchos años.",
        image: "https://www.ceramicasortiz.com/wp-content/uploads/2024/05/ceramicas_ortiz_home_banner_platos.jpg",
        reserved: false
    },
    {
        id: 3,
        title: "Manta de Lana de Merino",
        storeInfo: "Comprar en Real Fábrica Española",
        storeLink: "https://realfabrica.com/",
        description: "Esa manta para toda la vida para las tardes de peli y sofá en invierno.",
        image: "./manta_merino.png",
        reserved: false
    },
    {
        id: 4,
        title: "Suscripción Flores 12 Meses",
        storeInfo: "Comprar en Materia Botánica",
        storeLink: "https://www.materiabotanica.es/",
        description: "Para tener flores frescas y silvestres en casa durante nuestro primer año casados.",
        image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=800&q=80",
        reserved: false
    },
    {
        id: 5,
        title: "Estancia en Sha Wellness",
        storeInfo: "Ver en Sha Wellness Marbella",
        storeLink: "https://shawellnessclinic.com/",
        description: "Un par de días en el Sha, sin móvil y sin agenda. El mejor regalo para después de la boda.",
        image: "./sha_wellness.png",
        reserved: false
    },
    {
        id: 6,
        title: "Comida en Molín de Mingo",
        storeInfo: "Reservar en El Molín de Mingo",
        storeLink: "https://elmolindemingo.es/",
        description: "Una experiencia gastronómica inolvidable en plena naturaleza asturiana.",
        image: "./molin_mingo.png",
        reserved: false
    },
    {
        id: 7,
        title: "Oura Ring",
        storeInfo: "Comprar en Oura",
        storeLink: "https://ouraring.com/",
        description: "El anillo que mide el sueño, la actividad y la recuperación. Sin pantalla, sin ruido.",
        image: "./oura_ring.png",
        reserved: false
    },
    {
        id: 8,
        title: "Cocotte Le Creuset",
        storeInfo: "Comprar en Le Creuset",
        storeLink: "https://www.lecreuset.es/",
        description: "Para los guisos lentos de domingo. Una pieza de hierro fundido para toda la vida.",
        image: "./cocotte.png",
        reserved: false
    },
    {
        id: 9,
        title: "Cuchillo Japonés Nakagawa",
        storeInfo: "Comprar en Cuchillería Simón",
        storeLink: "https://www.cuchilleriasimon.es/categoria-producto/cuchillos-y-tijeras-de-cocina/nakagawa-knives/",
        description: "Forjado a mano en Sakai. La precisión y la calma de la tradición japonesa en la cocina.",
        image: "./cuchillo_japones.png",
        reserved: false
    },
    {
        id: 10,
        title: "Mantelería de Lino Lavado",
        storeInfo: "Comprar en Society Limonta",
        storeLink: "https://www.societylimonta.com/",
        description: "Lino italiano lavado al stone. Para vestir la mesa de cualquier día como si fuera especial.",
        image: "./manteleria_lino.png",
        reserved: false
    },
    {
        id: 11,
        title: "Vela Cire Trudon",
        storeInfo: "Comprar en Cire Trudon",
        storeLink: "https://trudon.com/",
        description: "Cera vegetal y aromas de la perfumería más antigua de París. El tarro vacío también te lo quedas.",
        image: "./vela_trudon.png",
        reserved: false
    },
    {
        id: 12,
        title: "Set de Copas La Soufflerie",
        storeInfo: "Comprar en La Soufflerie",
        storeLink: "https://lasoufflerie.com/",
        description: "Sopladas a mano en París, vidrio reciclado. Ninguna igual a la otra.",
        image: "./copas_artesanas.png",
        reserved: false
    },
    {
        id: 13,
        title: "Lámpara Discóvolo de Marset",
        storeInfo: "Comprar en Marset",
        storeLink: "https://www.marset.com/",
        description: "Diseño de Marset. Una lámpara que aguanta el paso del tiempo sin que lo parezca.",
        image: "./lampara_marset.png",
        reserved: false
    },
    {
        id: 14,
        title: "Toallas de Lino Frette",
        storeInfo: "Comprar en Frette",
        storeLink: "https://www.frette.com/",
        description: "Lino italiano lavado al stone. Para que el baño de casa se parezca al de un buen hotel.",
        image: "./toallas_lino.png",
        reserved: false
    },
    {
        id: 15,
        title: "Tabla de Olivo Yevea",
        storeInfo: "Comprar en Yevea",
        storeLink: "https://yevea.com/madera-olivo-tablas-cortar.html",
        description: "Madera de olivo trabajada a mano en Andalucía. Una tabla que dura toda la vida.",
        image: "./tabla_olivo.png",
        reserved: false
    }
];

// Elementos del DOM
const giftsContainer = document.getElementById('gifts-container');
const modal = document.getElementById('reservation-modal');
const closeModalBtn = document.querySelector('.close-modal');
const form = document.getElementById('reservation-form');
const giftIdInput = document.getElementById('gift-id');

// Función para renderizar los regalos
function renderGifts() {
    giftsContainer.innerHTML = '';
    
    gifts.forEach(gift => {
        const card = document.createElement('div');
        card.className = `gift-card ${gift.reserved ? 'is-reserved' : ''}`;
        
        const badgeHTML = gift.reserved 
            ? `<div class="status-badge reserved">Comprado</div>`
            : `<div class="status-badge">Disponible</div>`;
            
        const buttonHTML = gift.reserved
            ? `<button class="btn btn-outline btn-block" disabled>Ya comprado</button>`
            : `<button class="btn btn-outline btn-block" onclick="openReservationModal(${gift.id})">Marcar como Comprado</button>`;

        card.innerHTML = `
            <div class="gift-image-wrap">
                ${badgeHTML}
                <img src="${gift.image}" alt="${gift.title}" class="gift-image" loading="lazy">
            </div>
            <div class="gift-content">
                <h3 class="gift-title">${gift.title}</h3>
                <a href="${gift.storeLink}" target="_blank" class="gift-link-btn" style="margin-bottom: 0.5rem;" onclick="event.stopPropagation()">${gift.storeInfo}</a>
                <p class="gift-desc" style="font-size: 0.9rem; margin-bottom: 1.5rem;">${gift.description}</p>
                <div style="margin-top: auto; padding-top: 10px;">
                    ${buttonHTML}
                </div>
            </div>
        `;
        
        giftsContainer.appendChild(card);
    });
}

// Funciones del Modal
function openReservationModal(id) {
    const gift = gifts.find(g => g.id === id);
    if (!gift) return;

    document.getElementById('modal-title').textContent = `Reservar: ${gift.title}`;
    giftIdInput.value = id;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevenir scroll trasero
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    form.reset();
}

// Event Listeners
closeModalBtn.addEventListener('click', closeModal);

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const id = parseInt(giftIdInput.value);
    
    // Actualizar el estado del regalo
    const giftIndex = gifts.findIndex(g => g.id === id);
    if (giftIndex !== -1) {
        gifts[giftIndex].reserved = true;
        
        // Simular un mini delay de "guardado"
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Guardando...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            renderGifts();
            closeModal();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 500);
    }
});

// Inicializar la vista
document.addEventListener('DOMContentLoaded', () => {
    renderGifts();

    // Scroll reveal
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});
