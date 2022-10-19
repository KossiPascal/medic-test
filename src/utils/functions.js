const fs = require("fs");
const csv = require("csv-parser");
const math = require("mathjs");
const path = require("path");


function srcDir(){
  return path.dirname(__dirname);
}



function ask(readline, question) {
  readline.question(question, (answer) => {
    if (`${answer}`.length === 0 || `${answer}`.trim() === "") {
      console.log("you don't provide file name. Try again !\n\n");
      ask(readline, question);
    } else {
      if (answer === "q") {
        console.log("\n\nexit\n");
        process.exit();
      }
      const path = `${srcDir()}/data/${answer}.csv`;
      const outPutPath = `${srcDir()}/data/${answer}_summarized.csv`; //Generate the name of the output file

      genarateFinalFile(path, outPutPath, readline, question);
      // readline.write(`The answer received:  ${answer}\n`)
    }
  });
}

function getRowMap(rowData, isHead = false) {
  if (isHead === true) {
    return ["Debtor,Creditor,Amount"];
  } else {
    return `${rowData.debtor},${rowData.creditor},${rowData.amount}`;
  }
}

//Takes and array and generates another array where each element is a string containing comma-separated values for a row
function extractAsCSV(rowData) {
  const header = getRowMap("", true);
  const rows = rowData.map((md) => getRowMap(md));
  return header.concat(rows).join("\n");
}

//Takes and array and write the summarized data into a new csv file
function writeToCSVFile(rowData, filename) {
  fs.writeFile(filename, extractAsCSV(rowData), (err) => {
    if (err) {
      console.log("Error writing to csv file", err);
    } else {
      console.log(
        `Data is summarized and saved in the folder of this project as ${filename}`
      );
    }
  });
}

async function genarateFinalFile(filePath, outPutFilePath, readline, question) {
  // var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
  // if (regex.test(filePath.toLowerCase())) {  }
  // data.replace(/\s/, '')//delete all blanks

  const allData = [];
  //Check if the file exist, without opening it
  try {
    fs.accessSync(filePath, fs.F_OK);
    fs.createReadStream(filePath)
      // .pipe(parse({ delimiter: ",", from_line: 2 }))
      .pipe(csv())
      .on("data", function (row) {
        // Create an array containing each line of the CSV file
        allData.push({
          debtor: row.Debtor,
          creditor: row.Creditor,
          amount: parseFloat(row.Amount),
        });
        //Compare each element of the array with the followings and add the amount if the 2 names match, then delete any macthing element
        allData.forEach((data) => {
          let getDataIndex = allData.indexOf(data);
          for (let i = ++getDataIndex; i < allData.length; i++) {
            if (
              data.debtor === allData[i].debtor &&
              data.creditor === allData[i].creditor
            ) {
              allData[getDataIndex - 1].amount = math.round(
                data.amount + allData[i].amount,
                2
              );
              allData.splice(i, 1); // Remove any matching element from the initial array
            }
          }
        });
      })
      .on("end", function () {
        //Save summarized data in a new file
        writeToCSVFile(allData, outPutFilePath);
      })
      .on("error", function (error) {
        console.log(error.message);
      });

    readline.close();
  } catch (err) {
    // If the file provided does not exist, return an error
    console.error(`\n\n${err}\n\nError found, try again !\n\n`);
    if (question !== "") {
      ask(readline, question);
    }
  }
}

module.exports = { ask, genarateFinalFile, srcDir };
