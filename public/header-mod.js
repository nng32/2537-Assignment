function modifyHeader(data) {
    if (data != null && data != undefined && data != "") {
        $('#header-login').html('Logout');
        $('#header-login').attr('href', 'http://localhost:3000/logout');

        $('#header-signup').html(data);
        $('#header-signup').attr('href', `http://localhost:3000/user/${data}`);
    }
}

function checkProfile() {
    $.ajax({
        url: 'http://localhost:3000/status',
        type: 'GET',
        success: modifyHeader
    })
}

function setup() {
    checkProfile();
}

$(document).ready(setup);