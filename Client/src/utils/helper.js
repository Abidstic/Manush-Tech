export const numberOfMeal = (data, property) => {
  return data.reduce((acc, user) => {
    return acc + user[property];
  }, 0);
};
