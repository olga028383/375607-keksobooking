'use strict';

(function () {
  var TOP_MAP = 100;
  var BOTTOM_MAP = 500;
  var ADS_QUANTITY = 5;
  var ESC_KEYCODE = 27;
  var DEBOUNCE_INTERVAL = 500;
  var URL_GET = 'https://1510.dump.academy/keksobooking/data';
  var URL_POST = 'https://1510.dump.academy/keksobooking';
  var MAX_FILE_SIZE = 1000000;

  window.constant = {
    topMap: TOP_MAP,
    bottomMap: BOTTOM_MAP,
    adsQuantity: ADS_QUANTITY,
    urlGet: URL_GET,
    urlPost: URL_POST,
    escKeycode: ESC_KEYCODE,
    debounceInterval: DEBOUNCE_INTERVAL,
    maxFileSize: MAX_FILE_SIZE
  };

})();

