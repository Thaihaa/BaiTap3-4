var express = require('express');
var router = express.Router();
let categoryModel = require('../schemas/category');
let slugController = require('../controllers/slug');

/* GET users listing. */
router.get('/', async function(req, res, next) {
  
  let categories = await categoryModel.find({});

  res.status(200).send({
    success:true,
    data:categories
  });
});

router.get('/:id', async function(req, res, next) {
  try {
    let id = req.params.id;
    let category = await categoryModel.findById(id);
    res.status(200).send({
      success:true,
      data:category
    });
  } catch (error) {
    res.status(404).send({
      success:false,
      message:"khong co id phu hop"
    });
  }
});

router.post('/', async function(req, res, next) {
  try {
    // Tạo slug từ tên danh mục
    const slug = await slugController.generateCategorySlug(req.body.name);
    
    let newCategory = new categoryModel({
      name: req.body.name,
      slug: slug,
      description: req.body.description || ""
    })
    await newCategory.save();
    res.status(200).send({
      success:true,
      data:newCategory
    });
  } catch (error) {
    res.status(404).send({
      success:false,
      message:error.message
    });
  }
});

// Thêm route PUT để cập nhật danh mục
router.put('/:id', async function(req, res, next) {
  try {
    let updateObj = {};
    let body = req.body;
    
    if(body.name){
      updateObj.name = body.name;
      // Tạo slug mới khi cập nhật tên
      updateObj.slug = await slugController.generateCategorySlug(body.name);
    }
    
    if(body.description){
      updateObj.description = body.description;
    }
    
    let updatedCategory = await categoryModel.findByIdAndUpdate(req.params.id,
      updateObj,
      {new:true})
    
    res.status(200).send({
      success:true,
      data:updatedCategory
    });
  } catch (error) {
    res.status(404).send({
      success:false,
      message:error.message
    });
  }
});

module.exports = router;
