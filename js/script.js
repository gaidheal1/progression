const taskMinutes = document.getElementById('task-minutes');
const taskName = document.getElementById('task-name');
const finishedButton = document.getElementById('submit');
const editBtn = document.getElementById('edit-btn');
const xpTextPlayer = document.getElementById('player-xp');
const xpTextChar = document.getElementById('char-xp');
const levelTextPlayer = document.getElementById('player-level');
const levelTextChar = document.getElementById('char-level');
// const recentPlayer = document.getElementById('player-recent');
// const recentCharacter = document.getElementById('character-recent');

const allPlayer = document.getElementById('player-all');
const allCharacter = document.getElementById('character-all');

const playerNameText = document.getElementById('player-name');
const playerPlaceText = document.getElementById('player-place');
const playerMessageText = document.getElementById('player-messages');

let userMessage = [];
let xpGained = 0
let player = {
    name : "",
    place: "",
    level : 1,
    xp : 0,
    jobs : [],
};
let char = {
    name: "",
    job: "",
    place: "",
    level: 1,
    xp: 0,
};
let charJob = "";
let charJobs = [];

const characterJobs = [
    {
        action: "washing the dishes",
        description: "gettin all the grime off",
        minLevel: 0,
    },
    {
        action: "fetching coal",
        description: "goin out, gettin coal, comin back",
        minLevel: 0,
    },
    {
        action: "chopping firewood",
        description: "heft that axe, baby",
        minLevel: 0,
    },
    {
        action: "cooking dinner",
        description: "boil em, mash em, stick em in a stew",
        minLevel: 0,
    },
    {
        action: "filing a petition",
        description: "man these petitions better be doin some good",
        minLevel: 3,
    },
    {
        action: "forging a spork",
        description: "this'll come in handy some day",
        minLevel: 0,
    },
]

const characterNames = [
    "Arthur",
    "Ingrid",
    "Elsa",
    "Anna",
    "Oliver",
]

const placeNames = [
    "Lancelot",
    "Camelot",
    "Edinburgh",
    "Missississippi",
]

function updateCharJob() {
    char.job = characterJobs[Math.floor(Math.random() * characterJobs.length)];
    document.getElementById('char-job').innerText = `${char.job.action}. They say "${char.job.description}"`;
};
function updateLocalStorage() {
  localStorage.setItem("player", JSON.stringify(player));
}
function updatePlayer() {
    playerNameText.innerHTML = player.name;
    playerPlaceText.innerHTML = player.place;
    levelTextPlayer.innerHTML = player.level;
    levelTextPlayer.innerHTML = `Level ${player.level}; `
    xpTextPlayer.innerHTML = `You have ${player.xp} XP`;
}

function pageSetup() {
    char.name = characterNames[Math.floor(Math.random() * characterNames.length)];
    char.place = placeNames[Math.floor(Math.random() * placeNames.length)];
    document.getElementById('char-name').innerText = char.name
    document.getElementById('char-name2').innerText = char.name
    document.getElementById('char-place').innerText = char.place
    updateMessage("Welcome back!");
    playerRetreival = JSON.parse(localStorage.getItem("player"));
    if (playerRetreival !== null) {
        player = playerRetreival;
    }
    update();
    return;
}

function clearInput() {
  taskMinutes.value = "";
  taskName.value = "";
}
pageSetup();

function levelUpCheck(level, xp) {
    let xpRequired = level * 100;
    if (xp < xpRequired) {
        return false;
    }
    else {
        while(xp>xpRequired) {
            level += 1;
            xp -= xpRequired;
            xpRequired = level * 100;
        }
        return [level, xp];
    }
};

function updateScreen() {
    let allHTML = ``;
    player.jobs.forEach(task => {
        allHTML += `<div class="info">You completed "${task.name}" in ${task.minutes} minutes, and gained ${task.xp} XP!
        </div>`
    });
    allPlayer.innerHTML = allHTML;

    allHTML = ``
    charJobs.forEach(task => {
        allHTML += `<div class="info">${char.name} completed "${task.name}" in ${task.minutes} minutes, and gained ${task.xp} XP!
        </div>`
    });
    allCharacter.innerHTML = allHTML;
};

function updateMessage(string) {
    let now = new Date();
    now = now.toLocaleString().split(' ');
    let timeStamp = `<span class="timestamp">${now[1]}</span>`

    userMessage.unshift(`${timeStamp}: ${string}`)
    if (userMessage.length > 5) {
        while (userMessage.length > 5) {
            userMessage.pop();
        }
    }
    let allHTML = ``
    userMessage.forEach(message => {
        allHTML += `<li>${message}</li>`;
    });
    playerMessageText.innerHTML = allHTML;
};

function update() {
    updateScreen();
    updateCharJob();
    updateLocalStorage();
    clearInput();
};

function taskSubmit() {

    let string = "";

    if (editBtn.innerText == "Save") {
        updateMessage("Please save new name and place before submitting a task!");
        return;
    }
    else if (taskMinutes.value == "" || taskName.value == "") {
        updateMessage("Please enter task name and time!");
        return;

    }
    else if (taskMinutes.value.length > 3 || taskName.value.length > 100) {
        updateMessage("Please enter a task name less than 100 characters and a number below 1000!");
        return;
    }

    else {
        const taskMinutesNum = Number(taskMinutes.value);
        xpGained = taskMinutesNum * 3;

        updateMessage("You completed a task: congratulations!");
        console.log(player.jobs);
        player.jobs.unshift(
            {
                id : Date.now(),
                "name" : taskName.value,
                "minutes" : taskMinutesNum,
                "xp" : xpGained,
            }
        );

        if (player.jobs.length > 1) {
            diff = (player.jobs[0].id - player.jobs[1].id);
            diffMinutes = diff/60000;

            if (diffMinutes > taskMinutesNum && diffMinutes < taskMinutesNum + 5) {
                updateMessage("You are on a streak!");
            };
        };

        charJobs.unshift(
            {
                "name" : char.job.action,
                "minutes" : taskMinutesNum,
                "xp" : xpGained,
            }
        );

        isLevelUp = false;
        player.xp += xpGained;
        char.xp += xpGained;
        isLevelUp = levelUpCheck(player.level, player.xp);
        if (isLevelUp) {
            player.level = isLevelUp[0];
            player.xp = isLevelUp[1];
            levelTextPlayer.innerHTML = `Level ${player.level}; `
            updateMessage(`You levelled up! You are now level ${player.level}`)

        }
        isLevelUp = levelUpCheck(char.level, char.xp);
        if (isLevelUp) {
            char.level = isLevelUp[0];
            char.xp = isLevelUp[1];
            levelTextChar.innerHTML = `Level ${char.level}; `
        }

        xpTextPlayer.innerHTML = `You have ${player.xp} XP`;
        xpTextChar.innerHTML = `${char.name} has ${char.xp} XP`;


        update();
    }
    //return;
};

function editPlayer() {
    if (editBtn.innerText == "Edit") {
        playerNameText.innerHTML = `
            <input id="new-player-name" type="text" placeholder="eg Duncan" class="player-input">`;
        playerPlaceText.innerHTML = `
            <input id="new-player-place" type="text" placeholder="eg Guildford" class="player-input">`;
        document.getElementById('new-player-name').value = player.name;
        document.getElementById('new-player-place').value = player.place;
        editBtn.innerText = "Save";
    }
    else if (editBtn.innerText == "Save") {
        const newPlayerName = document.getElementById('new-player-name').value;
        const newPlayerPlace = document.getElementById('new-player-place').value;
        if (newPlayerName == "" || newPlayerPlace == "") {
            updateMessage("Please enter a name and a place!");
        }
        else if (newPlayerName.length > 15 || newPlayerPlace.length > 15) {
            updateMessage("Please don't enter something over 15 characters!");
        }
        else {
            player.name = newPlayerName;
            player.place = newPlayerPlace;
            updatePlayer();
            editBtn.innerText = "Edit";
            updateLocalStorage();
          }
    }
};

finishedButton.addEventListener("click", taskSubmit);

editBtn.addEventListener("click", editPlayer);
