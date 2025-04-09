document.addEventListener('DOMContentLoaded', () => {
  console.log("Page loaded, JavaScript is running!");

  const baseurl = 'https://corsproxy.io/?https://api.coingecko.com/api/v3/coins/markets';
  const tableBody = document.querySelector('#crypto-table tbody');
  const backButton = document.getElementById('back-btn');
  const nextButton = document.getElementById('next-btn');

  const perPage = 10;
  let currentPage = 1;

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // logic to handle rate limiting and retries
  const fetchDataWithRetry = async (url, retries = 3, delayMs = 5000) => {
    for (let i = 0; i < retries; i++) {
      try {
        const res = await fetch(url);
        if (res.ok) {
          return res.json();
        } else if (res.status === 429) {
          console.warn('Rate limit hit. Retrying...');
          await delay(delayMs * (i + 1));
        } else {
          throw new Error(`HTTP Error: ${res.status} ${res.statusText}`);
        }
      } catch (error) {
        if (i === retries - 1) {
          alert('Failed to load cryptocurrency data. Please try again later.');
        }
      }
    }
  };

  const fetchData = async () => {
    const cachedData = localStorage.getItem(`page-${currentPage}`);
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const url = `${baseurl}?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${currentPage}&sparkline=false&locale=en`;
    const data = await fetchDataWithRetry(url, 3, 1000);
    if (data) {
      localStorage.setItem(`page-${currentPage}`, JSON.stringify(data)); // Cache the data in localStorage
    }
    return data;
  };

  const RenderTableRows = (data) => {
    tableBody.innerHTML = '';
    data.forEach(e => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>
          <div class="coin-info">
            <img src="${e.image}" alt="${e.name}" class="coin-image">
            <div class="coin-text">
              <p class="coin-symbol">${e.symbol.toUpperCase()}</p>
              <p class="coin-name">${e.name}</p>
            </div>
          </div>
        </td>
        <td>
          <div class="price">
            ${e.current_price.toFixed(2)}
            <div class="price-change">
              <div class="high">H:${e.high_24h.toFixed(2)}</div>
              <div class="low">L:${e.low_24h.toFixed(2)}</div>
            </div>
          </div>
        </td>
        <td>$${e.market_cap.toLocaleString()}</td>
      `;
      tableBody.appendChild(row);
    });
  };

  const updateButtons = (dataLength) => {
    backButton.disabled = currentPage === 1;
    nextButton.disabled = dataLength < perPage;
  };

  const loadTable = async () => {
    const data = await fetchData();
    if (data) {
      RenderTableRows(data);
      updateButtons(data.length);
    }
  };

  backButton.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      loadTable();
    }
  });

  nextButton.addEventListener('click', () => {
    currentPage++;
    loadTable();
  });

  loadTable();
});