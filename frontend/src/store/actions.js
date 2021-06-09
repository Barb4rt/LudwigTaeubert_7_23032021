import axios from "axios";
import api from "./../../api/index";

export const Register = ({ commit }, credentials) => {
  return axios
    .post("http://localhost:8081/api/user/register", credentials)
    .then(({ data }) => {
      commit("SET_USER_DATA", data);
    });
};
export const Login = ({ commit }, credentials) => {
  return axios
    .post("http://localhost:8081/api/user/login", credentials)
    .then(({ data }) => {
      commit("SET_USER_DATA", data);
    });
};
export const Logout = ({ commit }) => {
  commit("LOGOUT");
};
export const  GetAllUsers = async ({ commit }) => {
  
  try {
    await api.getAllUsers().then(({ data }) => {
      commit("SET_ALL_USERS", data);
      commit("UPDATE_STATUS", 'success');
  })
}catch (err) {
  console.log(err);
} 
  };
export const  GetUserProfil = async ({ commit }) => {
  try {
    await api.getUserProfil().then(({ data }) => {
      commit("SET_USER_DATA", data);
      commit("UPDATE_STATUS", 'success');
  })
}catch (error) {
  commit("LOGOUT")
} 
  };

export const SeeProfil = async ({ commit },userId)=>{
  console.log(userId);
  try {
    await commit("PROFIL_TO_SHOW" , userId)
  }
  catch (error){
    console.log(error);
  }
}
export const DestroyProfil = async ({ commit }, data) => {
    commit("UPDATE_STATUS", 'pending');
    
    return api.destroyProfil(data).then(() => {
        commit("UPDATE_STATUS", 'success');
        commit("LOGOUT")
    }).catch((err) => {
      console.log(err);
    });
    }
    export const adminDestroyProfil = async ({ commit }, data) => {
      commit("UPDATE_STATUS", 'pending');
      
      return api.adminDestroyProfil(data).then(() => {
          commit("UPDATE_STATUS", 'success');
      }).catch((err) => {
        console.log(err);
      });
      }


export const GetAllPost = async ({ commit }) => {
try {
  await api.getAllPost().then(({ data }) => {
    commit("GET_ALL_EVENT", data)
    commit("UPDATE_STATUS", 'success');
})
}catch (err) {
  console.log(err);
} }

export const FilterPost = ({ commit }, filter) => {
  commit("FILTER_POST", filter)
  }

  export const PutUser = ({ commit }, credentials) => {
    commit("UPDATE_STATUS", 'pending');
    return axios
      .put("http://localhost:8081/api/user/me", credentials)
      .then(() => {
        commit("UPDATE_STATUS", 'success');
      });
  };

  export const CreatePost = ({commit}, credentials)=>{
    commit("UPDATE_STATUS", 'pending');
    return axios
    .post("http://localhost:8081/api/messages/new", credentials)
    .then((res) => {
      commit("UPDATE_STATUS", 'success')
      return res
    })
    .catch((err) => {
      console.log(err);
    });
  }

  export const CommentPost = async ({ commit }, credentials) => {
    commit("UPDATE_STATUS", 'pending');
    return api.commentPost(credentials).then(() => {
        commit("UPDATE_STATUS", 'success');
    }).catch((err) => {
      console.log(err);
    });
    }
    
    export const LikePost = async ({ commit }, credentials) => {
      commit("UPDATE_STATUS", 'pending');
      return api.likePost(credentials).then(() => {
          commit("UPDATE_STATUS", 'success');
      }).catch((err) => {
        console.log(err);
      });
      }

    export const DestroyPost = async ({ commit }, data) => {
        commit("UPDATE_STATUS", 'pending');
        
        return api.destroyPost(data).then(() => {
            commit("UPDATE_STATUS", 'success');
        }).catch((err) => {
          console.log(err);
        });
        }
        export const adminDestroyPost = async ({ commit }, data) => {
          commit("UPDATE_STATUS", 'pending');
          
          return api.adminDestroyPost(data).then(() => {
              commit("UPDATE_STATUS", 'success');
          }).catch((err) => {
            console.log(err);
          });
          }

        export const DestroyComment = async ({ commit }, data) => {
          commit("UPDATE_STATUS", 'pending');
          return api.destroyComment(data).then(() => {
              commit("UPDATE_STATUS", 'success');
          }).catch((err) => {
            console.log(err);
          });
          }
