'use strict';

(function () {
  var getRandomInteger = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  var createMarkupFragment = function (dataCard, createElements) {
    var documentFragment = document.createDocumentFragment();
    var i;
    var mapLength;
    if (Array.isArray(dataCard)) {
      for (i = 0, mapLength = dataCard.length; i < mapLength; i++) {
        documentFragment.appendChild(createElements(dataCard[i]));
      }
    } else {
      documentFragment.appendChild(createElements(dataCard));
    }

    return documentFragment;
  };

  var getCoords = function (element) {
    var box = element.getBoundingClientRect();
    return {
      top: box.top + pageYOffset,
      left: box.left + pageXOffset
    };
  };

  var setItemPosition = function (element, obj) {
    element.style.left = obj.left + 'px';
    element.style.top = obj.top + 'px';
  };

  var getValuePseudoElement = function (element, value) {
    var pinPseudoelementStyles = window.getComputedStyle(document.querySelector(element), ':after');
    return parseInt(pinPseudoelementStyles.getPropertyValue(value), 10);
  };

  window.utils = {
    getRandomInteger: getRandomInteger,
    createMarkupFragment: createMarkupFragment,
    getCoords: getCoords,
    setItemPosition: setItemPosition,
    getValuePseudoElement: getValuePseudoElement
  };
})();

