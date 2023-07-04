const mongoose = require('mongoose');
var URLSlugs = require('mongoose-url-slugs');
const projectSchema = new mongoose.Schema({
    title : {
        required : true,
        type : String
    },
    description : {
        required : true,
        type : String
    },
    author : {
        required : true,
        type : String
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    
    issues: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Issue'
    }]
},{timestamps:true})
projectSchema.plugin(URLSlugs('title'));
module.exports  = mongoose.model('Project',projectSchema);