function fixHtml() {
    return {
        name: 'remove-module',
        transformIndexHtml(html, id) {
            return html.replaceAll('Denver', 'DENVERRR')
        },
    };
}

/** @type {import('vite').UserConfig} */
export default {
    base: `/specialingredient.github.io/`,
    build: {
        target: 'esnext',
        modulePreload: false,
    },
    plugins: [fixHtml()]
}