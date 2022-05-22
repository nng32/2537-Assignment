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

        $('#cart-container').empty();

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
    $('#receipt-header').html('Cart');
    $('#checkout').show();
    $('#to-cart').hide();

    $.ajax({
        url: 'http://localhost:5000/getCart',
        type: 'GET',
        success: populateCart
    })
}

async function getTotalPrice(cart) {
    let subtotal = 0;

    for (let i = 0; i < cart.length; i++) {
        await $.ajax({
            url: `https://pokeapi.co/api/v2/pokemon/${cart[i].id}`,
            type: 'GET',
            success: itemData => {
                subtotal += itemData.weight * cart[i].qty;
            }
        })
    }

    return {
        'subtotal': subtotal,
        'tax': Math.round(subtotal * 0.12),
        'total': Math.round(subtotal * 1.12)
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

function showReceipt() {
    console.log('Showing previous order');

    $('#checkout').hide();
    $('#to-cart').show();

    receiptIndex = $(this).attr('id');

    $('#receipt-header').html(`Order #${receiptIndex}`);

    $.ajax({
        url: `http://localhost:5000/getHistory/${receiptIndex}`,
        type: 'GET',
        success: populateCart
    })
}

function setup() {
    requestCart();
    requestHistory();
    $('#checkout').click(checkout);
    $('#to-cart').click(requestCart);

    $('body').on('click', '.receipt-card', showReceipt);
}

$(document).ready(setup);