import { useEffect } from "react";
import { useRouter } from "next/router";
import { redirect } from "next/navigation";

const Gossip = () => {
  const router = useRouter();
  useEffect(() => {
    router.push('/maintenance');
  }, [])

  return (
    <div>Gossip</div>
  )
}

export default Gossip

export const getServerSideProps = () => {
  return {redirect: {
    destination: "/maintenance",
    permanent: false
  }}

  return {
    props: {

    }
  }
}