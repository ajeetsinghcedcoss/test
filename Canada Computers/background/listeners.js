/***
    Section-> Handle Actions
    Child File: functions.js
    Developed By CEDCommerce
***/
var csv_output = [];

chrome.extension.onMessage.addListener(function(t, e, a) {
    if(t.action == "saveCSV"){
        csv_output.push(t.amazon_bulk_array);
        var get_csv_data = csv_output;
        csv_output = [];
        createCSV(get_csv_data);
    }

    if(t.action == "addinCSV"){
      csv_output.push(t.amazon_bulk_array);
      chrome.storage.local.set({
         csv_count: csv_output.length
      });
      var message = "Product Added in CSV.";
      var id = "pr-fields";
      showNotification(message,id);
    }
    if(t.action == "generateQueue"){
        if(csv_output.length == 0){
            var message = "You don't have any product in the CSV Stack.";
            var id = "validation-fields";
            showNotification(message,id);
            return false;
        }else{
            var get_csv_data = csv_output;
            csv_output = [];
            chrome.storage.local.set({
              csv_count: 0
            });
            createCSV(get_csv_data);
        }
    }

    if(t.action == "shownotification"){
        showNotification(t.message,t.id);
    }
});