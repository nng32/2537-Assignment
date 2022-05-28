pokemonList = [];
resultList = [];
typeGlobal = "grass";
nameGlobal = "";
lowerWeightGlobal = 0;
upperWeightGlobal = 9000;
currentPage = 1;

function processSingleObject(data) {
    if (typeof(data) == "object") {
        pokemonList.push(data);
    }
}

function paginateMenu() {
    lastPage = Math.ceil(resultList.length / 10);

    currentPage = 1;

    $('#page-numbers').empty();

    for (i = 1; i <= lastPage; i++) {
        pageButton = `<input type="button" value="${i}" class="page-button page-${i}" />`
        $('#page-numbers').append(pageButton)
    }

    $('.page-1').css('color', 'crimson');
}

function changePage() {
    buttonPressed = $(this).val();

    $(`.page-${currentPage}`).css('color', 'black');

    if (buttonPressed == "first") {
        currentPage = 1
    }
    else if (buttonPressed == "last") {
        currentPage = lastPage
    }
    else if (buttonPressed == "prev") {
        if (currentPage > 1) {
            currentPage--
        }
    }
    else if (buttonPressed == "next") {
        if (currentPage < lastPage) {
            currentPage++
        }
    }
    else {
        currentPage = Number(buttonPressed)
    }

    $('.prev').show();
    $('.next').show();

    $(`.page-${currentPage}`).css('color', 'crimson');

    populateResults(currentPage);
}

function populateResults(page) {
    startIndex = 10 * (page - 1);
    stopIndex = Math.min(10 * (page - 1) + 10, resultList.length);

    $('#results').empty();

    for (i = startIndex; i < stopIndex; i++) {
        $('#results').append(
            `<a class="poke-card" id="main-card-${resultList[i].id}" href="./profile/${resultList[i].id}">
                    <h3 class="poke-number">${resultList[i].id}</h3>
                    <img class="poke-image" src="${resultList[i].sprites.other['official-artwork']['front_default']}" />
                    <p class="poke-name">${resultList[i].name}</p>
            </a>`
        )
    }
}

function searchByName() {
    resultList = [];

    targetName = $('#poke-name').val().toLowerCase();

    if (targetName == "") {
        targetName = "pikachu";
        $('#poke-name').val('pikachu');
    }

    console.log(targetType, targetLowerWeight, targetUpperWeight);

    pokemonList.forEach(pokemon => {
        isNameMatching = pokemon.name.includes(targetName);

        if (isNameMatching) {
            resultList.push(pokemon)
        };
    });

    paginateMenu();
    populateResults(1);

    insertNameIntoTimeline(targetName);
}

function applyFilters(saveToHistory) {
    resultList = [];

    targetType = $('#poke-type option:selected').val();
    targetLowerWeight = 0;
    targetUpperWeight = 9000;

    if ($('#lower-weight').val() == "" || isNaN($('#lower-weight').val())) {
        targetLowerWeight = 0;
        $('#lower-weight').val('0');
    }
    else {
        targetLowerWeight = parseFloat($('#lower-weight').val());
    }

    if ($('#upper-weight').val() == "" || isNaN($('#upper-weight').val())) {
        targetUpperWeight = 9000;
        $('#upper-weight').val('9000');
    }
    else {
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
            resultList.push(pokemon);
        };
    });

    paginateMenu();
    populateResults(1);

    if (saveToHistory) {
        insertTypeIntoTimeline(targetType);
    }
}

function saveNameToHistory() {
    nameToSave = $('#poke-name').val();

    $('#history').prepend(
        `<div class="history-card">
            <div class="history-search">
                <p class="history-name">${nameToSave}</p>
            </div>
            <div class="history-remove">
                <p>Remove</p>
            </div>
        </div>`
    )
}

function loadNameFromHistory() {
    nameToLoad = $(this).children().html();

    $('#poke-name').val(nameToLoad);
    searchByName();
}

function saveFilterToHistory() {
    typeToSave = $('#poke-type').val();
    lowerWeightToSave = $('#lower-weight').val();
    upperWeightToSave = $('#upper-weight').val();

    $('#history').prepend(
        `<div class="history-card">
            <div class="history-filter">
                <p class="history-type">${typeToSave}</p>
                <p>of weight <span class="history-lower-weight">${lowerWeightToSave}</span>-<span class="history-upper-weight">${upperWeightToSave}</span></p>
            </div>
            <div class="history-remove">
                <p>Remove</p>
            </div>
        </div>`
    )
}

function loadFilterFromHistory() {
    typeToLoad = $(this).find('.history-type').html();
    lowerWeightToLoad = $(this).find('.history-lower-weight').html();
    upperWeightToLoad = $(this).find('.history-upper-weight').html();

    $('#poke-type').val(typeToLoad);
    $('#lower-weight').val(lowerWeightToLoad);
    $('#upper-weight').val(upperWeightToLoad);

    applyFilters();
}

function removeFromHistory() {
    $(this).parent().remove();
}

function clearHistory() {
    $('#history').empty();
}

async function makeRequest() {
    for (i = 1; i <= 255; i++) {
        await $.ajax({
            type: 'GET',
            url: `https://pokeapi.co/api/v2/pokemon/${i}`,
            success: processSingleObject
        })
    }

    $('#loading-message').remove();
    applyFilters(false);
}

function insertTypeIntoTimeline(pokeType) {
    let timestamp = new Date();

    $.ajax({
        url: "http://localhost:3000/timeline/insert",
        type: "POST",
        data: {
            text: `has filtered for type ${pokeType}`,
            hits: 1,
            time: timestamp.toGMTString()
        },
        success: (response) => {
            console.log(response);
        }
    })
}

function insertNameIntoTimeline(pokeName) {
    let timestamp = new Date();

    $.ajax({
        url: "http://localhost:3000/timeline/insert",
        type: "POST",
        data: {
            text: `has filtered for name ${pokeName}`,
            hits: 1,
            time: timestamp.toGMTString()
        },
        success: (response) => {
            console.log(response);
        }
    })
}

function setup() {
    makeRequest();

    $('#search-filters').click(() => {
        applyFilters(true);
        saveFilterToHistory();
    });
    $('#search-name').click(() => {
        searchByName();
        saveNameToHistory();
    });

    $('body').on('click', '.history-search', loadNameFromHistory);
    $('body').on('click', '.history-filter', loadFilterFromHistory);

    $('body').on('click', '.history-remove', removeFromHistory);
    $('body').on('click', '#clear-history', clearHistory);

    $('body').on('click', '.page-button', changePage);
}

$(document).ready(setup);