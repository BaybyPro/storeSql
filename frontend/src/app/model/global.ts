export class Global{
    //message
    public static genericError:string="Something went wrong, Please try again later";
    public static unauthroried: string="You are not authorized person to access this page."

    //regex
    public static nameRegex:string ="[a-zA-Z0-9 ]*"
    public static datesNames:string ="[a-zA-Z\\s]*"
    public static datesNumber:string ="[0-9]*"
    public static emailRegex:string ="[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}"
    public static contacNumberRegex:string ="^[0-9]{9,10}$"

    public static error :string = "error"

    //HTTP
    public static apiUrl:String="http://127.0.0.1:8080"
}