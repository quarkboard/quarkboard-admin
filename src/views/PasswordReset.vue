<template>
    <div class="password-reset">
        <div class="col-md-12">
            <div class="card card-container">
                <div class="profile-img-card bg-dark py-3">
                    <font-awesome-icon icon="key" class="text-light fa-4x" />
                </div>

                <form name="form" @submit.prevent="handleReset">
                    <div class="form-group">
                        <label class="text-left" for="username">Old Password</label>
                        <input
                            v-model="password.oldPassword"
                            v-validate="'required'"
                            v-bind:class="{ 'alert-danger': errors.has('oldPassword') }"
                            id="oldPassword"
                            type="password"
                            class="form-control"
                            name="oldPassword"
                            autocomplete="current-password"
                        />
                        <div
                            v-hidden="!errors.has('oldPassword')"
                            class="text-sm-right small text-danger"
                            role="alert"
                        >
                            Old password is required!
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="text-left" for="password">New Password</label>
                        <input
                            v-model="password.newPassword"
                            v-validate="'required'"
                            v-bind:class="{ 'alert-danger': errors.has('newPassword') }"
                            id="newPassword"
                            type="password"
                            class="form-control"
                            name="newPassword"
                            autocomplete="new-password"
                        />
                        <div
                            v-hidden="!errors.has('newPassword')"
                            class="text-sm-right small text-danger"
                            role="alert"
                        >
                            New Password is required!
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="text-left" for="confirmPassowrd">Confirm Password</label>
                        <input
                            v-model="password.confirmPassowrd"
                            v-validate="'required'"
                            v-bind:class="{ 'alert-danger': errors.has('confirmPassowrd') }"
                            id="confirmPassowrd"
                            type="password"
                            class="form-control"
                            name="confirmPassowrd"
                            autocomplete="new-password"
                        />
                        <div
                            v-hidden="!errors.has('confirmPassowrd')"
                            class="text-sm-right small text-danger"
                            role="alert"
                        >
                            Confirmed password is required and must match new password!
                        </div>
                    </div>
                    <div class="form-group">
                        <button
                            class="btn btn-primary btn-block"
                            :disabled="loading || errors.has('oldPassword') || errors.has('newPassword') || errors.has('confirmPassword')"
                        >
                        <span
                            v-show="loading"
                            class="spinner-border spinner-border-sm"
                        ></span>

                            <span>Reset Password</span>
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
    </div>
</template>

<script>
    export default {
        name: 'PasswordReset',
        head: {
            title: () => ({ inner: 'Password Reset' }),
        },
        data() {
            return {
                password: {
                    oldPassword: null,
                    newPassword: null,
                    confirmPassword: null,
                },
                loading: false,
                message: '',
            };
        },
        computed: {
            version() {
                return process.env.PACKAGE_VERSION;
            }
        },
        created() {
            if (!this.loggedIn) {
                this.$router.push('/login');
            }
        },
        methods: {
            handleReset() {
                this.loading = true;
                this.$validator.validateAll().then(isValid => {
                    if (!isValid) {
                        this.loading = false;
                        return;
                    }

                    if (this.user.username && this.user.password) {
                        this.$store.dispatch('auth/reset', this.user).then(
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
        }
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
