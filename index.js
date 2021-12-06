const success = (pos) => {
  let crd = pos.coords;
  let lat = crd.latitude;
  let lon = crd.longitude;

  const locationNow = fetch(`https://geocode.xyz/${lat},${lon}?json=1"`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      countryInfo(data.country);
    });

  console.log(locationNow);
};

const error = (err) => {
  console.warn("Error", err.code, err.message);
};

navigator.geolocation.getCurrentPosition(success, error);

const countryInfo = (country) => {
  const info = fetch(`https://restcountries.com/v2/name/${country}`).then(
    (res) =>
      res
        .json()
        .then((data) => {
          console.log(data);
          let [info] = data;
          RenderCountry(info);
          if (info.borders) {
            countryInfo(info.borders.toString());
          }
        })
        .catch((err) => console.log(err))
  );
};
const cnt = document.getElementById("cnt");

const RenderCountry = (info) => {
  const html = `<div class="country_box">
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

const getInfoBtn = document.querySelector(".getinfo");
getInfoBtn.addEventListener("click", function () {
  //   console.log(cnt);
  cnt.style.opacity = 1;
  this.remove();
});
