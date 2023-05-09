import React from 'react';
import { Link } from 'react-router-dom';
import "./SpotsIndexItem.css"
const SpotsIndexItem = ({ spot, id,  }) => {
    let ratingComponent;
    // console.log("typeof spot.avgRating: ",typeof spot.avgRating)
    // console.log("spot.avgRating: ",spot.avgRating)
    if(typeof spot.avgRating === 'number'){
        // console.log("spot.avgRating123: ",spot.avgRating)
        ratingComponent = (
            <>
            <i class="fa-solid fa-star rating"></i>
            <p className="rating">{spot.avgRating.toFixed(2)}</p>
            </>
        )
    }else{
        ratingComponent = (
            <p className="rating">No Reviews</p>
        )
    }
    return (
        <div className="spot-item-container" id={id}>
            <img src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhdXRpZnVsJTIwaG91c2V8ZW58MHx8MHx8&w=1000&q=80"></img>
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
