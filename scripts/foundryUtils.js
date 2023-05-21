export const getUserFromId = (userId) => {
  return game.users.find((user) => user.id === userId);
};

export const getI18nTranslation = (key) => {
  return game.i18n.localize(key);
};
