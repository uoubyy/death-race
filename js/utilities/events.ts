export const GameEvents = {
    ButtonDown: "ButtonDown",
    ButtonUp: "ButtonUp",
    KilledPedestrian: "Killed_Pedestrian",
    OnGrave: "OnGrave",
    OffGrave: "OffGrave",
    KilledZombie: "Killed_Zombie",
    PedestrianPosUpdate: "PedestrianPosUpdate",
    PedestrianConverted: "PedestrianConverted",
    InputChange: "InputChange",
    LevelFinished: "LevelFinished",
    SummonWarrior: "SummonWarrior",
    KilledWarrior: "KilledWarrior",
	GameStarted: "GameStarted",
}

export interface LevelFinishInfo {
    Objects: GameObjectsInfo,
    Score: number,
}

export interface GameObjectsInfo {
    ZombieCount: number,
    PedestrianCount: number,
}

export interface InputChangeInfo {
    Key: string,
    IsDown: boolean,
    IsUp: boolean,
}

export interface PedestrianKillInfo {
    PedestrianId: number,
    PositionX: number,
    PositionY: number
}

export interface PedestrianConvertInfo {
	PedestrianId: number,
	PositionX: number,
	PositionY: number
}

export interface ZombieKillInfo {
    ZombieId: number,
	PositionX: number,
	PositionY: number
}

export interface WarriorKillInfo {
    WarriorId: number
}

export interface PedestrianConvertInfo {
    PositionX: number,
    PositionY: number
}

export interface ButtonPressInfo {
    IsDown: boolean,
    Key: string,
}

export interface PedestrianPositionInfo {
    X: number,
    Y: number,
    ID: number
}
