export class ProductDiscount{
    constructor(
        public id:string,
        public name:String,
        public categoryId:string,
        public categoryName:string,
        public description:string,
        public price: Number,
        public status:Number,
        public discount:Number,
        public discountedPrice:Number,
        public image:String,
        public image2:String,
        public image3:String
    ){

    }
}