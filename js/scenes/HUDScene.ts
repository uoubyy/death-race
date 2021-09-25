import {Scenes, Tags} from "../const";
import Score from "../ui/Score";
import BlinkingText from "../ui/BlinkingText";
import Timer from "../ui/Timer";
import TextStyle = Phaser.GameObjects.TextStyle;
import EventManager from "../utilities/EventManager";
import DI from "../utilities/DI";
import GameInfra from "../utilities/GameInfra";
import Logger from "../utilities/logger";
import {GameEvents, GameObjectsInfo, ZombieKillInfo} from "../utilities/events";
import LevelManager from "../levels/LevelManager";

export default class HUDScene extends Phaser.Scene {
	private score!: Score;
	private timer!: Timer;
	private levelText!: Phaser.GameObjects.Text;
	private centerText!: BlinkingText;
	private highScores!: Phaser.GameObjects.Text;
	private eventManager: EventManager;

	private gameInfra: GameInfra;
	constructor() {
		super({
			key: Scenes.HUD,
		});
		// this.scene.bringToTop();
		this.eventManager = DI.Get("EventManager") as EventManager;
		this.gameInfra = DI.Get("GameInfra") as GameInfra;
		DI.Register("HUD", this);
	}
	init() {
	}

	preload() {
		this.load.json('hs', "./assets/highscores.json");
	}

	create() {
		Logger.i("HUD created", Tags.HUD);
		let layout = this.gameInfra.layout;
		this.score = new Score(this, layout.Border*1.2, layout.Border*1.5, `Score: - `, {fontFamily: "arcade-basic", fontSize: `32px`} as TextStyle);
		this.score.setOrigin(0,0);

		// this.add.text(layout.Border*2, layout.Border*2, "0", {fontFamily: "arcade-basic", fontSize: `32px`});

		this.timer = new Timer(this, layout.Border + layout.GameWidth*0.8, layout.Border*1.5, 30, {fontFamily: "arcade-basic", fontSize: `32px`} as TextStyle);
		this.timer.cancel();

		this.levelText = this.add.text(layout.Border + layout.GameWidth*0.4, layout.Border*1.5, "Level -", {fontFamily: "arcade-basic", fontSize: `32px`} as TextStyle);
		// this.timer.setOrigin(this.timer.displayWidth, 0);
		let hs = this.cache.json.get("hs");
		console.log(JSON.stringify(hs));
		this.eventManager.addHandler(GameEvents.GameStarted, (info: any)=>this.onLevelStart(info));

	}

	update(time: number, delta: number) {
		super.update(time, delta);
		this.timer.update(delta);
		// this.centerText.updateText();
	}


	resetHUD() {
		this.timer.cancel();
		this.score.updateScore(0);
	}

	private OnZombieKilled(info: ZombieKillInfo) {
		this.score.add(100);
	}

	private OnPedestrianKilled() {

	}

	private onLevelStart(info: any) {
		this.eventManager.addHandler(GameEvents.LevelFinished, this.onLevelFinish.bind(this));
		this.eventManager.addHandler(GameEvents.KilledZombie, this.OnZombieKilled.bind(this));
		this.eventManager.addHandler(GameEvents.KilledPedestrian, this.OnPedestrianKilled.bind(this));

		this.levelText.setText(`Level ${info.Level || "0"}`);
		this.timer.restart();
	}

	private onLevelFinish(info: GameObjectsInfo) {
		this.score.add(info.PedestrianCount*200);
		this.timer.cancel();
	}
}
