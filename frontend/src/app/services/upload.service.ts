import { Injectable } from '@angular/core';
import { Global } from '../model/global';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  public url: any;

  constructor() { 
    this.url = Global.apiUrl
  }

  makeFileRequest(url:string,params:Array<String>,files:Array<File>, names:Array<string>){

    return new Promise(function(resolve, reject){
         const formData:any = new FormData();
         var xhr = new XMLHttpRequest();

         for(var i = 0;i< files.length; i++){
           formData.append(names[i], files[i], files[i].name)
         }

         xhr.onreadystatechange = ()=>{
          if(xhr.readyState == 4){
            if(xhr.status == 200){
              resolve(JSON.parse(xhr.response));
            }else{
              reject(xhr.response)
            }
          }
         }
         xhr.open('POST',url,true);
         xhr.send(formData);
    })

  }
}
