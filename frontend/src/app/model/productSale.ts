export class ProductSale{
    constructor(
    public id:number,
    public name:String,
    public price:number,
    public image:String,
    public discountedPrice:number,
    public status:number,
    public count:number){}
}