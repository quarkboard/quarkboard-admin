export default function authHeader() {
    const accessToken = JSON.parse(localStorage.getItem('accessToken'));

    // for Node.js Express back-end
    return accessToken ? { 'x-access-token': accessToken } : {};
}
