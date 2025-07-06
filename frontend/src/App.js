import Dashboard from "./components/Dashboard/Dashboard";
import Login from "./components/Login/Login";
import Members from "./components/Members/Members";
import Notification from "./components/Notification/Notification";
import AddMember from "./components/AddMember/AddMember";
import ActivityLog from "./components/ActivityLog/ActivityLog";
import Setting from "./components/Setting/Setting";
import StaffMemberPage from "./components/StaffMember/StaffMemberPage";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PrivateComponent from "./components/PrivateComponent/PrivateComponent";
import SteamBath from "./components/Steam Bath/SteamBath";
import Transaction from "./components/Transaction/Transaction";
import NotFoundPage from "./components/NotFoundPage/NotFoundPage";

function App() {
  return (
    <div >
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />}></Route>
          <Route path='/Dashboard' element={
            <PrivateComponent>
              <Dashboard />
            </PrivateComponent>
          }></Route>
          <Route path='/Members' element={
            <PrivateComponent>
              <Members/>
            </PrivateComponent>} >
            </Route>
          <Route path='/AddMember' element={<PrivateComponent>
              <AddMember />
            </PrivateComponent>}></Route>
          <Route path='/Notification' element={<PrivateComponent>
              <Notification/>
            </PrivateComponent>}></Route>
            <Route path='/steamBath' element={<PrivateComponent>
              <SteamBath/>
            </PrivateComponent>}></Route>
            <Route path='/Transaction' element={<PrivateComponent>
              <Transaction/>
            </PrivateComponent>}></Route>
          <Route path='/ActivityLogs' element={<PrivateComponent>
              <ActivityLog/>
            </PrivateComponent>}></Route>
          <Route path='/Setting' element={<PrivateComponent>
              <Setting/>
            </PrivateComponent>}></Route>
            <Route path='/StaffMember' element={<PrivateComponent>
              <StaffMemberPage/>
            </PrivateComponent>}></Route>
            <Route path='/*' element={<PrivateComponent>
              <NotFoundPage/>
            </PrivateComponent>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
