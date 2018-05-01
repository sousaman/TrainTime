$(document).ready(function () {

    // Global Variables
    var trainCount = 0;
    var now = moment();
    console.log(now.format("LT"));
    var tbody = $("#trains")
        .children()
        .eq(1)

    // Runs on initialization

    var config = {
        apiKey: "AIzaSyBWBlWGSvpcWDlE6XIOaI-SCNDVKWbC6nc",
        authDomain: "traintime-d5c5e.firebaseapp.com",
        databaseURL: "https://traintime-d5c5e.firebaseio.com",
        projectId: "traintime-d5c5e",
        storageBucket: "traintime-d5c5e.appspot.com",
        messagingSenderId: "998932823617"
    };
    firebase.initializeApp(config);
    var database = firebase.database();

    // Creates buttons for all the positions in the positions array to pushes them to the top of the table
    // Assigns 2 data attributes to be used in the On Click event
    database.ref().on("child_added", function (childSnapshot, prevChildKey) {
        var fullDatabase = childSnapshot.val();
        var name = fullDatabase.name;
            var dest = fullDatabase.destination;
            var freq = parseInt(fullDatabase.frequency);
            var time = moment(now.format("ll") + " " + fullDatabase.trainTime);
            var departTime = function () {
                if (time < now) {
                    time = time.add(freq, "m");
                    console.log(time.format("LLL"));
                    departTime();
                }
            }
            departTime();
            var minutesAway = time.diff(now, "m");
            var nextArrival = time.format("LT");
            tbody.append("<tr></tr>");
            var tr = tbody.children().eq(trainCount);
            tr.append("<th></th><th scope='row'></th><td></td><td></td><td></td>");
            var th = tr.children("th");
            var td = tr.children("td");
            th.eq(0).append(name);

            th.eq(1).text(dest);

            td.eq(0).text(freq);

            td.eq(1).text(nextArrival);

            td.eq(2).text(minutesAway);

            trainCount++
        
    })

    // On Click Events

    $("#submit").on("click", function () {
        event.preventDefault();
        var trainName = $("#trainName").val().trim();
        var destination = $("#destination").val().trim();
        var trainTime = $("#trainTime").val().trim();
        var frequency = $("#frequency").val().trim();
        var train = {
            name: trainName,
            destination: destination,
            trainTime: trainTime,
            frequency: frequency
        }
        database.ref().push(train);
        $("#trainName").val("");
        $("#destination").val("");
        $("#trainTime").val("");
        $("#frequency").val("");
    });

    /*     // On click of one of the position buttons, the data attributes for that button are saved
        // They are used to update the table name and create the URL strings
        $(".positionButtons").on("click", function() {
            count = 1;
            var posFilter = $(this).data('data-position');
            var posCount = $(this).data('data-count');
            $("#tableLable").text('Top ' + posCount + ' ' + posFilter + 's');
            tbody.text("");

            // If D/ST is clicked, come through this code (D/ST needs a separate call to provide the necessary info)
            if (posFilter === "D/ST") {

                var myUrl = "https://api.fantasydata.net/v3/nfl/stats/JSON/FantasyDefenseBySeason/" + lastYear;

                // Ajax call with my subscription key to pull back D/ST data
                $.ajax({
                        headers: {
                            'Ocp-Apim-Subscription-Key': subscriptionKey,
                        },
                        url: myUrl
                    })
                    .done(function(response) {

                        // Once the call returns, sort object array in descending order of point scored
                        var DefSt = response.sort(objectSort("-FantasyPoints"));

                        // For 0 to posCount, append table elements to the table
                        for (var i = 0; i < posCount; i++) {

                            tbody.append("<tr></tr>");
                            var tr = tbody.children().eq(i);
                            tr.append("<th></th><th scope='row'></th><td></td><td></td><td></td><td></td>");
                            var th = tr.children("th");
                            var td = tr.children("td");


                            // Create Choose button
                            var button = $("<button>");
                            button.attr("class", "btn btn-danger playerButtons");
                            button.data("data-rank", count);
                            button.data("data-team", response[i].Team);
                            button.data("data-points", response[i].FantasyPoints);
                            button.text("Choose");

                            // Appends Choose button to first row of table
                            th.eq(0).append(button);

                            // Puts the ranking in second row of table
                            th.eq(1).text(count);

                            // Place team name in fourth row of table, third row of table skipped since this represent team D/ST
                            td.eq(1).text(response[i].Team);

                            // Places fantasy points scored last season in sixth row of table, fifth row skipped since no team has a jersey number
                            td.eq(3).text(response[i].FantasyPoints);

                            // Add 1 to ranking count
                            count++;

                        }
                    });

            } else {

                var myUrl = "https://api.fantasydata.net/v3/nfl/stats/JSON/SeasonLeagueLeaders/" + lastYear + "/" + posFilter + "/FantasyPoints";

                $.ajax({
                        headers: {
                            'Ocp-Apim-Subscription-Key': subscriptionKey,
                        },
                        url: myUrl
                    })
                    .done(function(response) {

                        for (var i = 0; i < posCount; i++) {

                            tbody.append("<tr></tr>");
                            var tr = tbody.children().eq(i);
                            tr.append("<th></th><th scope='row'></th><td></td><td></td><td></td><td></td>");
                            var th = tr.children("th");
                            var td = tr.children("td");

                            var button = $("<button>");
                            button.attr("class", "btn btn-danger playerButtons");
                            button.data("data-playerId", response[i].PlayerID);
                            button.data("data-rank", count);
                            button.data("data-name", response[i].Name);
                            button.data("data-team", response[i].Team);
                            button.data("data-number", response[i].Number);
                            button.data("data-points", response[i].FantasyPoints);
                            button.text("Choose");

                            th.eq(0).append(button);

                            th.eq(1).text(count);

                            td.eq(0).text(response[i].Name);

                            td.eq(1).text(response[i].Team);

                            td.eq(2).text(response[i].Number);

                            td.eq(3).text(response[i].FantasyPoints);

                            count++;

                        }

                    });

            }

        });

        $(document).on("click", ".playerButtons", function() {

            // Save the data attributes saved to the player buttons
            var dataPlayerId = $(this).data('data-playerId');
            var dataRank = $(this).data('data-rank');
            var dataName = $(this).data('data-name');
            var dataNumber = $(this).data('data-number');
            var dataTeam = $(this).data('data-team');
            var dataPoints = $(this).data('data-points');

            // If there are less than 10 picks, then add the data attributes of the clicked button to that Saved table
            if (pickCount < 10) {

                picks.append("<tr></tr>");
                var tr = picks.children().eq(pickCount);
                tr.data("data-playerId", dataPlayerId);
                tr.append("<th></th><th scope='row'></th><td></td><td></td><td></td><td></td>");
                var th = tr.children("th");
                var td = tr.children("td");
                pickCount++;
                
                th.eq(0).text(pickCount);

                th.eq(1).text(dataRank);

                td.eq(0).text(dataName);

                td.eq(1).text(dataTeam);

                td.eq(2).text(dataNumber);

                td.eq(3).text(dataPoints);

            } else { // If you try to choose more than 10 picks, this warning message appears
                $("#warning").text("Ten is the maximum number of players you can choose at once. Click Continue or clear your picks to add more players");
            }


        });


        // On click of the clear button, clear the picks out of the picks table and the warning message is there is one
        $("#clear").on("click", function() {
            picks.text("");
            $("#warning").text("");
        }); */


});