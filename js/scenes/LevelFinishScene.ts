import {Scenes, Tags} from "../const";
import TextStyle = Phaser.GameObjects.TextStyle;
import Options from "../ui/Options";
import Point from "../utilities/Point";
import GameConf from "../game/config";
import Logger from "../utilities/logger";
import DI from "../utilities/DI";
import GameInfra from "../utilities/GameInfra";

export default class LevelFinishScene extends Phaser.Scene {
	private options!: Options;
	constructor() {
		super({
		  key: Scenes.LEVEL_FINISH,
		});
	}

	init() {}
	preload() {}
	create() {
		this.add.text(250, 300, "Level Completed", {fontFamily: "arcade-basic", fontSize: `64px`} as TextStyle);
		let layout = (DI.Get("GameInfra") as GameInfra).layout;
		this.options = new Options(this, {
		  fontFamily: "arcade-basic",
		  fontSize: 32,
		  padding: 10,
		  position: new Point(layout.TotalWidth/3, layout.GameHeight/2 + 50),
		  options: {
			  "Continue": () => {
				  this.scene.start(Scenes.GAMEPLAY, GameConf);
			  },
			  // "Exit": () => { this.scene.start(Scenes.MENU, {})},
		  },
		});
		this.events.on('shutdown', () => {
			this.options.destroy();
		})
	}
}
