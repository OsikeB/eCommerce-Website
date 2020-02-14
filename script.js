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
    const buttons = [...document.querySelectorAll(".bag-btn")];
    buttons.forEach(button => {
      let id = button.dataset.id;
      let inCart = cart.find(item => item.id === id);
      if (inCart) {
        button.innerText = "In Cart";
        button.disable = true;
      }
      button.addEventListener("click", event => {
        event.target.innerText = "In Cart";
        event.target.disable = true;

        //get product from products
        //add product to cart
        //save cart in local storage
        //set cart values
        //display cart items
        //show the cart
      });
    });
  }
}

//local storage (ensures all items in the carts are stored locally in browser even when page is refreshed)
class storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products)); //an inbuilt JS method
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();

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
