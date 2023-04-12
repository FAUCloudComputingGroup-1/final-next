import React, { useState, useEffect, useMemo, useCallback } from "react";
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
      <main>
        <p>Please select a file to upload</p>
        <input type="file" onChange={selectFile} />
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

  <div className={styles.container}>
    {isReady && imageUrls.map((url) => (
      <React.Fragment key={url}>
      <Link
        href={{
          pathname: '/image',
          query: {
            imgname:url,
          } 
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