import React from 'react'
import AppStyles from '../styles/index.module.css';
import UploadCard from './components/UploadCard/UploadCard';

const App = () => {
  const [videoData, setVideoData] = React.useState(null);
  console.log("videoData: ", videoData);
  return (
    <div className={AppStyles.background}>
      {videoData &&
      <video src={videoData} controls autoPlay></video>
      }
      {/* <UploadImageToS3WithNativeSdk /> */}
      <UploadCard setVideoData={setVideoData}/>
    </div>
  )
}

export default App;