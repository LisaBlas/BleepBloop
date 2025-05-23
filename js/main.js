// Main JavaScript for Portfolio

// Function to load projects
function loadProjects() {
    // Use the projects data from projects.js
    return projectsData.projects;
}

// Function to create project card HTML
function createProjectCard(project) {
    const featuredBadge = project.featured ? 
        `<div class="absolute top-0 right-0 p-2">
            <span class="inline-block bg-primary px-2 py-1 text-xs font-bold border-2 border-foreground">FEATURED</span>
        </div>` : '';
        
    const tags = project.tags.map(tag => 
        `<span class="px-2 py-1 text-xs font-bold bg-secondary border-2 border-foreground">${tag}</span>`
    ).join('');
    
    return `
    <div class="project-card bg-card text-foreground border-4 border-card shadow-brutal transform transition-all duration-300 hover:-translate-y-2 hover:shadow-none" data-category="${project.category}">
        <div class="relative overflow-hidden border-b-4 border-foreground">
            <img 
                src="${project.images[0]}" 
                alt="${project.title} project" 
                class="w-full h-48 object-cover transition-transform duration-500 hover:scale-105"
                loading="lazy" 
            />
            ${featuredBadge}
        </div>
        <div class="p-6">
            <h3 class="font-space font-bold text-xl mb-2">${project.title}</h3>
            <p class="mb-4">${project.description}</p>
            <div class="flex flex-wrap gap-2 mb-4">
                ${tags}
            </div>
            <a href="project-detail-${project.slug}.html" class="inline-block w-full text-center px-4 py-2 bg-foreground text-card font-space font-bold border-2 border-foreground hover:bg-primary transition-colors">
                VIEW PROJECT
            </a>
        </div>
    </div>
    `;
}

// Function to render projects
function renderProjects() {
    const projectsGrid = document.getElementById('projects-grid');
    if (!projectsGrid) return;
    
    const projects = loadProjects();
    if (projects.length === 0) return;
    
    // Clear existing content
    projectsGrid.innerHTML = '';
    
    // Add all projects to the grid
    projects.forEach(project => {
        projectsGrid.innerHTML += createProjectCard(project);
    });
    
    // Set up filtering after projects are loaded
    setupProjectFiltering();
    
    // Run animation on scroll after projects are loaded
    animateOnScroll();
}

// Function to set up project filtering
function setupProjectFiltering() {
    const filterButtons = document.querySelectorAll('.filter-button');
    const projectCards = document.querySelectorAll('.project-card');
    
    if (filterButtons.length > 0 && projectCards.length > 0) {
        // Make sure all projects are visible and have the slide-in class by default
        projectCards.forEach(card => {
            card.style.display = 'block';
            card.style.opacity = '1';
            card.classList.add('slide-in');
        });
        
        // Set up click handlers for filter buttons
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const category = this.getAttribute('data-category');
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Filter projects with animation
                projectCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');
                    
                    if (category === 'All' || cardCategory === category) {
                        // Show matching cards
                        card.style.display = 'block';
                        // Force opacity to 1 to ensure visibility
                        card.style.opacity = '1';
                        // Add animation class
                        card.classList.add('slide-in');
                    } else {
                        // Hide non-matching cards
                        card.classList.remove('slide-in');
                        card.style.opacity = '0';
                        // Hide the card after the animation completes
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Navbar shadow on scroll
    const navbar = document.getElementById('navbar');
    
    function handleScroll() {
        if (window.scrollY > 10) {
            navbar.classList.add('shadow-md');
        } else {
            navbar.classList.remove('shadow-md');
        }
    }
    
    window.addEventListener('scroll', handleScroll);
    
    // Animation on scroll
    function animateOnScroll() {
        const elements = document.querySelectorAll('.project-card, h2, h3');
        
        elements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight * 0.9) {
                el.classList.add('slide-in');
            }
        });
    }
    
    // Run on initial load
    animateOnScroll();
    
    // Add scroll event listener
    window.addEventListener('scroll', animateOnScroll);
    
    // Load and render projects from JSON
    renderProjects();
    
    // Project detail page image gallery
    const mainImage = document.getElementById('main-image');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const thumbnails = document.querySelectorAll('.thumbnail-button');
    
    if (mainImage && thumbnails.length > 0) {
        // Store all image paths
        const images = Array.from(thumbnails).map(thumb => 
            thumb.getAttribute('data-image')
        );
        
        let currentIndex = 0;
        
        // Update active thumbnail
        function updateActiveThumbnail() {
            thumbnails.forEach((thumb, index) => {
                if (index === currentIndex) {
                    thumb.classList.add('active');
                } else {
                    thumb.classList.remove('active');
                }
            });
        }
        
        // Next image
        function nextImage() {
            currentIndex = (currentIndex === images.length - 1) ? 0 : currentIndex + 1;
            mainImage.src = images[currentIndex];
            updateActiveThumbnail();
        }
        
        // Previous image
        function prevImage() {
            currentIndex = (currentIndex === 0) ? images.length - 1 : currentIndex - 1;
            mainImage.src = images[currentIndex];
            updateActiveThumbnail();
        }
        
        // Set up event listeners
        if (nextButton) {
            nextButton.addEventListener('click', nextImage);
        }
        
        if (prevButton) {
            prevButton.addEventListener('click', prevImage);
        }
        
        thumbnails.forEach((thumb, index) => {
            thumb.addEventListener('click', function() {
                currentIndex = index;
                mainImage.src = images[currentIndex];
                updateActiveThumbnail();
            });
        });
    }
    
    // Form submission handling
    const contactForm = document.getElementById('contact-form');
    const newsletterForm = document.getElementById('newsletter-form');
    const footerNewsletterForm = document.getElementById('footer-newsletter-form');
    
    function showToast(message) {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        
        // Add to DOM
        document.body.appendChild(toast);
        
        // Show toast
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        // Hide and remove toast
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }
    
    function handleFormSubmit(e, formName) {
        e.preventDefault();
        
        // In a real implementation, you would send the form data to a server
        // For this static version, we'll just show a success message
        
        // Reset form
        e.target.reset();
        
        // Show success message
        showToast(`${formName} submitted successfully!`);
    }
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => handleFormSubmit(e, 'Contact form'));
    }
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => handleFormSubmit(e, 'Newsletter subscription'));
    }
    
    if (footerNewsletterForm) {
        footerNewsletterForm.addEventListener('submit', (e) => handleFormSubmit(e, 'Newsletter subscription'));
    }
});
