'use strict';

(function () {
  var URL_GET = 'https://1510.dump.academy/keksobooking/data';
  var URL_POST = 'https://1510.dump.academy/keksobooking';
  var load = function (onLoad, onError) {
    var xhr = setup(onLoad, onError);

    xhr.open('GET', URL_GET);
    xhr.send();
  };

  var save = function (data, onLoad, onError) {
    var xhr = setup(onLoad, onError);

    xhr.open('POST', URL_POST);
    xhr.send(data);
  };

  var error = function (errorMessage) {
    var errorBox = document.createElement('div');
    errorBox.style.zIndex = 100;
    errorBox.style.position = 'absolute';
    errorBox.style.left = '0';
    errorBox.style.right = '0';
    errorBox.style.top = '0';
    errorBox.style.textAlign = 'center';
    errorBox.style.backgroundColor = 'rgb(255, 0, 0)';
    errorBox.style.color = 'rgb(255, 255, 255)';
    errorBox.textContent = errorMessage;

    document.body.insertAdjacentElement('afterbegin', errorBox);
  };

  var setup = function (onLoad, onError) {

    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError('Неизвестный статус: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + ' мс');
    });

    xhr.timeout = 10000;

    return xhr;
  };

  window.backend = {
    load: load,
    save: save,
    error: error,
    setupXhr: setup
  };
})();
