

export default {
    data() {
        return {
            searchClient: "",
            sortDirection: 'desc',
            sortValue: 'createdAt'
        }
    },
    computed: {
        search() {
            return this.searchClient.toLowerCase().trim();
        },
        filteredFiles() {
            if (!this.files.files) return this.files
            var files = [...this.files.files].filter(c => {
                return (
                    this.hasSearchedValue(c.filename) ||
                    this.hasSearchedValue(c._id) ||
                    this.hasSearchedValue(this.$options.filters.calculateSize(c.size)) ||
                    this.hasSearchedValue(this.$options.filters.formatDate(c.createdAt))
                )
            })
            return {
                count: files.length,
                files: files
            }
        }, //filtered files are further used and sorted here vvvvvvvvvvvvvvvvvvvv////
        sortedAndFilteredFiles() {
            var filteredFiles = this.filteredFiles
            var sortValue = this.sortValue == 'name' || this.sortValue == 'username' ? 'filename' : this.sortValue
            filteredFiles.files = _.orderBy(this.filteredFiles.files, sortValue, this.sortDirection)
            return Object.assign({}, filteredFiles)
        }, /////////////////////////////////////////////////HIER WEITER MACHEN DAMIT MAN NACH ALLEM SORTIEREN KANN

    },
    methods: {
        hasSearchedValue(searchKey) {
            return searchKey.toLowerCase().trim().indexOf(this.search) > -1;
        },
        changeSortingMethod(sortValue) {
            if (this.sortValue == sortValue) {
                this.sortDirection = this.sortDirection == "asc" ? "desc" : "asc";
            } else this.sortValue = sortValue;
        },
    }
}