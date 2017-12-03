const {Picker, Page, Button, TextView, SearchAction, NavigationView, ui, Composite, ActivityIndicator, widget} = require('tabris');
const config     = require('../config');
const utils      = require('../utils');
const url        = `http://${config.localhost}/api/account_book`;
const add        = require('./add');
const COL_WIDTH  = 120;
const COL_HEIGHT = 50;

module.exports = () => {
    let navigationView = new NavigationView({
        left: 0, top: 0, right: 0, bottom: 0, toolbarVisible: false
    })
    .appendTo(ui.contentView);

    const page = new Page({
        title: '记账簿'
    })
    .appendTo(navigationView)
    // 点击新增弹层隐藏
    .on('tap', event => composite.visible = false);

    const date = new Date();
    let year     = date.getFullYear();
    let month    = date.getMonth() + 1;
    let username = 'yanglei';
    let _page    = 1;
    let limit    = 10;
    let pageTotal= 0;
    const token  = localStorage.token;
    const login  = localStorage.login;

    createTextView('year_text', '5%', '年:');
    createPicker('#year_text', year, 5, '12%', 0);

    createTextView('month_text', '30%', '月:');
    createPicker('#month_text', 12, 12, '37%', 12 - month);

    let activityIndicator = new ActivityIndicator({
        centerX: 0,
        centerY: 0
    }).appendTo(page);

    let composite = new Composite({
        id: 'add',
        top: 60,
        right: '3%',
        width: 100,
        height: 150,
        visible: false
    })
    .appendTo(ui.contentView);
    
    // 新账按钮
    new Button({
        width: 100,
        height: 50,
        alignment: 'center',
        text: '新账'
    })
    .appendTo(composite)
    .on('select', () => {
        composite.set('visible', false);
        add(
            navigationView,
            `${url}?username=${username}&year=${year}&month=${month}&limit=${limit}&page=${_page}`,
            get
        );
    });

    // 搜索按钮
    new Button({
        right: '15%',
        top: 8,
        background: 'transparent',
        image: {
            src: '/src/images/search.png',
            width: 25, height: 25
        }
    })
    .appendTo(page)
    .on('select', ({target}) => action.open());

    // 添加按钮
    new Button({
        right: '2%',
        top: 6,
        background: 'transparent',
        image: {
            src: '/src/images/add.png',
            width: 25, height: 25
        }
    })
    .appendTo(page)
    .on('select', () => {
        const visible = composite.get('visible');
        if (visible) {
            composite.set('visible', false);            
        }
        else {
            composite.set('visible', true);     
        }
    });

    // 搜索框
    let action = new SearchAction({
        title: '请输入时间，格式如：20171114'
    })
    .on('accept', ({text}) => {
        _page = 1;
        const date = new Date(text);
        year = date.getFullYear();
        month = date.getMonth() + 1;
        get(`${url}?username=${username}&date=${text}&limit=${limit}&page=${_page}`);
    })
    .appendTo(page);

    // 上一页按钮
    new Button({
        left: '20%',
        bottom: '3%',
        text: '上一页'
    })
    .appendTo(page)
    .on('select', () => {
        if (_page > 1) {
            get(`${url}?username=${username}&year=${year}&month=${month}&limit=${limit}&page=${_page}`, 'up');
        }
        else {
            const alert = utils.alert('已经是第一页不能再往前了', {});
            const setTime = setTimeout(() => {
                alert.close();
                clearTimeout(setTime);
            }, 1000);
        }
    });

    // 页码
    new TextView({
        id: 'page',
        text: _page,
        left: '47%',
        font: '20px',
        alignment: 'center',
        width: 20,
        height: 20,
        bottom: '4.5%'
    })
    .appendTo(page);

    // 下一页按钮
    new Button({
        right: '20%',
        bottom: '3%',
        text: '下一页'
    })
    .appendTo(page)
    .on('select', () => {
        if(pageTotal > _page) {
            get(`${url}?username=${username}&year=${year}&month=${month}&limit=${limit}&page=${_page}`, 'down');
        }
        else {
            const alert = utils.alert('已经是最后一页不能再往后了', {});
            const setTime = setTimeout(() => {
                alert.close();
                clearTimeout(setTime);
            }, 1000);
        }
    });

    // 表头
    createCols({
        top: 70,
        text: {
            date: '时间',
            pay_type: '支付类型',
            amount: '消费金额'
        },
        background: '#FFEEDD'
    });

    for (let i = 0; i < 10; i++) {
        createCols({
            id: i,
            top: 70 + 50 * (i + 1),
            text: {
                pay_type: '',
                amount: '',
                date: ''
            },
            background: i % 2 ? '#FFEEDD' : '#FFF8D7'
        });
    }
    // 查询业务
    get(`${url}?username=${username}&year=${year}&month=${month}&limit=${limit}&page=${_page}`);

    function createTextView(id, left, text) {
        new TextView({
            id,
            top: 20,
            left,
            font: '15px',
            text
        }).appendTo(page);
    }

    function createPicker(id, startIndex, max, left, selectionIndex) {
        const AIRPORTS = [];

        for (let i = 0; i < max; i++) {
            AIRPORTS.push({
                id: `${startIndex - i}`,
                name: `${startIndex - i}`
            });
        }
        
        let picker = new Picker({
            baseline: id,
            left,
            itemCount: AIRPORTS.length,
            itemText: (index) => AIRPORTS[index].name,
            selectionIndex
        }).appendTo(page);

        picker
        .on('select', ({index}) => {
            let _url = `${url}?username=${username}&limit=${limit}`;
            const value = AIRPORTS[index].id;
            if (id === '#month_text') {
                _url += `&year=${year}&month=${value}`;
                month = value;
            }
            else {
                _url += `&year=${value}&month=${month}`;
                year = value;
            }

            _page = 1;
            get(_url);
        });
    }

    function createCols(options = {id: 0, top: 50, text: {pay_type:'', amount: 0, date: 0}, background: '#FFDCB9'}) {
        new TextView({
            id: `${options.id}_date`,
            top: options.top,
            left: '5%',
            font: '15px',
            background: options.background,
            width: COL_WIDTH,
            height: COL_HEIGHT,
            alignment: 'center',
            text: options.text.date
        }).appendTo(page);
        new TextView({
            id: `${options.id}_pay_type`,
            top: options.top,
            left: '35%',
            font: '15px',
            width: COL_WIDTH,
            height: COL_HEIGHT,
            alignment: 'center',
            background: options.background,
            text: options.text.pay_type
        }).appendTo(page);
        new TextView({
            id: `${options.id}_amount`,
            top: options.top,
            left: '65%',
            font: '15px',
            width: COL_WIDTH,
            height: COL_HEIGHT,
            alignment: 'center',
            background: options.background,
            text: options.text.amount
        }).appendTo(page);
    }

    function get(url, type) {
        activityIndicator.visible = true;
        utils.get(`${url}&token=${token}`, (err, data) => {
            activityIndicator.visible = false;
            if (err || data.code !== 200) {
                if (data.code === 401 && data.msg === '请登录') {
                    return login();
                }
                return utils.alert('查询失败，请重试!');
            }
            if (type === 'down') {
                _page--;
            }
            else if (type === 'up') {
                _page++;
            }
            page.find('#page').set('text', _page);
            const source = data.data;
            const total = data.total ? data.total : 1;
            pageTotal = Math.ceil(total / limit);
            for (let i = 0; i < limit; i++) {
                const item = source[i] || {};
                page.find(`#${i}_pay_type`).set('text', item.pay_type);
                page.find(`#${i}_amount`).set('text', item.amount);
                page.find(`#${i}_date`).set('text', item.date);
            }
        });
    }
}
