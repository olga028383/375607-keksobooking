'use strict';

(function () {
  var map = document.querySelector('.map');
  var mapPinContainer = map.querySelector('.map__pins');
  var mapTemplateContainer = document.querySelector('template').content;
  var mapPinTemplate = mapTemplateContainer.querySelector('.map__pin');
  var images = map.querySelector('.map__pin img');
  var heightImages = images.offsetHeight;
  var pinPseudoelementHeight = window.utils.getValuePseudoElement('.map .map__pin', 'border-top-width');
  var filterContainer = document.querySelector('.map__filters');
  var housingType = filterContainer.querySelector('#housing-type');
  var housingPrice = filterContainer.querySelector('#housing-price');
  var housingRoom = filterContainer.querySelector('#housing-rooms');
  var housingGuest = filterContainer.querySelector('#housing-guests');
  var housingFeature = filterContainer.querySelector('#housing-features');
  var housingFeatures = housingFeature.querySelectorAll('input');
  var housingFeaturesChecked;

  var createMapPinElement = function (adObject) {
    var buttonElement = mapPinTemplate.cloneNode(true);
    var imgCopy = buttonElement.querySelector('img');

    imgCopy.src = adObject.author.avatar;
    buttonElement.style.left = (adObject.location.x) + 'px';
    buttonElement.style.top = (adObject.location.y - heightImages / 2 - pinPseudoelementHeight) + 'px';

    buttonElement.addEventListener('click', onPinClick);
    return buttonElement;
  };

  var removePin = function () {
    var mapPinAll = document.querySelectorAll('.map__pin');
    Array.prototype.slice.call(mapPinAll).forEach(function (element) {
      if (!element.classList.contains('map__pin--main')) {
        element.remove();
      }
    });
  };

  var onPinClick = function (event) {
    window.card(event);
  };

  var getRank = function (ads) {
    var rank = 0;

    if (ads.offer.type === housingType.value) {
      rank += 2;
    }

    if (ads.offer.rooms === +housingRoom.value) {
      rank += 2;
    }

    if (ads.offer.guests === +housingGuest.value) {
      rank += 2;
    }

    switch (housingPrice.value) {
      case 'middle':
        if (ads.offer.price > 10000 && ads.offer.price < 500000) {
          rank += 2;
        }
        break;
      case 'low':
        if (ads.offer.price <= 10000) {
          rank += 2;
        }
        break;
      case 'high':
        if (ads.offer.price >= 50000) {
          rank += 2;
        }
        break;
    }

    ads.offer.features.forEach(function (element) {
      if (housingFeaturesChecked.indexOf(element) !== -1) {
        rank += 1;
      }
    });
    return rank;
  };

  var updatePins = function () {
    window.ads = window.pins.sort(function (left, right) {
      return getRank(right) - getRank(left);
    });
    mapPinContainer.appendChild(window.utils.createMarkupFragment(window.ads.slice(0, window.constant.adsQuantity), window.pin.createMapPinElement));
  };

  filterContainer.addEventListener('change', function () {
    window.removeCard();
    removePin();
    housingFeaturesChecked = Array.prototype.slice.call(housingFeatures).filter(function (element) {
      return element.checked;
    }).map(function (element) {
      return element.value;
    });
    window.debounce(updatePins);
  });

  window.pin = {
    createMapPinElement: createMapPinElement
  };
})();
