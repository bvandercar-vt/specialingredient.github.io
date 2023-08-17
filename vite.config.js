// function fixHtml() {
//     return {
//         name: 'remove-module',
//         transformIndexHtml(html, id) {
//             return html.replaceAll('crossorigin', '').replaceAll('src="/', 'src="').replaceAll('href="/', 'href="')
//         },
//     };
// }

/** @type {import('vite').UserConfig} */
export default {
    base: `/specialingredient.github.io/`,
    build: {
        target: 'esnext',
        modulePreload: false,
    },
    // plugins: [fixHtml()]
}