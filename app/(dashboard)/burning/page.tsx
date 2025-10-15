"use client"
import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Flame, FlameKindling } from "lucide-react"
import { toast } from "sonner"
import axios from "axios"
import { apiConfig } from "@/config/apiConfig"
import { useUser } from "@/lib/userContext"
import { useRouter } from "next/navigation"
import AvailableBurn from "./available"
import BurnedBurn from "./burned"

export default function Burning() {
    const { token, setToken } = useUser();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [todayBurned, setTodayBurned] = useState(0);
    const [totalBurned, setTotalBurned] = useState(0);

    const getData = async () => {
        setLoading(true);
        try{
            const headers = {
                token: token,
              };
            const response = await axios.get(apiConfig.burnStats, {
                headers,
            });

            setTodayBurned(response.data?.result?.[0]?.todayBurned || 0)
            setTotalBurned(response.data?.result?.[0]?.totalBurned || 0)

            //console.log(response);
            
            //console.log(pageIndex,pageSize,totalPages,totalRows )
            //toast.success(successMessage)
        } catch (error: unknown) {
            let errorMessage = "Failed to Fetch Data"
            if (axios.isAxiosError(error) && error.response?.data?.responseMessage) {
                errorMessage = error.response.data.responseMessage;
            }
            toast.error(errorMessage);
            if(errorMessage === "jwt expired"){
                setToken("");
                router.push("/login");
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
      if (!token) return;
      getData();
    }, [token]);

  return (
    <div className="flex flex-col gap-4 md:gap-6">
        <div>
            <h1 className="text-xl font-semibold">Burning Coins</h1>
            <p className="text-muted-foreground text-sm">Manage coin burning operations and track burned tokens</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
        <Card className="hover:shadow-md transition-shadow gap-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Burned (Lifetime)</CardTitle>
            <Flame size="24" className="text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {totalBurned.toLocaleString()} ATMC
            </div>
            <p className="text-xs text-muted-foreground">
              Lifetime burned tokens
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow gap-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today Burned</CardTitle>
            <FlameKindling size="24" className="text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {todayBurned.toLocaleString()} ATMC
            </div>
            <p className="text-xs text-muted-foreground">
              Burned today
            </p>
          </CardContent>
        </Card>
      </div>
        <Tabs defaultValue="available">
            <TabsList className="mb-2">
                <TabsTrigger value="available" className="cursor-pointer">Available to Burn</TabsTrigger>
                <TabsTrigger value="burned" className="cursor-pointer">Burned Amount</TabsTrigger>
            </TabsList>
            <TabsContent value="available">
            <AvailableBurn />
            </TabsContent>
            <TabsContent value="burned">
            <BurnedBurn />
            </TabsContent>
        </Tabs>
    </div>
  );
}
