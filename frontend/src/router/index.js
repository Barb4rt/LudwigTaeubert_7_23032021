import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import LoginUser from "../views/LoginUser.vue";
import RegisterUser from "../views/RegisterUser.vue";
import Thread from "../views/Thread";
import PrivateThread from "../views/PrivateThread";
import userDashboard from "../views/UserDashboard";
import userProfil from "../views/UserProfil";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/login",
    name: "login",
    component: LoginUser,
  },
  {
    path: "/register",
    name: "register",
    component: RegisterUser,
  },
  {
    path: "/thread",
    name: "thread",
    component: Thread,
    meta: { requiresAuth: true },
  },
  {
    path: "/privatethread",
    name: "privatethread",
    component: PrivateThread,
    meta: { requiresAuth: true },
  },
  {
    path: "/dashboard/user",
    name: "userdashboard",
    component: userDashboard,
    meta: { requiresAuth: true },
  },
  {
    path: "/userprofil",
    name: "userprofil",
    component: userProfil,
    meta: { requiresAuth: true },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const loggedIn = localStorage.getItem("user");
  if (to.matched.some((record) => record.meta.requiresAuth) && !loggedIn) {
    next("/");
  }
  next();
});

export default router;
