/****  Developed By CEDCommerce ****/
$(document).ready(function(){

    /*** Initialize Loader ***/
    loader_gif = chrome.extension.getURL("images/loader.gif");
    var load_img = document.createElement("img");
    load_img.setAttribute("src",loader_gif);

    var loader = document.createElement("div");
    loader.setAttribute("class",'loader');
    loader.setAttribute("id",'loader');
    loader.setAttribute("style","display:none;");
    loader.appendChild(load_img);
    document.body.appendChild(loader);
    
    $("#results div.row:eq(1)").append("<button title='Add this product in CSV' type='button' class='addlink'>Add Links</button>");
    $('.addlink').on("click", addlinks);

//constom
    //$("#results div.row:eq(1)").append("<button title='Add In CSV' type='button' class='addincsv'>Add In CSV</button>"); //class='feedback-unopened btn btn-info rounded-0'
    //$('.addincsv').on("click", addincsv);
    $("#header-search").append("<button title='Add In CSV' type='button' style='float: right;' class='addincsv'>Add In CSV</button>");
    $('.addincsv').on("click", addincsv);

//end
    /*** Initialize Loader - End ***/
    function addlinks(){
        var all_lists = $(".productImageSearch");
        $.each(all_lists,function(key,level_2_){
            var check_e = $(level_2_).find(".importlink");
            if(check_e.length!==1){
                 var buttonId = "#importlink_"+key;
                var button = "<button title='Add this product in CSV' type='button' class='importlink' id='importlink_"+key+"''>+</button>";
                $(level_2_).append(button);
                 $(buttonId).on("click", importdata);
            }
        });
        //$('.importlink').on("click", importdata);
    }


//costom
    function addincsv(){
        var hrefArray = new Array();
        var all_lists = $(".importlink");
        $.each(all_lists,function(key,level_2_){
            var buttonId = "#importlink_"+key;
console.log(buttonId);
            if($(buttonId)){
                $(buttonId).dispatchEvent(new Event("click"));
            }

        }); 

        console.log("okk");
    }


 function importdatacustom(event) {
        document.getElementById("loader").style.display = "block";
        var amazon_bulk_array = [];
        var amazon_array = {};
        var images_600 = "";
        var images_75 = "";
        var product_title = "";
        var product_currency = 0.0;
        var description = "";
        var specification = "";
        var warranty = "";
        var main_image = "";
        var inventory = 0;

        var target = event //event.target;
        var pro_url = $(target).prev('a').attr("href");
        console.log(pro_url);
        var code_tab_sec = $(target).prev('a');
        var code_tab = $(code_tab_sec).find('small span').text();
        var code_1 =  $.trim(code_tab.replace('Item Code:',''));
        var code = $.trim(code_1.replace('Part No:',''));

        var click_parent = $(target).parent().parent().parent();
        var click_parent_sib = $(click_parent).siblings('div.col-12.allInfoSearch');
        var online_inven_tab = $(click_parent_sib).find('a.stock-popup.pointer');
        var online_inven_tab1 = $(online_inven_tab).children('div.line-height')[0];
        var online_inven_ltab = $(online_inven_tab1).find('small.pq-hdr-bolder');
        var online_avalaibility = $(online_inven_ltab).text();
        var on_avalaibility = online_avalaibility;
        if(on_avalaibility.indexOf("Online In Stock") >= 0){
            inventory = 2;
        }else if((on_avalaibility.indexOf("Order Online and Pick Up In-Store") >= 0) || (on_avalaibility.indexOf("Online Sold Out") >= 0)){
            inventory = 0;
        }
        $.get(pro_url,function(data){
        
        console.log(data);

            var product_title_tab = $(data).find("h1.h3.product-title.mb-2");
            var product_title_1 = $(product_title_tab).find("strong").text();
            product_title = product_title_1.replace(/\,/g,";");
            var image_elems = $(data).find("img[id*='photo']");
            $.each(image_elems,function(key,image_sec){
                var thumb = $(image_sec).attr('src');
                images_75 += decodeURIComponent(thumb)+';';
                var custom_img = thumb.replace('75x75','600x600');
                if(key === 0){
                    main_image = decodeURIComponent(custom_img);
                }
                images_600 += decodeURIComponent(custom_img)+';';
            });

            product_currency = $(data).find("span.h2-big").text();
            product_currency = product_currency.replace(/\,/g,"");

            category_l1 = $(data).find("div.row.d-none.d-sm-block");
            category_l2 = $(category_l1).find("ol.breadcrumb.pt-0.pb-1 li:eq(1)");
            category = $(category_l2).find("a").text();
            warr_option = [];
            warr_option_l1 = $(data).find("a.btn2.position-relative.warr");
            if(warr_option_l1!==undefined){
                $.each(warr_option_l1,function(key, val){
                    war_option = $(val).text();
                    warr_option.push($.trim(war_option));
                });
            }
            var w_options = JSON.stringify(warr_option);
            var warranty_options = w_options.replace(/[,']/g,'');;

            var desc_section = $(data).find("#nav-home").html();
            var descript = desc_section.substr(0, desc_section.indexOf('var wcCpi'));
            var descript = desc_section.substr(0, descript.indexOf('<script>'));
            description = descript.replace(/\,/g,";");
            var desc_text = $(description).text();
            desc_text = desc_text.replace(/[^a-z0-9\s]/gi, '');
    
            if((description === "") || desc_text.length<50){
                description = "Not Available.";
            }

            spec_section = $(data).find("#nav-profile").text();
            specification = spec_section.replace(/\,/g,";");
            if(specification === ""){
                specification = "Not Available.";
            }
            specification = $.trim(specification.replace(/\r?\n|\r/g,'<br>'));
            specification = specification.replace(/\s/g,'');

            warranty_section = $(data).find("#nav-contact").text();
            warranty = warranty_section.replace(/\,/g,";");
            if(warranty === ""){
                warranty = "Not Available.";
            }
            warranty = $.trim(warranty.replace(/\r?\n|\r/g,'<br>'));
            warranty = warranty.replace(/\s/g,'');

            amazon_array['Product SKU'] = code;
            amazon_array['Title'] = product_title.replace(/[,']/g,'');
            amazon_array['Inventory'] = inventory;
            amazon_array['Category'] = category.replace(/[,']/g,'');
            amazon_array['Product Url'] = pro_url;
            amazon_array['Price'] = $.trim(product_currency);
            amazon_array['Main Image'] = main_image;
            // amazon_array['Additional Images 75'] = images_75.replace(/[,]/g,'');
            amazon_array['Additional Images 600'] = images_600.replace(/[,]/g,'');
            amazon_array['Warranty Options'] = warranty_options;
            product_description = description.replace(/\r?\n|\r/g,'');
            var desc = product_description.replace(/\r?\n|\r/g,'<br>');
            amazon_array['Description'] = $.trim(description);
            amazon_array['Specification'] = $.trim(specification);
            amazon_array['Warranty & Returns'] = $.trim(warranty);
            amazon_bulk_array.push(amazon_array);
            document.getElementById("loader").style.display = "none";
            chrome.extension.sendMessage({
                action: 'addinCSV',
                amazon_bulk_array: amazon_bulk_array,
            });
            return false;
        });
    }

    // end
    function importdata(event) {

        console.log("Here");

        document.getElementById("loader").style.display = "block";
        var amazon_bulk_array = [];
        var amazon_array = {};
        var images_600 = "";
        var images_75 = "";
        var product_title = "";
        var product_currency = 0.0;
        var description = "";
        var specification = "";
        var warranty = "";
        var main_image = "";
        var inventory = 0;

        var target = event.target;
        console.log(event);
        console.log(target);

        var pro_url = $(target).prev('a').attr("href");
        var code_tab_sec = $(target).prev('a');
        var code_tab = $(code_tab_sec).find('small span').text();
        var code_1 =  $.trim(code_tab.replace('Item Code:',''));
        var code = $.trim(code_1.replace('Part No:',''));

        var click_parent = $(target).parent().parent().parent();
        var click_parent_sib = $(click_parent).siblings('div.col-12.allInfoSearch');
        var online_inven_tab = $(click_parent_sib).find('a.stock-popup.pointer');
        var online_inven_tab1 = $(online_inven_tab).children('div.line-height')[0];
        var online_inven_ltab = $(online_inven_tab1).find('small.pq-hdr-bolder');
        var online_avalaibility = $(online_inven_ltab).text();
        var on_avalaibility = online_avalaibility;
        if(on_avalaibility.indexOf("Online In Stock") >= 0){
            inventory = 2;
        }else if((on_avalaibility.indexOf("Order Online and Pick Up In-Store") >= 0) || (on_avalaibility.indexOf("Online Sold Out") >= 0)){
            inventory = 0;
        }
        $.get(pro_url,function(data){
            var product_title_tab = $(data).find("h1.h3.product-title.mb-2");
            var product_title_1 = $(product_title_tab).find("strong").text();
            product_title = product_title_1.replace(/\,/g,";");
            var image_elems = $(data).find("img[id*='photo']");
            $.each(image_elems,function(key,image_sec){
                var thumb = $(image_sec).attr('src');
                images_75 += decodeURIComponent(thumb)+';';
                var custom_img = thumb.replace('75x75','600x600');
                if(key === 0){
                    main_image = decodeURIComponent(custom_img);
                }
                images_600 += decodeURIComponent(custom_img)+';';
            });

            product_currency = $(data).find("span.h2-big").text();
            product_currency = product_currency.replace(/\,/g,"");

            category_l1 = $(data).find("div.row.d-none.d-sm-block");
            category_l2 = $(category_l1).find("ol.breadcrumb.pt-0.pb-1 li:eq(1)");
            category = $(category_l2).find("a").text();
            warr_option = [];
            warr_option_l1 = $(data).find("a.btn2.position-relative.warr");
            if(warr_option_l1!==undefined){
                $.each(warr_option_l1,function(key, val){
                    war_option = $(val).text();
                    warr_option.push($.trim(war_option));
                });
            }
            var w_options = JSON.stringify(warr_option);
            var warranty_options = w_options.replace(/[,']/g,'');;

            var desc_section = $(data).find("#nav-home").html();
            var descript = desc_section.substr(0, desc_section.indexOf('var wcCpi'));
            var descript = desc_section.substr(0, descript.indexOf('<script>'));
            description = descript.replace(/\,/g,";");
            var desc_text = $(description).text();
            desc_text = desc_text.replace(/[^a-z0-9\s]/gi, '');
    
            if((description === "") || desc_text.length<50){
                description = "Not Available.";
            }

            spec_section = $(data).find("#nav-profile").text();
            specification = spec_section.replace(/\,/g,";");
            if(specification === ""){
                specification = "Not Available.";
            }
            specification = $.trim(specification.replace(/\r?\n|\r/g,'<br>'));
            specification = specification.replace(/\s/g,'');

            warranty_section = $(data).find("#nav-contact").text();
            warranty = warranty_section.replace(/\,/g,";");
            if(warranty === ""){
                warranty = "Not Available.";
            }
            warranty = $.trim(warranty.replace(/\r?\n|\r/g,'<br>'));
            warranty = warranty.replace(/\s/g,'');

            amazon_array['Product SKU'] = code;
            amazon_array['Title'] = product_title.replace(/[,']/g,'');
            amazon_array['Inventory'] = inventory;
            amazon_array['Category'] = category.replace(/[,']/g,'');
            amazon_array['Product Url'] = pro_url;
            amazon_array['Price'] = $.trim(product_currency);
            amazon_array['Main Image'] = main_image;
            // amazon_array['Additional Images 75'] = images_75.replace(/[,]/g,'');
            amazon_array['Additional Images 600'] = images_600.replace(/[,]/g,'');
            amazon_array['Warranty Options'] = warranty_options;
            product_description = description.replace(/\r?\n|\r/g,'');
            var desc = product_description.replace(/\r?\n|\r/g,'<br>');
            amazon_array['Description'] = $.trim(description);
            amazon_array['Specification'] = $.trim(specification);
            amazon_array['Warranty & Returns'] = $.trim(warranty);
            amazon_bulk_array.push(amazon_array);
            document.getElementById("loader").style.display = "none";
            chrome.extension.sendMessage({
                action: 'addinCSV',
                amazon_bulk_array: amazon_bulk_array,
            });
            return false;
        });
    }
});