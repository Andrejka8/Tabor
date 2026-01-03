/* ==========================================================================
   js/script.js - GLOBAL SCRIPT
   ========================================================================== */

/* --------------------------------------------------------------------------
   1. GLOBAL: NAVIGATION & COPY EMAIL
   -------------------------------------------------------------------------- */

// Toggle Hamburger Menu
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        navLinks.classList.toggle('active');
    }
}

// Universal Copy Email Function
// Works for both Footer (popup) and Kontakt page (inline text)
function copyEmail(elementId) {
    const email = "klubmladychdiabetiku@gmail.com";
    const feedback = document.getElementById(elementId);
    
    if (!feedback) return; 

    navigator.clipboard.writeText(email).then(() => {
        // Show message
        feedback.classList.add("show"); // For Footer styling
        
        // Handle display type: Kontakt page uses 'inline', Footer uses 'block'/'flex'
        feedback.style.display = (elementId === 'copy-msg' || elementId === 'contact-msg') ? "inline" : "block";

        // Hide after 2 seconds
        setTimeout(() => {
            feedback.classList.remove("show");
            if (elementId === 'copy-msg' || elementId === 'contact-msg') {
                feedback.style.display = "none";
            }
        }, 2000);
        
    }).catch(err => {
        console.error('Chyba při kopírování: ', err);
    });
}


/* --------------------------------------------------------------------------
   2. HOMEPAGE: RANDOM HERO IMAGE
   -------------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", function() {
    const heroSection = document.querySelector('header.hero');
    
    if (heroSection) {
        const totalImages = 14; 
        const folder = 'images/';
        const extension = '.JPG'; // Case sensitive

        const randomNum = Math.floor(Math.random() * totalImages) + 1;
        const gradient = "linear-gradient(135deg, rgba(15, 125, 100, 0.9), rgba(43, 69, 112, 0.8))";
        const imageUrl = `${folder}${randomNum}${extension}`;

        const img = new Image();
        img.src = imageUrl;
        img.onload = function() {
            heroSection.style.background = `${gradient}, url('${imageUrl}')`;
            heroSection.style.backgroundSize = 'cover';
            heroSection.style.backgroundPosition = 'center';
        };
    }
});


/* --------------------------------------------------------------------------
   3. O NÁS: CAROUSEL & LIGHTBOX
   -------------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", function() {
    const imgElement = document.getElementById('slideImg');
    
    // Only run if we are on the 'O Nás' page
    if (imgElement) {
        const yearBadgeElement = document.getElementById('yearBadge');
        const lightbox = document.getElementById('lightbox');
        const lbImg = document.getElementById('lightbox-img');
        const lbYear = document.getElementById('lightbox-year');
        
        const galleryData = [
            { src: 'images/vedouci/2025.jpg', year: '2025' },
            { src: 'images/vedouci/2024.jpg', year: '2024' },
            { src: 'images/vedouci/2023.jpg', year: '2023' },
            { src: 'images/vedouci/2022.png', year: '2022' },
            { src: 'images/vedouci/2021.jpg', year: '2021' },
            { src: 'images/vedouci/2019.jpg', year: '2019' },
            { src: 'images/vedouci/2018.jpg', year: '2018' },
            { src: 'images/vedouci/2017.jpg', year: '2017' },
            { src: 'images/vedouci/2016.jpg', year: '2016' },
            { src: 'images/vedouci/2015.jpg', year: '2015' },
            { src: 'images/vedouci/2014.jpg', year: '2014' },
            { src: 'images/vedouci/2013.jpg', year: '2013' },
            { src: 'images/vedouci/2012.jpg', year: '2012' },
            { src: 'images/vedouci/2006.jpg', year: '2006' }
        ];

        let currentIndex = 0;
        
        // --- Functions ---
        
        // We attach these to 'window' so your HTML onclick="changeSlide()" works
        window.showPhoto = function(index) {
            if (index < 0) currentIndex = galleryData.length - 1;
            else if (index >= galleryData.length) currentIndex = 0;
            else currentIndex = index;

            // Update Main Carousel
            imgElement.style.opacity = 0;
            setTimeout(() => {
                imgElement.src = galleryData[currentIndex].src;
                if(yearBadgeElement) yearBadgeElement.innerText = galleryData[currentIndex].year;
                imgElement.style.opacity = 1;
            }, 200);

            // Update Lightbox if open
            if (lightbox && lightbox.classList.contains('active')) {
                lbImg.src = galleryData[currentIndex].src;
                lbYear.innerText = galleryData[currentIndex].year;
            }
        };

        window.changeSlide = function(direction) {
            window.showPhoto(currentIndex + direction);
        };

        window.openLightbox = function() {
            if(!lightbox) return;
            lightbox.classList.add('active');
            lbImg.src = galleryData[currentIndex].src;
            lbYear.innerText = galleryData[currentIndex].year;
            document.body.style.overflow = 'hidden';
        };

        window.closeLightbox = function() {
            if(!lightbox) return;
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        };

        // --- Event Listeners ---
        if (lightbox) {
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) window.closeLightbox();
            });

            document.addEventListener('keydown', (e) => {
                if (!lightbox.classList.contains('active')) return;
                if (e.key === 'ArrowLeft') window.changeSlide(-1);
                if (e.key === 'ArrowRight') window.changeSlide(1);
                if (e.key === 'Escape') window.closeLightbox();
            });
        }

        // Initialize first photo
        if (galleryData.length > 0) window.showPhoto(0);
    }
});


/* --------------------------------------------------------------------------
   4. KONTAKT: FORM HANDLER
   -------------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", function() {
    const contactForm = document.getElementById('contactForm');
    
    // Only run if we are on the 'Kontakt' page
    if (contactForm) {
        const formBox = document.getElementById('formular');
        const formContent = document.getElementById('form-content');
        const successMsg = document.getElementById('success-message');
        const submitBtn = document.getElementById('submitBtn');

        // Check URL hash for highlight (e.g. kontakt.html#formular)
        if (window.location.hash === '#formular') {
            setTimeout(() => highlightForm(false), 300);
        }

        // Highlight Function
        window.highlightForm = function(shouldScroll = true) {
            if (formBox) {
                if (shouldScroll) {
                    formBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                formBox.classList.remove('highlight-pulse');
                void formBox.offsetWidth; // Trigger reflow
                formBox.classList.add('highlight-pulse');
            }
        };

        // Web3Forms Submission
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); 
            
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = "Odesílám...";
            submitBtn.style.opacity = "0.7";

            const formData = new FormData(contactForm);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: json
            })
            .then(async (response) => {
                let json = await response.json();
                if (response.status == 200) {
                    formContent.style.display = 'none';
                    successMsg.style.display = 'flex';
                } else {
                    alert(json.message);
                    submitBtn.innerText = originalBtnText;
                    submitBtn.style.opacity = "1";
                }
            })
            .catch(error => {
                console.log(error);
                alert("Něco se pokazilo. Zkuste to prosím znovu.");
                submitBtn.innerText = originalBtnText;
                submitBtn.style.opacity = "1";
            });
        });
    }
});

/* --------------------------------------------------------------------------
   5. GALLERY SUBPAGES: INIT FUNCTION
   -------------------------------------------------------------------------- */
function initGalleryPage(totalPhotos, folderPath, extension = '.jpg') {
    document.addEventListener("DOMContentLoaded", function() {
        const container = document.getElementById('gallery-container');
        if (!container) return;

        let currentIndex = 0;
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const counter = document.getElementById('lb-counter');
        const downloadBtn = document.getElementById('lb-download');
        let bigImageLinks = [];

        // Generate Grid
        for (let i = 1; i <= totalPhotos; i++) {
            const thumbSrc = `${folderPath}thumbs/foto (${i})${extension}`;
            const bigSrc   = `${folderPath}foto (${i})${extension}`;
            bigImageLinks.push(bigSrc);

            const div = document.createElement('div');
            div.className = 'photo-item';
            const img = document.createElement('img');
            img.src = thumbSrc; 
            img.loading = 'lazy';
            img.alt = `Foto ${i}`;
            
            const imageIndex = i - 1;
            img.onclick = function() { openLightbox(imageIndex); };
            img.onerror = function() { this.src = bigSrc; };

            div.appendChild(img);
            container.appendChild(div);
        }

        // Functions
        window.openLightbox = function(index) {
            currentIndex = parseInt(index);
            if (isNaN(currentIndex)) currentIndex = 0;
            showImage();
            lightbox.style.display = 'flex';
            document.body.style.overflow = 'hidden'; 
        };

        window.closeLightbox = function() {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto'; 
        };

        window.changeSlide = function(direction) {
            currentIndex += direction;
            if (currentIndex >= bigImageLinks.length) currentIndex = 0;
            if (currentIndex < 0) currentIndex = bigImageLinks.length - 1;
            showImage();
        };

        function showImage() {
            if (bigImageLinks.length > 0) {
                const path = bigImageLinks[currentIndex];
                lightboxImg.src = path;
                counter.innerText = (currentIndex + 1) + " / " + bigImageLinks.length;
                if (downloadBtn) downloadBtn.href = path;
            }
        }

        // Listeners
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (lightbox.style.display === 'flex') {
                if (e.key === 'ArrowLeft') changeSlide(-1);
                if (e.key === 'ArrowRight') changeSlide(1);
                if (e.key === 'Escape') closeLightbox();
            }
        });
    });
}