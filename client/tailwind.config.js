/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "node_modules/flowbite-react/lib/esm/**/*.js"],
    theme: {
        extend: {},
        colors: {
            "my-purple": "#8c52ff",
            "my-dark": "#0c0c1d",
        },
    },
    plugins: [require("flowbite/plugin"), require("tailwind-scrollbar")],
};
