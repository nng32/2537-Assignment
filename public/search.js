resultList = [];
typeGlobal = "";

function processSingleObject(data) {
    for (i = 0; i < data.types.length; i++) {
        if (data.types[i].type.name == typeGlobal) {
            resultList.push(data.id);

            $('main').append(`<p>${data.name}</p>`);
            $('main').append(`<img src="${data.sprites.other['official-artwork']['front_default']}" />`)
        }
    }
}

function display(type) {
    console.log(type);

    $('main').empty();

    typeGlobal = type;

    for (i = 1; i <= 100; i++) {
        $.ajax({
            type: 'GET',
            url: `https://pokeapi.co/api/v2/pokemon/${i}`,
            success: processSingleObject
        })
    }
}

function setup() {
    display($('#poke-type option:selected').val());

    $('#poke-type').change(() => {
        display($('#poke-type option:selected').val());
    })
}

$(document).ready(setup);