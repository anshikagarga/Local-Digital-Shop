export const cardVariants = {
    hidden: {
        opacity: 0,
        y: 25,
    },

    visible: {
        opacity: 1,
        y: 0,

        transition: {
            duration: 0.4,
            ease: "easeOut",
        },
    },

    hover: {
        y: -6,

        transition: {
            duration: 0.2,
            ease: "easeOut",
        },
    },
};