function loadTimeline() {
    $.ajax({
        type: "GET",
        url: "https://ump45-comp-2537-a.herokuapp.com/timeline/getall",
        success: (data) => {
            console.log("YOUR DATA" + data);

            for (i = 0; i < data.length; i++) {
                $("#timeline-container").prepend(`
                    <div class="timeline-card">
                        <h3>${data[i].text}</h3>
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

function clearTimeline() {
    $.ajax({
        url: `https://ump45-comp-2537-a.herokuapp.com/timeline/clear`,
        type: "GET",
        success: (response) => {
            $('#timeline-container').empty();
        }
    })
}

function increaseHitRequest() {
    $.ajax({
        url: `https://ump45-comp-2537-a.herokuapp.com/timeline/update/${$(this).attr("id")}`,
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
        url: `https://ump45-comp-2537-a.herokuapp.com/timeline/remove/${$(this).attr("id")}`,
        type: "GET",
        success: (response) => {
            console.log("Delete successful");
            $(this).parent().remove();
        }
    })
}

function setup() {
    loadTimeline();

    $('#clear-timeline').click(clearTimeline);

    $('body').on('click', '.like-button', increaseHitRequest);
    $('body').on('click', '.remove-button', removeRequest);
}

$(document).ready(setup);