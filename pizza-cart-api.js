document.addEventListener('alpine:init', () => {
    Alpine.data('pizzaCartWithAPIWidget', function() {
      return {
        init() {

         axios
              .get('https://pizza-cart-api.herokuapp.com/api/pizzas')
              .then((result) => {
                this.pizzaList = result.data.pizzas
              })
              .then((result) => {
                return this.createCart();

              })
              .then((result) => {
                this.cartId = result.data.cart_code;
              })



        },
        createCart(){
    return axios.get('https://pizza-cart-api.herokuapp.com/api/pizza-cart/create?username = userName') 
        },
        showCart(){

          const url = `https://pizza-cart-api.herokuapp.com/api/pizza-cart/${this.cartId}/get`;

          axios
              .get(url)
              .then((result) => {
                this.cart = result.data;
              });

        },
        payCart(){

          const url = `https://pizza-cart-api.herokuapp.com/api/pizza-cart/${this.cartId}/get`;

          axios
              .get(url)
              .then((result) => {
                this.cart = result.data.total;
              });

        },

        message: 'Eating Pizzas',
        pizzaList : [],
        userName:'',
        cartId:'',
        cart: {total:0},
        checkout: false,
        paymentAmount: 0,
        paymentMessage: '',

        add(pizza){

          const params = {
            cart_code: this.cartId,
            pizza_id:pizza.id
          }

          axios
              .post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/add',params)
              .then(() => {
                this.message = 'Pizza added to the cart'
                this.showCart();
              } )
              .catch(err => alert(err));

         // alert(pizza.flavour + " : " + pizza.size)

      },

      remove(pizza){

        const params = {
          cart_code: this.cartId,
          pizza_id:pizza.id
        }

        axios
            .post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/remove',params)
            .then(() => {
              this.message = 'Pizza removed from the cart'
              this.showCart();
            } )
            .catch(err => alert(err));

    },

    pay(pizza){

      const params = {
        cart_code: this.cartId,
      }
      
      axios
          .post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/pay', params)
          .then(() => {
            if(!this.paymentAmount){
              this.paymentMessage = 'No amount entered!'
          }  
         else if(this.paymentAmount >= this.cart.total ) {
              this.paymentMessage = 'Payment successful!'
              this.message = 'Paid'

              setTimeout(() => {
                this.checkout = false;
                this.cart.total= 0
           },3000);


          } else {
              this.paymentMessage = 'insufficient amount!'  
              
              
          }  
          
           
          } )
          //.catch(err => alert(err));

  },

    }
});

})