/***
    Section-> Background Action
    HTML File: bana.html
    Developed By CEDCommerce
***/

// Function to run process of adding product into cart one by one
function cedProcessAddToCart(banaOrderDetails){

  // Get current counter from order detail array
  chrome.storage.local.get({
    banaCounterForProduct: 0
  }, function(data) {
   
    if(data.banaCounterForProduct == (banaOrderDetails.products.length - 1) ){ // Means this is last product to add into cart
      // Call function to open cart page
      // Open product page
      chrome.storage.local.set({
            banaIsLastProduct: 1
        }, function() {
          
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
              
              chrome.tabs.update(tabs.id, {
                  url: banaOrderDetails.products[data.banaCounterForProduct].url
              },  function(tab){
                 // nothing to do 
              });
            });
            
        });
    }else{
     
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.update(tabs.id, {
            url: banaOrderDetails.products[data.banaCounterForProduct].url
        },  function(tab){
           // nothing to do 
        });
      });
    }
  });
}