'use strict';

(function () {
  var map = document.querySelector('.map');
  var mapPinContainer = map.querySelector('.map__pins');
  var mapPinMain = document.querySelector('.map__pin--main');
  var noticeForm = document.querySelector('.notice__form--disabled');
  var noticeFormFieldsetAll = noticeForm.querySelectorAll('fieldset');
  var coordinatesMap = window.utils.getCoordinates(map);
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

  var onDragPinMainMousedown = function (evt) {
    evt.preventDefault();
    var startCoordinates = window.utils.getCoordinates(mapPinMain);
    var shiftX = evt.pageX - startCoordinates.left;
    var shiftY = evt.pageY - startCoordinates.top;
    var startPinMainPosition = {
      left: evt.pageX - shiftX,
      top: evt.pageY - shiftY
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
      var coordinateLeft = Math.round(window.utils.getCoordinates(mapPinMain).left + mapPinMainWidth / 2);
      var coordinateBottom = Math.round(window.utils.getCoordinates(mapPinMain).top + mapPinMainHeight);

      if (pinMainPosition.top < window.constant.TOP_MAP) {
        pinMainPosition.top = window.constant.TOP_MAP;
      }

      if (pinMainPosition.top > window.constant.BOTTOM_MAP) {
        pinMainPosition.top = window.constant.BOTTOM_MAP;
      }

      if (coordinatesMap.left > pinMainPosition.left) {
        pinMainPosition.left = coordinatesMap.left;
      }

      if (coordinatesMap.left + map.offsetWidth < pinMainPosition.left + mapPinMainWidth) {
        pinMainPosition.left = coordinatesMap.left + map.offsetWidth - mapPinMainWidth;
      }

      window.utils.setItemPosition(mapPinMain, pinMainPosition);
      noticeFormFieldAddress.value = 'x: ' + coordinateLeft + ', y: ' + coordinateBottom;

      document.addEventListener('mouseup', onDragPinMainMouseup);
    };

    var onDragPinMainMouseup = function (eventUp) {
      eventUp.preventDefault();

      document.removeEventListener('mousemove', onPinMainMousemove);
      mapPinMain.removeEventListener('mouseup', onDragPinMainMouseup);
    };
    document.addEventListener('mousemove', onPinMainMousemove);
  };

  var addHandlers = function () {
    mapPinMain.addEventListener('mouseup', onMainPinMouseup);
    mapPinMain.addEventListener('transitionend', function () {
      mapPinMain.addEventListener('mousedown', onDragPinMainMousedown);
    });
  };

  window.map = {
    addHandlers: addHandlers
  };
})();
