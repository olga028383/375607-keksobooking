'use strict';

var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;

var map = document.querySelector('.map');
var mapPinContainer = map.querySelector('.map__pins');
var mapFiltersContainer = map.querySelector('.map__filters-container');
var mapTemplateContainer = document.querySelector('template').content;
var mapPinTemplate = mapTemplateContainer.querySelector('.map__pin');
var mapCardTemplate = mapTemplateContainer.querySelector('.map__card');
var activePin = document.querySelector('.map__pin--main');
var noticeForm = document.querySelector('.notice__form--disabled');
var noticeFormFieldsetAll = noticeForm.querySelectorAll('fieldset');
var images = activePin.querySelector('img');
var widthImages = images.offsetWidth;
var heightImages = images.offsetHeight;
var pinPseudoelementStyles = window.getComputedStyle(document.querySelector('.map .map__pin'), ':after');
var pinPseudoelementHeight = parseInt(pinPseudoelementStyles.getPropertyValue('border-top-width'), 10);
var adsQuantity = 8;
var ads;
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

var createAvatarUrl = function (userIndex) {
  return 'img/avatars/user' + (userIndex < 10 ? 0 : '') + userIndex + '.png';
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

var generateAdObject = function (mockupDataObject, count) {
  var adObject = {
    author: {},
    offer: {},
    location: {}
  };
  adObject.location.x = getRandomInteger(300, 900);
  adObject.location.y = getRandomInteger(100, 500);
  adObject.author.avatar = createAvatarUrl(count + 1);
  adObject.offer.title = mockupDataObject.titles[count];
  adObject.offer.address = adObject.location.x + ', ' + adObject.location.y;
  adObject.offer.price = getRandomInteger(1000, 1000000);
  adObject.offer.type = mockupDataObject.types[getRandomInteger(0, mockupDataObject.types.length)];
  adObject.offer.rooms = getRandomInteger(1, 5);
  adObject.offer.guests = getRandomInteger(10, 100);
  adObject.offer.checkin = mockupDataObject.checkins[getRandomInteger(0, mockupDataObject.checkins.length - 1)];
  adObject.offer.checkout = mockupDataObject.checkouts[getRandomInteger(0, mockupDataObject.checkouts.length - 1)];
  adObject.offer.features = getRandomSubArray(mockupDataObject.features);
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

var createMapPinElement = function (adObject) {
  var buttonElement = mapPinTemplate.cloneNode(true);
  var imgCopy = buttonElement.querySelector('img');

  imgCopy.src = adObject.author.avatar;
  buttonElement.style.left = (adObject.location.x - widthImages) + 'px';
  buttonElement.style.top = (adObject.location.y - heightImages - pinPseudoelementHeight) + 'px';

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

var onMainPinMouseup = function () {
  var i;
  var noticeFormFieldsetQuantity;

  if (map.classList.contains('map--faded')) {
    map.classList.remove('map--faded');
    mapPinContainer.appendChild(createMarkupFragment(ads, createMapPinElement));
    noticeForm.classList.remove('notice__form--disabled');
    for (i = 0, noticeFormFieldsetQuantity = noticeFormFieldsetAll.length; i < noticeFormFieldsetQuantity; i++) {
      noticeFormFieldsetAll[i].disabled = false;
    }
  }
};
var removePopup = function () {
  popup && popup.remove();
  activeMark && activeMark.classList.remove('map__pin--active');
};

var createPopup = function (event) {
  var i;
  var adsLength;
  var current = event.target;
  var button = current.closest('.map__pin');
  var img;
  var initialButton = current.closest('.map__pin--main');
  var positionElementInObject;

  if (initialButton) {
    return;
  }

  if (button) {

    removePopup();

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

    closePopup.addEventListener('click', onPopupCloseButtonClick);
  }
};

var onPopupCloseButtonKeydown = function (event) {
  if (event.keyCode === ESC_KEYCODE) {
    removePopup();
  }
};

var onOpenPopupClick = function (event) {
  createPopup(event);

  document.addEventListener('keydown', onPopupCloseButtonKeydown);
};

var onPinKeydown = function (event) {
  if (event.keyCode === ENTER_KEYCODE) {
    createPopup(event);
  }
};

var onPopupCloseButtonClick = function () {
  removePopup();
};

noticeFormFieldsetAll.disabled = true;

ads = generateAdArray(adFeatures, adsQuantity);

activePin.addEventListener('mouseup', onMainPinMouseup);
mapPinContainer.addEventListener('click', onOpenPopupClick);
mapPinContainer.addEventListener('keydown', onPinKeydown);

