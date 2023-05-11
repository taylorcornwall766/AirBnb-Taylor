import { csrfFetch } from "./csrf";

const GET_ALL_SPOTS = "spots/getAllSpots"
const GET_SPOT_DETAILS = "spots/getSpotDetails"
const POST_NEW_SPOT = "spots/createNewSpot"
const DELETE_SPOT = "spots/deleteSpot"
const EDIT_SPOT = "spots/editSpot"
const GET_USER_SPOTS = "spots/getUserSpots"

const getUserSpots = (spots) => {
    return {
        type: GET_USER_SPOTS,
        payload: spots
    }
}

const getAllSpots = (spots) => {
    return {
        type: GET_ALL_SPOTS,
        payload: spots
    }
}

// const editSpot = (spot) => {
//     return {
//         type: EDIT_SPOT,
//         payload: spot
//     }
// }

const deleteSpot = (spotId) => {
    return {
        type: DELETE_SPOT,
        payload: spotId
    }
}

const getSpotDetails = (spot) => {
    return {
        type: GET_SPOT_DETAILS,
        payload: spot
    }
}

const createNewSpot = (spot) => {
    return {
        type: POST_NEW_SPOT,
        payload:{
            spot
        }
    }
}

export const loadUserSpotsThunk = (userId) => async(dispatch) =>{
    const response = await csrfFetch(`/api/spots/current`)
}

export const loadSpotDetailsThunk = (spotId) => async(dispatch) =>{
    const response = await fetch(`/api/spots/${spotId}`)
    const data = await response.json()
    // console.log(data)
    if(response.ok){
        dispatch(getSpotDetails(data))
    }
    return data
}

export const loadSpotsThunk = () => async(dispatch) =>{
    // console.log("loadSpotsThunk", "1")
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

export const createSpotThunk = (spot, spotImages) => async(dispatch) =>{
    console.log(spot)
    console.log(spotImages)
    const response = await csrfFetch(`/api/spots`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(spot),
      });
    if(response.ok){
        const spotData = await response.json()
        console.log("spotData",spotData)
        console.log("message", spotData.errors)
        for(let i = 0; i < spotImages.length; i++){
            const response = await csrfFetch(`/api/spots/${spotData.id}/images`, {
                method: "post",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(spotImages[i]),
              });
            const imageData = await response.json()
            console.log(imageData)
        }
        dispatch(createNewSpot(spotData))
    }else{
        const data = await response.json()
        console.log(data.message)
    }
}

export const deleteSpotThunk = (spotId) => async(dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: "delete",
        headers: {
          "Content-Type": "application/json",
        },
      });
    const data = await response.json()
    if(response.ok){
        console.log("deleted")
        dispatch(deleteSpot(spotId))
        return data
    }
    return data
}

export const editSpotThunk = (spot) => async(dispatch) =>{
    const response = await csrfFetch(`/api/spots/${spot.id}`, {
        method: "put",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(spot)
      });
    const data = await response.json()
    if(response.ok){
        dispatch(createNewSpot(spot))
    }
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
    case GET_SPOT_DETAILS:{
        const newState = {...state}
        newState.singleSpot = {...action.payload}
        return newState
    }
    case DELETE_SPOT:{
        const newState = {...state}
        delete newState.allSpots[action.payload]
        return newState
    }
    case POST_NEW_SPOT:{
        const newState = {...state}
        console.log(action.playload)
        newState.allSpots[action.payload.id] = action.payload
        return newState
    }
    default:
      return state;
  }
};

export default spotsReducer;
