import React, { useState } from "react";
// import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { createSpotThunk } from "../../store/spots";
import { useHistory } from "react-router-dom";
function CreateSpotForm(){
    const history = useHistory()
    const dispatch = useDispatch()

    const [country, setCountry] = useState("")
    const [streetAddress, setStreetAddress] = useState("")
    const [city, setCity] = useState("")
    const [state, setState] = useState("")
    const [latitude, setLatitude] = useState(1)
    const [longitude, setLongitude] = useState(1)
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
    const handleSubmit = async(e) => {
        // console.log("previewImageUrl: ", previewImageUrl)
        // console.log("previewImageUrl.length: ", previewImageUrl.length)

        // setErrors({})

        const newErrors = {}
        e.preventDefault()
        // console.log(!country.length)
        if(!country.length){
            newErrors.country = "Country is required"
        }
        // console.log("1 :", errors)
        if(!streetAddress.length){
            newErrors.streetAddress = "Address is required"
        }
        // console.log("2 :", errors)
        if(!city.length){
            newErrors.city= "City is required"
        }
        // console.log("3 :", errors)
        if(!state.length){
            newErrors.state = "State is required"
        }
        if(description.length < 30){
            newErrors.description = "Description needs a minimum of 30 characters"
        }
        if(!name.length){
            newErrors.title = "Name is required"
        }
        if(!price.length){
            newErrors.price = "Price is required"
        }
        if(!previewImageUrl.length){
            newErrors.previewImageUrl = "Preview image is required"
        }
        setErrors(newErrors)

        const newSpot = {
            address: streetAddress,
            city: city,
            state: state,
            country: country,
            name: name,
            description: description,
            price: Number(price),
            lat: 1,
            lng: 1,
        }
        if(!latitude){
            newSpot.lat = Number(latitude)
        }
        if(!longitude){
            newSpot.lng = Number(longitude)
        }
        const spotImages = []
        spotImages.push({url:previewImageUrl, preview: true})
        if(image1Url.length){
            spotImages.push({url: image1Url, preview: false})
        }
        if(image2Url.length){
            spotImages.push({url: image2Url, preview: false})
        }
        if(image3Url.length){
            spotImages.push({url: image3Url, preview: false})
        }
        if(image4Url.length){
            spotImages.push({url: image4Url, preview: false})
        }
        // console.log(newSpot)
        // console.log("preview image url: ", previewImageUrl)
        if(!Object.values(errors).length && description.length >= 30){
            // console.log('hit')
            const response = await dispatch(createSpotThunk(newSpot, spotImages))
            if(response.id){
                history.push(`/spots/${response.id}`)
            }else{
                console.log(response)
                const newerErrors = {...response.errors, ...errors}
                setErrors({...response.errors})
                console.log("errors: ", errors)
            }
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
                    <p className="errors">{errors.country}</p>
                </label>
                <label>
                    Street Address
                    <input
                    type="text"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    />
                    <p className="errors">{errors.streetAddress}</p>
                </label>
                <label>
                    City
                    <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    />
                    <p className="errors">{errors.city}</p>
                </label>
                <label>
                    State
                    <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    />
                    <p className="errors">{errors.state}</p>
                </label>
                {/* <label>
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
                </label> */}
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
                    <p className="errors">{errors.description}</p>
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
                    <p className="errors">{errors.title}</p>
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
                    <p className="errors">{errors.price}</p>
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
                    <p className="errors" value="Preview image is required">{errors.previewImageUrl}</p>
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
