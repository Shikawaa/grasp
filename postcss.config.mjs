const config = {
    plugins: {
        "@csstools/postcss-global-data": {
            files: ["./styles/tokens.css"],
        },
        "postcss-custom-media": {
            preserve: false,
        },
        autoprefixer: {},
    },
};

export default config;
