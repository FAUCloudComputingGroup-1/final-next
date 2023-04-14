import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Link from "next/link";
import styles from "../styles/ProtectedPage.module.css";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { useUser } from "@auth0/nextjs-auth0/client";

function ProtectedPage() {
  const [imageUrls, setImageUrls] = useState([]);
  const [file, setFile] = useState(null);
  const [uploadingStatus, setUploadingStatus] = useState("");
  const [imgMeta, setImgMeta] = useState({ height: null, width: null, size: null });
  const [count, setCount] = useState(0);
  const { user, error, isLoading } = useUser();
  const [isReady, setIsReady] = useState(false);

  const selectFile = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    console.log(file)
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const { size } = selectedFile;
        const { width, height } = img;
        const storageSize = reader.result.length;
        setImgMeta({ height, width, size });
        console.log(`Size: ${size} bytes`);
        console.log(`Width: ${width}px`);
        console.log(`Height: ${height}px`);
        console.log(`Storage Size: ${storageSize} bytes`);
      };
      img.src = reader.result;
    };
  };
  const uploadFile = async () => {
    if (!file) return;
    setUploadingStatus("Uploading the file to AWS S3");
    const { data } = await axios.post("/api/upload", {
      name: file.name,
      type: file.type,
      ...imgMeta,
    });
    if (user?.sub) {
      const url = data.url;
      console.log(user.sub);
      const tags = { user: user.sub.replace("|", "") };
      const tagString = Object.entries(tags)
        .map(([key, value]) => `${key}=${value}`)
        .join("&");
      await axios.put(url, file, {
        headers: {
          "Content-type": file.type,
          "Access-Control-Allow-Origin": "*",
          "x-amz-tagging": tagString,
        },
      });
    }
    setFile(null);
    setImgMeta({ height: null, width: null, size: null });
    setCount((prev) => prev + 1);
    setUploadingStatus("Uploaded")
  };
  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          const response = await axios.get("/api/getimage", {
            params: {
              userSub: user.sub,
            },
          });
          setImageUrls(response.data);
          setIsReady(true);
        } catch (error) {
          console.error(error);
          setImageUrls([]);
          setIsReady(true);
        }
      };
      fetchData();
    }
  }, [count, user]);

  const renderedImageUrls = useMemo(() => {
    return imageUrls.map((url) => (
      <React.Fragment key={url}>
        <Link
          href={{
            pathname: '/image',
            query: {
              imgname: url,
            } // the data
          }}
        >
          <img src={url} className={styles.img} alt="uploaded image"  />
        </Link>
      </React.Fragment>
    ));
  }, [imageUrls]);

  return (
    <div className="container flex items-center p-4 mx-auto min-h-screen justify-center">
    {/* File Upload Section */}
    <main className={styles.fileUpload}>
      <p className={styles.selectFile}>Please select a file to upload</p>
      <p className={styles.selectFile}>You may click any image to look at its meta data as well as look at options such as deleting and downloading</p>
      <br></br>
      <div className={styles.inputWrapper}>
        <input
          id="inputFile"
          type="file"
          onChange={selectFile}
          className={styles.input}
        />
        <center><button className={styles.button}>Choose File</button></center>
        <br></br>
        <span className="file-name">{file ? file.name : ""}</span>
      </div>
      {file && (
        <React.Fragment>
           <button
            onClick={uploadFile}
            className={styles.button}
          >
            Upload a File!
          </button>
        </React.Fragment>
      )}
      {uploadingStatus && <p>{uploadingStatus}</p>}
    </main>

    <div className={styles.container}>
      {isReady &&
        imageUrls.map((url) => (
          <React.Fragment key={url}>
            <Link
              href={{
                pathname: '/image',
                query: {
                  imgname: url,
                },
              }}
            >
              <img
                src={url}
                className={styles.img}
                alt="uploaded image"
              />
            </Link>
          </React.Fragment>
        ))}
    </div>
  </div>

  );
}
export const getServerSideProps = withPageAuthRequired()
export default ProtectedPage