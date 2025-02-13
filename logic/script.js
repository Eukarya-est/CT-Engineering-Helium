document.getElementById(`fileInput`).addEventListener('change', function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    const init_table = "<tr><th>Current</th></tr>";

    reader.onload = function(event) {
        const content = event.target.result;
        const lines = listUp(content);
        let options = [];
        let extractingOptions = true;

        lines.forEach((line) =>  {
            if (line.includes('End Of List')){
                extractingOptions = false;
            } else if (extractingOptions && line.includes('!')) {
                options.push(line.replace("!",''));
            } else {
                extractingOptions = true;
            }
        });  

        const tableContainer = document.getElementById('tableContainer');
        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        options.forEach((option) => {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.textContent = option;
            row.appendChild(cell);
            tbody.appendChild(row);
        });

        table.appendChild(thead);
        table.appendChild(tbody);
        tableContainer.innerHTML = init_table;
        tableContainer.appendChild(table);

    };

    reader.readAsText(file);

});

/* Extract optionkey list from current option text */
function listUp (text) {
    /* Remove Title */
    const parse1 = text.split("-----------------------------");
    /* Remove CRLF */
    const parse2 = parse1[1].replace(/\n/g,"!");
    /* Remove Consecutive space */
    const parse3 = parse2.replace(/\s{2,}/g,"#");
    /* Split word */
    const parse4 = parse3.split("#");
    return parse4;
};