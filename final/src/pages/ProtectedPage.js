import React, { useState,useEffect } from "react";
import axios from "axios";
import AWS from 'aws-sdk';



export default function ProtectedPage() {
  const [imageUrls, setImageUrls] = useState([]);
  const [file, setFile] = useState();
  const [uploadingStatus, setUploadingStatus] = useState();

  const selectFile = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadFile = async () => {
    setUploadingStatus("Uploading the file to AWS S3");

    let { data } = await axios.post("/api/upload", {
      name: file.name,
      type: file.type,
    });

    console.log(data);

    const url = data.url;
    let { data: newData } = await axios.put(url, file, {
      headers: {
        "Content-type": file.type,
        "Access-Control-Allow-Origin": "*",
      },
    });

    setFile(null);
  };
  const s3 = new AWS.S3({
    accessKeyId: "",
    secretAccessKey: "",
    region: "us-east-1",
  });
  
  const getImageUrlsFromS3 = async () => {
    const params = {
      Bucket: 'chefomardee-testing',
    };
  
    try {
      const response = await s3.listObjectsV2(params).promise();
  
      const images = response.Contents.filter((file) =>
        ['.jpg', '.jpeg', '.png', '.gif'].includes(
          file.Key.substring(file.Key.lastIndexOf('.'))
        )
      );
  
      const imageUrls = images.map((image) =>
        s3.getSignedUrl('getObject', {
          Bucket: params.Bucket,
          Key: image.Key,
        })
      );
      console.log(imageUrls)
      return imageUrls;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  useEffect(() => {
    async function fetchData() {
      const urls = await getImageUrlsFromS3();
      setImageUrls(urls);
    }
    fetchData();
  }, []);

  return (
    <div className="container flex items-center p-4 mx-auto min-h-screen justify-center">
      <main>
        <p>Please select a file to upload</p>
        <input type="file" onChange={(e) => selectFile(e)} />
        {file && (
          <>
            <p>Selected file: {file.name}</p>
            <button
              onClick={uploadFile}
              className=" bg-purple-500 text-white p-2 rounded-sm shadow-md hover:bg-purple-700 transition-all"
            >
              Upload a File!
            </button>
          </>
        )}
        {uploadingStatus && <p>{uploadingStatus}</p>}
      </main>
      {imageUrls.map((url) => (
        <React.Fragment>
          <a href={url} key={url}target="_blank" rel="noopener noreferrer">
            {url}
          </a>
        </React.Fragment>
      ))}
    </div>
  );
}