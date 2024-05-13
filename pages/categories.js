import {redirect} from "next/navigation";

const Categories = () => {
  
  return (
    <div>Categories</div>
  )
}

export default Categories

export const getServerSideProps = () => {
  return {
    redirect: {
      destination: "/maintenance",
      permanent: false
    }
  }

  // return {
  //   props: {

  //   }
  // }
}