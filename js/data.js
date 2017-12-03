'use strict';

(function () {
  var map = document.querySelector('.map');
  var noticeForm = document.querySelector('.notice__form--disabled');
  var noticeFormFieldsetAll = noticeForm.querySelectorAll('fieldset');
  var mapTemplateContainer = document.querySelector('template').content;
  var mapPinMain = document.querySelector('.map__pin--main');
  var images = mapPinMain.querySelector('img');
  var heightImages = images.offsetHeight;
  var pinPseudoelementStyles = window.getComputedStyle(document.querySelector('.map .map__pin'), ':after');
  var pinPseudoelementHeight = parseInt(pinPseudoelementStyles.getPropertyValue('border-top-width'), 10);

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

  window.data = {
    map: map,
    mapTemplateContainer: mapTemplateContainer,
    mapPinMain: mapPinMain,
    heightImages: heightImages,
    pinPseudoelementHeight: pinPseudoelementHeight,
    noticeForm: noticeForm,
    noticeFormFieldsetAll: noticeFormFieldsetAll,
    getRandomInteger: getRandomInteger,
    createMarkupFragment: createMarkupFragment
  };
})();
