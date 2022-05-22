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
    quantity = 1;

    $.ajax({
        url: `http://localhost:5000/addToCart/${pokeID}/${quantity}`,
        type: 'GET',
        success: processResponse
    })
}

function processCheckout(data) {

}

function checkout() {
    $.ajax({
        url: 'http://localhost:5000/checkout',
        type: 'GET',
        success: processCheckout
    })
}

async function populateCart(data) {
    if (data == 'logged out') {
        alert('You must be signed in to view your profile.');
        location.href = '../login.html';
        return;
    }
    else {
        let subtotal = 0;

        await data.cart.forEach(item => {
            $.ajax({
                url: `https://pokeapi.co/api/v2/pokemon/${item.id}`,
                type: 'GET',
                success: itemData => {
                    $('#cart-container').append(`
                        <div class="cart-card">
                            <p>${itemData.name} x${item.qty}</p>
                            <p>$${itemData.weight * 0.01 * item.qty}</p>
                        </div>
                    `)

                    subtotal += itemData.weight * 0.01 * item.qty;
                    console.log(subtotal);

                    $('#subtotal').html(subtotal);
                    $('#tax').html(subtotal * 0.12);
                    $('#total').html(subtotal * 1.12);
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