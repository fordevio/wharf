import { useEffect, useState } from "react"
import { getAllContainers } from "../../../api/container"
import { DockerContainer } from "../../../models/container"
import ContainerCard from "./Container-card"
import './index.css'


const Containers = () => {
  const [containers, setContainers]= useState<DockerContainer[]>([])
  
  const fetchContainers = async () => {
    try{
      const res = await getAllContainers(localStorage.getItem('token') as string)
      setContainers(res.data)
    }catch(e){
      console.log(e)  
    }
  }
  useEffect(()=>{
    fetchContainers()
  },[])

  return (
    <>
      <div className="card-container">
        {containers.map((container, index) => {
          return (
           <ContainerCard key={index} containerId={container.Id} />
          )
        })}
      </div>
    </>
  )
}

export default Containers