import React from 'react';
import { useHistory } from 'react-router-dom';
import OpenModalButton from '../OpenModalButton';
import DeleteSpotModal from './DeleteSpotModal';
import { useDispatch } from 'react-redux';
import { loadSpotDetailsThunk } from '../../store/spots';

const ManageSpotsIndexItem = ({ spot, id,  }) => {
    // console.log(spot.id)
    const dispatch = useDispatch()
    const defaultImg = "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhdXRpZnVsJTIwaG91c2V8ZW58MHx8MHx8&w=1000&q=80"
    let ratingComponent;
    const history = useHistory()
    const handleClick = () => {
        // console.log("1 - div")
        history.push(`/spots/${spot.id}`)
    }
    const handleUpdateClick = async() => {
        const response = await dispatch(loadSpotDetailsThunk(spot.id))
        history.push(`/spots/${spot.id}/edit`)
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


        <>
        <div className="spot-item-container" id={id} >
            {/* make the images dynamic, add an image container for background image */}
            <img src={spot.previewImage || defaultImg}onClick={handleClick}></img>
            <div className="state-rating-container" onClick={handleClick}>
                <p className="city-state">{`${spot.city}, ${spot.state}`}</p>
                <div className="rating-container">
                {ratingComponent}
            </div>
        </div>
            <p className="price" onClick={handleClick}>{`$${spot.price} night`}</p>
            <div className='button-holder'>
                <button className="update-button update" onClick={handleUpdateClick}>Update</button>
                <OpenModalButton
                    className="delete-button delete"
                    buttonText="Delete"
                    modalComponent={<DeleteSpotModal spotId={spot.id}/>}
                    />
            </div>
        </div>
    </>
    )
}

export default ManageSpotsIndexItem
