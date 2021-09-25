import LevelsConf from "./levels";
import {ImmovableObj, LevelConfig, MovableObj} from "../types/types";

export default class LevelManager {
	private currentLevel: number = -1;
	constructor() {

	}
	public loadNextLevel(): LevelConfig {
		this.currentLevel++;
		if(this.currentLevel < LevelsConf.length) {
			return LevelsConf[this.currentLevel];
		}
		return LevelManager.generateLevel(this.currentLevel);
	}
	public getLevelConfig() {
	}

	getCurrentLevel() : number {
		return this.currentLevel;
	}

	private static generateLevel(currentLevel: number): LevelConfig {
		return LevelsConf[LevelsConf.length - 1];
		return {
			Player: {} as MovableObj,
			Zombies: [],
			Graves: [],
			Pedestrians: [],
			Eggs: [],
		} as LevelConfig;
	}

	reset() {
		this.currentLevel = -1;
	}
}
