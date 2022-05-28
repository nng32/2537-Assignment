function processCheckout(data) {
    timestamp = new Date();

    switch (data) {
        case 'logged out':
            $('#alert').html('You must login to check out your cart.');
            break;
        case 'empty':
            $('#alert').html('You must have at least one item in your cart.');
            break;
        case 'ok':
            $('#alert').html('Checkout complete.');

            $.ajax({
                url: 'http://localhost:3000/timeline/insert',
                type: 'POST',
                data: {
                    text: `has purchased items in cart`,
                    hits: 1,
                    time: timestamp.toGMTString()
                },
                success: response => { }
            })

            location.reload();
            break;
    }
}

function checkout() {
    $.ajax({
        url: 'http://localhost:3000/checkout',
        type: 'GET',
        success: processCheckout
    })
}

async function populateCart(data) {
    if (data == 'logged out') {
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
    $('#clear-cart').show();

    $.ajax({
        url: 'http://localhost:3000/getCart',
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
        url: 'http://localhost:3000/getHistory',
        type: 'GET',
        success: populateHistory
    })
}

function showReceipt() {
    console.log('Showing previous order');

    $('#checkout').hide();
    $('#to-cart').show();
    $('#clear-cart').hide();

    receiptIndex = $(this).attr('id');

    $('#receipt-header').html(`Order #${receiptIndex}`);

    $.ajax({
        url: `http://localhost:3000/getHistory/${receiptIndex}`,
        type: 'GET',
        success: populateCart
    })
}

function processClearCart(data) {
    timestamp = new Date();

    switch (data) {
        case 'empty':
            $('#alert').html('Your cart is already empty!');
            break;
        case 'ok':
            $('#alert').html('Successfully cleared.');
            $('#cart-container').empty();
            $('#subtotal').html('$0');
            $('#tax').html('$0');
            $('#total').html('$0');

            $.ajax({
                url: 'http://localhost:3000/timeline/insert',
                type: 'POST',
                data: {
                    text: `has cleared cart`,
                    hits: 1,
                    time: timestamp.toGMTString()
                },
                success: response => { }
            })
            break;
    }
}

function clearCart() {
    $.ajax({
        url: 'http://localhost:3000/clearCart',
        type: 'GET',
        success: processClearCart
    })


}

function setup() {
    requestCart();
    requestHistory();
    $('#checkout').click(checkout);
    $('#to-cart').click(requestCart);
    $('#clear-cart').click(clearCart);

    $('body').on('click', '.receipt-card', showReceipt);
}

$(document).ready(setup);