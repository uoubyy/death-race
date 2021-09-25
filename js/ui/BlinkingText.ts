import Text = Phaser.GameObjects.Text;
import TextStyle = Phaser.GameObjects.TextStyle;

export default class BlinkingText extends Text {
	public isBlinking = true;

	constructor(scene: Phaser.Scene, x: number, y: number, text: string|string[], style: TextStyle) {
		super(scene, x, y, text, style);
	}

	update(deltaTime: number) {

	}
}
