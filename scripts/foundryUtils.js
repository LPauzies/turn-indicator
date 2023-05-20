export const getUserFromId = (userId) => {
  return game.users.find((user) => user.id === userId);
};

export const getI18nTranslation = (key) => {
  return game.i18n.localize(key);
};

export const getI18nRandomItem = (key, rangeMin, rangeMax) => {
  const randomIndex =
    Math.floor(Math.random() * (rangeMax - rangeMin + 1)) + rangeMin;
  const i18nCompleteKey = `${key}.${randomIndex}`;
  return getI18nTranslation(i18nCompleteKey);
};
