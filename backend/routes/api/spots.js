const express = require("express");
const router = express.Router();
const { Spot, User, SpotImage, Review, ReviewImage,Booking, sequelize} = require('../../db/models')
const { Op } = require("sequelize");
const { setTokenCookie, restoreUser, requireAuth } = require("../../utils/auth.js");
const e = require("express");
router.get('', async (req, res)=> {
    let where = {}
    let {page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice} = req.query
    let errors = {}
    if(!page || Number(page) > 10){
        page = 1
    }
    if(!size || Number(size) > 20){
        size = 20
    }
    if(page && Number(page) < 1){
        errors.page = "Page must be greater than or equal to 1"
    }
    if(size && Number(size) < 1){
        errors.size = "Size must be greater than or equal to 1"
    }
    if(minPrice && Number(minPrice) < 0){
        errors.minPrice = "Minimum price must be greater than or equal to 0"
    }
    if(maxPrice && Number(maxPrice) < 0){
        errors.maxPrice = "Maximum price must be greater than or equal to 0"
    }
    if(page && Number(page) < 1){
        errors.page = "Page must be greater than or equal to 1"
    }
    if(size && Number(size) < 1){
        errors.size = "Size must be greater than or equal to 1"
    }
    if(maxLat && Number(maxLat) > 90 || Number(maxLat) < -90){
        errors.maxLat = "Maximum latitude is invalid"
    }
    if(minLat && Number(minLat) > 90 || Number(minLat) < -90){
        errors.minLat = "Minimum latitude is invalid"
    }
    if(maxLng && Number(maxLng) > 180 || Number(maxLng) < -180){
        errors.maxLng = "Maximum longitude is invalid"
    }
    if(minLng && Number(minLng) > 180 || Number(minLng) < -180){
        errors.minLng = "Minimum longitude is invalid"
    }
    if(Object.keys(errors).length){
        return res.status(400).json({
            "message": "Validation Error",
            "statusCode": 400,
            "errors": errors
        })
    }
    let query = {}
    query.limit = size
    query.offset = size * (page-1)

    if(minLat && maxLat){
        where.lat = {
             [Op.gte]: Number(minLat),
             [Op.lte]: Number(maxLat)
        }
    }
    else if(minLat && !maxLat){
        where.lat = {
            [Op.gte]: Number(minLat)
        }
    }
    else if(!minLat && maxLat){
        where.lat = {
            [Op.lte]: Number(maxLat)
        }
    }


    if(minLng && maxLng){
        where.lng = {
             [Op.gte]: Number(minLng),
             [Op.lte]: Number(maxLng)
        }
    }
    else if(minLng && !maxLng){
        where.lng = {
            [Op.gte]: Number(minLng)
        }
    }
    else if(!minLng && maxLng){
        where.lng = {
            [Op.lte]: Number(maxLng)
        }
    }


    if(minPrice && maxPrice){
        where.price = {
             [Op.gte]: Number(minPrice),
             [Op.lte]: Number(maxPrice)
        }
    }
    else if(minPrice && !maxPrice){
        where.price = {
            [Op.gte]: Number(minPrice)
        }
    }
    else if(!minPrice && maxPrice){
        where.price = {
            [Op.lte]: Number(maxPrice)
        }
    }


    let spots = await Spot.findAll({where,limit:query.limit, offset:query.offset})
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
    let payload = {spots: spotsArr, page: page, size: size}
    return res.json(payload)
})

router.post('/:spotId/images', requireAuth, restoreUser, async(req, res) =>{
    let spot = await Spot.findOne({where:{id:req.params.spotId}})
    if(!spot){
        return res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
          })
    }
    if(spot.ownerId !== req.user.id){
        return res.status(404).json({
            "message": "Forbidden",
            "statusCode": 403
          })
    }
    let {url, preview} = req.body
    let errors = {}
    if(!url){
        errors.url = "URL REQUIRED"
    }
    if(preview === undefined || preview === null){
        errors.preview = "PREVIEW REQUIRED"
    }
    if(Object.keys(errors).length){
        return res.status(400).json({ERRORS:errors})
    }

    let newSpotImage = await SpotImage.create({
        spotId: req.params.spotId,
        url: url,
        preview: preview
    })


    let newSpotImageJSON = newSpotImage.toJSON()
    delete newSpotImageJSON.createdAt
    delete newSpotImageJSON.updatedAt
    delete newSpotImageJSON.spotId
    return res.status(201).json(newSpotImageJSON)
})


router.post('/:spotId/bookings', requireAuth, restoreUser, async(req,res)=>{
    let spot = await Spot.findOne({where:{id:req.params.spotId}})
    if(!spot){
        return res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
          })
    }
    let spotJSON = spot.toJSON()
    // if(spotJSON.ownerId === req.user.id){
    //     return res.status(404).json({
    //         "message": "Forbidden, Cannot book your own spot",
    //         "statusCode": 400
    //     })
    // }

    let {startDate, endDate} = req.body
    let errors = {}
    if(!startDate){
        errors.startDate = "please provide a valid startDate"
    }
    if(!endDate){
        errors.endDate = "please provide a valid endDate"
    }
    if(Object.keys(errors).length){
        return res.status(400).json({"message": "Validation Error",
    statusCode: 400, errors: errors})
    }
    let bookings = await Booking.findAll({where:{spotId:req.params.spotId}})
    let bookingsArr = []

    let startDateDate = new Date(startDate)
    let endDateDate = new Date(endDate)
    let todayDate = new Date()
    if(startDateDate >= endDateDate){
        errors.endDate = "endDate cannot be on or before startDate"
    }
    if(startDateDate <= todayDate){
        errors.startDate = "startDate must be at a date in the future"
    }
    if(Object.keys(errors).length){
        return res.status(400).json({"message": "Validation Error",
    statusCode: 400, errors: errors})
    }
   for(let i = 0; i < bookings.length; i++){
        bookingsArr.push(bookings[i].toJSON())
    }


    for(let i = 0; i < bookingsArr.length; i++){
        let booking = bookingsArr[i]
        let bookStart = new Date(booking.startDate)
        let bookEnd = new Date(booking.endDate)

        if(bookStart.getTime() === startDateDate.getTime()){
            errors.startDate = "Start date conflicts with an existing booking"
        }
        if(startDateDate >= bookStart && startDateDate < bookEnd){
            errors.startDate = "Start date conflicts with an existing booking"
        }
        if(startDateDate < bookStart && endDateDate > bookStart){
            errors.startDate = "Start date conflicts with an existing booking"
        }
        if(endDateDate > bookStart && endDateDate <= bookEnd && startDateDate < bookEnd){
            errors.endDate = "End date conflicts with an existing booking"
        }

        // if(endDateDate > bookStart && startDateDate < bookEnd)
    }
    if(Object.keys(errors).length){
        return res.status(403).json({"message": "Sorry, this spot is already booked for the specified dates",
    statusCode: 403, errors: errors})
    }
    let createBooking = await Booking.create({
        spotId: req.params.spotId,
        userId: req.user.id,
        startDate: startDateDate,
        endDate: endDateDate
    })

    return res.status(201).json(createBooking)
})

router.get('/:spotId/bookings',requireAuth,restoreUser ,async(req,res)=>{
    let user = req.user.id;
    let spot = await Spot.findOne({where:{id:req.params.spotId}})
    spotJSON = spot.toJSON()
    // console.log(spotJSON)
    // console.log(spotJSON.ownerId)
    // console.log(user)
    if(!spot){
        return res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
          })
    }
    if(spotJSON.ownerId === user){
        let bookings = await Booking.findAll({
            where:{spotId: req.params.spotId},
            attributes:{
                exclude:['userId', 'createdAt', 'updatedAt', 'id']
            },
            include:[
                {model: User,
                attributes:{
                        exclude:['username','email', 'hashedPassword', 'updatedAt','createdAt' ]
                }}
            ]
        })
        let bookingsArr = []
        bookings.forEach((booking) =>{
            bookingsArr.push(booking.toJSON())
        })
        return res.status(200).json({"Bookings": bookingsArr})
    }else{
        let bookings = await Booking.findAll({
            where:{spotId: req.params.spotId,
                    userId: user},
            attributes:{
                exclude:['userId', 'createdAt', 'updatedAt', 'id']
            }
        })
        let bookingsArr = []
        bookings.forEach((booking) =>{
            bookingsArr.push(booking.toJSON())
        })
        return res.status(200).json({"Bookings": bookingsArr})
    }
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
            ownerId: req.user.id
        }
    })
    if(!spots.length){
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
        if(rating[0].dataValues.avgRating === null){

            spot.avgRating = null
        }else{
            spot.avgRating = rating[0].dataValues.avgRating
        }

        let previewImage = await SpotImage.findOne({
            where:{
                spotId: spot.id,
                preview: true,
            }
        })
        if(previewImage){
            spot.previewImage = previewImage[0].dataValues.url
        }else{
            spot.previewImage = null
        }
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
    if(!lat || Number(lat) < -90 || Number(lat) > 90){
        errors.lat = "Latitude is not valid"
    }
    if(!lng || Number(lat) < -180 || Number(lat) > 180){
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
            "message": "Spot couldn't be found",
            "statusCode": 404
          })
    }
    if(spot.ownerId !== user){
        res.status(404).json({
            "message": "Forbidden",
            "statusCode": 403
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
    // console.log(req.body)
    // console.log(req.body.stars)
    // console.log(typeof req.body.stars)
    let oldReview = await Review.findOne({where:{
        userId: req.user.id,
        spotId: req.params.spotId
    }})
    // console.log(oldReview)
    if(oldReview){
        return res.status(403).json({
            "message": "User already has a review for this spot",
            "statusCode": 403
        })
    }
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
