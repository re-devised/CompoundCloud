import {mapState} from 'vuex'

export default {
    computed:{
      ...mapState({
        allClouds: state => state.cloud.allClouds,
        allUsers: state => state.user.allUsers
      }),
      filteredAllClouds() {
        if(this.allClouds == null) return this.allClouds
        var clouds = [...this.allClouds.clouds].filter(c => {return(
          this.hasSearchedValue(c.name) ||
          this.hasSearchedValue(c._id) ||
          this.hasSearchedValue(c.creator ? c.creator.username : "") ||
          this.hasSearchedValue(this.$options.filters.formatDate(c.createdAt))
        )})
        return {
          count: clouds.length,
          clouds: clouds
        }
      },
      filteredAllUsers() {
        if(this.allUsers == null) return this.allUsers
        var users = [...this.allUsers.users].filter(c => {return(
          this.hasSearchedValue(c.username) || 
          this.hasSearchedValue(c._id) ||
          this.hasSearchedValue(c.clouds.toString()) ||
          this.hasSearchedValue(this.$options.filters.formatDate(c.createdAt))
        )})
        return {
          count: users.length,
          users: users
        }

        ///FIX MAL DIE SUCHE HIER !!!!!!!!!!!!!
      },
      sortedAndFilteredAllClouds(){
        var filteredAllClouds = this.filteredAllClouds
        var sortValue = this.sortValue == 'username' || this.sortValue == 'filename' ? 'name' : this.sortValue
        if(sortValue == 'size'){
          filteredAllClouds.clouds.sort((a,b) => {

            let cloudSizeA = 0
            let cloudSizeB = 0
            for(var file in a.files){
              cloudSizeA += a.files[file].size
            }
            for(var file in b.files){
              cloudSizeB += b.files[file].size
            }
            if(this.sortDirection == 'asc'){
              if(cloudSizeA > cloudSizeB){ return 1 } else return -1
            }
            if(this.sortDirection == 'desc'){
              if(cloudSizeA < cloudSizeB){ return 1 } else return -1
            }
          })

        }else filteredAllClouds.clouds = _.orderBy(this.filteredAllClouds.clouds, sortValue, this.sortDirection)
        return Object.assign({}, filteredAllClouds)
      },
      sortedAndFilteredAllUsers(){
        var filteredAllUsers = this.filteredAllUsers
        var sortValue = this.sortValue == 'name' || this.sortValue == 'filename' ? 'username' : this.sortValue
        filteredAllUsers.users = _.orderBy(this.filteredAllUsers.users, sortValue, this.sortDirection)
        return Object.assign({}, filteredAllUsers)
      },
    },
    methods:{
      async adminChangeCurrentSection(section){
        if(this.isAdminUser){
          if(section === 4){ //ALL CLOUDS SECTION
            await this.$store.dispatch('cloud/fetchClouds')
              .catch(_ => {
                this.$toasted.error(`Clouds could not be loaded`, {
                  duration: 5000,
                })
              })
          }
          if(section === 5){
            await this.$store.dispatch('user/fetchUsers')
              .catch(_ => {
                this.$toasted.error(`Users could not be loaded`, {
                  duration: 5000,
                })
              })
          }
        }        
      }
    }   
}