import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadSpotDetailsThunk } from "../../store/spots";
import { useParams } from "react-router-dom";
import "./SpotDetails.css"
import { loadSpotReviewsThunk } from "../../store/reviews";
import ReviewCard from "./ReviewCard";
import PostReviewModal from "../PostReviewModal";
import OpenModalButton from "../OpenModalButton";
const SpotDetails = () => {
    const {spotId} = useParams()
    const dispatch = useDispatch();

    // dispatch(loadSpotReviewsThunk(spotId))
    // dispatch(loadSpotDetailsThunk(spotId))
    // useEffect(()=>{
    //     // dispatch(loadSpotReviewsThunk(spotId))
    //     // dispatch(loadSpotDetailsThunk(spotId))
    // },[])
    const spot = useSelector((state) => state.spots.singleSpot)
    const reviews = useSelector((state) => state.reviews.spot)
    const user = useSelector((state) => state.session.user)
    const reviewsArr = Object.values(reviews)

    const reviewFound = reviewsArr.find((review) => {
        // console.log(review)
        // console.log(user.id)
        return review.userId === user.id
    })




    const ReserveButtonClick = () => {
        alert("Feature Coming Soon...")
    }

    useEffect(()=>{
        // const getData = async() =>{
        dispatch(loadSpotReviewsThunk(spotId))
        dispatch(loadSpotDetailsThunk(spotId))
        // }
    }, [dispatch])
    if(!spot.SpotImages){
        return null
    }
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
            numReviews,
        } = spot
        // console.log("numReviews: ", numReviews, typeof numReviews)
        let ratingText = "New"
        if(avgStarRating){
            ratingText = `${avgStarRating}`
        }
        // console.log(numReviews)
        const imagesArr = Object.values(spot.SpotImages)
        // console.log("spot: ", spot)
        // console.log(imagesArr)

        // rendering all of our images
        let previewImageFound = false
        for(let i = 0; i < 5; i++){
            // set our current place in the images Arr to img variable
            let imagesArrImage = imagesArr[i]
            // console.log(imagesArrImage)
            // so that we dont create two preview image components
            if(imagesArrImage){
                if(i === 4 && !previewImageFound){
                    imagesArr[4] = (
                        <img key={`image-${imagesArrImage.id}-db`} src={imagesArrImage.url} className="previewImage"></img>
                    )
                    break
                }
                if(imagesArrImage.preview && !previewImageFound){
                    previewImageFound = true
                    // our preview image component
                    imagesArr[i] = (
                        <img key={`image-${imagesArrImage.id}-db`} src={imagesArrImage.url} className="previewImage"></img>
                    )
                }else{
                    imagesArr[i] = (
                        <img key={`image-${imagesArrImage.id}-db`} src={imagesArrImage.url} className="spotImage"></img>
                    )
                }
            }else{
                // setting a default image if there arent enough images for the given spot
                if(i === 4 && !previewImageFound){
                    imagesArr[4] = (
                        <img key={`image-${[i]}-filler`} src={`https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhdXRpZnVsJTIwaG91c2V8ZW58MHx8MHx8&w=1000&q=80`} className="previewImage"></img>
                    )
                    break
                }
                imagesArr[i] = (
                    <img key={`image-${[i]}-filler`} src={`https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhdXRpZnVsJTIwaG91c2V8ZW58MHx8MHx8&w=1000&q=80`} className="spotImage" id={`image-${i}`}></img>
                )
            }
        }
        // console.log("testing images arr: ",imagesArr)
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
                        <div className="rating-container small">
                            <div className="avg-rating-container small">
                            <i className="fa-solid fa-star rating small"></i>
                            <h3 className="avg-rating small">{ratingText}</h3>
                            </div>
                            {
                                numReviews>0 && <h3 className="num-reviews small">{`${numReviews} ${numReviews>1?"reviews":"review"}`}</h3>
                            }

                            {/* <h3 className="num-reviews small">{`${numReviews} reviews`}</h3> */}
                        </div>
                        <button onClick={ReserveButtonClick}className="reserve-button">Reserve</button>
                    </div>
                </div>

                <div className="reviews-container">
                    <div className="review-info-container big">
                        <div className="avg-rating-container big">
                            <i className="fa-solid fa-star rating big"></i>
                            <h3 className="avg-rating big">{ratingText}</h3>
                        </div>
                    </div>
                    {
                        user && user.id && Owner.id !== user.id && !reviewFound && <OpenModalButton
                        buttonText="Post Your Review"
                        modalComponent={<PostReviewModal spotId={spotId}/>}
                      />
                    }
                    {reviewsArr.map((review) => {

                        return <ReviewCard userId={user.id} review={review} key={`${review.id}-review-key`}/>
                    })}
                </div>
            </div>
        )
    }else{
        return (null)
    }

}

export default SpotDetails
