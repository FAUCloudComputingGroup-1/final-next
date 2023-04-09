
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
let image=()=>{

    return(
        <React.Fragment>
            
        </React.Fragment>
    )
}
export const getServerSideProps = withPageAuthRequired()
export default image

