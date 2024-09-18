import React from 'react'
import { DockerContainer } from '../../../../models/container'


interface Props {
    container: DockerContainer
}
const ContainerCard: React.FC<Props> = ({container}) => {
  return (
    <div className='cont-card'>
        <h1>{container.Names[0]}</h1>
    </div>
  )
}

export default ContainerCard