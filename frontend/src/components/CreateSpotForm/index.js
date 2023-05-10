import React, { useState } from "react";
// import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";

function CreateSpotForm(){
    const dispatch = useDispatch()

    const [country, setCountry] = useState("United States")
    const [streetAddress, setStreetAddress] = useState('')
    const [city, setCity] = useState("")
    const [state, setState] = useState("")
    const [latitude, setLatitude] = useState("")
    const [longitude, setLongitude] = useState("")
    const [description, setDescription] = useState("")
    const [name, setName] = useState("")
    const [price, setPrice] = useState("")
    const [previewImageUrl, setPreviewImageUrl] = useState("")
    const [image1Url, setImage1Url] = useState("")
    const [image2Url, setImage2Url] = useState("")
    const [image3Url, setImage3Url] = useState("")
    const [image4Url, setImage4Url] = useState("")

    const errors = {}
    const handleSubmit = (e) => {
        e.preventDefault()

        if(!country.length){
            errors.country = "Country is required"
        }
        if(!address.length){
            errors.address = "Address is required"
        }
        if(!city.length){
            errors.city = "City is required"
        }
        if(!state.length){
            errors.state = "State is required"
        }
        if(description.length < 30){
            errors.description = "Description needs a minimum of 30 characters"
        }
        if(!name.length){
            errors.name = "Name is required"
        }

    }

    return (
        <>
            <h1>Create a New Spot</h1>
            <h3>Wheres your place located?</h3>
            <p>Guests will only get your exact address once they have booked a reservation.</p>
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
                    City
                    <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    />
                </label>
                <label>
                    State
                    <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                    />
                </label>
                <label>
                    Latitude
                    <input
                    type="text"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    />
                </label>
                <label>
                    Longitude
                    <input
                    type="text"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    />
                </label>
                <label>
                    <h3>Describe your place to guests</h3>
                    <p>
                        Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.
                    </p>
                    <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    />
                </label>
                <label>
                    <h3>Create a title for your spot</h3>
                    <p>
                    Catch guests' attention with a spot title that highlights what makes your place special.
                    </p>
                    <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    />
                </label>
                <label>
                    <h3>Set a base price for your spot</h3>
                    <p>
                    Competitive pricing can help your listing stand out and rank higher in search results
                    </p>
                    $
                    <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    />
                </label>
                <label>
                    <h3>Liven up your spot with photos</h3>
                    <p>
                    Submit a link to at least one photo to publish your spot.
                    </p>

                    <input
                    type="text"
                    value={previewImageUrl}
                    onChange={(e) => setPreviewImageUrl(e.target.value)}
                    required
                    />
                    <input
                    type="text"
                    value={image1Url}
                    onChange={(e) => setImage1Url(e.target.value)}
                    required
                    />
                    <input
                    type="text"
                    value={image2Url}
                    onChange={(e) => setImage2Url(e.target.value)}
                    required
                    />
                    <input
                    type="text"
                    value={image3Url}
                    onChange={(e) => setImage3Url(e.target.value)}
                    required
                    />
                    <input
                    type="text"
                    value={image4Url}
                    onChange={(e) => setImage4Url(e.target.value)}
                    required
                    />
                </label>

                <button type="submit">
                Create Spot
                </button>

            </form>
        </>
    )
}

export default CreateSpotForm
