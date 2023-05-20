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
        if (verbose) {
          console.log(`Turn for user : ${getUserFromId(userId).name}`);
          console.log(combat);
          console.log(update);
          console.log(options);
          console.log(userId);
        }

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

        // Create the parent div, attached to header
        var displayContainer = getOrCreateEmptyDivAttachedToParentMarkup(
          TurnSubscriber.ID,
          TurnSubscriber.HEADER_ID
        );

        // Classic case
        // Not hidden
        displayContainer = drawClassicTurnIndicatorBanner(
          displayContainer,
          currentCombatant,
          currentRound
        );
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

const getI18nTranslation = (key) => {
  return game.i18n.localize(key);
};

const getI18nRandomItem = (key, rangeMin, rangeMax) => {
  const randomIndex =
    Math.floor(Math.random() * (rangeMax - rangeMin + 1)) + rangeMin;
  const i18nCompleteKey = `${key}.${randomIndex}`;
  return getI18nTranslation(i18nCompleteKey);
};

const getOrCreateEmptyDivAttachedToParentMarkup = (id, parentMarkupId) => {
  var container = document.getElementById(id);
  if (container == null) {
    const div = document.createElement("div");
    div.id = id;
    const parentMarkup = document.getElementById(parentMarkupId);
    parentMarkup.appendChild(div);
    container = document.getElementById(id);
  } else {
    container.innerHTML = "";
  }
  return container;
};

const drawClassicTurnIndicatorBanner = (div, currentCombatant, round) => {
  const mainText = [
    getI18nRandomItem("TurnIndicator.YourTurn", 1, 3),
    currentCombatant?.name,
    "!",
  ];
  const secondaryText = [getI18nTranslation("TurnIndicator.Round"), `${round}`];
  div.innerHTML = mainText.join(" ") + "<br>" + secondaryText.join(" ");
  return div;
};
