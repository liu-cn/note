// // 引入http模块
// var http =require ("http")

// // 创建serve实例
// var serve=http.createServer()

// // 处理请求函数，request为客户端对服务器的请求对象，response是服务器对客户端的相应对象。
// serve.on("request",function (request,response) {
//   // 会打印在服务器，
//   console.log("hello node")
//   console.log(request.url)
//   // 会响应给客户端
//   response.end("hello node")
// })

// // 启动服务，
// serve.listen(8080,function () {
//   console.log("服务启动成功！")
// })



// 引入http模块
var http =require ("http")

// 创建serve实例
var serve=http.createServer()

// 处理请求函数，request为客户端对服务器的请求对象，response是服务器对客户端的相应对象。
serve.on("request",function (request,response) {
  
  // 获取请求的路径
  var url =request.url

  // 对请求的路径进行判断
  if(url=="/"){
    // response.writeHead方法在消息中只能被调用一次，且必须在 response.end() 被调用之前调用。
    response.writeHead(200,{"Content-Type":"text/html; charset=utf-8"})
    // 响应多行数据使用write后end结束，  注：响应数据只能是，字符串或二进制数据。
    response.write("<h1>欢迎来到首页！</h1>")
    response.write("<h1>hello world!</h1>")
    response.end()
    // 下面的数据会打印在服务器，
    console.log("请求的路径是：",request.url);
    
  } else if(url=="/other") {
    response.writeHead(200,{"Content-Type":"text/html; charset=utf-8"})
    // 响应只有一行可以直接简写为end来响应数据，
    response.end("<h1>欢迎来到其它！</h1>")
    console.log("请求的路径是：",request.url);
  }else if(url=="/me"){
    response.writeHead(200,{"Content-Type":"text/html; charset=utf-8"})
    response.end("<h1>欢迎来到我的页面！</h1>")
    console.log("请求的路径是：",request.url);
  }else if(url=="/about"){
    response.writeHead(200,{"Content-Type":"text/html; charset=utf-8"})
    response.end("<h1>欢迎来到关于页面！</h1>")
    console.log("请求的路径是：",request.url);
  }else{
    response.end("404 not find")
    console.log("请求的路径是：",request.url);
  }

})

// 启动服务，
serve.listen(8080,function () {
  console.log("服务启动成功！")
})




