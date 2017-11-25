'use strict';

var map = document.querySelector('.map');
var similarListElementLabel = map.querySelector('.map__pins');
var similarListElementAds = map.querySelector('.map__filters-container');
var similarMapTemplate = document.querySelector('#similar-map-template').content;
var similarMapTemplateLabel = similarMapTemplate.querySelector('.map__pin');
var similarMapTemplateAds = similarMapTemplate.querySelector('.map__card');
var ads;
var lengthMap = 8;

var adFeatures = {
  titles: ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домиик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'],
  types: ['flat', 'house', 'bungalo'],
  checkins: ['12:00', '13:00', '14:00'],
  checkouts: ['12:00', '13:00', '14:00'],
  features: ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner']
};

var getRandomArrayIndex = function (array) {
  return Math.floor(Math.random() * array.length);
};

var getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var showElement = function (element) {
  element.classList.remove('map--faded');
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
    locationX = getRandomInt(300, 900);
    locationY = getRandomInt(100, 500);
    avatar = 'img/avatars/user0' + Number(i + 1) + '.png';
    title = objPoint.titles[i];
    address = locationX + ', ' + locationY;
    price = getRandomInt(1000, 1000000);
    type = objPoint.types[getRandomArrayIndex(objPoint.types)];
    rooms = getRandomInt(1, 5);
    guests = getRandomInt(10, 100);
    checkin = objPoint.checkins[getRandomArrayIndex(objPoint.checkins)];
    checkout = objPoint.checkouts[getRandomArrayIndex(objPoint.checkouts)];
    features = getRandomInt(1, 6);
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

var createLabel = function (objMap) {
  var buttonElement = similarMapTemplateLabel.cloneNode(true);
  var img = buttonElement.querySelector('img');
  img.src = objMap.author.avatar;
  buttonElement.style.left = objMap.location.x - img.width / 2 + 'px';
  buttonElement.style.top = objMap.location.y - img.height / 2 + 'px';
  return buttonElement;
};

var createAds = function (objMap) {
  var adsElement = similarMapTemplateAds.cloneNode(true);
  var translate = {flat: 'Квартира', house: 'Дом', bungalo: 'Бунгало'};
  var i;
  var feature = '';
  adsElement.querySelector('h3').textContent = objMap.offer.title;
  adsElement.querySelector('p>small').textContent = objMap.offer.address;
  adsElement.querySelector('.popup__price').innerHTML = objMap.offer.price + ' &#x20bd;/ночь';
  adsElement.querySelector('h4').textContent = translate[objMap.offer.type];
  adsElement.querySelector('h4+p').textContent = objMap.offer.rooms + ' для ' + objMap.offer.guests + ' гостей';
  adsElement.querySelector('h4+p+p').textContent = 'Заезд после ' + objMap.offer.checkin + ', выезд до ' + objMap.offer.checkout;
  adsElement.querySelector('.popup__features+p').textContent = objMap.offer.description;
  adsElement.querySelector('.popup__avatar').src = objMap.author.avatar;
  for (i = 0; i < objMap.offer.features; i++) {
    feature += '<li class="feature feature--' + adFeatures.features[i] + '"></li>';
  }
  adsElement.querySelector('.popup__features').innerHTML = feature;
  return adsElement;
};

var addElementsToTheMap = function (objMap, createElements) {
  var fragmentButton = document.createDocumentFragment();
  var i;
  var mapLength;
  for (i = 0, mapLength = objMap.length; i < mapLength; i++) {
    fragmentButton.appendChild(createElements(objMap[i]));
  }
  return fragmentButton;
};

ads = generateArrayMapPoints(adFeatures, lengthMap);
showElement(map);
similarListElementLabel.appendChild(addElementsToTheMap(ads, createLabel));
similarListElementAds.appendChild(addElementsToTheMap(ads, createAds));


