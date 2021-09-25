export default class EventManager {
  private eventHandlers: Record<string, Function[]> = {};
  constructor() {
  }

  public addHandler(eventName:string, handler: Function) {
    if(this.eventHandlers[eventName] == null) {
      this.eventHandlers[eventName] = [];
    }
    this.eventHandlers[eventName].push(handler);
  }

  public removeHandler(eventName: string, handler: Function) {
    if(this.eventHandlers[eventName]) {
      let index = this.eventHandlers[eventName].indexOf(handler);
      if(index >= 0) {
        this.eventHandlers[eventName] = this.eventHandlers[eventName].splice(index, 1);
      }
    }
  }

  public removeHandlers(eventName: string) {
	  this.eventHandlers[eventName] = [];
  }

  public sendEvent(eventName: string, eventData?: object) {
    let handlers = this.eventHandlers[eventName] || [];
    for(let handler of handlers) {
      handler(eventData);
    }
  }

  public clearAll() {
    this.eventHandlers = {};
  }
}
