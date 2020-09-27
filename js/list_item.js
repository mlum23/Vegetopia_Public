function wee() {
    firebase.auth().onAuthStateChanged(function (user) {
        let meet_up = document.getElementById("meet_up").value;
        let loc = ["https://maps.google.com/maps?q=east%20hastings&t=&z=13&ie=UTF8&iwloc=&output=embed",
            "https://maps.google.com/maps?q=stanley%20park&t=&z=13&ie=UTF8&iwloc=&output=embed",
            "https://maps.google.com/maps?q=metrotown&t=&z=13&ie=UTF8&iwloc=&output=embed"];
        let x = "";
        if (meet_up == "east_hastings") {
            x += loc[0];
        }
        else if (meet_up == "stanley_park") {
            x += loc[1]
        }
        else if (meet_up == "metrotown") {
            x += loc[2];
        }
        firebase.database().ref("share/" + user.uid).update(
            {
                "meetup": x

            });
    })
}

function description() {
    firebase.auth().onAuthStateChanged(function (user) {

        firebase.database().ref("share/" + user.uid).update(
            {
                "description": document.getElementById("description").value,
                "title": document.getElementById("title_share").value

            });
    });
}
