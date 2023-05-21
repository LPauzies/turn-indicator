// Object related
export const isObjectUsable = (object) => {
  return (
    object !== null && object !== undefined && Object.keys(object).length !== 0
  );
};
