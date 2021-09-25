export default class DI {
  private static objects: Record<string, object> = {};

  static Register(type: string, obj: object) {
    DI.objects[type] = obj;
  }

  static Get(type: string) {
    return DI.objects[type];
  }
}
