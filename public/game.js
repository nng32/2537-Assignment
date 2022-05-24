var hasFlippedCard = false;
var firstCard = undefined;
var secondCard = undefined;
var ignoreInputs = false;

function flipClass() {
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

        if (firstCard.parent().attr('id') == secondCard.parent().attr('id')) {
            resetCardMemory();
            return;
        }

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
    $('.game-card').click(flipClass);
    $('#game-grid').children().addClass('unlock');
}

$(document).ready(setup);