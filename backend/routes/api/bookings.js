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



module.exports = router
