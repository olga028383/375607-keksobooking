'use strict';

(function () {
  var TOP_MAP = 100;
  var BOTTOM_MAP = 500;
  var mapPinContainer = window.data.map.querySelector('.map__pins');
  var mapPinTemplate = window.data.mapTemplateContainer.querySelector('.map__pin');
  var noticeFormFieldAddress = window.data.noticeForm.querySelector('#address');

  var createMapPinElement = function (adObject) {
    var buttonElement = mapPinTemplate.cloneNode(true);
    var imgCopy = buttonElement.querySelector('img');

    imgCopy.src = adObject.author.avatar;
    buttonElement.style.left = (adObject.location.x) + 'px';
    buttonElement.style.top = (adObject.location.y - window.data.heightImages / 2 - window.data.pinPseudoelementHeight) + 'px';

    buttonElement.addEventListener('click', window.card.onCardOpenClick);
    return buttonElement;
  };

  var onMainPinMouseup = function () {
    var i;
    var noticeFormFieldsetQuantity;
    if (window.data.map.classList.contains('map--faded')) {
      window.data.map.classList.remove('map--faded');
      mapPinContainer.appendChild(window.data.createMarkupFragment(window.map.ads, createMapPinElement));
      window.data.noticeForm.classList.remove('notice__form--disabled');
      for (i = 0, noticeFormFieldsetQuantity = window.data.noticeFormFieldsetAll.length; i < noticeFormFieldsetQuantity; i++) {
        window.data.noticeFormFieldsetAll[i].disabled = false;
      }
    }
  };
  var onDragPinMainMousedown = function (event) {
    event.preventDefault();
    document.addEventListener('mouseup', onMainPinMouseup);
    var coord = window.data.mapPinMain.getBoundingClientRect();
    var shift = {
      x: event.clientX - coord.left,
      y: event.clientY - coord.top
    };

    var onPinMainMousemove = function (eventMove) {
      eventMove.preventDefault();
      var pinCoord = {
        top: eventMove.clientY - shift.y,
        left: eventMove.clientX - shift.x
      };

      if (pinCoord.top < TOP_MAP) {
        pinCoord.top = TOP_MAP;
      }
      if (pinCoord.top < BOTTOM_MAP - window.data.heightImages - window.data.pinPseudoelementStyles) {
        pinCoord.top = BOTTOM_MAP - window.data.heightImages - window.data.pinPseudoelementStyles;
      }
      noticeFormFieldAddress.value = eventMove.clientY + ': ' + eventMove.clientX;
      window.data.mapPinMain.style.top = pinCoord.top + 'px';
      window.data.mapPinMain.style.left = pinCoord.left + 'px';
      window.data.mapPinMain.style.transform = 'none';
    };

    var onDragPinMainMouseup = function (eventUp) {
      eventUp.preventDefault();
      document.removeEventListener('mousemove', onPinMainMousemove);
      document.removeEventListener('mouseup', onDragPinMainMouseup);
    };

    document.addEventListener('mousemove', onPinMainMousemove);
    document.addEventListener('mouseup', onDragPinMainMouseup);
  };

  window.data.mapPinMain.addEventListener('mousedown', onDragPinMainMousedown);
})();
