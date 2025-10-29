"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  UserPlus, 
  UserX, 
  Coins, 
  TrendingUp, 
  Wallet, 
  Gift, 
  Flame, 
  Network, 
  ArrowDownToLine, 
  ArrowRightLeft 
} from "lucide-react";

interface StatsData {
  totalUsers: number;
  newUsers24h: number;
  blockedUsers: number;
  totalCoinsStaked: number;
  newCoinsStaked24h: number;
  totalIncomeWallet: number;
  totalPoolWallet: number;
  totalAirdropWallet: number;
  totalFundWallet: number;
  totalCoinsBurned: number;
  coinsBurnedToday: number;
  totalPoolIds: number;
  totalWithdrawals: number;
  withdrawalsToday: number;
  totalP2PTransfers: number;
  p2pTransfersToday: number;
}

interface StatsCardsProps {
  data: StatsData;
  onCardClick: (route: string, filters?: Record<string, string>) => void;
}

export function StatsCards({ data, onCardClick }: StatsCardsProps) {
  const statsCards = [
    {
      title: "Total Users",
      value: data.totalUsers.toLocaleString(),
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
      change: "+12.5% from last month",
      onClick: () => onCardClick("/users"),
    },
    {
      title: "New Users (24h)",
      value: data.newUsers24h.toLocaleString(),
      icon: UserPlus,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
      change: "+5 from yesterday",
      //onClick: () => onCardClick("/users", { filter: "new24h" }),
      onClick: () => onCardClick("/users"),
    },
    {
      title: "Total Coins Staked",
      value: `${data.totalCoinsStaked.toLocaleString()} ATMC`,
      icon: Coins,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
      change: "+20.1% from last month",
      //onClick: () => onCardClick("/transactions", { type: "STAKE" }),
      onClick: () => onCardClick("/transactions"),
    },
    {
      title: "New Coins Staked (24h)",
      value: `${data.newCoinsStaked24h.toLocaleString()} ATMC`,
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/20",
      change: "+8.2% from yesterday",
      //onClick: () => onCardClick("/transactions", { type: "STAKE", period: "24h" }),
      onClick: () => onCardClick("/transactions"),
    },
    {
      title: "Total Income Wallet",
      value: `${data.totalIncomeWallet.toLocaleString()} ATMC`,
      icon: Wallet,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100 dark:bg-indigo-900/20",
      change: "+15.8% from last month",
      //onClick: () => onCardClick("/users", { highlight: "income" }),
      onClick: () => onCardClick("/users"),
    },
    {
      title: "Total Pool Wallet",
      value: `${data.totalPoolWallet.toLocaleString()} ATMC`,
      icon: Network,
      color: "text-cyan-600",
      bgColor: "bg-cyan-100 dark:bg-cyan-900/20",
      change: "+10.3% from last month",
      //onClick: () => onCardClick("/users", { highlight: "pool" }),
      onClick: () => onCardClick("/pool-users"),
    },
    {
      title: "Total Airdrop Wallet",
      value: `${data.totalAirdropWallet.toLocaleString()} ATMC`,
      icon: Gift,
      color: "text-pink-600",
      bgColor: "bg-pink-100 dark:bg-pink-900/20",
      change: "+25.7% from last month",
      //onClick: () => onCardClick("/users", { highlight: "airdrop" }),
      onClick: () => onCardClick("/airdrop"),
    },
    {
      title: "Total Fund Wallet",
      value: `${data.totalFundWallet.toLocaleString()} ATMC`,
      icon: Wallet,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
      change: "+18.4% from last month",
      //onClick: () => onCardClick("/users", { highlight: "fund" }),
      onClick: () => onCardClick("/users"),
    },
    {
      title: "Blocked Users",
      value: data.blockedUsers.toLocaleString(),
      icon: UserX,
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900/20",
      change: "-2 from last week",
      //onClick: () => onCardClick("/users", { userStatus: "blocked" }),
      onClick: () => onCardClick("/users"),
    },
    {
      title: "Total Coins Burned",
      value: `${data.totalCoinsBurned.toLocaleString()} ATMC`,
      icon: Flame,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
      change: "Lifetime burned",
      onClick: () => onCardClick("/burning"),
    },
    {
      title: "Coins Burned Today",
      value: `${data.coinsBurnedToday.toLocaleString()} ATMC`,
      icon: Flame,
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900/20",
      change: "Today's burns",
      //onClick: () => onCardClick("/burning", { period: "today" }),
      onClick: () => onCardClick("/burning"),
    },
    {
      title: "Total IDs in Pool",
      value: data.totalPoolIds.toLocaleString(),
      icon: Network,
      color: "text-teal-600",
      bgColor: "bg-teal-100 dark:bg-teal-900/20",
      change: "+7.2% from last month",
      onClick: () => onCardClick("/pool-users"),
    },
    {
      title: "Total Withdrawals",
      value: `${data.totalWithdrawals.toLocaleString()} ATMC`,
      icon: ArrowDownToLine,
      color: "text-violet-600",
      bgColor: "bg-violet-100 dark:bg-violet-900/20",
      change: "+12.1% from last month",
      //onClick: () => onCardClick("/transactions", { type: "WITHDRAWAL" }),
      onClick: () => onCardClick("/withdraw"),
    },
    {
      title: "Withdrawals Today",
      value: `${data.withdrawalsToday.toLocaleString()} ATMC`,
      icon: ArrowDownToLine,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
      change: "Today's withdrawals",
      //onClick: () => onCardClick("/transactions", { type: "WITHDRAWAL", period: "24h" }),
      onClick: () => onCardClick("/withdraw"),
    },
    {
      title: "Total P2P Transfers",
      value: `${data.totalP2PTransfers.toLocaleString()} ATMC`,
      icon: ArrowRightLeft,
      color: "text-amber-600",
      bgColor: "bg-amber-100 dark:bg-amber-900/20",
      change: "+9.8% from last month",
      //onClick: () => onCardClick("/transactions", { type: "TRANSFER" }),
      onClick: () => onCardClick("/transactions"),
    },
    {
      title: "P2P Transfers Today",
      value: `${data.p2pTransfersToday.toLocaleString()} ATMC`,
      icon: ArrowRightLeft,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
      change: "Today's transfers",
      //onClick: () => onCardClick("/transactions", { type: "TRANSFER", period: "24h" }),
      onClick: () => onCardClick("/transactions"),
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {statsCards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card 
            key={index}
            className="bg-card hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-105 group gap-0"
            onClick={card.onClick}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">
                {card.title}
              </CardTitle>
              <div className={`h-8 w-8 rounded-full ${card.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${card.color} group-hover:scale-105 transition-transform`}>
                {card.value}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {card.change}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}