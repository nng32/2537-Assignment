function loadTimeline() {
    $.ajax({
        type: "GET",
        url: "http://localhost:5000/timeline/getall",
        success: (data) => {
            console.log("YOUR DATA" + data);

            for (i = 0; i < data.length; i++) {
                $("article").prepend(`
                    <p>Text: ${data[i].text}</p>
                    <p>Hits: <span class="timeline-hits">${data[i].hits}</span></p>
                    <p>Time: ${data[i].time}</p>
                    <input type="button" id="${data[i]._id}" class="like-button" value="Like!" />
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
            previousHits = parseInt($(this).prev().prev().find('.timeline-hits').html());

            console.log(previousHits);

            $(this).prev().prev().html(`<p>Hits: <span class="timeline-hits">${previousHits + 1}</span></p>`);
        }
    })
}

function setup() {
    loadTimeline();

    $('body').on('click', '.like-button', increaseHitRequest);
}

$(document).ready(setup);