'use strict';

(function () {
  window.synchronizeFields = {
    syncValueWithMin: function (event, object, element) {
      var target = event.target;
      var valueSelected = target.options[target.selectedIndex].value;
      element.setAttribute('minlength', object[valueSelected]);
    },
    assignHandlersForLinkedFields: function (field, changeFieldMethod) {
      var onFieldChange = function (event) {
        var current = event.target;
        changeFieldMethod(current);
      };
      field.addEventListener('change', onFieldChange);
    }
  };
})();
