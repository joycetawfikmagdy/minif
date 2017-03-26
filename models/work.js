var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var paginator = require('mongoose-efficient-pagination');
var WorkSchema = mongoose.Schema({
	username: {
		type: String,
		
		
	},
	img: {
		type: String
	}
    ,

    name: {
		type: String
	},

	file: {
		type: String
	},
    
    link: {
		type: String
	} ,    
      
    coco:{
		type: Number}
    
	
}, { collection: 'toto' });


WorkSchema.plugin(mongoosePaginate);



var Work = module.exports = mongoose.model('Work', WorkSchema);


module.exports.createWork = function(username,newWork, callback){
	
	
var c;
Work.count({username: username}, function(err, c) {
         if(c > '1'){
		console.log(c);
		newWork.coco='0';
		console.log("arft");
	}else{

console.log("arf");
		newWork.coco='1';
	}

      });




	newWork.save(callback);
}

module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	Work.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	Work.findById(id, callback);
}