import React from 'react'

const InputButton = ({label,onChange,type,id,placeholder,error,value}) => {
  return (

        <div className="mb-4">
{ label     &&    <label className="block text-gray-400 mb-2" htmlFor={id}>{label}</label>}
                        <input
                        value={value}
                            onChange={(e) => onChange(e.target.value)}
                            type={type}
                            id={id}
                            className={`w-full rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
    error ? "border-red-500 focus:ring-red-500" : ""
  }`}
                            placeholder={placeholder}
                        />

                              {error && <p className='text-red-400 mt-1 text-xs '>Error : {error}</p>}
                    </div>
              
      
   
  )
}

export default InputButton
