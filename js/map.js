'use strict';

(function () {
  var map = document.querySelector('.map');
  var mapPinContainer = map.querySelector('.map__pins');
  var mapPinMain = document.querySelector('.map__pin--main');
  var noticeForm = document.querySelector('.notice__form--disabled');
  var noticeFormFieldsetAll = noticeForm.querySelectorAll('fieldset');
  var coordMap = window.utils.getCoords(map);
  var pinMainPseudoElementHeight = window.utils.getValuePseudoElement('.map__pin--main', 'border-top-width');
  var mapPinMainHeight = mapPinMain.offsetHeight + pinMainPseudoElementHeight;
  var mapPinMainWidth = mapPinMain.offsetWidth;
  var noticeFormFieldAddress = noticeForm.querySelector('#address');

  var onMainPinMouseup = function () {
    var i;
    var noticeFormFieldsetQuantity;
    if (map.classList.contains('map--faded')) {
      map.classList.remove('map--faded');
      mapPinContainer.appendChild(window.utils.createMarkupFragment(window.ads, window.pin.createMapPinElement));
      noticeForm.classList.remove('notice__form--disabled');
      for (i = 0, noticeFormFieldsetQuantity = noticeFormFieldsetAll.length; i < noticeFormFieldsetQuantity; i++) {
        noticeFormFieldsetAll[i].disabled = false;
      }
    }
  };

  var onDragPinMainMousedown = function (event) {
    event.preventDefault();
    var startCoord = window.utils.getCoords(mapPinMain);
    var shiftX = event.pageX - startCoord.left;
    var shiftY = event.pageY - startCoord.top;
    var startPinMainPosition = {
      left: event.pageX - shiftX,
      top: event.pageY - shiftY
    };

    window.utils.setItemPosition(mapPinMain, startPinMainPosition);
    mapPinMain.style.transform = 'none';
    document.body.appendChild(mapPinMain);

    var onPinMainMousemove = function (eventMove) {
      eventMove.preventDefault();
      var pinMainPosition = {
        left: eventMove.pageX - shiftX,
        top: eventMove.pageY - shiftY
      };

      if (pinMainPosition.top < window.constant.topMap) {
        pinMainPosition.top = window.constant.topMap;
      }

      if (pinMainPosition.top > window.constant.bottomMap) {
        pinMainPosition.top = window.constant.bottomMap;
      }

      if (coordMap.left > pinMainPosition.left) {
        pinMainPosition.left = coordMap.left;
      }

      if (coordMap.left + map.offsetWidth < pinMainPosition.left + mapPinMainWidth) {
        pinMainPosition.left = coordMap.left + map.offsetWidth - mapPinMainWidth;
      }

      window.utils.setItemPosition(mapPinMain, pinMainPosition);
      var coordLeft = Math.round(window.utils.getCoords(mapPinMain).left + mapPinMainWidth / 2);
      var coordBottom = Math.round(window.utils.getCoords(mapPinMain).top + mapPinMainHeight);
      noticeFormFieldAddress.value = 'x: ' + coordLeft + ', y: ' + coordBottom;

      document.addEventListener('mouseup', onDragPinMainMouseup);
    };

    var onDragPinMainMouseup = function (eventUp) {
      eventUp.preventDefault();
      document.removeEventListener('mousemove', onPinMainMousemove);
      mapPinMain.removeEventListener('mouseup', onDragPinMainMouseup);
    };
    document.addEventListener('mousemove', onPinMainMousemove);
  };

  window.backend.load(function (pins) {
    window.pins = pins;
    window.ads = pins.slice(0, window.constant.adsQuantity);
    mapPinMain.addEventListener('mouseup', onMainPinMouseup);
    mapPinMain.addEventListener('transitionend', function () {
      mapPinMain.addEventListener('mousedown', onDragPinMainMousedown);
    });
  }, window.backend.error);
})();
