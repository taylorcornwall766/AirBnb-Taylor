const express = require("express");
const router = express.Router();
const { Spot, User, SpotImage, Review, ReviewImage,Booking, sequelize} = require('../../db/models')
const { Op } = require("sequelize");
const { setTokenCookie, restoreUser, requireAuth } = require("../../utils/auth.js")
router.get('', async (req, res)=> {
    let spots = await Spot.findAll({})
    let spotsArr = []
    spots.forEach((spot)=> spotsArr.push(spot.toJSON()))
    for(let i = 0; i < spotsArr.length; i++){

        let rating = await Review.findAll({
            where:{
                spotId: spotsArr[i].id
            },
            attributes: [
                [sequelize.fn('AVG', sequelize.col('stars')), 'avgRating']
            ]
        })
        spotsArr[i].avgRating = rating[0].dataValues.avgRating

        let preview = await SpotImage.findOne({where:{preview: true, spotId: spotsArr[i].id}})
        if(preview){
            spotsArr[i].previewImage = preview.dataValues.url
        }else{
            spotsArr[i].previewImage = null
        }
    }
    let payload = {spots: spotsArr}
    return res.json(payload)
})

router.get('/:spotId/reviews', async(req, res) =>{
    let reviews = await Review.findAll({
        where:{
            spotId: req.params.spotId
        },
        include:[
            {model: User,
            attributes:{
                exclude:['username','email', 'hashedPassword', 'updatedAt','createdAt' ]
            }},
            {model: ReviewImage,
            attributes:{
                exclude:['createdAt','updatedAt','reviewId']
            }}
        ]
    })
    if(!reviews.length){
        return res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }
    return res.status(200).json({Reviews:reviews})
})

router.get('/current', requireAuth, restoreUser, async(req, res) =>{
    let spots = await Spot.findAll({
        where:{
            id: req.user.id
        }
    })
    if(!spots){
        return res.status(404).json({
            "message": "Current user has no spots!",
            "statusCode": 404
        })
    }
    let spotsArr = []
    spots.forEach((spot)=> spotsArr.push(spot.toJSON()))

    for(let i = 0; i < spotsArr.length; i++){
        spot = spotsArr[i]

        let rating = await Review.findAll({
            where:{
            spotId: spot.id
            },
            attributes: [
            [sequelize.fn('AVG', sequelize.col('stars')), 'avgRating']
            ]
        })
        spot.avgRating = rating[0].dataValues.avgRating

        let previewImage = await SpotImage.findOne({
            where:{
                spotId: spot.id,
                preview: true,
            }
        })
        spot.previewImage = previewImage.dataValues.url
    }

    return res.status(200).json({Spots: spotsArr})
})

router.delete('/:id', requireAuth, restoreUser, async(req, res)=>{
    const currentUser = req.user.id
    let deleteSpot = await Spot.findOne({where:{id: req.params.id}})
    if( !deleteSpot){
        return res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
          })
    }
    if(deleteSpot.ownerId !== currentUser){
        return res.status(404).json({
            "message": "Forbidden",
            "statusCode": 403
          })
    }
    else{
        await Spot.destroy({where:{id: req.params.id}})
        return res.status(200).json({
            "message": "Successfully deleted",
            "statusCode": 200
          })
    }
})

router.get('/:id', async(req, res)=>{
    let spot = await Spot.findOne({
        where:{
            id: req.params.id
        },
        include:[{
            model: SpotImage,
            attributes:{
                exclude:['createdAt', 'updatedAt', 'spotId']
            }
        },{
            model: User,
            attributes:{
                exclude:['hashedPassword', 'createdAt', 'updatedAt', 'username', 'email']
            }
        }
        ]
    })
    if(!spot){
        return res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }
    let spotJSON = spot.toJSON()

    let rating = await Review.findAll({
        where:{
        spotId: spotJSON.id
        },
        attributes: [
        [sequelize.fn('AVG', sequelize.col('stars')), 'avgRating'],
        [sequelize.fn('COUNT', sequelize.col('stars')), 'numRatings']
        ]
    })




    spotJSON.avgStarRating = rating[0].dataValues.avgRating
    spotJSON.numReviews = rating[0].dataValues.numRatings
    spotJSON.Owner = spotJSON.User
    delete spotJSON.User

    return res.status(200).json(spotJSON)
})

router.post('', requireAuth, restoreUser, async(req, res) =>{
    const {user} = req
    const {address, city, state, lat, lng,
           name, description, price, country} = req.body
    let errors = {}
    if(!address){
        errors.address = "Street address is required"
    }
    if(!city){
        errors.city = "City is required"
    }
    if(!state){
        errors.state = "State is required"
    }
    if(!country){
        errors.country = "Country is required"
    }
    if(!lat){
        errors.lat = "Latitude is not valid"
    }
    if(!lng){
        errors.lng = "Longititude is not valid"
    }
    if(!name || name.length>49){
        errors.name = "Name must be less than 50 characters"
    }
    if(!description){
        errors.description = "Description is required"
    }
    if(!price){
        errors.price = "Price per day is required"
    }
    if(Object.keys(errors).length > 0){
        return res.status(400).json({message: "Validation Error", statusCode: 400, errors: errors})
    }else{
        newSpot = await Spot.create({
            ownerId: user.id,
            address:address,
            city:city,
            state:state,
            country: country,
            lat:lat,
            lng:lng,
            name:name,
            description:description,
            price:price
        })

        return res.status(201).json(newSpot)
    }
})

router.put('/:spotId', requireAuth, restoreUser, async(req, res)=>{
    const user = req.user.id
    let spot = await Spot.findOne({where:{id:req.params.spotId}})

    if(!spot ){
        res.status(404).json({
            "message": "Forbidden",
            "statusCode": 403
          })
    }
    if(spot.ownerId !== user){
        res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
          })
    }
    const {address, city, state, lat, lng,
        name, description, price, country} = req.body
 let errors = {}
 if(!address){
     errors.address = "Street address is required"
 }
 if(!city){
     errors.city = "City is required"
 }
 if(!state){
     errors.state = "State is required"
 }
 if(!country){
     errors.country = "Country is required"
 }
 if(!lat){
     errors.lat = "Latitude is not valid"
 }
 if(!lng){
     errors.lng = "Longititude is not valid"
 }
 if(!name || name.length>49){
     errors.name = "Name must be less than 50 characters"
 }
 if(!description){
     errors.description = "Description is required"
 }
 if(!price){
     errors.price = "Price per day is required"
 }
 if(Object.keys(errors).length > 0){
     return res.status(400).json({message: "Validation Error", statusCode: 400, errors: errors})
 }else{
      await spot.update({
         address:address,
         city:city,
         state:state,
         country: country,
         lat:lat,
         lng:lng,
         name:name,
         description:description,
         price:price,
         updatedAt: new Date()
     })
     return res.status(200).json(spot)
 }
})

router.post('/:spotId/reviews', requireAuth, restoreUser, async(req, res) => {
    let spot = await Spot.findOne({where:{id:req.params.spotId}})
    if(!spot) return res.status(404).json({
        "message": "Spot couldn't be found",
        "statusCode": 404
      })
    console.log(req.body)
    console.log(req.body.stars)
    console.log(typeof req.body.stars)
    let {review, stars} = req.body
    let errors = {}
    if(!review){
        errors.review = "Review text is required"
    }
    if(!stars || stars>5 || stars<1){
        errors.stars = "Stars must be an integer from 1 to 5"
    }
    if(Object.keys(errors).length){
        return res.status(400).json({
            "message": "Validation error",
            "statusCode": 400,
            "errors": errors
        })
    }

    newReview = await Review.create({
        review: review,
        stars: stars,
        spotId: req.params.spotId,
        userId: req.user.id,
    })

    return res.status(201).json(newReview)

})

module.exports = router;
