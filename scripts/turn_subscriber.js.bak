export class TurnSubscriber {
  constructor(debugMode = true) {
    this.debugMode = debugMode;
    this.gmColor = null;
    this.myTimer = null;
    this.currentCombatant = null;
    this.nextCombatant = null;
    this.imgCount = 1;
    this.currentImgID = null;
    this.nextImgID = null;
    this.expectedNext = null;
  }

  begin() {
    Hooks.on("ready", () => {
      const gameMaster = game.users.find((user) => user.isGM && user.active);
      this.gmColor = gameMaster["color"];
      Hooks.on("updateCombat", (combat, update) => {
        this.onPlayerTurn(combat, update);
      });
    });
  }

  onPlayerTurn(combat, update) {
    if (!(update["turn"] || update["round"])) {
      return;
    }

    console.log(update);

    if (!combat.started) {
      return;
    }

    if (combat.combatant == this.currentCombatant) {
      return;
    }

    this.currentCombatant = combat?.combatant;
    this.currentCombatantActor = combat?.combatant?.actor;
    this.currentCombatantActorImage = combat?.combatant?.actor?.img;
    this.currentCombatantName = combat?.combatant?.name;

    this.moduleText = "";
    this.moduleCSSClasses = [];

    this.moduleCSSClasses.push("adding");

    if (game.modules.get("combat-utility-belt")?.active) {
      if (game.cub.hideNames.shouldReplaceName(combat?.combatant?.actor)) {
        this.currentCombatantName = game.cub.hideNames.getReplacementName(
          combat?.combatant?.actor
        );
      }
    }

    // On a turn when character is hidden and is PC
    if (this.currentCombatant?.hidden && !game.user.isGM) {
      this.moduleText = `${game.i18n.localize("YOUR-TURN.SomethingHappens")}`;
      this.moduleCSSClasses.push("silhoutte");
    }
    // On a turn when character has owner, is PC and character is active
    else if (
      this.currentCombatant?.isOwner &&
      !game.user.isGM &&
      this.currentCombatant?.players[0]?.active
    ) {
      this.moduleText = `${game.i18n.localize("YOUR-TURN.YourTurn")}, ${
        this.moduleText
      }!`;
    }
    // Fallback for GM mainly
    else {
      this.moduleText = `${this.moduleText}'s ${game.i18n.localize(
        "YOUR-TURN.Turn"
      )}!`;
    }

    this.nextCombatant = this.getNextCombatant(combat);
    this.expectedNext = combat?.nextCombatant;

    var container = getOrCreateContainer("yourTurnContainer");

    this.removeIfExist(this.currentImgID);
    this.removeIfExist("yourTurnBanner");

    var nextImg = document.getElementById(this.nextImgID);

    if (nextImg != null) {
      if (this.currentCombatant != this.expectedNext) {
        nextImg.remove();
        this.currentImgID = null;
      } else {
        this.currentImgID = this.nextImgID;
      }
    }

    this.imgCount = this.imgCount + 1;
    this.nextImgID = `yourTurnImg${this.imgCount}`;

    let imgHTML = document.createElement("img");
    imgHTML.id = this.nextImgID;
    imgHTML.className = "yourTurnImg";
    imgHTML.src = this.expectedNext?.actor.img;

    if (this.currentImgID == null) {
      this.currentImgID = `yourTurnImg${this.imgCount - 1}`;

      let currentImgHTML = document.createElement("img");
      currentImgHTML.id = this.currentImgID;
      currentImgHTML.className = "yourTurnImg";
      currentImgHTML.src = this.image;

      container.append(currentImgHTML);
      console.log(imgHTML);
    }

    let bannerDiv = document.createElement("div");
    bannerDiv.id = "yourTurnBanner";
    bannerDiv.className = "yourTurnBanner";
    bannerDiv.style.height = 150;
    bannerDiv.innerHTML = `<p id="yourTurnText" class="yourTurnText">${ytText}</p><div class="yourTurnSubheading">${game.i18n.localize(
      "YOUR-TURN.Round"
    )} #${combat.round} ${game.i18n.localize("YOUR-TURN.Turn")} #${
      combat.turn
    }</div>${this.getNextTurnHtml(
      nextCombatant
    )}<div id="yourTurnBannerBackground" class="yourTurnBannerBackground" height="150"></div>`;

    var r = document.querySelector(":root");
    if (
      combat?.combatant?.hasPlayerOwner &&
      combat?.combatant?.players[0].active
    ) {
      const ytPlayerColor = combat?.combatant?.players[0]["color"];
      r.style.setProperty("--yourTurnPlayerColor", ytPlayerColor);
      r.style.setProperty(
        "--yourTurnPlayerColorTransparent",
        ytPlayerColor + "80"
      );
    } else {
      r.style.setProperty("--yourTurnPlayerColor", this.gmColor);
      r.style.setProperty(
        "--yourTurnPlayerColorTransparent",
        this.gmColor + "80"
      );
    }

    let currentImgHTML = document.getElementById(this.currentImgID);
    while (ytImgClass.length > 0) {
      currentImgHTML.classList.add(ytImgClass.pop());
    }

    container.append(imgHTML);
    container.append(bannerDiv);

    clearInterval(this?.myTimer);
    this.myTimer = setInterval(() => {
      this.unloadImage();
    }, 5000);
  }

  static getOrCreateContainer(id = "yourTurnContainer") {
    var container = document.getElementById(id);
    if (container == null) {
      let div = document.createElement("div");
      div.id = id;
      // Foundry Element
      let uiTop = document.getElementById("ui-top");
      // Append it to Foundry
      uiTop.appendChild(div);

      container = document.getElementById(id);
    }
    return container;
  }

  static loadNextImage(combat) {
    //Put next turns image in a hidden side banner
    let nextTurn = combat.turn + 1;

    let hiddenImgHTML = `<div id="yourTurnPreload"><img id="yourTurnPreloadImg" src=${
      combat?.turns[(combat.turn + 1) % combat.turns.length].actor.img
    } loading="eager" width="800" height="800" ></img><div>`;

    if ($("body").find(`div[id="yourTurnPreload"]`).length > 0) {
      $("body").find(`div[id="yourTurnPreload"]`).remove();
    }

    $("body").append(hiddenImgHTML);
  }

  static unloadImage() {
    clearInterval(this.myTimer);
    var element = document.getElementById("yourTurnBannerBackground");
    element.classList.add("removing");

    element = document.getElementById("yourTurnBanner");
    element.classList.add("removing");

    element = document.getElementById(this.currentImgID);
    element.classList.add("removing");
  }

  static getNextCombatant(combat) {
    let j = 1;
    let combatant = combat?.turns[(combat.turn + j) % combat.turns.length];

    while (combatant.hidden && j < combat.turns.length && !game.user.isGM) {
      j++;
      combatant = combat?.turns[(combat.turn + j) % combat.turns.length];
    }

    return combatant;
  }

  static getNextTurnHtml(combatant) {
    let displayNext = true;

    let name = combatant.name;
    let imgClass = "yourTurnImg yourTurnSubheading";

    if (game.modules.get("combat-utility-belt")?.active) {
      if (game.cub.hideNames.shouldReplaceName(combatant?.actor)) {
        name = game.cub.hideNames.getReplacementName(combatant?.actor);
        imgClass = imgClass + " silhoutte";
      }
    }

    //displayNext = (j != combat.turns.length);

    if (displayNext) {
      let rv = `<div class="yourTurnSubheading last">${game.i18n.localize(
        "YOUR-TURN.NextUp"
      )}:  <img class="${imgClass}" src="${
        combatant.actor.img
      }"></img>${name}</div>`;
      console.log(rv);
      return rv;
    } else {
      return null;
    }
  }

  static removeIfExist(id) {
    var element = document.getElementById(id);
    if (element != null) {
      element.remove();
    }
  }
}
