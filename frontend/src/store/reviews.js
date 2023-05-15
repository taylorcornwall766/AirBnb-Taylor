import { csrfFetch } from "./csrf"
import { loadSpotDetailsThunk } from "./spots"

const GET_SPOT_REVIEWS = "reviews/getAllSpotReviews"
const POST_SPOT_REVIEW = "reviews/postSpotReview"
const DELETE_SPOT_REVIEW = "review/deleteSpotReview"

const getSpotReviews = (spotReviews) => {
    return {
        type: GET_SPOT_REVIEWS,
        payload: spotReviews
    }
}

const deleteSpotReview = (reviewId) => {
    return {
        type: DELETE_SPOT_REVIEW,
        payload: reviewId
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
   const normalReviews = {}
   if(response.ok){
    // console.log(data)
    data.Reviews.forEach((review) => {
        normalReviews[review.id] = review
    })
    // console.log(normalReviews)
    }
    // we have to dispatch regardless of if we get reviews back, because we need to update the state to
    // the empty object if the spot has no reviews, otherwise it will show the reviews from the earlier
    // spot
   dispatch(getSpotReviews(normalReviews))
//    console.log("checK")
   return data
}

export const deleteSpotReviewThunk = (reviewId, spotId) => async(dispatch) =>{
    try{
        const response = await csrfFetch(`/api/reviews/${reviewId}`, {
            method: "delete",
            headers: {
                "Content-Type": "application/json",
            }
        });
        if(response.ok){
            // console.log(reviewData)
            const reviewData = await response.json()
            // console.log("reviewData: ",reviewData)
            await dispatch(loadSpotReviewsThunk(spotId))
            await dispatch(loadSpotDetailsThunk(spotId))
            return reviewData
        }else{
            const data = await response.json()

            // console.log("else")
            // console.log(data.message)
        }

    }catch(error){
        const errors = await error.json()
        // console.log("errors", errors)
        return errors
    }
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
            // console.log("reviewData: ",reviewData)

            await dispatch(postSpotReview(reviewData))
            await dispatch(loadSpotReviewsThunk(spotId))
            await dispatch(loadSpotDetailsThunk(spotId))
            return reviewData
        }else{
            const data = await response.json()
            // console.log("else")
            console.log(data.message)
        }

    }catch(error){
        const errors = await error.json()
        // console.log("errors", errors)
        return errors
    }
}

const initialState = {spot: {}, user: {}}

const reviewsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_SPOT_REVIEWS:{
            const newState = {user: {...state.user}, spot: action.payload }
            // newState.spot = action.payload
            // console.log("------------------")
            // console.log("newState getspotreviews: ", newState)
            // console.log("------------------")
            return newState
        }
        case POST_SPOT_REVIEW:{
            const newState = {...state}
            newState.spot = {...action.payload}
        }
        case DELETE_SPOT_REVIEW:{
            const newState = {...state}
            delete newState.spot[action.payload]
            return newState
        }
        default:
            return state
    }
}

export default reviewsReducer
