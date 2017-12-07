'use strict';

(function () {
  var noticeForm = document.querySelector('.notice__form');
  var noticeFormFieldsetAll = noticeForm.querySelectorAll('fieldset');
  var noticeFormFieldTitle = noticeForm.querySelector('#title');
  var noticeFormFieldTimein = noticeForm.querySelector('#timein');
  var noticeFormFieldTimeout = noticeForm.querySelector('#timeout');
  var noticeFormFieldType = noticeForm.querySelector('#type');
  var noticeFormFieldPrice = noticeForm.querySelector('#price');
  var noticeFormFieldRoomNumber = noticeForm.querySelector('#room_number');
  var noticeFormFieldCapacity = noticeForm.querySelector('#capacity');
  var noticeFormFieldAddress = noticeForm.querySelector('#address');
  var noticeFormButton = noticeForm.querySelector('.form__submit');

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

  var onFormFieldTypeChange = function (event) {
    setMinimumPriceNoticeForm(event);
  };

  var assignHandlersForLinkedFields = function (field, variableField) {
    var onFieldChange = function (event) {
      changeDependentNoticeFormShelf(event, variableField);
    };
    field.addEventListener('change', onFieldChange);
  };

  var onFormSubmit = function (event) {
    // Вообще ничерта не получается с формой
    if (!noticeFormFieldAddress.validity.valueMissing ||
      !noticeFormFieldTitle.validity.valueMissing ||
      !noticeFormFieldPrice.validity.valueMissing) {
      event.preventDefault();

      noticeFormFieldAddress.style.borderColor = 'rgb(255, 0, 0)';
      noticeFormFieldTitle.style.borderColor = 'rgb(255, 0, 0)';
      noticeFormFieldPrice.style.borderColor = 'rgb(255, 0, 0)';
    }
  };

  noticeFormFieldsetAll.disabled = true;

  assignHandlersForLinkedFields(noticeFormFieldTimein, noticeFormFieldTimeout);
  assignHandlersForLinkedFields(noticeFormFieldTimeout, noticeFormFieldTimein);
  assignHandlersForLinkedFields(noticeFormFieldRoomNumber, noticeFormFieldCapacity);

  noticeFormFieldType.addEventListener('change', onFormFieldTypeChange);
  noticeForm.addEventListener('submit', onFormSubmit);


})();
