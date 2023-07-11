import React from "react";
import {useSigner} from "@thirdweb-dev/react";
import {ethers} from "ethers";

export type Read = {
    data: any[],
    refetch: () => void,
    loading: boolean,
}

export function useReadContract(contract: ethers.Contract, func: string, args: any[]) {
    const [data, setData] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    const [reload, setReload] = React.useState(true)

    React.useEffect(()=> {
        async function readContract() {
            try {
                setLoading(true)
                const result= await contract.functions[func](...args)
                setData(result)
                setLoading(false)
            } catch (error) {
                setLoading(false);
            }
        }
        if (reload) {
            readContract()
            setReload(false)
        }
    }, [contract, func, args, reload]);

    return { data: data, reload: ()=>{ setReload(true) }, loading: loading };
}

