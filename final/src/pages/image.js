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
        <Link href="/ProtectedPage">
  <span className={`${styles.navlink} ${styles.button}`}>
    Back
  </span>
</Link>
<br></br>
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
        <button className={styles.button} onClick={handleClick}>{isDeleting ? "Deleting..." : "Delete Object"}</button>
      </div>
    );
}

export const getServerSideProps = withPageAuthRequired()
export default image
