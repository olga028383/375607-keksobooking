'use strict';

(function () {
  var noticeForm = document.querySelector('.notice__form');
  var noticeFormFieldsetAll = noticeForm.querySelectorAll('fieldset');
  var noticeFormFieldTimein = noticeForm.querySelector('#timein');
  var noticeFormFieldTimeout = noticeForm.querySelector('#timeout');
  var noticeFormFieldType = noticeForm.querySelector('#type');
  var noticeFormFieldPrice = noticeForm.querySelector('#price');
  var noticeFormFieldRoomNumber = noticeForm.querySelector('#room_number');
  var noticeFormFieldCapacity = noticeForm.querySelector('#capacity');
  var noticeFormFieldAddress = noticeForm.querySelector('#address');
  var minimumCostHousing = {
    flat: 1000,
    bungalo: 0,
    house: 5000,
    palace: 10000
  };

  var changeFieldTimeout = function (current) {
    noticeFormFieldTimeout.selectedIndex = current.selectedIndex;
  };

  var changeFieldTimein = function (current) {
    noticeFormFieldTimein.selectedIndex = current.selectedIndex;
  };

  var changeFieldCapacity = function (current) {
    var currentValue = current.options[current.selectedIndex].value;
    var optionLength = noticeFormFieldCapacity.length;
    var i;
    var flag = true;
    for (i = 0; i < optionLength; i++) {
      if (noticeFormFieldCapacity.options[i].value === currentValue) {
        noticeFormFieldCapacity.options[i].selected = true;
        flag = false;
      }
    }
    if (flag) {
      noticeFormFieldCapacity.options[optionLength - 1].selected = true;
    }
  };

  noticeFormFieldsetAll.disabled = true;

  window.synchronizeFields.assignHandlersForLinkedFields(noticeFormFieldTimein, changeFieldTimeout);
  window.synchronizeFields.assignHandlersForLinkedFields(noticeFormFieldTimeout, changeFieldTimein);
  window.synchronizeFields.assignHandlersForLinkedFields(noticeFormFieldRoomNumber, changeFieldCapacity);
  noticeFormFieldType.addEventListener('change', function (event) {
    window.synchronizeFields.syncValueWithMin(event, minimumCostHousing, noticeFormFieldPrice);
  });

  var onFormSubmit = function (event) {
    event.preventDefault();

    var error = false;

    if (noticeFormFieldPrice.value < noticeFormFieldPrice.minLength ||
      noticeFormFieldPrice.value > noticeFormFieldPrice.maxLength) {
      noticeFormFieldPrice.style.border = window.utils.setBorder(true, 'red');
      error = true;
    } else {
      noticeFormFieldPrice.style.border = window.utils.setBorder(false);
    }

    if (noticeFormFieldAddress.value.length === 0) {
      noticeFormFieldAddress.style.border = window.utils.setBorder(true, 'red');
      error = true;
    } else {
      noticeFormFieldAddress.style.border = window.utils.setBorder(false);
    }

    if (noticeFormFieldCapacity.value > 0 && noticeFormFieldRoomNumber.value < 99) {
      if (noticeFormFieldRoomNumber.value < noticeFormFieldCapacity.value) {
        noticeFormFieldCapacity.style.border = window.utils.setBorder(true, 'red');
        error = true;
      } else {
        noticeFormFieldCapacity.style.border = window.utils.setBorder(false);
      }
    } else if (noticeFormFieldCapacity.value === '0' && noticeFormFieldRoomNumber.value === '100') {
      noticeFormFieldCapacity.style.border = window.utils.setBorder(false);
    } else {
      noticeFormFieldCapacity.style.border = window.utils.setBorder(true, 'red');
      error = true;
    }

    if (!error) {
      noticeForm.submit();
    }

  };
  noticeForm.addEventListener('submit', onFormSubmit);
})();
