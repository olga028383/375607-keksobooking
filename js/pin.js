'use strict';

(function () {
  var map = document.querySelector('.map');
  var mapTemplateContainer = document.querySelector('template').content;
  var mapPinTemplate = mapTemplateContainer.querySelector('.map__pin');
  var images = map.querySelector('.map__pin img');
  var heightImages = images.offsetHeight;
  var pinPseudoelementHeight = window.utils.getValuePseudoElement('.map .map__pin', 'border-top-width');

  var createMapPinElement = function (adObject) {
    var buttonElement = mapPinTemplate.cloneNode(true);
    var imgCopy = buttonElement.querySelector('img');

    imgCopy.src = adObject.author.avatar;
    buttonElement.style.left = (adObject.location.x) + 'px';
    buttonElement.style.top = (adObject.location.y - heightImages / 2 - pinPseudoelementHeight) + 'px';

    buttonElement.addEventListener('click', onPinClick);
    return buttonElement;
  };

  var onPinClick = function (event) {
    window.card(event);
  };

  window.pin = {
    createMapPinElement: createMapPinElement
  };
})();
