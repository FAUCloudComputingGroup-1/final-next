import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/router'
import React, { useState, useEffect } from "react";
import axios from "axios";


let image=()=>{
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();
    const data = router.query;
    console.log(data)

    const handleClick = async () => {
        setIsDeleting(true);
    
        try {
          const response = await axios.delete("/api/image");
          console.log(response.data);
        } catch (err) {
          console.log(err);
        }
    
        setIsDeleting(false);
      };

    return(
        <React.Fragment>
        <img src={data.imgname}  alt="uploaded image"  />
        <button onClick={handleClick}>{isDeleting ? "Deleting..." : "Delete Object"}</button>    
        </React.Fragment>
    )
}
export const getServerSideProps = withPageAuthRequired()
export default image
