import { isObjectUsable, setHiddenDiv } from "./utils.js";
import {
  getUserFromId,
  getI18nTranslation,
  getI18nRandomItem,
} from "./foundryUtils.js";

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
        if (!isObjectUsable(combat)) return;
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

        // Create the parent div, empty and attached to header
        var displayContainer = createEmptyAndHiddenDivAttachedToParentMarkup(
          TurnSubscriber.ID,
          TurnSubscriber.HEADER_ID
        );

        // Classic case
        // Character is not hidden
        displayContainer =
          attachCSSClassesClassicTurnIndicatorBanner(displayContainer);
        displayContainer = drawClassicTurnIndicatorBanner(
          displayContainer,
          currentCombatant,
          currentRound
        );
      });
    });
  }
}

const createEmptyAndHiddenDivAttachedToParentMarkup = (id, parentMarkupId) => {
  // Delete it first
  var container = document.getElementById(id);
  container.remove();
  // Create another one to trigger animations
  const div = document.createElement("div");
  div.id = id;
  const parentMarkup = document.getElementById(parentMarkupId);
  parentMarkup.appendChild(div);
  container = document.getElementById(id);
  setHiddenDiv(container, true);
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
  setHiddenDiv(div, false);
  return div;
};

const attachCSSClassesClassicTurnIndicatorBanner = (div) => {
  div.classList.add("fade-in-left", "fade-out-left");
  return div;
};
