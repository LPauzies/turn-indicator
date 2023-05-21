import { getI18nTranslation } from "./foundryUtils.js";

export const drawImageElement = (id, currentCombatantActorImage) => {
  const imgElement = document.createElement("img");
  imgElement.id = id;
  imgElement.src = currentCombatantActorImage;
  imgElement.classList.add(
    "animate__animated",
    "animate__fadeIn",
    "animate__delay-1s"
  );
  return imgElement;
};

const _drawMainTextElement = (id, currentCombatantName) => {
  const mainText = [
    getI18nTranslation("TurnIndicator.YourTurn"),
    currentCombatantName,
    "!",
  ];
  const mainTextElement = document.createElement("span");
  mainTextElement.id = id;
  mainTextElement.innerText = mainText.join(" ");
  return mainTextElement;
};

const _drawSecondaryTextElement = (id, round) => {
  const secondaryText = [getI18nTranslation("TurnIndicator.Round"), `${round}`];
  const secondaryTextElement = document.createElement("span");
  secondaryTextElement.id = id;
  secondaryTextElement.innerText = secondaryText.join(" ");
  return secondaryTextElement;
};

export const drawTextElement = (
  id,
  mainTextId,
  secondaryTextId,
  currentCombatantName,
  round
) => {
  const mainTextElement = _drawMainTextElement(
    mainTextId,
    currentCombatantName
  );
  const secondaryTextElement = _drawSecondaryTextElement(
    secondaryTextId,
    round
  );
  const textElement = document.createElement("div");
  textElement.id = id;
  const brElement = document.createElement("br");
  textElement.appendChild(mainTextElement);
  textElement.appendChild(brElement);
  textElement.appendChild(secondaryTextElement);
  return textElement;
};
