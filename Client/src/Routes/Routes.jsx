import {
  Routes,
  Route,
} from "react-router-dom";
import Login from "../Pages/Login/Login";
import Error from "../Pages/404/Error";
import User from "../Pages/User/User";
import Admin from "../Pages/Admin/Admin";
import ProtectedRoute from "../Utils/protectedRoutes/ProtectedRoute";
import Register from "../Pages/Login/Register";
import Connections from "../Components/Connections/Connections";
import Network from "../Components/Network/Network";
import Addconnection from "../Components/Addconnections/Addconnection";
import Persondata from "../Pages/personData/Persondata";
import Profile from "../Pages/personData/Profile"
import Interlinks from "../Pages/personData/Interlinks";
import Mom from "../Pages/personData/Mom";
import Infograph from "../Pages/personData/Infograph";
import Graph from "../Pages/personData/Graph";

function RoutesController() {


  return (
    <div style={{ height: "100%", width: "100%" }}>
        <Routes>
            <Route path="/login" element={<Login />}/>
            <Route path="*" element={<Error />}/>
            <Route path="/404" element={<Error />}/>
            <Route path="/register" element={<Register />}/>
            <Route path="/admin/:uuid/person-details" element={
              <ProtectedRoute allowedRoles={['user', 'admin']}>
                <Persondata />
              </ProtectedRoute>
              }>
              <Route path="" element={<Profile />} />
              <Route path="interlinks" element={<Interlinks />} />
              <Route path="minutes-of-meeting" element={<Mom />} />
              <Route path="graph" element={<Graph />} />
              <Route path="info-graph" element={<Infograph />} />
            </Route>
            <Route path="/" element={
              <ProtectedRoute allowedRoles={["user"]}>
                <User />
              </ProtectedRoute>
            }/>
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Admin />
              </ProtectedRoute>
            }>
              <Route path="myconnections" element={<Connections />} />
              <Route path="network" element={<Network />} />
              <Route path="add-connection" element={<Addconnection />} />
            </Route>
        </Routes>
    </div>
  );
}

export default RoutesController;
