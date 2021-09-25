import {Scene} from "phaser";
import InputManager from "../engine/InputManager";
import DI from "../utilities/DI";
import Sprite = Phaser.GameObjects.Sprite;
import Point from "../utilities/Point";
import Text = Phaser.GameObjects.Text;
import {Images, Keys} from "../const";
import EventManager from "../utilities/EventManager";
import {GameEvents, InputChangeInfo} from "../utilities/events";

export interface UIConfig {
	padding: number,
	position: Point,
	fontSize: number,
	fontFamily?: string,
	fontColor?: string,
	options?: Record<string, Function>;
}

interface OptionConf {
	pos: Point,
	option: Text,
	callback: Function,
}
export default class Options {
	private scene!: Scene;
	private inputManager!: InputManager;
	private optionsPos: Point[] = [];
	private selectionSprite: Sprite;
	private selectionIconSize: number;
	private options: Text[]=[];
	private currentSelection: number;
	private optionsA: OptionConf[]=[];
	private config: UIConfig;

	private eventManager!: EventManager
	private handler: (info: any) => void;

	constructor(scene: Scene, config: UIConfig) {
		this.scene = scene;
		this.config = config;
		this.inputManager = DI.Get("InputManager") as InputManager;
		// @ts-ignore
		this.selectionSprite = this.scene.add.sprite(0,0, Images.Button);
		this.selectionSprite.setOrigin(0,0);
		this.selectionSprite.displayWidth = config.fontSize;
		this.selectionSprite.displayHeight = config.fontSize;
		this.selectionIconSize = config.fontSize;
		this.generateOptions(config);
		this.currentSelection = 0;

		this.setSelection(0);

		this.eventManager = DI.Get("EventManager") as EventManager;
		this.handler = (info: any) => this.onInput(info);
		this.eventManager.addHandler(GameEvents.InputChange, this.handler);
	}

	private generateOptions(config: UIConfig) {
		let indent = config.padding*2 + config.fontSize;
		let yPos = config.padding;
		// @ts-ignore
		for(let [key, value] of Object.entries(config.options)) {
			let pos = config.position.add(indent, yPos);
			let text = this.scene.add.text(pos.x, pos.y, key, {fontFamily: config.fontFamily, fontSize: `${config.fontSize}px`});
			text.setOrigin(0,0);
			this.optionsA.push({
				pos: pos,
				option: text,
				callback: value,
			})
			yPos += config.fontSize + config.padding;
		}
	}

	private setSelection(selection: number) {
		this.currentSelection = (selection + this.optionsA.length) % this.optionsA.length;
		let newPos = this.config.position.add(this.config.padding, this.config.padding + this.currentSelection*(this.config.padding + this.config.fontSize));
		this.selectionSprite.x = newPos.x;
		this.selectionSprite.y = newPos.y;
	}

	private onInput(info: InputChangeInfo) {
		if(!info.IsUp) return;
		if(info.Key === Keys.Action) {
			this.optionsA[this.currentSelection].callback();
			return;
		}
		if(info.Key === Keys.Down) {
			this.setSelection(this.currentSelection + 1);
		} else if(info.Key === Keys.Up) {
			this.setSelection(this.currentSelection - 1);
		}
	}

	destroy() {
		this.eventManager.removeHandler(GameEvents.InputChange, this.handler);
		this.eventManager.removeHandlers(GameEvents.InputChange);
	}
}
