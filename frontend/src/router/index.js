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
    //    requireAuth: true // 需要登录权限
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
        requireAuth: true // 需要登录权限
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
      redirect: 'homepage/bookstatus',//重定向到借书的子组件
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
                title: "已借阅图书的信息"
              }
            },
            {
              path: "infoAppointed",
              name: "infoAppointed",
              component: infoAppointed,
              meta: {
                title: "已预约图书的信息"
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
                title: "用户信息管理"
              }
            },
                {
                  path: "historyRegistered",
                  name: "historyRegistered",
                  component: historyRegistered,
                  meta: {
                    title: "已借阅图书的历史信息"
                  }
                },
            {
              path: "userbookcomment",
              name: "userBookComment",
              component: userBookComment,
              meta: {
                title: "用户评论与评论历史"
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
      redirect:'bookmanagement/bookborrow',//重定向到借书的子组件
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
              title: "页面借书"
            }
          },
          {
            path: "bookreturn",
            name: "BookReturn",
            component: BookReturn,
            meta: {
              title: "页面还书"
            }
          },
          {
            path: "booksubscribe",
            name: "BookSubscribe",
            component: BookSubscribe,
            meta: {
              title: "页面预约取"
            }
          },
        {
          path: "bookcheck",
          name: "BookCheck",
          component: BookCheck,
          meta: {
            title: "图书损坏登记"
          }
        },
        {
          path:"usermanagement",
          name:"UserManagement",
          component: UserManagement,
          meta: {
            title: "超管用户管理"
          }
        },
        {
          path: 'addAuthority',
          name: 'addAuthority',
          component: addAuthority,
          meta: {
            title: "添加管理员"
          }

        },
        {
          path: 'resetUser',
          name: 'resetUser',
          component: resetUser,
          meta: {
            title: "重置用户信用"
          }
        },
        {
          path: 'AdminModify',
          name: 'AdminModify',
          component: AdminModify,
          meta: {
            title: "修改密码"
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
                title: "副本借阅历史记录"
              }
            },
            {
              path: "copyHistoryInfoAppointed",
              name: "copyHistoryInfoAppointed",
              component:copyHistoryInfoAppointed,
              meta: {
                title: "副本预约历史记录"
              }
            },

          ]
        },
        {
          path: 'searchFineInfo',
          name: 'searchFineInfo',
          component: searchFineInfo,
          meta: {
            title: "罚款历史记录"
          }
        },
        {
          path: "searchCredit",
          name: "searchCredit",
          component: searchCredit,
          meta: {
            title: "查看用户信用流水记录"
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
                title: "用户借阅图书的历史信息"
              }
            },
            {
              path: "searchHistoryAppointed",
              name: "searchHistoryAppointed",
              component: searchHistoryAppointed,
              meta: {
                title: "用户预约图书的历史信息"
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
      console.log(token + '《----token')
      if (token) {
        let user = JSON.stringify(store.state.userAuthority)
        console.log('用户身份：（Librarian或undefine）--->' + user)
        if ((user !== '"Librarian"' && to.matched.some(record => record.meta.requireAdmin))) {
          //如果非管理员的去了管理员页面，就会定向到helloworld.vue
          next({path:'/'})
        } else {
          next();
        }
      } else {
        next({
          path: '/login',
          query: {redirect: to.fullPath} // 登录成功之后重新跳转到该路由
        })
      }
    }
  } else {
    next()
  }
})



// })
