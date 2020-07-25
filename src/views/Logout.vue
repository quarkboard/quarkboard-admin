<template>
    <div class="container pt-5">
        <div class="jumbotron">
            <h1 class="display-5">Logged Out</h1>
            <p class="lead">
                You are successfully logged out.
                Feel free to <router-link to="/login">login again</router-link>.
            </p>
        </div>
    </div>
</template>

<script>
    import AuthService from '../services/auth.service';
    export default {
        name: 'Logout',
        head: {
            title: () => ({ inner: 'Logout' }),
        },
        computed: {
            loggedIn() {
                return this.$store.state.auth.loggedIn;
            }
        },
        mounted() {
            if (this.loggedIn) {
                AuthService.logout();
                window.location.reload();
            }
        }
    }
</script>
