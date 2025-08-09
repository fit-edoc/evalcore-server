const mongoose = require("mongoose")
const Color = require("colors")

const serverColor = Color.italic.yellow


 const dbConnect = ()=>{


    try {

        mongoose.connect(process.env.MONGO_URL)

        console.log(serverColor("database has been connected"))
        
    } catch (error) {
        
    }
}



module.exports = dbConnect