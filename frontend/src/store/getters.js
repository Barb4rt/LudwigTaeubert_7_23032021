export const loggedIn = (state) => {
  return !!state.user;
};

export const userProfil = (state) => state.userProfil;

export const userConnect = (state) => state.userProfil.id;

export const users = (state) => state.listOfUsers;

export const profil = (state) => state.userToShow;

export const eventList = (state) => state.events;

export const filteredPost = (state) => state.filteredPost;

export const status = (state) => state.status;

