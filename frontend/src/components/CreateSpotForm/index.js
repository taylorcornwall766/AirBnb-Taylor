import React, { useState } from "react";
// import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { createSpotThunk } from "../../store/spots";

function CreateSpotForm(){
    const dispatch = useDispatch()

    const [country, setCountry] = useState("")
    const [streetAddress, setStreetAddress] = useState("")
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
    const [errors, setErrors] = useState({})
    // const errors = {}
    const handleSubmit = (e) => {
        // console.log("previewImageUrl: ", previewImageUrl)
        // console.log("previewImageUrl.length: ", previewImageUrl.length)
        setErrors({})
        console.log('asdf')
        e.preventDefault()
        console.log(!country.length)
        if(!country.length){
            setErrors({...errors, country : (<p className="errors" value="Country is required">Country is required</p>)})
        }
        console.log("1 :", errors)
        if(!streetAddress.length){
            setErrors({...errors, streetAddress: (<p className="errors" value="Address is required">Address is required</p>)})
        }
        console.log("2 :", errors)
        if(!city.length){
            setErrors({...errors,city : <p className="errors" value="City is required">City is required</p>})
        }
        console.log("3 :", errors)
        if(!state.length){
            setErrors({...errors, state:(<p className="errors" value="State is required">State is required</p>)})
        }
        if(description.length < 30){
            setErrors({...errors, description:(<p className="errors" value="Description needs a minimum of 30 characters">Description needs a minimum of 30 characters</p>)})
        }
        if(!name.length){
            setErrors({...errors,name : (<p className="errors" value="Name is required">Name is required</p>)})
        }
        if(!price.length){
            setErrors({...errors,price : (<p className="errors" value="Price is required">Price is required</p>)})
        }
        if(!previewImageUrl.length){
            setErrors({...errors, previewImageUrl: (<p className="errors" value="Preview image is required">Preview image is required</p>)})
        }

        if(!Object.values(errors).length){

        }
        const newSpot = {
            address: streetAddress,
            city: city,
            state: state,
            country: country,
            name: name,
            description: description,
            price: Number(price),
            lat: 0,
            lng: 0,
        }
        if(latitude.length){
            newSpot.lat = Number(latitude)
        }
        if(longitude.length){
            newSpot.lng = Number(longitude)
        }
        const spotImages = []
        console.log(newSpot)
        console.log("preview image url: ", previewImageUrl)
        if(!Object.values(errors).length){
            dispatch(createSpotThunk(newSpot, spotImages))
        }
        console.log('errors:   ',errors)
        // if(image1Url && image1Url.split('.')[image1Url.split('.').length-1])
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
                    />
                    {errors.country}
                </label>
                <label>
                    Street Address
                    <input
                    type="text"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    />
                    {errors.streetAddress}
                </label>
                <label>
                    City
                    <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    />
                    {errors.city}
                </label>
                <label>
                    State
                    <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    />
                    {errors.state}
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
                    <textarea
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    />
                    {errors.description}
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
                    />
                    {errors.name}
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
                    />
                    {errors.price}
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
                    />
                    {errors.previewImageUrl}
                    <input
                    type="text"
                    value={image1Url}
                    onChange={(e) => setImage1Url(e.target.value)}
                    />
                    <input
                    type="text"
                    value={image2Url}
                    onChange={(e) => setImage2Url(e.target.value)}
                    />
                    <input
                    type="text"
                    value={image3Url}
                    onChange={(e) => setImage3Url(e.target.value)}
                    />
                    <input
                    type="text"
                    value={image4Url}
                    onChange={(e) => setImage4Url(e.target.value)}
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
