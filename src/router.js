import { createWebHistory, createRouter } from "vue-router";
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
    component: () => import("./components/project/Project.vue")
  },
  {
    path: "/mainlayout",
    name: "main-layout",
    component: () => import("./components/MainLayout")
  }
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;