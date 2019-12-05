import Vue from 'vue'
import Router from 'vue-router'
import Table from '@/components/Table'
import Sentiment from '@/components/Sentiment'
import Result from '@/components/Result'
import Coba from '@/components/Coba'
import Login from '@/components/Login'
import Register from '@/components/Register'
import firebase from 'firebase'

Vue.use(Router)

let router = new Router({
  mode : 'history',
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta : {
        requiresGuest: true
      }
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      meta : {
        requiresAuth: true
      }
    },
    {
      path: '/table',
      name: 'Table',
      component: Table,
      meta : {
        requiresAuth: true
      }
    },
    {
      path: '/coba',
      name: 'Coba',
      component: Coba,
      meta : {
        requiresAuth: true
      }
    },
    {
      path: '/',
      name: 'Sentiment',
      component: Sentiment,
      meta : {
        requiresAuth: true
      }
    },
    {
      path: '/result',
      name: 'Result',
      component: Result,
      meta : {
        requiresAuth: true
      }
    },
  ]
});

// Nav Guard
router.beforeEach((to, from, next) => {
  // Check for requiresAuth guard
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Check if NO logged user
    if (!firebase.auth().currentUser) {
      // Go to login
      next({
        path: '/login',
        query: {
          redirect: to.fullPath
        }
      });
    } else {
      // Proceed to route
      next();
    }
  } else if (to.matched.some(record => record.meta.requiresGuest)) {
    // Check if NO logged user
    if (firebase.auth().currentUser) {
      // Go to login
      next({
        path: '/',
        query: {
          redirect: to.fullPath
        }
      });
    } else {
      // Proceed to route
      next();
    }
  } else {
    // Proceed to route
    next();
  }
});

export default router;
