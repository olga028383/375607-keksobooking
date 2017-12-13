'use strict';

(function () {
  var adsQuantity = 8;

  var adsArray = function (objectPoint, arrayLength) {
    var maps = [];
    var i;
    for (i = 0; i < arrayLength; i++) {
      maps[i] = objectPoint[i];
    }

    return maps;
  };
  window.backend.load(function (pins) {
    window.data = {
      ads: adsArray(pins, adsQuantity)
    };
  }, window.backend.error);
})();
