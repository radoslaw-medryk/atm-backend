import { sure } from "./utils/sure";

export const config = {
    server: {
        port: parseInt(sure(process.env.PORT)),
    },
    db: {
        connection: sure(process.env.DB_CONNECTION),
        initDummyData: sure(process.env.DB_INIT_DUMMY_DATA) === "true",
    },
};
