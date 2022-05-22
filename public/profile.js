function processResponse(data) {
    switch (data) {
        case 'logged out':
            alert('You are logged out');
            break;
        case 'ok':
            alert('Added to cart');
            break;
    }
}

function addToCart() {
    currentURL = location.href;
    pokeID = currentURL.slice(currentURL.lastIndexOf('/') + 1);

    $.ajax({
        url: 'http://localhost:5000/addToCart',
        type: 'POST',
        data: {
            id: pokeID
        },
        success: processResponse
    })
}

function setup() {
    $('#purchase').click(addToCart);
}

$(document).ready(setup);