export class TurnSubscriber {
  static ID = "TurnSubscriberId";
  static HEADER_ID = "ui-top";

  start(verbose = true) {
    Hooks.on("ready", () => {
      if (verbose) console.log("Starting module : TurnSubscriber");
      const gameMaster = game.users.find((user) => user.isGM && user.active);
      const gameMasterColor = gameMaster["color"];
      const gameMasterAvatar = gameMaster["avatar"];

      Hooks.on("updateCombat", (combat, update, options, userId) => {
        if (verbose)
          console.log(`Turn for user : ${getUserFromId(userId).name}`);
        console.log(combat);
        console.log(update);
        console.log(options);
        console.log(userId);

        // Check if the combat is legit
        if (!isUsable(combat)) return;
        // Check if the combat has started
        if (!combat?.started) return;
        // Check if the current combatant is not defeated
        if (combat?.combatant?.isDefeated) return;

        const currentCombatant = combat?.combatant;
        const currentCombatantImage = currentCombatant?.img;
        const currentCombatantImageToken = currentCombatant?.actor?.img;
        const currentCombatantName = currentCombatant?.name;
        const currentRound = combat?.current?.round;

        // Attach aura to current combatant in any cases

        // Classic case
        // Not hidden
        const text = [
          getI18nRandomItem("TurnIndicator.YourTurn", 1, 3),
          currentCombatantName,
        ];
        displayContainer = getOrCreateDivAttachedToParentMarkup(
          TurnSubscriber.ID,
          getOrCreateDivAttachedToParentMarkup
        );
        displayContainer.innerHTML = text.join(" ");
      });
    });
  }
}

const getUserFromId = (userId) => {
  return game.users.find((user) => user.id === userId);
};

const isUsable = (object) => {
  return (
    object !== null && object !== undefined && Object.keys(object).length !== 0
  );
};

const getI18nRandomItem = (key, rangeMin, rangeMax) => {
  randomIndex =
    Math.floor(Math.random() * (rangeMax - rangeMin + 1)) + rangeMin;
  i18nCompleteKey = `${key}.${randomIndex}`;
  return game.i18n.localize(i18nCompleteKey);
};

const getOrCreateDivAttachedToParentMarkup = (id, parentMarkupId) => {
  var container = document.getElementById(id);
  if (container == null) {
    let div = document.createElement("div");
    div.id = id;
    // Foundry Element
    let uiTop = document.getElementById(parentMarkupId);
    // Append it to Foundry
    uiTop.appendChild(div);

    container = document.getElementById(id);
  } else {
    container.innerHTML = "";
  }
  return container;
};
