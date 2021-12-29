import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
const store = new Vuex.Store({
  state: {
    // 存储token
    Authorization: localStorage.getItem('Authorization') ? localStorage.getItem('Authorization') : '',
    //用户名,即学号或工号
    username:localStorage.getItem('username') ? localStorage.getItem('username') : '',
    //储存用户权限 student/teacher/librarian
    userAuthority:localStorage.getItem('userAuthority') ? localStorage.getItem('userAuthority') : '',
    //管理员上班的图书馆
    librarianWorkplace:localStorage.getItem('librarianWorkplace') ?localStorage.getItem('librarianWorkplace') : '',
    //类别
    librarianType:localStorage.getItem('type')?localStorage.getItem('type'):'',
    searchInput:'',
    searchResult:'',
    isbn:''
  },
  mutations: {
    // 修改token，并将token、username、权限存入localStorage
    changeLogin (state, user) {
      state.Authorization = user.Authorization;
      state.username = user.username;//这两条根据实际传的类型修改
      state.userAuthority = user.userAuthority;
      localStorage.setItem('username', user.username);
      localStorage.setItem('Authorization', user.Authorization);
      localStorage.setItem('userAuthority', user.userAuthority);
    },
    //管理员
    adminLogin(state,user){
      state.Authorization = user.Authorization;
      state.username = user.username;//这两条根据实际传的类型修改
      state.userAuthority = user.userAuthority;
      state.librarianWorkplace=user.librarianWorkplace;
      localStorage.setItem('username', user.username);
      localStorage.setItem('Authorization', user.Authorization);
      localStorage.setItem('userAuthority', user.userAuthority);
      localStorage.setItem('librarianWorkplace',user.librarianWorkplace)

    },
    setUserAuthority(state,input){//
     state.userAuthority =input ;
      localStorage.setItem('userAuthority',input)
      console.log("用户是："+state.userAuthority)
    },
    searchInput(state,input){
      state.searchInput = input ;
      console.log("搜索了："+state.searchInput)
    },
    searchResult(state,input){
      state.searchResult = JSON.stringify(input) ;
      console.log("结果是："+state.searchResult)
    },
    setType(state,input){
      state.librarianType=input;
      localStorage.setItem('type',input);
      console.log("管理员是："+state.librarianType)
    },
    setSearchIsbn(state,input){
      state.isbn = input;
      console.log("当前查找副本的书籍isbn是：" + state.isbn);
    },
    setSearchCover(state,input){
      state.cover = input;
      console.log("当前查看副本的书籍封面是：" + state.cover);
    },
    setSearchBookId(state,input){
      state.bookId = input;
      console.log("当前查看历史记录的副本编号是：" + state.bookId);
    }
  }
});

export default store;
