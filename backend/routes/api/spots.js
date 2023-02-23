const express = require("express");
const router = express.Router();
const { Spot, User, SpotImage, Review, ReviewImage,Booking, sequelize} = require('../../db/models')
const { Op } = require("sequelize");
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
module.exports = router;
