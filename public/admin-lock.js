function redirectUser(data) {
    if (!data) {
        location.href = 'http://localhost:5000/index.html'
    }
}

function checkIfAdmin() {
    $.ajax({
        url: 'http://localhost:5000/isAdmin',
        type: 'GET',
        success: redirectUser
    })
}

function setup() {
    checkIfAdmin();
}

$(document).ready(setup);