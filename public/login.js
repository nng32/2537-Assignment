function processLogin(data) {
    switch (data.status) {
        case "nonexistent":
            $('#alert').html("Could not find user. Please ensure your username is correct.");
            break;
        case "unmatching":
            $('#alert').html("Password does not match.");
            break;
        case "ok":
            $('#alert').html("Login complete.");
            location.href = `./user/${data.username}`;
    }
}

function processSignup(data) {
    switch (data.status) {
        case "already exists":
            $('#alert').html("This username has been already taken.");
            break;
        case "ok":
            $('#alert').html("Signup complete.");
            location.href = `./user/${data.username}`;
    }
}

function loginRequest() {
    console.log(`Attempting login as ${$('#username').val()}`);
    
    if (!$('#username').val().trim() || !$('#password').val()) {
        $('#alert').html('All fields are required.');
        return;
    }
    
    $.ajax({
        url: 'http://localhost:3000/login',
        type: 'POST',
        data: {
            username: $('#username').val().trim(),
            password: $('#password').val()
        },
        success: processLogin
    })
}

function signupRequest() {
    console.log(`Attempting signup as ${$('#username').val()}`);

    if (!$('#username').val().trim() || !$('#password').val()) {
        $('#alert').html('All fields are required.');
        return;
    }

    $.ajax({
        url: 'http://localhost:3000/signup',
        type: 'POST',
        data: {
            username: $('#username').val().trim(),
            password: $('#password').val()
        },
        success: processSignup
    })
}

function processStatus(data) {
    if (data != null && data != undefined && data != "") {
        console.log(`Logged in as ${data}`);
        location.href = `./user/${data}`;
    }
}

function requestStatus() {
    $.ajax({
        url: 'http://localhost:3000/status',
        type: 'GET',
        success: processStatus
    })
}

function setup() {
    requestStatus();
    $('#login').click(loginRequest);
    $('#signup').click(signupRequest);
}

$(document).ready(setup);