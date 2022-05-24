var hasFlippedCard = false;
var firstCard = undefined;
var secondCard = undefined;

function flipClass() {
    if ($(this).attr('class').includes('lock')) {
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

        if ($(firstCard).attr('src') == $(secondCard).attr('src')) {
            console.log('Target destroyed');

            firstCard.parent().addClass('lock');
            secondCard.parent().addClass('lock');
        }
        else {
            console.log('Mission failed');

            $('#game-grid').children().removeClass('flip');

            firstCard = undefined;
            secondCard = undefined;

            hasFlippedCard = false;
        }
    }
}

function setup() {
    $('.game-card').click(flipClass);
}

$(document).ready(setup);