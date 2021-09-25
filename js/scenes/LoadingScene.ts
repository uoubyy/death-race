import {Scenes} from "../const";
import DI from "../utilities/DI";
import EventManager from "../utilities/EventManager";
import GameInfra from "../utilities/GameInfra";

export default class LoadingScene extends Phaser.Scene {

	constructor() {
		super({
			key: Scenes.LOAD,
		});
		this.eventManager = DI.Get("EventManager") as EventManager;
		this.gameInfra = DI.Get("GameInfra") as GameInfra;
	}
}
