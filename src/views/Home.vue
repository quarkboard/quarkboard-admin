<template>
    <div class="home">
        <img alt="Vue logo" src="../assets/logo.png" />
    </div>
</template>

<script>
    // @ is an alias to /src
    export default {
        name: 'Home',
        head: {
            title: () => ({ inner: 'Home' }),
        },
    };
</script>
