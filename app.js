const express = require('express');
const ejs = require('ejs');
const multer = require('multer');
const path = require('path');
const port = process.env.PORT || 5000;
var app = express();

//Set Storage engine
const storage = multer.diskStorage({
  destination: './public/upload',
  filename: function(req, file, cb){
    cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
})

// Init Upload
const upload = multer({
  storage:storage,
  limits:{fileSize: 1000000},
  filefilter: function(req, file, cb){
    checkfileType(file, cb);
  }
}).single('image');

// set view engine to ejs
app.set('view engine', 'ejs');

//Set Static Folder
app.use(express.static(path.join(__dirname,'/Public')));

app.get('/', (req, res) =>{
    res.render('index');
})

app.post('/upload', (req, res) =>{
  upload(req, res, (err) =>{
    if (err) {
        res.render('index', {
          msg: err
        });
    } else {
      if (req.file == undefined) {
        res.render('index',{
          msg : 'No file Selected'
        })
      } else {
        console.log(req.file)
        res.render('index',{
          msg : 'File Uploaded',
          file: `upload/${req.file.filename}`
        })
      }
    }
  })
})

function checkfileType(file, cb){
  // Allowed Extension
  const filetypes = /jpeg|png|jpg|gif/ ;
  // Check Extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check Mimetype
  const mimetypes = filetypes.test(file.mimetype);

  if (mimetypes && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images only!');
  }
}

app.listen(port, () =>{
  console.log(`server is running at ${port}`);
});
