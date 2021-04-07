export const loggedIn = (state) => {
  return !!state.user;
};

export const eventList = (state) => state.clients;
