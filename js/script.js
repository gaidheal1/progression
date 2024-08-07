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

const playerNameText = document.getElementById('player-name');
const playerPlaceText = document.getElementById('player-place');
const playerXpText = document.getElementById('player-xp');
const playerLevelText = document.getElementById('player-level');
const playerCoinsText = document.getElementById('player-coins');
const playerHpText = document.getElementById('player-hp');

const charNameText = document.getElementById('char-name');
const charPlaceText = document.getElementById('char-place');
const charRoleText = document.getElementById('char-role');

const charXpText = document.getElementById('char-xp');
const charLevelText = document.getElementById('char-level');
const charCoinsText = document.getElementById('char-coins');
const charHpText = document.getElementById('char-hp');

const allPlayer = document.getElementById('player-all');
const allCharacter = document.getElementById('character-all');

const activityContent = document.getElementById('activity-content');
const questContent = document.getElementById('quest-content');
const questFinishedArea = document.getElementById('quest-finished');
const questResultsArea = document.getElementById('quest-results');
const activityStatus = document.getElementById('activity-status');
const questStatus = document.getElementById('quest-status');


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
    return {
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
        // Player doesn't do quests, character does; can delete.
        // Unless implementing player quests later on...
        questsDone: {},
        currentActivity : {},
        status: "resting",
        lastLogin: "",
        loginStreak: 0,
    };
};
//const player = definePlayer();

function defineChar() {
    const name = characterNames[Math.floor(Math.random() * characterNames.length)];
    const place = placeNames[Math.floor(Math.random() * placeNames.length)];
    
    return {
        name: name,
        place: place,
        role: "Scoundrel",
        level: 1,
        xp: 0,
        xpRequired: 100,
        coins: 0,
        hp: 100,
        hpMax: 100,
        currentQuest: {},
        questsDone: {},
        jobs: [],
        status: "resting",
    };
};

//let charJob = "";
//let charJobs = [];

const quests = [
    {
        id: 0,
        title: "Kill rats",
        description: "There are some rats in the field we're trying to farm. If you kill them, we can get back to work. Please help!",
        totalLength: 20,
        stages: [
            {
                text: "Travelling to the field",
                end: 5,
            },
            {
                text: "Fighting the rats",
                end: 12,
            },
            {
                text: "Harvesting the bodies",
                end: 15,
            },
            {
                text: "Travelling back to village",
                end: 20,
            },
        ],
        levelMin: 0,
        levelMax: 10,
        coinReward: 10,
        xpReward: 80,
        time: 0,
        timerStart: 0,
        timeLeft: 0,
        activeStage: 0,
        canRepeat: true,
        results: [],
        needsQuest: [
            {id:2, minimum:1},
        ],
    },
    {
        id: 1,
        title: "Search for scraps",
        description: "If you keep your eyes peeled, you're bound to find something useful, edible, or sellable.",
        totalLength: 10,
        stages: [
            {
                text: "Peering into nooks and crannies",
                end: 8,
            },
            {
                text: "Poring over the various scraps they found",
                end: 10,
            },
        ],
        levelMin: 0,
        levelMax: 10,
        coinReward: 15,
        xpReward: 40,
        time: 0,
        timerStart: 0,
        timeLeft: 0,
        activeStage: 0,
        canRepeat: true,
        results: [],
        needsQuest: [],
    },
    {
        id: 2,
        title: "Test",
        description: "2 stages, both 3 seconds; quest length 6 seconds ",
        totalLength: .1,
        stages: [
            {
                text: "Stage 0",
                end: .05,
            },
            {
                text: "Stage 1",
                end: .1,
            },
        ],
        levelMin: 0,
        levelMax: 20,
        coinReward: 15,
        xpReward: 40,
        time: 0,
        timerStart: 0,
        timeLeft: 0,
        activeStage: 0,
        canRepeat: true,
        results: [],
        needsQuest: [],
    },
    {
        id: 3,
        title: "Looking for a job (Storyline quest)",
        description: "Hopefully you can find someone to teach you a useful trade",
        totalLength: 25,
        stages: [
            {
                text: "Loitering around various shops",
                end: 5,
            },
            {
                text: "Getting chased away from various shops",
                end: 7,
            },
            {
                text: "Following the blacksmith around on her errands",
                end: 18,
            },
            {
                text: "Getting threatened by the blacksmith",
                end: 20,
            },
            {
                text: "Sneaking around behind the blacksmith's shop",
                end: 25,
            },
            
        ],
        levelMin: 2,
        levelMax: 20,
        coinReward: 0,
        xpReward: 80,
        time: 0,
        timerStart: 0,
        timeLeft: 0,
        activeStage: 0,
        canRepeat: false,
        results: [],
        needsQuest: [],
    },
    {
        id: 4,
        title: "Finding a job (Storyline quest)",
        description: "The blacksmith finds you loitering behind her shop! You're in trouble now...",
        totalLength: 25,
        stages: [
            {
                text: "Getting caught by the blacksmith",
                end: 2,
            },
            {
                text: "Getting hauled through the streets by the ear",
                end: 6,
            },
            {
                text: "Being confirmed as a good-for-nothing layabout by people in the town square",
                end: 10,
            },
            {
                text: "Getting taken back and into the blacksmith's lair :O",
                end: 14,
            },
            {
                text: "Being forced to make your mark on a crude apprentice's contract. 'I need an apprentice. You'll do', she says.",
                end: 16,
            },
            {
                text: "Being scrubbed clean by the blacksmith",
                end: 21,
            },
            {
                text: "Being fed and watered by the blacksmith, who gruffly introduces herself: 'Amice'. ",
                end: 25,
            },
            
        ],
        levelMin: 2,
        levelMax: 20,
        coinReward: 0,
        xpReward: 80,
        time: 0,
        timerStart: 0,
        timeLeft: 0,
        activeStage: 0,
        canRepeat: false,
        results: [
            {
				name: "Become blacksmith",
				message: "You are now a blacksmith's apprentice!",
				key: "role",
				change: "Blacksmith's apprentice",
			},
        ],
        needsQuest: [
            {id: 3, minimum: 1}
        ],
    },
    {
        id: 5,
        title: "Work them bellows kid (Trade quest)",
        description: "Now you're an apprentice, you're still miserable, but at least you know how miserable you'll be for at least the next year.",
        totalLength: 20,
        stages: [
            {
                text: "Getting shouted at. The blacksmith yells 'bellows!'. Almost bellows the word, you could say.",
                end: 2,
            },
            {
                text: "Hauling on the bellows, never quite managing the precision Amice demands.",
                end: 18,
            },
            {
                text: "Gasping for breath and breathing furnace-hot air. Amice says 'go' and you flop limply out the room for a jug of ale, knowing you'll hear the call again in a matter of minutes.",
                end: 20,
            },
        ],
        levelMin: 2,
        levelMax: 20,
        coinReward: 0,
        xpReward: 60,
        time: 0,
        timerStart: 0,
        timeLeft: 0,
        activeStage: 0,
        canRepeat: true,
        results: [],
        needsQuest: [
            {id: 4, minimum: 1}
        ],
    },
    {
        id: 6,
        title: "Fetch coke (Trade quest)",
        description: "Amice knits her eyebrows at you as you half collapse in the baking forge room. She drags you to the fuel store, and making sure you're wathing, scoops five scoops of coke into a sack and returns to the forge.",
        totalLength: 5,
        stages: [
            {
                text: "Taking a sack to the coke store.",
                end: 1,
            },
            {
                text: "Piling five scoops of coke into the sack and dragging it to the forge.",
                end: 4,
            },
            {
                text: "Getting yelled at for bringing the wrong amount of fuel, in the wrong way, in the wrong time (too slow, of course, never fast enough).",
                end: 5,
            },
        ],
        levelMin: 3,
        levelMax: 20,
        coinReward: 0,
        xpReward: 20,
        time: 0,
        timerStart: 0,
        timeLeft: 0,
        activeStage: 0,
        canRepeat: true,
        results: [],
        needsQuest: [
            {id: 5, minimum: 10}
        ],
    },
];

// Create object of keys (quest id) and values ('quests' index)
function getQuestIndexArray() {
	const findQuestIds = quests.map((x) => x.id);

	let findQuestIndex = {};
	for (let i = 0; i < findQuestIds.length; i++) {
		findQuestIndex[findQuestIds[i]] = i;
	};
	return findQuestIndex;
};

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

function charactersSetup() {
    let player = {};
    let char = {};
    
    updateMessage("char", "I'm glad you're here.");
    
	// Fetch player from local storage
	playerRetreival = JSON.parse(localStorage.getItem("player"));
    if (playerRetreival !== null) {
        player = playerRetreival;
    }
    else {
        player = definePlayer();
    }
	
	// Fetch character from localstorage
    charRetreival = JSON.parse(localStorage.getItem("char"));
    if (charRetreival !== null) {
        char = charRetreival;
    }
    else {
        char = defineChar();
    }
	
	// If current quest is empty, clear the player attributes in case saved in localstorage
	if (char.currentQuest.id === undefined) {
		player.questJobs = [];
		player.currentActivity = {};
	};
	// In case localstorage data exists from previous version
	if (char.role === undefined) {
		char.role === "Scoundrel";
	};
    return {player, char};
};

const {player, char} = charactersSetup();
const findQuestIndex = getQuestIndexArray();

// Login streak checker 
function checkLoginStreak() {
	let playerMessage = "";
	if (player.lastLogin === undefined) {
		playerMessage = "The beginning of a new login streak!";
		player.lastLogin = new Date();
		player.lastLogin = 1;
		return;
	}
	else if (player.lastLogin === "") {
		playerMessage = "Welcome to Progression!";
	};
	
	let now = new Date("March 1, 2024 12:00:00");
	
	// Calculate leap year
	const nowYear = now.getFullYear();
	const isLeap = year => new Date(year, 1, 29).getDate() === 29;

	// Declare array of days in months
	const monthDays = [31, isLeap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

	const diffMs = now - player.lastLogin;
	const fourDaysMs = 1000 * 60 * 60 * 24 * 4;
	const nowDate = now.getDate();
	const lastLoginDate = player.lastLogin.getDate();
	
	let dateDiff = nowDate - lastLoginDate;

	if (diffMs < fourDaysMs) {			
		if (dateDiff === 0) {
			// First streak check: already logged in today?
			playerMessage = "Welcome back! You last logged in earlier today.";
		}
		else {
			//console.log("Checking whether we go back into previous month");
			if (dateDiff < 0) {
				const nowMonth = now.getMonth();	
				const lastLoginMonth = player.lastLogin.getMonth();
				const lastLoginYear = player.lastLogin.getFullYear();
				// Previous month
				if (nowYear - lastLoginYear === 0) {
					// Last login was previous year
					// Update nowDate to make subtraction possible
					nowDate += monthDays[lastLoginMonth];
				}
				else {
					// Last login was previous year
					// Update nowDate to make subtraction possible
					nowDate += monthDays[11];
				}
			}
			dateDiff = nowDate - lastLoginDate;
			
			// Second streak check
			if (dateDiff === 1) {
				// Player logged in yesterday
				player.loginStreak += 1;
				playerMessage = `Welcome back! First login today: you increased your streak to ${player.loginStreak}!`;
			}
			else {
				// Player logged in before yesterday
				player.loginStreak = 1;
				playerMessage = `Welcome back! You last logged in ${dateDiff} days ago. Login streak reset!`;
			}
		}
	}
	else {
		// Player last logged in > 4 days ago
		player.loginStreak = 1;
		playerMessage = `Welcome back! You last logged in ${dateDiff} days ago. Login streak reset!`;
	};
	// Update player login
	player.lastLogin = now;
	return playerMessage;
};

updateMessage("player", checkLoginStreak());
update();
listQuests();

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
                statusText = "is not selected";
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
    if (player.jobs.length > 0) {
        player.jobs.forEach(job => {
            playerHTML += `<div class="info">You did "${job.name}" for ${Math.ceil(job.time/60000)} minutes
            </div>`
        });
    };
    allPlayer.innerHTML = playerHTML;

    let charHTML = ``
    if (char.jobs.length > 0) {
        char.jobs.forEach(job => {
            charHTML += `<div class="info">${char.name} completed "${job.title}" in ${Math.ceil(job.time/60000)} minutes, and gained ${job.xpReward} XP!
            </div>`
        });
    };
    allCharacter.innerHTML = charHTML;
};

function updateLocalStorage() {
    /*
    const data = [player, char]
    localStorage.setItem("data", JSON.stringify(data));
    */
    //const data1 = player;
    //console.log(player);
    localStorage.setItem("player", JSON.stringify(player));
    localStorage.setItem("char", JSON.stringify(char));
};

function updateInfoText() {
    playerNameText.innerText = player.name;
    playerPlaceText.innerText = player.place;
    playerLevelText.innerText = player.level;
    playerXpText.innerText = `${player.xp}/${player.xpRequired}`;
    playerCoinsText.innerText = player.coins;
    playerHpText.innerText = `${player.hp}/${player.hpMax}`;

    charNameText.innerText = char.name;
    charPlaceText.innerText = char.place;
    charRoleText.innerText = char.role.toLowerCase();
    charLevelText.innerText = `${char.level}; `
    charXpText.innerText = `${char.xp}/${char.xpRequired}`;
    charCoinsText.innerText = char.coins;
    charHpText.innerText = `${char.hp}/${char.hpMax}`;
};

function clearInput() {
    //document.getElementById('task-name').value = "";
};

function update() {
    updateScreen();
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

function setQuestTimeLeft() {
    char.currentQuest.timeLeft = (char.currentQuest.totalLength * 60000) - char.currentQuest.time;
};

function updateQuestTimeLeft() {
    if (char.currentQuest.timeLeft > 0) {
        setQuestTimeLeft();
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
	if (game.questState === "finished") {
		console.log("should show previous activities now");
	}
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
        // If quest is finished or not selected, player can't start activity
        if (game.questState != "paused" && game.questState != "ready") {
            document.getElementById('start-activity-btn').setAttribute("disabled", true);
        }
		
		if (game.questState === "paused") {
			startActivity();
		}
		else {
			document.getElementById('edit-activity-btn').addEventListener("click", editActivity);
			document.getElementById('start-activity-btn').addEventListener("click", startActivity);
		};
        game.activityState = "ready";
    }
    statusUpdate();
};

/*************************************************************************************************/
/*************************************************************************************************/

function startActivity() {
    // Prevent player from starting activity without having selected a quest
    if (game.questState === "none" || game.questState === "finished") {
        updateMessage("player", "Select a quest for your character to complete!");
        updateMessage("char", "I wonder which quest I should choose...");
    }
    // Start activity and quest timers
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
		// Why is this here? Surely it should only be in 'submitQuest' func...
        //player.questJobs.unshift(player.currentActivity);
        
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
};

function pauseActivity() {
    const pauseButton = document.getElementById('pause-activity-btn');
    pauseButton.setAttribute("disabled", true);
    
    timerStop();
    updateTime();
    updateQuestStage();
    // Leave running for testing
    console.log("Quest time: ", char.currentQuest.time/60000);

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

// Add current player activity to questJobs array, update previous activities list on screen
function updateQuestJobs() {
    
};

// 
function submitActivity() {
    if (game.activityState != "paused") {
        pauseActivity();
    }
    updateMessage("player", "You completed an activity: congratulations!");
    
	// Add player current activity to list of quest activities
    player.questJobs.unshift(player.currentActivity);

    
	// If this is first activity submitted during quest , show the list of previous activities
	if (player.questJobs.length === 1) {
		document.getElementById('finished-jobs').removeAttribute('hidden');
	}
	// Add list item to page
	questJobsList.insertAdjacentHTML('afterbegin', `
		<li class="quest-job">${player.currentActivity.name} for ${Math.ceil(player.currentActivity.time/60000)} minutes</li>
	`);
	// Quest not over, choose another activity		
	updateMessage("player", 'Enter another activity to continue the quest.');
	updateMessage("char", "I wish I could continue this quest...");

    player.currentActivity = {};
	
    // Change activity screen to new activity entry
	editActivity();
	
    update();
};


/*           ********               *************************************************************************/
/*      ********  ********          *************************************************************************/
/*   ******            ******       *************************************************************************/
/*  ******              ******                                             **********************************/
/*  ******              ******                  QUEST FUNCTIONS            **********************************/
/*  ******        **    ******                                             **********************************/
/*   ******        *** *****        *************************************************************************/
/*      ********  *******     ***   *************************************************************************/
/*          **********  *******     *************************************************************************/


// List of tests for eligible quests
function checkQuestEligible(quest) {
    let eligible = true;
    console.log('Quest: ', quest.title);
    //console.log('questsDone: ', char.questsDone);
    // Check if quest is repeatable and if so if character has already done it
    if (quest.canRepeat === false) {
        if (char.questsDone[quest.id] >= 1) {
            eligible = false;
        };
    };
    
    // Loop through list of prerequisite quests
    // Quests that SHOULD be ineligible are getting through this section somehow..
    console.log('needsQuest: ', quest.needsQuest);
    console.log('char questsDone: ', char.questsDone);
    quest.needsQuest.forEach(req => {
        const needed = quests[findQuestIndex[req.id]];
        console.log('quest needed title/id: ', needed.id,needed.title);
        console.log(char.questsDone[needed.id]);
        
        if (char.questsDone[needed.id] < req.minimum || char.questsDone[needed.id] === undefined) {
            console.log(`Quest ${quest.title} needs quest ${needed.title} before doing this one!`);
            eligible = false;
        }
        else {
            console.log('done that prerequisite quest!');
        }
    });
    
    // Simple comparison checks
    if (player.level < quest.levelMin ||
        player.level > quest.levelMax
    ) {eligible = false}
    return eligible;
};

function updateQuestStage() {
    const q = char.currentQuest;
    //console.log(q.activeStage, q.stages[q.activeStage])
    // Check current quest stage isn't the last one
    if (q.activeStage < q.stages.length - 1) {
        // Check if time is over next stage's start time
        if (q.time/60000 > q.stages[q.activeStage].end) {
            if (q.activeStage === 0) {
                const stagesHTML = `
                <div id="previous-stages" class="previous-stages-header">
                <h4>Previous quest stages</h4>
                </div>
                <ul id="previous-stages-list" class="previous-stages-list">

                </ul>
                `;
                questContent.insertAdjacentHTML('beforeend', stagesHTML);
            }
            // Loop through stages adding to screen list and updating until correct stage reached
            while (q.time/60000 > q.stages[q.activeStage].end && q.activeStage < q.stages.length - 1) {
                const listHTML = `
                <li id="previous-stage-item">${char.name} was ${q.stages[q.activeStage].text.toLowerCase()}</li>
                `;
                q.activeStage += 1;
                document.getElementById('previous-stages-list').insertAdjacentHTML('afterbegin', listHTML);
            }
            document.getElementById('quest-stage-text').innerText = q.stages[q.activeStage].text.toLowerCase();
        }
    }
};

/*************************************************************************************************/
/*************************************************************************************************/

// Reset various things ready for a new quest
function resetQuest() {
	// This makes use of mutation
    char.currentQuest.time = 0;
    char.currentQuest.timerStart = 0;
    char.currentQuest.activeStage = 0;
    char.currentQuest.timeLeft = char.currentQuest.totalLength * 60000;
    char.currentQuest = {};
	questJobsList.innerHTML = "";
}

function listQuests() {
    // Testing for new quest requirements
	//console.log('char quests: ', char.questsDone[2]>3);
	console.log('How many time does this run?')
    // This should run every time except the first time through
	if (game.questState === "finished") {
        resetQuest();
		if (player.questJobs.length === 0) {
            player.jobs.push(player.currentActivity);
            player.currentActivity.time = 0;
            player.currentActivity.timerStart = 0;
        }
        else {
            player.currentActivity = {};
        }
		// Add items from questJobs to allJobs in the right order
		let newArray = [];
		player.questJobs.forEach(element => {newArray.unshift(element)});
		Array.prototype.push.apply(player.jobs, newArray);
		player.questJobs = [];
		questFinishedArea.setAttribute("hidden", true);
		game.questState ="none";
		statusUpdate();
    };
    document.getElementById('finished-jobs').setAttribute('hidden', true);
    
    // Now starts the code to list quests...
    questContent.innerHTML = `
            <div class="choose-quest">
                <div class="choose-quest-text"><span>Choose a quest from the list below:</span></div>
                <div id="quest-list">
    `;
    quests.forEach(quest => {
        if (checkQuestEligible(quest)) {
            document.getElementById('quest-list').insertAdjacentHTML('afterbegin', `
                <div class="quest-item">
                    <div ><button id="quest-${quest.id}"> ${quest.title}: ${quest.totalLength} minutes</button></div>
                    <div class="quest-description">${quest.description}</div>
                </div>
            `);
			// event listener adds 'start quest' function, basically
            document.getElementById(`quest-${quest.id}`).addEventListener("click", () => {
                game.questState = "ready";
                char.currentQuest = quest;
                // Set quest time remaining in milliseconds
				// Function currently empty!
                setQuestTimeLeft();
                console.log('quest stage text: ', char.currentQuest.stages[0].text)
                questContent.innerHTML = `
                    <div class="quest-title">Title: ${char.currentQuest.title}</div>
                    <div>Time left: <span id="quest-time-left">${char.currentQuest.totalLength}</span> minutes</div>
                    <div class="quest-stage">${char.name} is <span id="quest-stage-text">${char.currentQuest.stages[0].text.toLowerCase()}</span></div>
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
				//console.log("start quest: current quest obj: ", char.currentQuest);
                statusUpdate();
            });
        }
        else {
            console.log(`listQuests: ${quest.title} didn't make it`);
        }
    });
    questContent.insertAdjacentHTML('beforeend', `
        </div>
        </div>  
    `);
    
    game.availableQuests = document.querySelectorAll(".quest-item");
    update();
    return;
};



/*************************************************************************************************/
/*************************************************************************************************/

// Basically updates quest state and adds 'show rewards' button
function questFinished() {
    game.questState = "finished";
    statusUpdate();
        
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
    // Calculate player and character rewards
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

    // Make change for each quest result
    let resultHTML = ``;
	char.currentQuest.results.forEach(result => {
		resultHTML += `<div class="result-item">${result.message}</div>`;
		char[result.key] = result.change;
	});
    if (resultHTML != ``) {
        resultHTML = `<div class="result-text">${resultHTML}</div>`
    };
    document.getElementById('quest-results').innerHTML = rewardHTML + resultHTML;
    document.getElementById('finished-btn-container').innerHTML = `
        <button id="show-quests-btn">Show quests</button>
    `;
    document.getElementById('show-quests-btn').addEventListener("click", listQuests);
    

    // If player clicks 'show rewards' without submitting paused activity:
	if (game.activityState === "paused") {
        //console.log('really runs?');
		// Add player actvitiy to questJobs; clear current activity
        submitActivity();
        //console.log(player.questJobs);    
	};
    char.jobs.unshift(char.currentQuest);

    // Add (or increment) record of this quest completion
    if (char.questsDone[char.currentQuest.id]) {
        char.questsDone[char.currentQuest.id] += 1;
    }
    else {
        char.questsDone[char.currentQuest.id] = 1;
    }

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
