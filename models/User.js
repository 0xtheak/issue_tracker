const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name : {
        required : true,
        type : String
    },
    email : {
        required : true,
        unique : true,
        type : String
    },
    password : {
        required : true,
        type : String
    },
    status : {
        required : true,
        default : false,
        type : Boolean
    },
    projects: [{
        project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
        issues: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Issue'
        }]
    }],
},{timestamps:true})

module.exports  = mongoose.model('User',userSchema);