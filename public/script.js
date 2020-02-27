//commented out as we are deploying from local storage not contentful
/*const client = contentful.createClient({
  // This is the space ID. A space is like a project folder in Contentful terms
  space: "wboevhrwmerf",
  // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
  accessToken: "w_HxtYvnUA35Wmy39Nr1Q6rGDqRfuOVJO8epc0lpVoI"
});*/

//Declaring our varaiables
const cartBtn = document.querySelector(".cart-btn");
const CloseCartBtn = document.querySelector(".close-cart");
const ClearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".products-center");


//cart item, has to be a variable with an empty array
let cart = [];

//buttons
let buttonsDOM = [];

//getting the products from product.json or from contentful
//we set first a method
class Products {
  async getProducts() {
    try {
      /* commented out as we are deploying from local storage not contentful
      //contentful code
      let contentful = await client.getEntries({
        content_type: "luxuryshoeProducts"
      });*/

      let result = await fetch("products.json"); //file is in the same folder
      let data = await result.json(); //this ensures json data used on the fetch is returned
      let products = data.items; // reference to the product.json file(data.items), but later updated to contentful.item

      //commented out as we are deploying from local storage not contentful
      /*let products = contentful.items;*/
      products = products.map(item => {
        //a better way to return the .son file as object and later set properties on it
        //.map used to sort through the array (in product.json file)
        const { title, price } = item.fields; //used to traced their location on the products.json file
        const { id } = item.sys; //used to traced their location on the products.json file
        const image = item.fields.image.fields.file.url; //used to traced their location on the products.json file
        //used to return object
        return { title, price, id, image };
      });
      return products;
    } catch (error) {
      console.log(error);
    }
  }
}

// This class is resp for displaying the products, everything displayed on the webpage
// getting items returned from class Products or from local storage
class UI {
  displayProducts(products) {
    let result = "";
    //array method to loop over the product array
    products.forEach(product => {
      //copied from index.html and the needed section were made functional with `` and $
      //we used temperate literals `` to access the properties
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

    productsDOM.innerHTML = result; //property set on productsDOM to equal result on the class UI
  }
  //after displaying product, we make buttons functional
  getBagButtons() {
    const buttons = [...document.querySelectorAll(".bag-btn")]; //spread operator is used so method can find button in the buttonDOM
    buttonsDOM = buttons;
    buttons.forEach(button => {
      let id = button.dataset.id; //id from data-id will be used to retrieve info about product
      let inCart = cart.find(item => item.id === id); //find the item in the cart, if it matches button
      if (inCart) {
        button.innerText = "In Cart"; //button changes to IN CART
        button.disable = true; //button is disabled
      }
      //if Item is not in the cart, this functions ll be executed
      button.addEventListener("click", event => {
        event.target.innerText = "In Cart"; //when item has been selected by buyer, it displays "in cart"
        event.target.disable = true;

        //get product from products
        let cartItem = {
          ...storage.getProduct(id), //this is added to the let cart =[] above
          amount: 1
        };

        //methods section

        //add product to cart
        cart = [...cart, cartItem]; //ensures product are added to cart array which was first defined above

        //save cart in local storage
        storage.saveCart(cart); //ensures items in cart are saved in local storage even when page is refrshed

        //set cart values
        this.setCartValues(cart); //when we click, item number changes

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
    //toFixed returns string but to get a number, we use parseFloat
    cartTotal.innerText = parseFloat(tempTotal.toFixed(2)); //ensures prices are rounded down to 2decimal places
    cartItems.innerText = itemsTotal;
  }
  addCartItem(item) {
    //we create a div and add to it the class("cart-item") from the index.html, that way we get get the style
    const div = document.createElement("div");
    div.classList.add("cart-item");
    // temperate literals was used again
    div.innerHTML = `<img src=${item.image} alt="shop1" /> 
            <div>
              <h4>${item.title}</h4>
              <h5>€${item.price}</h5>
              <span class="remove-item" data-id=${item.id}>remove item</span>
            </div>
            <div>
              <i class="fas fa-chevron-up fa-2x" data-id=${item.id}></i>
              <p class="item-amount">${item.amount}</p>
              <i class="fas fa-chevron-down fa-2x" data-id=${item.id}></i> <!---fa-2x was used to make icon bigger--->
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

  //clear cart button
  //cartlogic, clear cart and also add/remove item
  cartLogic() {
    ClearCartBtn.addEventListener("click", () => {
      this.clearCart();
    });

   
      function myFunction() {
        document.getElementById("paypal-button");
    }
          

    // cart functionality
    cartContent.addEventListener("click", event => {
      if (event.target.classList.contains("remove-item")) {
        let removeItem = event.target;
        let id = removeItem.dataset.id;
        cartContent.removeChild(removeItem.parentElement.parentElement); //removing from the DOM
        this.removeItem(id);
      } else if (event.target.classList.contains("fa-chevron-up")) {
        let addAmount = event.target;
        let id = addAmount.dataset.id;
        let tempItem = cart.find(item => item.id === id);
        tempItem.amount = tempItem.amount + 1;
        storage.saveCart(cart);
        this.setCartValues(cart);
        addAmount.nextElementSibling.innerHTML = tempItem.amount;
      } else if (event.target.classList.contains("fa-chevron-down")) {
        let lowerAmount = event.target;
        let id = lowerAmount.dataset.id;
        let tempItem = cart.find(item => item.id === id);
        tempItem.amount = tempItem.amount - 1;
        if (tempItem.amount > 0) {
          storage.saveCart(cart);
          this.setCartValues(cart);
          lowerAmount.previousElementSibling.innerHTML = tempItem.amount;
        } else {
          cartContent.removeChild(lowerAmount.parentElement.parentElement);
          this.removeItem(id);
        }
      }
    });
  }

  clearCart() {
    //first we get all the ids of the item in the cart & direct them to be removed with a method of remove item
    let cartItems = cart.map(item => item.id);
    cartItems.forEach(id => this.removeItem(id));
    while (cartContent.children.length > 0) {
      cartContent.removeChild(cartContent.children[0]);
    }

    this.hideCart();
  }

  removeItem(id) {
    cart = cart.filter(item => item.id !== id); //return only when the item in the cart doesn't have this id
    this.setCartValues(cart);
    storage.saveCart(cart);
    let button = this.getSingleButton(id);
    button.disabled = false;
    button.innerHTML = `<i class ="fas fa-shopping-cart"></i>add to cart`;
  }
  getSingleButton(id) {
    return buttonsDOM.find(button => button.dataset.id === id);
  }
}

//local storage (ensures all items in the carts are stored locally in browser even when page is refreshed)
class storage {
  static saveProducts(products) {
    //static method will be reused
    localStorage.setItem("products", JSON.stringify(products)); //an inbuilt JS method
  }
  static getProduct(id) {
    let products = JSON.parse(localStorage.getItem("products")); //this returns the array in the local storage
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

//event listener created
document.addEventListener("DOMContentLoaded", () => {
  //we create instance for both UI & product class
  const ui = new UI();
  const products = new Products();

  //setup app
  ui.setupAPP();

  // get all products
  //Here we run both methods .getProducts & displayProducts on product instance
  products
    .getProducts()
    .then(products => {
      ui.displayProducts(products);
      storage.saveProducts(products); //bcos this is a static method,we don't need an instance, we can just use the class
    })
    .then(() => {
      ui.getBagButtons();
      ui.cartLogic();
    });
});
