import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/login',
            name: 'login',
            component: ()=>import("@/pages/LoginPage.vue"),
            children:[
                {
                    path: "",
                    name: "loginView",
                    component: ()=>import("@/views/LoginView.vue"),
                }, {
                    path: "register",
                    name: "registerView",
                    component: ()=>import("@/views/RegisterView.vue"),
                }, {
                    path: "forgot",
                    name: "forgotView",
                    component: ()=>import("@/views/ForgotView.vue"),
                }
            ]
        },
        {
            path: '/',
            name: 'home',
            component: ()=>import("@/pages/HomePage.vue"),
            children:[
                {
                    path: "",
                    name: "homeView",
                    component: ()=>import("@/views/TestView1.vue"),
                },{
                    path: "qualificationVerify",
                    component: () => import("@/views/CheckDoctorView.vue")
                },{
                    path: "forumCensor",
                    component: () => import("@/views/CheckFloorView.vue")
                },{
                    path: "medicineManagement",
                    component: () => import("@/views/ManageMedicine.vue"),
                }, {
                    path: "reportHandle",
                    component: () => import("@/views/CheckReportCommentView.vue")
                },{
                    path: "AddMedicine",
                    component: () => import("@/views/AddMedicine.vue"),
                }, {
                    path: "ModifyMedicine",
                    component: () => import("@/views/ModifyMedicine.vue"),
                },
                    path: "newsManagement",
                    component: () => import ("@/views/FlashEditorView.vue")
                },{
                    path: "adminiInfo",
                    name: "myView",
                    component: () => import("@/views/AdministratorInfoView.vue")
                },{
                    path: "adminiInfo/:administratorID",
                    name: "otherView",
                    component: () => import("@/views/AdministratorInfoView.vue")
                }
            ]
        },{
            path: "/test",
            name: "test",
            component: () => import ("@/components/postView/TipTapEditable.vue")
        },
        { path: '/:pathMatch(.*)*', name: 'NotFound', component: ()=>import("@/pages/ErrorPage.vue") },

    ]
})

export default router
