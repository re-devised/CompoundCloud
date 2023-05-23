<template>
    <div
        class="emptyListScreen"
    >
        <h3>{{heading}}</h3>
        <p>{{info}}</p>
        <slot></slot>
    </div>
</template>

<script>
export default {
    props:{
        heading:{
            type: String
        },
        info:{
            type: String
        }
    }
}
</script>

<style scoped lang="scss">
    .emptyListScreen{
        position: relative;
        padding: 80px 20px;
        width: 100%;
        height: 100%;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: var(--color-primary);
        border: 1px solid var(--color-accent);

        .addButton{
            margin-top: 10px;
            background-color: transparent;
            border: 1px solid var(--color-accent);
            border-radius: 5px;
            width: 150px;

            &:focus{
                border: 1px solid var(--color-info);
                outline: none;
            }  
        }

        h3{
            color: var(--color-info);
            font-size: 21pt;
            @media (max-width: 991px) {
               font-size: 18pt; 
            }
        }
        p{
            display: inherit;
            @media (max-width: 991px) {display: none;}
        }  
    }
</style>