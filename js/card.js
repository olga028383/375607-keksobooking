'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var map = document.querySelector('.map');
  var mapTemplateContainer = document.querySelector('template').content;
  var mapFiltersContainer = mapTemplateContainer.querySelector('.map__filters-container');
  var mapCardTemplate = mapTemplateContainer.querySelector('.map__card');
  var card;
  var closeCard;
  var activePin;

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

  var removeCard = function () {
    if (card) {
      card.remove();
    }
    if (activePin) {
      activePin.classList.remove('map__pin--active');
    }

    document.removeEventListener('keydown', onCardCloseEscKeydown);
  };

  var createCard = function (event) {
    var i;
    var adsLength;
    var current = event.target;
    var button = current.closest('.map__pin');
    var img;
    var positionElementInObject;

    removeCard();

    img = button.querySelector('img');
    button.classList.add('map__pin--active');
    activePin = button;

    for (i = 0, adsLength = window.data.ads.length; i < adsLength; i++) {
      if (img.src.indexOf(window.data.ads[i].author.avatar) !== -1) {
        map.insertBefore(window.utils.createMarkupFragment(window.data.ads[i], createAdsCardMarkup), mapFiltersContainer);
        positionElementInObject = window.data.ads[i];
      }
    }

    card = document.querySelector('.popup');
    closeCard = card.querySelector('.popup__close');
    card.querySelector('.popup__avatar').src = positionElementInObject.author.avatar;

    closeCard.addEventListener('click', onCardCloseButtonClick);
    document.addEventListener('keydown', onCardCloseEscKeydown);
  };

  var onCardCloseEscKeydown = function (event) {
    if (event.keyCode === ESC_KEYCODE) {
      removeCard();
    }
  };

  var onCardCloseButtonClick = function () {
    removeCard();
  };

  window.card = createCard;
})();
