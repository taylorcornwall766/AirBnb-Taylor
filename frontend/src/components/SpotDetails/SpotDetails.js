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
        // console.log("spot: ", spot)
        return (
            <div className="details-container" id={`spot-details-${spotId}`}>
                <h2 className="spot-name"></h2>
                <p className="spot-location"></p>
                <div className="images-container">
                    <img src="" className="previewImage"></img>
                    <img src="" className="spotImage" id="image-1"></img>
                    <img src="" className="spotImage" id="image-2"></img>
                    <img src="" className="spotImage" id="image-3"></img>
                    <img src="" className="spotImage" id="image-4"></img>
                </div>

                <div className="info-container">
                    <h3 className="host-info">Hosted by {``}</h3>
                    <p className="description-info">{}</p>
                    <div className="reserve-container">
                        <h3 className="price">{`night`}</h3>
                        <div className="rating-container">
                            <i className="fa-solid fa-star rating"></i>
                            <p className="avg-rating"></p>
                            <p className="num-reviews">{`reviews`}</p>
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
