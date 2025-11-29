import { createContext,useContext } from "react";

export const ChatContext= createContext(null);

export  function useChat () {
    const ctx = useContext(ChatContext);

    if(!ctx){
        throw new Error("usechat must be used inside ChatContext.Provider")
    }
    return ctx

}