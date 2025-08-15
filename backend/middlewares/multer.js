import multer from "multer"

const storage = multer.diskStorage({
// If you don’t set a destination, Multer uses the default, which is os.tmpdir() (the system temp folder).

// If you want to control where files are stored (e.g., inside ./public/temp), you must specify the destination property.
// so the code will work fine if we don't write teh destination code but its recommended practice to add the destination 

    destination: function(req,file,callback){
        callback(null,"./public/temp")
    },

    filename:function(req,file,callback){
callback(null,file.originalname)
    }
})

const upload = multer({storage})

export default upload