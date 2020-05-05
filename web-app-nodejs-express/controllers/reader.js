// Controller to read the useful informations for updating the views
var file = "public/assets/players.csv";
var fs = require('fs');

try {
    // read contents of the file
    const data = fs.readFileSync(file, 'UTF-8');

    // split the contents by new line
    const lines = data.split(/\r?\n/);

    // Assign to contents all the characteristics to show in the dropwdown
    var contents = lines[0];
    contents = contents.split(",");
    contents = contents.slice(21, contents.length - 2)

    // Array containing the name of every player
    var playerNames = [];
    for (var i = 1; i < lines.length; i++) {
        lines[i] = lines[i].split(",");
        var name, surname, completeName;
        // surname = lastName
        surname = lines[i][0];
        // name = firstName
        name = lines[i][1];
        // The complete name is just the concatenation
        completeName = name + " " + surname;

        // Append the complete name
        playerNames.push(completeName);
    }

} catch (err) {
    console.error(err);
}

// Export the skills name for the selection 
exports.contents = contents;
// Export the player names for the selection 
exports.playerNames = playerNames;