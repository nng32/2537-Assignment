function loadTimeline() {
    $.ajax({
        type: "GET",
        url: "http://localhost:5000/timeline/getall",
        success: (data) => {
            console.log("YOUR DATA" + data);

            for (i = 0; i < data.length; i++) {
                $("article").prepend(`
                    <div class="timeline-card">
                        <p>Text: ${data[i].text}</p>
                        <p>Hits: <span class="timeline-hits">${data[i].hits}</span></p>
                        <p>Time: ${data[i].time}</p>
                        <input type="button" id="${data[i]._id}" class="like-button" value="Like!" />
                        <input type="button" id="${data[i]._id}" class="remove-button" value="Remove" />
                    </div>
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

            console.log("Upvote successful");
            $(this).prev().prev().html(`<p>Hits: <span class="timeline-hits">${previousHits + 1}</span></p>`);
        }
    })
}

function removeRequest() {
    $.ajax({
        url: `http://localhost:5000/timeline/remove/${$(this).attr("id")}`,
        type: "GET",
        success: (response) => {
            console.log("Delete successful");
            $(this).parent().remove();
        }
    })
}

function setup() {
    loadTimeline();

    $('body').on('click', '.like-button', increaseHitRequest);
    $('body').on('click', '.remove-button', removeRequest);
}

$(document).ready(setup);