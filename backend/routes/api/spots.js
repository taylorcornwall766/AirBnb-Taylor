const express = require("express");
const router = express.Router();
const { Spot, User, SpotImage, Review, ReviewImage,Booking, sequelize} = require('../../db/models')
const { Op } = require("sequelize");
router.get('', async (req, res)=> {
    let spots = await Spot.findAll({
        // include:{
        // model: SpotImage,
        // // as: "previewImage",
        // attributes: ['url'],
        // where:{
        //     preview: true
        // }
        // },
        // order:[[SpotImage, 'preview', 'DESC']]
    })
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

module.exports = router;
