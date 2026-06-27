/**
 * CS INFOTECH - MAIN JAVASCRIPT
 * Includes sticky header, active navigation highlighting,
 * intersection observer stats counter, form validation, and scroll-to-top features.
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyNavbar();
  initActiveNavLink();
  initStatsCounter();
  initBackToTop();
  initContactFormValidation();
  initSingleBlogLoader();
  
  // Initialize AOS (Animate On Scroll) if loaded
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-in-out'
    });
  }
});

/**
 * Sticky Navbar Toggle on Scroll
 */
function initStickyNavbar() {
  const navbar = document.querySelector('.navbar-custom');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('navbar-scrolled');
    } else {
      navbar.classList.remove('navbar-scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  // Run on load in case page starts scrolled down
  handleScroll();
}

/**
 * Highlight Active Page link in Navbar
 */
function initActiveNavLink() {
  const navLinks = document.querySelectorAll('.nav-link-custom');
  // Get current file name from path
  const path = window.location.pathname.split('/').pop();
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    // Highlight home if path is empty/root and href is index.html
    if (path === href || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/**
 * Animated Statistics Counters
 */
function initStatsCounter() {
  const statsSection = document.getElementById('stats-section');
  if (!statsSection) return;

  const counters = document.querySelectorAll('.stat-number');
  let started = false;

  const startCounting = () => {
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      const suffix = counter.getAttribute('data-suffix') || '';
      let count = 0;
      // Adjust speed based on target
      const duration = 1500; // ms
      const stepTime = Math.max(Math.floor(duration / target), 15);
      
      const timer = setInterval(() => {
        count += Math.ceil(target / (duration / stepTime));
        if (count >= target) {
          counter.textContent = target + suffix;
          clearInterval(timer);
        } else {
          counter.textContent = count + suffix;
        }
      }, stepTime);
    });
  };

  // Intersection Observer to trigger when section enters viewport
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !started) {
        started = true;
        startCounting();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });

  observer.observe(statsSection);
}

/**
 * Scroll to Top Button
 */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTop');
  if (!backToTopBtn) return;

  const handleScroll = () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  };

  window.addEventListener('scroll', handleScroll);

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * Contact Form Validation
 */
function initContactFormValidation() {
  const form = document.getElementById('contactForm');
  const successAlert = document.getElementById('formSuccessMessage');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Field references
    const nameField = document.getElementById('fullName');
    const emailField = document.getElementById('emailAddress');
    const phoneField = document.getElementById('phoneNumber');
    const serviceField = document.getElementById('serviceRequired');
    const messageField = document.getElementById('messageText');

    // Reset validations
    [nameField, emailField, phoneField, serviceField, messageField].forEach(field => {
      if (field) {
        field.classList.remove('is-invalid');
      }
    });

    // 1. Validate Name (Not empty, >= 3 chars)
    if (!nameField.value.trim() || nameField.value.trim().length < 3) {
      nameField.classList.add('is-invalid');
      isValid = false;
    }

    // 2. Validate Email (Valid email structure)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailField.value.trim() || !emailRegex.test(emailField.value.trim())) {
      emailField.classList.add('is-invalid');
      isValid = false;
    }

    // 3. Validate Phone (Numeric, >= 10 digits)
    const phoneRegex = /^\+?[0-9\s-]{10,15}$/;
    if (!phoneField.value.trim() || !phoneRegex.test(phoneField.value.trim().replace(/\s+/g, ''))) {
      phoneField.classList.add('is-invalid');
      isValid = false;
    }

    // 4. Validate Service Selection
    if (!serviceField.value || serviceField.value === '') {
      serviceField.classList.add('is-invalid');
      isValid = false;
    }

    // 5. Validate Message (Not empty, >= 10 chars)
    if (!messageField.value.trim() || messageField.value.trim().length < 10) {
      messageField.classList.add('is-invalid');
      isValid = false;
    }

    // Process Submission if Valid
    if (isValid) {
      // Format WhatsApp Message
      const name = nameField.value.trim();
      const email = emailField.value.trim();
      const phone = phoneField.value.trim();
      const service = serviceField.options[serviceField.selectedIndex].text;
      const message = messageField.value.trim();

      const waMessage = `*CS Infotech Consultation Request*\n\n` +
                        `👤 *Name:* ${name}\n` +
                        `📧 *Email:* ${email}\n` +
                        `📞 *Phone:* ${phone}\n` +
                        `💼 *Service:* ${service}\n` +
                        `💬 *Message:* ${message}`;

      const waUrl = `https://api.whatsapp.com/send?phone=919894328102&text=${encodeURIComponent(waMessage)}`;

      // Display success container
      if (successAlert) {
        successAlert.style.display = 'flex';
        // Scroll to success message
        successAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      
      // Open WhatsApp in a new tab
      window.open(waUrl, '_blank');

      // Reset form
      form.reset();

      // Fade out success message after 5 seconds
      setTimeout(() => {
        if (successAlert) {
          successAlert.style.display = 'none';
        }
      }, 5000);
    }
  });
}

/**
 * Dynamic Single Blog Post Loader
 */
function initSingleBlogLoader() {
  const blogDetailContainer = document.getElementById('blogDetailContainer');
  const blogSingleError = document.getElementById('blogSingleError');
  
  // Only execute this logic on the blog-single.html template page
  if (!blogDetailContainer && !blogSingleError) return;

  const urlParams = new URLSearchParams(window.location.search);
  const blogId = parseInt(urlParams.get('id'), 10);

  const showError = () => {
    if (blogDetailContainer) blogDetailContainer.style.display = 'none';
    if (blogSingleError) blogSingleError.style.display = 'block';
    const bannerTitle = document.getElementById('blogSingleBannerTitle');
    if (bannerTitle) bannerTitle.textContent = "Article Not Found";
    const breadcrumbCat = document.getElementById('blogSingleBreadcrumbCategory');
    if (breadcrumbCat) breadcrumbCat.textContent = "Error";
  };

  // Check if blog database array exists and ID is present
  if (isNaN(blogId) || typeof BLOG_POSTS === 'undefined') {
    showError();
    return;
  }

  const post = BLOG_POSTS.find(p => p.id === blogId);
  if (!post) {
    showError();
    return;
  }

  // Populate HTML elements with dynamic blog data
  document.title = `${post.title} | CS Infotech`;

  const bannerTitle = document.getElementById('blogSingleBannerTitle');
  const breadcrumbCat = document.getElementById('blogSingleBreadcrumbCategory');
  const imageEl = document.getElementById('blogSingleImage');
  const catBadge = document.getElementById('blogSingleCategoryBadge');
  const authorEl = document.getElementById('blogSingleAuthor');
  const dateEl = document.getElementById('blogSingleDate');
  const titleEl = document.getElementById('blogSingleTitle');
  const contentEl = document.getElementById('blogSingleContent');

  if (bannerTitle) bannerTitle.textContent = post.title;
  if (breadcrumbCat) breadcrumbCat.textContent = post.category;
  
  if (imageEl) {
    imageEl.src = post.image;
    imageEl.alt = post.title;
    imageEl.style.display = 'block';
  }
  if (catBadge) catBadge.textContent = post.category;
  if (authorEl) authorEl.textContent = post.author;
  if (dateEl) dateEl.textContent = post.date;
  if (titleEl) titleEl.textContent = post.title;
  
  if (contentEl) {
    // Injecting HTML content compiled inside blog-data.js
    contentEl.innerHTML = post.content;
  }
}

