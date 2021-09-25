export const Constants = {
	GAME_NAME: "Life  Race",
}

export const Scoring = {
	ZombieKillPoints: 100,
	PedestrianSavePoints: 200,
	PedestrianKillPoints: -100,
}

export const Scenes = {
    MENU: "MENU",
    GAMEPLAY: "GAMEPLAY",
    GAME_OVER: "GAME_OVER",
    CONTROLS: "CONTROLS",
    HUD: "HUD",
    LOAD: "LOADING",
    LEVEL_FINISH: "LEVEL_FINISH",
}

export const Tags = {
    Menu: "MENU",
    Infra: "INFRA",
    Asset: "ASSET",
    Controls: "CONTROLS",
    Sound: "SOUND",
    Input: "INPUT",
    HUD: "HUD",
}

export const Images = {
    Player: "car",
    Grave: "cross",
    Zombie: "car",
    Square: "placeholder_square",
    Cross: "cross",
    Frame: "frame",
    Background: "background",
	Cabinet: "cabinet",
	Button: "btn"
}

export const AudioTrack = {
    Background: "main_song",
	CarMove: "sfx_vehicle_carloop1",
	PedDead: "sfx_deathscream_human14",
	ZombieDead: "sfx_deathscream_alien1",
	PedInfect: "sfx_deathscream_alien4"
}

export const Spritesheets = {
    GraveSpawn: {
        "name": "grave_spawn",
        "frameWidth": 32,
        "frameHeight": 32,
        "framesNum": 10,
        "frameRate": 5,
        "repeat": false
    },
	Button: {
		"name": "button",
		"frameWidth": 32,
		"frameHeight": 32,
		"framesNum": 2,
		"frameRate": 5,
		"repeat": false
	},
    ZombieIdle: {
        "name": "zombie_move",
        "frameWidth": 64,
        "frameHeight": 64,
        "framesNum": 3,
        "frameRate": 5,
        "repeat": false
    },
    PedRun: {
        "name": "ped_run",
        "frameWidth": 48,
        "frameHeight": 48,
        "framesNum": 8,
        "frameRate": 4,
        "repeat": false
    },
    PedStand: {
        "name": "ped_stand",
        "frameWidth": 48,
        "frameHeight": 48,
        "framesNum": 8,
        "frameRate": 4,
        "repeat": false
    },
    PedDead: {
        "name": "ped_dead",
        "frameWidth": 48,
        "frameHeight": 48,
        "framesNum": 6,
        "frameRate": 3,
        "repeat": false
    },
    PlayerIdle: {
        "name": "player_idle",
        "frameWidth": 64,
        "frameHeight": 64,
        "framesNum": 6,
        "frameRate": 3,
        "repeat": false
    },
    PlayerMove: {
        "name": "player_move",
        "frameWidth": 64,
        "frameHeight": 64,
        "framesNum": 3,
        "frameRate": 3,
        "repeat": false
    },
    Joystick: {
        "name": "joystick",
        "frameWidth": 32,
        "frameHeight": 32,
        "framesNum": 9,
    },
	Egg: {
		"name": "egg",
		"frameWidth": 64,
		"frameHeight": 64,
		"framesNum": 6,
		"frameRate": 5
	},
	Pod_Landing: {
		"name": "pod_landing",
		"frameWidth": 48,
		"frameHeight": 48,
		"framesNum": 4,
		"frameRate": 4
	},
	Pod_Opening: {
		"name": "pod_opening",
		"frameWidth": 48,
		"frameHeight": 48,
		"framesNum": 10,
		"frameRate": 5
	},
	Warrior_Move:{
		"name": "warrior_move",
		"frameWidth": 96,
		"frameHeight": 96,
		"framesNum": 7,
		"frameRate": 5
	},
    Zombie_Spawn:{
        "name": "zombie_spawn",
        "frameWidth": 64,
        "frameHeight": 64,
        "framesNum": 15,
        "frameRate": 15
    }
}

export const Audio = {
    BgMusic: "BgMusic",
}


export const ObjTags = {
    Player: 0,
    Zombie: 1,
    Pedestrian: 2,
    Grave: 3,
    Pod: 4,
    Warrior: 5
}

export const Keys = {
    Left: 'A', // Rotate left
    Right: 'D', // Rotate right
    Up: 'W', // Move Forward
    Down: 'S', // Move backwards
    Reset: 'R', // debug
    Action: 'SPACE',
}

export const LevelConfig = {
    Level1: {
        Player: {
            "x": 200,
            "y": 300,
            "speed": 15,
            "angleSpeed": 10
        },
        Zombies: [
            {
                "x": 300,
                "y": 400,
                "speed": 8,
            },
            {
                "x": 350,
                "y": 400,
                "speed": 4,
            },
        ],
        Graves: [
            {
                "x": 400,
                "y": 400
            },
            {
                "x": 300,
                "y": 320
            },
            {
                "x": 200,
                "y": 150
            }
        ],
        Pedestrians: [
            {
                "x": 200,
                "y": 200,
                "speed": 6,
                "scale": 1.0
            }
        ]
    }
}

