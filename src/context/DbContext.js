"use client";
import {createContext, useContext, useEffect, useState} from "react";
import {initDb} from "../lib/db";

export const DbContext = createContext();

export const DbProvider = ({children}) => {
    const [db, setDb] = useState(null);
    useEffect(() => {
        const fetchDb = async () => {
            const db_instance = await initDb();
            setDb(db_instance);
        };
        fetchDb();
    }, [db]);

    return <DbContext.Provider value={db}>{children}</DbContext.Provider>;
};

export const useDb = () => {
    const context = useContext(DbContext);
    return context;
};
