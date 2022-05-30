function redirectUser(data) {
    if (!data) {
        location.href = 'https://ump45-comp-2537-a.herokuapp.com/index.html'
    }
}

function checkIfAdmin() {
    $.ajax({
        url: 'https://ump45-comp-2537-a.herokuapp.com/isAdmin',
        type: 'GET',
        success: redirectUser
    })
}

function setup() {
    checkIfAdmin();
}

$(document).ready(setup);