import Logger from "../utilities/logger";
import { Scenes, Images, Tags, Keys, Spritesheets, AudioTrack } from "../const";
import DI from "../utilities/DI";
import GameInfra from "../utilities/GameInfra";
import InputManager from "../engine/InputManager";
import Scheduler from "../utilities/Scheduler";
import LevelManager from "../levels/LevelManager";

export default class ArcadeScene extends Phaser.Scene {
    private inputManager!: InputManager;

	// Buttons
	private frame!: Phaser.GameObjects.Sprite;
	private controlBg!: Phaser.GameObjects.Sprite;
	private leftButton!: Phaser.GameObjects.Sprite;
	private rightButton!: Phaser.GameObjects.Sprite;
	private upButton!: Phaser.GameObjects.Sprite;
	private downButton!: Phaser.GameObjects.Sprite;
	private fireButton!: Phaser.GameObjects.Sprite;

	private cabinet!: Phaser.GameObjects.Sprite;
	private background!: Phaser.GameObjects.Sprite;

	private scheduler!: Scheduler;

	private joystick!: Phaser.GameObjects.Sprite;
	private joystickMapping: Record<string, number> = {
		'A': 1,
		'W': 7,
		'D': 4,
		'S': 6,
		'AW': 3,
		'AS': 2,
		'WD': 8,
		'DS': 5,
	}

	constructor() {
		super({
			key: Scenes.CONTROLS,
		});
	}

	init() {
		Logger.i("scene initialized", Tags.Controls);
		this.scheduler = DI.Get("Scheduler") as Scheduler;
	}

    preload() {
        this.loadImages();
        this.loadAudios();
        this.inputManager = new InputManager(this);
        DI.Register('InputManager', this.inputManager);
		DI.Register("LevelManager", new LevelManager());
    }

    create() {

        let layout = (DI.Get("GameInfra") as GameInfra).layout;
        // Complete Frame
        this.frame = this.add.sprite(0, 0, Images.Frame);
        this.frame.setOrigin(0, 0);
        this.frame.displayWidth = layout.TotalWidth;
        this.frame.displayHeight = layout.TotalHeight;
        this.frame.tint = 0x555555;
        this.frame.alpha = 0.5;

        // Controls Background
        this.controlBg = this.add.sprite(0, layout.GameHeight + layout.Border * 2, Images.Square);
        this.controlBg.setOrigin(0, 0);
        this.controlBg.displayWidth = layout.TotalWidth;
        this.controlBg.displayHeight = layout.ControlsHeight;
        this.controlBg.tint = 0xffee0d;
        this.controlBg.alpha = 0.5;

        let buttonX = layout.TotalWidth * 0.2;
        let buttonY = layout.TotalHeight - layout.Border*1.4;
        let buttonSize = layout.ControlButtonSize + 10;
        // this.leftButton = this.add.sprite(buttonX, buttonY + buttonSize, Images.Button);
		// this.upButton = this.add.sprite(buttonX + buttonSize, buttonY, Images.Button);
		// this.rightButton = this.add.sprite(buttonX + buttonSize*2, buttonY + buttonSize, Images.Button);
		// this.downButton = this.add.sprite(buttonX + buttonSize, buttonY + buttonSize* 2, Images.Button);

		this.background = this.add.sprite(layout.Border, layout.Border, Images.Background);
		this.background.displayWidth = layout.GameWidth;
		this.background.displayHeight = layout.GameHeight;
		this.background.setOrigin(0,0);
		this.background.tint = 0x333333;
		this.cabinet = this.add.sprite(0,0, Images.Cabinet).setOrigin(0,0);

		this.joystick = this.add.sprite(buttonX + buttonSize, buttonY + buttonSize, Spritesheets.Joystick["name"], 8);
		this.joystick.setScale(4,4);
		this.fireButton = this.add.sprite(layout.TotalWidth - buttonX, buttonY + buttonSize*2, Spritesheets.Button["name"]).setScale(2,2);

		this.scene.launch(Scenes.HUD, {});
        this.scene.launch(Scenes.MENU, {});
    }

    update(time: number, delta: number) {
        super.update(time, delta);
        this.inputManager.update(delta);
        this.resetButtons();
        let input = this.inputManager.getInput();
        // if(input.contains(Keys.Left)) this.highlightButton(this.leftButton);
		// if(input.contains(Keys.Up)) this.highlightButton(this.upButton);
		// if(input.contains(Keys.Right)) this.highlightButton(this.rightButton);
		// if(input.contains(Keys.Down)) this.highlightButton(this.downButton);
		if(input.contains(Keys.Action)) this.fireButton.setFrame(1);

        let inputString = "";
        if (input.contains(Keys.Left)) inputString += Keys.Left;
        if (input.contains(Keys.Up)) inputString += Keys.Up;
        if (input.contains(Keys.Right)) inputString += Keys.Right;
        if (input.contains(Keys.Down)) inputString += Keys.Down;

        let frameNumber = this.joystickMapping[inputString] || 9;
        this.joystick.setFrame(frameNumber - 1);

        this.scheduler.update(delta);
    }

    private resetButtons() {
        // this.leftButton.tint = 0xffffff;
		// this.upButton.tint = 0xffffff;
		// this.rightButton.tint = 0xffffff;
		// this.downButton.tint = 0xffffff;
		// this.fireButton.tint = 0xffffff;
		this.fireButton.setFrame(0);
	}

    private highlightButton(button: Phaser.GameObjects.Sprite) {
        button.tint = 0xee2222;
    }

    private loadImages() {
        this.load.setPath("./assets/images");
        for (let image in Images) {
            // @ts-ignore
            Logger.i(`loading asset: ${Images[image]}`, "LOAD");
            // @ts-ignore
            this.load.image(Images[image], Images[image] + ".png");
        }

        for (let image in Spritesheets) {
            // @ts-ignore
            Logger.i(`loading Spritesheets: ${Spritesheets[image]["name"]}`, "LOAD");
            // @ts-ignore
            let spriteConfig = Spritesheets[image];
            this.load.spritesheet(spriteConfig["name"], spriteConfig["name"] + ".png", { frameWidth: spriteConfig["frameWidth"], frameHeight: spriteConfig["frameHeight"], endFrame: spriteConfig["framesNum"] });
        }
    }

    private loadAudios() {
        this.load.setPath("./assets/audios");

        for (let audio in AudioTrack) {
            // @ts-ignore
            Logger.i(`loading audio asset: ${AudioTrack[audio]}`, "LOAD");
			// @ts-ignore
			if(AudioTrack[audio] == "main_song")
				// @ts-ignore
            	this.load.audio(AudioTrack[audio], AudioTrack[audio] + ".mp3");
			else
				// @ts-ignore
				this.load.audio(AudioTrack[audio], AudioTrack[audio] + ".wav");
        }
    }
}
