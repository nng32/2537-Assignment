var total = 0;

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
    pokeID = parseInt(currentURL.slice(currentURL.lastIndexOf('/') + 1));
    quantity = parseInt($('#quantity').val());

    $.ajax({
        url: `http://localhost:5000/addToCart/${pokeID}/${quantity}`,
        type: 'GET',
        success: processResponse
    })
}

function processCheckout(data) {
    switch (data) {
        case 'logged out':
            alert('You are logged out');
            break;
        case 'ok':
            alert('Checkout complete');
            break;
    }
}

function checkout() {
    $.ajax({
        url: 'http://localhost:5000/checkout',
        type: 'POST',
        data: {
            'total': total
        },
        success: processCheckout
    })
}

function populateCart(data) {
    if (data == 'logged out') {
        alert('You must be signed in to view your profile.');
        location.href = '../login.html';
        return;
    }
    else {
        let subtotal = 0; // subtotal in cents

        data.cart.forEach(item => {
            $.ajax({
                url: `https://pokeapi.co/api/v2/pokemon/${item.id}`,
                type: 'GET',
                success: itemData => {
                    $('#cart-container').append(`
                        <div class="cart-card">
                            <p>${itemData.name} x${item.qty}</p>
                            <p>$${itemData.weight * item.qty / 100}</p>
                        </div>
                    `)

                    subtotal += itemData.weight * item.qty;
                    total += Math.round(subtotal * 1.12);

                    $('#subtotal').html(`$${subtotal / 100}`);
                    $('#tax').html(`$${Math.round(subtotal * 0.12) / 100}`);
                    $('#total').html(`$${Math.round(subtotal * 1.12) / 100}`);
                }
            })
        })
    }
}

function requestCart() {
    $.ajax({
        url: 'http://localhost:5000/getCart',
        type: 'GET',
        success: populateCart
    })
}

function setup() {
    requestCart();
    $('#purchase').click(addToCart);
    $('#checkout').click(checkout);
}

$(document).ready(setup);