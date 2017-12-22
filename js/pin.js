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
  var objectSelectFilter = {
    'housing-type': false,
    'housing-price': false,
    'housing-rooms': false,
    'housing-guests': false
  };
  var objectCheckboxFilter = {
    'filter-dishwasher': false,
    'filter-parking': false,
    'filter-washer': false,
    'filter-elevator': false,
    'filter-conditioner': false,
    'filter-wifi': false
  };
  var numberPoints = 0;
  var housingFeaturesChecked;
  var pins;

  var createMapPinElement = function (adObject) {
    var buttonElement = mapPinTemplate.cloneNode(true);
    var imageCopy = buttonElement.querySelector('img');

    imageCopy.src = adObject.author.avatar;
    buttonElement.style.left = (adObject.location.x) + 'px';
    buttonElement.style.top = (adObject.location.y - heightImages / 2 - pinPseudoelementHeight) + 'px';

    buttonElement.addEventListener('click', onPinClick);
    return buttonElement;
  };

  var removeAllPins = function () {
    var mapPinAll = document.querySelectorAll('.map__pin');

    [].slice.call(mapPinAll).forEach(function (element) {
      if (!element.classList.contains('map__pin--main')) {
        element.remove();
      }
    });
  };

  var getRank = function (ads) {
    var rank = 0;

    if (ads.offer.type === housingType.value) {
      rank += 1;
    }

    if (ads.offer.rooms === +housingRoom.value) {
      rank += 1;
    }

    if (ads.offer.guests === +housingGuest.value) {
      rank += 1;
    }

    switch (housingPrice.value) {
      case 'middle':
        if (ads.offer.price >= 10000 && ads.offer.price <= 500000) {
          rank += 1;
        }
        break;
      case 'low':
        if (ads.offer.price < 10000) {
          rank += 1;
        }
        break;
      case 'high':
        if (ads.offer.price > 50000) {
          rank += 1;
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
    var arrayCopyPins = pins.slice();

    window.ads = arrayCopyPins.filter(function (element) {
      return getRank(element) === numberPoints;
    });
    mapPinContainer.appendChild(window.utils.createMarkupFragment(window.ads.slice(0, window.constant.ADS_QUANTITY), window.pin.createMapPinElement));
  };

  var changeNumberPoints = function (condition, objectFilter, elementId) {
    if (condition) {
      if (objectFilter[elementId] !== true) {
        ++numberPoints;
        objectFilter[elementId] = true;
      }
    } else {
      objectFilter[elementId] = false;
      --numberPoints;
    }
  };

  var onPinClick = function (evt) {
    window.card.create(evt);
  };

  filterContainer.addEventListener('change', function (evt) {
    var target = evt.target;
    var targetId = target.id;
    var targetValue = target.value;

    window.card.remove();
    removeAllPins();

    if (target.type === 'select-one') {
      changeNumberPoints(targetValue !== 'any', objectSelectFilter, targetId);
    }
    if (target.type === 'checkbox') {
      changeNumberPoints(target.checked, objectCheckboxFilter, targetId);
    }

    housingFeaturesChecked = [].slice.call(housingFeatures).filter(function (element) {
      return element.checked;
    }).map(function (element) {
      return element.value;
    });

    window.utils.debounce(updatePins);
  });

  var init = function (arrayAds) {
    pins = arrayAds;
    window.ads = arrayAds.slice(0, window.constant.ADS_QUANTITY);
    window.map.addHandlers();
  };

  window.backend.load(init);

  window.pin = {
    createMapPinElement: createMapPinElement
  };
})();
