// Object related
export const isObjectUsable = (object) => {
  return (
    object !== null && object !== undefined && Object.keys(object).length !== 0
  );
};

// DOM related
export const setHiddenDiv = (div, isHidden) => (div.hidden = isHidden);
