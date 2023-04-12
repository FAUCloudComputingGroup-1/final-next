import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/router'
import React, { useState, useEffect } from "react";
import axios from "axios";


let image=()=>{
    const router = useRouter();
    const data = router.query;
    const [isDeleting, setIsDeleting] = useState(false);
    const [url,setURL]=useState(data.imgname)

    const handleClick = async () => {
        setIsDeleting(true);
        if(url){
          try {
            console.log("b4")
            console.log(url)
            console.log("after")
            const response = await axios.delete(`/api/image?url=${url}`);
            // console.log(response.data);
          } catch (err) {
            console.log(err);
          }
      
          setIsDeleting(false);
          router.push('/ProtectedPage'); // Redirect to the "home" page

        }
      };

    return(
        <React.Fragment>
        <img src={data.imgname}  alt="uploaded image"  />
        <p>image size:</p>
        <p>image name:</p>
        <p>image width:</p>
        <p>image height:</p>

        <button onClick={handleClick}>{isDeleting ? "Deleting..." : "Delete Object"}</button>    
        </React.Fragment>
    )
}
export const getServerSideProps = withPageAuthRequired()
export default image
