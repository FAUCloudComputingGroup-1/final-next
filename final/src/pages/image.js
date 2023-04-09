
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/router'
import React from 'react';
let image=()=>{
    const router = useRouter();
    const data = router.query;
    console.log(data)
    return(
        <React.Fragment>
        <img src={data.imgname}  alt="uploaded image"  />

        </React.Fragment>
    )
}
export const getServerSideProps = withPageAuthRequired()
export default image

