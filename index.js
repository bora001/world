const cnt = document.getElementById("cnt");
const body = document;
let placeNow;
const success = (pos) => {
  let crd = pos.coords;
  let lat = crd.latitude;
  let lon = crd.longitude;

  const locationNow = fetch(`https://geocode.xyz/${lat},${lon}?json=1`)
    .then((res) => res.json())
    .then((data) => {
      countryInfo(data.prov);
      placeNow = data.prov;
    })
    .catch((err) => {
      if (err) throw new Error();
    });
};

const errorRender = (err) => {
  console.log(err);
  const html = `<div class="error">
  <p>Sorry, Something went wrong! Try again!</p><button onClick="location.reload();"><span class="plane"></span></button></div>
    `;
  cnt.insertAdjacentHTML("beforeend", html);
};

const error = (err) => {
  console.warn("Error", err.code, err.message);
};

navigator.geolocation.getCurrentPosition(success, error);

const countryInfo = async function (country) {
  // info
  try {
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
  } catch (err) {
    console.log(`${err}`);
    errorRender(err);
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

  const box = document.querySelector(".country_box");
  box.style.backgroundColor = "rgba(196, 199, 235, 0.274)";
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
