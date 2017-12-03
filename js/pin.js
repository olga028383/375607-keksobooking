'use strict';

(function () {
  var mapPinContainer = window.data.map.querySelector('.map__pins');
  var mapPinTemplate = window.data.mapTemplateContainer.querySelector('.map__pin');

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

  window.data.mapPinMain.addEventListener('mouseup', onMainPinMouseup);
})();
