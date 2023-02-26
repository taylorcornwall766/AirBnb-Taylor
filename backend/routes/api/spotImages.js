const express = require("express");
const router = express.Router();
const { Spot, User, SpotImage, Review, ReviewImage,Booking, sequelize} = require('../../db/models')
const { Op } = require("sequelize");
const { setTokenCookie, restoreUser, requireAuth } = require("../../utils/auth.js")

router.delete("/:imageId", requireAuth, restoreUser, async (req, res) =>{
    let deleteImage = await SpotImage.findOne({where:{id:req.params.imageId}})
    if(!deleteImage){
        return res.status(404).json({
            "message": "Spot Image couldn't be found",
            "statusCode": 404
        })
    }
    let deleteImageJSON = deleteImage.toJSON()
    // let currentUser = req.user.id
    if(deleteImageJSON.userId !== req.user.id){
        return res.status(403).json({
            message: "Forbidden",
            statusCode: 403
        })
    }

    await SpotImage.destroy({where:{id: req.params.imageId}})
    return res.status(200).json({
        message: "Successfully deleted",
        statusCode: 200
    })
})





module.exports = router
