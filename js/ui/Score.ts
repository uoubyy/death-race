import Text = Phaser.GameObjects.Text;
import TextStyle = Phaser.GameObjects.TextStyle;

export default class Score extends Text {
	public score: number = 0;

	constructor(scene: Phaser.Scene, x: number, y: number, text: string|string[], style: TextStyle) {
		super(scene, x, y, text, style);
		scene.add.existing(this);
	}

	updateScore(newScore: number) {
		this.score = newScore;
		super.setText(`Score: ${this.score}`);
		// super.updateText();
	}

	add(points: number) {
		this.updateScore(this.score + points);
	}
}
