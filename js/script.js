const taskArea = document.getElementById('task');
const activityButtons = document.getElementById('activity-btns');
const questJobsList = document.getElementById('quest-jobs-list');

const editPlayerButton = document.getElementById('edit-btn');
const startButton = document.getElementById('task-submit');

const playerXpText = document.getElementById('player-xp');
const charXpText = document.getElementById('char-xp');
const playerLevelText = document.getElementById('player-level');
const charLevelText = document.getElementById('char-level');
// const recentPlayer = document.getElementById('player-recent');
// const recentCharacter = document.getElementById('character-recent');

const allPlayer = document.getElementById('player-all');
const allCharacter = document.getElementById('character-all');
const activityContent = document.getElementById('activity-content');
const questContent = document.getElementById('quest-content');
const questFinishedArea = document.getElementById('quest-finished');
const questResultsArea = document.getElementById('quest-results');

const playerNameText = document.getElementById('player-name');
const playerPlaceText = document.getElementById('player-place');
const playerMessageText = document.getElementById('player-messages');
const charMessageText = document.getElementById('char-messages');

let playerMessage = [];
let charMessage = [];

let game = {
    questState: "none",
    activityState: "",
    availableQuests: [],
};

function definePlayer() {
    const player = {
        name : "Anon",
        place: "Balham",
        level : 1,
        xp : 0,
        xpRequired: 100,
        jobs : [],
        questJobs : [],
        questsDone: {},
        currentActivity : {},
        status: "resting",
        coins: 0,
        hp: 100,
        hpMax: 100,
    };
    return player;
};
//const player = definePlayer();

let char = {
    name: "",
    questsDone: [],
    place: "",
    level: 1,
    xp: 0,
    xpRequired: 100,
    hp: 100,
    hpMax: 100,
    currentQuest: {},
};
let charJob = "";
let charJobs = [];

const quests = [
    {
        id: 0,
        title: "Kill rats",
        description: "There are some rats in the field we're trying to farm. If you kill them, we can get back to work. Please help!",
        totalLength: 0.3,
        stages: [
            {
                stageLength: 0,
                text: "Travelling to the field",
            },
            {
                stageLength: 5,
                text: "Fighting the rats",
            },
            {
                stageLength: 10,
                text: "Harvesting the bodies",
            },
            {
                stageLength: 15,
                text: "Travelling back to village",
            },
        ],
        levelMin: 0,
        levelMax: 10,
        coinReward: 10,
        xpReward: 60,
        //time: 0,
        //timerStart: 0,
    },
];

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

function activityStart() {
    game.activityState = "active";
    player.currentActivity.timerStart = Date.now();
    // Update Activity box
    activityButtons.innerHTML = '<button id="pause-activity-btn">Pause</button><button id="finish-activity-btn">Finish and submit</button>';
    document.getElementById('finish-activity-btn').addEventListener("click", endTask);
    document.getElementById('pause-activity-btn').addEventListener("click", pauseTask);
};

function questStart() {
    game.questState = "active";
    char.currentQuest["timerStart"] = Date.now();
    char.currentQuest["time"] = 0;
    updateMessage("char", "I feel a mixture of anticipation and fear starting this quest... but I'm sure I can do it with your help!");
    // Update Quest box
    questContent.innerHTML = `
        <div>Title: ${char.currentQuest.title}</div>
        <div>Time left: <span id="quest-time-left">${char.currentQuest.totalLength}</span> minutes</div>
        <div class="quest-stage">${char.name} is ${char.currentQuest.stages[0].text.toLowerCase()}
    `;
    
};

// List of tests for eligible quests
function checkQuestEligible(quest) {
    if (quest.levelMin > player.level ||
        quest.levelMax < player.level
    ) {return false}
    else {return true}
};


function listQuests() {
    questFinishedArea.setAttribute("hidden", true);
    game.questState ="none";
    player.questJobs = [];
    questContent.innerHTML = `
            <div class="choose-quest">
            <span>Choose a quest from the list below:</span>
            <ul id="quest-list">
    `;
    quests.forEach(quest => {
        //console.log("quest obj: ", quests[0]);
        if (checkQuestEligible(quest)) {
            document.getElementById('quest-list').insertAdjacentHTML('afterbegin', `
                <li class="quest-item"><button id="quest-${quest.id}"> ${quest.title}: ${quest.totalLength} minutes</button></li>
            `);
            document.getElementById(`quest-${quest.id}`).addEventListener("click", () => {
                game.questState = "ready";
                char.currentQuest = quest;
                //console.log("activeQuest obj: ", char.currentQuest);
                if (game.activityState === "ready") {
                    activityStart();
                    questStart();
                }
                else if (game.activityState === "paused") {
                    document.getElementById('pause-activity-btn').removeAttribute("disabled");
                }
                else {
                    updateMessage("player", "Now add an activity and you're good to go!");
                }
            });
        };
    });
    questContent.insertAdjacentHTML('beforeend', `
        </ul>
        </div>  
    `);
    /*
    // Radio button quest selection HTML
    <fieldset id="quest-list">
    <input type="radio" name="quest-choice" id="${quest.id}" class="quest-item" />
    <label for="${quest.id}">${quest.title}: ${quest.totalLength} minutes</label>
    </fieldset>
    <button id="quest-submit">Select quest</button>    
    */
    // Use with radio buttons 
    /*
    document.getElementById('quest-submit').addEventListener("click", () => {
        const chosenQuest = document.querySelector('input[name="quest-choice"]:checked');
        game.questState = "ready";
        char.currentQuest = quests[chosenQuest.id];
        if (game.activityState === "ready") {
            questStart();
        }
        else {
            updateMessage("player", "Now add an activity and you're good to go!");
        }
    });
    */
    game.availableQuests = document.querySelectorAll(".quest-item");
    return;
};

function pageSetup() {
    char.name = characterNames[Math.floor(Math.random() * characterNames.length)];
    char.place = placeNames[Math.floor(Math.random() * placeNames.length)];
    document.getElementById('char-name').innerText = char.name;
    //document.getElementById('char-name2').innerText = char.name;
    document.getElementById('char-place').innerText = char.place;
    updateMessage("player", "Welcome back!");
    updateMessage("char", "I'm glad you're here.");
    dataRetreival = JSON.parse(localStorage.getItem("data"));
    if (dataRetreival !== null) {
        //const {player, char} = dataRetreival;
        player = dataRetreival;
    }
    else {
        player = definePlayer();
    };
        /*const char = {
            name: "",
            job: "",
            place: "",
            level: 1,
            xp: 0,
            currentActivity: {},
        }*/
    
    listQuests();
    update();
    return player;
};

function update() {
    updateScreen();
    updateCharJob();
    updateLocalStorage();
    updatePlayerText();
    clearInput();
};
/*
const data = pageSetup();
player = data[0];
char = data[1];
*/
function updateScreen() {
    let playerHTML = ``;
    
    player.jobs.forEach(job => {
        playerHTML += `<div class="info">You did "${job.name}" for ${Math.ceil(job.time/60000)} minutes
        </div>`
    });
    allPlayer.innerHTML = playerHTML;

    let charHTML = ``
    charJobs.forEach(job => {
        charHTML += `<div class="info">${char.name} completed "${job.title}" in ${Math.ceil(job.time/60000)} minutes, and gained ${job.xpReward} XP!
        </div>`
    });
    allCharacter.innerHTML = charHTML;
};

function updateCharJob() {
    //char.job = characterJobs[Math.floor(Math.random() * characterJobs.length)];
    //document.getElementById('char-job').innerText = `${char.job.action}. They say "${char.job.description}"`;
};

function updateLocalStorage() {
    /*
    const data = [player, char]
    localStorage.setItem("data", JSON.stringify(data));
    */
    const data1 = player;
    localStorage.setItem("data", JSON.stringify(data1));
};

function updatePlayerText() {
    playerNameText.innerText = player.name;
    playerPlaceText.innerText = player.place;
    playerLevelText.innerHTML = `Level ${player.level}; `
    playerXpText.innerHTML = `XP: ${player.xp}/${player.xpRequired}`;
    //charNameText.innerText = char.name;
    //charPlaceText.innerText = char.place;
    charLevelText.innerHTML = `Level ${char.level}; `
    charXpText.innerHTML = `XP: ${char.xp}/${char.xpRequired}`;
};

function clearInput() {
    //document.getElementById('task-name').value = "";
};

function updateMessage(charOrPlayer = "", string = "") {
    let now = new Date;
    now = now.toLocaleString().split(' ');
    let timeStamp = `<span class="timestamp">${now[1]}</span>`

    function makeHTML(arr) {
        arr.unshift(`${timeStamp}: ${string}`)
        if (arr.length > 5) {
            while (arr.length > 5) {
                arr.pop();
            }
        }
        let messageHTML = ``
        arr.forEach(message => {
            messageHTML += `<li>${message}</li>`;
        });
        return messageHTML;
    };
    if (charOrPlayer === "char") {
        charMessageText.innerHTML = makeHTML(charMessage);
    }
    else if (charOrPlayer === "player") {
        playerMessageText.innerHTML = makeHTML(playerMessage);
    }
};

function editTask() {
    game.activityState = "none";
    let taskEntryHTML = `
        <div id="task-entry" class="task-entry">
            <div>
                <label for="task-name" id="task-label" class="task-entry">What are you going to work on?</label>    
                <textarea placeholder="eg washing the dishes" required id="task-name" name="task-entry" cols="30" rows="2" maxlength="80" minlength="4"></textarea>
            </div>
        </div>
    `;
    document.getElementById('task').innerHTML = taskEntryHTML;
    activityButtons.innerHTML = `<button type="button" id="task-submit" class="task-entry">Start task</button>`;
    document.getElementById('task-submit').addEventListener("click", startTask);
};

function startTask() {
    console.log("beg, queststate: ", game.questState)
    const taskName = document.getElementById('task-name');
    if (editPlayerButton.innerText == "Save") {
        updateMessage("player", "Please save new name and place before submitting a task!");
        return;
    }
    /*else if (game.questState === "finished") {
        updateMessage("Please wait until you have selected a new quest!");
        return;
    }*/
    else if (taskName.value == "") {
        updateMessage("player", "Please enter task name!");
        return;
    }
    else if (taskName.value.length > 100 || taskName.value.length < 4) {
        updateMessage("player", "Please enter a task name more than 4 and less than 100 characters!");
        return;
    }
    else {    
        // create job objects
        player.currentActivity = {
            id : Date.now(),
            name : taskName.value,
            time : 0,
            timerStart: 0,
        };
        document.getElementById('task').innerHTML = `
                <div id="task-messages">
                    <div class="current-task-msg">You are doing this: <span id="current-task" class="current-task">${taskName.value}</span></div>
                    <div class="current-task-msg">You have been working for <span id="current-time" class="current-time">0</span> minutes</div>
                </div>
                
        `;
        game.activityState = "ready";
        if (game.questState === "none" || game.questState === "finished") {
            updateMessage("player", "Now select a quest for your character to complete!");
            updateMessage("char", "I wonder which quest I should choose...");
            activityButtons.innerHTML = '<button id="edit-activity-btn">Edit</button>';
            document.getElementById('edit-activity-btn').addEventListener("click", editTask);
        }
        else if (game.questState === "ready") {
            activityStart();
            questStart();
        }
        else if (game.questState === "paused") {
            //game.activityState = "active";
            //player.currentActivity.timerStart = Date.now();
            activityStart();
            game.questState = "active";
            char.currentQuest.timerStart = Date.now()
            console.log("in starttask: ", char.currentQuest);
        }
    }
    console.log("end, queststate: ", game.questState)
};

function calcQuestTimeLeft() {
    return char.currentQuest.totalLength - char.currentQuest.time/60000;
};

function pauseTask(input = "default") {
    const pauseButton = document.getElementById('pause-activity-btn');
    
    if (pauseButton.innerText === "Pause" || input === "Pause") {
        pauseButton.innerText = "Resume";
        
        const now = Date.now();
        game.activityState = "paused";
        player.currentActivity.time += now - player.currentActivity.timerStart;
        
        char.currentQuest.time += now - char.currentQuest.timerStart;
        let questTimeLeft = calcQuestTimeLeft();
        console.log("quest time: ", char.currentQuest.time/60000);
        
        if (questTimeLeft > 0) {
            game.questState = "paused";
            document.getElementById('quest-time-left').innerText = Math.ceil(questTimeLeft);
        }
        else {
            questFinished();
            pauseButton.setAttribute("disabled", true);
        }
        document.getElementById('current-time').innerText = Math.floor(player.currentActivity.time/60000);
    }
    else if (pauseButton.innerText === "Resume" || input === "Resume") {
        if (game.questState === "ready") {
             activityStart();
             questStart();
        }
        else {
            game.activityState = "active";
            game.questState = "active";
            player.currentActivity.timerStart = Date.now();
            char.currentQuest.timerStart = Date.now();
        }
        pauseButton.innerText = "Pause";
    }
};

function questFinished() {
    document.getElementById('quest-time-left').innerText = 0;

    game.questState = "finished";
    const newArray = [];
    player.questJobs.forEach(element => {newArray.unshift(element)});
    player.jobs.concat(newArray);

    // Record quest completion
    if (char.questsDone[char.currentQuest.id]) {
        char.questsDone[char.currentQuest.id] += 1;
    }
    else {
        char.questsDone[char.currentQuest.id] = 1;
    }
    player.status = "resting";
    char.status = "resting";
    // Update Quest box
    questFinishedArea.removeAttribute('hidden');
    document.getElementById('finished-btn-container').innerHTML = `
                <button id="rewards-btn">Show rewards</button>
        `;
    document.getElementById('rewards-btn').addEventListener("click", showRewards);
};

function showRewards() {
    player.xp += char.currentQuest.xpReward;
    char.xp += char.currentQuest.xpReward;
    player.coins += char.currentQuest.coinReward;
    char.coins += char.currentQuest.coinReward;

    console.log('char.currentquest: ', char.currentQuest);
    function levelUpCheck(object) {
        let = xpRequired = object.level * 100;
        if (object.xp > xpRequired) {
            while(object.xp>xpRequired) {
                object.level += 1;
                object.xp -= xpRequired;
                xpRequired = object.level * 100;
            };
            object.xpRequired = xpRequired;
            return true;
        };
    };
    let isLevelUp = false;
    isLevelUp = levelUpCheck(player);
    if (isLevelUp) {
        updateMessage("player", `You levelled up! You are now level ${player.level}`)
    }
    isLevelUp = levelUpCheck(char);
    if (isLevelUp) {
        updateMessage("char", `I feel stronger somehow! (${char.name} levelled up! They are now level ${char.level})`)
    }
    updatePlayerText();

    let rewardHTML = `
        <div class="reward-text">
            ${char.name} finished the quest! You both get ${char.currentQuest.xpReward}xp and ${char.currentQuest.coinReward} coins.
        </div>`;

    document.getElementById('quest-results').innerHTML = rewardHTML;
    document.getElementById('finished-btn-container').innerHTML = `
        <button id="show-quests-btn">Show quests</button>
    `;
    document.getElementById('show-quests-btn').addEventListener("click", listQuests);
    player.questJobs = [];
    console.log(char.currentQuest);
    char.currentQuest.time = 0;
    char.currentQuest.timerStart = 0;
    char.currentQuest = {};

    update();
};

function endTask() {
    pauseTask("Pause");
    const questTimeLeft = calcQuestTimeLeft();
    //const questTimeLeft = char.currentQuest.totalLength - (Math.ceil(char.currentQuest.time/60000))

    updateMessage("player", "You completed an activity: congratulations!");
    player.questJobs.unshift(player.currentActivity);
    // Check if activities already added during quest
    if (player.questJobs.length == 1) {
        document.getElementById('finished-jobs').toggleAttribute('hidden');
    }
    questJobsList.insertAdjacentHTML('afterbegin', `
        <li class="quest-job">${player.currentActivity.name} for ${Math.ceil(player.currentActivity.time/60000)} minutes</li>
    `);
    // Quest over 
    if (questTimeLeft <= 0 && game.questState != "finished") {
        //console.log('both.gif?');
        //questFinished();
    } 
    // Quest not over, choose another activity
    else {
        updateMessage("player", 'Enter another activity to continue the quest.');
        updateMessage("char", "I wish I could continue this quest...");
        // Update Quest box
        // Update Activity box

    }
    editTask();
    
    
    player.jobs.unshift(player.currentActivity);
    player.currentActivity = {};
    charJobs.unshift(char.currentQuest);
    char.currentQuest = {};
    
};

function editPlayer() {
    if (editPlayerButton.innerText == "Edit") {
        if (player.activityState === "active") {
            updateMessage("player", "You're already working on a task: come back when you've finished :)");
            return;
        }
        else {
            playerNameText.innerHTML = `
                <input id="new-player-name" type="text" placeholder="eg Duncan" class="player-input">`;
            playerPlaceText.innerHTML = `
                <input id="new-player-place" type="text" placeholder="eg Guildford" class="player-input">`;
            document.getElementById('new-player-name').value = player.name;
            document.getElementById('new-player-place').value = player.place;
            editPlayerButton.innerText = "Save";
        };
    }
    else if (editPlayerButton.innerText == "Save") {
        const newPlayerName = document.getElementById('new-player-name').value;
        const newPlayerPlace = document.getElementById('new-player-place').value;
        if (newPlayerName == "" || newPlayerPlace == "") {
            updateMessage("player", "Please enter a name and a place!");
        }
        else if (newPlayerName.length > 15 || newPlayerPlace.length > 15) {
            updateMessage("player", "Please don't enter something longer than 15 characters!");
        }
        else {
            player.name = newPlayerName;
            player.place = newPlayerPlace;
            updatePlayerText();
            editPlayerButton.innerText = "Edit";
            updateLocalStorage();
          }
    }
};

startButton.addEventListener("click", startTask);

//finishedButton.addEventListener("click", endTask);

editPlayerButton.addEventListener("click", editPlayer);







// Code originally from "startTask" function.
/*
const taskMinutesNum = Number(taskMinutes.value);
        
        xpGained = taskMinutesNum * 3;
        // create job objects
        player.currentActivity = {
            id : Date.now(),
            "name" : taskName.value,
            "minutes" : taskMinutesNum,
            "xp" : xpGained,
        };
        char.currentQuest = {
            id : Date.now(),
            "name" : char.job.action,
            "minutes" : taskMinutesNum,
            "xp" : xpGained,
        };
        taskArea.toggleAttribute("hidden");
        taskForm.toggleAttribute("hidden");
        currentTaskText.innerText = `You are doing this: ${taskName.value}`
        const minutesLeft = calcMinutesLeft();
        timeLeftText.innerHTML = `You have ${minutesLeft} minutes left.`
        player.status = "working";
        //taskArea.innerHTML = `<span> Come back in ${taskMinutesNum} minutes!</span>`;
    
*/