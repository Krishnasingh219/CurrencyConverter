const API_KEY = "fca_live_1r74lIUz0k17JfJCso50pKtUg6XzKiAbMgXurTWe";
const BASE_URL = `https://api.freecurrencyapi.com/v1/latest?apikey=${API_KEY}`;
const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");

// Supported currencies and their flag codes
const countryList = {
  USD: "US", INR: "IN", EUR: "FR", GBP: "GB", JPY: "JP", AUD: "AU", CAD: "CA", CHF: "CH", CNY: "CN",
  AED: "AE", AFN: "AF", ALL: "AL", AMD: "AM", ARS: "AR", AZN: "AZ", BDT: "BD", BGN: "BG", BHD: "BH",
  BRL: "BR", CZK: "CZ", DKK: "DK", EGP: "EG", HKD: "HK", HUF: "HU", IDR: "ID", ILS: "IL", KRW: "KR",
  MXN: "MX", MYR: "MY", NOK: "NO", NZD: "NZ", PKR: "PK", PLN: "PL", RUB: "RU", SAR: "SA", SEK: "SE",
  SGD: "SG", THB: "TH", TRY: "TR", TWD: "TW", UAH: "UA", VND: "VN", ZAR: "ZA"
};

// Populate dropdowns
dropdowns.forEach(select => {
  for (let currCode in countryList) {
    let option = document.createElement("option");
    option.value = currCode;
    option.innerText = currCode;

    if (select.name === "from" && currCode === "USD") {
      option.selected = true;
    } else if (select.name === "to" && currCode === "INR") {
      option.selected = true;
    }

    select.appendChild(option);
  }

  select.addEventListener("change", (e) => {
    updateFlag(e.target);
  });
});

// Update flag image
function updateFlag(selectElement) {
  const currencyCode = selectElement.value;
  let countryCode = countryList[currencyCode] || "US"; // fallback
  const img = selectElement.parentElement.querySelector("img");
  img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
}

// Convert currency
btn.addEventListener("click", async (e) => {
  e.preventDefault();
  const amountInput = document.querySelector(".amount-input");
  let amtVal = parseFloat(amountInput.value);

  if (isNaN(amtVal) || amtVal < 1) {
    amtVal = 1;
    amountInput.value = "1";
  }

  try {
    const response = await fetch(`${BASE_URL}&currencies=${fromCurr.value},${toCurr.value}`);
    const data = await response.json();

    const rateFrom = data.data[fromCurr.value];
    const rateTo = data.data[toCurr.value];

    if (!rateFrom || !rateTo) {
      throw new Error(`Currency not supported: ${!rateFrom ? fromCurr.value : toCurr.value}`);
    }

    const convertedAmount = ((amtVal / rateFrom) * rateTo).toFixed(2);

    document.querySelector(".msg").innerText =
      `${amtVal} ${fromCurr.value} = ${convertedAmount} ${toCurr.value}`;
  } catch (err) {
    alert("Conversion failed: " + err.message);
  }
});
