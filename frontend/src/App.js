import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import SpotsIndex from "./components/SpotsIndex/SpotsIndex";
// import SpotsDetail from "./components/SpotDetails/SpotDetails";
import SpotDetails from "./components/SpotDetails/SpotDetails";
import CreateSpotForm from "./components/CreateSpotForm";
// import ManageSpotsIndex from "./components/ManageSpots/ManageSpotsIndex";
import ManageSpotsIndex from "./components/ManageSpots/ManageSpotsIndex.js";
import EditSpotForm from "./components/EditSpotForm";
function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded &&
        <Switch>
          <Route path="/" exact>
            <SpotsIndex />
          </Route>

          <Route path="/spots/:spotId/edit" exact>
            <EditSpotForm />
          </Route>

          <Route path="/spots/current" exact>
            <ManageSpotsIndex />
          </Route>

          <Route path="/spots/new" exact>
            <CreateSpotForm />
          </Route>


          <Route path="/spots/:spotId" exact>
            <SpotDetails />
          </Route>

        </Switch>}
    </>
  );
}

export default App;
