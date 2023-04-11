import React, { useState,useEffect,useRef} from "react";
import axios from "axios";
import Link from "next/link";
import AWS from 'aws-sdk';
import styles from '../styles/ProtectedPage.module.css';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useUser } from '@auth0/nextjs-auth0/client';

function ProtectedPage() {
  var { isLoading , user, error}= useUser()
  let [count,setCount] = useState(0);
  user?console.log(user):console.log("nothing yet")
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
    setCount(++count)
    console.log(count)
  };

  async function fetchData() {
    if (user) {
      try {
        const response = await axios.get('/api/getimage', {
          params: {
            userSub: user.sub,
          },
        });
        setImageUrls(response.data);
      } catch (error) {
        console.error(error);
        setImageUrls([]);
      }
    }
  }

  useEffect(() => {
    fetchData();
  }, [count,user]);

  return (
<div className="container flex items-center p-4 mx-auto min-h-screen justify-center">
  {/* File Upload Section */}
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

  {/* Uploaded Images Section */}
  <div className={styles.container}>
    {imageUrls.map((url) => (
      <React.Fragment key={url}>
        {/* <a href={url} className={styles.a}>
          import Link from 'next/link' */}

      <Link
        href={{
          pathname: '/image',
          query: {
            imgname:url,
          } // the data
        }}
      >
      <img src={url} className={styles.img} alt="uploaded image"  />
      </Link>

      </React.Fragment>
    ))}
  </div>
</div>
  );
}
export const getServerSideProps = withPageAuthRequired()
export default ProtectedPage