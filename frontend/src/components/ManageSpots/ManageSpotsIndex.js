import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadUserSpotsThunk } from "../../store/spots";
import ManageSpotsIndexItem from "./ManageSpotCard.js"
import { useHistory } from "react-router-dom";
import "./ManageSpots.css"
// import "./SpotsIndex.css"
const ManageSpotsIndex = () => {
    const spots = useSelector((state) => state.spots)
    const dispatch = useDispatch();
    const history = useHistory()
    const handleClick=()=>{
        history.push("/spots/new")
    }

    useEffect(()=>{
        dispatch(loadUserSpotsThunk())
    }, [dispatch])
    // console.log(spots)
    if(spots.allSpots){
        const spotsArray = Object.values(spots.allSpots)
        // console.log("spotsArray", spotsArray)
        return (
            <>
            <h1 className="manage">Manage Your Spots</h1>
            <button onClick={handleClick}>Create a New Spot</button>
            <div className="spot-index" id="manage-spot-index">
                    {
                        spotsArray.map(spot => (


                            <ManageSpotsIndexItem
                            spot={spot}
                            key={`manage-spot-index-item-key-${spot.id}`}
                            id={`manage-spot-index-item-${spot.id}`}
                            className={'spot-index-item'}
                            />
                            )
                            )}
            </div>
            </>
        )
    }else{
        return (null)
    }

}

export default ManageSpotsIndex
