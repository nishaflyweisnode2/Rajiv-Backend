const cancel = require('../Model/cancelModel')


exports.addcancel= async (req,res) =>{
    try{
   const cancelData =    await cancel.create({cancel: req.body.cancel});
      res.status(200).json({
        data : cancelData,
       message: "  cancel Added ", 
       details : cancelData
     })
    }
    catch(err)
    {
        console.log(err);
        res.status(400).send({message: err.message})
    }
}



exports.getcancel= async(req,res) => {
    try {
        const data = await cancel.find();
        console.log(data);
        res.status(200).json({
            cancel : data
        })
        
    }catch(err)
    {
        res.status(400).send({mesage : err.mesage});
    }
}



exports.updatecancel= async (req, res ) => {
    try {
       
        const Updatedcancel= await cancel.findOneAndUpdate({_id: req.params.id}, {
            cancel: req.body.cancel
        }).exec();
        console.log(Updatedcancel);
        res.status(200).json({
            message: "cancel Update" 
        })
        
        
    }catch(err)
    {
       console.log(err)
       res.status(401).json({
        mesage: err.mesage
       })
    }
}


exports.Deletecancel = async(req,res) => {
    try {
    const id = req.params.id; 
    await cancel.deleteOne({_id: id});
    res.status(200).send({message: "cancel deleted "})
    }catch(err){
      console.log(err); 
      res.status(400).send({message: err.message})
    }
}