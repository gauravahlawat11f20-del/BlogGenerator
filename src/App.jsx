import { useState } from 'react'

import './App.css'
import Operations from './OperationsWithFirebase/Operations'
import Adminauth from './OperationsWithFirebase/Adminauth'
import ImageUpload from './PhotosoperationIwthFirebase/ImageUpload'
import PlaceWhereFoldersShown from './PhotosoperationIwthFirebase/PlaceWhereFoldersShown'
import PhotoWillShowThere from './PhotosoperationIwthFirebase/PhotoWillShowThere'
import { BrowserRouter ,Routes , Route } from 'react-router-dom'
import UserLoginAndregister from './JOBLISTAPPLICATION/UserEndComponents/UserLoginAndregister'
import MainDashboardd from './JOBLISTAPPLICATION/UserEndComponents/MainDashboard/MainDashboardd'
import CreateBlog from './JOBLISTAPPLICATION/UserEndComponents/MainDashboard/CreateBlog'
import SelectTheme from './JOBLISTAPPLICATION/UserEndComponents/MainDashboard/SelectTheme'
import MinimalCleanTheme from './JOBLISTAPPLICATION/BLOGDesignsss/MinimalCleanTheme'
import CreativeFlowTheme from './JOBLISTAPPLICATION/BLOGDesignsss/CreativeFlowTheme'
import PublishProject from './JOBLISTAPPLICATION/UserEndComponents/PublishProject'
import ProfileInfo from './JOBLISTAPPLICATION/UserEndComponents/ProfileInfo'
import ExploreBlogs from './JOBLISTAPPLICATION/UserEndComponents/MainDashboard/ExploreBlogs'
import Comment from './JOBLISTAPPLICATION/UserEndComponents/MainDashboard/Comment'
import Notification from './JOBLISTAPPLICATION/UserEndComponents/MainDashboard/Notification'
import Edit from './JOBLISTAPPLICATION/UserEndComponents/Edit'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>

    <BrowserRouter>
     <Routes>
      <Route path='/' element={<UserLoginAndregister/>}/>
      <Route path='/dash/:Name' element={  <> <MainDashboardd/>  <ExploreBlogs/>   </>}/>
       <Route path='/selectTheme' element={<SelectTheme/>}/>
        <Route path='/create/:Name' element={<CreateBlog/>}/>
        <Route path='/MinimalCleanTheme/:Title' element={<MinimalCleanTheme/>}/>
         <Route path='/Editorial/:Title' element={<CreativeFlowTheme/>}/>
         <Route path='/upload/:Theme/:Title' element={<PublishProject/>} />

          <Route path="/urProfile/:Name" element={<ProfileInfo/>}/>

           <Route path="/comment/:blogId" element={<Comment/>}/>

           <Route path="/notification" element={<Notification/>}/>



           
           <Route path="/edit" element={<Edit/>}/>

     </Routes>
    </BrowserRouter>

    

    </>
  )
}

export default App
