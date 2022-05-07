function processSingleObject(data) {
    $('.image-container').append(
        `<a class="poke-card" id="main-card-${data.id}" href="./profile/${data.id}">
            <h3 class="poke-number">${data.id}</h3>
            <img class="poke-image" src="${data.sprites.other['official-artwork']['front_default']}" />
            <p class="poke-name">${data.name}</p>
        </a>`
    )
}

function makeRequest() {
    for (i = 0; i < 9; i++) {
        randomID = Math.floor(Math.random() * 1000);

        console.log(randomID);

        $.ajax({
            type: 'GET',
            url: `https://pokeapi.co/api/v2/pokemon/${randomID}`,
            success: processSingleObject
        })        
    }
}

function setup() {
    makeRequest();
}

$(document).ready(setup);