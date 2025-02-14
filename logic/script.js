
// function after event to input file
document.getElementById(`fileInput`).addEventListener('change', function(event) {
    const file = event.target.files[0];
    const reader = new FileReader(); // read file
    const table_default = document.getElementById('keys'); // save default table status
    
    /* --- extract reference table options ⇒ refer_options --- */
    const refer_cell = table_default.querySelectorAll("[id^='col1']"); // select row
    let refer_options = []; // array for reference options
    refer_options = extract(refer_cell, refer_options) //extract
    /* ------------------------------ */
    
    // function after file loaded
    reader.onload = function(event) {
        const content = event.target.result; // save file contents
        
        /* --- extract option keys ⇒ options --- */
        let options = []; // array for current options
        options = excavate(content, options); // excavate option keys in current contents
        /* ------------------------------ */
        
        /* --- compare reference options to current options  --- */
        const table = document.getElementById('keys');
        const input_cell = table.querySelectorAll("[id^='col2']");
        arrange(refer_options, options, input_cell);
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
function excavate(text, array) {
    /* Remove Title */
    const inter1 = text.split('-----------------------------');
    /* Remove CRLF */
    const inter2 = inter1[1].replace(/\n/g,'!');
    /* Remove Consecutive(2 or more) space */
    const inter3 = inter2.replace(/\s{2,}/g,'#');
    /* Split word */
    const refining = inter3.split('#');
    /* store options excavated */
    let extractingOptions = true;

    refining.forEach((element) =>  {
        if (element.includes('End Of List')){
            extractingOptions = false;
        } else if (extractingOptions && element.includes('!')) {
            array.push(element.replace('!',''));
        } else {
            extractingOptions = true;
        }
    });
    /* Return */
    return array;
};

/** 
 * extract option keys from table
 * @method 
 * @param {object} table contents
 * @param {array} storage array
 * @return {array} extracted data
*/
function extract(cell, array){
    /* store options extracted */
    for (var i = 0; i < cell.length; i++){
        array.push(cell[i].firstChild.data);
    }
    /* Return */
    return array
}

/**
 * extract option keys from table
 * @method
 * @param {array} reference options
 * @param {array} current options
 * @param {array} cell
*/
function arrange(refer, current ,cell) {
    /* input data to cell */
    for(var i = 0; i < current.length; i++) {
        console.log(current[i]);
        for (var j = 0; j < refer.length; j++) {
            if(current[i] == refer[j]){
                cell[j].innerHTML = current[i];
            } 
        };
    };
}
