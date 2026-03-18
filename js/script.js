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
        // 1. Show the message (Adds CSS class)
        feedback.classList.add("show");
        
        // 2. Special handling ONLY for Contact Page (Inline text)
        // We do NOT touch the display style for the Footer (footer-msg), 
        // we let the CSS class handle it.
        if (elementId === 'contact-msg' || elementId === 'copy-msg') {
            feedback.style.display = "inline";
        }

        // 3. Hide after 2 seconds
        setTimeout(() => {
            feedback.classList.remove("show");
            
            // Hide the Contact Page text again
            if (elementId === 'contact-msg' || elementId === 'copy-msg') {
                feedback.style.display = "none";
            }
        }, 2000);
        
    }).catch(err => {
        console.error('Chyba při kopírování: ', err);
    });
}


/* --------------------------------------------------------------------------
   2. HOMEPAGE: RANDOM HERO IMAGE (Mobile Optimized)
   -------------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", function() {
    const heroSection = document.querySelector('header.hero');
    
    if (heroSection) {
        const totalImages = 7; 
        const extension = '.jpg';
        
        // Základní složka pro PC
        let folder = 'images/hero/';

        // Pokud je to mobil, přepneme na složku /mobile/
        if (window.innerWidth <= 768) {
            folder = 'images/hero/mobile/';
        }

        // Vygenerujeme náhodné číslo
        const randomNum = Math.floor(Math.random() * totalImages) + 1;
        
        // Složíme finální URL
        const imageUrl = `${folder}${randomNum}${extension}`;
        
        // Definujeme gradient
        const gradient = "linear-gradient(135deg, rgba(43, 69, 112, 0.95), rgba(43, 69, 112, 0.4))";

        // Aplikujeme styly
        heroSection.style.backgroundImage = `${gradient}, url('${imageUrl}')`;
        heroSection.style.backgroundSize = 'cover';
        heroSection.style.backgroundPosition = 'center';
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
            { src: 'images/vedouci/2022.jpg', year: '2022' },
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

            let finalSrc = galleryData[currentIndex].src;
    
            // Pokud je obrazovka užší než 768px, vložíme do cesty složku /mobile/
            if (window.innerWidth <= 768) {
                finalSrc = finalSrc.replace('images/vedouci/', 'images/vedouci/mobile/');
            }

            // Update Main Carousel
            imgElement.style.opacity = 0;
            setTimeout(() => {
                imgElement.src = finalSrc; // Načte buď velkou, nebo malou verzi
                if(yearBadgeElement) yearBadgeElement.innerText = galleryData[currentIndex].year;
                imgElement.style.opacity = 1;
            }, 200);

            // To samé pro Lightbox
            if (lightbox && lightbox.classList.contains('active')) {
                lbImg.src = finalSrc;
                lbYear.innerText = galleryData[currentIndex].year;
            }
        };

        window.changeSlide = function(direction) {
            window.showPhoto(currentIndex + direction);
        };

       // Přidáme proměnnou pro pozici
        let scrollPosition = 0;

        window.openLightbox = function() {
            if(!lightbox) return;

            // Zapamatovat si pozici a zafixovat stránku
            scrollPosition = window.scrollY;
            document.body.style.top = `-${scrollPosition}px`;
            document.body.classList.add('no-scroll');

            lightbox.classList.add('active');
            lbImg.src = galleryData[currentIndex].src;
            lbYear.innerText = galleryData[currentIndex].year;
        };

        window.closeLightbox = function() {
            if(!lightbox) return;
            lightbox.classList.remove('active');

            // Odemknout stránku
            document.body.classList.remove('no-scroll');
            document.body.style.top = '';

            // Vrátit se na původní místo
            window.scrollTo(0, scrollPosition);
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
   5. GALLERY SUBPAGES: INIT FUNCTION (Mobile Optimized + Preloading)
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

        // 1. Zjistíme, jestli jsme na mobilu
        const isMobile = window.innerWidth <= 768;
        // Pokud je to mobil, vložíme do cesty "mobile/"
        const bigFolderPath = isMobile ? `${folderPath}mobile/` : folderPath;

        // Generate Grid
        for (let i = 1; i <= totalPhotos; i++) {
            const thumbSrc = `${folderPath}thumbs/foto (${i})${extension}`;
            // Použije buď cestu do originálu, nebo do složky mobile/
            const bigSrc   = `${bigFolderPath}foto (${i})${extension}`;
            bigImageLinks.push(bigSrc);

            const div = document.createElement('div');
            div.className = 'photo-item';
            const img = document.createElement('img');
            img.src = thumbSrc; 
            img.loading = 'lazy';
            img.alt = `Foto ${i}`;
            
            const imageIndex = i - 1;
            img.onclick = function() { openLightbox(imageIndex); };
            
            // Pokud by náhodou mobilní fotka chyběla, zkusí načíst originál
            img.onerror = function() { this.src = bigSrc; };

            div.appendChild(img);
            container.appendChild(div);
        }

        let scrollPosition = 0;

        window.openLightbox = function(index) {
            currentIndex = parseInt(index);
            if (isNaN(currentIndex)) currentIndex = 0;
            showImage();
            
            // PRELOAD: Načteme hned i následující fotku
            preloadNext();

            scrollPosition = window.scrollY;
            document.body.style.top = `-${scrollPosition}px`;
            document.body.classList.add('no-scroll');
            lightbox.style.display = 'flex';
        };

        window.closeLightbox = function() {
            lightbox.style.display = 'none';
            document.body.classList.remove('no-scroll');
            document.body.style.top = '';
            window.scrollTo(0, scrollPosition);
        };

        window.changeSlide = function(direction) {
            currentIndex += direction;
            if (currentIndex >= bigImageLinks.length) currentIndex = 0;
            if (currentIndex < 0) currentIndex = bigImageLinks.length - 1;
            showImage();
            
            // PRELOAD: Po změně slidu připravíme další v pořadí
            preloadNext();
        };

        function showImage() {
            if (bigImageLinks.length > 0) {
                const path = bigImageLinks[currentIndex];
                lightboxImg.src = path;
                counter.innerText = (currentIndex + 1) + " / " + bigImageLinks.length;
                if (downloadBtn) downloadBtn.href = path;
            }
        }

        // POMOCNÁ FUNKCE: Načte další fotku "do zásoby"
        function preloadNext() {
            const nextIndex = (currentIndex + 1) % bigImageLinks.length;
            const nextImg = new Image();
            nextImg.src = bigImageLinks[nextIndex];
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
/* =========================================
   SCROLL TO TOP FUNCTIONALITY
   ========================================= */
const scrollToTopBtn = document.getElementById("scrollToTopBtn");

if (scrollToTopBtn) {
    // 1. Show/Hide button on scroll
    window.addEventListener("scroll", function() {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add("show-btn");
        } else {
            scrollToTopBtn.classList.remove("show-btn");
        }
    });

    // 2. Scroll to top when clicked
    scrollToTopBtn.addEventListener("click", function() {
        window.scrollTo({
            top: 0,
            behavior: "smooth" 
        });
    });
}

/* --- NOVÁ FUNKCE PRO DROPDOWN NA MOBILU --- */
function toggleDropdown(event) {
    // Pouze pokud jsme na mobilu (šířka okna menší než 768px)
    if (window.innerWidth <= 768) {
        event.preventDefault(); // Zabrání prokliku, aby se jen otevřelo menu
        const dropdown = document.getElementById("myDropdown");
        
        if (dropdown.style.display === "flex") {
            dropdown.style.display = "none";
        } else {
            dropdown.style.display = "flex";
        }
    }
}

// =========================================
// --- JAVASCRIPT PRO GALERII SPONZORŮ ---
// =========================================

document.addEventListener('DOMContentLoaded', function() {
    
    // 1. ZÍSKÁNÍ REFERENCE NA MODAL (Musí být jako první)
    const modal = document.getElementById('galleryModal');
    
    // OCHRANA: Pokud nejsme na stránce sponzorů (modal tam není), zbytek kódu se vůbec nespustí!
    if (!modal) return; 

    // 2. DEFINICE DATABÁZE OBRÁZKŮ
    const sponsorImages = {
        'A.Import': [
            'images/sponzori/aimport.JPG',
            'images/sponzori/aimport (1).JPG',
            'images/sponzori/aimport (2).JPG',
            'images/sponzori/aimport (3).JPG',
            'images/sponzori/aimport (4).JPG',
            'images/sponzori/aimport (5).JPG',
            'images/sponzori/aimport (6).JPG',
            'images/sponzori/aimport (7).JPG',
            'images/sponzori/aimport (8).JPG'
        ],
        'GLOBUS ČR - Opava': [
            'images/sponzori/globus.JPG',
            'images/sponzori/globus (1).JPG',
            'images/sponzori/globus (2).JPG',
            'images/sponzori/globus (4).JPG',
            'images/sponzori/globus (5).JPG',
            'images/sponzori/globus (6).JPG'
        ],
        'Lysek Petr Spedition s. r. o. - Kravaře': [
            'images/sponzori/lysek.JPG',
            'images/sponzori/lysek (1).JPG',
            'images/sponzori/lysek (2).JPG',
            'images/sponzori/lysek (3).JPG',
            'images/sponzori/lysek (4).JPG',
            'images/sponzori/lysek (5).JPG',
            'images/sponzori/lysek (6).JPG',
            'images/sponzori/lysek (7).JPG',
            'images/sponzori/lysek (8).JPG',
            'images/sponzori/lysek (9).JPG',
            'images/sponzori/lysek (10).JPG',
            'images/sponzori/lysek (11).JPG',
            'images/sponzori/lysek (12).JPG',
            'images/sponzori/lysek (13).JPG',
            'images/sponzori/lysek (14).JPG',
            'images/sponzori/lysek (15).JPG'
        ],
        'MTE': [
            'images/sponzori/mte.JPG',
            'images/sponzori/mte (2).JPG',
            'images/sponzori/mte (3).JPG',
            'images/sponzori/mte (4).JPG',
            'images/sponzori/mte (5).jpg',
            'images/sponzori/mte (6).jpg',
            'images/sponzori/mte (7).jpg',
            'images/sponzori/mte (8).JPG',
            'images/sponzori/mte (9).jpg',
            'images/sponzori/mte (10).jpg',
            'images/sponzori/mte (11).JPG'
        ],
        'Ypsomed': [
            'images/sponzori/ypso.JPG',
            'images/sponzori/ypso (2).JPG',
            'images/sponzori/ypso (3).JPG',
            'images/sponzori/ypso (4).JPG',
            'images/sponzori/ypso (5).jpg',
            'images/sponzori/ypso (6).jpg',
            'images/sponzori/ypso (7).JPG',
            'images/sponzori/ypso (8).JPG',
            'images/sponzori/ypso (9).jpg'
        ],
        'Abbott': [],
        'Allianz': [],
        'Medtronic': [],
        'Kofola – ČeskoSlovensko a. s.': [],
        'Ministerstvo zdravotnictví ČR': []
    };

    // 3. ZÍSKÁNÍ REFERENCE NA OSTATNÍ PRVKY 
    // (Hledáme je přes "modal.querySelector", abychom se nepohádali s o-nas.html)
    const modalImg = document.getElementById('modalImage');
    const captionText = document.getElementById('modalCaption');
    const closeBtn = modal.querySelector('.close-btn'); 
    const prevBtn = modal.querySelector('.lb-prev'); 
    const nextBtn = modal.querySelector('.lb-next'); 
    const tagPills = document.querySelectorAll('.tag-pill');

    let currentSponsor = '';
    let currentImageIndex = 0;

   // 4. FUNKCE PRO ZOBRAZENÍ OBRÁZKU
    function showImage(sponsorName, index) {
        const images = sponsorImages[sponsorName];
        if (!images || images.length === 0) return; 

        if (index >= images.length) index = 0;
        if (index < 0) index = images.length - 1;

        currentImageIndex = index;
        let path = images[currentImageIndex];

        // Pokud je to mobil, změníme cestu na verzi v podsložce mobile
        if (window.innerWidth <= 768) {
            path = path.replace('images/sponzori/', 'images/sponzori/mobile/');
            modalImg.loading = "eager";
        }

        modalImg.src = path;
        
       captionText.innerHTML = `${sponsorName} (${currentImageIndex + 1} / ${images.length})`;
    }

   // 5. FUNKCE PRO OTEVŘENÍ
   // Proměnná, která si zapamatuje poslední pozici
    let scrollPosition = 0;

    // 5. FUNKCE PRO OTEVŘENÍ
    function openModal(sponsorName) {
        if (!sponsorImages[sponsorName] || sponsorImages[sponsorName].length === 0) {
            return; 
        }
        
        // ZAPAMATUJEME SI, KDE NA STRÁNCE JSME
        scrollPosition = window.scrollY;

        currentSponsor = sponsorName;
        showImage(currentSponsor, 0); 
        modal.classList.add('active'); 
        
        // ZAMKNEME STRÁNKU PŘESNĚ NA TÉTO POZICI
        document.body.style.top = `-${scrollPosition}px`;
        document.body.classList.add('no-scroll'); 
    }

    // 6. FUNKCE PRO ZAVŘENÍ
    function closeModal() {
        modal.classList.remove('active');
        
        // ODEMKNEME STRÁNKU
        document.body.classList.remove('no-scroll');
        document.body.style.top = '';
        
        // VRÁTÍME TĚ PŘESNĚ TAM, KDE JSI BYLA
        window.scrollTo(0, scrollPosition);
    }

    // 7. EVENT LISTENERY
    tagPills.forEach(pill => {
        const sponsorName = pill.textContent.trim();
        if (sponsorImages[sponsorName] && sponsorImages[sponsorName].length > 0) {
            pill.classList.add('has-gallery'); 
            
            // ZMĚNA ZDE: Přidali jsme 'e' do závorky a preventDefault
            pill.addEventListener('click', function(e) {
                e.preventDefault(); // Zabrání prohlížeči uskočit nahoru!
                openModal(sponsorName);
            });
        }
    });

    closeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        closeModal();
    });

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    prevBtn.addEventListener('click', function(e) {
        e.stopPropagation(); 
        showImage(currentSponsor, currentImageIndex - 1);
    });

    nextBtn.addEventListener('click', function(e) {
        e.stopPropagation(); 
        showImage(currentSponsor, currentImageIndex + 1);
    });

    document.addEventListener('keydown', function(e) {
        if (!modal.classList.contains('active')) return; 

        if (e.key === 'Escape') {
            closeModal();
        } else if (e.key === 'ArrowLeft') {
            showImage(currentSponsor, currentImageIndex - 1);
        } else if (e.key === 'ArrowRight') {
            showImage(currentSponsor, currentImageIndex + 1);
        }
    });
});

function toggleText(btn) {
    // Najde ten skrytý text, který je přesně před tlačítkem
    const moreText = btn.previousElementSibling;

    if (moreText.classList.contains("show")) {
        // Pokud je text už zobrazený, tak ho schováme
        moreText.classList.remove("show");
        btn.innerHTML = "...číst více";
    } else {
        // Pokud je schovaný, tak ho ukážeme
        moreText.classList.add("show");
        btn.innerHTML = " skrýt text";
    }
}


let scrollPosition = 0;

function openBioModal(btn) {
    const card = btn.closest('.team-card'); 
    
    const modal = document.getElementById('bio-modal');
    const modalImg = document.getElementById('bio-modal-img');
    const modalName = document.getElementById('bio-modal-name');
    const modalRoles = document.getElementById('bio-modal-roles');
    const modalDesc = document.getElementById('bio-modal-desc');

    modalImg.src = card.querySelector('.team-img').src;
    modalName.innerHTML = card.querySelector('.team-name').innerHTML;
    modalRoles.innerHTML = card.querySelector('.team-role').innerHTML;
    modalDesc.innerHTML = card.querySelector('.team-full-bio').innerHTML;

    // --- MAGIE PROTI SKÁKÁNÍ NAHORU ---
    scrollPosition = window.scrollY; // Zapamatujeme si aktuální pozici posuvníku
    document.body.style.position = 'fixed'; // Zafixujeme stránku
    document.body.style.top = `-${scrollPosition}px`; // Falešně ji posuneme tak, ať to vypadá, že jsme neuhli
    document.body.style.width = '100%'; // Zabráníme smrsknutí stránky

    // Zobrazíme okno
    modal.style.display = 'flex';
}

function closeBioModal(event) {
    if (!event || event.target.id === 'bio-modal' || event.target.classList.contains('close-bio')) {
        document.getElementById('bio-modal').style.display = 'none';
        
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        
        // Vrátíme uživatele přesně na pixel tam, kde předtím kliknul
        window.scrollTo(0, scrollPosition); 
    }
}