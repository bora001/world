const cnt = document.getElementById("cnt");
const body = document;
let placeNow;
const success = (pos) => {
  let crd = pos.coords;
  let lat = crd.latitude;
  let lon = crd.longitude;

  const locationNow = fetch(`https://geocode.xyz/${lat},${lon}?json=1"`)
    .then((res) => res.json())
    .then((data) => {
      countryInfo(data.prov);
      placeNow = data.prov;
    });
};

const error = (err) => {
  console.warn("Error", err.code, err.message);
};

navigator.geolocation.getCurrentPosition(success, error);

const countryInfo = async function (country) {
  // info
  const info = await fetch(
    `https://restcountries.com/v2/alpha?codes=${country}`
  );

  //data
  const [data] = await info.json();
  let border = data.borders;
  if (placeNow !== country) {
    RenderBorder(data);
  } else if (country == placeNow) {
    RenderCountry(data);
    for (let otherCountry of border) {
      countryInfo(otherCountry);
    }
  }
};

const RenderCountry = (info) => {
  const html = `<div class="country_box" data=${info.alpha2Code}>
      <div class="flag_box"><img class="flag" src=${
        info.flags.png
      } alt="" /></div>
      <div class="txt_box">
        <h1 class="name">${info.name}</h1>
        <p class="capital">${info.capital}</p>
        <p class="lang">${info.languages.map((a) => a.name)}</p>
        <p class="currency">${info.currencies.map((a) =>
          Object.values(a).join(" ")
        )}</p>
      </div>
    </div>
    `;
  cnt.insertAdjacentHTML("beforeend", html);
};

const RenderBorder = (info) => {
  const html = `<div class="country_box" data=${info.alpha2Code}>
      <img class="flag" src=${info.flags.png} alt="" />
      <div class="txt_box">
        <h1 class="name">${info.name}</h1>
        <p class="capital">${info.capital}</p>
        <p class="lang">${info.languages.map((a) => a.name)}</p>
        <p class="currency">${info.currencies.map((a) =>
          Object.values(a).join(" ")
        )}</p>
        <button class="more" onClick="getInfo(this)" data=${
          info.alpha2Code
        }>more</button>
      </div>
    </div>
    `;
  cnt.insertAdjacentHTML("beforeend", html);
};

function getInfo(data) {
  let value = data.attributes["data"].value;

  while (cnt.firstChild) {
    cnt.removeChild(cnt.lastChild);
  }

  countryInfo(value);
  placeNow = value;
}

const getInfoBtn = document.querySelector(".getinfo");
getInfoBtn.addEventListener("click", function () {
  cnt.style.opacity = 1;
  this.remove();
});
