var jwt = localStorage.getItem("jwt");
if (jwt != null) {
  window.location.href = './index.html'
}
function send() {
  window.location.href = './register.html'
}
function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", "http://demo2.z-bit.ee/users/get-token");
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify({
    "username": username,
    "password": password
  }));
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      const objects = JSON.parse(this.responseText);
      console.log(objects['access_token']);
      if (objects['access_token']) {
        localStorage.setItem("jwt", objects['access_token']);
        Swal.fire({
          text: "Logged In Successfully!",
          icon: 'success',
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = './index.html';
          }
        });
      } else {
        Swal.fire({
          text: objects['message'],
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    }
  };
  return false;
}