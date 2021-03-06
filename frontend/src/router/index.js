import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Homepage from '@/components/Homepage'
import AdminLogin from '@/components/AdminLogin'
import Login from '@/components/login'
import Register from '@/components/register'
import BookStatus from '@/components/BookStatus'
import BookDetail from '@/components/BookDetail'
import BookManagement from '@/components/BookManagement'
import Upload from '@/components/upload'
import copyUpload from "../components/copyUpload";
import info from "../components/info";
import infoAppointed from "../components/infoAppointed";
import infoRegistered from "../components/infoRegistered";
import modify from "../components/modify";
import BookBorrow from '@/components/BookBorrow'
import BookReturn from '@/components/BookReturn'
import BookSubscribe from '@/components/BookSubscribe'
import BookSearch from '@/components/BookSearch'
import addAuthority from "../components/addAuthority";
import AdminModify from "../components/AdminModify";
import copyInfo from "../components/copyInfo";
import adminBookStatus from "../components/adminBookStatus";
import adminBookSearch from "../components/adminBookSearch";
import fineInfo from "../components/fineInfo";
import userBookComment from "../components/userBookComment"
import historyRegistered from "../components/historyRegistered";
import searchHistory from "../components/searchHistory";
import searchHistoryAppointed from "../components/searchHistoryAppointed";
import searchHistoryRegistered from "../components/searchHistoryRegistered";
import copyHistoryInfo from "../components/copyHistoryInfo";
import copyHistoryInfoAppointed from "../components/copyHistoryInfoAppointed";
import copyHistoryInfoRegistered from "../components/copyHistoryInfoRegistered";
import UserManagement from "../components/UserManagement";
import UserManagementV1 from '../components/UserManagementV1';
import BookCheck from "../components/BookCheck";
import searchFineInfo from "../components/searchFineInfo";
import resetUser from "../components/resetUser";
import userCredit from "../components/userCredit";
import searchCredit from "../components/searchCredit";
import adminBookDetail from "../components/adminBookDetail";
import store from '../store'
Vue.use(Router);

export const router = new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld,
      meta: {
    //    requireAuth: true // ??????????????????
      }
    },
    {
      path: '/adminBookStatus',
      name: 'adminBookStatus',
      component: adminBookStatus,
      meta:{
        requireAdmin: true,
        requireAuth: true
      }
    },
    {
      path: '/adminbookdetail',
      name:'adminBookDetail',
      component: adminBookDetail,
      meta:{
        requireAdmin: true,
        requireAuth: true
      }
    },
    {
      path: '/adminBookSearch',
      name: 'adminBookSearch',
      component: adminBookSearch,
      meta:{

      }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/adminlogin',
      name: 'AdminLogin',
      component: AdminLogin
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/upload',
      name: 'Upload',
      component: Upload,
       meta: {
        requireAdmin:true,
        requireAuth: true // ??????????????????
       }
    },
    {
      path: '/copyUpload',
      name: 'copyUpload',
      component: copyUpload,
      meta: {
        requireAdmin:true,
        requireAuth: true
      }
    },




    {
      path: '/homepage',
      name: 'Homepage',
      component: Homepage,
      redirect: 'homepage/bookstatus',//??????????????????????????????
      meta: {
        requireAuth: true,
      },
      children: [
        {
          path: 'bookstatus',
          name: 'BookStatus',
          component: BookStatus,
        },
        {
          path: 'bookdetail',
          name:'BookDetail',
          component: BookDetail,
        },
        {
          path:'booksearch',
          name:'BookSearch',
          component:BookSearch,
          meta: {
            requireAdmin:false,
            requireInput:true
          }
        },

        {
          path: 'info',
          name: 'info',
          component: info,
          meta: {
            requireAuth: true
          },
          redirect: 'info/infoAppointed',
          children: [
            {
              path: "infoRegistered",
              name: "infoRegistered",
              component: infoRegistered,
              meta: {
                title: "????????????????????????"
              }
            },
            {
              path: "infoAppointed",
              name: "infoAppointed",
              component: infoAppointed,
              meta: {
                title: "????????????????????????"
              }
            },
            {
              path: 'modify',
              name: 'modify',
              component: modify,
              meta: {
                requireAuth: true
              }
            },
            {
              path:"fineInfo",
              name:'fineInfo',
              component:fineInfo,
              // meta:{
              //   requireAuth:true
              // }
            },
            {
              path:"usermanagementv1",
              name:"UserManagementv1",
              component: UserManagementV1,
              meta: {
                title: "??????????????????"
              }
            },
                {
                  path: "historyRegistered",
                  name: "historyRegistered",
                  component: historyRegistered,
                  meta: {
                    title: "??????????????????????????????"
                  }
                },
            {
              path: "userbookcomment",
              name: "userBookComment",
              component: userBookComment,
              meta: {
                title: "???????????????????????????"
              }
            },
            {
              path: '/userCredit',
              name: 'userCredit',
              component: userCredit,
            },



          ]
        },


      ],
    },
    {
      path: '/copyInfo',
      name: 'copyInfo',
      component: copyInfo,
      meta: {
        requireAuth:true,
        requireAdmin:true
      }
    },
    {
      path: '/bookmanagement',
      name: 'BookManagement',
      component: BookManagement,
      redirect:'bookmanagement/bookborrow',//??????????????????????????????
      meta: {
        requireAdmin:true,
        requireAuth:true,
      },
      children: [

          {
            path: "bookborrow",
            name: "BookBorrow",
            component: BookBorrow,
            meta: {
              title: "????????????"
            }
          },
          {
            path: "bookreturn",
            name: "BookReturn",
            component: BookReturn,
            meta: {
              title: "????????????"
            }
          },
          {
            path: "booksubscribe",
            name: "BookSubscribe",
            component: BookSubscribe,
            meta: {
              title: "???????????????"
            }
          },
        {
          path: "bookcheck",
          name: "BookCheck",
          component: BookCheck,
          meta: {
            title: "??????????????????"
          }
        },
        {
          path:"usermanagement",
          name:"UserManagement",
          component: UserManagement,
          meta: {
            title: "??????????????????"
          }
        },
        {
          path: 'addAuthority',
          name: 'addAuthority',
          component: addAuthority,
          meta: {
            title: "???????????????"
          }

        },
        {
          path: 'resetUser',
          name: 'resetUser',
          component: resetUser,
          meta: {
            title: "??????????????????"
          }
        },
        {
          path: 'AdminModify',
          name: 'AdminModify',
          component: AdminModify,
          meta: {
            title: "????????????"
          }
        },
        {
          path: 'copyHistoryInfo',
          name: 'copyHistoryInfo',
          component: copyHistoryInfo,
          // meta:{
          //   requireAuth:true,
          //   requireAdmin:true
          // }
          redirect: 'copyHistoryInfo/copyHistoryInfoRegistered',
          children: [
            {
              path: "copyHistoryInfoRegistered",
              name: "copyHistoryInfoRegistered",
              component:copyHistoryInfoRegistered,
              meta: {
                title: "????????????????????????"
              }
            },
            {
              path: "copyHistoryInfoAppointed",
              name: "copyHistoryInfoAppointed",
              component:copyHistoryInfoAppointed,
              meta: {
                title: "????????????????????????"
              }
            },

          ]
        },
        {
          path: 'searchFineInfo',
          name: 'searchFineInfo',
          component: searchFineInfo,
          meta: {
            title: "??????????????????"
          }
        },
        {
          path: "searchCredit",
          name: "searchCredit",
          component: searchCredit,
          meta: {
            title: "??????????????????????????????"
          }
        },
        {
          path: 'searchHistory',
          name:'searchHistory',
          component:searchHistory,
          // meta:{
          //   requireAuth: true,
          //   requireAdmin:true
          // },
          redirect: 'searchHistory/searchHistoryRegistered',
          children: [
            {
              path: "searchHistoryRegistered",
              name: "searchHistoryRegistered",
              component: searchHistoryRegistered,
              meta: {
                title: "?????????????????????????????????"
              }
            },
            {
              path: "searchHistoryAppointed",
              name: "searchHistoryAppointed",
              component: searchHistoryAppointed,
              meta: {
                title: "?????????????????????????????????"
              }
            }
          ]
        },
        ]
    },

  ]
})



router.beforeEach(function (to, from ,next) {
  if (to.matched.some(record => record.meta.requireAuth)) {
    if (to.path === '/login' || to.path === '/adminlogin' || to.path === '/') {
      next();
    } else {
      let token = localStorage.getItem('Authorization');
      console.log(token + '???----token')
      if (token) {
        let user = JSON.stringify(store.state.userAuthority)
        console.log('??????????????????Librarian???undefine???--->' + user)
        if ((user !== '"Librarian"' && to.matched.some(record => record.meta.requireAdmin))) {
          //????????????????????????????????????????????????????????????helloworld.vue
          next({path:'/'})
        } else {
          next();
        }
      } else {
        next({
          path: '/login',
          query: {redirect: to.fullPath} // ??????????????????????????????????????????
        })
      }
    }
  } else {
    next()
  }
})



// })
