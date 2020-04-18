<template>
    <svg :class="'icon '+iconClass" aria-hidden="true">
        <use :xlink:href="'#'+iconName"></use>
    </svg>
</template>

<script>
export default {
    props:{
        iconName:'',
        iconClass:''
    }
}
</script>

<style>

</style>