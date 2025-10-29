document.addEventListener('DOMContentLoaded', () => {

    const main = document.querySelector('.main');
    const sections = document.querySelectorAll('.main section[id]');
    const navLinks = document.querySelectorAll('.sidebar a[href^="#"]');
    const toTopBtn = document.querySelector('#back-to-top');
    const faders = document.querySelectorAll('.fade-in');

    // 1. Back to Top Button Show/Hide 
    if (main && toTopBtn) {
        main.addEventListener('scroll', () => {
            if (main.scrollTop > 300) {
                toTopBtn.style.display = 'block';
            } else {
                toTopBtn.style.display = 'none';
            }
        });
    }

    //  2. Active Sidebar Link on Scroll 
    if (main && sections.length > 0 && navLinks.length > 0) {
        const observerOptions = {
            root: main, // Use .main as the scroll container
            rootMargin: '-30% 0px -70% 0px', // Trigger when section is in this part of the viewport
            threshold: 0
        };

        const activeLinkObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === '#' + id) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            activeLinkObserver.observe(section);
        });
    }

    // 3. Scroll-Reveal Animations
    if (faders.length > 0) {
        const fadeObserverOptions = {
            root: main, // Use .main as the scroll container
            rootMargin: '0px 0px -100px 0px', // Trigger when element is 100px from bottom
            threshold: 0
        };

        const fadeObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Stop observing once it's visible
                }
            });
        }, fadeObserverOptions);

        faders.forEach(fader => {
            fadeObserver.observe(fader);
        });
    }

});

    (function () {
      const form = document.getElementById('contactForm');
      const result = document.getElementById('result');
      const submitBtn = document.getElementById('submitBtn');

      if (!form) return;

      form.addEventListener('submit', async function (e) {
        e.preventDefault();

        // quick client-side validation (HTML5 will also enforce)
        if (!form.checkValidity()) {
          result.textContent = 'Please fill in all required fields correctly.';
          return;
        }

        // disable button while submitting
        submitBtn.disabled = true;
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        result.textContent = '';

        const formData = new FormData(form);

        try {
          const response = await fetch(form.action, {
            method: form.method,
            body: formData,
            headers: {
              'Accept': 'application/json' // request json response from Web3Forms
            }
          });

          const json = await response.json().catch(() => ({}));

          if (response.ok) {
            // success
            result.innerHTML = '✅ Message sent successfully. Thank you!';
            form.reset();

            // if Web3Forms returns a redirect URL, follow it
            // (some integrations return json.redirect)
            if (json && json.redirect) {
              window.location.href = json.redirect;
              return;
            }

            // restore button after short delay
            setTimeout(() => {
              submitBtn.disabled = false;
              submitBtn.textContent = originalBtnText;
            }, 1200);
          } else {
            // server returned an error
            const msg = json?.message || response.statusText || 'Submission failed';
            result.innerHTML = '❌ ' + msg;
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
          }
        } catch (err) {
          console.error(err);
          result.innerHTML = '❌ Network error. Please try again later.';
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }
      });
    })();