import Player from "../game/Player";

export interface IUpdate {
    update(delta: number): void
}

export interface GameConfig {
    PedestrianCount: number,
    ZombieCount: number,
}

export interface KeyState {
    isJustDown: boolean,
    held: boolean,
    isJustUp: boolean,
}
export interface ImmovableObj {
    id?: number,
    x: number,
    y: number
}

export interface MovableObj {
    id?: number,
    x: number,
    y: number,
    speed: number,
    angleSpeed?: number,
}
export interface LevelConfig {
    Player: MovableObj,
    Zombies: MovableObj[],
    Graves: ImmovableObj[],
    Pedestrians: MovableObj[],
	Eggs: ImmovableObj[],
}

export interface Layout {
    GameWidth: number,
    GameHeight: number,
    Border: number,
    ControlsWidth: number,
    ControlsHeight: number,
    ControlButtonSize: number,
    TotalHeight: number,
    TotalWidth: number,
}

declare interface IGameObject extends Phaser.GameObjects.Sprite {

}

declare interface IPlayer extends IGameObject {

}

export interface LevelLoadInfo {
    IsGameOver: boolean,
    ShowHighScore: boolean,
    CurrentLevel: number,
    NextLevel: number,
    ExtraLives?: number
}
