
// function after event to input file
document.getElementById(`fileInput`).addEventListener('change', function(event) {
    const file = event.target.files[0];
    const reader = new FileReader(); // read file
    const table = document.getElementById('keys'); // save default table status
    const inputCol = table.querySelectorAll("[id^='col2']"); // select 2nd column
    cleaning(inputCol); // table initiallization
    
    /* --- extract reference table options ⇒ referOptions --- */
    const referCol = table.querySelectorAll("[id^='col1']"); // select row
    let referOptions = []; // array for reference options
    referOptions = takeOut(referCol, referOptions) //extract
    /* ------------------------------ */
    
    // function after file loaded
    reader.onload = function(event) {
        const content = event.target.result; // save file contents
        
        /* --- extract option keys ⇒ options --- */
        let options = []; // array for current options
        options = excavate(content, options); // excavate option keys in current contents
        /* ------------------------------ */
        
        /* --- compare reference options to current options  --- */
        const inputCol = table.querySelectorAll("[id^='col2']");
        arrange(referOptions, options, inputCol);
        /* ------------------------------ */
    };

    reader.readAsText(file);

});

/** 
 * Excavate option keys from current option-key text
 * @method 
 * @param {string} text file contents
 * @param {array} storage array
 * @return {array} options keys 
*/
function excavate(mine, minecart) {
    /* Remove Title */
    const pickax1 = mine.split('-----------------------------');
    /* Remove CRLF */
    const pickax2 = pickax1[1].replace(/\r\n/g,'!');
    /* Remove Consecutive(2 or more) space */
    const pickax3 = pickax2.replace(/\s{2,}/g,'#');
    /* Split word */
    const ore = pickax3.split('#');
    /* store options excavated */
    let valuable = true;

    ore.forEach((mineral) =>  {
        if (mineral.includes('End Of List')){
            valuable = false;
        } else if (valuable && mineral.includes('!')) {
            minecart.push(mineral.replace('!',''));
        } else {
            valuable = true;
        }
    });
    /* Return */
    return minecart;
};

/** 
 * take out option keys from table
 * @method 
 * @param {object} table contents
 * @param {array} storage array
 * @return {array} extracted data
*/
function takeOut(showcase, articles){
    /* store options extracted */
    for (var i = 0; i < showcase.length; i++){
        articles.push(showcase[i].firstChild.data);
    }
    /* Return */
    return articles
}

/**
 * arrange data to table
 * @method
 * @param {array} reference options
 * @param {array} current options
 * @param {array} second columns data
*/
function arrange(articles, ore ,col) {
    /* input data to cell */
    for(var i = 0; i < ore.length; i++) {
        var j = 0;
        while (j < articles.length) {
            console.log(ore[i], articles[j]);
            if(articles[j].toLowerCase().includes(ore[i].toLowerCase())){
                col[j].innerHTML = ore[i];
                break;
            }
            j++; 
        };
    };
}

/**
 * cleaning reference option table
 * @method
 * @param {object} table contents
*/
function cleaning(stand) {
    /* input data to cell */
    for(var i = 0; i < stand.length; i++) {
        stand[i].innerHTML = "";
    };
}

