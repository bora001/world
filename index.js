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
  const html = `<div class="error">
  <p>We can not get your location! Try again or check your Browser's Location Permission!</p><button onClick="location.reload();"><span class="plane"></span></button></div>
    `;
  cnt.insertAdjacentHTML("beforeend", html);
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
      <div class="flag_box front"><img class="flag" src=${
        info.flags.png
      } alt="" />
        <h1>${info.name.toUpperCase()}</h1>
      </div>
      <div class="txt_box back">
        <h1 class="name">${info.name}</h1>
        <p class="capital">🏠 ${info.capital}</p>
            <p class="lang">🔊 ${info.languages.map((lang) => lang.name)}</p>
            <p class="currency">💵 ${info.currencies.map(
              (money) => money.code
            )}</p>
      <p class="current">Your Location</p>
            
      </div>
      
    </div>
    `;
  cnt.insertAdjacentHTML("beforeend", html);

  const box = document.querySelector(".country_box");
  box.style.boxShadow = "0px 0px 35px rgb(128, 121, 121)";
};

const RenderBorder = (info) => {
  console.log(info);
  const html = `<div class="country_box" data=${info.alpha2Code}>
    <div class="flag_box front">
      <img class="flag" src=${info.flags.png} alt="" />
        <h1>${info.name.toUpperCase()}</h1>
    </div>
        <div class="txt_box back">
        <h1 class="name">${info.name}</h1>
            <p class="capital">🏠 ${info.capital}</p>
            <p class="lang">🔊 ${info.languages.map((lang) => lang.name)}</p>
            <p class="currency">💵 ${info.currencies.map(
              (money) => money.code
            )}</p>
            <button class="select" onClick="getInfo(this)" data=${
              info.alpha2Code
            }>Select</button>
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
