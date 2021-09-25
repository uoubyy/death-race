import {Constants, Scenes, Tags} from "../const";
import GameConf from "../game/config";
import Logger from "../utilities/logger";
import InputManager from "../engine/InputManager";
import DI from "../utilities/DI";
import Options from "../ui/Options";
import Point from "../utilities/Point";
import GameInfra from "../utilities/GameInfra";

export default class MenuScene extends Phaser.Scene {
	private title: Phaser.GameObjects.Text;
	private inputManager!: InputManager;
	private gameStarted: boolean = false;
	private options!: Options;

	constructor() {
		super({
			key: Scenes.MENU,
		});
	}

    init() {
        Logger.i("scene initialized", Tags.Menu);
		this.inputManager = DI.Get("InputManager") as InputManager;
		this.events.on('shutdown', () => { this.onShutdown(); });
    }

    create() {
        // this.scene.launch(Scenes.CONTROLS, GameConf);
		let layout = (DI.Get("GameInfra") as GameInfra).layout;
		this.title = this.add.text(layout.Border + layout.GameWidth*0.3, layout.GameHeight/3, Constants.GAME_NAME, {fontFamily: "arcade-basic", fontSize: "64px", color: "red"});
		this.options = new Options(this, {
			fontFamily: "arcade-basic",
			fontSize: 32,
			padding: 10,
			position: new Point(layout.Border + layout.GameWidth*0.38, layout.GameHeight/2),
			options: {
				"Start": () => {
					this.gameStarted = true;
					this.scene.start(Scenes.GAMEPLAY, GameConf);
				},
				"Help": () => {Logger.i("Handling the dummy option", Tags.Menu)},
				"About": () => {Logger.i("Handling the dummy option", Tags.Menu)}
			},
		})

        // setTimeout(() => {
        //     this.scene.start(Scenes.GAMEPLAY, GameConf)
        // }, 2000);
    }

	update(time: number, delta: number) {
		super.update(time, delta);
	}

	private onShutdown() {
		this.options.destroy();
	}
}
