import {IUpdate} from "../types/types";

export default class Scheduler {
	constructor() {
	}

	private updateListeners: IUpdate[] = [];

	addUpdateListener(obj: IUpdate) {
		this.updateListeners.push(obj);
	}

	removeUpdateListener(obj: IUpdate) {
		let index = this.updateListeners.indexOf(obj);
		if(index >= 0) {
			this.updateListeners = this.updateListeners.splice(index, 1);
		}
	}

	update(delta: number) {
		for(let listener of this.updateListeners) {
			listener.update(delta);
		}
	}
}
