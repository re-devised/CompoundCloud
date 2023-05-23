<template>
    <nav class="main-navbar">
      <div class="main-navbar-brand text-primary">
        <nuxt-link to="/"><span class="main-navbar-brand-accent">COMPOUND</span>//CLOUD</nuxt-link>
      </div>
      <!-- <svg-icon class="main-navbar-toggler" color="primary" icon="list" size="l" @click.native="toggleMenu = !toggleMenu"/> -->
      <svg-icon class="main-navbar-toggler" color="primary" icon="list" size="l" @click.native="toggleSideNavBar"/>

      <ul class="main-navbar-list" :class="{'toggled' : toggleMenu}">
        <!-- <li class="main-navbar-list-item">
          <nuxt-link to="/">Einstellungen</nuxt-link>
        </li> -->
        <li class="main-navbar-list-item">
          <popper
            v-if="user"
            trigger="clickToOpen"
            :options="{
              placement: 'bottom',
            }"
            :append-to-body="true"
            :visible-arrow="false"
            >
            <div class="popper pt-3 pb-4">
              <button class="null-button" @click.prevent><svg-icon icon="person" size="s" class="popper-icon"/> My Account</button>
              <hr class="mb-2"/>
              <button class="null-button" @click.prevent="logout"><svg-icon icon="logout" size="s" class="popper-icon"/> Log out</button>
            </div>
 
            <button slot="reference" class="null-button">
              Welcome <strong>{{user.username}}</strong>
            </button>
          </popper>
          <nuxt-link v-else :to="{ path: 'addcloud', query: { action: 'login' }}">Log In</nuxt-link>
        </li>
      </ul>

      <form class="main-navbar-search" :class="{'toggled' : toggleMenu}">
        <input class="main-navbar-search-bar" @input="emitSearch" v-model="search" type="search" placeholder="Search..." aria-label="Search">
      </form>     
      <!--DAS HIER ALS NÄCHSTES-->

      <div class="main-navbar-accent"></div> 
      
    </nav>
</template>

<script>
import SvgIcon from '~/components/shared/SvgIcon'
import Popper from 'vue-popperjs';
import 'vue-popperjs/dist/vue-popper.css';
export default {
  components: {
    SvgIcon,
    Popper
  },
  data() {
    return {
      toggleMenu: true,
      search: null,
    }
  },
  props:{
    user:{
      type: Object,
    }
  },
  methods:{
    emitSearch(){
      this.$emit('search', this.search)
    },
    async logout(){     
      await this.$store.dispatch('user/logout')
        .then(isOpenedCloudRemaining => {
          if(!isOpenedCloudRemaining) this.$router.push('/addcloud?action=login')
        })
        .catch(err => console.log(err))
    },
    toggleSideNavBar(){
      this.$emit('toggleSideNavBar')
    }
  },  
}
</script>

<style lang="scss" scoped>

.popper{
  background-color: var(--color-popper) !important;
  // padding: 5px 20px !important;
  margin: 0 !important;
  margin-top: 16px !important;
  border: 1px solid transparent !important;
  box-shadow: var(--shadow-small) !important;
  display: flex !important;
  flex-direction: column !important;

  &-icon{
    display: inline !important; 
    font-size: 15pt !important;
    margin-right: 5px !important;
    // @media (max-width: 992px) {
    //   font-size: 13pt !important;
    // }
  }

  hr{
    background: var(--color-accent) !important;
  }
}

.main-navbar{
  background-color: var(--color-secondary);
  :nth-child(n){
    color: var(--color-accent-3);
  }
  // z-index: 3;
  overflow: hidden !important;
  border-bottom-right-radius: 10px;
  box-shadow: var(--shadow-medium);
  width: calc(100vw - 70px);
  margin-bottom: 15px;
  @media (max-width: 991px){
    width: 100vw;
    border-bottom-right-radius: 0px;
  } 
  
  // margin: 0 20px;
  // border-bottom-left-radius: 10px;
  @media (min-width: 992px) {padding: 10px 0;}

  :nth-child(n):hover{
    text-decoration: none;
  }

  &-accent{
    position: absolute;
    z-index: -1;
    // width: 200px;
    width: 100vw;
    top: 0;
    right: 0;
    min-height: fit-content;
    height: 60px;
    background-color: var(--color-accent);
  }

  &-brand{
    //width: 100%;
    padding: 10px 30px;
    margin: 0;
    font-size: 18pt;
    text-align: left;
    // font-weight: 500;
    position: relative;

    &-accent{ color: var(--color-primary) !important;}

    @media (min-width: 992px) {
      //text-align: left;
      display:inline;
      padding-left: 60px;
      font-size: 16pt;
    }
  }

  &-toggler{
    position: absolute;
    pointer-events: all;
    z-index: 10;
    right: 18px;
    top: 2px;
    padding: 0;
    margin: 0;  

    &:hover{
      cursor: pointer;

      &:nth-child(n){
      color: var(--color-primary) !important;
      }  
    }

    @media (min-width: 992px) { display: none }
  }

  &-list{
    font-size: 13pt;
    list-style-type: none;
    margin: 0px 40px;
    padding: 0;
    border-top: 0px solid var(--color-primary);
    transition: padding 0.2s, border-top 0.1s;  

    &-item{
      display: none;
      &:hover{
        border-bottom: 1px solid var(--color-accent);
        margin-bottom: -1px;
      }
      @media (min-width: 992px) {
        display: inherit;
        padding: 0 5px;
      }
    }    

    @media (min-width: 992px) {
      border-top: 0px solid transparent !important;
      display:inline;  
    }
  }
  .toggled{    
    &.main-navbar-list{
      border-top: 3px solid var(--color-info);
      margin: 0;
      padding: 20px 30px;  
    }
    .main-navbar-list-item{
      display: inherit;
    }
    @media (max-width: 991px) {
      &.main-navbar-search{
        float: left;
        margin: 0;
        height: fit-content;
        display: inherit;

      }
      .main-navbar-search-bar{      
        padding: 10px 30px;
        //background: url('../../static/grey_pixel.png');
        //background-size: cover;
        background-color: var(--color-accent);
        transition: width 0s ease;

        color: var(--color-primary);
        width: 100vw;

        &::placeholder{
          color: var(--color-primary);
        }
      }
    }    
  }

  &-search{
    float: right;
    margin: 0 60px 0 0;
    height: 30px;
    display: none;

    @media (min-width: 992px) {
      display: inherit;
      background-color: none;     
    }

    &-bar{
      width: 200px;
      background-color: transparent;
      height: 100%;
      color: var(--color-accent-3);
      padding: 10px 0 0 3px;
      border: 0px solid transparent;
      border-bottom: 2px solid var(--color-accent-3);
      transition: width 0.2s ease;
      
      &:focus{
        width: 290px;
        outline: 0;
      }
      &::placeholder{
        color: var(--color-accent-3);
      }
    }
  }
  
}
</style>