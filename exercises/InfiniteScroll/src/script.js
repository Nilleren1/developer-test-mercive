document.addEventListener('DOMContentLoaded', () => {
  console.log("Page loaded, JavaScript is running!");

  const proxyUrl = 'https://corsproxy.io/?';
  const apiUrl = 'https://api.frontendexpert.io/api/fe/testimonials?limit=5';

  fetch(`${proxyUrl}${apiUrl}`, {
    method: 'GET',
  })
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      console.log("fetch success");
      var testimonials = res.json();
      return testimonials;
    })
    .then(data => {
      const testimonials = data.testimonials;
      const testimonialsContainer = document.querySelector('.testimonial-container');

      // Clear existing content in the container
      testimonialsContainer.innerHTML = '';

      const randomNames = ["John Doe", "Jane Smith", "Alice Johnson", "Bob Brown", "Charlie Davis"];

      // Loop through fetch array and list them in testimonial-container
      testimonials.forEach(testimonial => {

        // randomized placeholders for name and image
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
    }
    )
    .catch(err => console.error('Error:', err));
  });
