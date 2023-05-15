import React from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import "./SpotsIndexItem.css"
const SpotsIndexItem = ({ spot, id,  }) => {
    const defaultImg = "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhdXRpZnVsJTIwaG91c2V8ZW58MHx8MHx8&w=1000&q=80"
    let ratingComponent;
    const history = useHistory()
    const handleClick = () => {
        history.push(`/spots/${spot.id}`)
    }
    // console.log("typeof spot.avgRating: ",typeof spot.avgRating)
    // console.log("spot.avgRating: ",spot.avgRating)
    //                                       FOR DEVELOPMENT
    if(typeof spot.avgRating === 'string' || typeof spot.avgRating === 'number'){
        // console.log("spot.avgRating123: ",spot.avgRating)
        ratingComponent = (
            <>
            <i className="fa-solid fa-star rating"></i>
            <p className="rating">{Number(spot.avgRating).toFixed(2)}</p>
            </>
        )
    }else{
        ratingComponent = (
            <p className="rating">New</p>
        )
    }
    return (
        <div className="spot-item-container" id={id} onClick={handleClick}>
            {/* make the images dynamic, add an image container for background image */}
            <img src={spot.previewImage || defaultImg} title={`${spot.name}`}></img>
            <div className="state-rating-container">
                <p className="city-state">{`${spot.city}, ${spot.state}`}</p>
                <div className="rating-container">
                {ratingComponent}
                </div>
            </div>
            <p className="price">{`$${spot.price} night`}</p>
        </div>
    )
}

export default SpotsIndexItem
