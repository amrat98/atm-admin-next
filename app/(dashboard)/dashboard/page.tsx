"use client"
import { StatsCards } from "./stats-cards"
import { useRouter } from "next/navigation"

// Mock data for UI demonstration
const mockData = {
  // User Stats
  totalUsers: 1247,
  newUsers24h: 23,
  blockedUsers: 15,
  
  // Staking Stats
  totalCoinsStaked: 1250000.75,
  newCoinsStaked24h: 45000.25,
  
  // Wallet Balances
  totalIncomeWallet: 850000.50,
  totalPoolWallet: 420000.75,
  totalAirdropWallet: 125000.25,
  totalFundWallet: 2100000.00,
  
  // Burning Stats
  totalCoinsBurned: 75000.50,
  coinsBurnedToday: 2500.25,
  
  // Pool Stats
  totalPoolIds: 456,
  
  // Transaction Stats
  totalWithdrawals: 125000.75,
  withdrawalsToday: 8500.25,
  totalP2PTransfers: 95000.50,
  p2pTransfersToday: 3200.75,
  
  // Chart Data
  stakingGrowth: [
    { date: '2024-01-01', deposits: 100000, withdrawals: 25000, users: 50 },
    { date: '2024-01-02', deposits: 120000, withdrawals: 30000, users: 65 },
    { date: '2024-01-03', deposits: 150000, withdrawals: 35000, users: 80 },
    { date: '2024-01-04', deposits: 180000, withdrawals: 40000, users: 95 },
    { date: '2024-01-05', deposits: 200000, withdrawals: 45000, users: 110 },
    { date: '2024-01-06', deposits: 250000, withdrawals: 50000, users: 125 },
    { date: '2024-01-07', deposits: 300000, withdrawals: 55000, users: 140 },
  ],
};


export default function Home() {
  const router = useRouter();

  const handleCardClick = (route: string, filters?: Record<string, string>) => {
    const params = new URLSearchParams(filters);
    const url = filters && Object.keys(filters).length > 0 
      ? `${route}?${params.toString()}`
      : route;
    router.push(url);
  };

  return (
    <div className="flex flex-col gap-4 md:gap-6">
        <div>
            <h1 className="text-xl font-semibold">Dashboard</h1>
            <p className="text-muted-foreground text-sm">Welcome to the ATMC Staking Platform Admin Panel</p>
        </div>

        <StatsCards
        data={mockData}
        onCardClick={handleCardClick}
      />

    </div>
  );
}
