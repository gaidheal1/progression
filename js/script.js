const taskMinutes = document.getElementById('task-minutes');
const taskName = document.getElementById('task-name');
const taskInProgress = document.getElementById('task-in-progress');
const taskForm = document.getElementById('task-form')

const editBtn = document.getElementById('edit-btn');
const startButton = document.getElementById('submit');
const finishedButton = document.getElementById('finished-btn');
const currentTaskText = document.getElementById('current-task');
const timeLeftText = document.getElementById('time-left');

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
    name : "Anon",
    place: "Balham",
    level : 1,
    xp : 0,
    jobs : [],
    tempJob : {},
    status: "resting",
};
let char = {
    name: "",
    job: "",
    place: "",
    level: 1,
    xp: 0,
    tempJob: {},
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
player = pageSetup();

function pageSetup() {
    char.name = characterNames[Math.floor(Math.random() * characterNames.length)];
    char.place = placeNames[Math.floor(Math.random() * placeNames.length)];
    document.getElementById('char-name').innerText = char.name
    document.getElementById('char-name2').innerText = char.name
    document.getElementById('char-place').innerText = char.place
    updateMessage("Welcome back!");
    dataRetreival = JSON.parse(localStorage.getItem("data"));
    if (dataRetreival !== null) {
        //const {player, char} = dataRetreival;
        player = dataRetreival;
    }
    else {
        const player = {
            name : "Anon",
            place: "Balham",
            level : 1,
            xp : 0,
            jobs : [],
            tempJob : {},
            status: "resting",
        };
        /*const char = {
            name: "",
            job: "",
            place: "",
            level: 1,
            xp: 0,
            tempJob: {},
        }*/
    }
    update();
    return player;
};
function update() {
    updateScreen();
    updateCharJob();
    updateLocalStorage();
    updatePlayer();
    clearInput();
};
/*
const data = pageSetup();
player = data[0];
char = data[1];
*/
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

function updateCharJob() {
    char.job = characterJobs[Math.floor(Math.random() * characterJobs.length)];
    document.getElementById('char-job').innerText = `${char.job.action}. They say "${char.job.description}"`;
};

function updateLocalStorage() {
    /*
    const data = [player, char]
    localStorage.setItem("data", JSON.stringify(data));
    */
    const data1 = player;
    localStorage.setItem("data", JSON.stringify(data1));
};

function updatePlayer() {
    playerNameText.innerText = player.name;
    playerPlaceText.innerText = player.place;
    levelTextPlayer.innerHTML = `Level ${player.level}; `
    xpTextPlayer.innerHTML = `You have ${player.xp} XP`;
};

function clearInput() {
    taskMinutes.value = "";
    taskName.value = "";
};




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



function startTask() {
    if (player.status === "working") {
        updateMessage("You're already working on a task: come back when you've finished :)");
        return;
    }
    else if (editBtn.innerText == "Save") {
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
        // create job objects
        player.tempJob = {
            id : Date.now(),
            "name" : taskName.value,
            "minutes" : taskMinutesNum,
            "xp" : xpGained,
        };
        char.tempJob = {
            id : Date.now(),
            "name" : char.job.action,
            "minutes" : taskMinutesNum,
            "xp" : xpGained,
        };
        taskInProgress.toggleAttribute("hidden");
        taskForm.toggleAttribute("hidden");
        currentTaskText.innerText = `You are doing this: ${taskName.value}`
        const minutesLeft = calcMinutesLeft();
        timeLeftText.innerHTML = `You have ${minutesLeft} minutes left.`
        player.status = "working";
        //taskInProgress.innerHTML = `<span> Come back in ${taskMinutesNum} minutes!</span>`;
    }
}

function calcMinutesLeft() {
    const now = new Date;
    const jobEnd = player.tempJob.id + (player.tempJob.minutes * 60000)
    const minutesLeft = (jobEnd-now)/60000
    if (minutesLeft < 1 && minutesLeft > 0) {
        return 1;
    }
    else if (minutesLeft > 1) {
        return Math.ceil(minutesLeft);
    }
    else {
        return 0;
    }
};

function endTask() {
    if (finishedButton.innerText === "Finished?") {
        
        const minutesLeft = calcMinutesLeft();
        
        if (minutesLeft == 0) {
            finishedButton.innerText = "Finished!";
            timeLeftText.innerText = "Click for rewards!"
        } 
        else {
            timeLeftText.innerHTML = `Still ${minutesLeft} minutes left to go!`
        }
    }
    else if (finishedButton.innerText === "Finished!") {

        updateMessage("You completed a task: congratulations!");
        
        player.jobs.unshift(player.tempJob);
        player.tempJob = {};
        charJobs.unshift(char.tempJob);
        char.tempJob = {};

        if (player.jobs.length > 1) {
            diff = (player.jobs[0].id - player.jobs[1].id);
            diffMinutes = diff/60000;

            if (diffMinutes > taskMinutesNum && diffMinutes < taskMinutesNum + 5) {
                updateMessage("You are on a streak!");
            };
        };

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
        player.status = "resting";
        update();

        finishedButton.innerText = "Finished?";
        taskInProgress.toggleAttribute("hidden");
        taskForm.toggleAttribute("hidden");
    };
    return;
};

function editPlayer() {
    if (editBtn.innerText == "Edit") {
        if (player.status === "working") {
            updateMessage("You're already working on a task: come back when you've finished :)");
            return;
        }
        else {
            playerNameText.innerHTML = `
                <input id="new-player-name" type="text" placeholder="eg Duncan" class="player-input">`;
            playerPlaceText.innerHTML = `
                <input id="new-player-place" type="text" placeholder="eg Guildford" class="player-input">`;
            document.getElementById('new-player-name').value = player.name;
            document.getElementById('new-player-place').value = player.place;
            editBtn.innerText = "Save";
        };
    }
    else if (editBtn.innerText == "Save") {
        const newPlayerName = document.getElementById('new-player-name').value;
        const newPlayerPlace = document.getElementById('new-player-place').value;
        if (newPlayerName == "" || newPlayerPlace == "") {
            updateMessage("Please enter a name and a place!");
        }
        else if (newPlayerName.length > 15 || newPlayerPlace.length > 15) {
            updateMessage("Please don't enter something longer than 15 characters!");
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

startButton.addEventListener("click", startTask);

finishedButton.addEventListener("click", endTask);

editBtn.addEventListener("click", editPlayer);
