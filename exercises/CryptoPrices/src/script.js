document.addEventListener('DOMContentLoaded', () => {
  console.log("Page loaded, JavaScript is running!");

  // Add your JS code below here
  const baseurl = 'https://corsproxy.io/?https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=30&page=1&sparkline=false&locale=en';
  const tableBody = document.querySelector('#crypto-table tbody');
  const backButton = document.getElementById('back-button');
  const nextButton = document.getElementById('next-button');

  let currentPage = 1;
  const perPage = 10;

  const fetchData = async (page) => {
    try {
      const res = await fetch(baseurl);
      if (res.ok) {
        return res.json();
      } else {
        throw new Error(`HTTP Error: ${res.status} ${res.statusText}`);
      }
    } catch (error) {
      alert('Failed to load cryptocurrency data. Please try again later.');
    }
  };

  const RenderTableRows = (data) => {
    // Clear the table body before adding new rows
    tableBody.innerHTML = '';
    // Loop through the data and create a row for each item
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
            <div class="high">
              H:${e.high_24h.toFixed(2)}
            </div>  
            <div class="low">
              L:${e.low_24h.toFixed(2)}
            </div> 
          </div>
        </div>
      </td>
      <td>${e.market_cap.toLocaleString('en-US', 'currency')}</td>
      `;
      // Add the row to the table body
      tableBody.appendChild(row);
    });
  };

  const loadTable = async () => {
    const data = await fetchData();
    if (data) {
      RenderTableRows(data);
    }
  }


  loadTable();
});