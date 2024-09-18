import axios, { AxiosResponse } from "axios"
import { hostUrl } from "../utils/util"
import { DockerContainer } from "../models/container"


const URL = hostUrl()

export const getAllContainers = async (token: string):Promise<AxiosResponse<DockerContainer[]>> => {
    const url = URL + "/api/protected/container/getAll"
    const res = await axios.get<DockerContainer[]>(url, {
        headers: {
            'Token': token
        }
    })
    return res

}

