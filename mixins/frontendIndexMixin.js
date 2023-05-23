

export default {
    head: {
        title: "CompoundCloud",
    },
    transition: "index",
    data() {
        return {
            isLoaded: false,
            pressedKeys: {},
            onDragover: false,
            windowWidth: 100,
        }
    },
    computed: {
        shortenTextNumber() {
            if (this.windowWidth <= 576) {
                return 14
            }
            if (this.windowWidth <= 768) {
                return 20
            }
            if (this.windowWidth <= 992) {
                return 25
            }
            if (this.windowWidth <= 1200) {
                return 35
            }
            else return 55
        },
    },
    mounted() {
        window.addEventListener('resize', this.updateWindowWidth)
        this.updateWindowWidth()
        window.addEventListener('keyup', (e) => this.handleKeyEvent(e.key, false));
        window.addEventListener('keydown', (e) => this.handleKeyEvent(e.key, true));
    
        setTimeout(() => {
            this.isLoaded = true;
        }, 1000);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.updateWindowWidth)
        window.removeEventListener('keyup', (e) => this.handleKeyEvent(e.key, false));
        window.removeEventListener('keydown', (e) => this.handleKeyEvent(e.key, true));
    },
    methods: {
        handleKeyEvent(event, status) {
            this.pressedKeys[event] = status;
        },
        updateWindowWidth(event) {
            this.windowWidth = window.innerWidth;
        },
        setOnDragover(status) {
            this.onDragover = status;
        },
        getColorMode() {
            var element = window.document.querySelector("html");
            return element.classList[0];
        },
        swipeHandler(direction) {
            if (this.windowWidth < 992) {
                if (direction == "right") {
                    this.$refs.fileSideNav.changeIsMobileOpen(true);
                }
                if (direction == "left") {
                    this.$refs.fileSideNav.changeIsMobileOpen(false);
                }
            }
        },
    },
}