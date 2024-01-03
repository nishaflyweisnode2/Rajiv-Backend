const city = require('../Model/cityModel')


exports.addcity = async (req,res) =>{
    try{
   const cityData =    await city.create({city: req.body.city});
      res.status(200).json({
        data : cityData,
       message: "  city Added ", 
       details : cityData
     })
    }
    catch(err)
    {
        console.log(err);
        res.status(400).send({message: err.message})
    }
}



exports.getcity = async(req,res) => {
    try {
        const data = await city.find();
        console.log(data);
        res.status(200).json({
            city : data
        })
        
    }catch(err)
    {
        res.status(400).send({mesage : err.mesage});
    }
}



exports.updatecity = async (req, res ) => {
    try {
       
        const Updatedcity = await city.findOneAndUpdate({_id: req.params.id}, {
            city: req.body.city
        }).exec();
        console.log(Updatedcity);
        res.status(200).json({
            message: "city Update" 
        })
        
        
    }catch(err)
    {
       console.log(err)
       res.status(401).json({
        mesage: err.mesage
       })
    }
}


exports.Deletecity = async(req,res) => {
    try {
    const id = req.params.id; 
    await city.deleteOne({_id: id});
    res.status(200).send({message: "city deleted "})
    }catch(err){
      console.log(err); 
      res.status(400).send({message: err.message})
    }
}