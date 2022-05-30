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
        url: 'https://ump45-comp-2537-a.herokuapp.com/getAllUsers',
        type: 'GET',
        success: processAllUsers
    })
}

function requestRemoveUser() {
    $.ajax({
        url: `https://ump45-comp-2537-a.herokuapp.com/removeUser/${$(this).attr('id')}`,
        type: 'GET',
        success: response => {
            switch (response) {
                case 'ok':
                    $('#alert').html('Successfully deleted user.');
                    $(this).parent().remove();
                    break;
                case 'delete self':
                    $('#alert').html('You cannot delete yourself.');
                    break;
            }
        }
    })
}

function redirectToEditProfile() {
    location.href = `./edit/${$(this).attr('id')}`;
}

function redirectToNewuser() {
    location.href = './new-user.html';
}

function setup() {
    requestAllUsers();
    $('#new-user').click(redirectToNewuser);
    $('body').on('click', '.edit-button', redirectToEditProfile);
    $('body').on('click', '.remove-button', requestRemoveUser);
}

$(document).ready(setup);