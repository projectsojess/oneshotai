'use client'

import { useEffect, useState } from "react"
import ProModal from "@/components/utils/pro-model";

export const ModalProvider = () => {

    const [isMounted, setIsMounted ] = useState(false);

    useEffect(() => {
        setIsMounted(true);

        return () => setIsMounted(false);
    },[]);


    if(!isMounted){
        return null;
    }

    return (
        <div>
            <ProModal />
        </div>
    )
}