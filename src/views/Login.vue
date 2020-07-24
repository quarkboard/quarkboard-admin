<template>
    <div class="col-md-12">
        <div class="card card-container">
            <img
                id="profile-img"
                src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                class="profile-img-card"
            />
            <form name="form" @submit.prevent="handleLogin">
                <div class="form-group">
                    <label class="text-left" for="username">Username</label>
                    <input
                        v-model="user.username"
                        v-validate="'required'"
                        v-bind:class="{ 'alert-danger': errors.has('username') }"
                        id="username"
                        type="text"
                        class="form-control"
                        name="username"
                        autocomplete="username"
                    />
                    <div
                        v-hidden="!errors.has('username')"
                        class="text-sm-right small text-danger"
                        role="alert"
                    >
                        Username is required!
                    </div>
                </div>
                <div class="form-group">
                    <label class="text-left" for="password">Password</label>
                    <input
                        v-model="user.password"
                        v-validate="'required'"
                        v-bind:class="{ 'alert-danger': errors.has('password') }"
                        id="password"
                        type="password"
                        class="form-control"
                        name="password"
                        autocomplete="current-password"
                    />
                    <div
                        v-hidden="!errors.has('password')"
                        class="text-sm-right small text-danger"
                        role="alert"
                    >
                        Password is required!
                    </div>
                </div>
                <div class="form-group">
                    <button
                        class="btn btn-primary btn-block"
                        :disabled="loading || errors.has('username') || errors.has('password')"
                    >
                        <span
                            v-show="loading"
                            class="spinner-border spinner-border-sm"
                        ></span>

                        <span>Login</span>
                    </button>
                </div>
                <div class="form-group">
                    <div v-if="message" class="alert alert-danger" role="alert">
                        {{ message }}
                    </div>
                </div>
            </form>
        </div>
        <span class="small">QuarkboardAdmin v{{ this.version }}</span>
    </div>
</template>

<script>
    import User from '../models/user';

    export default {
        name: 'Login',
        data() {
            return {
                user: new User('', ''),
                loading: false,
                message: '',
            };
        },
        computed: {
            loggedIn() {
                return this.$store.state.auth.loggedIn;
            },
            passwordReset() {
                return this.$store.state.auth.resetPassword;
            },
            version() {
                return process.env.PACKAGE_VERSION;
            }
        },
        created() {
            if (this.loggedIn) {
                this.$router.push('/profile');
            }
        },
        methods: {
            handleLogin() {
                this.loading = true;
                this.$validator.validateAll().then(isValid => {
                    if (!isValid) {
                        this.loading = false;
                        return;
                    }

                    if (this.user.username && this.user.password) {
                        this.$store.dispatch('auth/login', this.user).then(
                            () => {
                                if (this.passwordReset) {
                                    this.$router.push('/password-reset');
                                    return;
                                }

                                this.$router.push('/dashboard');
                            },
                            error => {
                                this.loading = false;
                                this.message =
                                    (error.response && error.response.data) ||
                                    error.message ||
                                    error.toString();
                            },
                        );
                    }
                });
            },
        },
    };
</script>

<style scoped>
    label {
        display: block;
        margin-top: 10px;
    }

    .card-container.card {
        max-width: 350px !important;
        padding: 40px 40px;
    }

    .card {
        background-color: #f7f7f7;
        padding: 20px 25px 30px;
        margin: 0 auto 25px;
        margin-top: 50px;
        -moz-border-radius: 2px;
        -webkit-border-radius: 2px;
        border-radius: 2px;
        -moz-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
        -webkit-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
        box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
    }

    .profile-img-card {
        width: 96px;
        height: 96px;
        margin: 0 auto 10px;
        display: block;
        -moz-border-radius: 50%;
        -webkit-border-radius: 50%;
        border-radius: 50%;
    }
</style>
