import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ProductService } from '../../product-list/product.service';
import { CartService } from './cart-service/cart.service';
import { MatDialog } from '@angular/material/dialog';
import { confirmDialog } from 'src/app/shared/dialog-box/confirm/confirm.component';
import { messageDialog } from 'src/app/shared/dialog-box/message/message.component';
import { CommonService } from '../../common.service';


interface SliderImage {
  image: string,
  thumbImage: string,
  title: string
}

@Component({
  selector: 'app-product-details-page',
  templateUrl: './product-details-page.component.html',
  styleUrls: ['./product-details-page.component.scss']
})
export class ProductDetailsPageComponent implements OnInit {
  public quantity: number = 1;
  imageObject: SliderImage[] = [];

  id!: any;
  productData: any;
  items: any;
  cartData: any;

  enableZoom: boolean = true;
  previewImageSrc: any;
  zoomImageSrc: any;
  isMobile : boolean = false;

  constructor(
    private route: ActivatedRoute, 
    public productService: ProductService, private cartService: CartService, public myRoute: Router,
    private commonService: CommonService,
    private dialog: MatDialog
  ) { 
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(navigator.userAgent)) {
      this.isMobile = true
    }
  }

  ngOnInit(): void {
    let id = this.route.snapshot.paramMap.get('id');
    this.cartData = this.cartService.getItemData();
    this.getProductDetials(id);
    // this.items = this.cartService.getItems();
  }

  getProductDetials(id: any) {
    this.productService.productDetialsApi(id).subscribe((data) => this.getProductdetialsApi(data));
  }
  getProductdetialsApi(data: any) {
    if (data.status === true) {
      this.productData = data.data;
      this.previewImageSrc = this.productData.productImg;
      this.zoomImageSrc = this.productData.productImg;

      this.imageObject.unshift({
        image: this.productData.productImg,
        thumbImage: this.productData.productImg,
        title: ''
      });

      this.productData.thumbnailImgs.forEach((element: any) => {
        let obj = {
          image: element,
          thumbImage: element,
          title: ''
        }
        this.imageObject.unshift(obj);
      });
    }
  }

  changeImage(index: number){
    this.previewImageSrc = this.imageObject[index].image;
    this.zoomImageSrc = this.imageObject[index].image;
  }

  increment() {
    if (this.quantity === 1) {
      this.commonService.openSnackBar("You can add maximum 1 quantity", 'Dismiss');
    }
    else {
      this.quantity += 1;
    }
  }

  decrement() {
    if (this.quantity === 1) {
      this.quantity = 1
    } else {
      this.quantity -= 1;
    }
  }

  reset() {
    this.quantity = 0;
  }

  addtoCart(productData: any): any {

    if(this.cartData.length > 1 ){
      this.commonService.openSnackBar("You can add maximum 1 product in a cart", 'Dismiss');
      return;
    }

    if (!productData.productDetails[0].stockAvailability) {
      this.dialog.open(messageDialog, {
        data: {
          message: "Stock is not available. Please try after some time."
        }
      });
      return false;
    }

    if (localStorage.getItem('LoggedInUser')) {
      this.cartService.addToCartOnBackend({
        "productDetails": [
          {
            "productId": productData._id,
            "quantity": this.quantity,
            "sizes": productData.productDetails[0].sizes
          }
        ]
      }).subscribe((response: any) => {

        if (response.status) {
          let totalvalue = this.productData.price * this.quantity
          let productdata = {
            _id: productData._id,
            // productCategoryID: productData.productCategoryID,
            productTitle: productData.productTitle,
            price: productData.allowDiscount === true ? productData.discountPrice : productData.price,
            quantity: this.quantity,
            total: totalvalue,
            pimage: productData.productImg,
            sizes: productData.productDetails[0].sizes
          }
          this.cartService.addProductToCart(productdata);
          this.myRoute.navigate(["/product-cart"]);
        }
        else {
          this.dialog.open(messageDialog, {
            data: {
              message: response.message
            }
          });
        }
      });
    } else {
      let totalvalue = productData.allowDiscount === true ? productData.discountPrice : productData.price * this.quantity
          let productdata = {
            _id: productData._id,
            // productCategoryID: productData.productCategoryID,
            productTitle: productData.productTitle,
            price: productData.allowDiscount === true ? productData.discountPrice : productData.price,
            quantity: this.quantity,
            total: totalvalue,
            pimage: productData.productImg,
            sizes: productData.productDetails[0].sizes
          }
          this.cartService.addProductToCart(productdata);
          this.myRoute.navigate(["/product-cart"]);
    }
  }

  // deleteItem(item:any){
  //   this.cartService.deleteItem(item);
  //   let domItem  = document.getElementById(`cart-item`+item.product.id);
  //   setTimeout(() =>{
  //   domItem.classList.add('delete-style');
  //   domItem.parentNode.removeChild(domItem);
  //   },1000);

  // }
  addQty(item: any) {
  }

}
// routerLink="/product-cart"