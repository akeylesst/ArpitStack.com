

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
      var $anchor = $(this);
      $('html, body').stop().animate({
        scrollTop: $($anchor.attr('href')).offset().top - 49
      }, 1000);
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

  // Delay the typing effect to start after fadeInUp animation
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
  let blogsCache = [];

  function fetchBlogs() {
    fetch("https://dev.to/api/articles?username=arpitstack")
      .then(response => response.json())
      .then(blogs => {
        blogsCache = blogs;
        loadBlogs();
      })
      .catch(error => {
        console.error("Error fetching blogs:", error);
        blogContainer.innerHTML = `<p class="color-white">Failed to load blogs. Please try again later.</p>`;
      });
  }

  function loadBlogs() {
    const start = (currentPage - 1) * blogsPerPage;
    const end = currentPage * blogsPerPage;
    const blogsToDisplay = blogsCache.slice(start, end);

    if (blogsToDisplay.length > 0) {
      blogsToDisplay.forEach(blog => {
        const blogCard = document.createElement('div');
        blogCard.classList.add('col-md-4', 'col-sm-6');

        blogCard.innerHTML = `
            <div class="wow fadeInUp" data-wow-delay="0.3s">
              <div class="blogs-thumb">
                <img src="${blog.cover_image || 'default_blog_img.png'}" alt="Blog title: ${blog.title}" class="blog-card-img">
                <h3 class="blog-title">${blog.title}</h3>
                <p class="blog-excerpt">${blog.description || blog.body.slice(0, 100)}...</p>
                <div class="btn-blog-wrapper">
                  <a href="${blog.url}" class="btn-blog" target="_blank">Read More</a>
                </div>
              </div>
            </div>
          `;
        blogContainer.appendChild(blogCard);
      });
      currentPage++;
    } else {
      loadMoreBtn.style.display = "none";
    }
  }

  loadMoreBtn.addEventListener("click", loadBlogs);

  // Initially load the blogs when the page loads
  fetchBlogs();

});

