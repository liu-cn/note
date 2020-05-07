# vue路由的练习和使用

## 主文件main.js

```javascript
// 导入vue
import Vue from 'vue'
// 导入App组件
import App from './App.vue'
// 导入路由
import router from './router/index.js'

Vue.config.productionTip = false

new Vue({
  // 添加路由
  router,

  // 此函数最终会找到index.html文件中的id为app的div用App组件对此进行替换
  render: h => h(App)
}).$mount('#app')
```

## 根组件App.vue

```javascript
<template>
  <div>
    <p>我是app</p>
    
    <!-- 原生跳转路由方式,replace为不能后退模式,active-class为活跃路由添加的class -->
    <router-link replace class="btn1" tag="button" to='/home' active-class="active">home</router-link>
    <router-link replace class="btn1" tag="button" to='/about'>about</router-link>
    <router-link replace class="btn1" tag="button" :to='/user/+userid'>user</router-link>
    <!-- path后边query跟的是查询字符串， -->
    <!-- <router-link class="btn1" tag="button" :to='{path:"/profile",query:{name:"liu",age:18,gender:"男"}}'>profile</router-link> -->
    <router-link replace class="btn1" tag="button" :to='{path:"/profile",query:querylist}'>profile</router-link>

    <!-- 这个来显示组件内容，keep-alive保证组件不会被频繁销毁。 -->
    <keep-alive ><router-view/></keep-alive>
    <!-- <router-view/> -->
  </div>
</template>

<script>
export default {
  name:"App",
  data () {
    return {
      userid:"zhangsan",
      querylist:[
        {
        name:"刘先生",
        age:18,
        gender:"男"
      },{
        name:"李先生",
        age:19,
        gender:"男"
      }
      ]
    }
  },
  methods: {
    
    // 跳转到home，可以自己创建按钮或链接来跳转路由。
    BtnToHome(){
      this.$router.replace("/home")
    },
    // 跳转到about
    BtnToAbout(){
      this.$router.replace("/about")
    },
    BtnToLisi(){
      let nowpath=this.$route.path
      // substring(开始位置，结束位置)字符串截取函数
      if(nowpath.substring(nowpath.length-4,nowpath.length)!="lisi")
      this.$router.replace(this.$route.path+"/lisi")
    }
  }
}
</script>

<style>
.btn1{
  color: red;
  margin: 10px;
}
</style>
```

## 路由文件index.js

```javascript
// 导入vue
import Vue from "vue"
// 导入路由
import VueRouter from "vue-router"

// 导入Home组件，非懒加载模式
// import Home from "../components/Home.vue"

// 导入About组件
// import About from "../components/About.vue"

// 导入User组件
// import User from "../components/User.vue"

// 路由的懒加载方式,用到组件时再加载组件，懒加载模式打包后的js文件更小，加载的更快。
const Home =()=> import("../components/Home.vue")
const About =()=> import("../components/About.vue")
const User =()=> import("../components/User.vue")
const HomeNews =()=> import("../components/HomeNews.vue")
const HomeMessage =()=> import("../components/HomeMessage.vue")
const Profile =()=> import("../components/Profile.vue")
// 安装路由插件(只要是插件多必须要安装)
Vue.use(VueRouter)

// 创建路由映射表
const routes=[
  {
    // 路由重定向，
     path: '', redirect: "/home"
  },
  { 
    path: '/home', component: Home,
    // 添加元数据
    meta: {title:"首页" },
    // home路由后的子路由，嵌套路由
    children:[
      // 子组件也可以重定向，不过这个被生命周期函数给抢饭碗了。
      // {
      //   path:"/", redirect: "news"
      // },
      {
        path: 'news', component: HomeNews
      },
      {
         path: 'message', component: HomeMessage
      }
    ]
  },
  {
     path: '/about', component: About,
     meta: {title:"关于" },

     //  私有导航守卫,独享守卫，只有到跳转到这个页面才执行此函数。
     beforeEnter:(to,from,next)=>{
       console.log("欢迎来到关于页面,独享守卫")
       next()
     }
  },
  // home后边绑定一个动态路径，
  {
     path: '/home/:user', component: User
  },
  {
     path: '/about/:user', component: User 
  },
  {
     path: '/user/:user', component: User,
     meta: {title:"用户" },
  },
  {
   path: '/profile', component: Profile,
   meta: {title:"我的"},
  }
]

// 创建路由对象
const router=new VueRouter({

  // 把路由映射表添加到路由对象
  routes,

  // 路由切换模式为history
  mode:"history"
})

// 全局导航守卫(前置钩子)，监听路由跳转。to跳转到哪里，from来自哪里，
router.beforeEach((to, from, next) => {
  //to and from are Route Object,next() must be called to resolve the hook}
  //to和from是Route对象，必须调用next（）来解析hook
  
  //   // 必须调用next方法。
    next()
    // matched[0]为路由嵌套最前边的路由http://localhost:8080/home/news 即home路由。
    document.title=to.matched[0].meta.title
    console.log("from=",from.path);
    console.log("to=",to.path);
})

// 导出路由对象
export default router
```

## Home.vue组件

```javascript
<template>
<div class="home">
  <h1 class="title">
    我是home
  </h1>
  
  <router-link class="homechd" to="/home/news">新闻</router-link>
  <router-link class="homechd" to="/home/message">消息</router-link>
  <keep-alive><router-view/></keep-alive>
</div>
</template>

<script>

// 导出组件
export default {
  name:"Home",
  data () {
    return {
      // 记录组件路径
      path:"/home/news"
    }
  },
  // activated()页面出现的时候执行
  activated () {
    console.log("home 处于活跃");
    // 首次创建先重定向到/home/news，重新回到该页面还能记录并回到上次浏览的页面。
    if (this.path=="/home") {
      this.$router.push(this.path)
    }else if(this.path==this.$route.path){
      return
    }else{
      this.$router.push(this.path)
    }
  },
  // 页面失去活跃的时候执行
  deactivated () {
    console.log("home 失去活跃");
  },
  // 导航离开该组件的对应路由时调用
  beforeRouteLeave (to, from, next) { 
    // 可以访问组件实例 `this`
    // 离开之前先记录此次离开时的路径并赋值给path，
    this.path=this.$route.path
    // 调用next后才会执行下一步操作。
    next()
  },
  // 在home页面中，消息和新闻之间切换时会调用。
  beforeRouteUpdate (to, from, next) {
    // 在当前路由改变，但是该组件被复用时调用
    // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
    // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
    // 可以访问组件实例 `this`
    this.path=this.$route.path
    console.log("home 组件的路径被修改。");
    next()
  },
  // 监测路由，watch函数可检测数据的变化。
  watch: {
    "$route"(to,from){
      // console.log("to=",to.path)
      // console.log("from=",from.path);
      // 如果要跳到/home,则回到上次记录的位置。
      if(to.path=="/home"){
        this.$router.push(this.path)
      }
    }
  }
}
</script>


<style>

.home .title{
    color: red;
}
.home .homechd{
  margin: 10px;
}

</style>
```

## Home组件里子组件->HomeNews.vue

```javascript
<template>
  <div class="news">
    <ul>新闻1</ul>
    <ul>新闻2</ul>
    <ul>新闻3</ul>
  </div>
</template>

<script>
export default {
  name:"HomeNews"
}
</script>

<style>

</style>
```

## Home组件里的子组件->HomeMessage.vue

```javascript
<template>
  <div class="message">
    <ul>消息1</ul>
    <ul>消息2</ul>
    <ul>消息3</ul>
  </div>
</template>

<script>
export default {
  name:"HomeMessage"
}
</script>

<style>

</style>
```



## About.vue组件

```javascript
<template>
<div class="about">
  <h1 class="title">
    我是About
  </h1>
  <p>{{test}}</p>
  <button @click="test++">+</button>
</div>
  
</template>

<script>
// 导出组件
export default {
  name:"About",
  data () {
    return {
      test:10
    }
  },
  // 如果路由后嵌套有路由，则生命周期函数不会被执行，/about/lisi,不会执行/about的生命周期函数

  // 生命周期函数，回调函数,
  //组件被创建之前调用，beforeCreate() 调用时组件中的data和methods都还没有初始化。
  beforeCreate () {
    console.log("about组件即将被创建，");
  },
  // 组件被创建时调用，暂存在内存中，还没挂载到页面上。
  created () {
    console.log("about组件被创建！");  
  },
  // 组件挂载到页面之前调用。
  beforeMount(){
    console.log("about组建已准备就绪，准备挂载到页面。");
  },
  // 此时组件正式被挂载到页面上，调用。mounted 是 实例创建期间的最后一个生命周期函数
  mounted(){
    console.log("about组件正式被挂载到页面上");
  },
  // 组件内数据被更新时调用，但是页面还没有被刷新。
  beforeUpdate(){
    console.log("about组件数据即将被更新！");
  },
  // 此时组件内的数据和页面显示的数据已经同步了，页面已经被更新。
  updated(){
    console.log("about组件数据已经被更新！"); 
  },
  // 组件销毁之前执行，当beforeDestroy函数执行时，，组件实例身上所有的方法与数据都处于可用状态
  beforeDestroy(){
    console.log("about组件即将被销毁！");
    
  },
    // 组件被销毁时调用，此时组件实例上的数据和方法都不可用。
  destroyed () {
    console.log("about组件已被销毁！");
  },
  /*activated()页面出现的时候执行 activated生命周期函数，跟 监听 watch 有类似的作用。
activated生命周期函数，是配合 keep-alive 进行使用。
进入页面时，mounted 与 activated 生命周期函数都会执行，当前 keep-alive 时，进行了缓存，
这时返回上一页 ，mounted生命周期函数不会执行，而 activated 会执行。
*/
  activated () {
    console.log("about组件处于活跃状态");
  },
  // 失去活跃状态时调用，需要配合keep-alive使用，
  deactivated () {
    console.log("about失去活跃状态");
  }
}
</script>

<style>
.about .title{
    color: orange;
}
</style>
```

## Profile.vue组件

```javascript
<template>
  <div class="profile">
      <h1>我是profile</h1>
      <!-- this.$route.query中带有参数，可以直接取出 -->
      <!-- this.$route代表活跃路由，即为当前路由，query是跳转到活跃路由时携带的参数 -->
      <p>{{this.$route.query}}</p>
      <div v-for="(item,key) of this.$route.query" :key="key">
        <div>{{key}}:{{item}}</div>
        <div v-for="inneritem of item" :key="inneritem.age">{{inneritem.name}} --{{inneritem.age}} --{{inneritem.gender}}</div>
      </div>
      
  </div>
</template>

<script>
export default {
  name:"Profile"
}
</script>

<style>
</style>
```

## User.vue组件

```javascript
<template>
  <div class="User">
      <div>
        我是{{getuser()}}
      </div>
  </div>
</template>

<script>
export default {
  name:"User",
  methods: {
    getuser(){
      // 获取绑定的动态路由路径
      return this.$route.params.user
    },
  }
}
</script>

<style>

</style>
```

