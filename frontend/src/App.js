import Dashboard from "./components/Dashboard/Dashboard";
import Login from "./components/Login/Login";
import Members from "./components/Members/Members";
import {BrowserRouter,Routes,Route} from 'react-router-dom' 

function App() {
  return (
    <div >
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />}></Route>
          <Route path='/Dasboard' element={<Dashboard />}></Route>
          <Route path='/Members' element={<Members />}></Route>
        </Routes>

      </BrowserRouter>
        {/* <Login/>
        <div className="text-3xl font-bold underline">Login  & Forgot password method </div>
        <div>Store and view Data </div>
        <div>Dashboard with Data Analaytic</div>
        <div>Add a member info</div> */}
    </div>
  );
}

export default App;