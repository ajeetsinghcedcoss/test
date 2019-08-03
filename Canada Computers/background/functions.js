/***
    Section-> Handle Functions called from Parent file
    Parent File: listeners.js
    Developed By CEDCommerce
***/

function createCSV(output){
    prpareCSVData(output);
}

function prpareCSVData(output){
    var output_csv = [];
    $.each(output,function(key,val){
        $.each(val,function(key2,val2){
            var csv_data = {};
            $.each(val2,function(key3,val3){
                csv_data[key3] = val3;
            });
            output_csv.push(csv_data);
        });
    });
    var d = new Date();
    downloadCSV({ file: "Canada-Computers"+d.getMilliseconds()+".csv" },output_csv);
}

function downloadCSV(argument,stockData) {  
    var data, file, link;
    var csv = ArrayObjectsToCSV({
        data: stockData
    });
    if (csv == null){
        response = "Something went Wrong! Contact to CEDCommerce support.";
        id='warning-msg';
        showNotification(response,id);
        return;
    }

    file = argument.file || 'custom-order.csv';

    if (!csv.match(/^data:text\/csv/i)) {
        csv = 'data:text/csv;charset=utf-8,' + csv;
    }
    data = encodeURI(csv);    
    chrome.downloads.download({
      url: data,
      filename: file
    });
    
    response = "CSV File Named "+file+" downloaded successfully.";
    id='starting-msg';
    showNotification(response,id);
}

function ArrayObjectsToCSV(argument) { 
    var callback_data, count, keys, column, line, data;

    data = argument.data || null;
    if (data == null || !data.length) {
        return null;
    }

    column = argument.column || ',';
    line = argument.line || '\n';

    keys = Object.keys(data[0]);

    callback_data = '';
    callback_data += keys.join(column);
    callback_data += line;
    data.forEach(function(item) {
        count = 0;
        keys.forEach(function(key) {
            if (count > 0) callback_data += column;

            callback_data += item[key];
            count++;
        });
        callback_data += line;
    });
    return callback_data;
}

function showNotification(message,id) {
    var opt = {
        type: 'list',
        title: "Canada Computers | CEDCommerce",
        message: message,
        priority: 1,
        items: [{ title: '', message: ''}],
        iconUrl:'../images/logo.png'
    };
    chrome.notifications.create(id, opt, function(id) {});
    chrome.notifications.clear(id);
    return true;
}