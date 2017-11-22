const {Button, TextView, TextInput, ImageView, Page, NavigationView, ui} = require('tabris');
const textColor = '#66B3FF';
const create    = require('./create');
const list      = require('./list');
const config    = require('../config');
const alert     = require('../utils').alert;
const url       = `http://${config.localhost}/api/login`;

module.exports = () => {
    if (localStorage.token) {
        return list();
    }

    let navigationView = new NavigationView({
        left: 0, top: 0, right: 0, bottom: 0, toolbarVisible: false
    }).appendTo(ui.contentView);

    const page = new Page({
        title: '登录页'
    })
    .appendTo(navigationView);
    
    new ImageView({
        width: 450,
        height: 750,
        image: '/src/images/login.png',
        scaleMode: 'fill'
    })
    .appendTo(page)
    .on('load', () => {
        new TextView({
            top: '15%', 
            left: '25%',
            font: '20px',
            text: '欢迎使用boom记账簿',
            textColor
        }).appendTo(page);
    
        createTextView('账号', 'username_txt', '30%');
        createTextView('密码', 'password_txt', '40%');
        
        // 账号输入框
        new TextInput({
            baseline: '#username_txt',
            id: 'username',
            left: '35%', 
            right: '20%',
            height: 35
        })
        .appendTo(page);
        
        // 密码输入框
        new TextInput({
            baseline: '#password_txt',
            id: 'password',
            left: '35%', 
            right: '20%',
            type: 'password',
            height: 35
        })
        .appendTo(page);
        
        // 登录按钮
        new Button({
            top: '50%',
            text: '登录',
            right: '20%',
            textColor
        })
        .appendTo(page)
        .on('select', () => {
            const username = page.find('#username').get('text');
            const password = page.find('#password').get('text');
            if (!username || !password) {
                return alert('请填写账号密码');
            }
            else {
                const data = JSON.stringify({
                    username,
                    password
                });
                let myHeaders = new Headers();
                myHeaders.append('Content-Type', 'application/json');
                const request = new Request(url, {
                  method: 'POST', 
                  mode: 'no-cors',
                  body:data,
                  headers:myHeaders
                });
    
                fetch(request)
                .then((response) => response.json())
                .then((result) => {
                    if (result.code !== 200) {
                        alert(result.msg);
                    }
                    else {
                        localStorage.username = username;
                        localStorage.token = result.token;
                        navigationView.pages().dispose();
                        list();
                    }
                })
                .catch((err) => {
                  alert('登录失败，请重试');
                });
            }
        });
        
        // 注册按钮
        new Button({
            top: '50%',
            text: '注册',
            right: '35%',
            textColor: '#AAAAFF'
        })
        .appendTo(page)
        .on('select', () => {
            create(navigationView);
        });
    });

    function createTextView(text, id, top) {
      new TextView({
        id,
        left: '10%', 
        top,
        text: text,
        font: '20px',
        textColor
      }).appendTo(page);
    }
}