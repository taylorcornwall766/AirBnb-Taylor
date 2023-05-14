import { csrfFetch } from "./csrf"

const GET_SPOT_REVIEWS = "reviews/getAllSpotReviews"
const POST_SPOT_REVIEW = "reviews/postSpotReview"


const getSpotReviews = (spotReviews) => {
    return {
        type: GET_SPOT_REVIEWS,
        payload: spotReviews
    }
}

const postSpotReview = (spotReview) => {
    return {
        type: POST_SPOT_REVIEW,
        payload: spotReview
    }
}

export const loadSpotReviewsThunk = (spotId) => async(dispatch)=>{
   const response = await fetch(`/api/spots/${spotId}/reviews`)
   const data = await response.json()
   if(response.ok){
    // console.log(data)
    const normalReviews = {}
    data.Reviews.forEach((review) => {
        normalReviews[review.id] = review
    })
    dispatch(getSpotReviews(normalReviews))
   }
   return data
}

export const postSpotReviewThunk = (spotReview, spotId)=> async(dispatch) =>{
    try{

        const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(spotReview),
        });
        if(response.ok){
            // console.log(reviewData)
            const reviewData = await response.json()
            console.log("reviewData: ",reviewData)

            dispatch(postSpotReview(reviewData))
            return reviewData
        }else{
            const data = await response.json()
            console.log(data.message)
        }

    }catch(error){
        const errors = await error.json()
        return errors
    }
}

const initialState = {spot: {}, user: {}}

const reviewsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_SPOT_REVIEWS:{
            const newState = {user: {...state.user}, spot: action.payload }
            // newState.spot = action.payload
            console.log("------------------")
            console.log("newState getspotreviews: ", newState)
            console.log("------------------")
            return newState
        }
        case POST_SPOT_REVIEW:{
            const newState = {...state}
            newState.spot = {...action.payload}
        }
        default:
            return state
    }
}

export default reviewsReducer
