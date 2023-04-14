import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/router'
import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from '../styles/image.module.css';
import Link from 'next/link';


let image = () => {
    const router = useRouter();
    const data = router.query;
    const [isDeleting, setIsDeleting] = useState(false);
    const [url, setURL] = useState(data.imgname);
    const [imageMeta, setImageMeta] = useState(null);
    
    const handleDownload = () => {
      if(imageMeta?.name){
        fetch(imageMeta?.name)
          .then((response) => response.blob())
          .then((blob) => {
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', imageMeta?.name);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
          });
        }
      }

    const handleClick = async () => {
        setIsDeleting(true);
        if (url) {
            try {
                const response = await axios.delete(`/api/image?url=${url}`);
            } catch (err) {

            }

            setIsDeleting(false);
            router.push('/ProtectedPage'); // Redirect to the "home" page
        }
    };

    useEffect(() => {
        const getImageMeta = async () => {
            try {
                const response = await axios.get('/api/getimagemeta?url=' + url);
                setImageMeta(response.data);
            } catch (err) {
            }
        };
        getImageMeta();
    }, []);

    return (
      <div className={styles.container}>
        <div className={styles.buttonWrapper}>
          <Link href="/ProtectedPage">
            <span className={`${styles.button} ${styles.downloadButton}`}>
              Back
            </span>
          </Link>
          <br></br>
          <button className={`${styles.button} ${styles.downloadButton}`} onClick={handleDownload}>Download Image</button>
          <br></br>
          <button className={`${styles.button} ${styles.deleteButton}`} onClick={handleClick}>{isDeleting ? "Deleting..." : "Delete Object"}</button>
        </div>
        <div className={styles.imageWrapper}>
          <img
            src={data.imgname}
            alt="Medium sized image"
            width={300}
            height={300}
            className={styles.image}
          />
        </div>
        <div className={styles.metaData}>
          <p>image size: {imageMeta?.size} bytes</p>
          <p>image name: {imageMeta?.name} </p>
          <p>image width: {imageMeta?.width} pixels</p>
          <p>image height: {imageMeta?.height} pixels</p>
        </div>
      </div>

    );
    
}

export const getServerSideProps = withPageAuthRequired()
export default image
