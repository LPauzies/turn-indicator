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

        // Update global css properties for this round
        updateRootSelectorPropertiesForCurrentPlayer(currentCombatant, verbose);

        // Attach aura to current combatant in any cases

        // Create the parent div, empty and attached to header
        var displayContainer = buildAndReplaceBannerDiv(TurnSubscriber.ID);

        // Classic case
        // Character is not hidden
        displayContainer = drawClassicTurnIndicatorBanner(
          displayContainer,
          currentCombatant,
          currentRound
        );

        // FadeInLeft
        displayContainer = fadeInCSSClassesClassicTurnIndicatorBanner(
          displayContainer,
          verbose
        );

        // Publish the banner on the FoundryVTT DOM
        publishBannerDiv(displayContainer, TurnSubscriber.HEADER_ID);

        // FadeOutLeft
        fadeOutCSSClassesClassicTurnIndicatorBanner(displayContainer, verbose);
      });
    });
  }
}

const getGM = () => game.users.find((user) => user.isGM && user.active);

const updateRootSelectorPropertiesForCurrentPlayer = (
  currentCombatant,
  verbose
) => {
  const currentPlayer = currentCombatant?.players[0];
  const isPC = currentCombatant?.hasPlayerOwner && currentPlayer.active;
  if (verbose) {
    console.log(currentCombatant);
    console.log(
      `Current character is controlled by : ${
        isPC ? currentPlayer.name : "Gamemaster"
      }`
    );
  }

  const color = isPC ? currentPlayer["color"] : getGM()["color"];
  // Update root selector
  const rootSelector = document.querySelector(":root");
  rootSelector.style.setProperty("--turnIndicatorBorderBannerColor", color);
  rootSelector.style.setProperty("--turnIndicatorBannerColor", `${color}85`);
};

const buildAndReplaceBannerDiv = (id) => {
  var container = document.getElementById(id);
  if (container != null) container.remove();
  // Create the div
  const div = document.createElement("div");
  div.id = id;
  // Build the structure of the div
  return div;
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

const fadeInCSSClassesClassicTurnIndicatorBanner = (div, verbose) => {
  if (verbose) console.log("Pushing fading in left animation.");
  div.classList.add("animate__animated", "animate__fadeInLeft");
  return div;
};

const publishBannerDiv = (div, parentMarkupId) => {
  // Attach to parentMarkup
  const parentMarkup = document.getElementById(parentMarkupId);
  parentMarkup.appendChild(div);
};

const fadeOutCSSClassesClassicTurnIndicatorBanner = (div, verbose) => {
  setTimeout(function () {
    if (verbose) console.log("Pushing fading out left animation.");
    div.classList.remove("animate__fadeInLeft");
    div.classList.add("animate__fadeOutLeft");
  }, 5000);
};
