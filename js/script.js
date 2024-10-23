/***********************************************************************************************************/
/***********************************************************************************************************/
/***********************************************************************************************************/
/**********************************                                       **********************************/
/**********************************           CLASS DEFINITIONS           **********************************/
/**********************************                                       **********************************/
/***********************************************************************************************************/
/***********************************************************************************************************/
/***********************************************************************************************************/


class Timer {
    constructor(elementId, countUp = true, countdownFrom = 0) {
      this.element = document.getElementById(elementId);
      this.countUp = countUp;
      this.countdownFrom = countdownFrom;
      this.intervalId = null;
      this.time = countUp ? 0 : countdownFrom;
      this.startTime = 0;
      this.isRunning = false;
    }
    start(duration) {
        if (this.isRunning) return;
        if (!this.countUp) console.log("hi")
        this.isRunning = true;
        this.startTime = Date.now();
        this.time = duration;
        console.log("countup: ", this.countUp, ", this.time: ", this.time);
    
        game.activityState = "active";
        game.questState = "active";
        statusUpdate();

        this.intervalId = setInterval(() => {
            const elapsedTime = Date.now() - this.startTime;
            const time = this.countUp ? this.time + elapsedTime : this.time - elapsedTime;
            this.display(time);
            
            console.log("time: ", time);
            if (!this.countUp) {
                if (this.countdownFrom - this.time > char.currentQuest.stages[char.currentQuest.activeStage].end) {
                    char.currentQuest.updateStage();
                }
                if (time <= 0) {
                    this.stop();
                    this.display(0);
                    pauseActivity();
                    questFinished();
                    document.getElementById('resume-activity-btn').setAttribute("disabled", true);
                }
            }
        }, 1000);
      }
    
    stop() {
        if (!this.isRunning) return;

        clearInterval(this.intervalId);
        this.isRunning = false;
        console.log("countup: ", this.countUp, ", this.time: ", this.time);
        this.time = this.countUp ? Date.now() - this.startTime : this.time - (Date.now() - this.startTime);

        game.activityState = "paused";
        game.questState = "paused";
        statusUpdate();
    }
    
    reset() {
        this.stop();
        this.time = 0;
        this.display(0);
    }
    display(time) {
        const days = Math.floor(time / (1000 * 60 * 60 * 24));
        const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((time % (1000 * 60)) / 1000);

        let displayString = '';
        if (days > 0) displayString += `${days}d `;
        if (hours > 0 || days > 0) displayString += `${hours.toString().padStart(2, '0')}:`;
        displayString += `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        this.element.textContent = displayString;
    }
};

/*************************************************************************************************/
/*************************************************************************************************/

class Item {
    constructor(id, name, description, maxStack, iconURL, effects = []) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.maxStack = maxStack;
        this.iconURL = iconURL;
        this.effects = effects;
    }
};

class Effect {
    constructor(source, name, type, attribute, amount = 0, duration = 0) {
        const effectTypes = ["immediate", "temporary", "continuous"];
        try {
            if (typeof name !== "string" ||
                typeof type !== "string" ||
                typeof attribute !== "string") {
                throw TypeError("Effect name, type or attribute not string");
            }
            else if (effectTypes.indexOf(type) === -1) {
                throw Error("Effect type not listed in 'effectTypes' array!");
            }
            else if (typeof amount !== "number" || typeof duration !== "number") {
                throw TypeError("Effect number or duration not a number!");
            }
        } catch (e) {
            console.error(e);
        };
        this.source = source;
        this.name = name;
        this.type = type;
        this.attribute = attribute;
        this.amount = amount;
        this.duration = duration;
        this.description = `${this.name} modifies ${this.attribute} by ${this.amount} for ${this.duration}`;
    }
};

class Buff {
    constructor(effect) {
        const now = new Date();
        this.name = effect.name;
        this.attribute = effect.attribute;
        this.amount = effect.amount;
        this.duration = effect.duration;
        
        if (effect.type === "temporary") {
            this.end = now + (effect.duration * 60 * 1000);
        };
    }
};

/*************************************************************************************************/
/*************************************************************************************************/

class InventorySlot {
    constructor(slot) {
        this.id = slot.id;
        this.numberItems = slot.numberItems;
        this.item = slot.item;
    }
    show() {
        this.numberItems ? 
        `Inventory slot ${this.id} has ${this.numberItems} of item "${this.item.name}"` : 
        `Inventory slot ${this.id} is empty`;
    }
	
	// Returns space left in slot
	checkSpace(id, num) {
		// If slot is empty return smallest of: item's max stack or number of items
		if (this.numberItems === 0) {
			return items[id].maxStack < num ? items[id].maxStack : num;
		}
		// If slot has stuff in already
		else if (this.numberItems > 0) {
			// If id of item in slot matches passed item id
			if (id === this.item.id) {
				// Return number of spaces left or 0 if full
				return this.numberItems < this.item.maxStack ? this.item.maxStack - this.numberItems : 0;
			}
			// If slot's item is different from passed item
			else {return 0}
		}
	}
	add(id, num) {
		if (this.numberItems === 0) {
			this.item = items[id];
			if (num > items[id].maxStack) {
				this.numberItems = items[id].maxStack;
				return num - items[id].maxStack;
			}
			else {
				this.numberItems = num;
				return 0;
			console.log("Success at adding an item to inventory slot!");
			}
		}
		else {			
			// If this slot has different item
			if (id !== this.item.id) {
				return num
			}
			// If this slot has the right kind of item
			else {
				const numItemsFit = this.item.maxStack - this.numberItems;
				
				if (num > numItemsFit) {
					this.numberItems += numItemsFit;
					return num - numItemsFit;
				}
				else {
					this.numberItems += num;
					console.log("Success at adding some more items to inventory slot!");
					return 0;
				}
			}
		}
	}
	
	empty() {
		this.numberItems = 0;
		this.item = {};
	}
	// Consume one item
	remove = (how) => {
		try {
			if (this.numberItems === 0) {
				throw Error("Can't remove anything from an empty inventory slot!");
			} else {
				this.numberItems -= 1;
				if (how === "consume") {
					// Check for item effects and apply any found
					if (this.item.effects.length > 0) {
						this.item.effects.forEach(effect => player.addEffect(effect1));
						if (this.numberItems === 0) {
							this.item = {};
						}
					} else {
						// Item not consumed (probably trashed)
						return;
					}
				}
			}
		} catch (e) {
			console.error(e);
		}
	}
	show() {
		return this.numberItems === 0 ? `Inventory slot ${this.id} is empty` : `Inventory slot ${this.id} has ${this.numberItems} of item ${this.item.name}`;
	}
};

class Inventory {
    constructor(slots = []) {
		this.slots = [];
		//console.log(slots);
		if (slots.length === 0) {
			//console.log('hasta la bista');
			for (let i = 0; i < 5 ; i++) {
				slots[i] = {
					id : 0,
					numberItems : 0,
					item : {}
				}
			}
		}
		slots.forEach(slot => {
			this.slots.push(new InventorySlot(slot))
		});
		
    }
    addSlots(num) {
        for (let i = 0; i < num; i++) {
            this.slots.push(new InventorySlot(this.slots.length));
        };
    }
	// Check if inventory has room for items, return success or failure
	addItems(id, num) {
		console.log(`trying to add ${num} of ${items[id].name}`);
		let spaceFor = 0;
		let enoughSpace = false;
		// Loop through inventory slots checking for enough space for these items
		for (let i = 0; i < this.slots.length; i++) {
			spaceFor += this.slots[i].checkSpace(id, num);
			if (spaceFor >= num) {
				enoughSpace = true;
				break;
			};
		}
		// Add items to suitable inventory slots
		if (enoughSpace) {
			for (let i = 0; i < this.slots.length; i++) {
				num = this.slots[i].add(id, num);
				if (num <= 0) {
					return true;
				}
			}
		}
		// Not enough room inventory
		else {
			return false;
		}
	}
	show = () => {
		let text = 'Inventory show func:\n';
		this.slots.forEach(slot => {
			text += slot.show() + '\n'}
		);
		return text;
	}
	reset = () => {
		this.slots.forEach(slot => slot.empty());
	}
	
};

/*************************************************************************************************/
/*************************************************************************************************/

class Quest {
	constructor(id, title = "", description = "", stages = [], totalLength = 0, levelMin = 0, levelMax = 0,	canRepeat = true, 
		rewards = {}, needsQuest = [], time = 0, timerStart = 0, timeLeft = 0, activeStage = 0) {
			this.id = id;
			this.title = title;
			this.description = description;
			this.totalLength = totalLength;
			this.stages = stages;
            this.stages.forEach(stage => {stage.end = stage.end * 60000})
			this.levelMin = levelMin;
			this.levelMax = levelMax;
            // Turning minutes into milliseconds
			this.time = time * 60000;
			//this.timerStart = timerStart;
			//this.timeLeft = timeLeft;
			this.activeStage = activeStage;
			this.canRepeat = canRepeat;
			this.rewards = rewards;
			this.needsQuest = needsQuest;
    }
    updateStage(stage = this.activeStage) {
        const listHTML = `
            <li id="previous-stage-item">${char.name} was ${this.stages[stage].text.toLowerCase()}</li>
            `;
        this.activeStage += 1;
        document.getElementById('previous-stages-list').insertAdjacentHTML('afterbegin', listHTML);
    }

    checkEligible() {
        let eligible = true;

        if (this.canRepeat === false) {
            if (char.questsDone[this.id] >= 1) {
                eligible = false;
            };
        };

        // Loop through list of prerequisite quests
        this.needsQuest.forEach(req => {
            const needed = quests[findQuestIndex[req.id]];
            if (char.questsDone[needed.id] < req.minimum || char.questsDone[needed.id] === undefined) {
                //console.log(`Quest ${this.title} needs quest ${needed.title} before doing this one!`);
                eligible = false;
            }
            else {
                //console.log('done that prerequisite quest!');
            }
        });
        
        // Simple comparison checks
        if (player.level < this.levelMin ||
            player.level > this.levelMax
        ) {eligible = false}
        return eligible;
    }
};

/*************************************************************************************************/
/*************************************************************************************************/

class Person {
	constructor(name = "", place = "", level = 0, xp = 0, xpRequired = 100, xpModifier = 1, coins = 0, hp = 100, hpMax = 100, jobs = [], effects = [], inventory = {}) {
		this.name = name;
		this.place = place;
		this.level = level;
		this.xp = xp;
		this.xpRequired = xpRequired;
        this.xpModifier = xpModifier;
		this.coins = coins;
		this.hp = hp;
		this.hpMax = hpMax;
		this.jobs = jobs;
		this.effects = effects;

		this.attributeFunctions = {
			hp : this.changeHp,
			hpMax : this.changeHpMax
		}
		
		//console.log("person constructor, inventory: ", inventory);
		//console.log("inventory : ", inventory instanceof Inventory);
		console.log(inventory.slots);
		//if (inventory.slots === []) {
			//this.inventory = new Inventory(
		this.inventory = new Inventory(inventory.slots);
		//console.log("this.inventory : ", this.inventory instanceof Inventory);
	}
	
	addEffect(effect) {
		//console.log(`attribute: ${effect.attribute}`);
		if (Object.keys(this.attributeFunctions).indexOf(effect.attribute) !== -1) {
			this.attributeFunctions[effect.attribute](effect.amount);
			
		} else { 
			this[effect.attribute] += effect.amount;
		}
	}
	changeHp = num => {
		this.hp += num;
		console.log('is this thing on?');
		console.log(this);
		if (this.hp <= 0) {
			this.hp = 0;
			console.log("you died aaargh");
		} else if (this.hp > this.hpMax) {
			this.hp = this.hpMax
		}
	}
	changeHpMax = (num) => {
		this.hpMax += num;
		if (this.hp > this.hpMax) {
			this.hp = this.hpMax;
		}
	}
	
	
	/*
	addBuff(effect) {
        this.effects.push(new Buff(effect));
    };
	removeBuff(effect) {
		}
	}
	*/	
};

class Player extends Person {
    constructor(name = "Anon", place = "Balham", level = 0, xp = 0, xpRequired = 100, xpModifier = 1, coins = 0, 
		hp = 100, hpMax = 100, jobs = [], effects = [], inventory = {}, lastLogin = {}, loginStreak = 0, questJobs = [], currentActivity = {}) {
        super(name, place, level, xp, xpRequired, xpModifier, coins, hp, hpMax, jobs, effects, inventory);
        this.questJobs = questJobs;
        this.currentActivity = currentActivity;
        this.lastLogin = lastLogin;
        this.loginStreak = loginStreak;
    }
};

class Char extends Person {
	constructor(name = "", place = "", level = 0, xp = 0, xpRequired = 100, xpModifier = 1, coins = 0, 
		hp = 100, hpMax = 100, jobs = [], effects = [], inventory = {}, role = "", currentQuest = {}, questsDone = []) {

		name = name === "" ? characterNames[Math.floor(Math.random() * characterNames.length)] : name;
		place = place === "" ? placeNames[Math.floor(Math.random() * placeNames.length)] : place

		super(name, place, level, xp, xpRequired, xpModifier, coins, hp, hpMax, jobs, effects, inventory);
		this.role = "Scoundrel";
		this.currentQuest = currentQuest;
		this.questsDone = questsDone;
	}
};


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


const quests = [
	new Quest(0, "Kill rats", "There are some rats in the field we're trying to farm. If you kill them, we can get back to work. Please help!",
		// Quest stages
		[
			{text: "Travelling to the field", end: 5},
			{text: "Fighting the rats", end: 12},
			{text: "Harvesting the bodies", end: 15},
			{text: "Travelling back to village", end: 20},
		],
		// totalLength, levelMin, levelMax, canRepeat
		20, 0, 10, true,
		// Rewards
		{
			xp : 80,
			coins : 10,
			items : [],
			results : [],
		}, 
		// needsQuest
		[{id:2, minimum:1}, ],
    ),
	new Quest(1, "Search for scraps", "If you keep your eyes peeled, you're bound to find something useful, edible, or sellable.",
		// Quest stages
		[
			{text: "Peering into nooks and crannies", end: 8},
			{text: "Poring over the various scraps they found", end: 10},
		],
		// totalLength, levelMin, levelMax, canRepeat
		10, 0, 10, true,
		// Rewards
		{
			xp : 40,
			coins : 15,
		}
	),
	new Quest(2, "Test", "2 stages, both 3 seconds; quest length 6 seconds",
		// Quest stages
		[
			{text: "Stage 0", end: 0.05},
			{text: "Stage 1", end: 0.1},
		],
		// totalLength, levelMin, levelMax, canRepeat
		0.1, 0, 20, true,
		// Rewards
		{
			xp : 0,
			coins : 0,
			items : [
			{id : 0, number : 2,}
			],
		},
		
    ),
	new Quest(3, "Looking for a job (Storyline quest)", "Hopefully you can find someone to teach you a useful trade",
		// Quest stages
		[
			{text: "Loitering around various shops", end: 5},
			{text: "Getting chased away from various shops", end: 7},
			{text: "Following the blacksmith around on her errands", end: 18},
			{text: "Getting threatened by the blacksmith", end: 20},
			{text: "Sneaking around behind the blacksmith's shop", end: 25},
		],
		// totalLength, levelMin, levelMax, canRepeat
		25, 2, 20, false,
		// Rewards
		{
			xp : 80,
			coins : 0,
			items : [],
			results : [],
		},
    ),
	new Quest(4, "Finding a job (Storyline quest)", "The blacksmith finds you loitering behind her shop! You're in trouble now...",
		// Quest stages
		[
			{text: "Getting caught by the blacksmith", end: 2},
			{text: "Getting hauled through the streets by the ear", end: 6},
			{text: "Being confirmed as a good-for-nothing layabout by people in the town square", end: 10},
			{text: "Getting taken back and into the blacksmith's lair :O", end: 14},
			{text: "Being forced to make your mark on a crude apprentice's contract. 'I need an apprentice. You'll do', she says.", end: 16},
			{text: "Being scrubbed clean by the blacksmith", end: 21},
			{text: "Being fed and watered by the blacksmith, who gruffly introduces herself: 'Amice'.", end: 25},
		],
		// totalLength, levelMin, levelMax, canRepeat
		25, 2, 20, false,
		// Rewards
		{
			xp : 80,
			coins : 0,
			items : [],
			results : [{
				name: "Become blacksmith",
				message: "You are now a blacksmith's apprentice!",
				key: "role",
				change: "Blacksmith's apprentice",
			},],
		}, 
		// needsQuest
		[{id:3, minimum:1}, ],
	),
    new Quest(5, "Work them bellows kid (Trade quest)", "Now you're an apprentice, you're still miserable, but at least you know how miserable you'll be for at least the next year.",
		// Quest stages
		[
			{text: "Getting shouted at. The blacksmith yells 'bellows!'. Almost bellows the word, you could say.", end: 2},
			{text: "Hauling on the bellows, never quite managing the precision Amice demands.", end: 18},
			{text: "Gasping for breath and breathing furnace-hot air. Amice says 'go' and you flop limply out the room for a jug of ale, knowing you'll hear the call again in a matter of minutes.", end: 20},
		],
		// totalLength, levelMin, levelMax, canRepeat
		20, 2, 20, true,
		// Rewards
		{
			xp : 60,
			coins : 0,
			items : [],
			results : [],
		}, 
		// needsQuest
		[{id:4, minimum:1}, ],
		
    ),
	new Quest(6, "Fetch coke (Trade quest)", "Amice knits her eyebrows at you as you half collapse in the baking forge room. She drags you to the fuel store, and making sure you're wathing, scoops five scoops of coke into a sack and returns to the forge.",
		// Quest stages
		[
			{text: "Taking a sack to the coke store.", end: 1},
			{text: "Piling five scoops of coke into the sack and dragging it to the forge.", end: 5},
			{text: "Getting yelled at for bringing the wrong amount of fuel, in the wrong way, in the wrong time (too slow, of course, never fast enough).", end: 5},
		],
		// totalLength, levelMin, levelMax, canRepeat
		5, 3, 20, true,
		// Rewards
		{
			xp : 20,
			coins : 0,
			items : [],
			results : [],
		}, 
		// needsQuest
		[{id:5, minimum:10}, ],
    ),
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
    

    updateMessage("player", "Welcome back!");
    updateMessage("char", "I'm glad you're here.");
    
	// Fetch player from local storage
	const playerRetreival = JSON.parse(localStorage.getItem("player"));
    if (playerRetreival !== null) {
        player = playerRetreival;
		// Create Player object with localstorage data
		player = new Player(player.name, player.place, player.level, player.xp, player.xpRequired, player.xpModifier,
			player.coins, player.hp, player.hpMax, player.jobs, player.effects, player.inventory,
			player.lastLogin, player.loginStreak, player.questJobs, player.currentActivity);
		}
    else {
        // Player hasn't got anything in localstorage
        player = new Player();
    }
	// Fetch character from localstorage
    charRetreival = JSON.parse(localStorage.getItem("char"));
    if (charRetreival !== null) {
         char = charRetreival;
		// Create Char object with localstorage data
		char = new Char(char.name, char.place, char.level, char.xp, char.xpRequired,  char.xpModifier,
			char.coins, char.hp, char.hpMax, char.jobs, char.effects, char.inventory,
			char.role, char.currentQuest, char.questsDone);
    }
    else {
         char = new Char();
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
const effect1 = new Effect("My brain", "restore health", "immediate", "hp", -5)
const items = [
    new Item(0, "apple", "Just an apple, really", 5, "/img/apple-icon.svg", [effect1]),
    new Item(1, "stick", "Only a stick, chico", 10, "/img/stick-icon.svg"),
];

// Initialize timers
const countdownTimer = new Timer('countdownTimer', false);
const countUpTimer = new Timer('countUpTimer');

// Testing inventory adding

console.log(player.inventory.show());
console.log(char.inventory.show());
//player.inventory.addItems(0, 3);
//player.inventory.reset();
//console.log(player.inventory.show());
//console.log(player.inventory.slots[0].show());


// Testing effect adding (direct)

//player.effects = [];
//player.hp = 100;
//console.log(`Player hp: ${player.hp}`);
//player.addEffect(effect1);

//console.log(player.inventory.slots[0].show());
//player.inventory.slots[0].remove("consume");
//console.log(`Player hp: ${player.hp}`);
//console.log(player.inventory.slots[0].show());




update();
const findQuestIndex = getQuestIndexArray();











// Login streak checker WIP
/* function checkLogin() {
    const now = new Date();
    const nowDate = now.getDate();
    const nowMonth = now.getMonth();
    const nowYear = now.getFullYear();
    console.log(now);

    if (player.lastLogin !== "string") {
        // Last logged in earlier today
        if (player.lastLogin.toLocaleDateString() === now.toLocaleDateString()) {
            updateMessage("player", "Welcome back! You last logged in earlier today.")
        }
        // Last logged in yesterday
        else if ()
    }
    player.lastLogin = new Date();
}
checkLogin(); */
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
    // allPlayer.innerHTML = playerHTML;

    let charHTML = ``
    if (char.jobs.length > 0) {
        char.jobs.forEach(job => {
            charHTML += `<div class="info">${char.name} completed "${job.title}" in ${Math.ceil(job.time/60000)} minutes, and gained ${job.rewards.xp} XP!
            </div>`
        });
    };
    // allCharacter.innerHTML = charHTML;
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
/**********************************           ACTIVITY FUNCTIONS          **********************************/
/**********************************                                       **********************************/
/***********************************************************************************************************/
/***********************************************************************************************************/
/***********************************************************************************************************/


function editActivity() {
    game.activityState = "editing";
	if (game.questState === "finished") {
		// console.log("should show previous activities now");
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
    activityButtons.innerHTML = `<button type="button" id="task-submit" class="btn btn-info task-entry">Enter activity</button>`;
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
            // timerStart: 0,
        };
        document.getElementById('task').innerHTML = `
                <div id="task-messages">
                    <div class="current-task-msg">You are doing this: <span id="current-task" class="current-task">${taskName.value}</span></div>
                </div>
        `;
        activityButtons.innerHTML = `
            <button id="edit-activity-btn" class="btn btn-info">Edit activity</button>
            <button id="start-activity-btn" class="btn btn-info">Start activity</button>
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
                <button id="pause-activity-btn" class="btn btn-info">Pause</button>
                <button id="resume-activity-btn"  class="btn btn-info" disabled="true">Resume</button>
                <button id="finish-activity-btn" class="btn btn-info">Finish and submit</button>
            `;
            document.getElementById('finish-activity-btn').addEventListener("click", submitActivity);
            document.getElementById('pause-activity-btn').addEventListener("click", pauseActivity);
            document.getElementById('resume-activity-btn').addEventListener("click", resumeActivity);
        //}
        //timerStart();
		
        countUpTimer.start(countUpTimer.time);
        countdownTimer.start(countdownTimer.time);
        
    }
};

/*************************************************************************************************/
/*************************************************************************************************/

/* function updateTime() {
    document.getElementById('current-time').innerText = Math.floor(player.currentActivity.time/60000);

    if (char.currentQuest.timeLeft == 0) {
        document.getElementById('quest-time-left').innerText = 0;    
    }
    document.getElementById('quest-time-left').innerText = Math.ceil(char.currentQuest.timeLeft/60000);
}; */

function pauseActivity() {
    const pauseButton = document.getElementById('pause-activity-btn');
    pauseButton.setAttribute("disabled", true);
    
    //timerStop();

    // Methods of new Timer class 
    countUpTimer.stop();
    countdownTimer.stop();


    //updateTime();
    //updateQuestStage();
    // Leave running for testing
    console.log("Quest time: ", char.currentQuest.time/60000);

    if (char.currentQuest.timeLeft <= 0) {
        // Not sure this is necessary now
        
        
    }
    else {
        document.getElementById('resume-activity-btn').removeAttribute("disabled");
    }
};

function resumeActivity () {
    //timerStart();

    countUpTimer.start(countUpTimer.time);
    countdownTimer.start(countdownTimer.time); 

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
    
    // Adding new timer functionality
    player.currentActivity.time = countUpTimer.time;


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
    countUpTimer.reset();
	
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



// Reset various things ready for a new quest
function resetQuest() {
	// This makes use of mutation
    
    char.currentQuest.activeStage = 0;
    //char.currentQuest.timeLeft = char.currentQuest.totalLength * 60000;
    char.currentQuest = {};
	questJobsList.innerHTML = "";
}

function listQuests() {
    // Testing for new quest requirements
	
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
    document.getElementById("previous-stages").setAttribute("hidden", true);
    
    // Now starts the code to list quests...
    questContent.innerHTML = `
            <div class="choose-quest">
                <div class="choose-quest-text"><span>Choose a quest from the list below:</span></div>
                <div id="quest-list">
    `;
    quests.forEach(quest => {
        if (quest.checkEligible()) {
            document.getElementById('quest-list').insertAdjacentHTML('afterbegin', `
                <div class="quest-item">
                    <div ><button id="quest-${quest.id}"  class="btn btn-info"> ${quest.title}: ${quest.totalLength} minutes</button></div>
                    <div class="quest-description">${quest.description}</div>
                </div>
            `);
			// event listener adds 'start quest' function, basically
            document.getElementById(`quest-${quest.id}`).addEventListener("click", () => {
                game.questState = "ready";
                char.currentQuest = quest;
                
                countdownTimer.reset();
                countdownTimer.countdownFrom = quest.totalLength * 60 * 1000;
                countdownTimer.time = countdownTimer.countdownFrom;
                
                questContent.innerHTML = `
                    <div class="quest-title">Title: ${char.currentQuest.title}</div>
                    <div class="quest-stage">${char.name} is <span id="quest-stage-text">${char.currentQuest.stages[0].text.toLowerCase()}</span></div>
                `;
                
                document.getElementById("previous-stages").removeAttribute("hidden");
                
                if (game.activityState === "paused") {
                    document.getElementById('resume-activity-btn').removeAttribute("disabled");
                } else if (game.activityState === "none") {
                    updateMessage("player", "Now add an activity and you're good to go!");
                } else if (game.activityState === "ready") {
                    updateMessage("player", "Hit start to get going!");
                    document.getElementById('start-activity-btn').removeAttribute("disabled");
                } 
				
                statusUpdate();
            });
        }
        else {
           // console.log(`listQuests: ${quest.title} didn't make it`);
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
    // Put text from final stage onto screen list
    char.currentQuest.updateStage(char.currentQuest.stages.length - 1);
    document.getElementById('quest-stage-text').innerText = "finished";
    statusUpdate();
        
    // Update Quest box
    questFinishedArea.removeAttribute('hidden');
    document.getElementById('finished-btn-container').innerHTML = `
                <button id="rewards-btn" class="btn btn-info">Show rewards</button>
        `;
    document.getElementById('rewards-btn').addEventListener("click", showRewards);

    update();
};

/*************************************************************************************************/
/*************************************************************************************************/

function showRewards() {
    // Calculate player and character rewards
    player.xp += char.currentQuest.rewards.xp;
    char.xp += char.currentQuest.rewards.xp;
    player.coins += char.currentQuest.rewards.coins;
    char.coins += char.currentQuest.rewards.coins;

    function levelUpCheck(object) {
        let xpRequired = object.level * 100;
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
            ${char.name} finished the quest! You both get ${char.currentQuest.rewards.xp}xp and ${char.currentQuest.rewards.coins} coins.
        </div>`;

	// Add items
	let itemsHTML = "";
	 if (char.currentQuest.rewards.items !== undefined) {
		 char.currentQuest.rewards.items.forEach(item => {
			let inventorySuccess = char.inventory.addItems(item.id, item.number);
			itemsHTML = inventorySuccess ? `${char.name} got ${item.number} more of ${items[item.id].name}` : `Inventory doesn't have room for any more ${items[item.id].name}!`;
		});
	 }
	 
	console.log(char.currentQuest.rewards);
	
    // Make change for each quest result
	let resultHTML = "";
	if (char.currentQuest.rewards.results !== undefined) {
		char.currentQuest.rewards.results.forEach(result => {
			resultHTML += `<div class="result-item">${result.message}</div>`;
			char[result.key] = result.change;
		});
		resultHTML = `<div class="result-text">${resultHTML}</div>`
	}
    
    
    
    document.getElementById('quest-results').innerHTML = rewardHTML + itemsHTML + resultHTML;
    document.getElementById('finished-btn-container').innerHTML = `
        <button id="show-quests-btn"  class="btn btn-info">Show quests</button>
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