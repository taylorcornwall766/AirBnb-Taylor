const express = require("express");
const router = express.Router();
const { Spot, User, SpotImage, Review, ReviewImage,Booking, sequelize} = require('../../db/models')
const { Op } = require("sequelize");
const { setTokenCookie, restoreUser, requireAuth } = require("../../utils/auth.js")

router.get('/current', requireAuth, restoreUser, async(req, res)=> {
    let reviews = await Review.findAll({
        where:{
            userId: req.user.id
        },
        include:[
            {model: User,
            attributes:{
                exclude:['username','email', 'hashedPassword', 'updatedAt','createdAt' ]
            }
            },
            {model: Spot,
            attributes:{
                exclude:['updatedAt','createdAt']
            }
            },
            {model: ReviewImage,
            attributes:{
                exclude:['createdAt','updatedAt','reviewId']
            }}
        ]
    })
    // console.log(reviews)
    let reviewsArr = []
    for(let i = 0; i < reviews.length; i++){reviewsArr.push(reviews[i].toJSON())}

    for(let i = 0; i < reviewsArr.length; i++){
        let spotId = reviewsArr[i].Spot.id
        let previewImageQuery = await SpotImage.findOne({where:{spotId: spotId, preview: true}})
        if(previewImageQuery){
            console.log(spotId)
            reviewsArr[i].Spot.previewImage = previewImageQuery.url
        }else{
            reviewsArr[i].Spot.previewImage = null
        }
    }

    return res.status(200).json({Reviews: reviewsArr})
})

module.exports = router
