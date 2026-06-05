import { useEffect } from 'react';
import {useChat} from '../context/chatContext.js'
import  { useRef } from "react";

const ChatArea = () => {
     const {
     
    user,
    project,
    messages,
    message,
    setMessage,
    send,
    isSidePanelOpen,
    setIsSidePanelOpen,
    isModalOpen,
    setIsModalOpen,
    users,
    selectedUserId,
    handleUserClick,
    addCollaborators,
    WriteAiMessage,
  } = useChat();

  const messageBox = useRef(null);
     
  useEffect(() => {
    if (messageBox.current) {
      messageBox.current.scrollTop = messageBox.current.scrollHeight;
    }
  }, [messages]);
    
  return (
      <section className="left relative flex flex-col h-screen min-w-96 bg-slate-900 border-r border-slate-800">
        <header className="flex justify-between items-center p-3 px-5 w-full bg-slate-900 border-b border-slate-800 absolute z-10 top-0 shadow-md">
          <button className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg" onClick={() => setIsModalOpen(true)}>
            <i className="ri-user-add-line"></i>
            <span className="text-sm font-medium">Add collaborator</span>
          </button>
          <button
            onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
            className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800"
          >
            <i className="ri-group-line text-xl"></i>
          </button>
        </header>

        <div className="conversation-area pt-16 pb-16 flex-grow flex flex-col h-full relative bg-slate-950">
          <div
            ref={messageBox}
            className="message-box p-4 flex-grow flex flex-col gap-4 overflow-auto max-h-full scrollbar-hide"
          >
            {messages.map((msg, index) => {
              const isAi = msg?.sender?._id === "ai";
              const isMe = msg?.sender?._id == user._id.toString();
              return (
              <div
                key={index}
                className={`message flex flex-col p-3 rounded-2xl w-fit shadow-md ${
                  isAi ? "max-w-[85%] bg-slate-800 text-slate-200 border border-slate-700" : "max-w-[75%]"
                } ${
                  isMe ? "ml-auto bg-indigo-600 text-white rounded-br-none" : (!isAi ? "bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none" : "rounded-bl-none")
                }`}
              >
                {!isMe && <small className={`text-xs mb-1 font-medium ${isAi ? "text-indigo-400" : "text-slate-400"}`}>{msg.sender.email}</small>}
                <div className="text-sm leading-relaxed">
                  {isAi ? (
                    WriteAiMessage(msg.message)
                  ) : (
                    <p>{msg.message}</p>
                  )}
                </div>
              </div>
            )})}
          </div>

          <div className="inputField w-full flex absolute bottom-0 bg-slate-900 border-t border-slate-800 p-3 items-center gap-2">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              className="flex-grow p-3 px-4 bg-slate-950 border border-slate-700 rounded-full text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              type="text"
              placeholder="Message AI (@ai) or team..."
            />
            <button onClick={send} className="w-12 h-12 flex items-center justify-center rounded-full bg-indigo-600 text-white hover:bg-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.4)] transition-all">
              <i className="ri-send-plane-fill text-lg"></i>
            </button>
          </div>
        </div>

        {/* Side Panel for Collaborators */}
        <div
          className={`sidePanel w-full h-full flex flex-col gap-2 bg-slate-900 border-r border-slate-800 absolute z-20 transition-transform duration-300 ${
            isSidePanelOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
          } top-0`}
        >
          <header className="flex justify-between items-center px-5 py-4 bg-slate-900 border-b border-slate-800">
            <h1 className="font-bold text-lg text-white">Collaborators</h1>
            <button
              onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <i className="ri-close-line text-xl"></i>
            </button>
          </header>
          <div className="users flex flex-col gap-1 p-2 overflow-auto">
            {project.users &&
              project.users.map((u,i) => {
                return (
                  <div key={i} className="user cursor-pointer hover:bg-slate-800/80 p-3 rounded-lg flex gap-3 items-center transition-colors">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white bg-indigo-500 shadow-inner">
                      <i className="ri-user-smile-line text-lg"></i>
                    </div>
                    <h1 className="font-medium text-slate-200">{u.email}</h1>
                  </div>
                );
              })}
          </div>
        </div>

         {/* Add Collaborator Modal */}
         {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 shadow-2xl p-6 rounded-2xl w-full max-w-md relative">
            <header className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Select Users</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <i className="ri-close-line text-2xl"></i>
              </button>
            </header>
            <div className="users-list flex flex-col gap-2 mb-16 max-h-72 overflow-auto scrollbar-thin scrollbar-thumb-slate-700 pr-2">
              { Array.isArray(users) && users.map((u,i) => {
                const isSelected = Array.from(selectedUserId).indexOf(u._id) !== -1;
                return (
                <div
                  key={u._id||i}
                  className={`user cursor-pointer rounded-xl p-3 flex gap-3 items-center transition-all border ${
                    isSelected
                      ? "bg-indigo-600/20 border-indigo-500/50"
                      : "bg-slate-800/50 border-transparent hover:bg-slate-800"
                  }`}
                  onClick={() => handleUserClick(u._id)}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors ${isSelected ? 'bg-indigo-500' : 'bg-slate-700'}`}>
                    {isSelected ? <i className="ri-check-line"></i> : <i className="ri-user-line"></i>}
                  </div>
                  <h1 className="font-medium text-slate-200">{u.email}</h1>
                </div>
              )})}
            </div>
            <button
              onClick={addCollaborators}
              className="absolute bottom-6 left-6 right-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 transition-all active:scale-[0.98]"
            >
              Add Selected to Project
            </button>
          </div>
        </div>
      )}
      </section>
  )
}

export default ChatArea
