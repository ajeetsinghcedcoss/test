/***
    Section-> Generate Action
    HTML File: shipping.html
    Developed By CEDCommerce
***/

chrome.storage.local.get({csv_count: 0}, function(track) {
    if(track.csv_count != 0) {
        document.getElementById('total-count').innerHTML = 'Total Product(s) in CSV: '+ track.csv_count;
    }
});

/*Generate Page on Amazon.com*/
function Generate() {
    chrome.extension.sendMessage({
        action: 'generateQueue'
    });
}
document.getElementById('import-csv').addEventListener('click',
    Generate);
