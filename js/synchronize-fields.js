'use strict';

(function () {
  window.synchronizeFields = function (modifyingElement, dependetElement, modifyingValues, dependentValues, callback) {
    modifyingElement.addEventListener('change', function () {
      var i;
      var lengthModifyingArray = modifyingValues.length;
      for (i = 0; i < lengthModifyingArray; i++) {
        if (modifyingElement.value === modifyingValues[i]) {
          callback(dependetElement, dependentValues[i]);
        }
      }
    });
  };
})();
