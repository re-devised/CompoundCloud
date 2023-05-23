<template>
  <portal to="nav" v-if="isMobile">
    <nav class="side-nav-mobile" :class="{'mobile-open' : isMobileOpen}">
      <div class="side-nav-mobile-heading">
        <div class="icon" @click="isMobileOpen = false"><svg-icon icon="x" size="l" color="white"/></div>
      </div>
      <div class="side-nav-mobile-content">
        <div class="side-nav-mobile-content-select">
          <div :class="{'is-active' : isActive == 1}" @click="changeCurrentSection(1)" class="side-nav-mobile-content-select-item">
              <div class="icon"><svg-icon :icon="isActiveIcon('folder',1)" size="m" color="white"/></div>Files
          </div>
          <div :class="{'is-active' : isActive == 2}" @click="changeCurrentSection(2)" class="side-nav-mobile-content-select-item">
              <div class="icon"><svg-icon :icon="isActiveIcon('share',2)" size="m" color="white"/></div>Shared
          </div>
        </div>
        <div class="side-nav-mobile-content-select" v-if="user && user.isAdmin">
          <div :class="{'is-active' : isActive == 4}" @click="changeCurrentSection(4)" class="side-nav-mobile-content-select-item">
              <div class="icon"><svg-icon :icon="isActiveIcon('hdd_stack',4)" size="m" color="white"/></div>Clouds
          </div>
          <div :class="{'is-active' : isActive == 5}" @click="changeCurrentSection(5)"  class="side-nav-mobile-content-select-item">
              <div class="icon"><svg-icon :icon="isActiveIcon('person',5)" size="m" color="white"/></div>Users
          </div>
        </div>
        <div class="side-nav-mobile-content-cloud">
          <h3>CLOUDS</h3>
          <ul class="pb-2 sub">
            <li 
            v-for="cloud in clouds"
            :key="cloud._id"
            :class="{'currentCloud' : currentCloud == cloud._id}"
            @click="changeCurrentCloud(cloud._id)"
            >{{cloud.name ? cloud.name : cloud._id}}</li>
            <li><nuxt-link to="/addcloud" class="addCloudLink">add...</nuxt-link></li>
          </ul>
        </div>
      </div>
    </nav>
  </portal>
  <nav v-else class="side-nav">
    <ul class="mb-3">
        <li :class="{'is-active' : isActive == 1}" @click="changeCurrentSection(1)">
            <div class="icon"><svg-icon :icon="isActiveIcon('folder',1)" size="s" /></div>Files
        </li>
        <li :class="{'is-active' : isActive == 2}" @click="changeCurrentSection(2)">
            <div class="icon"><svg-icon :icon="isActiveIcon('share',2)" size="s" /></div>Shared
        </li>
        <li class="mt-4 clouds">
            <div class="clouds-list"><div class="clouds-list-main">
              <div class="icon clouds-list-main-icon"><svg-icon :icon="isActiveIcon('hdd',3)" size="s" /></div>Clouds</div>
              <svg-icon icon="unlock" class="clouds-list-lock-icon" size="xs" color="muted"/>
            </div>
              <ul class="pb-2 sub">
                <li 
                v-for="cloud in clouds"
                :key="cloud._id"
                :class="{'currentCloud' : currentCloud == cloud._id}"
                @click="changeCurrentCloud(cloud._id)"
                >
                <popper
                  trigger="hover"
                  :options="{placement: 'left'}"
                  :append-to-body="true"
                  :visible-arrow="false"
                  :delay-on-mouse-over="1200"             
                  >
                  <div class="popper" ref="popper">
                    <button class="null-button" @click.prevent="closeCloud(cloud._id)" ><svg-icon icon="x" class="popper-icon" size="s"/> Close</button>
                  </div>
              
                  <button slot="reference" class="null-button cloud-button" @click.prevent @click.right.prevent>
                    {{(cloud.name ? cloud.name : cloud._id) | shortenText(18)}}
                  </button>
                </popper>
                </li>
                <li><nuxt-link to="/addcloud" class="addCloudLink">add...</nuxt-link></li>
            </ul>
        </li>
    </ul>
    <div class="admin-menu" v-if="user && user.isAdmin">
      <span class="admin-menu-heading">ADMIN</span>
      <ul>
        <li :class="{'is-active' : isActive == 4}" @click="changeCurrentSection(4)">
              <div class="icon"><svg-icon :icon="isActiveIcon('hdd_stack',4)" size="s" /></div>All Clouds
        </li>
        <li :class="{'is-active' : isActive == 5}" @click="changeCurrentSection(5)">
            <div class="icon"><svg-icon :icon="isActiveIcon('person',5)" size="s" /></div>All Users
        </li>
      </ul>
    </div>

    <div class="bottom">
    <!--Speicher zu {{diskSpacePercent}} belegt <div class="progressbar" :style="diskSpacePercentStyle"></div>-->
    {{diskSpaceUsed | calculateSize(0)}} / {{diskSpace.size | calculateSize(0)}}    <div class="progressbar" :style="diskSpacePercentStyle"></div>
    </div>        
  </nav>
</template>

<script>
import SvgIcon from '~/components/shared/SvgIcon'
import Popper from 'vue-popperjs';
//import 'vue-popperjs/dist/vue-popper.css';
export default {
  components:{
    SvgIcon,
    Popper
  },
  props:{
    clouds:{
      type: Array
    },
    currentCloud:{
      type: String
    },
    user:{
      type: Object
    },
    windowWidth:{
      type: Number
    },
    diskSpace:{
      type: Object
    }  
  },
  data() {
    return {
      isActive: 1,
      isMobileOpen: false,
    }
  },
  computed:{
    isMobile(){
      return (this.windowWidth < 992) ? true : false
    },
    diskSpacePercent(){
      var diskSpacePercent = Math.floor(100*(1 - (this.diskSpace.free / this.diskSpace.size))) + "%"
      return diskSpacePercent
    },   
    diskSpaceUsed(){
      return this.diskSpace.size - this.diskSpace.free
    },
    diskSpacePercentStyle(){
      return {
        '--disk-space' : this.diskSpacePercent
      }  
    } 
  },
  methods:{
    isActiveIcon(icon,listNumber){
      if(listNumber != this.isActive) return icon
      return icon + "_fill"
    },
    changeCurrentCloud(cloudId){
      this.$emit('cloudChange', cloudId)
      this.changeCurrentSection(1)
    },
    changeCurrentSection(section){
      this.isActive = section
      this.$emit('sectionChange', section)
    },
    changeIsMobileOpen(bool){
      this.isMobileOpen = bool
    },
    closeCloud(cloudId){ //DAS HIER ALS NÄCHSTES!!!!!!!!!!!!!!
      if(this.user){
      this.$store.dispatch('user/closeCloudForUser', [this.user._id, cloudId])
        .catch(err => {
          this.$toasted.error(err, {
            duration: 5000,
          })
        })
        // .then(_ => this.$store.commit('cloud/closeCloud', cloudId))
      }else this.$store.commit('cloud/closeCloud', cloudId)      
    },
  }
}
</script>

<style scoped lang="scss">
.side-nav-mobile{
  //position: absolute;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  z-index: 10;
  position: fixed;
  transform: translate(calc(-100vw), 0px);
  transition: transform 0.2s ease;

  &-heading{ //wird nicht mehr benutzt
    height: 70px;
    background-color: $dark-grey;
    padding: 0 10vw;    
    font-size: 30pt;
    font-weight: 600;
    padding-top: 5px;
    //box-shadow: 0px 7px 7px rgb(48, 48, 48);
    .icon{
      &:hover{
        cursor: pointer;
      }
      max-width: fit-content;
      .file-icon{
        max-width: fit-content;
      }
    }
  }

  &-content{
    position: relative;
    height: 100%;
    z-index: 11;
    overflow-y: hidden;
    background-color: #4b515ce8;
    padding: 40px 30px;

    :nth-child(n){
      color: white;
    }

    &-select{
      position: relative;
      display: flex;
      border: 1px solid white;
      width: 80vw;
      margin: 20px auto 0 auto;
      padding: 0px 20px;
      text-align: center;
      font-size: 18pt;
      
      .is-active{
        font-weight: 600;
      }

      &-item{
        display: inline;
        width: 50%;
        &:hover{cursor: pointer;}

        .icon{
          display: inline-block;
          width: 100%;
          vertical-align: center;    
        }
      }

      
    }

    &-cloud{
      position: relative;
      overflow-y: auto;
      height: 300px;
      display: flex;
      flex-direction: column;
      width: 80vw;
      margin: 0 auto;
      font-size: 18pt;
      user-select:none;
      margin-top: 60px;

      h3{
       font-weight: 600;
       font-size: 20pt;
       border-bottom: 1px solid white;
      }

      ul{
        padding: 0;
        margin-top: 30px;
        font-style: italic;
        list-style-type: none;
        font-weight: 200;
        position: relative;
        overflow-y: scroll;

        li:hover{cursor: pointer;}
      }
    }

  }
}

.mobile-open{
  transform: translate(0px, 0px);
}
.currentCloud{
  font-weight: 600;
  color: var(--color-primary);
}

.side-nav{
  min-width: 230px;
  max-width: 230px;
  width: 100%;
  min-height: 500px;
  height: fit-content;
  padding: 15px 0 100px 0;  //inklusive bottombar
  margin-right: 20px;
  display: block;
  position: relative;
  overflow: hidden;
  
  background-color: var(--color-accent);
  // background: url('../../static/grey_pixel.png');
  // background-size: cover;
  border-radius: 10px;
  box-shadow: var(--shadow-medium);

  font-size: 12pt;
  color: var(--color-primary);
  line-height: 40px;  

  .sub{
    color: var(--color-primary);
    line-height: 20px;
    font-size: 10pt;
    font-weight: 400;
    padding-left: 10px;

    .cloud-button{
      color: inherit;
      font-size: inherit;
      font-weight: inherit;
    }
    .addCloudLink{
      color: var(--color-primary);
      font-size: inherit;

      &:hover{
        text-decoration: none;
      }
    }
  }


  .clouds{
    &-list{
      display: flex;
      &-main{
        flex-grow: 1;
        &-icon{}
      }
      &-lock-icon{
        font-size: 12pt;
        display: none;
      }
    }
    &:hover{
      .clouds-list-lock-icon{display: inline}
    }
  }
  

  .icon{
    display: inline-block;
    width: 30px;
    padding: auto;
    vertical-align: center;    
  }

  .bottom{
    position: absolute;
    bottom: 0px;  
    padding: 20px;
    width: 100%;
    font-size: 10pt;

    .progressbar{    
    position: relative;
    width: auto;
    height: 7px;   
    border-radius: 20px;
    background-color: var(--color-theme);
      &::before{
        position: absolute;
        z-index: 2;
        content: "";
        height: 7px;
        width: var(--disk-space);   
        border-radius: 20px;
        background-color: var(--color-info);
      }
    }
  }  

  ul{
    list-style-type: none;
    padding: 0;
    margin: 0;     

    li{
      border-width: 1px;
      padding: 0 20px;
      margin-top: -1px;
      &.is-active{
        border-left: 6px solid var(--color-info);
        padding-left: 14px;
        font-weight: bold;
      }
      &:hover{
        background-color: var(--color-accent-2);
        cursor: pointer;
        color: var(--color-primary);
      }
    }
  }

  .admin-menu{
    margin-top: 50px;
    border-top: 1px dashed var(--color-secondary);
    border-bottom: 1px dashed var(--color-secondary);
    padding: 10px 0;
    &-heading{
      padding: 20px;
      font-size: 13pt;
      color: var(--color-secondary);
    }
  } 
}

.popper{
  background-color: var(--color-popper);
  padding: 5px 10px 8px 10px;
  border-radius: 6px;
  margin: 0;
  border: 1px solid transparent;
  box-shadow: var(--shadow-small);
  display: flex;
  flex-direction: column;

  &-icon{
    display: inline; 
    font-size: 15pt !important;
    // @media (max-width: 992px) {
    //   font-size: 13pt !important;
    // }
  }

  &.hidden{
    visibility: hidden !important;
  }
}
</style>