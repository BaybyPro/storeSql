export class Product{
    constructor(
        public id:string,
        public name:String,
        public categoryId:string,
        public categoryName:string,
        public descrption:string,
        public price: Number,
        public status:Number,
        public discount:Number,
        public image:String,
        public image2:String,
        public image3:String
    ){

    }
}