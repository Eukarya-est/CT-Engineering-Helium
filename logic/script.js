// function after event to input file
document.getElementById(`fileInput`).addEventListener('change', function(event) {
    
    const file = event.target.files[0];
    const reader = new FileReader(); // read file
    
    const table = document.getElementById('keys'); // save default table status
    let errorMsg = document.getElementById('error'); // error message area
    let warningMsg = document.getElementById('warning'); // warning message area
    const inputCol = table.querySelectorAll("[id^='col2']"); // select 2nd column
    cleaning(inputCol, errorMsg, warningMsg);

    /* --- extract reference table options ⇒ referOptions --- */
    const referCol = table.querySelectorAll("[id^='col1']"); // select row
    let referOptions = []; // array for reference options
    referOptions = takeOut(referCol, referOptions); //extract
    
    // function after file loaded
    reader.onload = function(event) {
        const content = event.target.result; // save file contents
        
        /* --- extract option keys ⇒ options --- */
        let options = []; // array for current options
        try {
            options = excavate(content, options); // excavate option keys in current contents
        } catch(e) {
            if (e.name == "noKeysExist"){
                warningMsgHandling(e, warningMsg);
            } else {
                ErrorMsgHandling(e, errorMsg);
            }
        };
        
        /* --- compare reference options to current options  --- */
        const inputCol = table.querySelectorAll("[id^='col2']");
        try{
            evaluate(referOptions, options, inputCol);
        } catch(e) {
            if (e.name == "invalidKeyExist"){
                warningMsgHandling(e, warningMsg);
            } else {
                warningMsgHandling(e, warningMsg);
            }
        }
    };

    reader.readAsText(file);

});



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
        
        if (mineral.includes('End Of List') || mineral.includes('Product Software Option Keys') || mineral == '!'){
            valuable = false;
        } else if (valuable && mineral.includes('!')) {
            minecart.push(mineral.replace('!',''));
        } else {
            valuable = true;
        }
    });
    console.log(minecart);
    /* throw error; current option keys does NOT exist */
    if(minecart.length < 1){
        throw{
            name: "noKeysExist",
            message: " !Warning: option Keys does NOT exist. ",
            error: new Error()
        };
    };

    /* Return */
    return minecart;
};

/** 
 * take out option keys from table
 * @method 
 * @param {object} table contents
 * @param {array} storage array
 * @return {array} reference option keys
*/
function takeOut(shelf, articles){
    /* store options extracted */
    for (var i = 0; i < shelf.length; i++){
        articles.push(shelf[i].firstChild.data);
    }
    /* Return */
    return articles
}

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

    /* throw error; invalid option keys exist */
    if(failure.length > 0){
        throw{
            name: "invalidKeyExist",
            key: failure,
            message: " !Warning: Invalid option exist; ",
            error: new Error()
        };
    };
}

/**
 * initialization
 * @method
 * @param {object} table contents
 * @param {object} div (error message area)
 * @param {object} div (warning message area)
*/
function cleaning(table, div, div) {
    /* object initialization */
    wipe(table); // table initiallization
    div.innerHTML = "";
    div.style.visibility = "hidden";

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
}

/** 
 * warning Message Handling
 * @method 
 * @param {string} warning case number
 * @param {object} storage array
 * @param {error} error
*/

function warningMsgHandling(e, div) {
    switch (e.name) {
        case "invalidKeyExist":
            div.innerHTML = e.message;
            div.style.visibility = "visible";
            div.innerHTML += e.key;
            break;
        case "NokeyExist":
            div.innerHTML = " !Warning: option Keys does NOT exist. "
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
        div.innerHTML = " !Error "
        div.style.visibility = "visible"
}
