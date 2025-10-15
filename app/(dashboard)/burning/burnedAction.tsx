import { useUser } from "@/lib/userContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import { apiConfig } from "@/config/apiConfig";
import { toast } from "sonner";

export function useBurnedHandler() {
  const { token, setToken } = useUser();
  const router = useRouter();

  const handleBurned = async (planId: string): Promise<boolean> => {
    if (!planId || !token) return false;
    try {
      const response = await axios.post(
        apiConfig.burnCoins,
        { planId },
        { headers: { token } }
      );
      console.log(response);
      toast.success("Burn successful!");
      return true;
    } catch (error: unknown) {
      let errorMessage = "Failed to burn coins";
      if (
        axios.isAxiosError(error) &&
        error.response?.data?.responseMessage
      ) {
        errorMessage = error.response.data.responseMessage;
      }
      toast.error(errorMessage);
      if (errorMessage === "jwt expired") {
        setToken("");
        router.push("/login");
      }
      return false;
    }
  };

  return { handleBurned };
}
