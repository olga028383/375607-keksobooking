'use strict';

(function () {
  window.synchronizeFields = function (modifyingElement, dependetElement, modifyingValues, dependentValues, callback) {
    modifyingElement.addEventListener('change', function () {
      var lengthModifyingArray = modifyingValues.length;
      var i;

      for (i = 0; i < lengthModifyingArray; i++) {
        if (modifyingElement.value === modifyingValues[i]) {
          callback(dependetElement, dependentValues[i]);
        }
      }
    });
  };
})();
