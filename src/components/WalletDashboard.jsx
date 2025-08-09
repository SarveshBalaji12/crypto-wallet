import React, { useEffect, useState, useCallback } from 'react';
import { useWallet } from '../context/WalletContext';
import AssetCard from './AssetCard.jsx';
import { getEthBalance, getSolBalance, getBtcBalance } from '../services/blockchain';

function WalletDashboard() {
    const { wallet, logout } = useWallet();
    const [balances, setBalances] = useState({ eth: null, sol: null, btc: null });

    const fetchBalances = useCallback(async () => {
        if (!wallet || !wallet.ethereum || !wallet.bitcoin || !wallet.solana) return;

        try {
            const timeout = (ms) => new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms));

            const [ethRes, solRes, btcRes] = await Promise.allSettled([
                getEthBalance(wallet.ethereum.address),
                getSolBalance(wallet.solana.address),
                Promise.race([getBtcBalance(wallet.bitcoin.address), timeout(8000)])
            ]);

            const eth = ethRes.status === 'fulfilled' ? ethRes.value : 0;
            const sol = solRes.status === 'fulfilled' ? solRes.value : 0;
            const btc = btcRes.status === 'fulfilled' ? btcRes.value : 0;
            setBalances({ eth, sol, btc });
        } catch (error) {
            setBalances({ eth: 0, sol: 0, btc: 0 });
        }
    }, [wallet]);

    useEffect(() => {
        fetchBalances();
        const interval = setInterval(fetchBalances, 30000);
        return () => clearInterval(interval);
    }, [fetchBalances]);

    
    if (!wallet || !wallet.ethereum || !wallet.bitcoin || !wallet.solana) {
        return (
            <div className="text-center">
                <h2 className="text-2xl font-bold text-red-600">Wallet Data Error</h2>
                <p className="my-4">There was a problem loading your wallet data. Please try logging out and importing your wallet again.</p>
                <button onClick={logout} className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700">
                    Logout
                </button>
            </div>
        );
    }

    const coins = [
        { name: 'Ethereum', symbol: 'ETH', ...wallet.ethereum },
        { name: 'Solana', symbol: 'SOL', ...wallet.solana },
        { name: 'Bitcoin', symbol: 'BTC', ...wallet.bitcoin },
    ];

    return (
        <div>
            <header className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold relative group inline-block">
                    Wallet Dashboard
                    <span className="block h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full w-0 group-hover:w-full transition-all duration-500 absolute -bottom-1 left-0"></span>
                </h2>
                <button
                    onClick={logout}
                    className="bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    Logout & Lock
                </button>
            </header>
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg mb-8 animate-fade-in shadow-md">
                <p className="font-bold">Your Mnemonic Phrase (Keep it secret!)</p>
                <p className="font-mono text-sm break-words">{wallet.mnemonic}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {coins.map(coin => (
                    <div className="group relative">
                        <div className="bg-gray-800 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-gray-700 group-hover:border-blue-500">
                            <AssetCard
                                key={coin.symbol}
                                coin={coin}
                                balance={balances[coin.symbol.toLowerCase()]}
                                onTransactionSuccess={fetchBalances}
                            />
                            <span className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-500"></span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default WalletDashboard;