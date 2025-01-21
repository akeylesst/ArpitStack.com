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
    Carousel Slider with Box-by-Box Auto-Slide
  -------------------------------------------------------------------------------*/
  let currentCardIndex = 0;
  const track = document.querySelector('.carousel-track');
  const cards = document.querySelectorAll('.book-card');
  const nextBtn = document.querySelector('.next-btn');
  const prevBtn = document.querySelector('.prev-btn');
  const cardsPerView = 4;
  const totalCards = cards.length;

  // Create indicators based on total cards instead of views
  const indicatorsContainer = document.querySelector('.carousel-indicators');
  const totalSlides = Math.ceil(totalCards / cardsPerView);

  for (let i = 0; i < totalSlides; i++) {
    const indicator = document.createElement('div');
    indicator.classList.add('indicator');
    if (i === 0) indicator.classList.add('active');
    indicatorsContainer.appendChild(indicator);
  }

  const indicators = document.querySelectorAll('.indicator');

  function updateCarousel() {
    // Calculate the percentage to shift based on individual card width
    const translateX = (currentCardIndex * -(100 / cardsPerView));
    track.style.transform = `translateX(${translateX}%)`;

    // Update indicators
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === currentCardIndex);
    });
  }

  function nextCard() {
    // If at the last possible position (leaving 4 cards visible), go to first
    if (currentCardIndex >= totalCards - cardsPerView) {
      currentCardIndex = 0;
    } else {
      currentCardIndex++;
    }
    updateCarousel();
  }

  function prevCard() {
    // If at the beginning, go to last possible position
    if (currentCardIndex <= 0) {
      currentCardIndex = totalCards - cardsPerView;
    } else {
      currentCardIndex--;
    }
    updateCarousel();
  }

  // Auto-slide functionality
  let autoSlideInterval;

  function startAutoSlide() {
    stopAutoSlide();
    autoSlideInterval = setInterval(nextCard, 3000); // Slides every 3 seconds
  }

  function stopAutoSlide() {
    if (autoSlideInterval) {
      clearInterval(autoSlideInterval);
    }
  }

  // Start auto-sliding when the page loads
  startAutoSlide();

  // Event Listeners
  nextBtn.addEventListener('click', () => {
    stopAutoSlide();
    nextCard();
    startAutoSlide();
  });

  prevBtn.addEventListener('click', () => {
    stopAutoSlide();
    prevCard();
    startAutoSlide();
  });

  // Add indicator click functionality
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      stopAutoSlide();
      currentCardIndex = index;
      updateCarousel();
      startAutoSlide();
    });
  });

  // Pause auto-sliding when hovering over the carousel
  track.addEventListener('mouseenter', stopAutoSlide);
  track.addEventListener('mouseleave', startAutoSlide);
});