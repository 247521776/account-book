const {Button, TextView, TextInput, ImageView, Page} = require('tabris');
const config = require('../config');
const alertView = require('../utils.js').alert;
const textColor = '#d3a4ff';
const url = `http://${config.localhost}/api/user`;

module.exports = (navigationView) => {
    const page = new Page({
        title: '注册页'
    })
    .appendTo(navigationView);

    new ImageView({
        width: 450,
        height: 750,
        image: '/src/images/create.jpg',
        scaleMode: 'fill'
    })
    .appendTo(page)
    .on('load', () => {
        new TextView({
            top: '15%', 
            left: '25%',
            font: '20px',
            text: '感谢注册boom记账簿',
            textColor
        }).appendTo(page);
    
        createTextView('账号', 'username_txt', '30%');
        createTextView('密码', 'password_txt', '40%');
        createTextView('再次输入', 'password_again_txt', '50%');
        
        new TextInput({
            baseline: '#username_txt',
            id: 'username',
            left: '35%', 
            right: '20%',
            height: 35
        })
        .appendTo(page);
        
        new TextInput({
            baseline: '#password_txt',
            id: 'password',
            left: '35%', 
            right: '20%',
            type: 'password',
            height: 35
        })
        .appendTo(page);
        
        new TextInput({
            baseline: '#password_again_txt',
            id: 'password_again',
            left: '35%', 
            right: '20%',
            type: 'password',
            height: 35
        })
        .appendTo(page);

        // 注册按钮
        new Button({
            top: '60%',
            text: '注册',
            right: '20%',
            textColor: '#AAAAFF'
        })
        .appendTo(page)
        .on('select', () => {
            const username = page.find('#username').get('text');
            const password = page.find('#password').get('text');
            const password_again = page.find('#password_again').get('text');

            if (!username || !password || !password_again) {
              return alertView('请输入账号密码')
            }

            if (password !== password_again) {
              return alertView('两次密码输入不正确，请重新输入');
            }
            const data = JSON.stringify({username, password});

            let myHeaders = new Headers();
            myHeaders.append('Content-Type', 'application/json; charset=utf-8');
            myHeaders.append('Content-Length', data.length);
            const request = new Request(url, {
              method: 'POST', 
              mode: 'no-cors',
              body:data,
              headers:myHeaders
            })

            fetch(request)
            .then((response) => response.json())
            .then((result) => {
              if (result.code !== 200) {
                alertView(result.msg);
              }
              else {
                const alert = alertView('注册成功', {});
                setTimeout(() => {
                  alert.close();
                  page.dispose();
                }, 1000);
              }
            })
            .catch((err) => {
              alertView('注册失败，请重试');
            });
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
    })
    .appendTo(page);
  }
}