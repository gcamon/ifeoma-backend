const express = require('express');
const fs = require('fs');

const mongoose = require('mongoose');

const config = require('./config');

require('./model/Video');

const dotenv = require('dotenv');
dotenv.config();

const app = express();

config(app)

mongoose.connect(process.env.MONGO_URL, 
{
    // useNewUrlParser: true, 
    // useUnifiedTopology: true,
    //useCreateIndex: true
})
.then(() => console.log("database cluster connected successfully!"))
.catch((err) => console.log(err))


app.listen(3001, () => {
    console.log('Server listening on port 3001')
})

const Video = mongoose.model('Video')


app.get('/videos/:id', async (req, res) => {
    try {    
        const id = req.params.id;        
        const {filename} = await Video.findById(id);
        //const filename = req.params.filename;
        const filePath = `videos/${filename}`;
        const stat = fs.statSync((filePath))
        const fileSize = stat.size;
        const range = req.headers.range;

        if(range) {
            const replaceStr = range.replace(/bytes=/,'')
            const parts = replaceStr.split('-');
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
            
            const chunksize = end - start  + 1;
            const file  = fs.createReadStream(filePath, {start, end});

            const head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'video/mp4'
            }

            res.writeHead(206, head);
            file.pipe(res);

        } else {
            const head = {
                'Content-Length': fileSize,
                'Content-Type': 'video/mp4',
            };
            res.writeHead(200, head);
            fs.createReadStream(filePath).pipe(res);
        }

    } catch (err) {
        console.log(err);
        res.status(500).json({status: false, message: "Server error occured"}) 
    }
})

app.get('/videos', async (req, res) => {
    try {
        const videos = await Video.find();
        res.status(200).json(videos);
    } catch(err) {
        res.status(500).json({status: false, message: "Server error occured"})
    }
})

app.post('/videos', async (req, res) => {    
    try {
        req.body.videoId = genHash(8);
        req.body.title = req.body.caption;
        req.body.filename = req.files[0].filename;
        req.body.size = req.files[0].size;        
        const newVideo = new Video(req.body)
        const saveVideo = await newVideo.save();
        res.status(200).json(saveVideo);
    } catch(err) {
        console.log(err)
        res.status(500).json({status: false, message: "Server error occured"})
    }
})


function genHash(count) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ01234567899966600555777222abcdefghijklmnopqrstuvwxyz";

    for( var i=0; i < count; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}
  