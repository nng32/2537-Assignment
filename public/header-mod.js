function modifyHeader(data) {
    if (data != null && data != undefined && data != "") {
        $('#header-login').html('Logout');
        $('#header-login').attr('href', 'https://ump45-comp-2537-a.herokuapp.com/logout');

        $('#header-signup').html(data);
        $('#header-signup').attr('href', `https://ump45-comp-2537-a.herokuapp.com/user/${data}`);
    }
}

function addAdminToHeader(data) {
    if (data) {
        $('header').prepend(`
            <a href="https://ump45-comp-2537-a.herokuapp.com/admin.html" class="authlink" id="header-dashboard">Dashboard</a>
        `)
    }
}

function checkProfile() {
    $.ajax({
        url: 'https://ump45-comp-2537-a.herokuapp.com/status',
        type: 'GET',
        success: modifyHeader
    })

    $.ajax({
        url: 'https://ump45-comp-2537-a.herokuapp.com/isAdmin',
        type: 'GET',
        success: addAdminToHeader
    })
}

function setup() {
    checkProfile();
}

$(document).ready(setup);