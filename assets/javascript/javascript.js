$(document).ready(function () {

//display current date and time

let dateTime = moment().format("dddd MMMM Do, YYYY h:mm A");
$('.dateTime').append(dateTime);

let database = firebase.database();

//add button for adding new trains
$('#submit-train').on('click', function (event) {
    event.preventDefault();

    let inputName = $('#input-name').val().trim();
    let inputDestination = $('#input-destination').val().trim();
    let inputTime = moment($('#input-time').val(), "HH:mm").format("HH:mm")
    let inputFrequency = $('#input-frequency').val().trim();

    let newTrain = {
        name: inputName,
        destination: inputDestination,
        time: inputTime,
        frequency: inputFrequency
        };

        //push input info to firebase

        database.ref().push(newTrain);

        //clear out values on form

        $('#input-name').val('');
        $('#input-destination').val('');
        $('#input-time').val('');
        $('#input-frequency').val('');

        });

        //reference database

        database.ref().on('child_added', function (childTrain) {

        let inputName = childTrain.val().name;
        let inputDestination = childTrain.val().destination;
        let inputTime = childTrain.val().time;
        let inputFrequency = childTrain.val().frequency;

        console.log(inputName)
        console.log(inputDestination)
        console.log(inputTime)
        console.log(inputFrequency)

        //logic for minutes away and frequency

        let trainTimeMin = moment(inputTime, "HH:mm").format('mm');
        let trainTimeHour = moment(inputTime, "HH:mm").format('hh');
        let hoursMinutes = trainTimeHour * 60;
        let trainConverted = parseInt(hoursMinutes) + parseInt(trainTimeMin);

        let time = moment().format("HH:mm");
        let timeHour = moment(time, "HH:mm").format('HH');
        let timeHoursMinutes = timeHour * 60;
        let timeMinutes = moment(time, "HH:mm").format('mm');
        let trainTimeConverted = parseInt(timeHoursMinutes) + parseInt(timeMinutes);

        let timeAwayFrom = returnTimeAwayFrom (trainConverted, trainTimeConverted, inputFrequency);
        let nextTrainComing = returnNextTrainComing (timeAwayFrom);

        //append info to HTML

        $(".train-info").append(`
        <tr>
            <td id="inputName" class="text-center">${inputName}</td>
            <td id="inputDestination" class="text-center">${inputDestination}</td>
            <td id="timeAway" class="text-center">${timeAwayFrom}</td>
            <td id="nextTrain" class="text-center">${nextTrainComing}</td>
            <td id="inputFrequency" class="text-center">${inputFrequency}</td>
        </tr>
        `)
    });

});

//loop to find out when next train is coming and arrival time

let returnTimeAwayFrom = function (firstTrainMinutes, timeNow, interval) {

    let firstTime = parseInt(firstTrainMinutes);
    let time = parseInt(timeNow);
    let inter = parseInt(interval);

    for (let m = firstTime; m < 1440; m += inter) {
        if (time < m) {
            let nextTrainComing = (m - time);
            return nextTrainComing;
        }
    }
}

let returnNextTrainComing = function (minutesAway) {
    let now = moment().format("HH:mm");
    let nextArrivalTime = moment(now, "HH:mm").add(minutesAway, 'm').format('hh:mm A');
    return nextArrivalTime;
}