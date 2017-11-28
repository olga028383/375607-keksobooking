'use strict';

var map = document.querySelector('.map');
var mapPinContainer = map.querySelector('.map__pins');
var mapFiltersContainer = map.querySelector('.map__filters-container');
var mapTemplateContainer = document.querySelector('template').content;
var mapPinTemplate = mapTemplateContainer.querySelector('.map__pin');
var mapCardTemplate = mapTemplateContainer.querySelector('.map__card');
var ads;
var adsQuantity = 8;

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

var getRandomSubArray = function (arrayLength) {
  // Какой -то маленький массив постоянно получается, то 1 свойство, то ни одного, может чего не так?
  var arrayFeatures = [];
  var index;
  var element;
  var arrayCopy = arrayLength;
  for (var i = 0; i < getRandomInteger(0, arrayCopy.length - 1); i++) {
    index = getRandomInteger(0, getRandomInteger(0, arrayCopy.length - 1));
    element = arrayCopy[index];
    arrayFeatures.push(element);
    arrayCopy.splice(index, 1);
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
  var buttonElement = mapPinTemplate.cloneNode(true);
  var img = buttonElement.querySelector('img');
  img.src = adObject.author.avatar;
  // У меня почему-то здесь значения вообще не высчитываются, то их нет , то 0 , вероятно нужно повестить обработчики на onload?
  // var computedStyle = getComputedStyle(mapPinTemplate, '::after').borderTopWidth;
  buttonElement.style.left = (adObject.location.x - img.offsetWidth) + 'px';
  buttonElement.style.top = (adObject.location.y - img.offsetHeight - 5) + 'px';
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
  adsElement.querySelector('.popup__avatar').src = adObject.author.avatar;
  for (i = 0, featuresLength = adObject.offer.features.length; i < featuresLength; i++) {
    feature += '<li class="feature feature--' + adObject.offer.features[i] + '"></li>';
  }
  adsElement.querySelector('.popup__features').innerHTML = feature;
  return adsElement;
};

var createMarkupFragment = function (adObject, createElements) {
  var documentFragment = document.createDocumentFragment();
  var i;
  var mapLength;
  for (i = 0, mapLength = adObject.length; i < mapLength; i++) {
    documentFragment.appendChild(createElements(adObject[i]));
  }
  return documentFragment;
};

ads = generateAdArray(adFeatures, adsQuantity);
map.classList.remove('map--faded');
map.insertBefore(createMarkupFragment(ads, createAdsCardMarkup), mapFiltersContainer);
mapPinContainer.appendChild(createMarkupFragment(ads, createLabel));


