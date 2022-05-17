function processLogin(data) {
    switch (data) {
        case "nonexistent":
            alert("Could not find user.");
            break;
        case "unmatching":
            alert("Password does not match.");
            break;
        case "ok":
            alert("Login complete.");
    }
}

function processSignup(data) {
    switch (data) {
        case "already exists":
            alert("This username has been already taken.");
            break;
        case "ok":
            alert("Signup complete.");
    }
}

function loginRequest() {

}

function signupRequest() {

}

function setup() {
    $('#login').click(loginRequest);
    $('#signup').click(signupRequest);
}

$(document).ready(setup);