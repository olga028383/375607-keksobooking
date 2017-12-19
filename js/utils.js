'use strict';

(function () {
  var lastTimeout;

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

  var getCoordinates = function (element) {
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

  var getValues = function (data, callback) {
    var values = [];
    var i;
    var dataLength = data.length;

    for (i = 0; i < dataLength; i++) {
      values[i] = callback(data, i);
    }

    return values;
  };

  var debounce = function (func) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(func, window.constant.debounceInterval);
  };

  window.utils = {
    getRandomInteger: getRandomInteger,
    createMarkupFragment: createMarkupFragment,
    getCoordinates: getCoordinates,
    setItemPosition: setItemPosition,
    getValuePseudoElement: getValuePseudoElement,
    getRandomSubArray: getRandomSubArray,
    setBorder: setBorder,
    getValues: getValues,
    debounce: debounce
  };
})();

