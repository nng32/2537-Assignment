function processAllUsers(data) {
    data.forEach(user => {
        switch (user.admin) {
            case true:
                adminDisplay = 'Administrator';
                break;
            case false:
                adminDisplay = 'Standard User';
                break;
        }

        $('#user-container').append(`
            <div class="user-card">
                <h3>${user.username}</h3>
                <p><span class="user-first-name">${user.firstName}</span> <span class="user-last-name">${user.lastName}</span></p>
                <p class="user-admin">${adminDisplay}</p>
                <input type="button" id="${user.username}" class="edit-button" value="Edit" />
                <input type="button" id="${user.username}" class="remove-button" value="Remove" />
            </div>
        `)
    })
}

function requestAllUsers() {
    $.ajax({
        url: 'http://localhost:5000/getAllUsers',
        type: 'GET',
        success: processAllUsers
    })
}

function processRemoveUser(data) {
    switch (data) {
        case 'ok':
            $('#alert').html('Successfully deleted user.');
            break;
        case 'delete self':
            $('#alert').html('You cannot delete yourself.');
            break;
    }
}

function requestRemoveUser() {
    $.ajax({
        url: `http://localhost:5000/removeUser/${$(this).attr('id')}`,
        type: 'GET',
        success: processRemoveUser
    })
}

function setup() {
    requestAllUsers();
    $('body').on('click', '.remove-button', requestRemoveUser)
}

$(document).ready(setup);