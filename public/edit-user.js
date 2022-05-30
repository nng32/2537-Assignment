function processEditUser(data) {
    switch (data) {
        case 'already exists':
            $('#alert').html('Username already exists.');
            break;
        case 'ok':
            $('#alert').html('User has been updated.');
            location.href = '../admin.html';
            break;
    }
}

function requestEditUser() {
    userToEdit = location.href.split('/')[location.href.split('/').length - 1];

    if (!$('#username').val().trim() || !$('#first-name').val() || !$('#last-name').val()) {
        $('#alert').html('All fields are required.');
        return;
    }

    $.ajax({
        url: `https://ump45-comp-2537-a.herokuapp.com/editUser/${userToEdit}`,
        type: 'POST',
        data: {
            username: $('#username').val().trim(),
            password: $('#password').val(),
            firstName: $('#first-name').val().trim(),
            lastName: $('#last-name').val().trim()
        },
        success: processEditUser
    })
}

function setup() {
    $('#submit').click(requestEditUser);
}

$(document).ready(setup);