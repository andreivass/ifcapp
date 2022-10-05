import { createWebHistory, createRouter } from "vue-router";
import Login from "./components/authentication/Login.vue";
import Register from "./components/authentication/Register.vue";

const routes =  [
  {
    path: "/",
    alias: "/home",
    name: "home",
    component: () => import("./components/Home")
  },
  {
    path: "/projects",
    alias: "/projects",
    name: "projects",
    component: () => import("./components/project/Projects.vue")
  },
  {
    path: "/addproject",
    name: "add-project",
    component: () => import("./components/project/AddProject.vue")
  },
  {
    path: "/project/:id",
    name: "project-details",
    component: () => import("./components/project/ProjectDetails.vue")
  },
  {
    path: "/editproject/:id",
    name: "edit-project",
    component: () => import("./components/project/EditProject.vue")
  },
  {
    path: "/login",
    name: "login",
    component: Login
  },
  {
    path: "/register",
    name: "register",
    component: Register
  }
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/register', '/'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('user');

  // trying to access a restricted page + not logged in
  // redirect to login page
  if (authRequired && !loggedIn) {
    next('/login');
  } else {
    next();
  }
});

export default router;