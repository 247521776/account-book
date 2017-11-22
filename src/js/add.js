const {Button, Page, Picker, TextView, ActivityIndicator, TextInput, ui} = require('tabris');
const config     = require('../config');
const utils      = require('../utils');
const url        = `http://${config.localhost}/api/pay_type`;
const addBook    = `http://${config.localhost}/api/account_book`;

module.exports = (navigationView) => {
    const token  = localStorage.token;
    let AIRPORTS = [];
    let _pay_type;

    const page = new Page({
        title: '新账',
        visible: false
    })
    .appendTo(navigationView)
    .on('panDown', () => {
        const top = navigationView.top;
        if (top < 50) {
            navigationView.top = top + 1;            
        }
    })
    // .on('touchEnd', () => {
    //     navigationView.top = 0;
    //     activityIndicator.visible = true;
    //     get();
    // });

    // 加载效果
    let activityIndicator = new ActivityIndicator({
        centerX: 0,
        centerY: 0
    }).appendTo(ui.contentView);

    // 新增按钮
    new Button({
        right: '5%',
        top: 10,
        text: '添加',
        textColor: '#5B5B00',
        background: '#FFF0AC'
    })
    .appendTo(page)
    .on('select', ({target}) => {
        const amount = page.find('#amount').get('text');
        const pay_type = page.find('#custom_txt').get('visible') 
            ? page.find('#custom').get('text')
            : _pay_type

        if (amount && pay_type) {
            utils.post(`${addBook}?token=${token}&username=yanglei`, {
                amount, pay_type
            }, (err, data) => {
                if (err) return utils.alert('添加失败，请重试!', {ok: '确定'});
                const alert = utils.alert('添加成功!', {});
                const setTime = setTimeout(() => {
                    alert.close();
                    clearTimeout(setTime);
                    page.dispose();
                }, 1000);
            });
        }
        else {
            utils.alert('请选择消费类型和填写消费金额!', {ok: '确定'});
        }
    });

    // 消费类型文本
    text({
        id: 'pay_type',
        left: '15%',
        top: 75,
        font: '20px',
        text: '消费类型:'
    });
    
    // 消费类型下拉框
    let picker = new Picker({
        baseline: '#pay_type',
        id: 'picker',
        left: '40%',
        font: '20px',
        width: 100,
        selectionIndex: 0
    })
    .appendTo(page)
    .on('select', ({index}) => {
        if (picker.itemCount === index + 1) {
            page.find('#amount_txt').set('top', 205);
            page.find('#custom_txt').set('visible', true);
            page.find('#custom').set('visible', true);
        }
        else {
            page.find('#amount_txt').set('top', 140);
            page.find('#custom_txt').set('visible', false);
            page.find('#custom').set('visible', false);
            _pay_type = AIRPORTS[index].id;
        }
    });

    // 消费类型自定义文本
    text({
        id: 'custom_txt',
        left: '10%',
        top: 140,
        font: '20px',
        text: '自定义类型:',
        visible: false
    });

    // 消费类型自定义框
    new TextInput({
        baseline: '#custom_txt',
        id: 'custom',
        width: 150,
        left: '40%',
        visible: false
    })
    .appendTo(page);

    // 金额输入文本
    text({
        id: 'amount_txt',
        left: '15%',
        top: 140,
        font: '20px',
        text: '消费金额:'
    });

    // 金额输入文本框
    new TextInput({
        baseline: '#amount_txt',
        id: 'amount',
        width: 150,
        left: '40%'
    })
    .appendTo(page);

    get();

    function text(options) {
        new TextView(options)
        .appendTo(page);
    }

    function get() {
        activityIndicator.visible = true;
        page.visible = false;
        utils.get(`${url}?token=${token}`, (err, data) => {
            activityIndicator.visible = false;
            page.visible = true;
            const source = data.data;
            if (err || data.code !== 200) return utils.alert('请重试');
            const length = source.length || 0;
            AIRPORTS = [];
            for (let i = 0; i < length; i++) {
                AIRPORTS.push({
                    id: source[i].id,
                    name: source[i].name
                });
            }

            AIRPORTS.push({
                id: 'custom',
                name: '自定义'
            });
            _pay_type = AIRPORTS[0].id;

            page.find('#picker').set('itemCount', length + 1);
            page.find('#picker').set('itemText', (index) => AIRPORTS[index].name);
        });
    }
};