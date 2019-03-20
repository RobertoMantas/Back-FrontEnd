const famliesColl = require("../utils/mongoUtils");
var csv = require('fast-csv');
const fs = require('fs');

const initDB = _ => {
    fs.readdir("resources/", (err, files) => {
        if (err) throw err.stack;
        famliesColl.remove();
        files.forEach(fileName => {
            let totalObjects = [];
            csv.fromPath(`resources/${fileName}`, {
                    headers: true,
                    delimiter: ';'
                })
                .transform(data => {
                    return {
                        year: fileName.split(".")[0],
                        country: data['Country'],
                        hScore: data['Happiness Score'],
                        economy: data['Economy (GDP per Capita)'],
                        family: data['Family']
                    }
                })
                .on("data", function (data) {
                    totalObjects.push(data);
                })
                .on("end", function () {
                    saveDB(totalObjects);
                    console.log(`Init DB ${fileName} - ${totalObjects.length} Load: OK `);
                });
            console.log(`Datos completos: ${fileName} - ${totalObjects.length}`);
        });
    });
    console.log("AQUI LOS DATOS");
};

const saveDB = data => {
    famliesColl.insert(data, (err, res) => {
        if (err) throw err.stack;
        console.log("Insert OK");
    });
};

module.exports.initDB = initDB;
module.exports.saveDB = saveDB;