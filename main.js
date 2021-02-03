const eventBus = new Vue()

Vue.component('product',{
  props: {
    premium:{
      type: Boolean,
      required: true
    }
  },
  template: `
  <div class="product">
      <div class="product-image">
        <img :src="image" >
      </div>

      <div class="product-info">
        <h1>{{title}}</h1>
        <p v-if="inStock">IN stock</p>
        <p v-else>Out of stock</p>
        <p>Shipping: {{shipping}}</p>
        <p>{{sale}}</p>

        <product-detail :details="details"></product-detail>

        <div class="color-box"
             v-for="(variant, index) in variants" 
              :key="variant.variantId"
              :style="{backgroundColor: variant.variantColor}"
              @mouseover="updateProduct(index)">

        </div>

        <button v-on:click="addToCart"
                :disabled="!inStock"
                :class="{disabledButton: !inStock}"
                >Add to Cart</button>
        
        <button @click="removeFromCart"
                :disabled="!inStock"
                :class="{disabledButton: !inStock}"
                >Remove From Cart</button>
      </div>

      <product-tabs :reviews="reviews"></product-tabs<>

    </div>
  `,
  data(){
    return {
      brand: 'Vue Mastery',
      product: 'socks',
      selectedVariant: 0,
      details: ["80% cotton","20% polyester","Gender-neutral"],
      variants: [
        {
          variantId: 2234,
          variantColor: "green",
          variantImage: "VmSocks-green.jpg",
          variantQuantity: 10
        },
        {
          variantId: 2235,
          variantColor: "blue",
          variantImage: "VmSocks-blue.jpg",
          variantQuantity: 0
        }
      ],
      reviews: []
    }
  },
  methods: {
    addToCart: function(){
      this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
    },
    removeFromCart: function(){
      this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId)
    },
    updateProduct: function(index){
      this.selectedVariant = index
    }
  },
  computed: {
    title() {
      return this.brand + ' ' + this.product
    },
    image(){
      return this.variants[this.selectedVariant].variantImage
    },
    inStock(){
      return this.variants[this.selectedVariant].variantQuantity
    },
    sale(){
      if(this.inStock){
        return this.brand + ' ' + this.product + ' ' + 'are on sale!'
      }
        return this.brand + ' ' + this.product + ' ' + 'are not on sale'
    },
    shipping(){
      if(this.premium){
        return 'free'
      }
        return '5$'
    }
  },
  mounted(){
    eventBus.$on('review-submitted',productReview =>{
      this.reviews.push(productReview)
    })
  }
})

Vue.component('product-detail',{
  props:{
    details:{
      type: Array,
      required: true
    }
  },
  template:`
  <ul>
    <li v-for="detail in details">{{detail}}</li>
  </ul>
  `
})

Vue.component('product-review',{
  template: `
  <form class="review-form" @submit.prevent="onSubmit">
      <p v-if="errors.length">
        <b>please correct the following error(s):</b>
        <ul>
          <li v-for="error in errors">{{error}}</li>
        </ul>
      </p>

      <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name" placeholder="name">
      </p>
      
      <p>
        <label for="review">Review:</label>      
        <textarea id="review" v-model="review"></textarea>
      </p>
      
      <p>
        <label for="rating">Rating:</label>
        <select id="rating" v-model.number="rating">
          <option>5</option>
          <option>4</option>
          <option>3</option>
          <option>2</option>
          <option>1</option>
        </select>
      </p>

      <p>Would you recommend this product</p>
      <label>
        YES
        <input type="radio" value="YES" v-model="recommend">
      </label>
      <label>
        NO
        <input type="radio" value="NO" v-model="recommend">
      </label>
          
      <p>
        <input type="submit" value="Submit">  
      </p>    
    
    </form>
  `,
  data(){
    return {
      name: null,
      review: null,
      rating: null,
      recommend: null,
      errors: []
    }
  },
  methods: {
    onSubmit(){
    if (this.name && this.review && this.rating &&this.recommend){
        let productReview = {
          name: this.name,
          review: this.review,
          rating: this.rating,
          recommend: this.recommend
        }
        eventBus.$emit('review-submitted',productReview)
        this.name = null
        this.review = null
        this.rating = null
        this.recommend = null
      }
      else{
        if(!this.name)this.errors.push("Name required.")
        if(!this.review)this.errors.push("Review required.")
        if(!this.rating)this.errors.push("Rating required.")
        if(!this.recommend)this.errors.push("Recommend required.")
      }
    }
  }
})

Vue.component('product-tabs',{
  props: {
    reviews: {
      type: Array,
      required: true
    }
  },
  template:`
  <div>
    <span class="tab"
    :class="{activeTab: selectedTab === tab}"
    v-for="(tab, index) in tabs" :key="index"
    @click="selectedTab = tab">
           {{tab}}
    </span>

    <div v-show="selectedTab === 'Reviews'">
      <h2>Reviews</h2>
      <p v-if="!reviews.length">there are no reviews</p>
      <ul>
        <li v-for ="review in reviews">
          <p>{{review.name}}</p>
          <p>Rating:{{review.rating}}</p>
          <p>{{review.review}}</p>
        </li>
      </ul>
    </div>
    <product-review v-show="selectedTab === 'Make a Review'"></product-review>

  </div>

  
  `,
  data(){
    return{
      tabs: ['Reviews', 'Make a Review'],
      selectedTab: 'Reviews'
    }
  }
})

const app = new Vue({
  el: '#app',
  data:{
    premium: true,
    cart: []
  },
  methods: {
   updateCart(id){
    this.cart.push(id)
   },
   removeCart(id){
    for(var i = this.cart.length - 1; i >= 0; i--) {
      if (this.cart[i] === id) {
         this.cart.splice(i, 1);
        }
      }
   }
  }
})