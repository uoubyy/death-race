import {Layout} from "../types/types";

export default class GameInfra {
	public width: number = 640;
	public height: number = 640;

	public layout: Layout;

	constructor(width: number, height: number) {
		let borderSize = 120;
		let controlButtonSize = 32;
		let gameSize = width - borderSize * 2;
		this.layout = {
			Border: borderSize,
			ControlButtonSize: 32,
			ControlsHeight: height - width,
			ControlsWidth: width,
			GameHeight: gameSize,
			GameWidth: gameSize,
			TotalHeight: height,
			TotalWidth: width
		}
		this.loadFont('arcade-basic', 'assets/fonts/ARCADECLASSIC.TTF');
	}

	private loadFont(name: string, url: string) {
		var newFont = new FontFace(name, `url(${url})`);
		newFont.load().then(function (loaded) {
			document.fonts.add(loaded);
		}).catch(function (error) {
			return error;
		});
	}
}
