/* --------------------------------------------------------------------------
   1. GLOBAL: NAVIGATION & COPY EMAIL
   -------------------------------------------------------------------------- */
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        navLinks.classList.toggle('active');
    }
}

function copyEmail(elementId) {
    const email = "klubmladychdiabetiku@gmail.com";
    const feedback = document.getElementById(elementId);
    
    if (!feedback) return; 

    navigator.clipboard.writeText(email).then(() => {
        feedback.classList.add("show");
        if (elementId === 'contact-msg' || elementId === 'copy-msg') {
            feedback.style.display = "inline";
        }
        setTimeout(() => {
            feedback.classList.remove("show");
            if (elementId === 'contact-msg' || elementId === 'copy-msg') {
                feedback.style.display = "none";
            }
        }, 2000);
    }).catch(err => {
        console.error('Chyba při kopírování: ', err);
    });
}

/* --------------------------------------------------------------------------
   3. O NÁS: CAROUSEL & LIGHTBOX
   -------------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", function() {
    const imgElement = document.getElementById('slideImg');
    
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
        
        window.showPhoto = function(index) {
            if (index < 0) currentIndex = galleryData.length - 1;
            else if (index >= galleryData.length) currentIndex = 0;
            else currentIndex = index;

            let finalSrc = galleryData[currentIndex].src;
            if (window.innerWidth <= 768) {
                finalSrc = finalSrc.replace('images/vedouci/', 'images/vedouci/mobile/');
            }

            imgElement.style.opacity = 0;
            setTimeout(() => {
                imgElement.src = finalSrc; 
                if(yearBadgeElement) yearBadgeElement.innerText = galleryData[currentIndex].year;
                imgElement.style.opacity = 1;
            }, 200);

            if (lightbox && lightbox.classList.contains('active')) {
                lbImg.src = finalSrc;
                lbYear.innerText = galleryData[currentIndex].year;
            }
        };

        window.changeSlide = function(direction) {
            window.showPhoto(currentIndex + direction);
        };

        let scrollPosition = 0;

        window.openLightbox = function() {
            if(!lightbox) return;
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
            document.body.classList.remove('no-scroll');
            document.body.style.top = '';
            window.scrollTo(0, scrollPosition);
        };

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
        if (galleryData.length > 0) window.showPhoto(0);
    }
});

/* --------------------------------------------------------------------------
   4. KONTAKT: FORM HANDLER
   -------------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        const formBox = document.getElementById('formular');
        const formContent = document.getElementById('form-content');
        const successMsg = document.getElementById('success-message');
        const submitBtn = document.getElementById('submitBtn');

        if (window.location.hash === '#formular') {
            setTimeout(() => highlightForm(false), 300);
        }

        window.highlightForm = function(shouldScroll = true) {
            if (formBox) {
                if (shouldScroll) {
                    formBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                formBox.classList.remove('highlight-pulse');
                
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        formBox.classList.add('highlight-pulse');
                    });
                });
            }
        };

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

        const isMobile = window.innerWidth <= 768;
        const bigFolderPath = isMobile ? `${folderPath}mobile/` : folderPath;

        for (let i = 1; i <= totalPhotos; i++) {
            const thumbSrc = `${folderPath}thumbs/foto (${i})${extension}`;
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
            img.onerror = function() { this.src = bigSrc; };

            div.appendChild(img);
            container.appendChild(div);
        }

        let scrollPosition = 0;

        window.openLightbox = function(index) {
            currentIndex = parseInt(index);
            if (isNaN(currentIndex)) currentIndex = 0;
            showImage();
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

        function preloadNext() {
            const nextIndex = (currentIndex + 1) % bigImageLinks.length;
            const nextImg = new Image();
            nextImg.src = bigImageLinks[nextIndex];
        }

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
    let isScrolling = false;
    window.addEventListener("scroll", function() {
        if (!isScrolling) {
            window.requestAnimationFrame(function() {
                if (window.scrollY > 300) {
                    scrollToTopBtn.classList.add("show-btn");
                } else {
                    scrollToTopBtn.classList.remove("show-btn");
                }
                isScrolling = false;
            });
            isScrolling = true;
        }
    }, { passive: true });

    scrollToTopBtn.addEventListener("click", function() {
        window.scrollTo({
            top: 0,
            behavior: "smooth" 
        });
    });
}

/* --- DROPDOWN NA MOBILU --- */
function toggleDropdown(event) {
    if (window.innerWidth <= 768) {
        event.preventDefault(); 
        const dropdown = document.getElementById("myDropdown");
        if (dropdown.style.display === "flex") {
            dropdown.style.display = "none";
        } else {
            dropdown.style.display = "flex";
        }
    }
}

// =========================================
// --- SPONZOR MODAL ---
// =========================================
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('galleryModal');
    if (!modal) return; 

    const sponsorImages = {
        'A.Import': ['images/sponzori/aimport.jpg', 'images/sponzori/aimport (1).jpg', 'images/sponzori/aimport (2).jpg', 'images/sponzori/aimport (3).jpg', 'images/sponzori/aimport (4).jpg', 'images/sponzori/aimport (5).jpg', 'images/sponzori/aimport (6).jpg', 'images/sponzori/aimport (7).jpg', 'images/sponzori/aimport (8).jpg'],
        'GLOBUS ČR - Opava': ['images/sponzori/globus.jpg', 'images/sponzori/globus (1).jpg', 'images/sponzori/globus (2).jpg', 'images/sponzori/globus (4).jpg', 'images/sponzori/globus (5).jpg', 'images/sponzori/globus (6).jpg'],
        'Lysek Petr Spedition s. r. o. - Kravaře': ['images/sponzori/lysek.jpg', 'images/sponzori/lysek (1).jpg', 'images/sponzori/lysek (2).jpg', 'images/sponzori/lysek (3).jpg', 'images/sponzori/lysek (4).jpg', 'images/sponzori/lysek (5).jpg', 'images/sponzori/lysek (6).jpg', 'images/sponzori/lysek (7).jpg', 'images/sponzori/lysek (8).jpg', 'images/sponzori/lysek (9).jpg', 'images/sponzori/lysek (10).jpg', 'images/sponzori/lysek (11).jpg', 'images/sponzori/lysek (12).jpg', 'images/sponzori/lysek (13).jpg', 'images/sponzori/lysek (14).jpg', 'images/sponzori/lysek (15).jpg'],
        'MTE': ['images/sponzori/mte.jpg', 'images/sponzori/mte (2).jpg', 'images/sponzori/mte (3).jpg', 'images/sponzori/mte (4).jpg', 'images/sponzori/mte (5).jpg', 'images/sponzori/mte (6).jpg', 'images/sponzori/mte (7).jpg', 'images/sponzori/mte (8).jpg', 'images/sponzori/mte (9).jpg', 'images/sponzori/mte (10).jpg', 'images/sponzori/mte (11).jpg'],
        'Ypsomed': ['images/sponzori/ypso.jpg', 'images/sponzori/ypso (2).jpg', 'images/sponzori/ypso (3).jpg', 'images/sponzori/ypso (4).jpg', 'images/sponzori/ypso (5).jpg', 'images/sponzori/ypso (6).jpg', 'images/sponzori/ypso (7).jpg', 'images/sponzori/ypso (8).jpg', 'images/sponzori/ypso (9).jpg'],
        'Abbott': [], 'Allianz': [], 'Medtronic': [], 'Kofola – ČeskoSlovensko a. s.': [], 'Ministerstvo zdravotnictví ČR': []
    };

    const modalImg = document.getElementById('modalImage');
    const captionText = document.getElementById('modalCaption');
    const closeBtn = modal.querySelector('.close-btn'); 
    const prevBtn = modal.querySelector('.lb-prev'); 
    const nextBtn = modal.querySelector('.lb-next'); 
    const tagPills = document.querySelectorAll('.tag-pill');

    let currentSponsor = '';
    let currentImageIndex = 0;
    let scrollPosition = 0;

    function showImage(sponsorName, index) {
        const images = sponsorImages[sponsorName];
        if (!images || images.length === 0) return; 

        if (index >= images.length) index = 0;
        if (index < 0) index = images.length - 1;

        currentImageIndex = index;
        let path = images[currentImageIndex];

        if (window.innerWidth <= 768) {
            path = path.replace('images/sponzori/', 'images/sponzori/mobile/');
            modalImg.loading = "eager";
        }

        modalImg.src = path;
        captionText.innerHTML = `${sponsorName} (${currentImageIndex + 1} / ${images.length})`;
    }

    function openModal(sponsorName) {
        if (!sponsorImages[sponsorName] || sponsorImages[sponsorName].length === 0) return; 
        
        scrollPosition = window.scrollY;
        currentSponsor = sponsorName;
        showImage(currentSponsor, 0); 
        modal.classList.add('active'); 
        
        document.body.style.top = `-${scrollPosition}px`;
        document.body.classList.add('no-scroll'); 
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.classList.remove('no-scroll');
        document.body.style.top = '';
        window.scrollTo(0, scrollPosition);
    }

    tagPills.forEach(pill => {
        const sponsorName = pill.textContent.trim();
        if (sponsorImages[sponsorName] && sponsorImages[sponsorName].length > 0) {
            pill.classList.add('has-gallery'); 
            pill.addEventListener('click', function(e) {
                e.preventDefault(); 
                openModal(sponsorName);
            });
        }
    });

    closeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        closeModal();
    });

    modal.addEventListener('click', function(e) {
        if (e.target === modal) closeModal();
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
        if (e.key === 'Escape') closeModal();
        else if (e.key === 'ArrowLeft') showImage(currentSponsor, currentImageIndex - 1);
        else if (e.key === 'ArrowRight') showImage(currentSponsor, currentImageIndex + 1);
    });
});

function toggleText(btn) {
    const moreText = btn.previousElementSibling;
    if (moreText.classList.contains("show")) {
        moreText.classList.remove("show");
        btn.innerHTML = "...číst více";
    } else {
        moreText.classList.add("show");
        btn.innerHTML = " skrýt text";
    }
}

let scrollPositionBio = 0;

function openBioModal(btn) {
    const card = btn.closest('.team-card'); 
    const modal = document.getElementById('bio-modal');
    
    document.getElementById('bio-modal-img').src = card.querySelector('.team-img').src;
    document.getElementById('bio-modal-name').innerHTML = card.querySelector('.team-name').innerHTML;
    document.getElementById('bio-modal-roles').innerHTML = card.querySelector('.team-role').innerHTML;
    document.getElementById('bio-modal-desc').innerHTML = card.querySelector('.team-full-bio').innerHTML;

    scrollPositionBio = window.scrollY; 
    document.body.style.position = 'fixed'; 
    document.body.style.top = `-${scrollPositionBio}px`; 
    document.body.style.width = '100%'; 

    modal.style.display = 'flex';
}

function closeBioModal(event) {
    if (!event || event.target.id === 'bio-modal' || event.target.classList.contains('close-bio')) {
        document.getElementById('bio-modal').style.display = 'none';
        
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        
        window.scrollTo(0, scrollPositionBio); 
    }
}

function copyEmailCustom(emailAddress, elementId) {
    const feedback = document.getElementById(elementId);
    if (!feedback) return;

    navigator.clipboard.writeText(emailAddress).then(() => {
        feedback.classList.add("show");
        feedback.style.display = "inline";

        setTimeout(() => {
            feedback.classList.remove("show");
            feedback.style.display = "none";
        }, 2000);
    }).catch(err => {
        console.error('Chyba při kopírování: ', err);
    });
}