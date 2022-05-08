pokemonList = [];
typeGlobal = "grass";
nameGlobal = "";
lowerWeightGlobal = 0;
upperWeightGlobal = 9000;

function processSingleObject(data) {
    if (typeof(data) == "object") {
        pokemonList.push(data);
    }
}

function searchByName() {
    $('#results').empty();

    targetName = $('#poke-name').val();

    console.log(targetType, targetLowerWeight, targetUpperWeight);

    pokemonList.forEach(pokemon => {
        isNameMatching = targetName == pokemon.name;

        if (isNameMatching) {
            $('#results').append(
                `<a class="poke-card" id="main-card-${pokemon.id}" href="./profile/${pokemon.id}">
                    <h3 class="poke-number">${pokemon.id}</h3>
                    <img class="poke-image" src="${pokemon.sprites.other['official-artwork']['front_default']}" />
                    <p class="poke-name">${pokemon.name} ${pokemon.weight}</p>
                </a>`
            )
        };
    });
}

function applyFilters() {
    $('#results').empty();

    targetType = $('#poke-type option:selected').val();
    targetLowerWeight = 0;
    targetUpperWeight = 9000;

    if ($('#lower-weight').val() == "") {
        targetLowerWeight = 0;
    }
    else if (!isNaN($('#lower-weight').val())) {
        targetLowerWeight = parseFloat($('#lower-weight').val());
    }

    if ($('#upper-weight').val() == "") {
        targetUpperWeight = 9000;
    }
    else if (!isNaN($('#upper-weight').val())) {
        targetUpperWeight = parseFloat($('#upper-weight').val());
    }

    console.log(targetType, targetLowerWeight, targetUpperWeight);

    pokemonList.forEach(pokemon => {
        isTypeMatching = false;

        for (i = 0; i < pokemon.types.length; i++) {
            if (pokemon.types[i].type.name == targetType) {
                isTypeMatching = true;
            };
        }

        isWeightMatching = pokemon.weight >= targetLowerWeight && pokemon.weight <= targetUpperWeight;

        if (isTypeMatching && isWeightMatching) {
            $('#results').append(
                `<a class="poke-card" id="main-card-${pokemon.id}" href="./profile/${pokemon.id}">
                    <h3 class="poke-number">${pokemon.id}</h3>
                    <img class="poke-image" src="${pokemon.sprites.other['official-artwork']['front_default']}" />
                    <p class="poke-name">${pokemon.name} ${pokemon.weight}</p>
                </a>`
            )
        };
    });
}

async function makeRequest() {
    for (i = 1; i <= 200; i++) {
        await $.ajax({
            type: 'GET',
            url: `https://pokeapi.co/api/v2/pokemon/${i}`,
            success: processSingleObject
        })
    }

    applyFilters();
}

function setup() {
    makeRequest();

    $('#search-filters').click(applyFilters);
    $('#search-name').click(searchByName);
}

$(document).ready(setup);