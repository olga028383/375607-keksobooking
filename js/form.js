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

  var onMinimumPriceNoticeFormChange = function (event) {
    var target = event.target;
    var valueSelected = target.options[target.selectedIndex].value;
    var minimumCostHousing = {
      flat: 1000,
      bungalo: 0,
      house: 5000,
      palace: 10000
    };

    noticeFormFieldPrice.setAttribute('minlength', minimumCostHousing[valueSelected]);
  };

  var assignHandlersForLinkedFields = function (field, changeFieldMethod) {
    var onFieldChange = function (event) {
      var current = event.target;
      changeFieldMethod(current);
    };
    field.addEventListener('change', onFieldChange);
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

  assignHandlersForLinkedFields(noticeFormFieldTimein, changeFieldTimeout);
  assignHandlersForLinkedFields(noticeFormFieldTimeout, changeFieldTimein);
  assignHandlersForLinkedFields(noticeFormFieldRoomNumber, changeFieldCapacity);
  noticeFormFieldType.addEventListener('change', onMinimumPriceNoticeFormChange);
  noticeFormFieldAddress.addEventListener('keydown', function (event) {
    event.preventDefault();
  });

  noticeFormFieldTitle.addEventListener('invalid', function (event) {
    var target = event.target;
    if (noticeFormFieldTitle.validity.tooLong) {
      target.setCustomValidity('Максимальное количество ' + target.maxLength + ' символов.');
      noticeFormFieldTitle.style.border = window.utils.setBorder(true, 'red');
    } else if (noticeFormFieldTitle.validity.tooShort) {
      target.setCustomValidity('Минимальное количество ' + target.minLength + ' символов.');
      noticeFormFieldTitle.style.border = window.utils.setBorder(true, 'red');
    } else if (noticeFormFieldTitle.validity.valueMissing) {
      target.setCustomValidity('Поле обязательно для заполнения');
      noticeFormFieldTitle.style.border = window.utils.setBorder(true, 'red');
    } else {
      target.setCustomValidity('');
    }
  });

  noticeFormFieldAddress.addEventListener('invalid', function (event) {
    var target = event.target;
    if (noticeFormFieldAddress.validity.valueMissing) {
      target.setCustomValidity('Поле обязательно для заполнения');
      noticeFormFieldAddress.style.border = window.utils.setBorder(true, 'red');
    } else {
      target.setCustomValidity('');
    }
  });

  // не происходит валидация цены формы, не пойму почему?
  noticeFormFieldPrice.addEventListener('invalid', function () {
    var target = event.target;
    if (noticeFormFieldPrice.validity.tooLong) {
      target.setCustomValidity('Максимальное количество ' + target.maxLength + ' символов.');
      noticeFormFieldPrice.style.border = window.utils.setBorder(true, 'red');
    } else if (noticeFormFieldPrice.validity.tooShort) {
      target.setCustomValidity('Минимальное количество ' + target.minLength + ' символов.');
      noticeFormFieldPrice.style.border = window.utils.setBorder(true, 'red');
    } else if (noticeFormFieldPrice.validity.valueMissing) {
      target.setCustomValidity('Поле обязательно для заполнения');
      noticeFormFieldPrice.style.border = window.utils.setBorder(true, 'red');
    } else {
      target.setCustomValidity('');
    }
  });
})();
