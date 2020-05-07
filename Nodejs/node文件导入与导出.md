# node文件的导入和导出

**a.js代码**

````javascript
// 定义变量
var age =18

// 导出一个对象为{age:18,name:"liu"},exports为一个对象。
exports.age=age
exports.name="liu"

console.log(exports);
// 输出为-->{ age: 18, name:'liu'}
````

**main.js代码**

```javascript
//引入上面a.js文件
var  a= require("./a.js")

// 打印a对象
console.log(a)
// 输出为-->{ age: 18, name:'liu'}
console.log(a.age)
// 输出为--> 18
```

**注意:**

1. 默认情况下文件不exports导出的话，各文件定义的变量都是独立的，互不影响，想使用其他文件变量和方法必须导出和导入

