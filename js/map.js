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

var generateArrayMapPoints = function (objPoint, arrayLength) {
  var maps = [];
  var locationX;
  var locationY;
  var avatar;
  var title;
  var address;
  var price;
  var type;
  var rooms;
  var guests;
  var checkin;
  var checkout;
  var features;
  var description;
  var photos;
  var i;
  for (i = 0; i < arrayLength; i++) {
    locationX = getRandomInteger(300, 900);
    locationY = getRandomInteger(100, 500);
    avatar = 'img/avatars/user0' + Number(i + 1) + '.png';
    title = objPoint.titles[i];
    address = locationX + ', ' + locationY;
    price = getRandomInteger(1000, 1000000);
    type = objPoint.types[getRandomInteger(0, objPoint.types.length)];
    rooms = getRandomInteger(1, 5);
    guests = getRandomInteger(10, 100);
    checkin = objPoint.checkins[getRandomInteger(0, objPoint.checkins.length)];
    checkout = objPoint.checkouts[getRandomInteger(0, objPoint.checkouts.length)];
    features = getRandomInteger(1, 6);
    description = '';
    photos = [];
    maps[i] = {
      author: {avatar: avatar},
      offer: {
        title: title,
        address: address,
        price: price,
        type: type,
        rooms: rooms,
        guests: guests,
        checkin: checkin,
        checkout: checkout,
        features: features,
        description: description,
        photos: photos
      },
      location: {x: locationX, y: locationY}
    };
  }
  return maps;
};

var createLabel = function (adObject) {
  var buttonElement = mapPinTemplate.cloneNode(true);
  var img = buttonElement.querySelector('img');
  img.src = adObject.author.avatar;
  buttonElement.style.left = adObject.location.x - img.width / 2 + 'px';
  buttonElement.style.top = adObject.location.y - img.height / 2 + 'px';
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

ads = generateArrayMapPoints(adFeatures, adsQuantity);
map.classList.remove('map--faded');
mapFiltersContainer.appendChild(createMarkupFragment(ads, createAdsCardMarkup));
mapPinContainer.appendChild(createMarkupFragment(ads, createLabel));


