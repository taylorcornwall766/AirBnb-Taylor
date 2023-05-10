const GET_SPOT_REVIEWS = "reviews/getAllSpotReviews"

const getSpotReviews = (spotReviews) => {
    return {
        type: GET_SPOT_REVIEWS,
        payload: spotReviews
    }
}

const loadSpotReviewsThunk = (spotId) => async(dispatch)=>{
   const response = await fetch(`/api/spots/${spotId}/reviews`)
   const data = await response.json()
   if(response.ok){
    dispatch(getSpotReviews)
   }
   return data
}

const initialState = {spot: null, user:null}

const reviewsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_SPOT_REVIEWS:{
            const newState = {...state}
            newState.spot = {...action.payload}
            return newState
        }
        default:
            return state
    }
}

export default reviewsReducer
