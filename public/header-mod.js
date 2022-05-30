function modifyHeader(data) {
    if (data != null && data != undefined && data != "") {
        $('#header-login').html('Logout');
        $('#header-login').attr('href', 'http://localhost:5000/logout');

        $('#header-signup').html(data);
        $('#header-signup').attr('href', `http://localhost:5000/user/${data}`);
    }
}

function addAdminToHeader(data) {
    if (data) {
        $('header').prepend(`
            <a href="http://localhost:5000/admin.html" class="authlink" id="header-dashboard">Dashboard</a>
        `)
    }
}

function checkProfile() {
    $.ajax({
        url: 'http://localhost:5000/status',
        type: 'GET',
        success: modifyHeader
    })

    $.ajax({
        url: 'http://localhost:5000/isAdmin',
        type: 'GET',
        success: addAdminToHeader
    })
}

function setup() {
    checkProfile();
}

$(document).ready(setup);