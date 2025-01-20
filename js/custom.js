/*-------------------------------------------------------------------------------
  PRE LOADER
-------------------------------------------------------------------------------*/
$(window).load(function () {
  $('.preloader').fadeOut(1000); // Set duration in brackets    
});

/*-------------------------------------------------------------------------------
  HTML document is loaded. DOM is ready.
-------------------------------------------------------------------------------*/
$(document).ready(function () {

  /*-------------------------------------------------------------------------------
    Navigation - Hide mobile menu after clicking on a link
  -------------------------------------------------------------------------------*/
  $('.navbar-collapse a').click(function () {
    $(".navbar-collapse").collapse('hide');
  });

  /*-------------------------------------------------------------------------------
    jQuery Parallax
  -------------------------------------------------------------------------------*/
  function initParallax() {
    $('#home').parallax("100%", 0.1);
    $('#about').parallax("100%", 0.3);
    $('#experience').parallax("100%", 0.3);
    $('#education').parallax("100%", 0.1);
    $('#projects').parallax("100%", 0.2);
    $('#quotes').parallax("100%", 0.3);
    $('#blog').parallax("100%", 0.1);
    $('#books').parallax("100%", 0.1);
    $('#contact').parallax("100%", 0.1);
    $('footer').parallax("100%", 0.2);
  }
  initParallax();

  /*-------------------------------------------------------------------------------
    smoothScroll js
  -------------------------------------------------------------------------------*/
  $(function () {
    $('.custom-navbar a, #home a').bind('click', function (event) {
      var target = $($(this).attr('href'));
      if (target.length) {
        $('html, body').stop().animate({
          scrollTop: target.offset().top - 49
        }, 1000);
      }
      event.preventDefault();
    });
  });

  /*-------------------------------------------------------------------------------
    wow js - Animation js
  -------------------------------------------------------------------------------*/
  new WOW({ mobile: false }).init();

  /*-------------------------------------------------------------------------------
    Typed.js - Animation for typing text
  -------------------------------------------------------------------------------*/
  setTimeout(function () {
    var typed = new Typed('.typing', {
      strings: ["Arpit Gupta", "An Innovator", "An Engineer", "A Solver", "A Creator", "A Developer", "A BugHunter", "An Author"],
      loop: true,
      typeSpeed: 150,
      backSpeed: 100
    });
  }, 2000);

  /*-------------------------------------------------------------------------------
    Fetch and display blogs with "Load More" functionality
  -------------------------------------------------------------------------------*/
  const blogContainer = document.getElementById("blog-container");
  const loadMoreBtn = document.getElementById("load-more-btn");

  let currentPage = 1;
  const blogsPerPage = 3;

  function fetchBlogs(page) {
    fetch(`https://dev.to/api/articles?username=arpitstack&per_page=${blogsPerPage}&page=${page}`)
      .then(response => response.json())
      .then(blogs => {
        if (blogs.length > 0) {
          displayBlogs(blogs);
          currentPage++;

          if (blogs.length < blogsPerPage) {
            loadMoreBtn.style.display = "none";
          }
        } else {
          loadMoreBtn.style.display = "none";
        }
      })
      .catch(error => {
        console.error("Error fetching blogs:", error);
        blogContainer.innerHTML = `<div class="error-message">Failed to load blogs. Please try again later.</div>`;
      });
  }

  function displayBlogs(blogs) {
    blogs.forEach(blog => {
      const blogCard = document.createElement('div');
      blogCard.classList.add('blog-card');

      blogCard.innerHTML = `
      <div class="blog-content">
        ${blog.cover_image ? `<img src="${blog.cover_image}" alt="${blog.title}" class="blog-image">` : ''}
        <h3 class="blog-title">${blog.title}</h3>
        <p class="blog-excerpt">${blog.description || blog.body.slice(0, 150)}...</p>
        <a href="${blog.url}" target="_blank" rel="noopener noreferrer" class="read-more-btn">Read More</a>
      </div>
    `;
      blogContainer.appendChild(blogCard);
    });
  }

  loadMoreBtn.addEventListener("click", () => {
    fetchBlogs(currentPage);
  });

  fetchBlogs(currentPage);

  /*-------------------------------------------------------------------------------
    Toggle Night Mode
  -------------------------------------------------------------------------------*/
  const nightModeToggles = document.querySelectorAll('.navbar-night-mode, .night-mode-toggle');
  const toggleSound = document.getElementById('toggle-sound');

  nightModeToggles.forEach(toggle => {
    toggle.addEventListener('click', function (e) {
      e.preventDefault();

      if (toggleSound) {
        toggleSound.currentTime = 0;
        toggleSound.play();
      }

      document.body.classList.toggle('dark-theme');

      const icons = document.querySelectorAll('.fa-moon-o, .fa-sun-o');
      icons.forEach(icon => {
        if (icon.classList.contains('fa-moon-o')) {
          icon.classList.replace('fa-moon-o', 'fa-sun-o');
        } else {
          icon.classList.replace('fa-sun-o', 'fa-moon-o');
        }
      });
    });
  });

  /*-------------------------------------------------------------------------------
    Carousel Slider
  -------------------------------------------------------------------------------*/
  const track = document.querySelector('.carousel-track');
  const cards = document.querySelectorAll('.book-card');
  const prevButton = document.querySelector('.prev-btn');
  const nextButton = document.querySelector('.next-btn');
  const indicatorsContainer = document.querySelector('.carousel-indicators');

  let currentIndex = 0;
  let autoScrollInterval;
  const scrollDelay = 3000; // 3 seconds between slides

  // Truncate book descriptions
  const bookDescriptions = document.querySelectorAll('.book-info p');
  bookDescriptions.forEach(description => {
    const text = description.textContent;
    if (text.length > 150) {
      description.textContent = text.slice(0, 150) + '...';
    }
  });

  // Calculate the number of visible cards based on viewport width
  function getVisibleCards() {
    const viewportWidth = window.innerWidth;
    if (viewportWidth < 768) return 1;
    if (viewportWidth < 1024) return 2;
    return 3;
  }

  // Calculate maximum index based on visible cards
  function getMaxIndex() {
    return Math.max(0, cards.length - getVisibleCards());
  }

  // Calculate card width including gap
  function getCardWidth() {
    const card = cards[0];
    const cardStyle = window.getComputedStyle(card);
    const gap = parseInt(window.getComputedStyle(track).gap) || 0;
    const marginLeft = parseInt(cardStyle.marginLeft) || 0;
    const marginRight = parseInt(cardStyle.marginRight) || 0;

    // Include the card's full width plus gap and margins
    return card.offsetWidth + gap + marginLeft + marginRight;
  }

  // Update carousel position
  function updateCarousel(index, animate = true) {
    currentIndex = Math.min(Math.max(index, 0), getMaxIndex());
    const cardWidth = getCardWidth();

    if (!animate) {
      track.style.transition = 'none';
    }

    // Calculate exact position including gap
    const position = -currentIndex * cardWidth;
    track.style.transform = `translateX(${position}px)`;

    if (!animate) {
      track.offsetHeight; // Force reflow
      track.style.transition = '';
    }

    updateIndicators();
  }

  // Create indicators
  function createIndicators() {
    indicatorsContainer.innerHTML = '';
    const numIndicators = getMaxIndex() + 1;

    for (let i = 0; i < numIndicators; i++) {
      const dot = document.createElement('div');
      dot.classList.add('indicator');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        updateCarousel(i);
        resetAutoScroll();
      });
      indicatorsContainer.appendChild(dot);
    }
  }

  // Update indicators
  function updateIndicators() {
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === currentIndex);
    });
  }

  // Auto scroll function
  function startAutoScroll() {
    autoScrollInterval = setInterval(() => {
      if (currentIndex >= getMaxIndex()) {
        // Smoothly return to first slide
        currentIndex = 0;
      } else {
        currentIndex++;
      }
      updateCarousel(currentIndex);
    }, scrollDelay);
  }

  // Reset auto scroll
  function resetAutoScroll() {
    clearInterval(autoScrollInterval);
    startAutoScroll();
  }

  // Event listeners
  prevButton.addEventListener('click', () => {
    if (currentIndex === 0) {
      updateCarousel(getMaxIndex());
    } else {
      updateCarousel(currentIndex - 1);
    }
    resetAutoScroll();
  });

  nextButton.addEventListener('click', () => {
    if (currentIndex === getMaxIndex()) {
      updateCarousel(0);
    } else {
      updateCarousel(currentIndex + 1);
    }
    resetAutoScroll();
  });

  // Handle window resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // Adjust current index if necessary
      const maxIndex = getMaxIndex();
      if (currentIndex > maxIndex) {
        currentIndex = maxIndex;
      }
      createIndicators();
      updateCarousel(currentIndex, false);
    }, 250);
  });

  // Initialize carousel
  function initCarousel() {
    // Set initial position
    updateCarousel(0, false);

    // Create indicators
    createIndicators();

    // Start auto-scroll with proper timing
    startAutoScroll();

    // Add resize observer to handle container width changes
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          const maxIndex = getMaxIndex();
          if (currentIndex > maxIndex) {
            currentIndex = maxIndex;
          }
          updateCarousel(currentIndex, false);
          createIndicators();
        }, 250);
      }
    });

    resizeObserver.observe(track.parentElement);
  }

  // Pause auto-scroll on hover
  track.addEventListener('mouseenter', () => clearInterval(autoScrollInterval));
  track.addEventListener('mouseleave', startAutoScroll);

  // Initialize on load
  initCarousel();
});