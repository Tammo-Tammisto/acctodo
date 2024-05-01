var jwt = localStorage.getItem("jwt");
if (jwt != null) {
    window.location.href = './index.html'
}

function register() {
    const username = document.getElementById("username").value;
    const firstname = document.getElementById("firstname").value;
    const lastname = document.getElementById("lastname").value;
    const password = document.getElementById("password").value;

    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://demo2.z-bit.ee/users");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify({
        "username": username,
        "firstname": firstname,
        "lastname": lastname,
        "newPassword": password
    }));
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            const objects = JSON.parse(this.responseText);
            console.log(objects['access_token']);
            if (objects['access_token']) {
                localStorage.setItem("jwt", objects['access_token']);
                Swal.fire({
                    text: "Account Registered Successfully!",
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