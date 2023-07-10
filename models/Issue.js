const mongoose = require('mongoose');
var URLSlugs = require('mongoose-url-slugs');
const issueSchema = new mongoose.Schema({
    title : {
        required : true,
        type : String
    },
    description : {
        required : true,
        type : String
    },
    status : {
        required : true,
        type : String,
        default : 'PENDING',
        enum : ['PENDING','RESOLVED','REJECTED']
    },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    
},{timestamps:true})
issueSchema.plugin(URLSlugs('title'));
module.exports  = mongoose.model('Issue',issueSchema);