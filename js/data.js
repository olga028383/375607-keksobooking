'use strict';

(function () {
  var adsQuantity = 8;
  var adFeatures = {
    titles: ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домиик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'],
    types: ['flat', 'house', 'bungalo'],
    checkins: ['12:00', '13:00', '14:00'],
    checkouts: ['12:00', '13:00', '14:00'],
    features: ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner']
  };
  var ads;

  var createAvatarUrl = function (userIndex) {
    return 'img/avatars/user' + (userIndex < 10 ? 0 : '') + userIndex + '.png';
  };

  var generateAdObject = function (mockupDataObject, count) {
    var adObject = {
      author: {},
      offer: {},
      location: {}
    };

    adObject.location.x = window.utils.getRandomInteger(300, 900);
    adObject.location.y = window.utils.getRandomInteger(100, 500);
    adObject.author.avatar = createAvatarUrl(count + 1);
    adObject.offer.title = mockupDataObject.titles[count];
    adObject.offer.address = adObject.location.x + ', ' + adObject.location.y;
    adObject.offer.price = window.utils.getRandomInteger(1000, 1000000);
    adObject.offer.type = mockupDataObject.types[window.utils.getRandomInteger(0, mockupDataObject.types.length)];
    adObject.offer.rooms = window.utils.getRandomInteger(1, 5);
    adObject.offer.guests = window.utils.getRandomInteger(10, 100);
    adObject.offer.checkin = mockupDataObject.checkins[window.utils.getRandomInteger(0, mockupDataObject.checkins.length - 1)];
    adObject.offer.checkout = mockupDataObject.checkouts[window.utils.getRandomInteger(0, mockupDataObject.checkouts.length - 1)];
    adObject.offer.features = window.utils.getRandomSubArray(mockupDataObject.features);
    adObject.offer.description = '';
    adObject.offer.photos = [];

    return adObject;
  };

  var adsArray = function (objectPoint, arrayLength) {
    var maps = [];
    var i;

    for (i = 0; i < arrayLength; i++) {
      maps[i] = generateAdObject(objectPoint, i);
    }

    return maps;
  };
  ads = adsArray(adFeatures, adsQuantity);

  window.data = {
    ads: ads
  };
})();
