class BlogFeed {
    constructor() {
        this.allPosts = [
            {
                title: "The Novelist's Morning",
                date: "March 15, 2024",
                preview: "A chance encounter with an elderly writer who spent thirty years crafting her masterpiece, and why she wouldn't change a thing.",
                link: "#",
                readTime: "5 min read"
            },
            {
                title: "The Young Chef",
                date: "March 10, 2024",
                preview: "He was wearing his kitchen uniform, exhausted but beaming. 'I just served my first full service as head chef,' he told me, ordering a double espresso.",
                link: "#",
                readTime: "4 min read"
            },
            {
                title: "The Teacher's Revelation",
                date: "March 5, 2024",
                preview: "She was grading papers at her usual corner table when one of her former students walked in. What happened next brought tears to both their eyes.",
                link: "#",
                readTime: "6 min read"
            },
            {
                title: "The Marathon Runner",
                date: "March 1, 2024",
                preview: "Every morning at 5 AM, she orders the same thing: black coffee, no sugar. Today she ordered a pastry too. 'I finally qualified for Boston,' she said.",
                link: "#",
                readTime: "5 min read"
            },
            {
                title: "The Proud Father",
                date: "February 28, 2024",
                preview: "He was showing everyone a picture on his phone: his daughter's first art exhibition. 'She never gave up,' he said, 'even when I suggested maybe she should.'",
                link: "#",
                readTime: "7 min read"
            },
            {
                title: "The Night Shift",
                date: "February 25, 2024",
                preview: "3 AM conversations with a nurse who just finished her residency. 'It took me ten years,' she said, 'but I finally did it.'",
                link: "#",
                readTime: "6 min read"
            },
            {
                title: "The Quiet Musician",
                date: "February 20, 2024",
                preview: "He always sits by the window with his laptop, composing. Today he closed it and smiled. 'The symphony just accepted my piece.'",
                link: "#",
                readTime: "5 min read"
            },
            {
                title: "The Last Customer",
                date: "February 15, 2024",
                preview: "Just before closing, an elderly man came in to celebrate alone. 'Fifty years sober today,' he said softly, ordering his chamomile tea.",
                link: "#",
                readTime: "8 min read"
            }
        ];
        this.postsContainer = document.getElementById('posts');
        this.searchInput = document.getElementById('searchInput');
        this.currentIndex = 0;
        this.activePost = null;
        
        this.setupArrowNavigation();
        this.setupEventListeners();
        this.displayPosts();
        
        // Add resize handler
        window.addEventListener('resize', () => {
            this.displayPosts();
        });
        
        // Add mouse tracking for header shapes
        this.setupHeaderInteractivity();
        
        this.setupScrollAnimations();
        this.setupSkillTags();
        
        // Add about me click handler
        const learnMoreBtn = document.querySelector('.sidebar-section a');
        if (learnMoreBtn) {
            learnMoreBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showAboutMe();
            });
        }
        
        createDigitalRain();
    }

    setupHeaderInteractivity() {
        const shapes = document.querySelectorAll('.shape');
        const header = document.querySelector('.header-shapes');

        if (header) {
            header.addEventListener('mousemove', (e) => {
                const { left, top, width, height } = header.getBoundingClientRect();
                const x = (e.clientX - left) / width;
                const y = (e.clientY - top) / height;

                shapes.forEach((shape, index) => {
                    const speed = (index + 1) * 20;
                    const moveX = (x - 0.5) * speed;
                    const moveY = (y - 0.5) * speed;
                    shape.style.transform = `translate(${moveX}px, ${moveY}px)`;
                });
            });

            header.addEventListener('mouseleave', () => {
                shapes.forEach(shape => {
                    shape.style.transform = 'translate(0, 0)';
                });
            });
        }
    }

    setupArrowNavigation() {
        const arrowsContainer = document.createElement('div');
        arrowsContainer.className = 'arrows-container';
        
        this.leftArrow = document.createElement('button');
        this.rightArrow = document.createElement('button');
        
        this.leftArrow.className = 'nav-arrow left-arrow';
        this.rightArrow.className = 'nav-arrow right-arrow';
        
        this.leftArrow.innerHTML = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>`;
        
        this.rightArrow.innerHTML = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>`;

        // Simple click handlers
        this.leftArrow.onclick = () => this.navigate('prev');
        this.rightArrow.onclick = () => this.navigate('next');

        arrowsContainer.appendChild(this.leftArrow);
        arrowsContainer.appendChild(this.rightArrow);
        this.postsContainer.parentElement.appendChild(arrowsContainer);

        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.navigate('prev');
            if (e.key === 'ArrowRight') this.navigate('next');
        });

        this.updateArrowVisibility();
    }

    navigate(direction) {
        if (direction === 'next' && this.currentIndex < this.allPosts.length - 1) {
            this.currentIndex++;
        } else if (direction === 'prev' && this.currentIndex > 0) {
            this.currentIndex--;
        }
        this.displayPosts();
        this.updateArrowVisibility();
    }

    updateArrowVisibility() {
        this.leftArrow.style.opacity = this.currentIndex === 0 ? '0.3' : '1';
        this.leftArrow.style.pointerEvents = this.currentIndex === 0 ? 'none' : 'auto';
        
        this.rightArrow.style.opacity = 
            this.currentIndex === this.allPosts.length - 1 ? '0.3' : '1';
        this.rightArrow.style.pointerEvents = 
            this.currentIndex === this.allPosts.length - 1 ? 'none' : 'auto';
    }

    displayPosts() {
        this.postsContainer.innerHTML = '';
        const postsWrapper = document.createElement('div');
        postsWrapper.className = 'flex gap-8 justify-start';
        
        // Calculate how many posts can fit in the viewport
        const postWidth = 350; // width of each post card
        const gap = 32; // gap between posts (8 * 4 = 32px)
        const containerWidth = this.postsContainer.clientWidth;
        const postsPerView = Math.floor(containerWidth / (postWidth + gap));
        
        // Get the range of posts to display
        const startIndex = Math.max(0, this.currentIndex - Math.floor(postsPerView / 2));
        const endIndex = Math.min(this.allPosts.length, startIndex + postsPerView);
        
        // Display the posts
        for (let i = startIndex; i < endIndex; i++) {
            const post = this.allPosts[i];
            const postElement = this.createPostElement(post);
            
            // Add classes for positioning and styling
            postElement.className = `post-card rounded-xl p-8 transition-all duration-300 ${
                i === this.currentIndex ? 'opacity-100 scale-100 z-10' : 'opacity-70 scale-95'
            }`;
            
            postsWrapper.appendChild(postElement);
        }
        
        this.postsContainer.appendChild(postsWrapper);
        this.updateArrowVisibility();
    }

    createPostElement(post) {
        const postElement = document.createElement('article');
        postElement.className = 'post-card rounded-xl p-8 cursor-pointer hover:transform hover:scale-105 transition-all duration-300';
        
        // Add click event to the entire card
        postElement.onclick = () => this.showFullPost(post);

        postElement.innerHTML = `
            <div class="flex flex-col h-full">
                <h2 class="text-3xl font-bold mb-4">
                    <span class="text-white hover:text-blue-600 transition-colors duration-300">
                        ${post.title}
                    </span>
                </h2>
                <div class="flex items-center mb-6">
                    <span class="flex items-center text-gray-400 text-sm">
                        <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
                        </svg>
                        ${post.date}
                    </span>
                    <span class="mx-3 text-gray-400">•</span>
                    <span class="text-gray-400 text-sm">${post.readTime}</span>
                </div>
                <p class="text-gray-300 post-preview mb-6 flex-grow leading-relaxed">
                    ${post.preview}
                </p>
                <div class="text-blue-400 hover:text-blue-300 group w-fit">
                    Read more
                    <svg class="w-4 h-4 ml-2 inline-block transform transition-transform group-hover:translate-x-1" 
                         fill="none" 
                         stroke="currentColor" 
                         viewBox="0 0 24 24">
                        <path stroke-linecap="round" 
                              stroke-linejoin="round" 
                              stroke-width="2" 
                              d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                    </svg>
                </div>
            </div>
        `;

        return postElement;
    }

    showFullPost(post) {
        let fullPostSection = document.getElementById('fullPost');
        if (!fullPostSection) {
            fullPostSection = document.createElement('section');
            fullPostSection.id = 'fullPost';
            fullPostSection.className = 'mt-16 glass-effect rounded-xl p-8';
            this.postsContainer.parentElement.appendChild(fullPostSection);
        }

        const fullContent = {
            "The Novelist's Morning": `
                <p class="text-gray-300 mb-6">
                    She comes in every morning at 7:15, orders an Earl Grey with a splash of milk, and sits at the corner table with her worn leather notebook. Today was different. Today she was glowing.
                </p>
                <p class="text-gray-300 mb-6">
                    "Thirty years," she told me, her hands wrapped around the warm cup. "I started writing this book when my daughter was born. She's thirty now, with her own family." Her eyes sparkled as she pulled out a hardcover book from her bag. "And now it's done. Actually done."
                </p>
                <p class="text-gray-300">
                    She left her usual five-dollar tip and a signed copy of her book. "For the cafe that kept me caffeinated and inspired for thirty years," the inscription read.
                </p>
            `,
            "The Young Chef": `
                <p class="text-gray-300 mb-6">
                    The bell chimed at 11:45 PM. He stumbled in wearing checkered pants and a white coat stained with various sauces. Despite the exhaustion in his eyes, his smile lit up the room.
                </p>
                <p class="text-gray-300 mb-6">
                    "Double espresso, please," he said, collapsing into a chair. "I just finished my first night as head chef." He pulled out his phone, showing me pictures of elaborately plated dishes. "Fifteen years of washing dishes, chopping vegetables, and burning myself. Tonight, I ran my own kitchen."
                </p>
                <p class="text-gray-300">
                    He stayed until closing, telling stories about the dinner service, his hands animatedly recreating each moment. As he left, he promised to bring us dinner from his kitchen someday.
                </p>
            `,
            "The Teacher's Revelation": `
                <p class="text-gray-300 mb-6">
                    Miss Thompson always graded papers at the corner table, red pen in one hand, coffee in the other. That Tuesday, one of her former students walked in - now a teacher himself.
                </p>
                <p class="text-gray-300 mb-6">
                    "You probably don't remember," he said, "but in tenth grade, you told me I had a gift for explaining things to others." He pulled out a chair. "That's why I became a teacher. I just won Teacher of the Year at my school."
                </p>
                <p class="text-gray-300">
                    They sat together for hours, two generations of educators sharing stories. When they finally left, her stack of papers remained ungraded, but her smile suggested it was worth it.
                </p>
            `,
            "The Marathon Runner": `
                <p class="text-gray-300 mb-6">
                    Every morning at 5 AM, she orders black coffee, no sugar. Rain or shine, summer or winter. Today, she ordered a chocolate croissant too. I raised an eyebrow - this was new.
                </p>
                <p class="text-gray-300 mb-6">
                    "I qualified for Boston," she said, breaking the croissant in half. "Three years of trying. My time was two minutes under the cutoff." Her hands shook slightly as she lifted her coffee cup.
                </p>
                <p class="text-gray-300">
                    The next morning, she was back to just black coffee. But now there's a Boston Marathon sticker on her water bottle, a constant reminder of that sweet victory.
                </p>
            `,
            "The Proud Father": `
                <p class="text-gray-300 mb-6">
                    He's a regular who usually keeps to himself, reading the newspaper in silence. Today, he was showing everyone a photo on his phone: a gallery wall with his daughter's name in elegant lettering.
                </p>
                <p class="text-gray-300 mb-6">
                    "I told her art wasn't practical," he admitted, voice thick with emotion. "Suggested accounting instead. But she never listened to me, thank God." He swiped through more photos of the exhibition.
                </p>
                <p class="text-gray-300">
                    Before leaving, he bought an extra coffee. "For the drive to her gallery," he said. "Two hours away, but I'm going to every showing."
                </p>
            `,
            "The Night Shift": `
                <p class="text-gray-300 mb-6">
                    3 AM brings interesting customers, but she was different. Still in scrubs, hospital ID swinging from her neck, she ordered a chamomile tea and sat in silence for a long moment.
                </p>
                <p class="text-gray-300 mb-6">
                    "I just finished my last night of residency," she finally said. "Ten years of school, three years of residency. I'm finally a full-fledged doctor." She stirred her tea absently. "My mom cleaned houses to put me through school. She didn't live to see this day."
                </p>
                <p class="text-gray-300">
                    She left a twenty-dollar tip with a note: "For the next person who looks like they're having a rough night."
                </p>
            `,
            "The Quiet Musician": `
                <p class="text-gray-300 mb-6">
                    He's been working on his symphony for months, headphones on, laptop open, occasionally conducting to himself with his coffee spoon. Most customers probably thought he was just another remote worker.
                </p>
                <p class="text-gray-300 mb-6">
                    Today, he closed his laptop with a sense of finality. "The Philadelphia Orchestra," he said, unprompted. "They're going to play my piece next season." His hands were shaking as he packed up his things.
                </p>
                <p class="text-gray-300">
                    Now there's a small plaque on his usual table: "Reserved for the Maestro."
                </p>
            `,
            "The Last Customer": `
                <p class="text-gray-300 mb-6">
                    It was five minutes to closing when he walked in. Normally, we'd be annoyed, but something in his demeanor made us pause. "Chamomile tea, please," he said softly. "And maybe someone to talk to?"
                </p>
                <p class="text-gray-300 mb-6">
                    "Fifty years sober today," he shared, warming his hands around the cup. "My sponsor passed last year. First time I'm celebrating without him." He pulled out a gold chip from his pocket, turning it over and over.
                </p>
                <p class="text-gray-300">
                    We stayed open an extra hour that night, listening to his story. Sometimes a cup of tea is more than just a cup of tea.
                </p>
            `
        };

        fullPostSection.innerHTML = `
            <h2 class="text-4xl font-bold mb-4 text-white">${post.title}</h2>
            <div class="flex items-center mb-6">
                <span class="text-gray-400">${post.date}</span>
                <span class="mx-3 text-gray-400">•</span>
                <span class="text-gray-400">${post.readTime}</span>
            </div>
            <div class="prose prose-lg prose-invert max-w-none">
                ${fullContent[post.title]}
            </div>
        `;

        fullPostSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    setupEventListeners() {
        // Add search functionality
        if (this.searchInput) {
            this.searchInput.addEventListener('input', () => {
                const searchTerm = this.searchInput.value.toLowerCase().trim();
                
                if (searchTerm === '') {
                    // If search is empty, show all posts
                    this.currentIndex = 0;
                    this.displayPosts();
                    return;
                }

                // Filter posts based on search term
                const filteredPosts = this.allPosts.filter(post => 
                    post.title.toLowerCase().includes(searchTerm) ||
                    post.preview.toLowerCase().includes(searchTerm)
                );

                // Update posts container with filtered results
                this.postsContainer.innerHTML = '';
                
                if (filteredPosts.length === 0) {
                    // Show no results message
                    const noResults = document.createElement('div');
                    noResults.className = 'text-gray-400 text-center w-full py-8';
                    noResults.textContent = 'No posts found matching your search.';
                    this.postsContainer.appendChild(noResults);
                    
                    // Hide navigation arrows
                    this.leftArrow.style.display = 'none';
                    this.rightArrow.style.display = 'none';
                } else {
                    // Create wrapper with same styling as regular posts display
                    const postsWrapper = document.createElement('div');
                    postsWrapper.className = 'flex gap-8 justify-start';
                    
                    // Calculate how many posts to show based on container width
                    const postWidth = 350;
                    const gap = 32;
                    const containerWidth = this.postsContainer.clientWidth;
                    const postsPerView = Math.floor(containerWidth / (postWidth + gap));
                    
                    // Show only the first set of posts that fit
                    const postsToShow = filteredPosts.slice(0, postsPerView);
                    
                    postsToShow.forEach((post, index) => {
                        const postElement = this.createPostElement(post);
                        postElement.className = `post-card rounded-xl p-8 transition-all duration-300 ${
                            index === 0 ? 'opacity-100 scale-100 z-10' : 'opacity-70 scale-95'
                        }`;
                        postsWrapper.appendChild(postElement);
                    });
                    
                    this.postsContainer.appendChild(postsWrapper);
                    
                    // Show navigation arrows if there are more results than can fit
                    this.leftArrow.style.display = 'none'; // Hide left arrow initially
                    this.rightArrow.style.display = filteredPosts.length > postsPerView ? 'flex' : 'none';
                }
            });

            // Add search clear functionality
            this.searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.searchInput.value = '';
                    this.currentIndex = 0;
                    this.displayPosts();
                }
            });
        }
    }

    setupSkillTags() {
        const skillTags = document.querySelectorAll('.skill-tag');
        
        skillTags.forEach(tag => {
            tag.addEventListener('click', () => {
                // Remove active class from all tags
                skillTags.forEach(t => t.classList.remove('active-skill'));
                // Add active class to clicked tag
                tag.classList.add('active-skill');
                
                // Show skill details
                const skillDetails = document.createElement('div');
                skillDetails.className = 'skill-details glass-effect rounded-lg p-4 mt-4';
                skillDetails.innerHTML = `
                    <h4 class="text-lg font-semibold mb-2">${tag.textContent}</h4>
                    <p class="text-sm text-gray-300">Experience with ${tag.textContent} includes various projects and professional work.</p>
                `;
                
                // Remove any existing skill details
                const existingDetails = document.querySelector('.skill-details');
                if (existingDetails) {
                    existingDetails.remove();
                }
                
                tag.parentElement.appendChild(skillDetails);
            });
        });
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements
        document.querySelectorAll('.sidebar-section, .post-card').forEach(el => {
            observer.observe(el);
        });
    }

    showAboutMe() {
        // Hide the posts container temporarily
        this.postsContainer.style.display = 'none';
        
        // Create or update the about me section
        let aboutSection = document.getElementById('fullAboutMe');
        if (!aboutSection) {
            aboutSection = document.createElement('section');
            aboutSection.id = 'fullAboutMe';
            aboutSection.className = 'glass-effect rounded-xl p-8 animate-in';
            
            aboutSection.innerHTML = `
                <div class="flex justify-between items-start mb-6">
                    <h2 class="text-4xl font-bold text-white">About Me</h2>
                    <button class="text-gray-400 hover:text-white transition-colors" id="closeAbout">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
                
                <div class="grid md:grid-cols-2 gap-8">
                    <div>
                        <img src="profile2.jpg" 
                             alt="Derek Duzan" 
                             class="rounded-lg shadow-lg w-full mb-4">
                    </div>
                    <div class="space-y-6">
                        <p class="text-gray-300 text-lg leading-relaxed">
                            Hello! I'm Derek Duzan, a passionate technologist and creative thinker with a deep interest in building innovative solutions.
                        </p>
                        <p class="text-gray-300 text-lg leading-relaxed">
                            With years of experience in software development, I specialize in creating efficient, scalable applications that solve real-world problems.
                        </p>
                        <div class="space-y-4">
                            <h3 class="text-2xl font-semibold text-white">Experience</h3>
                            <ul class="space-y-3 text-gray-300">
                                <li>• Full-stack Development</li>
                                <li>• Cloud Architecture</li>
                                <li>• System Design</li>
                                <li>• Technical Leadership</li>
                            </ul>
                        </div>
                    </div>
                </div>
            `;
            
            // Insert before the posts container
            this.postsContainer.parentElement.insertBefore(aboutSection, this.postsContainer);
            
            // Add close button functionality
            const closeBtn = aboutSection.querySelector('#closeAbout');
            closeBtn.addEventListener('click', () => {
                aboutSection.remove();
                this.postsContainer.style.display = 'flex';
            });
        }
    }
}

function createDigitalRain() {
    const rainContainer = document.createElement('div');
    rainContainer.className = 'digital-rain';
    document.querySelector('.header-shapes').appendChild(rainContainer);

    function createRainDrop() {
        const drop = document.createElement('div');
        drop.className = 'rain-drop';
        drop.style.left = `${Math.random() * 100}%`;
        drop.style.animationDuration = `${Math.random() * 2 + 1}s`;
        rainContainer.appendChild(drop);

        drop.addEventListener('animationend', () => {
            drop.remove();
        });
    }

    setInterval(createRainDrop, 100);
}

document.addEventListener('DOMContentLoaded', () => {
    const blog = new BlogFeed();
});

document.getElementById('startGame')?.addEventListener('click', (e) => {
    e.preventDefault();
    const overlay = document.getElementById('gameOverlay');
    overlay.classList.remove('hidden');
    const canvas = document.getElementById('gameCanvas');
    new EndlessRunner(canvas);
});

document.getElementById('closeGame')?.addEventListener('click', () => {
    document.getElementById('gameOverlay').classList.add('hidden');
}); 