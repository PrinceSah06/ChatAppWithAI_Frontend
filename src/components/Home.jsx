import React, { useContext, useState, useEffect } from 'react'
import { UserContext } from '../context/user.context'
import axios from '../config/axios'
import { useNavigate } from 'react-router-dom'

const Home = () => {

    const { user, setUser } = useContext(UserContext)
    const [ isModalOpen, setIsModalOpen ] = useState(false)
    const [ projectName, setProjectName ] = useState('')
    const [ project, setProject ] = useState([])

    const navigate = useNavigate()

    function createProject(e) {
        e.preventDefault()
        axios.post('/projects/create', {
            name: projectName,
        })
            .then((res) => {
                setIsModalOpen(false)
                setProjectName('')
                setProject((prevProjects) => [...prevProjects, res.data]);
            })
            .catch((error) => {
                console.log(error)
            })
    }

    useEffect(() => {
        axios.get('/projects/all').then((res) => {
            setProject(res.data.projects)
        }).catch(err => {
            console.log(err)
        })
    }, [])

    function handleLogout() {
        localStorage.removeItem('token')
        setUser(null)
        navigate('/login')
    }

    return (
        <main className='min-h-screen bg-slate-950 text-slate-200'>
            <header className="flex items-center justify-between px-8 py-5 bg-slate-900 border-b border-slate-800 shadow-lg">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                        <i className="ri-code-s-slash-line text-white text-lg"></i>
                    </div>
                    <h1 className="text-xl font-bold text-white tracking-wide">AI Workspace</h1>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-slate-400">{user?.email}</span>
                    <button onClick={handleLogout} className="px-4 py-2 text-sm font-medium text-red-400 bg-red-400/10 hover:bg-red-400/20 rounded-md transition-colors border border-red-400/20">
                        Logout
                    </button>
                </div>
            </header>

            <div className="max-w-7xl mx-auto p-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-2">Your Projects</h2>
                        <p className="text-slate-400">Manage your AI-powered coding workspaces.</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all transform hover:scale-105">
                        <i className="ri-add-line text-xl"></i>
                        New Project
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {project.map((p) => (
                        <div key={p._id}
                            onClick={() => {
                                navigate(`/project`, { state: { project: p } })
                            }}
                            className="group flex flex-col justify-between cursor-pointer p-6 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-indigo-500/50 hover:bg-slate-800/50 transition-all duration-300 shadow-lg hover:shadow-indigo-500/10">
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
                                        <i className="ri-folder-open-fill text-indigo-400 text-xl"></i>
                                    </div>
                                    <h3 className='text-lg font-bold text-slate-100 group-hover:text-indigo-300 transition-colors'>{p.name}</h3>
                                </div>
                            </div>
                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-800">
                                <div className="flex items-center gap-2 text-sm text-slate-400">
                                    <i className="ri-team-line text-slate-500"></i>
                                    <span>{Array.isArray(p.users) ? p.users.length : 0} Collaborators</span>
                                </div>
                                <i className="ri-arrow-right-line text-slate-600 group-hover:text-indigo-400 transition-colors"></i>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm z-50 animate-in fade-in duration-200">
                    <div className="bg-slate-900 border border-slate-700 shadow-2xl rounded-2xl w-full max-w-md overflow-hidden transform scale-100 transition-all">
                        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
                            <h2 className="text-xl font-bold text-white">Create New Project</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                                <i className="ri-close-line text-2xl"></i>
                            </button>
                        </div>
                        <form onSubmit={createProject} className="p-6">
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-300 mb-2">Project Name</label>
                                <input
                                    onChange={(e) => setProjectName(e.target.value)}
                                    value={projectName}
                                    type="text" 
                                    className="w-full p-3 bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" 
                                    placeholder="e.g. My Awesome App"
                                    required 
                                    autoFocus
                                />
                            </div>
                            <div className="flex justify-end gap-3">
                                <button type="button" className="px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="px-5 py-2.5 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-lg shadow-indigo-500/30 transition-all">Create Project</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    )
}

export default Home
