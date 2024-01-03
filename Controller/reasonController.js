const reason = require('../Model/reasonModel')


exports.addreason = async (req,res) =>{
    try{
   const reasonData =    await reason.create({reason: req.body.reason});
      res.status(200).json({
        data : reasonData,
       message: "  reason Added ", 
       details : reasonData
     })
    }
    catch(err)
    {
        console.log(err);
        res.status(400).send({message: err.message})
    }
}



exports.getreason= async(req,res) => {
    try {
        const data = await reason.find();
        console.log(data);
        res.status(200).json({
            reason : data
        })
        
    }catch(err)
    {
        res.status(400).send({mesage : err.mesage});
    }
}



exports.updatereason = async (req, res ) => {
    try {
       
        const Updatedreason = await reason.findOneAndUpdate({_id: req.params.id}, {
            reason: req.body.reason
        }).exec();
        console.log(Updatedreason);
        res.status(200).json({
            message: "reason Update" 
        })
        
        
    }catch(err)
    {
       console.log(err)
       res.status(401).json({
        mesage: err.mesage
       })
    }
}


exports.Deletereason = async(req,res) => {
    try {
    const id = req.params.id; 
    await reason.deleteOne({_id: id});
    res.status(200).send({message: "reason deleted "})
    }catch(err){
      console.log(err); 
      res.status(400).send({message: err.message})
    }
}