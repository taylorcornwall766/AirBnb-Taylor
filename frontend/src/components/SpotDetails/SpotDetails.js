import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadSpotDetailsThunk } from "../../store/spots";
import { useParams } from "react-router-dom";

const SpotDetails = () => {
    const {spotId} = useParams()
    const spot = useSelector((state) => state.spots.singleSpot)
    const dispatch = useDispatch();



    const ReserveButtonClick = () => {
        alert("Feature Coming Soon...")
    }

    useEffect(()=>{
        dispatch(loadSpotDetailsThunk(spotId))
    }, [dispatch])
    if(spot){
        const {
            name,
            city,
            state,
            country,
            Owner,
            description,
            price,
            avgStarRating,
            numReviews
        } = spot
        console.log(numReviews)
        const imagesArr = Object.values(spot.SpotImages)
        // console.log("spot: ", spot)

        // rendering all of our images
        for(let i = 0; i < 5; i++){
            // set our current place in the images Arr to img variable
            let imagesArrImage = imagesArr[i]
            // console.log(imagesArrImage)
            // so that we dont create two preview image components
            let previewImageFound = false
            if(imagesArrImage){
                if(imagesArrImage.preview && !previewImageFound){
                    previewImageFound = true
                    // our preview image component
                    imagesArr[i] = (
                        <img src={imagesArrImage.url} className="previewImage"></img>
                    )
                }else{
                    imagesArr[i] = (
                        <img src={imagesArrImage.url} className="spotImage" id={`image-${i}`}></img>
                    )
                }
            }else{
                // setting a default image if there arent enough images for the given spot
                imagesArr[i] = (
                    <img src={`https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhdXRpZnVsJTIwaG91c2V8ZW58MHx8MHx8&w=1000&q=80`} className="spotImage" id={`image-${i}`}></img>
                )
            }
        }
        return (
            <div className="details-container" id={`spot-details-${spotId}`}>
                <h2 className="spot-name">{name}</h2>
                <p className="spot-location">{`${city}, ${state}, ${country}`}</p>
                <div className="images-container">
                    {imagesArr}
                </div>

                <div className="info-container">
                    <h3 className="host-info">Hosted by {`${Owner.firstName} ${Owner.lastName}`}</h3>
                    <p className="description-info">{description}</p>
                    <div className="reserve-container">
                        <h3 className="price">{`$${price} night`}</h3>
                        <div className="rating-container">
                            <div className="avg-rating-container">
                            <i className="fa-solid fa-star rating"></i>
                            <h3 className="avg-rating">{avgStarRating}</h3>
                            </div>
                            <h3 className="num-reviews">{`${numReviews} reviews`}</h3>
                        </div>
                        <button onClick={ReserveButtonClick}className="reserve-button">Reserve</button>
                    </div>
                </div>

                <div className="reviews-container">
                    <div className="review-info-container">
                        <i className="fa-solid fa-star rating"></i>
                        <p className="avg-rating"></p>
                        <p className="num-reviews">{`reviews`}</p>
                    </div>
                    {/* ADD REVIEWS MAP HERE*/}
                </div>
            </div>
        )
    }else{
        return (null)
    }

}

export default SpotDetails
