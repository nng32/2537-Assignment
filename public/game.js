var hasFlippedCard = false;
var firstCard = undefined;
var secondCard = undefined;
var ignoreInputs = false;

async function generateGrid() {
    rows = 5;
    columns = 4;
    pairs = 5;
    images = [];

    $('#game-grid').empty();

    // get the art for all pairs
    for (i = 0; i < pairs; i++) {
        pokeID = Math.floor(Math.random() * 898 + 1);

        await $.ajax({
            url: `https://pokeapi.co/api/v2/pokemon/${pokeID}`,
            type: 'GET',
            success: (data) => {
                images.push(data.sprites.other['official-artwork']['front_default']);
                images.push(data.sprites.other['official-artwork']['front_default']);
            }
        })
    }

    for (i = 0; i < pairs * 2; i++) {
        // get a random index from the array of available images
        indexToRemove = Math.floor(Math.random() * images.length);

        // use index to get the URL of the image
        cardImage = images[indexToRemove];

        // append poke card to the game grid
        $('#game-grid').append(`
            <div class="game-card" id="${i}">
                <img class="back-face" src="https://picsum.photos/id/237/200" />
                <img class="front-face" src="${cardImage}" />
            </div>
        `)

        // remove the image from the array of available images
        images.splice(indexToRemove, 1);

        $(`#${i}`).click(flipClass);
    }

    $('#game-grid').children().addClass('unlock');
}

function flipClass() {
    console.log('clicked card');

    if (!$(this).attr('class').includes('unlock') || ignoreInputs) {
        return;
    }

    $(this).toggleClass('flip');

    if (!hasFlippedCard) {
        // this is the first card flipped
        firstCard = $(this).find('.front-face');
        hasFlippedCard = true;
    }
    else {
        // second card flipped
        secondCard = $(this).find('.front-face');

        // unflipping the same card
        if (firstCard.parent().attr('id') == secondCard.parent().attr('id')) {
            resetCardMemory();
            return;
        }

        // the two cards have the same image
        if ($(firstCard).attr('src') == $(secondCard).attr('src')) {
            console.log('Target destroyed');

            firstCard.parent().removeClass('unlock');
            secondCard.parent().removeClass('unlock');

            resetCardMemory();
        }
        else {
            console.log('Mission failed');

            ignoreInputs = true;

            setTimeout(() => {
                $('#game-grid').children('.unlock').removeClass('flip');
                ignoreInputs = false;
            }, 1000);

            resetCardMemory();
        }
    }
}

function resetCardMemory() {
    firstCard = undefined;
    secondCard = undefined;

    hasFlippedCard = false;
}

function setup() {
    generateGrid();
}

$(document).ready(setup);