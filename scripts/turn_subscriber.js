export class TurnSubscriber {
  start() {
    Hooks.on("ready", () => {
      const hello = "Hello, World!";
      console.log(hello);
    });
  }
}
