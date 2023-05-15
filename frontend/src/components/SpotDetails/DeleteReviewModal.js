import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
// import { deleteSpotThunk } from "../../store/spots";
import { deleteSpotReviewThunk } from "../../store/reviews";
// import "./LoginForm.css";

const DeleteReviewModal = ({reviewId, spotId}) => {
  const dispatch = useDispatch();
  console.log(reviewId)

  const { closeModal } = useModal();
  const handleDelete = async() => {
    // e.preventDefault()
    console.log("check")
    console.log("check", reviewId)

    const response = await dispatch(deleteSpotReviewThunk(reviewId, spotId))
    closeModal()
  }
  const handleCancel = (e) =>{
    // console.log('check')
    closeModal()
  }


  return (
    <>
        <h1 className="confirm-header">Confirm Delete</h1>
        <p className="confirm-p">Are you sure you want to delete this review?</p>
        <button onClick={handleDelete}className="delete-button">Yes (Delete Review)</button>
        <button onClick={handleCancel}className="cancel-button">No (Keep Review)</button>
    </>
  );
}

export default DeleteReviewModal;
