function processNewUser(data) {
    switch (data) {
        case 'already exists':
            $('#alert').html('Username already exists.');
            break;
        case 'ok':
            $('#alert').html('User has been created.');
            location.href = '../admin.html';
            break;
    }
}

function requestNewUser() {
    if (!$('#username').val().trim() || !$('#password').val() || !$('#first-name').val() || !$('#last-name').val()) {
        $('#alert').html('All fields are required.');
        return;
    }
    
    $.ajax({
        url: `http://localhost:5000/newUser`,
        type: 'POST',
        data: {
            username: $('#username').val().trim(),
            password: $('#password').val(),
            firstName: $('#first-name').val().trim(),
            lastName: $('#last-name').val().trim(),
            admin: $('#admin').prop('checked')
        },
        success: processNewUser
    })
}

function setup() {
    $('#submit').click(requestNewUser);
}

$(document).ready(setup);