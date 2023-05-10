import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import SpotsIndex from "./components/SpotsIndex/SpotsIndex";
import SpotsDetail from "./components/SpotDetails/SpotDetails";
import SpotDetails from "./components/SpotDetails/SpotDetails";
import CreateSpotForm from "./components/CreateSpotForm";
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


          <Route path="/spots/new">
            <CreateSpotForm></CreateSpotForm>
          </Route>


          <Route path="/spots/:spotId" exact>
            <SpotDetails></SpotDetails>
          </Route>

        </Switch>}
    </>
  );
}

export default App;
