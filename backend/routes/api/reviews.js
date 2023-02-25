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

router.post('/:reviewId/images', requireAuth, restoreUser, async(req, res)=> {
    let review = Review.findOne({where:{id: req.params.reviewId}})
    if(!review){
        return res.status(404).json({
            message: "Review couldn't be found",
            statusCode: 404
        })
    }
    let postedImages = ReviewImage.findAll({where:{reviewId: req.params.reviewId}})
    let {url} = req.body
    if(!url){
        res.status(403).json({
            "message": "Please provide an image url",
            "statusCode": 403
        })
    }
    if(postedImages.length >= 10){
        return res.status(403).json({
            "message": "Maximum number of images for this resource was reached",
            "statusCode": 403
        })
    }

    newReviewImage = await ReviewImage.create({
        reviewId: req.params.reviewId,
        url: url,
        userId: req.user.id,
        spotId: req.params.spotId
    })

    newReviewImageJSON = newReviewImage.toJSON()
    delete newReviewImageJSON.createdAt
    delete newReviewImageJSON.updatedAt
    delete newReviewImageJSON.reviewId
    return res.status(201).json(newReviewImageJSON)
})
module.exports = router
