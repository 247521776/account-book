const { AlertDialog } = require('tabris');

exports.alert = (message, buttons={cancel: '取消'}) => {
    return new AlertDialog({
        buttons,
        message
    }).open();
}

exports.post = (url, data, cb) => {
    const body = JSON.stringify(data);
    let myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json; charset=utf-8');
    myHeaders.append('Content-Length', body.length);
    const request = new Request(url, {
        method: 'POST', 
        mode: 'no-cors',
        body,
        headers:myHeaders
    });

    fetch(request)
    .then((response) => response.json())
    .then((result) => {
        cb(null, result);
    })
    .catch((err) => {
      cb(err);
    });
}

exports.get = (url, cb) => {
    let myHeaders = new Headers();
    const request = new Request(url, {
        method: 'GET', 
        mode: 'no-cors',
        headers:myHeaders
    })

    fetch(request)
    .then((response) => response.json())
    .then((result) => {
        cb(null, result);
    })
    .catch((err) => {
        console.log(err);
        cb(err);
    });
}