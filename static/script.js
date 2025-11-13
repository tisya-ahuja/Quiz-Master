import Home from './components/Home.js';
import Login from './components/Login.js';
import Register from './components/Register.js';
import Navbar from './components/Navbar.js';
import Footer from './components/Footer.js';
import Dashboard from './components/Dashboard.js';
import AdminDashboard from './components/AdminDashboard.js';
import Chapter from './components/Chapter.js';
import Quiz from './components/Quiz.js';
import Question from './components/Question.js';

const routes = [
    {path: '/', component: Home},
    {path: '/login', component: Login},
    {path: '/register', component: Register},
    {path: '/dashboard', component: Dashboard},
    {path: '/admindashboard', component: AdminDashboard},
    {path: '/api/getchapter/:id',name:'chapter', component: Chapter},
    {path: '/api/getquiz/:id',name:'quiz', component: Quiz},
    {path: '/api/getquestion/:id',name:'question', component: Question}
]

const router = new VueRouter({
    routes
})

const app = new Vue({
    el: "#app",
    router,
    template:`
    <div class = "container">
        <nav-bar></nav-bar>
        <router-view></router-view>
        <foot></foot>
    </div>
    `,
    data: {
        section: "Frontend"
    },
    components: {
        "nav-bar": Navbar,
        "foot": Footer
    },
    methods:{
        handleLogout(){
            this.loggedIn = false
        },
        handleLogin(){
            this.loggedIn = true
        }
    },
})