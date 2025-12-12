const CONFIG = {
    API_BASE_URL: 'http://localhost:8080/api'
};

// Export for module systems if needed, otherwise it's a global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
