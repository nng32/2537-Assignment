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
        let total = 0;
        let subtotal = 0; // subtotal in cents

        console.log(`Your cart has ${data.cart.length} items`);

        for (let i = 0; i < data.cart.length; i++) {
            await $.ajax({
                url: `https://pokeapi.co/api/v2/pokemon/${data.cart[i].id}`,
                type: 'GET',
                success: itemData => {
                    console.log(data);

                    console.log(i);

                    $('#cart-container').append(`
                        <div class="cart-card">
                            <p>${itemData.name} x${data.cart[i].qty}</p>
                            <p>$${itemData.weight * data.cart[i].qty / 100}</p>
                        </div>
                    `)

                    subtotal += itemData.weight * data.cart[i].qty;
                    total += Math.round(subtotal * 1.12);
                }
            })
        }

        $('#subtotal').html(`$${subtotal / 100}`);
        $('#tax').html(`$${Math.round(subtotal * 0.12) / 100}`);
        $('#total').html(`$${Math.round(subtotal * 1.12) / 100}`);
    }
}

function requestCart() {
    $.ajax({
        url: 'http://localhost:5000/getCart',
        type: 'GET',
        success: populateCart
    })
}

async function getTotalPrice(cart) {
    let subtotal = 0;
    let total = 0;

    for (let i = 0; i < cart.length; i++) {
        await $.ajax({
            url: `https://pokeapi.co/api/v2/pokemon/${cart[i].id}`,
            type: 'GET',
            success: itemData => {
                subtotal += itemData.weight * cart[i].qty;
                total += Math.round(subtotal * 1.12);
            }
        })
    }

    return {
        'subtotal': subtotal,
        'tax': Math.round(subtotal * 0.12),
        'total': total
    }
}

async function populateHistory(data) {
    console.log(data);

    for (let i = 0; i < data.history.length; i++) {
        totals = await getTotalPrice(data.history[i].cart);

        $('#receipt-container').prepend(`
        <div class="receipt-card" id="${i}">
            <h3>#${i}</h3>
            <p>Total: $${totals.total / 100}</p>
        </div>
        `)
    }
}

function requestHistory() {
    $.ajax({
        url: 'http://localhost:5000/getHistory',
        type: 'GET',
        success: populateHistory
    })
}

function setup() {
    requestCart();
    requestHistory();
    $('#purchase').click(addToCart);
    $('#checkout').click(checkout);
}

$(document).ready(setup);