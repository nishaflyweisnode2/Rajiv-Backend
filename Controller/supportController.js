const support = require('../Model/supportModel')


exports.addsupport = async (req,res) =>{
    try{
   const supportData =    await support.create({title: req.body.title,description: req.body.description,contact: req.body.contact});
      res.status(200).json({
        data :supportData,
       message: "  support Added ", 
       details : supportData
     })
    }
    catch(err)
    {
        console.log(err);
        res.status(400).send({message: err.message})
    }
}



exports.getsupport = async(req,res) => {
    try {
        const data = await support.find();
        console.log(data);
        res.status(200).json({
            support : data
        })
        
    }catch(err)
    {
        res.status(400).send({mesage : err.mesage});
    }
}



exports.updatesupport = async (req, res ) => {
    try {
       
        const Updatedsupport = await support.findOneAndUpdate({_id: req.params.id}, {
            title: req.body.title,description: req.body.description,contact: req.body.contact
        }).exec();
        console.log(Updatedsupport);
        res.status(200).json({
            message: "support Update" 
        })
        
        
    }catch(err)
    {
       console.log(err)
       res.status(401).json({
        mesage: err.mesage
       })
    }
}


exports.Deletesupport = async(req,res) => {
    try {
    const id = req.params.id; 
    await support.deleteOne({_id: id});
    res.status(200).send({message: "support deleted "})
    }catch(err){
      console.log(err); 
      res.status(400).send({message: err.message})
    }
}