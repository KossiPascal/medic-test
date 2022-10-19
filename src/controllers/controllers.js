
const fs = require('fs');
const { genarateFinalFile, srcDir } = require('../utils/functions');
const formidable = require('formidable');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});



const generateSummarizedFile = async (req, res, next) => {
  var form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields, files) {
    // if (err) throw err
    if (err) {
      console.log(err);
      return;
    }

    // res.end("Contact Admin - Not Working\n");

    var filepath = files.filetoupload.filepath;
    var fileName = files.filetoupload.originalFilename; // input.csv
    const outPutPath = `${srcDir()}/data/${fileName.split(".")[0]}_summarized.csv`; //Generate the name of the output file
    var fileType = files.filetoupload.mimetype; // 'text/csv'

    if (fileType === "text/csv") {
      genarateFinalFile(filepath, outPutPath, rl, "").then((v) => {
        fs.readFile(filepath, "utf8", function (err, data) {
          // if (err) throw err;
          if (err) {
            console.log(err);
            return;
          }
          const file = `${outPutPath}`;
          res.download(file);
        });
      });
    }
  });
};

const showHtmlPage = async (req, res, next) => {

};




module.exports = { showHtmlPage, generateSummarizedFile };
