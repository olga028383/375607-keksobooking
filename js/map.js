'use strict';

var ESC_KEYCODE = 27;

var map = document.querySelector('.map');
var mapPinContainer = map.querySelector('.map__pins');
var mapFiltersContainer = map.querySelector('.map__filters-container');
var mapTemplateContainer = document.querySelector('template').content;
var mapPinTemplate = mapTemplateContainer.querySelector('.map__pin');
var mapCardTemplate = mapTemplateContainer.querySelector('.map__card');
var mapPinMain = document.querySelector('.map__pin--main');
var noticeForm = document.querySelector('.notice__form--disabled');
var noticeFormFieldsetAll = noticeForm.querySelectorAll('fieldset');
var noticeFormFieldTimein = noticeForm.querySelector('#timein');
var noticeFormFieldTimeout = noticeForm.querySelector('#timeout');
var noticeFormFieldType = noticeForm.querySelector('#type');
var noticeFormFieldPrice = noticeForm.querySelector('#price');
var noticeFormFieldRoomNumber = noticeForm.querySelector('#room_number');
var noticeFormFieldCapacity = noticeForm.querySelector('#capacity');
var noticeFormButton = noticeForm.querySelector('.form__submit');
var images = mapPinMain.querySelector('img');
var heightImages = images.offsetHeight;
var pinPseudoelementStyles = window.getComputedStyle(document.querySelector('.map .map__pin'), ':after');
var pinPseudoelementHeight = parseInt(pinPseudoelementStyles.getPropertyValue('border-top-width'), 10);
var adsQuantity = 8;
var ads;
var popup;
var closePopup;
var activePin;

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
  buttonElement.style.left = (adObject.location.x) + 'px';
  buttonElement.style.top = (adObject.location.y - heightImages / 2 - pinPseudoelementHeight) + 'px';

  buttonElement.addEventListener('click', onOpenPopupClick);
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
  if (popup) {
    popup.remove();
  }
  if (activePin) {
    activePin.classList.remove('map__pin--active');
  }
};

var createPopup = function (event) {
  var i;
  var adsLength;
  var current = event.target;
  var button = current.closest('.map__pin');
  var img;
  var positionElementInObject;

  removePopup();

  img = button.querySelector('img');
  button.classList.add('map__pin--active');
  activePin = button;

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
};

var changeDependentNoticeFormShelf = function (event, noticeFormField) {
  var current = event.target;
  noticeFormField.selectedIndex = current.selectedIndex;
};

var setMinimumPriceNoticeForm = function (event) {
  var current = event.target;
  var valueSelected = current.options[current.selectedIndex].value;
  var minimumCostHousing = {
    flat: 1000,
    bungalo: 0,
    house: 5000,
    palace: 10000
  };

  noticeFormFieldPrice.minlength = minimumCostHousing[valueSelected];
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

var onPopupCloseButtonClick = function () {
  removePopup();
};

var onFormFieldTimeinChange = function (event) {
  changeDependentNoticeFormShelf(event, noticeFormFieldTimeout);
};

var onFormFieldTimeoutChange = function (event) {
  changeDependentNoticeFormShelf(event, noticeFormFieldTimein);
};

var onFormFieldRoomNumberChange = function (event) {
  changeDependentNoticeFormShelf(event, noticeFormFieldCapacity);
};

var onFormFieldTypeChange = function (event) {
  setMinimumPriceNoticeForm(event);
};

var onFormButtonClick = function () {

  noticeForm.addEventListener('invalid', function (eventField) {
    var current = eventField.target;
    current.style.borderColor = 'rgb(255, 0, 0)';
  });
};

noticeFormFieldsetAll.disabled = true;

ads = generateAdArray(adFeatures, adsQuantity);

mapPinMain.addEventListener('mouseup', onMainPinMouseup);

noticeFormFieldTimein.addEventListener('change', onFormFieldTimeinChange);
noticeFormFieldTimeout.addEventListener('change', onFormFieldTimeoutChange);

noticeFormFieldType.addEventListener('change', onFormFieldTypeChange);

noticeFormFieldRoomNumber.addEventListener('change', onFormFieldRoomNumberChange);

noticeFormButton.addEventListener('click', onFormButtonClick);
