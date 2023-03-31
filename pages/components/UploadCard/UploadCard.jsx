import React from "react";
import AWS from 'aws-sdk'
import UploadCardStyles from "./UploadCardStyles.module.css";
// import { BsFillPlayFill } from "react-icons/bs";
// import { HiPause } from "react-icons/hi";
// import { RxCross2 } from "react-icons/rx";
import { ACCESS_KEY, S3_REGION, S3_BUCKET_NAME, SECRET_ACCESS_KEY } from "../../../awsconfig";
const abortController = new AbortController();


// const config = {
//   bucketName: S3_BUCKET_NAME,
//   region: S3_REGION,
//   accessKeyId: ACCESS_KEY,
//   secretAccessKey: SECRET_ACCESS_KEY,
// }

AWS.config.update({
  accessKeyId: ACCESS_KEY,
  secretAccessKey: SECRET_ACCESS_KEY
})

const myBucket = new AWS.S3({
  params: { Bucket: S3_BUCKET_NAME},
  region: S3_REGION,
})



const UploadCard = (props) => {
  const [file, setFile] = React.useState(null);
  const [fileName, setFileName] = React.useState("");
  const [fileSize, setFileSize] = React.useState("");
  const [uploading, setUploading] = React.useState(false);
  const [uploadPercent, setuploadPercent] = React.useState(null);

  const inputRef = React.useRef();

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const onUploadProgress = (progressEvent) => {
    console.log("progressEvent: ", progressEvent);
    const { loaded, total } = progressEvent;
    let percent = Math.floor((loaded * 100) / total);
    if (percent <= 100) {
      setuploadPercent(percent);
      console.log(`${loaded} bytes of ${total} bytes. ${percent}%`);
    }
  };

  const convertArrayBufferToBase64 = (buffer) => {
    let TYPED_ARRAY = new Uint8Array(buffer);
    const STRING_CHAR = TYPED_ARRAY.reduce((data, byte) => {
      return data + String.fromCharCode(byte);
    }, "");
    return btoa(STRING_CHAR);
  };


  const uploadFile = (file) => {
    setUploading(true);
    const params = {
        ACL: 'public-read',
        Body: file,
        Bucket: S3_BUCKET_NAME,
        Key: file.name
    };

    myBucket.putObject(params)
        .on('httpUploadProgress', (evt) => {
            setuploadPercent(Math.round((evt.loaded / evt.total) * 100))
        })
        .send((err) => {
    setUploading(false);
            if (err) console.log(err)
            console.log("Uploaded...!");
            props.setVideoData(URL.createObjectURL(file));
        })
}

  const handleUploadFile = async (file) => {
    try {
      setFileName(file.name);
      setUploading(true);
      const fileReader = new FileReader();
      // fileReader.readAsArrayBuffer(file);
      // fileReader.onload = async (fileEvent) => {
        // const videoBuffer = fileEvent.target.result;
        // const originalFile = structuredClone(file);
        // setFile(videoBuffer);
        // const fileBlob = new Blob([videoBuffer])
        const uploadToS3 = await uploadFile(file, config, onUploadProgress);
        console.log("uploadToS3: ", uploadToS3);
        setUploading(false);
        // axios.defaults.headers = {
        //   Authorization:
        //     "Bearer ZXlKaGJHY2lPaUpJVXpVeE1pSXNJbnBwY0NJNklrZGFTVkFpZlEuSDRzSUFBQUFBQUFBQUt0V3lpckpWTEpTcXNvc3lzOG9Mc2t2U2xYU1VTb3VUUUlLT1dka0ZpWG1aYVdtbG1VYUdqcUFGZWdsNS1jQzVUTVRTNVNzRE0xTWpZek1UU3dzaldzQkoxLWctRVVBQUFBLklXNnZOTExweHRwRThHV1ExT0Jlc1UxLVY4dWVsMExwWnlVbmJWRWtWNld6TmgzM0RvOENnWGV1S245d3FlZVNyX3FmcVZSaE02Z1ptZG5GN29aWWFR",
        // };
        // const formdata = new FormData();
        // const fileBlob = new Blob([videoBuffer]);
        // formdata.append("file", fileBlob, "fileName.mp4");
        // const uploadeResult = await axios.post(
        //   "https://vault-svc1.dev.ziroh.com/upload/api/v1/fileserver/upload",
        //   formdata,
        //   { signal: abortController.signal, onUploadProgress }
        // );
        // if (uploadeResult.status === 200) {
        //   if (uploadeResult.data.errorCode === 0) {
        //     console.log("file uploaded");
        //     const fileBase64 =  convertArrayBufferToBase64(videoBuffer);
        //     props.setVideoData(fileBase64);
        //     setUploading(false);
        //   }
        // }
      // };
    } catch (err) {
      setUploading(false);
      console.log("{CATCH} err: ", err);
    }
  };

  const handleOnDrop = (e) => {
    e.preventDefault();
    const file = Array.from(e.dataTransfer.files)[0];
    if (file.type !== "video/mp4") {
      alert("Only Mp4 supported");
      return;
    }
    setFile(file);
    setFileName(file.name);
    setFileSize(file.size);
    uploadFile(file);
  };

  const handleOnChange = (e) => {
    const file = e.target.files[0];
    setFile(e.target.files[0]);
    setFileName(file.name);
    setFileSize(file.size);
    uploadFile(file);
  };

  const handleStopUploading = () => {
    abortController.abort();
    setUploading(false);
    console.log("Stoppped!!!!!");
  };

  console.log(uploadPercent);
  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleOnDrop}
      className={UploadCardStyles.background}
    >
      <h1>You can upload video</h1>
      <p>CLICK ON THE BUTTON OR DRAG&DROP FILES HERE</p>
      <input
        onChange={handleOnChange}
        ref={inputRef}
        type="file"
        accept="video/mp4"
        hidden
      />
      <div
        onClick={() => {
            setFile(null);
            setUploading(false);
            setuploadPercent(null);
            inputRef.current.click()
        }}
        className={UploadCardStyles.UploadBtn}
      >
        Upload Video
      </div>
      {uploading && (
        <div className={UploadCardStyles.videoUploadingActions}>
          {/* <div className={UploadCardStyles.ResumePause}>
            <BsFillPlayFill size={40} color="red" />
          </div> */}
          <div className={UploadCardStyles.right}>
            <span>File({fileSize/1000000}mb): {fileName} is Uploading...</span>
            <progress
              className={UploadCardStyles.Progress}
              id="file"
              max="100"
              value={uploadPercent}
            >{uploadPercent}</progress>
          </div>
          {/* <RxCross2
            onClick={handleStopUploading}
            color="#fff"
            className={UploadCardStyles.stopUploading}
          /> */}
        </div>
      )}
    </div>
  );
};

export default UploadCard;
