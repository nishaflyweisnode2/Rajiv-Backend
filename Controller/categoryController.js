const category = require('../Model/categoryModel')


exports.addcategory = async (req,res) =>{
    try{
   const categoryData =    await category.create({category: req.body.category});
      res.status(200).json({
        data : categoryData,
       message: "  category Added ", 
       details : categoryData
     })
    }
    catch(err)
    {
        console.log(err);
        res.status(400).send({message: err.message})
    }
}



exports.getcategory = async(req,res) => {
    try {
        const data = await category.find();
        console.log(data);
        res.status(200).json({
            category : data
        })
        
    }catch(err)
    {
        res.status(400).send({mesage : err.mesage});
    }
}



exports.updatecategory = async (req, res ) => {
    try {
       
        const Updatedcategory = await category.findOneAndUpdate({_id: req.params.id}, {
            category: req.body.category
        }).exec();
        console.log(Updatedcategory);
        res.status(200).json({
            message: "category Update" 
        })
        
        
    }catch(err)
    {
       console.log(err)
       res.status(401).json({
        mesage: err.mesage
       })
    }
}


exports.Deletecategory = async(req,res) => {
    try {
    const id = req.params.id; 
    await category.deleteOne({_id: id});
    res.status(200).send({message: "category deleted "})
    }catch(err){
      console.log(err); 
      res.status(400).send({message: err.message})
    }
}