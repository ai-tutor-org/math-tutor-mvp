import React, { useState } from 'react'

function NameInput({ onStart }) {
    const [name, setName] = useState('')
    const [isFocused, setIsFocused] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        if (name.trim()) {
            onStart(name.trim())
        }
    }

    return (
        <div className="name-input" style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '30px',
            padding: '50px',
            border: '3px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.1)',
            maxWidth: '500px',
            width: '100%'
        }}>
            <form onSubmit={handleSubmit}>
                <label
                    htmlFor="name"
                    style={{
                        display: 'block',
                        fontSize: '1.6rem',
                        fontWeight: 'bold',
                        color: '#2c3e50',
                        marginBottom: '30px',
                        textAlign: 'center'
                    }}
                >
                    What's your name, explorer? 🚀
                </label>

                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Enter your awesome name!"
                    required
                    style={{
                        width: '100%',
                        padding: '20px 25px',
                        fontSize: '1.3rem',
                        borderRadius: '20px',
                        border: isFocused ? '3px solid #4ecdc4' : '3px solid #ddd',
                        backgroundColor: 'white',
                        color: '#2c3e50',
                        marginBottom: '35px',
                        transition: 'all 0.3s ease',
                        boxShadow: isFocused ? '0 0 25px rgba(78, 205, 196, 0.3)' : '0 3px 15px rgba(0,0,0,0.1)',
                        outline: 'none',
                        boxSizing: 'border-box'
                    }}
                />

                <button
                    type="submit"
                    disabled={!name.trim()}
                    style={{
                        width: '100%',
                        padding: '20px 25px',
                        fontSize: '1.4rem',
                        fontWeight: 'bold',
                        borderRadius: '20px',
                        border: 'none',
                        backgroundColor: name.trim() ? '#4ecdc4' : '#ccc',
                        color: 'white',
                        cursor: name.trim() ? 'pointer' : 'not-allowed',
                        transition: 'all 0.3s ease',
                        transform: name.trim() ? 'scale(1)' : 'scale(0.98)',
                        boxShadow: name.trim()
                            ? '0 10px 30px rgba(78, 205, 196, 0.4)'
                            : '0 3px 15px rgba(0,0,0,0.1)',
                        boxSizing: 'border-box'
                    }}
                    onMouseEnter={(e) => {
                        if (name.trim()) {
                            e.target.style.transform = 'scale(1.05)'
                            e.target.style.boxShadow = '0 15px 40px rgba(78, 205, 196, 0.5)'
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (name.trim()) {
                            e.target.style.transform = 'scale(1)'
                            e.target.style.boxShadow = '0 10px 30px rgba(78, 205, 196, 0.4)'
                        }
                    }}
                >
                    {name.trim() ? '🎯 Start Learning!' : 'Enter your name first!'}
                </button>
            </form>
        </div>
    )
}

export default NameInput 