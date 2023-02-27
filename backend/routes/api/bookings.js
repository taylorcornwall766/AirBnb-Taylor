const express = require("express");
const router = express.Router();
const { Spot, User, SpotImage, Review, ReviewImage,Booking, sequelize} = require('../../db/models')
const { Op } = require("sequelize");
const { setTokenCookie, restoreUser, requireAuth } = require("../../utils/auth.js")

router.get('/current', requireAuth, restoreUser, async(req, res) =>{
    let bookings = await Booking.findAll({
        where:{
            userId:req.user.id
        },
        include:[{
            model: Spot,
            attributes:{
                exclude:['createdAt', 'updatedAt']
            }
        }]
    })
    // console.log(bookings)
    if(!bookings.length){
        return res.status(404).json({
            "message": "Current user has no bookings!",
            "statusCode": 404
        })
    }
    let bookingsArr = []
    for(let i = 0; i < bookings.length; i++){
        bookingsArr.push(bookings[i].toJSON())
    }
    let newArr = []
    for(let i = 0; i < bookingsArr.length; i++){
        let booking = bookingsArr[i]
        console.log(booking)
        let previewImage = await SpotImage.findOne({where:
            {spotId: booking.spotId,
            preview: true
        }
        })
        if(!previewImage){
            booking.Spot.previewImage = null
        }else{
            previewImage = previewImage.toJSON()
            booking.Spot.previewImage = previewImage.url
        }
        // console.log('/1/1/1/1//1/1')
        // console.log(previewImage)
        // console.log('/1/1/1/1//1/1')
        // console.log(booking.Spot)
        newArr.push(booking)

    }
    return res.json({"Bookings": newArr})
})

router.put('/:bookingId', requireAuth, restoreUser, async(req,res)=>{
    let booking = await Booking.findOne({where:{id:req.params.bookingId}})
    let bookingJSON = booking.toJSON()

    if(!booking){
        return res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
          })
    }

    if(bookingJSON.userId !== req.user.id){
        return res.status(403).json({
            "message": "Forbidden",
            "statusCode": 403
          })
    }

    let {startDate, endDate} = req.body
    let todayDate = new Date()
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
    let startDateDate = new Date(startDate)
    let endDateDate = new Date(endDate)
    if(todayDate > endDateDate){
        return res.status(403).json({
            "message": "Past bookings can't be modified",
            "statusCode": 403
          })
    }

    if(startDateDate >= endDateDate){
        errors.endDate = "endDate cannot be on or before startDate"
    }
    if(startDate <= todayDate){
        errors.startDate = "startDate must be at a date in the future"
    }
    if(Object.keys(errors).length){
        return res.status(400).json({"message": "Validation Error",
    statusCode: 400, errors: errors})
    }

    let bookings = await Booking.findAll({where:{spotId:bookingJSON.spotId, id:{[Op.notIn]: [req.params.bookingId]}}})
    let bookingsArr = []
    for(let i = 0; i < bookings.length; i++){
        bookingsArr.push(bookings[i].toJSON())
    }
    console.log(bookingsArr)
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
        // if(startDateDate > bookStart && endDateDate > bookStart){
        //     errors.startDate = "Start date conflicts with an existing booking3"
        // }
        if(endDateDate > bookStart && endDateDate <= bookEnd && startDateDate < bookEnd){
            errors.endDate = "End date conflicts with an existing booking"
        }

        // if(endDateDate > bookStart && startDateDate < bookEnd)
    }
    if(Object.keys(errors).length){
        return res.status(403).json({"message": "Sorry, this spot is already booked for the specified dates",
    statusCode: 403, errors: errors})
    }

    await booking.update({
        startDate: startDateDate,
        endDate: endDateDate,
        updatedAt: new Date()
    })

    return res.status(200).json(booking)
})

router.delete('/:bookingId', requireAuth, restoreUser, async(req, res)=>{
    let booking = await Booking.findOne({where:{id:req.params.bookingId}})
    if(!booking){
        return res.status(404).json({
            "message": "Booking couldn't be found",
            "statusCode": 404
          })
    }
    let bookingJSON = booking.toJSON()
    if(bookingJSON.userId !== req.user.id){
        return res.status(403).json({
            "message": "Forbidden",
            "statusCode": 403
          })
    }
    let startDate = new Date(bookingJSON.startDate)
    let endDate = new Date(bookingJSON.endDate)
    let todayDate = new Date()
    if(startDate < todayDate){
        return res.status(403).json({
            "message": "Bookings that have been started can't be deleted",
            "statusCode": 403
          })
    }
    await booking.destroy()
    return res.status(200).json({
        "message": "Successfully deleted",
        "statusCode": 200
    })
})

module.exports = router
