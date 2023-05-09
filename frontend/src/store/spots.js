import { csrfFetch } from "./csrf";

const GET_ALL_SPOTS = "spots/getAllSpots"

const getAllSpots = (spots) => {
    return {
        type: GET_ALL_SPOTS,
        payload: spots
    }
}

export const loadSpotsThunk = () => async(dispatch) =>{
    console.log("loadSpotsThunk", "1")
    const response = await fetch("/api/spots")
    const data = await response.json()
    if(response.ok){
        // console.log(data.spots)
        const normalSpots = {}
        data.spots.forEach((spot) => {
            normalSpots[spot.id] = spot
        })
        dispatch(getAllSpots(normalSpots))
        return normalSpots
    }
    return null
}

const initialState = {allSpots: null, singleSpot: null};

const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_SPOTS:{
        const newState = {...state}
        // console.log('1',newState)
        newState.allSpots = {...action.payload}
        return newState;
    }
    default:
      return state;
  }
};

export default spotsReducer;
