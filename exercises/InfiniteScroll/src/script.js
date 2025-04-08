document.addEventListener('DOMContentLoaded', () => {
  console.log("Page loaded, JavaScript is running!");

  // Use a CORS proxy to avoid CORS issues
  const apiUrl = 'https://corsproxy.io/?https://api.frontendexpert.io/api/fe/testimonials?';

  const testimonialsContainer = document.querySelector('.testimonial-container');
  const spinner = document.createElement('div');
  spinner.classList.add('spinner', 'hidden');
  spinner.innerHTML = `<div class="loading-spinner"></div>`;
  testimonialsContainer.appendChild(spinner);

  let isLoading = false;
  let hasNext = true;
  let after = null;

  /**
   * 
   * @returns {Promise<void>} - Fetches testimonials from the API and appends them to the testimonials container.
   * If there are no more testimonials to fetch, it does nothing.
   */
  const fetchTestimonials = async () => {
    if (isLoading || !hasNext) return;
    isLoading = true;
    spinner.classList.remove('hidden');
    try {
      const url = new URL(apiUrl);
      url.searchParams.append('limit', 5);
      if (after) {
        url.searchParams.append('after', after);
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      hasNext = data.hasNext;
      after = data.testimonials[data.testimonials.length - 1]?.id;

      appendTestimonials(data.testimonials);
    } catch (err) {
      console.error('Error:', err);
      const errorMessage = document.createElement('p');
      errorMessage.textContent = 'Failed to load testimonials.';
      testimonialsContainer.appendChild(errorMessage);
    } finally {
      isLoading = false;
      spinner.classList.add('hidden');
    }
  };

  /**
   * Appends an array of testimonials to the testimonials container.
   * 
   * @param {Array} testimonials - An array of testimonial objects. Each object should have the following properties:
   *   - {string} id - The unique identifier for the testimonial.
   *   - {string} name - The name of the person giving the testimonial. 'Randomized' if not provided.
   *   - {string} message - The testimonial message.
   *   - {string} image - The URL of the person's profile image. Placeholder for now.
   * 
   * If a testimonial does not have a name or image, a random name or image will be used as a fallback.
   */
  const appendTestimonials = (testimonials) => {
    const randomNames = ["John Doe", "Jane Smith", "Alice Johnson", "Bob Brown", "Charlie Davis"];

    testimonials.forEach(testimonial => {
      const rngVal = Math.floor(Math.random() * 100);
      const rngNames = randomNames[Math.floor(Math.random() * randomNames.length)];

      const testimonialElement = document.createElement('div');
      testimonialElement.classList.add('card');
      testimonialElement.innerHTML = `
        <div class="card-content testimonial">
          <img src="${testimonial.image || `https://picsum.photos/50?random=${rngVal}`}" alt="${testimonial.name}" class="profile-image">
          <div>
            <h3>${testimonial.name || rngNames}</h3>
            <p>${testimonial.message}</p>
          </div>
        </div>
      `;
      testimonialsContainer.appendChild(testimonialElement);
    });
  };

  // fetching more when scrolled to the bottom
  testimonialsContainer.addEventListener('scroll', () => {
    if (testimonialsContainer.scrollTop + testimonialsContainer.clientHeight >= testimonialsContainer.scrollHeight) {
      fetchTestimonials();
    }
  });

  // Initial fetch
  fetchTestimonials();
});