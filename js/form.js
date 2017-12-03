'use strict';

(function () {
  var noticeFormFieldTimein = window.data.noticeForm.querySelector('#timein');
  var noticeFormFieldTimeout = window.data.noticeForm.querySelector('#timeout');
  var noticeFormFieldType = window.data.noticeForm.querySelector('#type');
  var noticeFormFieldPrice = window.data.noticeForm.querySelector('#price');
  var noticeFormFieldRoomNumber = window.data.noticeForm.querySelector('#room_number');
  var noticeFormFieldCapacity = window.data.noticeForm.querySelector('#capacity');
  var noticeFormButton = window.data.noticeForm.querySelector('.form__submit');

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

    window.data.noticeForm.addEventListener('invalid', function (eventField) {
      var current = eventField.target;
      current.style.borderColor = 'rgb(255, 0, 0)';
    });
  };

  window.data.noticeFormFieldsetAll.disabled = true;

  noticeFormFieldTimein.addEventListener('change', onFormFieldTimeinChange);
  noticeFormFieldTimeout.addEventListener('change', onFormFieldTimeoutChange);

  noticeFormFieldType.addEventListener('change', onFormFieldTypeChange);

  noticeFormFieldRoomNumber.addEventListener('change', onFormFieldRoomNumberChange);

  noticeFormButton.addEventListener('click', onFormButtonClick);


})();
