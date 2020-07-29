<template>
    <div id="app">
        <header class="navbar navbar-dark bg-dark">
            <div class="d-flex w-100 justify-content-between align-items-end">
                <router-link
                    to="/"
                    class="navbar-brand"
                    v-bind:class="{ 'mr-auto': !this.loggedIn }"
                    ><b>Quarkboard</b>Admin
                </router-link>

                <router-link
                    v-if="(!this.loggedIn && !this.loginPage) || this.logoutPage"
                    to="/login"
                    class="nav-link text-light"
                >
                    <font-awesome-icon icon="sign-in-alt" />
                    Login
                </router-link>

                <router-link
                    v-if="this.loggedIn && !this.loginPage && !this.logoutPage"
                    to="/logout"
                    class="nav-link text-light pr-0"
                >
                    <font-awesome-icon icon="sign-out-alt" />
                    Logout
                </router-link>
            </div>
        </header>
        <main>
            <router-view />
        </main>
    </div>
</template>

<script>
    export default {
        name: 'App',
        computed: {
            loggedIn() {
                return this.$store.state.auth.loggedIn;
            },
            loginPage() {
                return this.$route.name === 'Login';
            },
            logoutPage() {
                return this.$route.name === 'Logout';
            },
        },
    };
</script>

<style lang="scss">
    main {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
    }

    .profile-img-card {
        text-align: center;
    }

    header {
        a.navbar-brand {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-weight: 300;
            font-size: 20px;
        }

        nav {
            padding: 30px;

            a {
                font-weight: bold;
                color: #2c3e50;

                &.router-link-exact-active {
                    color: #42b983;
                }
            }
        }
    }
</style>
