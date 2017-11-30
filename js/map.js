'use strict';

var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;

var map = document.querySelector('.map');
var mapPinContainer = map.querySelector('.map__pins');
var mapFiltersContainer = map.querySelector('.map__filters-container');
var mapTemplateContainer = document.querySelector('template').content;
var mapPinTemplate = mapTemplateContainer.querySelector('.map__pin');
var mapCardTemplate = mapTemplateContainer.querySelector('.map__card');
var ads;
var adsQuantity = 8;
var initialMark = document.querySelector('.map__pin--main');
var form = document.querySelector('.notice__form--disabled');
var fieldset = form.querySelectorAll('fieldset');
var popup;
var closePopup;
var activeMark;

var adFeatures = {
  titles: ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домиик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'],
  types: ['flat', 'house', 'bungalo'],
  checkins: ['12:00', '13:00', '14:00'],
  checkouts: ['12:00', '13:00', '14:00'],
  features: ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner']
};

var getRandomInteger = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var creatingUrlAvatar = function (photoNumber) {
  var firstNumber = '';
  if (photoNumber < 9) {
    firstNumber = 0;
  }
  return 'img/avatars/user' + firstNumber + photoNumber + '.png';
};

var getRandomSubArray = function (arrayElements) {
  var arrayFeatures = [];
  var index;
  var element;
  var i;
  var randomArrayElement;
  var arrayCopy = arrayElements.slice();
  for (i = 0, randomArrayElement = getRandomInteger(1, arrayCopy.length); i < randomArrayElement; i++) {
    index = getRandomInteger(0, getRandomInteger(0, arrayCopy.length));
    element = arrayCopy[index];
    if (element) {
      arrayFeatures.push(element);
      arrayCopy.splice(index, 1);
    }
  }
  return arrayFeatures;
};

var generateAdObject = function (objectPoint, count) {
  var adObject = {
    author: {},
    offer: {},
    location: {}
  };
  adObject.location.x = getRandomInteger(300, 900);
  adObject.location.y = getRandomInteger(100, 500);
  adObject.author.avatar = creatingUrlAvatar(count + 1);
  adObject.offer.title = objectPoint.titles[count];
  adObject.offer.address = adObject.location.x + ', ' + adObject.location.y;
  adObject.offer.price = getRandomInteger(1000, 1000000);
  adObject.offer.type = objectPoint.types[getRandomInteger(0, objectPoint.types.length)];
  adObject.offer.rooms = getRandomInteger(1, 5);
  adObject.offer.guests = getRandomInteger(10, 100);
  adObject.offer.checkin = objectPoint.checkins[getRandomInteger(0, objectPoint.checkins.length - 1)];
  adObject.offer.checkout = objectPoint.checkouts[getRandomInteger(0, objectPoint.checkouts.length - 1)];
  adObject.offer.features = getRandomSubArray(objectPoint.features);
  adObject.offer.description = '';
  adObject.offer.photos = [];
  return adObject;
};

var generateAdArray = function (objectPoint, arrayLength) {
  var maps = [];
  var i;
  for (i = 0; i < arrayLength; i++) {
    maps[i] = generateAdObject(objectPoint, i);
  }
  return maps;
};

var createLabel = function (adObject) {
  var img = mapPinContainer.querySelector('img');
  var widthImg = img.offsetWidth;
  var heightImg = img.offsetHeight;
  var ponytailTags = window.getComputedStyle(document.querySelector('.map .map__pin'), ':after');
  var ponytailTagsHeight = ponytailTags.getPropertyValue('border-top-width');
  var ponytailTagsWIdthNomber = +(ponytailTagsHeight.substr(0, ponytailTagsHeight.length - 2));
  var buttonElement = mapPinTemplate.cloneNode(true);
  var imgCopy = buttonElement.querySelector('img');
  imgCopy.src = adObject.author.avatar;
  buttonElement.style.left = (adObject.location.x - widthImg) + 'px';
  buttonElement.style.top = (adObject.location.y - heightImg - ponytailTagsWIdthNomber) + 'px';
  return buttonElement;
};

var createAdsCardMarkup = function (adObject) {
  var adsElement = mapCardTemplate.cloneNode(true);
  var translate = {flat: 'Квартира', house: 'Дом', bungalo: 'Бунгало'};
  var i;
  var feature = '';
  var featuresLength;
  adsElement.querySelector('h3').textContent = adObject.offer.title;
  adsElement.querySelector('p > small').textContent = adObject.offer.address;
  adsElement.querySelector('.popup__price').innerHTML = adObject.offer.price + ' &#x20bd;/ночь';
  adsElement.querySelector('h4').textContent = translate[adObject.offer.type];
  adsElement.querySelector('h4 + p').textContent = adObject.offer.rooms + ' для ' + adObject.offer.guests + ' гостей';
  adsElement.querySelector('h4 + p + p').textContent = 'Заезд после ' + adObject.offer.checkin + ', выезд до ' + adObject.offer.checkout;
  adsElement.querySelector('.popup__features + p').textContent = adObject.offer.description;
  for (i = 0, featuresLength = adObject.offer.features.length; i < featuresLength; i++) {
    feature += '<li class="feature feature--' + adObject.offer.features[i] + '"></li>';
  }
  adsElement.querySelector('.popup__features').innerHTML = feature;
  return adsElement;
};

var createMarkupFragment = function (adObject, createElements) {
  var documentFragment = document.createDocumentFragment();

  if (Array.isArray(adObject)) {
    var i;
    var mapLength;
    for (i = 0, mapLength = adObject.length; i < mapLength; i++) {
      documentFragment.appendChild(createElements(adObject[i]));
    }
  } else {
    documentFragment.appendChild(createElements(adObject));
  }
  return documentFragment;
};

var onMarkMouseup = function () {
  map.classList.remove('map--faded');
  mapPinContainer.appendChild(createMarkupFragment(ads, createLabel));
  form.classList.remove('notice__form--disabled');
  var i;
  var fieldsetArrayLength;
  for (i = 0, fieldsetArrayLength = fieldset.length; i < fieldsetArrayLength; i++) {
    fieldset[i].disabled = false;
  }
};

var showPopup = function (evt) {
  var i;
  var adsLength;
  var current = evt.target;
  var button = current.closest('.map__pin');
  var img;
  var initialButton = current.closest('.map__pin--main');
  var positionElementInObject;
  if (initialButton) {
    return;
  }
  if (button) {
    if (activeMark) {
      activeMark.classList.remove('map__pin--active');
    }
    if (popup) {
      popup.remove();
    }

    if (button.classList.contains('pin--active')) {
      button.classList.remove('pin--active');
    }
    img = button.querySelector('img');
    button.classList.add('map__pin--active');
    activeMark = button;

    for (i = 0, adsLength = ads.length; i < adsLength; i++) {
      if (img.src.indexOf(ads[i].author.avatar) !== -1) {
        map.insertBefore(createMarkupFragment(ads[i], createAdsCardMarkup), mapFiltersContainer);
        positionElementInObject = ads[i];
      }
    }

    popup = document.querySelector('.popup');
    closePopup = popup.querySelector('.popup__close');
    popup.querySelector('.popup__avatar').src = positionElementInObject.author.avatar;

    closePopup.addEventListener('click', onCloseContainerClick);
  }
};

var hidePopup = function () {
  if (popup) {
    popup.remove();
  }
  if (activeMark) {
    activeMark.classList.remove('map__pin--active');
  }
};

var onClosePopupKeydown = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    hidePopup();
  }
};

var onOpenPopupClick = function (evt) {
  showPopup(evt);

  document.addEventListener('keydown', onClosePopupKeydown);
};

var onOpenPopupKeydown = function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    showPopup(evt);
  }
};

var onCloseContainerClick = function () {
  hidePopup();
};

ads = generateAdArray(adFeatures, adsQuantity);

initialMark.addEventListener('mouseup', onMarkMouseup);
mapPinContainer.addEventListener('click', onOpenPopupClick);
mapPinContainer.addEventListener('keydown', onOpenPopupKeydown);

