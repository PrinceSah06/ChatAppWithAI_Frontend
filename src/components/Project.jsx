import React, { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from "../context/user.context";
import { useNavigate, useLocation } from "react-router-dom";
import { ChatContext } from "../context/chatContext";
import axios from "../config/axios";
import {
  initializeSocket,
  receiveMessage} from "../config/socket";
import Markdown from "markdown-to-jsx";
import hljs from "highlight.js";
import { getWebContainer } from "../config/webContainer";
// import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css'; // Changed to dark theme
import ChatArea from "./ChatArea";
import { useChat } from "../hooks/useChat";

function SyntaxHighlightedCode(props) {
  const ref = useRef(null);

  React.useEffect(() => {
    if (ref.current && props.className?.includes("lang-") && window.hljs) {
      window.hljs.highlightElement(ref.current);
      ref.current.removeAttribute("data-highlighted");
    }
  }, [props.className, props.children]);

  return <code {...props} ref={ref} className={`${props.className || ''} rounded-md p-4 block bg-slate-900 border border-slate-800`} />;
}

const Project = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(new Set()); 
  const [project, setProject] = useState(location.state?.project || null);
  const { user } = useContext(UserContext);

  const [users, setUsers] = useState([]);
  const [fileTree, setFileTree] = useState({});

  const [currentFile, setCurrentFile] = useState(null);
  const [openFiles, setOpenFiles] = useState([]);

  const [webContainer, setWebContainer] = useState(null);
  const [iframeUrl, setIframeUrl] = useState(null);

  const [runProcess, setRunProcess] = useState(null);

  const {message,messages,setMessage,setMessages,send} = useChat(project?._id,user,WriteAiMessage) 

  const handleUserClick = (id) => {
    setSelectedUserId((prevSelectedUserId) => {
      const newSelectedUserId = new Set(prevSelectedUserId);
      if (newSelectedUserId.has(id)) {
        newSelectedUserId.delete(id);
      } else {
        newSelectedUserId.add(id);
      }
      return newSelectedUserId;
    });
  };

  function addCollaborators() {
    axios
      .put("/projects/add-user", {
        projectId: location.state.project._id,
        users: Array.from(selectedUserId),
      })
      .then(() => {
        setIsModalOpen(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function WriteAiMessage(message) {
    const messageObject = JSON.parse(message);

    return (
      <div className="overflow-auto bg-slate-900 text-slate-200 rounded-xl p-4 shadow-inner border border-slate-700/50">
        <Markdown
          children={messageObject.text}
          options={{
            overrides: {
              code: SyntaxHighlightedCode,
            },
          }}
        />
      </div>
    );
  }

  function saveFileTree(ft) {
    axios
      .put("/projects/update-file-tree", {
        projectId: project._id,
        fileTree: ft,
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    if (!project) {
      navigate("/");
      return;
    }

    initializeSocket(project._id);

    if (!webContainer) {
      getWebContainer().then((container) => {
        setWebContainer(container);
      });
    }

    const handler= (data) => {
      if (data.sender._id == "ai") {
        const message = JSON.parse(data.message);
        webContainer?.mount(message.fileTree);
        if (message.fileTree) {
          setFileTree(message.fileTree || {});
        }
        setMessages((prevMessages) => [...prevMessages, data]);
      } else {
        setMessages((prevMessages) => [...prevMessages, data]);
      }
    };
    receiveMessage("project-message", handler)

    axios.get(`/projects/get-project/${project._id}`).then((res) => {
      setProject(res.data.project);
      setFileTree(res.data.project.fileTree || {});
    });

    axios
      .get("/user/get-all")
      .then((res) => {
        setUsers(res.data.list);
      })
      .catch((err) => {
        console.log(err);
      });

  }, [ navigate,webContainer,project?._id]);

  return (
    <main className="h-screen w-screen flex overflow-hidden bg-slate-950 text-slate-200">
      <ChatContext.Provider value={{ user,project,message,messages,setMessage,setMessages,send,isSidePanelOpen,setIsSidePanelOpen,users,selectedUserId,handleUserClick,addCollaborators,WriteAiMessage,setIsModalOpen}}>
        <ChatArea/>
      </ChatContext.Provider>
      
      <section className="right grow flex h-full border-l border-slate-800">
        
        {/* File Explorer */}
        <div className="explorer h-full w-64 flex-shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col">
          <div className="p-4 border-b border-slate-800 flex items-center gap-2">
            <i className="ri-folder-open-fill text-indigo-400"></i>
            <h3 className="font-semibold text-slate-200 text-sm tracking-wider uppercase">Explorer</h3>
          </div>
          <div className="file-tree flex-grow overflow-auto p-2">
            {Object.keys(fileTree).map((file, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentFile(file);
                  setOpenFiles([...new Set([...openFiles, file])]);
                }}
                className={`tree-element cursor-pointer p-2 px-3 rounded-md flex items-center gap-3 w-full transition-colors ${currentFile === file ? 'bg-indigo-500/20 text-indigo-300' : 'hover:bg-slate-800 text-slate-400'}`}
              >
                <i className="ri-file-code-line"></i>
                <p className="font-medium text-sm truncate">{file}</p>
              </button>
            ))}
            {Object.keys(fileTree).length === 0 && (
                <div className="text-center p-4 text-slate-500 text-sm mt-4">
                    <i className="ri-folder-info-line text-2xl mb-2 block"></i>
                    <p>No files yet. Ask AI to generate some code.</p>
                </div>
            )}
          </div>
        </div>

        {/* Code Editor Area */}
        <div className="code-editor flex flex-col grow h-full overflow-hidden bg-slate-950">
          <div className="top flex justify-between items-center bg-slate-900 border-b border-slate-800 pr-4">
            
            <div className="files flex overflow-x-auto scrollbar-hide">
              {openFiles.map((file, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentFile(file)}
                  className={`open-file cursor-pointer px-4 py-3 flex items-center gap-2 border-r border-slate-800 min-w-[120px] max-w-[200px] transition-colors ${
                    currentFile === file ? "bg-slate-950 text-indigo-400 border-t-2 border-t-indigo-500" : "bg-slate-900 text-slate-500 hover:bg-slate-800/50"
                  }`}
                >
                  <i className="ri-javascript-fill text-yellow-400/80"></i>
                  <p className="font-medium text-sm truncate">{file}</p>
                  {currentFile === file && (
                      <i className="ri-close-line ml-auto opacity-50 hover:opacity-100" onClick={(e) => {
                          e.stopPropagation();
                          const newOpenFiles = openFiles.filter(f => f !== file);
                          setOpenFiles(newOpenFiles);
                          if(currentFile === file) {
                              setCurrentFile(newOpenFiles.length > 0 ? newOpenFiles[0] : null);
                          }
                      }}></i>
                  )}
                </button>
              ))}
            </div>

            {currentFile && (
                <div className="actions flex gap-3 items-center ml-4">
                <button
                    onClick={async () => {
                    await webContainer.mount(fileTree);

                    const installProcess = await webContainer.spawn("npm", ["install"]);
                    installProcess.output.pipeTo(
                        new WritableStream({
                        write(chunk) { console.log(chunk); },
                        })
                    );

                    if (runProcess) { runProcess.kill(); }

                    let tempRunProcess = await webContainer.spawn("npm", ["start"]);
                    tempRunProcess.output.pipeTo(
                        new WritableStream({
                        write(chunk) { console.log(chunk); },
                        })
                    );

                    setRunProcess(tempRunProcess);

                    webContainer.on("server-ready", (port, url) => {
                        console.log(port, url);
                        setIframeUrl(url);
                    });
                    }}
                    className="flex items-center gap-2 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-md transition-all shadow-[0_0_10px_rgba(79,70,229,0.3)]"
                >
                    <i className="ri-play-fill text-lg"></i>
                    Run Code
                </button>
                </div>
            )}
          </div>

          <div className="bottom flex grow overflow-hidden">
            {fileTree[currentFile] ? (
              <div className="code-editor-area h-full w-full overflow-auto bg-slate-950 p-4">
                <pre className="hljs h-full w-full font-mono text-sm leading-relaxed">
                  <code
                    className="hljs h-full w-full block outline-none text-slate-300"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      const updatedContent = e.target.innerText;
                      const ft = {
                        ...fileTree,
                        [currentFile]: {
                          file: {
                            contents: updatedContent,
                          },
                        },
                      };
                      setFileTree(ft);
                      saveFileTree(ft);
                    }}
                    dangerouslySetInnerHTML={{
                      __html: hljs.highlight(
                        "javascript",
                        fileTree[currentFile].file.contents
                      ).value,
                    }}
                    style={{
                      whiteSpace: "pre-wrap",
                      paddingBottom: "25rem",
                      counterSet: "line-numbering",
                    }}
                  />
                </pre>
              </div>
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 bg-slate-950/50">
                    <i className="ri-code-box-line text-6xl mb-4 opacity-50"></i>
                    <p className="text-lg font-medium">Select a file to start editing</p>
                </div>
            )}
          </div>
        </div>

        {/* Browser Preview Area */}
        {iframeUrl && webContainer && (
          <div className="flex flex-col w-96 flex-shrink-0 border-l border-slate-800 bg-slate-900 shadow-2xl z-10 animate-in slide-in-from-right">
            <div className="address-bar flex items-center p-2 bg-slate-800 border-b border-slate-700">
              <div className="flex gap-2 px-2 mr-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80 cursor-pointer" onClick={() => setIframeUrl(null)}></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <div className="flex-grow flex items-center bg-slate-900 rounded-md px-3 py-1.5 border border-slate-700">
                  <i className="ri-lock-line text-slate-500 text-xs mr-2"></i>
                  <input
                    type="text"
                    onChange={(e) => setIframeUrl(e.target.value)}
                    value={iframeUrl}
                    className="w-full bg-transparent text-slate-300 text-sm outline-none font-mono"
                  />
              </div>
              <button className="p-2 ml-1 text-slate-400 hover:text-white" onClick={() => {
                  const iframe = document.getElementById('preview-iframe');
                  // appending an empty string forces a reload without triggering the 'assigned to itself' linter warning
                  if(iframe) iframe.src += '';
              }}>
                  <i className="ri-refresh-line"></i>
              </button>
            </div>
            <iframe id="preview-iframe" src={iframeUrl} className="w-full grow bg-white"></iframe>
          </div>
        )}
      </section>

    </main>
  );
};

export default Project;
