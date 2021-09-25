import { Scenes } from "../const";
import TextStyle = Phaser.GameObjects.TextStyle;
import Options from "../ui/Options";
import Point from "../utilities/Point";
import GameConf from "../game/config";
import LevelManager from "../levels/LevelManager";
import DI from "../utilities/DI";
import HUDScene from "./HUDScene";

export default class GameoverScene extends Phaser.Scene {
  constructor() {
    super({
      key: Scenes.GAME_OVER,
    });
  }
	private options!: Options;

  init() {}
  preload() {}
  create() {
	  this.add.text(300, 300, "Game Over", {fontFamily: "arcade-basic", fontSize: `64px`} as TextStyle);
	  // this.add.text(200, 360, "(Press SPACE to restart)", {fontFamily: "arcade-basic", fontSize: `24px`} as TextStyle);
	  this.options = new Options(this, {
		  fontFamily: "arcade-basic",
		  fontSize: 24,
		  padding: 10,
		  position: new Point(400, 500),
		  options: {
			  "Restart": () => {
				  this.scene.start(Scenes.GAMEPLAY, GameConf);
				  (DI.Get("LevelManager") as LevelManager).reset();
				  (DI.Get("HUD") as HUDScene).resetHUD();
			  },
		  },
	  });
  }
}
