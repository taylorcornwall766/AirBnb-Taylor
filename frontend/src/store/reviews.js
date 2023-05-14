const GET_SPOT_REVIEWS = "reviews/getAllSpotReviews"

const getSpotReviews = (spotReviews) => {
    return {
        type: GET_SPOT_REVIEWS,
        payload: spotReviews
    }
}

export const loadSpotReviewsThunk = (spotId) => async(dispatch)=>{
   const response = await fetch(`/api/spots/${spotId}/reviews`)
   const data = await response.json()
   if(response.ok){
    console.log(data)
    const normalReviews = {}
    data.Reviews.forEach((review) => {
        normalReviews[review.id] = review
    })
    dispatch(getSpotReviews(normalReviews))
   }
   return data
}

const initialState = {spot: {}, user: {}}

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
