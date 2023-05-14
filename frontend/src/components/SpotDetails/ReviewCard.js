import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

const ReviewCard = ({review}) => {
    // console.log("review: ",review)
    const dateArr = review.createdAt.split("-")
    return (
        <div className={`review-card-container review-card-${review.id}`}>
            <h4 className="firstName">{review.User.firstName}</h4>
            <h5 className="date">{`${dateArr[1]} ${dateArr[0]}`}</h5>
            <p>{review.review}</p>
        </div>
    )
}

export default ReviewCard
