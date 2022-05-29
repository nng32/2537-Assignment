var hasFlippedCard = false;
var firstCard = undefined;
var secondCard = undefined;
var ignoreInputs = false;

var interval;
var remainingTime = 0;

function startTimer() {
    if (interval != null) {
        stopTimer();
    }

    let difficultyMultiplier = 1.5;

    switch ($('#difficulty option:selected').val()) {
        case 'easy':
            difficultyMultiplier = 3;
            break;
        case 'medium':
            difficultyMultiplier = 2;
            break;
    }

    remainingTime = Math.floor(rows * columns * difficultyMultiplier);

    interval = setInterval(() => {
        remainingTime -= 1;

        if (remainingTime < 0) {
            $('#alert').html("Mission failed, we'll get'em next time.");
            clearInterval(interval);
        }
        else {
            $('#timer').html(remainingTime.toString().padStart(3, '0'));
        }
    }, 1000)
}

function stopTimer() {
    clearInterval(interval);
}

async function generateGrid() {
    rows = parseInt($('#rows').val());
    columns = parseInt($('#columns').val());
    pairs = rows * columns / 2;

    images = [];

    cardDimensions = $('body').width() / columns - 8;
    gridHeight = (cardDimensions + 5) * rows;

    if (rows * columns % 2 != 0) {
        $('#alert').html('Cards must be an even number.');
        return;
    }

    $('#game-grid').empty();
    $('#alert').html('Starting game');

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

    startTimer();
    ignoreInputs = false;

    $('#game-grid').height(gridHeight);

    $('.game-card').width(cardDimensions);
    $('.game-card').height(cardDimensions);

    $('#game-grid').children().addClass('unlock');
}

function flipClass() {
    console.log('clicked card');

    if (!$(this).attr('class').includes('unlock') || ignoreInputs || remainingTime < 0) {
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

            if (!$('.game-card').hasClass('unlock')) {
                stopTimer();
                $('#alert').html("That's the way it's done.");
            }
        }
        else {
            console.log('Target undamaged');

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
    $('#start').click(generateGrid);
}

$(document).ready(setup);