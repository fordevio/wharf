
import axios from 'axios';
import { hostUrl } from '../utils/util';
import { AxiosResponse } from 'axios';
import { IsAdminAvailableRes } from '../models/login';



const URL = hostUrl()

export const isAdminAvailable = async():Promise<AxiosResponse<IsAdminAvailableRes>>=>{
    const url = URL+"/api/auth/isAdmin"
    const res = await axios.get<IsAdminAvailableRes>(url)
    return res
}