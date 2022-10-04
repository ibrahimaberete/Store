import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Cart, CartItem } from 'src/app/models/cart.model';
import { loadStripe } from '@stripe/stripe-js';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: `./cart.component.html`,
 
})
export class CartComponent implements OnInit {
  cart: Cart = { items: [
  {
    product: 'https://via.placeholder.com/150',
    name:'Product 1',
    price: 150,
    quantity: 6,
    id: 3,
  }] };
  dataSource: CartItem[] = [];
  cartSubscription: Subscription | undefined;

  displayedColumns: string[] = [
    'product',
    'name',
    'price',
    'quantity',
    'total',
    'action',
  ];

  constructor(private cartService: CartService, private http: HttpClient) { }

  ngOnInit(): void {
    this.cartService.cart.subscribe((cart) => {
      this.cart = cart;
      this.dataSource = cart.items;
    });
    this.dataSource = this.cart.items;
  }
  getTotal(items: CartItem[]): number {
    return this.cartService.getTotal(items);
  //  return items.map((item) => item.price * item.quantity)
  //   .reduce((prev, current) => prev + current, 0);
  }

  onAddQuantity(item: CartItem): void {
    this.cartService.addToCart(item);
  }

  onRemoveFromCart(item: CartItem): void {
     this.cartService.removeFromCart(item);
  }

  onRemoveQuantity(item: CartItem): void {
     this.cartService.removeQuantity(item);
  }

  onClearCart(): void {
     this.cartService.clearCart();
  }

  onCheckout(): void {
    this.http
      .post('http://localhost:4242/checkout', {
        items: this.cart.items,
      })
      .subscribe(async (res: any) => {
        let stripe = await loadStripe('pk_test_51LnRCtDohZLl05JKctFnuZYABWxK1wf7HuVzNWardYwF2WexYnK7qzDRnAH8Zqx1plxVVi7rwvB3T4qTrhb4zubj00yRsCz8Vg');
        stripe?.redirectToCheckout({
          sessionId: res.id,
        });
      });
  }

  ngOnDestroy() {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

}
