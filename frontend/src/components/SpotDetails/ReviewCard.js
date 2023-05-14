import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

const ReviewCard = ({review}) => {
    // console.log("review: ",review)

    return (
        <div className={`review-card-container review-card-${review.id}`}>
            <h4 className="firstName">{review.User.firstName}</h4>
            <h5 className="date">{review.createdAt.toDateString()}</h5>
        </div>
    )
}

export default ReviewCard
