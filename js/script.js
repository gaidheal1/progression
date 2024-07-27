/***********************************************************************************************************/
/***********************************************************************************************************/
/***********************************************************************************************************/
/**********************************                                       **********************************/
/**********************************                 SETUP                 **********************************/
/**********************************                                       **********************************/
/***********************************************************************************************************/
/***********************************************************************************************************/
/***********************************************************************************************************/


const taskArea = document.getElementById('task');
const activityButtons = document.getElementById('activity-btns');
const questJobsList = document.getElementById('quest-jobs-list');

const editPlayerButton = document.getElementById('edit-btn');
const startButton = document.getElementById('task-submit');

const playerXpText = document.getElementById('player-xp');
const charXpText = document.getElementById('char-xp');
const playerLevelText = document.getElementById('player-level');
const charLevelText = document.getElementById('char-level');

const allPlayer = document.getElementById('player-all');
const allCharacter = document.getElementById('character-all');

const activityContent = document.getElementById('activity-content');
const questContent = document.getElementById('quest-content');
const questFinishedArea = document.getElementById('quest-finished');
const questResultsArea = document.getElementById('quest-results');
const activityStatus = document.getElementById('activity-status');
const questStatus = document.getElementById('quest-status');

const playerNameText = document.getElementById('player-name');
const playerPlaceText = document.getElementById('player-place');
const playerMessageText = document.getElementById('player-messages');
const charMessageText = document.getElementById('char-messages');

let playerMessage = [];
let charMessage = [];

let game = {
    questState: "none",
    activityState: "none",
    availableQuests: [],
};

function definePlayer() {
    const player = {
        name : "Anon",
        place: "Balham",
        level : 1,
        xp : 0,
        xpRequired: 100,
        coins: 0,
        hp: 100,
        hpMax: 100,
        jobs : [],
        questJobs : [],
        questsDone: {},
        currentActivity : {},
        status: "resting",
    };
    return player;
};
//const player = definePlayer();

let char = {
    name: "",
    place: "",
    level: 1,
    xp: 0,
    xpRequired: 100,
    hp: 100,
    hpMax: 100,
    currentQuest: {},
    questsDone: [],
    status: "resting",
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
        time: 0,
        timerStart: 0,
        timeLeft: 0,
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

/*************************************************************************************************/
/*************************************************************************************************/

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

player = pageSetup();


/***********************************************************************************************************/
/***********************************************************************************************************/
/***********************************************************************************************************/
/**********************************                                       **********************************/
/**********************************           UPDATE FUNCTIONS            **********************************/
/**********************************                                       **********************************/
/***********************************************************************************************************/
/***********************************************************************************************************/
/***********************************************************************************************************/


function statusUpdate() {
    function makeStatusText(status) {
        let statusText = "";
        switch (status) {
            case "paused":
                statusText = "is paused";
                break;
            case "none":
                statusText = "is inactive";
                break;
            case "active":
                statusText = "is active!";
                break;
            case "finished":
                statusText = "is finished";
                break;
            case "ready":
                statusText = "is ready to start";
                break;
            case "editing":
            statusText = "is being edited";
                break;
            default:
                break;
        }
        return statusText;
    }
    activityStatus.innerText = "Activity " + makeStatusText(game.activityState);
    questStatus.innerText = "Quest " + makeStatusText(game.questState);
};

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

function updateInfoText() {
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

function update() {
    updateScreen();
    //updateCharJob();
    updateLocalStorage();
    updateInfoText();
    clearInput();
};

/*************************************************************************************************/
/*************************************************************************************************/

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


/***********************************************************************************************************/
/***********************************************************************************************************/
/***********************************************************************************************************/
/**********************************                                       **********************************/
/**********************************             TIMER FUNCTIONS           **********************************/
/**********************************                                       **********************************/
/***********************************************************************************************************/
/***********************************************************************************************************/
/***********************************************************************************************************/


function timerStart() {
    game.activityState = "active";
    player.currentActivity.timerStart = Date.now();
    game.questState = "active";
    char.currentQuest.timerStart = Date.now();
    statusUpdate();
};

function updateQuestTimeLeft() {
    if (char.currentQuest.timeLeft > 0) {
        char.currentQuest.timeLeft = (char.currentQuest.totalLength * 60000) - char.currentQuest.time;
        if (char.currentQuest.timeLeft <= 0) {
            char.currentQuest.timeLeft = 0;
        }
    }
};

function timerStop() {
    game.activityState = "paused";
    game.questState = "paused";
    const now = Date.now();
    player.currentActivity.time += now - player.currentActivity.timerStart;
    char.currentQuest.time += now - char.currentQuest.timerStart;
    updateQuestTimeLeft();
    statusUpdate();
};


/***********************************************************************************************************/
/***********************************************************************************************************/
/***********************************************************************************************************/
/**********************************                                       **********************************/
/**********************************           ACTIVITY FUNCTIONS          **********************************/
/**********************************                                       **********************************/
/***********************************************************************************************************/
/***********************************************************************************************************/
/***********************************************************************************************************/


function editActivity() {
    game.activityState = "editing";
    let taskEntryHTML = `
        <div id="task-entry" class="task-entry">
            <div>
                <label for="task-name" id="task-label" class="task-entry">What are you going to work on?</label>    
                <textarea placeholder="eg washing the dishes" required id="task-name" name="task-entry" cols="30" rows="2" maxlength="80" minlength="4"></textarea>
            </div>
        </div>
    `;
    document.getElementById('task').innerHTML = taskEntryHTML;
    if (player.currentActivity.name) {
        document.getElementById('task-name').innerText = player.currentActivity.name;
    };
    activityButtons.innerHTML = `<button type="button" id="task-submit" class="task-entry">Enter activity</button>`;
    document.getElementById('task-submit').addEventListener("click", prepActivity);
    statusUpdate();
};

/*************************************************************************************************/
/*************************************************************************************************/

function prepActivity() {
    const taskName = document.getElementById('task-name');
    if (taskName.value == "") {
        updateMessage("player", "Please enter task name!");
        return;
    }
    else if (taskName.value.length > 100 || taskName.value.length < 4) {
        updateMessage("player", "Please enter a task name more than 4 and fewer than 100 characters!");
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
        activityButtons.innerHTML = `
            <button id="edit-activity-btn">Edit activity</button>
            <button id="start-activity-btn" >Start activity</button>
        `;
        if (game.questState != "paused") {
            document.getElementById('start-activity-btn').setAttribute("disabled", true);
        }
        document.getElementById('edit-activity-btn').addEventListener("click", editActivity);
        document.getElementById('start-activity-btn').addEventListener("click", startActivity);
        game.activityState = "ready";
    }
    statusUpdate();
};

/*************************************************************************************************/
/*************************************************************************************************/

function startActivity() {
    if (game.questState === "none" || game.questState === "finished") {
        updateMessage("player", "Select a quest for your character to complete!");
        updateMessage("char", "I wonder which quest I should choose...");
    }
    else if (game.questState === "ready" || game.questState === "paused") {
        //if (game.questState === "ready") {
            activityButtons.innerHTML = `
                <button id="pause-activity-btn">Pause</button>
                <button id="resume-activity-btn" disabled="true">Resume</button>
                <button id="finish-activity-btn">Finish and submit</button>
            `;
            document.getElementById('finish-activity-btn').addEventListener("click", submitActivity);
            document.getElementById('pause-activity-btn').addEventListener("click", pauseActivity);
            document.getElementById('resume-activity-btn').addEventListener("click", resumeActivity);
        //}
        timerStart();
        console.log(game.questState)
    }
};

/*************************************************************************************************/
/*************************************************************************************************/

function updateTime() {
    document.getElementById('current-time').innerText = Math.floor(player.currentActivity.time/60000);

    if (char.currentQuest.timeLeft == 0) {
        document.getElementById('quest-time-left').innerText = 0;    
    }
    document.getElementById('quest-time-left').innerText = Math.ceil(char.currentQuest.timeLeft/60000);
}

function pauseActivity() {
    const pauseButton = document.getElementById('pause-activity-btn');
    pauseButton.setAttribute("disabled", true);
    
    timerStop();
    updateTime();
    console.log("quest time: ", char.currentQuest.time/60000);
    console.log(char.currentQuest.timeLeft);

    if (char.currentQuest.timeLeft <= 0) {
        console.log('runs?');
        questFinished();
        document.getElementById('resume-activity-btn').setAttribute("disabled", true);
    }
    else {
        document.getElementById('resume-activity-btn').removeAttribute("disabled");
    }
};

function resumeActivity () {
    timerStart();
    document.getElementById('resume-activity-btn').setAttribute("disabled", true);
    document.getElementById('pause-activity-btn').removeAttribute("disabled");
};

/*************************************************************************************************/
/*************************************************************************************************/

function submitActivity() {
    if (game.activityState != "paused") {
        pauseActivity();
    }
    
    updateMessage("player", "You completed an activity: congratulations!");
    player.questJobs.unshift(player.currentActivity);
    // Check if activities already added during quest
    if (player.questJobs.length == 1) {
        document.getElementById('finished-jobs').toggleAttribute('hidden');
    }
    questJobsList.insertAdjacentHTML('afterbegin', `
        <li class="quest-job">${player.currentActivity.name} for ${Math.ceil(player.currentActivity.time/60000)} minutes</li>
    `);
    
    // Quest not over, choose another activity
    if (char.currentQuest.timeLeft > 0) {
        updateMessage("player", 'Enter another activity to continue the quest.');
        updateMessage("char", "I wish I could continue this quest...");
    }
    player.currentActivity = {};
    editActivity();

};


/*           ********               *************************************************************************/
/*      ********  ********          *************************************************************************/
/*   ******            ******       *************************************************************************/
/*  ******              ******                                             **********************************/
/*  ******              ******                  QUEST FUNCTIONS            **********************************/
/*  ******        **    ******                                             **********************************/
/*   ******        *** ******       *************************************************************************/
/*      ********  *******     ***  *************************************************************************/
/*          **********   *****      *************************************************************************/


// List of tests for eligible quests
function checkQuestEligible(quest) {
    if (quest.levelMin > player.level ||
        quest.levelMax < player.level
    ) {return false}
    else {return true}
};

function setQuestTimeLeft() {
    char.currentQuest.timeLeft = char.currentQuest.totalLength * 60000;
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
                // Set quest time remaining in milliseconds
                setQuestTimeLeft();
                questContent.innerHTML = `
                    <div>Title: ${char.currentQuest.title}</div>
                    <div>Time left: <span id="quest-time-left">${char.currentQuest.totalLength}</span> minutes</div>
                    <div class="quest-stage">${char.name} is ${char.currentQuest.stages[0].text.toLowerCase()}
                `;
                if (game.activityState === "paused") {
                    document.getElementById('resume-activity-btn').removeAttribute("disabled");
                }
                else if (game.activityState === "none") {
                    updateMessage("player", "Now add an activity and you're good to go!");
                }
                else if (game.activityState === "ready") {
                    updateMessage("player", "Hit start to get going!");
                    document.getElementById('start-activity-btn').removeAttribute("disabled");
                } 
                statusUpdate();
            });
        };
    });
    questContent.insertAdjacentHTML('beforeend', `
        </ul>
        </div>  
    `);
    
    game.availableQuests = document.querySelectorAll(".quest-item");
    return;
};

/*************************************************************************************************/
/*************************************************************************************************/

function questFinished() {
    game.questState = "finished";
    const newArray = [];
    player.questJobs.forEach(element => {newArray.unshift(element)});
    player.jobs.concat(newArray);
    charJobs.unshift(char.currentQuest);
    
    // Record quest completion
    if (char.questsDone[char.currentQuest.id]) {
        char.questsDone[char.currentQuest.id] += 1;
    }
    else {
        char.questsDone[char.currentQuest.id] = 1;
    }
    
    // Update Quest box
    questFinishedArea.removeAttribute('hidden');
    document.getElementById('finished-btn-container').innerHTML = `
                <button id="rewards-btn">Show rewards</button>
        `;
    document.getElementById('rewards-btn').addEventListener("click", showRewards);

    update();
};

/*************************************************************************************************/
/*************************************************************************************************/

function showRewards() {
    player.xp += char.currentQuest.xpReward;
    char.xp += char.currentQuest.xpReward;
    player.coins += char.currentQuest.coinReward;
    char.coins += char.currentQuest.coinReward;

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
    // Player and character xp, coins etc in top bar
    updateInfoText();

    let rewardHTML = `
        <div class="reward-text">
            ${char.name} finished the quest! You both get ${char.currentQuest.xpReward}xp and ${char.currentQuest.coinReward} coins.
        </div>`;

    document.getElementById('quest-results').innerHTML = rewardHTML;
    document.getElementById('finished-btn-container').innerHTML = `
        <button id="show-quests-btn">Show quests</button>
    `;
    document.getElementById('show-quests-btn').addEventListener("click", listQuests);
    
    // Reset various things ready for a new quest
    player.questJobs = [];
    char.currentQuest.time = 0;
    char.currentQuest.timerStart = 0;
    setQuestTimeLeft();
    char.currentQuest = {};

    update();
};


/***********************************************************************************************************/
/***********************************************************************************************************/
/***********************************************************************************************************/
/**********************************                                       **********************************/
/**********************************                 OTHER                 **********************************/
/**********************************                                       **********************************/
/***********************************************************************************************************/
/***********************************************************************************************************/
/***********************************************************************************************************/


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
            updateInfoText();
            editPlayerButton.innerText = "Edit";
            updateLocalStorage();
          }
    }
};

startButton.addEventListener("click", prepActivity);

editPlayerButton.addEventListener("click", editPlayer);


/**********************************************************************************/
/**********************************************************************************/