import axios, { AxiosResponse } from "axios";
import ToastService from "./ToastService";
import { ResponseBody } from "./model/ResponseBody";

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`, // Fallback to localhost if environment variable is not set
  headers: {
    "Content-Type": "application/json",
  },
});

//Set up interceptor to add the Authorization header on each request
axiosInstance.interceptors.request.use((config) => {
  const token = window.localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// axios.defaults.headers.common[
//   "Authorization"
// ] = `Bearer ${window.localStorage.getItem('token')}`;

export abstract class ApiCall {

    public static async Get<T>(url:string){
        try{
           
            const call = await axiosInstance.get<ResponseBody<T>>(url)
            if(call.status == 200){
              return call.data;
            }
        }
        catch(error:any){
            if (axios.isAxiosError(error)) {
                ToastService.error(error.message);
        
              } else {
                ToastService.error(error);
              }
        }
    }
    
    
    // public static async GetAll(urls:string[]): Promise<any[]>{
    //   var gets =
    //   urls.map((uri)=>{return this.Get<any>(uri).then(response=>response.data)});
    //   return Promise.all(
    //     gets
    //   )
    // }

    public static async Post<T>(url:string,body:any){
        try{
          
              const call = await axiosInstance.post(url,body);
              if(call.status != 200) {
                ToastService.error(call.statusText)
              }
              const data : T = call.data.data;

              return data;
            
        }
        catch(error:any){
            if (axios.isAxiosError(error)) {
                ToastService.error(error.message);
        
              } else {
                ToastService.error(error);
              }
        }
    }

    public static verifFormat(jsonData:any){

      const json = JSON.parse(JSON.stringify(jsonData));

      //Format for Orga Model
      if(typeof json.product == "object"){
        json["product_id"] = json["organization"].id
        delete json["product"];
      }
      if(typeof json.product=="string"){
        json["product_id"] = json["product"]
        delete json["product"];
      }

      return json;

    }

    public static async Put<T>(url:string,body:T){
        try{
            
              const call = await axiosInstance.put(url,body);

              if(call.status != 200) {
                ToastService.error(call.statusText)
              }
              const data : T = call.data.data;

              return data;
        }
        catch(error:any){
            if (axios.isAxiosError(error)) {
                ToastService.error(error.message);
        
              } else {
                ToastService.error(error);
              }
        }
    }

    public static async Delete<T>(url: string) {
      try {
          const uri = axiosInstance.getUri({ url });
          const call: AxiosResponse<ResponseBody<T>> = await axiosInstance.delete(uri);

          if (call.status === 200) {
              return call.data.data;
          }
          ToastService.error(call.statusText);
          return null;
      } catch (error:any) {
        if (axios.isAxiosError(error)) {
          ToastService.error(error.message);
  
        } else {
          ToastService.error(error);
        }
      }
  }
}