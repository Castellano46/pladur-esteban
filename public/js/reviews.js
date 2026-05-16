const starContainer = document.getElementById('star-container');
const ratingInput = document.getElementById('review-rating');

// Star Input Logic (Event Delegation to handle Lucide SVG replacement)
starContainer.addEventListener('mouseenter', (e) => {
    const star = e.target.closest('[data-value]');
    if (!star) return;
    const val = parseInt(star.getAttribute('data-value'));
    highlightStars(val, true);
}, true);

starContainer.addEventListener('mouseleave', () => {
    highlightStars(ratingInput.value, false);
}, true);

starContainer.addEventListener('click', (e) => {
    const star = e.target.closest('[data-value]');
    if (!star) return;
    
    const val = star.getAttribute('data-value');
    ratingInput.value = val;
    updateStars(val);
    
    // GSAP feedback on click
    gsap.to(star, { scale: 1.5, duration: 0.2, yoyo: true, repeat: 1 });
});

// Initial set
updateStars(5);

function highlightStars(val, isHover) {
    const stars = starContainer.querySelectorAll('[data-value]');
    stars.forEach(s => {
        const sVal = parseInt(s.getAttribute('data-value'));
        if (sVal <= val) {
            s.classList.add(isHover ? 'text-accent/50' : 'text-accent');
            if (!isHover) s.classList.add('fill-accent');
        } else {
            s.classList.remove('text-accent', 'fill-accent', 'text-accent/50');
        }
    });
}

function updateStars(val) {
    const numericVal = parseInt(val);
    const stars = starContainer.querySelectorAll('[data-value]');
    stars.forEach(s => {
        const sVal = parseInt(s.getAttribute('data-value'));
        if (sVal <= numericVal) {
            s.classList.add('fill-accent', 'text-accent', 'active');
        } else {
            s.classList.remove('fill-accent', 'text-accent', 'active');
        }
    });
}

// Rating Logic
function updateGlobalRating(reviews) {
    if (!reviews || reviews.length === 0) return;
    
    const total = reviews.length;
    const sum = reviews.reduce((acc, r) => acc + (parseInt(r.rating) || 5), 0);
    const avg = (sum / total).toFixed(1);
    
    const avgDisplay = document.getElementById('avg-rating');
    const countDisplay = document.getElementById('total-reviews-count');
    const mainStars = document.getElementById('main-stars-display');

    if (avgDisplay) avgDisplay.innerText = `${avg}/5.0`;
    if (countDisplay) countDisplay.innerText = `— Basado en ${total} obras`;
    
    if (mainStars) {
        const stars = mainStars.querySelectorAll('i, svg');
        const roundedAvg = Math.round(parseFloat(avg));
        stars.forEach((star, i) => {
            if (i < roundedAvg) {
                star.classList.add('fill-current', 'text-accent');
                star.style.opacity = '1';
            } else {
                star.classList.remove('fill-current', 'text-accent');
                star.style.opacity = '0.3';
            }
        });
    }
}

// Success Popup Logic
function showSuccessPopup() {
    const popup = document.getElementById('review-success-popup');
    popup.style.display = 'flex';
    
    const card = popup.querySelector('.success-card');
    
    gsap.set(card, { scale: 0.5, opacity: 0, rotateX: -45 });
    
    gsap.to(card, { 
        scale: 1, 
        opacity: 1, 
        rotateX: 0,
        duration: 0.8, 
        ease: "elastic.out(1, 0.75)"
    });

    // Close on click anywhere
    const closeHandler = () => {
        gsap.to(card, { 
            scale: 0.8, 
            opacity: 0, 
            duration: 0.4, 
            ease: "power2.in",
            onComplete: () => {
                popup.style.display = 'none';
            }
        });
        popup.removeEventListener('click', closeHandler);
    };
    popup.addEventListener('click', closeHandler);

    setTimeout(closeHandler, 3000);
}

// Load Reviews
const reviewsContainer = document.getElementById('reviews-container');

async function loadReviews() {
    try {
        const response = await fetch('/api/reviews');
        const reviews = await response.json();
        
        updateGlobalRating(reviews);
        
        if (!reviewsContainer) return;
        reviewsContainer.innerHTML = '';
        
        if (reviews.length === 0) return;

        reviews.reverse().forEach((review, index) => {
            const card = document.createElement('div');
            card.className = 'review-card active'; // Add active immediately for visibility
            card.style.transitionDelay = `${(index + 1) * 0.1}s`;
            
            let starsHtml = '';
            for (let i = 1; i <= 5; i++) {
                const isActive = i <= parseInt(review.rating);
                starsHtml += `<i data-lucide="star" class="w-4 h-4 ${isActive ? 'fill-current text-accent' : 'text-text-muted'}"></i>`;
            }

            card.innerHTML = `
                <div class="flex justify-between items-start mb-6">
                    <div class="flex space-x-1">${starsHtml}</div>
                    <span class="text-[10px] uppercase tracking-widest text-text-muted font-bold">${review.date}</span>
                </div>
                <p class="text-lg leading-relaxed mb-8 italic">"${review.comment}"</p>
                <div class="flex items-center space-x-4">
                    <div class="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center border border-accent/20">
                        <span class="text-accent font-bold text-xs">${review.name.charAt(0)}</span>
                    </div>
                    <div>
                        <h4 class="font-bold text-sm">${review.name}</h4>
                        <p class="text-[10px] uppercase tracking-widest text-accent">Cliente Verificado</p>
                    </div>
                </div>
            `;
            reviewsContainer.appendChild(card);
        });
        
        if (window.lucide) lucide.createIcons();
    } catch (error) {
        console.error('Error loading reviews:', error);
    }
}

// Submit Review
const reviewForm = document.getElementById('review-form');
reviewForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = reviewForm.querySelector('.btn-publish');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span><i data-lucide="loader-2" class="animate-spin inline-block mr-2"></i> ENVIANDO...</span>';
    lucide.createIcons();
    
    const name = document.getElementById('review-name').value;
    const rating = ratingInput.value;
    const comment = document.getElementById('review-comment').value;
    
    console.log('Attempting to submit review:', { name, rating, comment });
    
    try {
        const response = await fetch('/api/reviews', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, rating, comment })
        });
        
        if (response.ok) {
            reviewForm.reset();
            updateStars(5);
            showSuccessPopup();
            loadReviews();
        } else {
            const errorText = await response.text();
            alert('Error al enviar la reseña: ' + errorText);
        }
    } catch (error) {
        console.error('Network error:', error);
        alert('Error de red: ' + error.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
});

// Initial load
updateStars(5);
loadReviews();
