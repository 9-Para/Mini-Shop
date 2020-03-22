class Product {
  constructor(title, image, desc, price) {
    this.title = title;
    this.imageUrl = image;
    this.description = desc;
    this.price = price;
  }
}

class ElementAttribute {
  constructor(attrName, attrValue) {
    this.name = attrName;
    this.value = attrValue;
  }
}

class Component {
  constructor(renderHookId, shouldRender = true) {
    this.hookId = renderHookId;
    if (shouldRender) {
      this.render();
    }
  }
  createRootElement(tag, cssClasses, attributes) {
    const rootElement = document.createElement(tag);
    if (cssClasses) {
      rootElement.className = cssClasses;
    }
    if (attributes && attributes.length > 0) {
      for (const attr of attributes) {
        rootElement.setAttribute(attr.name, attr.value);
      }
    }
    document.getElementById(this.hookId).append(rootElement);
    return rootElement;
  }
  render() {}
}

class ShoppingCart extends Component {
  items = [];

  set cartItems(value) {
    this.items = value;
    this.totalOutput.innerHTML = `<h2>Total: \$${this.totalAmount.toFixed(
      2
    )}</h2>`;
  }

  get totalAmount() {
    const sum = this.items.reduce((prevValue, currItem) => {
      return prevValue + currItem.price;
    }, 0);
    return sum;
  }

  constructor(renderHookId) {
    super(renderHookId,false);
    this.orderProducts = () => {
      console.log("Ordering");
      console.log(this.items);
    };
    this.render();
  }
  addProduct(product) {
    const updatedItems = [...this.items];
    updatedItems.push(product);
    this.cartItems = updatedItems;
  }

  

  render() {
    const cartEl = this.createRootElement("section", "cart");
    cartEl.innerHTML = `<h2>Total: \$ ${0}</h2>
    <button>Order Now!</button>
    `;
    const orderBtn = cartEl.querySelector("button");
    orderBtn.addEventListener("click", this.orderProducts);
    this.totalOutput = cartEl.querySelector("h2");
  }
}

class ProductItem extends Component {
  constructor(product, renderHookId) {
    super(renderHookId, false);
    this.product = product;
    this.render();
  }

  addToCart() {
    App.addProductToCart(this.product);
  }

  render() {
    const prodEl = this.createRootElement("li", "product-item");
    prodEl.innerHTML = `
        <div>
          <img src="${this.product.imageUrl}" alt="${this.product.title}">
          <div class="product-item__content">
              <h2>${this.product.title}</h2>
              <h3>\$${this.product.price}</h3>
              <p>${this.product.description}</p>
              <button>Add to cart</button>
          <div>
        </div>
        `;
    const addCardButton = prodEl.querySelector("button");
    addCardButton.addEventListener("click", this.addToCart.bind(this));
  }
}

class ProductList extends Component {
   #products = [];

  constructor(renderHookId) {
    super(renderHookId,false);
    this.render();
    this.fetchProducts();
  }

  fetchProducts() {
    this.#products = [
      new Product(
        "A pillow",
        "https://images-na.ssl-images-amazon.com/images/I/51JptKupcHL._SL1500_.jpg",
        "A soft pillow",
        31.11
      ),

      new Product(
        "A carpet",
        "https://ii1.pepperfry.com/media/catalog/product/e/t/494x544/ethnic-motif-polyester60-x-79-inches-hand-woven-carpet-by-presto-ethnic-motif-polyester60-x-79-inche-2juax9.jpg",
        "A carpet which you might like or not.",
        29.99
      )
    ];
    this.renderProducts();
  }
  renderProducts() {
    for (const prod of this.#products) {
      new ProductItem(prod, "prod-list");
    }
  }

  render() {
    this.createRootElement("ul", "product-list", [
      new ElementAttribute("id", "prod-list")
    ]);
    if (this.#products && this.#products.length > 0) {
      this.renderProducts();
    }
  }
}

class Shop extends Component {
  constructor() {
    super();
  }
  render() {
    this.cart = new ShoppingCart("app");
    new ProductList("app");
  }
}

class App {
  static cart;

  static init() {
    const shop = new Shop();
    this.cart = shop.cart;
  }

  static addProductToCart(product) {
    this.cart.addProduct(product);
  }
}

App.init();
