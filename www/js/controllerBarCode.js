
module.controller('BarcodeCtrl.api', function($scope, $cordovaBarcodeScanner) {

  document.addEventListener("deviceready", function () {

    $cordovaBarcodeScanner
      .scan()
      .then(function(barcodeData) {
        // Success! Barcode data is here
      }, function(error) {
        // An error occurred
      });


    // NOTE: encoding not functioning yet
    $cordovaBarcodeScanner
      .encode(BarcodeScanner.Encode.TEXT_TYPE, "http://www.nytimes.com")
      .then(function(success) {
        // Success!
      }, function(error) {
        // An error occurred
      });

  }, false);
});