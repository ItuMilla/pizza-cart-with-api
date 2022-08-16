document.addEventListener('alpine:init', () => {
  Alpine.data('pizzaCartWithAPIWidget', function() {
    return {

      init() {
          //alert('pizza loading..')
          //call pizza API
          axios
              .get('https://pizza-cart-api.herokuapp.com/api/pizzas')
              .then((result) =>{
                  console.log(result.data);
              this.pizzas = result.data.pizzas
              console.log(this.pizzas)
        })

        .then(()=>{
          return this.createCart();
        })

        .then((result)=> {
          //console.log(results.data);

          this.cartId = result.data.cart_code;
        });
        
      },
      featuredPizzas(){
        //Get a list of featured pizzas
        return axios
            .get('https://https://pizza-cart-api.herokuapp.com/api/pizzas/featured')
      },
      postfeaturedPizzas(){
        //Get a list of featured pizzas
        return axios
            .post('https://https://pizza-cart-api.herokuapp.com/api/pizzas/featured')
      },

      createCart(){
        ///api/pizza-cart/create
        return axios
            .get('https://pizza-cart-api.herokuapp.com/api/pizza-cart/create?username=' + this.username)
      },

      showCart(){
        const url = `https://pizza-cart-api.herokuapp.com/api/pizza-cart/${this.cartId}/get`;

        axios
          .get(url)
          .then((result) =>{
            this.cart = result.data;
          });

      },

      pizzaImage(pizza){
        return `/images/${pizza.size}.png`
      },

      message: 'Eating pizzas',
      username:'ItuMilla',
      pizzas: [],
      featuredpizzas: [],
      cartId:'',
      cart: {total : 0},
      paymentMessege:'',
      payNow: false,
      paymentAmount: 0,

      add(pizza){
        //to be able to add pizza to the cart, I need a cart Id..
          //alert(pizza.flavour + " : " + pizza.size)
          const params = {
            cart_code: this.cartId,
            pizza_id: pizza.id
          }

          axios
            .post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/add', params)
            .then(()=>{
              this.message= "pizza added to the cart"
              this.showCart();
            })
            .then(()=>{
              // if (this.pizza.length<=3){
              //   this.featuredPizzas=this.featuredPizzas();
              //   return this.featuredPizzas;
              // }
              return this.featuredPizzas();
              
            })
            .then(()=>{
              return this.postfeaturedPizzas();
            })
            .catch(err=>alert(err));
          //alert(pizza.id)
      },
      remove(pizza){
        // /api/pizza-cart/remove
        const params = {
          cart_code : this.cartId,
          pizza_id : pizza.id
        }

        axios
          .post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/remove', params)
          .then(()=>{
            this.message= "pizza removed to the cart"
            this.showCart();
          })
          .catch(err=>alert(err));

      },
      pay(pizza){
        const params = {
          cart_code : this.cartId,
        }

        axios
          .post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/pay', params)
          .then(()=>{
              if(!this.paymentAmount){
                  this.paymentMessege = 'No amount entered!'
              }
              else if(this.paymentAmount >= this.cart.total.toFixed(2)){
                  this.paymentMessege = 'payment sucessful!'
                  this.message= this.username  +" paid!"
                  setTimeout(() => {
                      this.cart.total=0
                  }, 5000);
  
              }else{
                  this.paymentMessege = 'Insufficient Fund!'
                  setTimeout(() => {
                      this.cart.total=0
                  }, 5000);
              }
          
          })
          .catch(err=>alert(err));

      }

    }
  });
})