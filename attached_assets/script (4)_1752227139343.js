const channelSelect = document.getElementById("channel");
const salesmanSelect = document.getElementById("salesman");
const customerSelect = document.getElementById("customer");

function loadDropdowns() {
  fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vREXfVVJ4zYuYx40MkvrBI8aH2OYr81ZlF2b_owlbT1o_RhXC44_egEmLCOiLrD5iVPo-CAuYRrVqIC/pub?gid=1284241246&single=true&output=csv")
    .then(res => res.text())
    .then(csv => {
      const { data } = Papa.parse(csv, { header: true });
      const channels = [...new Set(data.map(r => r.Channel))].filter(Boolean);
      channelSelect.innerHTML = '<option value="">-- Select Channel --</option>' + channels.map(c => `<option value="${c}">${c}</option>`).join("");

      channelSelect.addEventListener("change", () => {
        const salesmen = data.filter(r => r.Channel === channelSelect.value).map(r => r["Salesman Name"]);
        const uniqueSalesmen = [...new Set(salesmen)].filter(Boolean);
        salesmanSelect.innerHTML = '<option value="">-- Select Salesman --</option>' + uniqueSalesmen.map(s => `<option value="${s}">${s}</option>`).join("");
        customerSelect.innerHTML = '<option value="">-- Select Customer --</option>';
      });

      salesmanSelect.addEventListener("change", () => {
        const customers = data.filter(r => r["Salesman Name"] === salesmanSelect.value).map(r => r["Customer Name"]);
        const uniqueCustomers = [...new Set(customers)].filter(Boolean);
        customerSelect.innerHTML = '<option value="">-- Select Customer --</option>' + uniqueCustomers.map(c => `<option value="${c}">${c}</option>`).join("");
      });
    });
}

function cleanImageUrl(url) {
  return url?.trim() || 'https://via.placeholder.com/80?text=No+Image';
}

function loadProducts() {
  fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vREXfVVJ4zYuYx40MkvrBI8aH2OYr81ZlF2b_owlbT1o_RhXC44_egEmLCOiLrD5iVPo-CAuYRrVqIC/pub?gid=1032512900&single=true&output=csv')
    .then(res => res.text())
    .then(csv => {
      const parsed = Papa.parse(csv, { header: true });
      const products = parsed.data.reduce((acc, row) => {
        const group = row["Supplier"]?.trim();
        const name = row["Category"]?.trim();
        const image = cleanImageUrl(row["image"]);
        if (group && name) {
          if (!acc[group]) acc[group] = [];
          acc[group].push({ name, image });
        }
        return acc;
      }, {});

      const productsDiv = document.getElementById("products");
      productsDiv.innerHTML = '';

      Object.entries(products).forEach(([group, items]) => {
        const btn = document.createElement("button");
        btn.className = "collapsible";
        btn.textContent = group;

        const searchInput = document.createElement("input");
        searchInput.className = "search-box";
        searchInput.type = "text";
        searchInput.placeholder = `Search ${group}...`;

        const contentDiv = document.createElement("div");
        contentDiv.classList.add("content");
        const grid = document.createElement("div");
        grid.className = "product-grid";

        const productMap = [];

        items.forEach(({ name, image }) => {
          const div = document.createElement("div");
          div.className = "product";
          div.innerHTML = `
            <img loading="lazy" src="${image}" alt="${name}" onerror="this.onerror=null; this.src='https://via.placeholder.com/80?text=No+Image';">
            <span>${name}</span>
            <input type="number" placeholder="Qty">
            <input type="number" class="sellout" placeholder="Sellout Qty">
          `;
          grid.appendChild(div);
          productMap.push({ name, element: div });
        });

        searchInput.addEventListener("input", () => {
          const term = searchInput.value.toLowerCase();
          productMap.forEach(({ name, element }) => {
            element.style.display = name.toLowerCase().includes(term) ? "flex" : "none";
          });
        });

        btn.addEventListener("click", function () {
          this.classList.toggle("active");
          contentDiv.style.display = contentDiv.style.display === "block" ? "none" : "block";
        });

        contentDiv.appendChild(searchInput);
        contentDiv.appendChild(grid);
        productsDiv.appendChild(btn);
        productsDiv.appendChild(contentDiv);
      });
    });
}

function resetForm() {
  document.getElementById("week").value = "";
  channelSelect.value = "";
  salesmanSelect.innerHTML = "<option value=''>-- Select Salesman --</option>";
  customerSelect.innerHTML = "<option value=''>-- Select Customer --</option>";
  document.querySelectorAll(".product input").forEach(input => input.value = "");
}

function submitForm() {
  const week = document.getElementById("week").value;
  const channel = channelSelect.value;
  const salesman = salesmanSelect.value;
  const customer = customerSelect.value;
  if (!week || !channel || !salesman || !customer) {
    alert("Please complete all selections before submitting.");
    return;
  }

  const productDivs = document.querySelectorAll(".product-grid .product");
  const entries = [];
  productDivs.forEach(div => {
    const name = div.querySelector("span").textContent.trim();
    const qty = Number(div.querySelector("input[type='number']:not(.sellout)").value);
    const sellout = Number(div.querySelector("input.sellout").value);
    if ((!Number.isNaN(qty) && qty > 0) || (!Number.isNaN(sellout) && sellout > 0)) {
      entries.push({ week, channel, salesman, customer, product: name, qty: qty || 0, sellout: sellout || 0 });
    }
  });

  if (entries.length === 0) {
    alert("Please enter at least one product quantity or sellout.");
    return;
  }

  const formData = new FormData();
  formData.append("data", JSON.stringify(entries));

  fetch("https://script.google.com/macros/s/AKfycbwTTKahHaWxeODCJ2SmXMXxpRJfh9zeWHJjuEgLc4ZkMovWk-VZ3xiszTEUBFRlD1RZMg/exec", {
    method: "POST",
    body: formData
  })
    .then(res => res.json())
    .then(response => {
      if (response.status === "success") {
        alert("✅ Submission successful!");
        resetForm();
      } else {
        alert("❌ Error from server: " + response.message);
      }
    })
    .catch(err => {
      alert("❌ Submission failed: " + err.message);
      console.error(err);
    });
}

loadDropdowns();
loadProducts();
