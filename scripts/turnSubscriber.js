export class TurnSubscriber {
  start() {
    Hooks.on("ready", () => {
      const gameMaster = game.users.find((user) => user.isGM && user.active);
      const gameMasterColor = gameMaster["color"];
      const gameMasterAvatar = gameMaster["avatar"];

      Hooks.on("updateCombat", (combat, update, options, userId) => {
        console.log(combat);
        console.log(update);
        console.log(options);
        console.log(userId);
      });
    });
  }
}
