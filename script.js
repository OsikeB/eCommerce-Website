//selecting element

const cartBtn = document.querySelector(".cart-btn");
const CloseCartBtn = document.querySelector(".close-cart");
const ClearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".products-center");

//cart
let cart = [];
//buttons
let buttonsDOM = [];

//getting the products
class Products {
  async getProducts() {
    try {
      let result = await fetch("products.json"); //file is in the same folder
      let data = await result.json();
      let products = data.items; // reference to the product.json file
      products = products.map(item => {
        //.map used to sorth through the array
        const { title, price } = item.fields; //used to traced their location on the products.json file
        const { id } = item.sys; //used to traced their location on the products.json file
        const image = item.fields.image.fields.file.url; //used to traced their location on the products.json file
        return { title, price, id, image };
      });
      return products;
    } catch (error) {
      console.log(error);
    }
  }
}

// displaying the products, everything displayed on the webpage
class UI {
  displayProducts(products) {
    let result = "";
    products.forEach(product => {
      //copied from index.html and the needed section were made functional with `` and $
      result += `
      <!--Single product-->
        <article class="product">
          <div class="img-container">
            <img 
            src= ${product.image}
             alt="article1" 
             class="product-img" />
            <button class="bag-btn" data-id=${product.id}>
              <i class="fas fa-shopping-cart"></i>
              Add to Cart
            </button>
          </div>
          <h3>${product.title}</h3>
          <h4> €${product.price}</h4> 
        </article>
        <!--End of single product-->
      `;
    });
    productsDOM.innerHTML = result; //property set on productsDOM
  }
  getBagButtons() {
    const buttons = [...document.querySelectorAll(".bag-btn")]; //spread operator is used so method can find button in the buttonDOM
    buttonsDOM = buttons;
    buttons.forEach(button => {
      let id = button.dataset.id;
      let inCart = cart.find(item => item.id === id);
      if (inCart) {
        button.innerText = "In Cart";
        button.disable = true;
      }
      button.addEventListener("click", event => {
        event.target.innerText = "In Cart"; //when item has been selected by buyer, it displays "in cart"
        event.target.disable = true;

        //get product from products
        let cartItem = {
          ...storage.getProduct(id), //this is added to the let cart =[] above
          amount: 1
        };

        //add product to cart
        cart = [...cart, cartItem]; //ensures product are added to cart

        //save cart in local storage
        storage.saveCart(cart); //ensures items in cart are saved in local storage

        //set cart values
        this.setCartValues(cart);

        //display cart items
        this.addCartItem(cartItem);

        //show the cart
        this.showCart();
      });
    });
  }

  //to set cart values and ensure the right price is calculated when selected
  setCartValues(cart) {
    let tempTotal = 0;
    let itemsTotal = 0;
    cart.map(item => {
      tempTotal += item.price * item.amount;
      itemsTotal += item.amount;
    });

    cartTotal.innerText = parseFloat(tempTotal.toFixed(2)); //ensures prices are rounded down to 2decimal places
    cartItems.innerText = itemsTotal;
  }
  addCartItem(item) {
    //we create a div and add to it the class("cart-item") from the index.html, that way we get get the style
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `<img src=${item.image} alt="shop1" />
            <div>
              <h4>${item.title}</h4>
              <h5>€${item.price}</h5>
              <span class="remove-item" data-id=${item.id}>remove item</span>
            </div>
            <div>
              <i class="fas fa-chevron-up" data-id=${item.id}></i>
              <p class="item-amount">${item.amount}</p>
              <i class="fas fa-chevron-down" data-id=${item.id}></i>
            </div>`;
    cartContent.appendChild(div); //this adds the above division
  }
  //showing cart
  showCart() {
    //In our CSS, property of visibilty was set as hidden in the class .cart-overlay & .cart, but now shown with class transparentBcg
    cartOverlay.classList.add("transparentBcg");
    cartDOM.classList.add("showCart");
  }

  //this ensures our cart is dynamic
  //moment cart loads, values should be asigned from the storage
  setupAPP() {
    cart = storage.getCart();
    this.setCartValues(cart);
    this.populateCart(cart);
    cartBtn.addEventListener("click", this.showCart);
    CloseCartBtn.addEventListener("click", this.hideCart);
  }

  populateCart(cart) {
    cart.forEach(item => this.addCartItem(item));
  }
  //hidding cart
  hideCart() {
    cartOverlay.classList.remove("transparentBcg");
    cartDOM.classList.remove("showCart");
  }
}

//local storage (ensures all items in the carts are stored locally in browser even when page is refreshed)
class storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products)); //an inbuilt JS method
  }
  static getProduct(id) {
    let products = JSON.parse(localStorage.getItem("products"));
    return products.find(product => product.id === id);
  }
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  static getCart() {
    //ensures local storage is first checked and items there are returned, if not an empty cart is returned
    return localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();

  //setup app
  ui.setupAPP();

  // get all products
  products
    .getProducts()
    .then(products => {
      ui.displayProducts(products);
      storage.saveProducts(products);
    })
    .then(() => {
      ui.getBagButtons();
    });
});
