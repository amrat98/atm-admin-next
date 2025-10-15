import { useUser } from "@/lib/userContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import { apiConfig } from "@/config/apiConfig";
import { toast } from "sonner";

export function useBlockHandler() {
  const { token, setToken } = useUser();
  const router = useRouter();

  const handleBlock = async (userId: string, status: boolean): Promise<boolean> => {
    if (!userId || !token) return false;
    try {
      const response = await axios.post(
        apiConfig.blockUsers,
        { userId, status },
        { headers: { token } }
      );
      console.log(response);
      toast.success("User Blocked successful!");
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

  return { handleBlock };
}
