# account-book

## Run

In the project directory, run the [Tabris CLI](https://www.npmjs.com/package/tabris-cli) command:

```
tabris serve
```

This will start a JavaScript app code server at a free port and print its URL to the console.

The JavaScript app code can be [side-loaded](https://tabrisjs.com/documentation/2.0/developer-app.html#the-developer-console) in the [developer app](https://tabrisjs.com/documentation/2.0/developer-app.html) if the default config.xml was not changed. Otherwise, the JavaScript app code must be side-loaded in a [debug build](https://tabrisjs.com/documentation/2.0/build.html#building-a-tabrisjs-app) of this app.

## Build

The app can be built using the online build service at [tabrisjs.com](https://tabrisjs.com) or locally using [Tabris.js CLI](https://www.npmjs.com/package/tabris-cli).

See [Building a Tabris.js App](https://tabrisjs.com/documentation/2.0/build.html) for more information.

# tabris.js的使用

## 初步搭建

必备条件

-  `node`版本 `>= 6.0`
-  全局安装`tabris-cli`
-  手机调试app：`Tabris.js 2`

`git`上创建一个空项目，随后克隆下来`git clone xxxxx.git`，之后执行`tabris init`初始化项目，最后执行`tabris serve`，项目启动。  
[中文文档](https://youjingyu.github.io/Tabris-Documention/)  
[官网文档](https://tabrisjs.com/documentation/latest/)

## 使用

-  <a href='#2.1'>绑定两元素使用: `baseline: '#{id}'`</a>
-  <a href='#2.2'>弹层使用：`AlertDialog`</a>
-  <a href='#2.3'>想要获取参数使用：`Page`、`NavigationView`</a>
-  <a href='#2.4'>`http`请求</a>
-  <a href='#2.5'>`page`跳到`page`，跳回</a>

### <a name='2.1'></a>绑定元素

```
const { TextView, ui, TextInput } = require('tabris');
new TextView({
	id: 'test',
	left: '10%', 
	top,
	text: text,
	font: '20px'
})
.appendTo(ui.contentView);

new TextInput({
    baseline: '#test',
    id: 'username',
    left: '35%', 
    right: '20%',
    height: 35
})
.appendTo(ui.contentView);
    
```

### <a name='#2.2'></a>弹层

```
const { AlertDialog } = require('tabris');
new AlertDialog({
	buttons: {
	    cancel: '取消'
	},
	message: 'test'
})
.open();
```

### <a name='2.3'></a>想要获取参数

```
const {ui, TextInput, Page, NavigationView} = require('tabris');

let navigationView = new NavigationView({
  left: 0, top: 0, right: 0, bottom: 0
})
.appendTo(ui.contentView);
	
const page = new Page({
    title: 'test'
})
.appendTo(navigationView);

new TextInput({
    id: 'test',
    left: '35%', 
    right: '20%',
    height: 35,
    text: 'test'
})
.appendTo(page);

// 获取input框信息
page.find('#test').get('text');
```

### <a name='2.4'></a>`http`请求

```
const data = JSON.stringify({});

let myHeaders = new Headers();

myHeaders.append('Content-Type', 'application/json; charset=utf-8');
myHeaders.append('Content-Length', data.length);

const request = new Request('http://xxxx', {
  method: 'POST', 
  mode: 'no-cors',
  body:data,
  headers:myHeaders
});

fetch(request)
	.then((response) => response.json())
	.then((result) => {
	  console.log(result);
	})
	.catch((err) => {
	  console.error(err);
	});
```

### <a name='2.5'></a>`page`跳到`page`，跳回

```
// 当前页调用，即可跳回上一页
navigationView.pages().dispose();
或者
page.dispose();

在同一个navigationView中的可自带跳回按钮
const {Button, NavigationView, Page, ui} = require('tabris');

let pageCount = 0;

let navigationView = new NavigationView({
  left: 0, top: 0, right: 0, bottom: 0
}).appendTo(ui.contentView);

createPage();

function createPage(title) {
  let page = new Page({
    title: title || 'Initial Page'
  }).appendTo(navigationView);
  new Button({
    left: 16, top: 16, right: 16,
    text: 'Create another page'
  }).on('select', () => createPage('Page ' + (++pageCount)))
    .appendTo(page);
  new Button({
    left: 16, top: 'prev() 16', right: 16,
    text: 'Go back'
  }).on('select', () => page.dispose())
    .appendTo(page);
  new Button({
    left: 16, top: 'prev() 16', right: 16,
    text: 'Go to initial page'
  }).on('select', () => {
    navigationView.pages().dispose();
    createPage();
  }).appendTo(page);
  return page;
}

```