resultList = [];
typeGlobal = "grass";
nameGlobal = "";
lowerWeightGlobal = 0;
upperWeightGlobal = 9000;

function processSingleObject(data) {
    if (typeof(data) == "object") {
        resultList.push(data);
    }
}

function applyFilters() {
    $('#results').empty();

    console.log(typeGlobal, lowerWeightGlobal, upperWeightGlobal);

    resultList.forEach(pokemon => {
        isTypeMatching = false;

        console.log(pokemon.id, pokemon.types)

        for (i = 0; i < pokemon.types.length; i++) {
            if (pokemon.types[i].type.name == typeGlobal) {
                isTypeMatching = true;
            };
        }

        isWeightMatching = pokemon.weight >= lowerWeightGlobal && pokemon.weight <= upperWeightGlobal;
        isNameMatching = nameGlobal == pokemon.name;

        if (isTypeMatching && isWeightMatching && nameGlobal == "" || isNameMatching) {
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

async function display() {
    for (i = 1; i <= 50; i++) {
        await $.ajax({
            type: 'GET',
            url: `https://pokeapi.co/api/v2/pokemon/${i}`,
            success: processSingleObject
        })
    }

    applyFilters();
}

function setup() {
    display();

    $('#poke-type').change(() => {
        typeGlobal = $('#poke-type option:selected').val();
        applyFilters();
    });

    $('#lower-weight').change(() => {
        if ($('#lower-weight').val() == "") {
            lowerWeightGlobal = 0;
            applyFilters();
        }

        else if (!isNaN($('#lower-weight').val())) {
            lowerWeightGlobal = parseFloat($('#lower-weight').val());
            applyFilters();
        }
    });

    $('#upper-weight').change(() => {
        if ($('#upper-weight').val() == "") {
            upperWeightGlobal = 9000;
            applyFilters();
        }

        else if (!isNaN($('#upper-weight').val())) {
            upperWeightGlobal = parseFloat($('#upper-weight').val());
            applyFilters();
        }
    });

    $('#poke-name').change(() => {
        nameGlobal = $('#poke-name').val();
        applyFilters();
    })
}

$(document).ready(setup);