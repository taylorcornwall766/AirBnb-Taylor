import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadSpotsThunk } from "../../store/spots";
import SpotsIndexItem from "./SpotsIndexItem";
import "./SpotsIndex.css"
const SpotsIndex = () => {
    const spots = useSelector((state) => state.spots)
    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(loadSpotsThunk())
    }, [dispatch])
    if(spots.allSpots){
        const spotsArray = Object.values(spots.allSpots)
        // console.log("spotsArray", spotsArray)
        return (
            <div className="spot-index" id="spot-index">
                    {
                        spotsArray.map(spot => (


                            <SpotsIndexItem
                            spot={spot}
                            key={`spot-index-item-key-${spot.id}`}
                            id={`spot-index-item-${spot.id}`}
                            className={'spot-index-item'}
                            />
                            )
                    )}
            </div>
        )
    }else{
        return (null)
    }

}

export default SpotsIndex
