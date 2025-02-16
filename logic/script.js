var required = []; // reqired options array
var exclusive = []; // exclusive options array
var referOptions = []; // reference optons array
var table = document.getElementById('keys'); // store table contents
var referCol = table.querySelectorAll("[id^='col1']"); // select 1st column
/* --- extract reference table options ⇒ referOptions --- */
takeOut();
/* ---==============================--- */

// function after event to select option
document.getElementById(`product`).addEventListener('change', function(event) {
    required = [];
    exclusive = [];

    const product = event.target.value;
        switch(product) {
            case "none":
                break;
            case "mercury":
                required = ["100kVA", "1024 Image Matrix", "3D Dose Modulation", "AntiMalware", "AxialShuttle", "Cardiac SnapShot",
                    "Helical-120-Sec", "High Pitch Helical", "0.4Speed", "Lung Cancer Screening", "Organ Dose Modulation", "Overlap Recon", "64-slice", "Tube7_0MHU"];
                break;
            case "venus":
                required = ["100kVA", "1024 Image Matrix", "3D Dose Modulation", "AntiMalware", "AxialShuttle", "Cardiac SnapShot",
                    "Helical-120-Sec", "High Pitch Helical", "0.4Speed", "Lung Cancer Screening", "Organ Dose Modulation", "Overlap Recon", "64-slice", "Tube7_0MHU"];
                exclusive = ["Overlap Recon", "64-slice"];
                break;
            case "mars":
                break;
        };

    dye(); // add color to reference options according to product

});

// function after event to input file
document.getElementById(`fileInput`).addEventListener('change', function(event) {

    var errorMsg = document.getElementById('error'); // error message area
    var warningMsg = document.getElementById('warning'); // warning message area

    table = document.getElementById('keys'); // store table contents
    const inputCol = table.querySelectorAll("[id^='col2']"); // select 2nd column
    cleaning(inputCol, errorMsg, warningMsg); // initialization
    
    const reader = new FileReader(); // load file reader
    const file = event.target.files[0]; // load file
    /* --- file type validation --- */
    try{
        fileValidate(file);
    } catch(e) {
        ErrorMsgHandling(e, errorMsg);
        throw new Error("Invalid file type");
    }
    /* ---==============================--- */ 
    
    // function after file loaded
    reader.onload = function(event) {
        const contents = event.target.result; // store file contents
        /* --- file contents validation --- */
        try{
            contentsValidate(contents); 
        } catch(e) {
            ErrorMsgHandling(e, errorMsg);
            throw new Error("Invalid file contents");
        }
        /* ---==============================--- */

        /* --- extract option keys ⇒ options --- */
        let options = []; // array for current options
        try {
            options = excavate(contents, options); // excavate option keys in current contents
        } catch(e) {
            if (e.name == "noKeysExist"){
                warningMsgHandling(e, warningMsg);
            } else {
                throw new Error();
            }
        };
        /* ---==============================--- */
        
        /* --- compare reference options to current options  --- */
        const inputCol = table.querySelectorAll("[id^='col2']");
        try{
            evaluate(referOptions, options, inputCol);
        } catch(e) {
            if (e.name == "invalidKeyExist"){
                warningMsgHandling(e, warningMsg);
            } else {
                throw new Error();
            }
        }
        /* ---==============================--- */
    };

    reader.readAsText(file);

});

/** 
 * take out option keys from table
 * @method 
*/
function takeOut() {
    /* store options extracted */
    for (var i = 0; i < referCol.length; i++){
        referOptions.push(referCol[i].firstChild.data);
    }
    /* ---==============================--- */
}

/** 
 * add color to reference options according to product
 * @method 
 * @param {boolean} dye flag
*/
function dye(){
    
        for (var i = 0; i < referOptions.length; i++){   
            referCol[i].style.backgroundColor = "transparent"; 
            referCol[i].style.color = "black";          
            if(required.length > 0){
                var j = 0;
                while (j < required.length) {
                    if(required[j].toLowerCase().includes(referOptions[i].toLowerCase())){
                        referCol[i].style.backgroundColor = "#ffee58";
                        break;
                    };
                    j++; 
                };
            }
            if(exclusive.length > 0){
                var k = 0;
                while (k < exclusive.length) {
                    if(exclusive[k].toLowerCase().includes(referOptions[i].toLowerCase())){
                        referCol[i].style.backgroundColor = "#616161";
                        referCol[i].style.color = "#bdbdbd";
                        break;
                    };
                    k++; 
                };
            };
        };
    /* ---==============================--- */
}


/** 
 * excavate option keys from current option-key text
 * @method 
 * @param {string} option keys file contents
 * @param {array} storage array
 * @return {array} current option keys 
*/
function excavate(mine, minecart) {
    /* remove Title */
    let pickax1;
    let pickax2;
    // case1: diving line exists
    if (mine.includes('-----------------------------')){
        /* remove dividing line */
        pickax1 = mine.split('-----------------------------');
        /* remove CRLF */
        pickax2 = pickax1[1].replace(/\r\n/g,'#!');
    // case2
    } else {
        pickax1 = mine.padStart(mine.length + 1, '!');
        /* remove CRLF */
        pickax2 = pickax1.replace(/\r\n/g,'#!');
    }

    /* remove Consecutive(2 or more) space */
    const pickax3 = pickax2.replace(/\s{2,}/g,'#');
    /* split word */
    const ore = pickax3.split('#');
    /* store options excavated */
    let valuable = true;
    ore.forEach((mineral) =>  {
        if (mineral.includes('End Of List')){
            valuable = false;
        } else if (mineral.includes('Product Software Option Keys') || mineral == '!' || mineral == ''){
            valuable = true;
        } else if (valuable && mineral.includes('!')) {
            minecart.push(mineral.replace('!',''));
        } else {
            valuable = true;
        };
    });
    /* ---==============================--- */
    /* throw error; current option keys does NOT exist */
    if(minecart.length < 1){
        throw{
            name: "noKeysExist",
            message: " !Warning: option Keys does NOT exist. ",
            error: new Error()
        };
    };
    /* ---==============================--- */

    /* Return */
    return minecart;
};

/**
 * arrange data to table
 * @method
 * @param {array} reference option keys
 * @param {array} current option keys
 * @param {array} second column
*/
function evaluate(articles, ore ,dish) {
    let failure = [];
    /* input data to cell */
    for(var i = 0; i < ore.length; i++) {
        var j = 0;
        while (j < articles.length) {
            if(articles[j].toLowerCase().includes(ore[i].toLowerCase())){
                dish[j].innerHTML = ore[i];
                break;
            };
            j++; 
            if(j == articles.length){
                failure.push(ore[i]);
            };
        };
    };
    /* ---==============================--- */

    /* throw error; invalid option keys exist */
    if(failure.length > 0){
        throw{
            name: "invalidKeyExist",
            key: failure,
            message: " !Warning: Invalid option exist; ",
            error: new Error()
        };
    };
    /* ---==============================--- */
}

/**
 * initialization
 * @method
 * @param {object} table contents
 * @param {object} error message area
 * @param {object} (warning message area
*/
function cleaning(table, error, warn) {
    /* object initialization */
    wipe(table); // table initiallization
    error.innerHTML = "";
    error.style.visibility = "hidden";
    warn.innerHTML = "";
    warn.style.visibility = "hidden";
    /* ---==============================--- */
}

/**
 * reference option table initialization
 * @method
 * @param {object} table contents
*/
function wipe(table) {
    /* input data to cell */
    for(var i = 0; i < table.length; i++) {
        table[i].innerHTML = "";
    };
    /* ---==============================--- */
}

/**
 * reference option table initialization
 * @method
 * @param {object} file
*/
function fileValidate(file) {

    /* file type is not text */
    if(file.type != "text/plain"){
        throw{
            message: " !Error: Invalid file type",
            error: new Error()
        }
    };
    /* ---==============================--- */
}

/**
 * reference option table initialization
 * @method
 * @param {object} file contents
*/
function contentsValidate(contents) {
    let sample = contents.substring(0, 100);
    const regExp = new RegExp(/^[a-zA-Z0-9\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"\n\r\s+]+/g);
        if(!regExp.test(sample)){
            throw{
                message: " !Error: Invalid file contents",
                error: new Error()
            }
        };
    /* ---==============================--- */
}

/** 
 * warning Message Handling
 * @method 
 * @param {string} warning case number
 * @param {object} storage array
 * @param {error} error
*/
function warningMsgHandling(e, div) {
    switch(e.name) {
        case "invalidKeyExist":
            div.innerHTML = e.message;
            div.style.visibility = "visible";
            div.innerHTML += e.key;
            break;
        case "noKeysExist":
            div.innerHTML = e.message;
            div.style.visibility = "visible";
            break;
        default:
            div.innerHTML = " !Warning "
    }
}

/** 
 * error Message Handling
 * @method 
 * @param {string} warning case number
 * @param {object} storage array
 * @param {error} error
*/
function ErrorMsgHandling(e, div) {
        div.innerHTML = e.message;
        div.style.visibility = "visible";
}
