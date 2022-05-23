function processResponse(data) {
    switch (data) {
        case 'logged out':
            $('#alert').html('Please <a class="inline-link" href="../login.html">log in</a> to add items to your cart.');
            break;
        case 'ok':
            $('#alert').html(`Added ${parseInt($('#quantity').val())} items to cart.`);
            break;
    }
}

function addToCart() {
    if (isNaN($('#quantity').val()) || parseInt($('#quantity').val()) <= 0 || $('#quantity').val() == '') {
        $('#alert').html('You must enter a positive number.');
        return;
    }

    currentURL = location.href;
    pokeID = parseInt(currentURL.slice(currentURL.lastIndexOf('/') + 1));
    quantity = parseInt($('#quantity').val());

    $.ajax({
        url: `http://localhost:5000/addToCart/${pokeID}/${quantity}`,
        type: 'GET',
        success: processResponse
    })
}

function setup() {
    $('#purchase').click(addToCart);
}

$(document).ready(setup);