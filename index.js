const success = (pos) => {
  let crd = pos.coords;
  let lat = crd.latitude;
  let lon = crd.longitude;
  console.log(crd.latitude);
  console.log(crd.longitude);
  //   console.log(pos, "pos");
};

const error = (err) => {
  console.warn("Error", err.code, err.message);
};

navigator.geolocation.getCurrentPosition(success, error);
