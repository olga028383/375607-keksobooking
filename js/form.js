'use strict';

(function () {
  var noticeForm = document.querySelector('.notice__form');
  var noticeFormFieldsetAll = noticeForm.querySelectorAll('fieldset');
  var noticeFormFieldTimein = noticeForm.querySelector('#timein');
  var noticeFormFieldTimeinOptions = noticeFormFieldTimein.querySelectorAll('option');
  var noticeFormFieldTimeout = noticeForm.querySelector('#timeout');
  var noticeFormFieldTimeoutOptions = noticeFormFieldTimeout.querySelectorAll('option');
  var noticeFormFieldType = noticeForm.querySelector('#type');
  var noticeFormFieldTypeOptions = noticeFormFieldType.querySelectorAll('option');
  var noticeFormFieldPrice = noticeForm.querySelector('#price');
  var noticeFormFieldRoomNumber = noticeForm.querySelector('#room_number');
  var noticeFormFieldCapacity = noticeForm.querySelector('#capacity');
  var noticeFormFieldAddress = noticeForm.querySelector('#address');
  var noticeFormFieldFeature = noticeForm.querySelector('.features');
  var noticeFormFieldDescription = noticeForm.querySelector('#description');
  var noticeFormFieldFeatureInput = noticeFormFieldFeature.querySelectorAll('input');
  var noticeFormFieldFeatures = [].slice.call(noticeFormFieldFeatureInput);
  var noticeFormFieldAvatar = noticeForm.querySelector('#avatar');
  var noticeFormAvatarDragZone = noticeForm.querySelector('.notice__photo label');
  var noticeFormFieldImages = noticeForm.querySelector('#images');
  var noticeFormImagesContainer = noticeForm.querySelector('.form__photo-container');
  var noticeFormImagesDragZone = noticeFormImagesContainer.querySelector('label');
  var photo = false;
  var minimumCostHousing = {
    flat: 1000,
    bungalo: 0,
    house: 5000,
    palace: 10000
  };
  var timeinOptions;
  var timeoutOptions;
  var typeOptions;
  var minimumPricesForType;

  var syncValues = function (element, value) {
    element.value = value;
  };

  var syncValueWithMin = function (element, value) {
    element.minLength = value;
  };

  var getValuesFromArray = function (array, index) {
    return array[index].value;
  };

  var getValuesFromObject = function (array, index) {
    return minimumCostHousing[array[index].value];
  };

  var changeFieldCapacity = function (event) {
    var current = event.target;
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
      window.backend.save(new FormData(noticeForm), function () {
        noticeForm.querySelector('#title').value = '';
        noticeFormFieldAddress.value = '';
        noticeFormFieldType.value = 'flat';
        noticeFormFieldPrice.value = '5000';
        noticeFormFieldTimein.value = '12:00';
        noticeFormFieldTimeout.value = '12:00';
        noticeFormFieldRoomNumber.value = '1';
        noticeFormFieldCapacity.value = '1';
        noticeFormFieldDescription.value = '';
        noticeFormFieldAvatar.value = '';
        noticeFormFieldImages.value = '';
        noticeFormAvatarDragZone.textContent = 'Загрузите или перетащите сюда фото';
        noticeFormImagesDragZone.textContent = 'Загрузите или перетащите сюда фото';
        noticeFormImagesContainer.style.width = '70px';

        noticeFormFieldFeatures.forEach(function (element) {
          element.checked = false;
        });
      });
    }
  };

  var createPhoto = function (event) {
    var image;

    image = document.createElement('img');
    image.src = event.target.result;
    image.style.height = '100%';
    image.style.marginLeft = '5px';
    image.style.marginRight = '5px';
    return image;
  };

  var createPhotoAvatar = function (event) {
    noticeFormAvatarDragZone.innerHTML = '';
    noticeFormAvatarDragZone.appendChild(createPhoto(event));
  };

  var createPhotoImages = function (event) {
    if (!photo) {
      noticeFormImagesDragZone.innerHTML = '';
      photo = true;
    }
    noticeFormImagesContainer.style.width = 'auto';
    noticeFormImagesDragZone.appendChild(createPhoto(event));
  };

  var parseFile = function (file, onCollbackLoad) {
    var reader;
    if (file.type.indexOf('image') === 0) {
      reader = new FileReader();
      reader.addEventListener('load', function (event) {
        onCollbackLoad(event);
      });
      reader.readAsDataURL(file);
    }
  };

  var stopBrowserAction = function (event) {
    event.preventDefault();
  };

  var selectFile = function (event, onCollbackLoad) {
    stopBrowserAction(event);
    var files = event.target.files || event.dataTransfer.files;
    [].slice.call(files).forEach(function (file) {
      parseFile(file, onCollbackLoad);
    });
  };

  var uploadPhotoEvents = function (field, dragZone, onCollbackLoad) {
    field.addEventListener('change', function (event) {
      selectFile(event, onCollbackLoad);
    });

    dragZone.addEventListener('dragover', function (event) {
      stopBrowserAction(event);
    });

    dragZone.addEventListener('dragleave', function (event) {
      stopBrowserAction(event);
    });

    dragZone.addEventListener('drop', function (event) {
      selectFile(event, onCollbackLoad);
    });
  };

  noticeFormFieldsetAll.disabled = true;

  timeinOptions = window.utils.getValues(noticeFormFieldTimeinOptions, getValuesFromArray);
  timeoutOptions = window.utils.getValues(noticeFormFieldTimeoutOptions, getValuesFromArray);
  typeOptions = window.utils.getValues(noticeFormFieldTypeOptions, getValuesFromArray);
  minimumPricesForType = window.utils.getValues(noticeFormFieldTypeOptions, getValuesFromObject);

  window.synchronizeFields(noticeFormFieldTimein, noticeFormFieldTimeout, timeinOptions, timeoutOptions, syncValues);
  window.synchronizeFields(noticeFormFieldTimeout, noticeFormFieldTimein, timeoutOptions, timeinOptions, syncValues);
  window.synchronizeFields(noticeFormFieldType, noticeFormFieldPrice, typeOptions, minimumPricesForType, syncValueWithMin);
  noticeFormFieldRoomNumber.addEventListener('change', changeFieldCapacity);

  uploadPhotoEvents(noticeFormFieldAvatar, noticeFormAvatarDragZone, createPhotoAvatar);
  uploadPhotoEvents(noticeFormFieldImages, noticeFormImagesDragZone, createPhotoImages);

  noticeForm.addEventListener('submit', onFormSubmit);
})();
