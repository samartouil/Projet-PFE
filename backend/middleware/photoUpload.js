const path = require("path");
//yaml upload lel tsawer
const multer = require("multer");


// Photo Storage
const photoStorage = multer.diskStorage({
    destination: function (req,file,cb){
        //1param: null yani famech error message,2param: win theb tsajel el tsawer
        //path mel nodejs
        //dirname tjib el masar lkol mta el project 
        cb(null, path.join(__dirname, "../images"));
    },
    filename: function (req, file,cb){
        if (file){
            //new date, thawelha l string, tbadel el : b - khater windows ye9belch :
            cb(null, new Date().toISOString().replace(/:/g,"-") + file.originalname)
        } else{
            cb(null,false);
        }
    },

});


//photo Upload Middlewaare
const photoUpload = multer({
    storage: photoStorage,
    fileFilter: function(req,file,cb){
        if(file.mimetype.startsWith("image")){
            cb(null,true);
        }else {
            cb({message: "format incorrect"}, false);
        }
    },
    limits: { fileSize: 1024*1024 } //1 megabyte
});

module.exports = photoUpload ;