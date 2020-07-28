<template>
    <div class="password-reset">
        <div class="col-md-12">
            <div class="card card-container">
                <div class="profile-img-card bg-dark py-3">
                    <font-awesome-icon icon="key" class="text-light fa-4x" />
                </div>

                <div>
                    <h5>Password Reset</h5>
                </div>

                <form name="form" @submit.prevent="handleReset">
                    <div class="form-group">
                        <label class="text-left" for="oldPassword"
                            >Old Password</label
                        >
                        <input
                            v-model="password.oldPassword"
                            v-validate="'required'"
                            v-bind:class="{
                                'alert-danger': errors.has('oldPassword'),
                            }"
                            id="oldPassword"
                            type="password"
                            class="form-control"
                            name="oldPassword"
                            autocomplete="current-password"
                            data-vv-as="old password"
                        />
                        <div
                            v-hidden="!errors.has('oldPassword')"
                            class="text-sm-right small text-danger"
                            role="alert"
                        >
                            {{ errors.first('oldPassword') }}
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="text-left" for="newPassword"
                            >New Password</label
                        >
                        <input
                            v-model="password.newPassword"
                            v-validate="'required'"
                            v-bind:class="{
                                'alert-danger': errors.has('newPassword'),
                            }"
                            id="newPassword"
                            type="password"
                            class="form-control"
                            name="newPassword"
                            autocomplete="new-password"
                            ref="newPassword"
                            data-vv-as="new password"
                        />
                        <div
                            v-hidden="!errors.has('newPassword')"
                            class="text-sm-right small text-danger"
                            role="alert"
                        >
                            {{ errors.first('newPassword') }}
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="text-left" for="confirmPassword"
                            >Confirm Password</label
                        >
                        <input
                            v-model="password.confirmPassword"
                            v-validate="'required|confirmed:newPassword'"
                            v-bind:class="{
                                'alert-danger': errors.has('confirmPassword'),
                            }"
                            id="confirmPassword"
                            type="password"
                            class="form-control"
                            name="confirmPassword"
                            autocomplete="new-password"
                            data-vv-as="password"
                        />
                        <div
                            v-hidden="!errors.has('confirmPassword')"
                            class="text-sm-right small text-danger"
                            role="alert"
                        >
                            {{ errors.first('confirmPassword') }}
                        </div>
                    </div>
                    <div class="form-group">
                        <div
                            v-if="message"
                            class="alert alert-danger"
                            role="alert"
                        >
                            {{ message }}
                        </div>
                    </div>
                    <div class="form-group">
                        <button
                            class="btn btn-primary btn-block"
                            :disabled="
                                loading ||
                                    errors.has('oldPassword') ||
                                    errors.has('newPassword') ||
                                    errors.has('confirmPassword')
                            "
                        >
                            <span
                                v-hidden="!loading"
                                class="spinner-border spinner-border-sm"
                            ></span>

                            <span>Reset Password</span>
                        </button>
                    </div>
                </form>
            </div>
            <div class="text-center">
                <span class="small">QuarkboardAdmin v{{ this.version }}</span>
            </div>
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
            loggedIn() {
                return this.$store.state.auth.loggedIn;
            },
            version() {
                return process.env.PACKAGE_VERSION;
            },
        },
        created() {
            if (!this.loggedIn) {
                this.$router.push({ name: 'Login' });
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

                    if (
                        this.password.oldPassword &&
                        this.password.newPassword &&
                        this.password.confirmPassword
                    ) {
                        this.$store.dispatch('auth/reset', this.password).then(
                            () => {
                                this.$router.push({ name: 'Login' });
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

    button {
        display: flex;
        justify-content: center;
        align-content: center;
    }

    .spinner-border {
        margin: auto 0.5rem;
        left: -0.5rem;
        position: relative;
    }

    .card-container.card {
        max-width: 350px !important;
        padding: 20px 40px 0;
    }

    .card {
        background-color: #f7f7f7;
        padding: 20px 25px 30px;
        margin: 50px auto 25px;
        -moz-border-radius: 2px;
        -webkit-border-radius: 2px;
        border-radius: 2px;
        -moz-box-shadow: 0 2px 2px rgba(0, 0, 0, 0.3);
        -webkit-box-shadow: 0 2px 2px rgba(0, 0, 0, 0.3);
        box-shadow: 0 2px 2px rgba(0, 0, 0, 0.3);
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
