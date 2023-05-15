import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { postSpotReviewThunk } from "../../store/reviews";

function PostReviewModal( {spotId} ) {
  const dispatch = useDispatch();
  const reviewObj = {}
  const [review, setReview] =useState("")
  const [activeRating, setActiveRating] = useState(0)
  const [stars, setStars] =useState(0)
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

//   console.log(spotId)
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(postSpotReviewThunk({review: review, stars:stars}, spotId))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  return (
    <>
      <h1>How was your stay?</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <textarea
            type="text"
            value={review}
            placeholder="Leave your review here..."
            onChange={(e) => setReview(e.target.value)}
            required
          />
        </label>
        <label onMouseLeave={()=> setActiveRating(stars)}>
        <i className={`fa-${activeRating>0?"solid":"regular"} fa-star rating big`} onClick={()=> setStars(1)} onMouseEnter={()=>{setActiveRating(1)}}></i>
        <i className={`fa-${activeRating>1?"solid":"regular"} fa-star rating big`} onClick={()=> setStars(2)} onMouseEnter={()=>{setActiveRating(2)}}></i>
        <i className={`fa-${activeRating>2?"solid":"regular"} fa-star rating big`} onClick={()=> setStars(3)} onMouseEnter={()=>{setActiveRating(3)}}></i>
        <i className={`fa-${activeRating>3?"solid":"regular"} fa-star rating big`} onClick={()=> setStars(4)} onMouseEnter={()=>{setActiveRating(4)}}></i>
        <i className={`fa-${activeRating>4?"solid":"regular"} fa-star rating big`} onClick={()=> setStars(5)} onMouseEnter={()=>{setActiveRating(5)}}></i>
            Stars
        </label>
        <button type="submit" disabled={review.length<10 || stars < 1}>Submit Your Review</button>
      </form>
    </>
  );
}

export default PostReviewModal;
