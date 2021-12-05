const success = (pos) => {
  let crd = pos.coords;
  let lat = crd.latitude;
  let lon = crd.longitude;

  const locationNow = fetch(`https://geocode.xyz/${lat},${lon}?json=1"`)
    .then((res) => res.json())
    .then((data) => console.log(data));

  console.log(locationNow);
};

const error = (err) => {
  console.warn("Error", err.code, err.message);
};

navigator.geolocation.getCurrentPosition(success, error);
