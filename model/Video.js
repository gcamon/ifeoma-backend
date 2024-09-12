'use strict';

const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var VideoSchema = new Schema ({
    title: {
      type: String,
      default: ""
    },

    videoId: {
        type: String,
        default: ""
    },  

    filename: {
      type: String,
      default: ""
    },

    size: {
        type: Number,
        default: 0
    },
    
    deleted: {
        type: Boolean,
        default: false
    },   

},{ timestamps: true })


mongoose.model('Video', VideoSchema);