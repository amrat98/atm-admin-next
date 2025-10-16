import { useUser } from "@/lib/userContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import { apiConfig } from "@/config/apiConfig";
import { toast } from "sonner";

export function useBlockWalletHandler() {
  const { token, setToken } = useUser();
  const router = useRouter();

  const handleBlockWallet = async (userId: number, status: boolean): Promise<boolean> => {
    if (!userId || !token) return false;
    try {
      const response = await axios.post(
        apiConfig.blockWallets,
        { userId: userId, block: status },
        { headers: { token } }
      );
      //console.log(response);
      if(response.data.result.result){
        toast.success("User wallet block successfully!");
      }else{
        toast.success("User wallet unblock successfully!");
      }
      return true;
    } catch (error: unknown) {
      let errorMessage = "Failed to Block/Unblock Wallet";
      if (
        axios.isAxiosError(error) &&
        error.response?.data?.responseMessage
      ) {
        errorMessage = error.response.data.responseMessage;
      }
      if (errorMessage === "jwt expired") {
        setToken("");
        router.push("/login");
      }else{
        toast.error(errorMessage);
      }
      return false;
    }
  };

  return { handleBlockWallet };
}
