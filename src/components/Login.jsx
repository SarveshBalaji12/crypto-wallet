import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { generateMnemonic } from '../services/wallet';

function Login() {
    const [mnemonic, setMnemonic] = useState('');
    const [newMnemonic, setNewMnemonic] = useState('');
    const [error, setError] = useState('');
    const { login } = useWallet();

    const handleImport = async (e) => {
        e.preventDefault();
        if (!mnemonic.trim() || mnemonic.trim().split(' ').length !== 12) {
            setError('Please enter a valid 12-word mnemonic phrase.');
            return;
        }
        try {
            setError('');
            await login(mnemonic.trim());
        } catch (err) {
            setError('Invalid mnemonic phrase. Please check and try again.');
        }
    };

    const handleCreate = () => setNewMnemonic(generateMnemonic());
    const proceedWithNewMnemonic = async () => await login(newMnemonic);

    if (newMnemonic) {
        return (
            <div className="max-w-md mx-auto mt-16 bg-base-200 p-8 rounded-2xl shadow-2xl animate-fade-in">
                <h2 className="text-2xl font-bold text-center mb-4 relative group">
                    Save Your Secret Phrase
                    <span className="block h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full w-0 group-hover:w-full transition-all duration-500 absolute -bottom-1 left-0"></span>
                </h2>
                <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-700 p-4 rounded-md mb-6 animate-fade-in">
                    <p className="font-bold">IMPORTANT!</p>
                    <p>Write this 12-word phrase down. It's the only way to recover your wallet.</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg text-center font-mono text-lg tracking-wider my-4 text-white shadow-inner animate-fade-in">
                    {newMnemonic}
                </div>
                <button onClick={proceedWithNewMnemonic} className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500 transition-all duration-300 shadow-lg font-bold text-white text-lg mt-2">
                    I've Saved It, Continue
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-lg mx-auto mt-20 animate-fade-in">
            <h1 className="text-5xl font-extrabold text-center mb-8 relative group text-white drop-shadow-lg">
                Simple Crypto Wallet
                <span className="block h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full w-0 group-hover:w-full transition-all duration-500 absolute -bottom-2 left-1/2 -translate-x-1/2 w-1/2"></span>
            </h1>
            <div className="bg-base-200 p-8 rounded-2xl shadow-2xl mb-8 hover:shadow-blue-500/30 hover:scale-[1.025] transition-all duration-300 group relative">
                <h2 className="text-2xl font-semibold mb-4 text-white group-hover:text-blue-400 transition">Import Existing Wallet</h2>
                <form onSubmit={handleImport}>
                    <textarea
                        value={mnemonic}
                        onChange={(e) => setMnemonic(e.target.value)}
                        placeholder="Enter your 12-word mnemonic phrase..."
                        className="w-full p-3 border border-gray-600 rounded-lg bg-base-100 focus:ring-2 focus:ring-blue-500 transition text-white"
                        rows="3"
                    />
                    <button type="submit" className="mt-4 w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500 transition-all duration-300 shadow-lg font-bold text-white text-lg">
                        Import Wallet
                    </button>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </form>
            </div>

            <div className="bg-base-200 p-8 rounded-2xl shadow-2xl hover:shadow-purple-500/30 hover:scale-[1.025] transition-all duration-300 group relative">
                <h2 className="text-2xl font-semibold mb-2 text-white group-hover:text-purple-400 transition">Create a New Wallet</h2>
                <p className="text-gray-400 mb-4">No wallet yet? Create one now.</p>
                <button onClick={handleCreate} className="w-full py-3 rounded-lg bg-gradient-to-r from-gray-900 to-gray-700 hover:from-purple-600 hover:to-blue-500 transition-all duration-300 shadow-lg font-bold text-white text-lg">
                    Create New Wallet
                </button>
            </div>
        </div>
    );
}

export default Login;