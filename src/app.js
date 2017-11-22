const {ui, NavigationView} = require('tabris');
const login = require('./js/login');
const list  = require('./js/list');
const add   = require('./js/add');
let navigationView = new NavigationView({
  left: 0, top: 0, right: 0, bottom: 0, toolbarVisible: false
}).appendTo(ui.contentView);

ui.statusBar.theme = 'light';
localStorage.login = login;

login();
// list();
// add(navigationView);