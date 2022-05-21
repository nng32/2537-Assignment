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
    console.log(`Attempting login as ${$('#username').val()}`);
    $.ajax({
        url: 'http://localhost:5000/login',
        type: 'POST',
        data: {
            username: $('#username').val(),
            password: $('#password').val()
        },
        success: processLogin
    })
}

function signupRequest() {
    console.log(`Attempting signup as ${$('#username').val()}`);
    $.ajax({
        url: 'http://localhost:5000/signup',
        type: 'POST',
        data: {
            username: $('#username').val(),
            password: $('#password').val()
        },
        success: processSignup
    })
}

function setup() {
    $('#login').click(loginRequest);
    $('#signup').click(signupRequest);
}

$(document).ready(setup);