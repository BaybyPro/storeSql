export class MyJwtPayload  {
    constructor(
       public email:String,
       public role:string,
       public iat:Number,
       public  exp:number
    ){

    }
}