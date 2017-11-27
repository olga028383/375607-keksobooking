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

var creatingUrlAvatar = function (firstNumber, twoNumber) {
  return 'img/avatars/user' + firstNumber + twoNumber + '.png';
};

// Вот эта функция получения рандомных фич, но она неправильно работает. Т как в выборку может попасть 1 фича неснолько раз.
// Я не очень поняла замечания по поводу фич
// Вот это: "Ты сначала должна находить рандомно количество фич, которое ты хочешь взять, а потом рандомно взять столько фич из массива фич. Например, ты получила, что будет 3 фичи, а потом циклом проходишься 3 раза по массиву и вытягиваешь рандомные фичи'
var getRandomFeatures = function () {
  var arrayFeatures = [];
  var countFeatures = getRandomInteger(0, 6);
  for (var i = 0; i < countFeatures; i++) {
    arrayFeatures.push(adFeatures.features[getRandomInteger(0, countFeatures)]);
  }
  return arrayFeatures;
};
getRandomFeatures();

var generateAdObject = function (objectPoint, count) {
  var adObject = {};
  adObject.locationX = getRandomInteger(300, 900);
  adObject.locationY = getRandomInteger(100, 500);
  adObject.avatar = creatingUrlAvatar(0, count + 1);
  adObject.title = objectPoint.titles[count];
  adObject.address = adObject.locationX + ', ' + adObject.locationY;
  adObject.price = getRandomInteger(1000, 1000000);
  adObject.type = objectPoint.types[getRandomInteger(0, objectPoint.types.length)];
  adObject.rooms = getRandomInteger(1, 5);
  adObject.guests = getRandomInteger(10, 100);
  adObject.checkin = objectPoint.checkins[getRandomInteger(0, objectPoint.checkins.length)];
  adObject.checkout = objectPoint.checkouts[getRandomInteger(0, objectPoint.checkouts.length)];
  adObject.features = getRandomInteger(0, 6);
  adObject.description = '';
  adObject.photos = [];
  return adObject;
};
var generateAdArray = function (objectPoint, arrayLength) {
  var maps = [];
  var adsObject;
  var i;
  for (i = 0; i < arrayLength; i++) {
    adsObject = generateAdObject(objectPoint, i);
    maps[i] = {
      author: {avatar: adsObject.avatar},
      offer: {
        title: adsObject.title,
        address: adsObject.address,
        price: adsObject.price,
        type: adsObject.type,
        rooms: adsObject.rooms,
        guests: adsObject.guests,
        checkin: adsObject.checkin,
        checkout: adsObject.checkout,
        features: adsObject.features,
        description: adsObject.description,
        photos: adsObject.photos
      },
      location: {x: adsObject.locationX, y: adsObject.locationY}
    };
  }
  return maps;
};

var createLabel = function (adObject) {
  var buttonElement = mapPinTemplate.cloneNode(true);
  var img = buttonElement.querySelector('img');
  img.src = adObject.author.avatar;
  // не могу понять как паддинг получить, у меня пустое значение img.style.padding;
  buttonElement.style.left = (adObject.location.x - img.width / 2 - 3) + 'px';
  buttonElement.style.top = (adObject.location.y - img.height / 2 - 3 - 5) + 'px';
  return buttonElement;
};

var createAdsCardMarkup = function (adObject) {
  var adsElement = mapCardTemplate.cloneNode(true);
  var translate = {flat: 'Квартира', house: 'Дом', bungalo: 'Бунгало'};
  var i;
  var feature = '';
  adsElement.querySelector('h3').textContent = adObject.offer.title;
  adsElement.querySelector('p > small').textContent = adObject.offer.address;
  adsElement.querySelector('.popup__price').innerHTML = adObject.offer.price + ' &#x20bd;/ночь';
  adsElement.querySelector('h4').textContent = translate[adObject.offer.type];
  adsElement.querySelector('h4 + p').textContent = adObject.offer.rooms + ' для ' + adObject.offer.guests + ' гостей';
  adsElement.querySelector('h4 + p + p').textContent = 'Заезд после ' + adObject.offer.checkin + ', выезд до ' + adObject.offer.checkout;
  adsElement.querySelector('.popup__features + p').textContent = adObject.offer.description;
  adsElement.querySelector('.popup__avatar').src = adObject.author.avatar;
  for (i = 0; i < adObject.offer.features; i++) {
    feature += '<li class="feature feature--' + adFeatures.features[i] + '"></li>';
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
mapFiltersContainer.appendChild(createMarkupFragment(ads, createAdsCardMarkup));
mapPinContainer.appendChild(createMarkupFragment(ads, createLabel));


