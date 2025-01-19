/*-------------------------------------------------------------------------------
  PRE LOADER
-------------------------------------------------------------------------------*/

$(window).load(function () {
  $('.preloader').fadeOut(1000); // set duration in brackets    
});

/* HTML document is loaded. DOM is ready. 
-------------------------------------------*/

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
      strings: ["Arpit Gupta", "An Innovator", "An Engineer", "A Solver", "A Developer", "A BugHunter"],
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
    Toggle Night Mode functionality
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

});
