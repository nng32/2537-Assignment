function processEditUser(data) {
    switch (data) {
        case 'ok':
            $('#alert').html('User has been updated.');
            location.href = '../admin.html';
            break;
    }
}

function requestEditUser() {
    userToEdit = location.href.split('/')[location.href.split('/').length - 1];

    $.ajax({
        url: `http://localhost:5000/editUser/${userToEdit}`,
        type: 'POST',
        data: {
            username: $('#username').val(),
            password: $('#password').val(),
            firstName: $('#first-name').val(),
            lastName: $('#last-name').val()
        },
        success: processEditUser
    })
}

function setup() {
    $('#submit').click(requestEditUser);
}

$(document).ready(setup);