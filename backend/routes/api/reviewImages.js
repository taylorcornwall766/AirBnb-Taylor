const express = require("express");
const router = express.Router();
const { Spot, User, SpotImage, Review, ReviewImage,Booking, sequelize} = require('../../db/models')
const { Op } = require("sequelize");
const { setTokenCookie, restoreUser, requireAuth } = require("../../utils/auth.js")

router.delete("/:imageId", requireAuth, restoreUser, async (req, res) =>{
    let deleteImage = await ReviewImage.findOne({where:{id:req.params.imageId}})
    if(!deleteImage){
        return res.status(404).json({
            "message": "Spot Image couldn't be found",
            "statusCode": 404
        })
    }
    let deleteImageJSON = deleteImage.toJSON()
    let review = await Review.findOne({where:{id:deleteImageJSON.reviewId}})
    // let currentUser = req.user.id
    if(review.userId !== req.user.id){
        // console.log(review.toJSON())
        return res.status(403).json({
            message: "Forbidden",
            statusCode: 403
        })
    }

    await ReviewImage.destroy({where:{id: req.params.imageId}})
    return res.status(200).json({
        message: "Successfully deleted",
        statusCode: 200
    })
})





module.exports = router
