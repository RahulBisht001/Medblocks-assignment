"use client";

import {DbProvider} from "../context/DbContext";

const DbProviderClient = ({children}) => {
    return (
        <>
            <DbProvider>{children}</DbProvider>
        </>
    );
};

export default DbProviderClient;
