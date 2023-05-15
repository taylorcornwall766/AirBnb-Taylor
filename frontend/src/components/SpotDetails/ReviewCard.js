import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import DeleteReviewModal from './DeleteReviewModal';
import OpenModalButton from '../OpenModalButton';

const ReviewCard = ({review, userId}) => {
    // console.log("review: ",review)
    const dateArr = review.createdAt.split("-")
    const month = {
        "01": "January",
        "02": "February",
        "03": "March",
        "04": "April",
        "05": "May",
        "06": "June",
        "07": "July",
        "08": "August",
        "09": "September",
        "10": "October",
        "11": "November",
        "12": "December"
    }
    return (
        <div className={`review-card-container review-card-${review.id}`}>
            <h4 className="firstName">{review.User.firstName}</h4>
            <h5 className="date">{`${month[dateArr[1]]} ${dateArr[0]}`}</h5>
            <p>{review.review}</p>
            {userId === review.userId && <OpenModalButton
                        buttonText="Delete"
                        modalComponent={<DeleteReviewModal spotId={review.spotId} reviewId={review.id}/>}
            />}
        </div>
    )
}

export default ReviewCard
