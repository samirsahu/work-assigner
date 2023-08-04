
console.log("Work assigner started.");

const url = window.location.href;
console.log("URL", url);

function getNextRandom(max) {
    let rand = 0;
    do {
        rand = Math.floor(Math.random() * max);
    } while (rand <= 0);
    return rand;
}

function playAlarm(maxRun, currentRun) {
    console.log("Play Alarm for ", maxRun, " time. Current run: ", currentRun);
    const myAudio = new Audio();
    // "Source URL: https://www.e2s.com/references-and-guidelines/listen-and-download-alarm-tones"
    myAudio.src = "https://www.e2s.com/system/1/assets/files/000/000/375/375/771bd7a3e/original/TF012.WAV";

    let audioDuration = {"val":0};
    myAudio.addEventListener("loadeddata", () => {
        audioDuration["val"] = myAudio.duration;
        // The duration variable now holds the duration (in seconds) of the audio clip
        console.log("Audio duration: ", audioDuration);
    });
    myAudio.play().then(then=>{
        const timeout = (audioDuration["val"] + 5) * 1000;
        if (currentRun < maxRun) {
            console.log("Replay after seconds: ", timeout);
            setTimeout(() => {
                playAlarm(maxRun, currentRun + 1);
            }, timeout);
        }    
    });
}

// =======================================================
// =======================================================
const autoAssign = false; // Assign or Alarm
const autoBecomeEditor = false;
const refreshMaxTimeout = 20; // in seconds.
const alarmRepeats = 5;
// =======================================================
// =======================================================


if (url == "https://iss-admin.com/folder/instances/491") {
    let isReloadRequired = true;
    const table = document.querySelector("table, .table-bordered")
    if (table) {
        // const preferredShoppers = [
        //     {"shopper":"Elissa Danks"}, 
        //     {"location":"The Refrigeration School, Inc."}
        // ];
        const preferredShops = null;

        const tbody = table.querySelector("tbody");
        const rows = tbody.querySelectorAll("tr");
        let unassignedArticles = [];
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const cells = row.querySelectorAll("td");
            if (cells[1].querySelector("p") == null) {
                // not assigned.
                unassignedArticles.push(row);
                console.log("UnAssigned: ", unassignedArticles.length, row);
            }
        }
        if (unassignedArticles.length > 0) {
            console.log("No of un-assigned items found: ", unassignedArticles.length);

            let rowNumToAssign = 0;
            if (preferredShops) {
                let isAssigned = false;
                for (let i = 0; i < unassignedArticles.length; i++) {
                    const unassignedArticle = unassignedArticles[i];
                    const cells = unassignedArticle.querySelectorAll("td");

                    for (let j = 0; j < preferredShops.length; j++) {
                        const preferredShop = preferredShops[j];

                        let cellToCheck = 0;
                        let valToCheck = "SOME RANDOM NAME";
                        if (preferredShop.shopper) {
                            cellToCheck = 4;
                            valToCheck = preferredShop.shopper;
                        }
                        else if (preferredShop.location) {
                            cellToCheck = 2;
                            valToCheck = preferredShop.location;
                        }
                        if (cells[cellToCheck].innerHTML.indexOf(valToCheck) > -1) {
                            rowNumToAssign = i;
                            isAssigned = true;
                            break;
                        }
                    }
                    if (isAssigned) {
                        break;
                    }
                }
            }

            const rowToAssign = unassignedArticles[rowNumToAssign];
            const cells = rowToAssign.querySelectorAll("td");
            const viewAnchor = cells[8].querySelector("a");

            if (viewAnchor) {
                if (autoAssign) {
                    console.log("Going to click on ", viewAnchor);
                    viewAnchor.click();
                }
                else {
                    // Alarm.
                    playAlarm(alarmRepeats, 1);
                    isReloadRequired = false;
                }
            }
        }
    }
    else {
        console.log("No table found.");
    }
    if (isReloadRequired) {
        const timeout = getNextRandom(refreshMaxTimeout);
        console.log("Reload after seconds: ", timeout);
        setTimeout(() => {
            location.reload();
        }, timeout * 1000);
    }
}
else if (url.startsWith("https://iss-admin.com/shop-instance/pending/")) {
    const becomeEditorBtn = document.querySelector("input[value='Become Editor']");
    console.log("Going to click button", becomeEditorBtn);
    if (autoBecomeEditor) {
        becomeEditorBtn.click();
    }
}
else if (url.startsWith("https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics")) {
    console.log("Google Chrome Dev Site.");
    playAlarm(2, 1);
}
else {
    console.log("Un-supported URL");
}

