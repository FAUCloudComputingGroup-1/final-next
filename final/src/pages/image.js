import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/router'
import React, { useState, useEffect } from "react";
import axios from "axios";


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
        <React.Fragment>
            <img src={data.imgname} alt="uploaded image" />
            <p>image size: {imageMeta?.size} bytes</p>
            <p>image name: {imageMeta?.name} </p>
            <p>image width: {imageMeta?.width} pixels</p>
            <p>image height: {imageMeta?.height} pixels</p>

            <button onClick={handleClick}>{isDeleting ? "Deleting..." : "Delete Object"}</button>
        </React.Fragment>
    )
}

export const getServerSideProps = withPageAuthRequired()
export default image
