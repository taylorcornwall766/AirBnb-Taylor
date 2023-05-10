import React, { useState } from "react";
// import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";

function createSpotForm(){
    const dispatch = useDispatch()

    const [country, setCountry] = useState("United States")
    const [streetAddress, setStreetAddress] = useState('')
    const [city, setCity] = useState("")
    const [state, setState] = useState("")
    const [latitude, setLatitude] = useState("")
    const [longitude, setLongitude] = useState("")
    const [description, setDescription] = useState("")
    const [title, setTitle] = useState("")
    const [price, setPrice] = useState("")
    const [previewImageUrl, setPreviewImageUrl] = useState("")
    const [imageUrl, setImageUrl] = useState([])
    const errors = {}
    const handleSubmit = (e) => {
        e.preventDefault()

    }

    return (
        <>
            <h1>Create a New Spot</h1>
            <h2>Wheres your place located?</h2>
            <h3>Guests will only get your exact address once they have booked a reservation.</h3>
            <form onSubmit={handleSubmit}>
                <label>
                    Country
                    <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                    />
                </label>
                <label>
                    Street Address
                    <input
                    type="text"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    required
                    />
                </label>
                <label>
                    Street Address
                    <input
                    type="text"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    required
                    />
                </label>
            </form>
        </>
    )
}
