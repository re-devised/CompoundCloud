<template>
    <div class="top-nav">
        <slot />
    </div>
</template>

<script>



export default {
      

}
</script>

<style lang="scss">
.popper{
    background-color: var(--color-popper) !important;
    padding: 10px 20px 20px 20px !important;
    border: 1px solid transparent !important;
    border-radius: 6px !important;
    box-shadow: var(--shadow-small) !important;
    display: flex !important;
    flex-direction: column !important;

    &-icon{
        display: inline !important;
        margin-right: 5px !important;
        // @media (max-width: 992px) {
        //   font-size: 13pt !important;
        // }
        &-media{
            margin-right: 0px !important;
        }
    }

    img{
        &:hover{
            cursor: zoom-in;
        }
    }


    hr{
        background-color: var(--color-accent) !important;
    }
}

.top-nav{
    // background-color: rgb(240, 240, 240);
    // border-radius: 5px;
    // box-shadow: var(--shadow-small);
    min-height: 50px;
    height: fit-content;
    width: 100%;
    margin-bottom: 20px;
    position: relative;
    padding: 4px 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: left;


    &-button{
        border: 1px solid var(--color-accent);
        background-color: transparent;
        margin: auto 2px;
        display: inline-block;
        padding: 4px 20px;
        height: 100%;
        vertical-align: text-bottom;

        font-size: 11pt;        
        //@media (max-width: 992px) {font-size: 12pt;}
        // color: $dark-grey;
        color: var(--color-primary);

        &:focus{
            outline: none;
            border: 1px solid var(--color-info);
        }

        .icon{
            display: inline; 
            padding-right: 5px;
            // @media (max-width: 992px) {font-size: 20pt;}
        }        
    }

}
</style>