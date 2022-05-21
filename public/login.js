function processLogin(data) {
    switch (data) {
        case "nonexistent":
            $('#alert').html("Could not find user. Please ensure your username is correct.");
            break;
        case "unmatching":
            $('#alert').html("Password does not match.");
            break;
        case "ok":
            $('#alert').html("Login complete.");
    }
}

function processSignup(data) {
    switch (data) {
        case "already exists":
            $('#alert').html("This username has been already taken.");
            break;
        case "ok":
            $('#alert').html("Signup complete.");
    }
}

function loginRequest() {
    console.log(`Attempting login as ${$('#username').val()}`);
    
    if (!$('#username').val() || !$('#password').val()) {
        $('#alert').html('All fields are required.');
        return;
    }
    
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

    if (!$('#username').val() || !$('#password').val()) {
        $('#alert').html('All fields are required.');
        return;
    }

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