function loadTimeline() {
    $.ajax({
        type: "GET",
        url: "http://localhost:5000/timeline/getall",
        success: (data) => {
            console.log(data);

            for (i = 0; i < data.length; i++) {
                $("article").html(`
                    <p>Text: ${data[i].text}</p>
                    <p>Hits: ${data[i].hits}</p>
                    <p>Time: ${data[i].time}</p>
                    <input type="button" id="${data[i][_id]}" class="like-button" value="Like!" />
                `);
            }
        }
    })
}

function increaseHitRequest() {
    $.ajax({
        url: `http://localhost:5000/timeline/update/${$(this).attr("id")}`,
        type: "GET",
        success: (response) => {

        }
    })
}

function setup() {
    loadTimeline();

    $('body').on('click', '.like-button', increaseHitRequest);
}

$(document).ready(setup);