document.addEventListener('DOMContentLoaded', function() {
    // Project data
    const projects = [
        {
            title: "Hotel de Denniso",
            description: "A hotel project designed using HTML, CSS, and JavaScript. This project showcases a hotel website with various features like booking rooms, viewing room descriptions, and a booking form. It also includes a responsive design for mobile users.",
            link: "https://github.com/Den0786"
        },
        {
            title: "SweetBites",
            description: "An awesome online food vendor project developed by Dennis Opoku Amponsah. This project showcases a restaurant website with various features like menu, booking, and contact form. It also includes a responsive design for mobile users.",
            link: "https://github.com/Den0786"
        },
        {
            title: "TinDog",
            description: "An awesome project that helps dog lovers to buy their preferred dogs of all types. This project showcases a website with various features like dog breeds, dog profiles, and a search functionality. It also enables dog owners to call for dog racing competitions.",
            link: "https://github.com/Den0786"
        },
        {
            title: "Agency",
            description: "A building agency project that allows landlords, landladies and construction units to find suitable builders and contractors. This project showcases a website with various features like job listings, job postings, and a job application form.",
            link: "https://github.com/Den0786"
        },
        {
            title: "Python Projects",
            description: "Projects like snake game, turtle racing game, calculator, coffee machine etc. Using Python as a programming language. They are all user friendly and can play as an individual or a group of two.",
            link: "https://github.com/Den0786"
        },
        {
            title: "JavaScript Projects",
            description: "Projects like calculator, stop watch, tic tac toe etc. Using JavaScript as a programming language. They are all user friendly and can play as an individual or a group of two.",
            link: "https://github.com/Den0786"
        },
        {
            title: "E - Justice Project",
            description: "A digital platform for e-justice, allowing people to report crimes, file complaints, and seek legal advice. This project showcases a website with various features like reporting, complaints, and legal advice.",
            link: "https://github.com/Den0786"
        }
    ];

    // Carousel elements
    const carouselContainer = document.getElementById('carouselContainer');
    const carouselDots = document.getElementById('carouselDots');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    let currentIndex = 0;

    // Initialize carousel
    function initCarousel() {
        // Create project cards
        projects.forEach((project, index) => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.innerHTML = `
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <a href="${project.link}" class="project-link" target="_blank">View Project</a>
            `;
            carouselContainer.appendChild(projectCard);

            // Create dots
            const dot = document.createElement('div');
            dot.className = 'dot';
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            carouselDots.appendChild(dot);
        });
    }

    // Update carousel position
    function updateCarousel() {
        carouselContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Update active dot
        document.querySelectorAll('.dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    // Go to specific slide
    function goToSlide(index) {
        currentIndex = index;
        updateCarousel();
    }

    // Next slide
    function nextSlide() {
        currentIndex = (currentIndex + 1) % projects.length;
        updateCarousel();
    }

    // Previous slide
    function prevSlide() {
        currentIndex = (currentIndex - 1 + projects.length) % projects.length;
        updateCarousel();
    }

    // Event listeners
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    // Initialize the carousel
    initCarousel();

    // Auto-rotate carousel (optional)
    let autoRotate = setInterval(nextSlide, 5000);

    // Pause auto-rotation on hover
    carouselContainer.addEventListener('mouseenter', () => {
        clearInterval(autoRotate);
    });

    carouselContainer.addEventListener('mouseleave', () => {
        autoRotate = setInterval(nextSlide, 5000);
    });
});