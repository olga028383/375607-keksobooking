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

  var getRandomSubArray = function (arrayElements) {
    var arrayCopy = arrayElements.slice();
    var arrayCopyLengt = arrayCopy.length;
    var _randomSubaArray = [];
    var randomArrayCopyIndex;
    var element;
    var i;
    var randomSubaArrayLength;

    for (i = 0, randomSubaArrayLength = getRandomInteger(1, arrayCopyLengt); i < randomSubaArrayLength; i++) {
      randomArrayCopyIndex = getRandomInteger(0, getRandomInteger(0, arrayCopyLengt - 1));
      element = arrayCopy[randomArrayCopyIndex];
      _randomSubaArray.push(element);
      arrayCopy.splice(randomArrayCopyIndex, 1);
      arrayCopyLengt -= 1;
    }

    return _randomSubaArray;
  };

  var setBorder = function (boolean, color) {
    return (boolean) ? '1px solid ' + color : '';
  };
  window.utils = {
    getRandomInteger: getRandomInteger,
    createMarkupFragment: createMarkupFragment,
    getCoords: getCoords,
    setItemPosition: setItemPosition,
    getValuePseudoElement: getValuePseudoElement,
    getRandomSubArray: getRandomSubArray,
    setBorder: setBorder
  };
})();

