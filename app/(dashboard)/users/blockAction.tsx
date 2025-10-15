import { useUser } from "@/lib/userContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import { apiConfig } from "@/config/apiConfig";
import { toast } from "sonner";

export function useBlockHandler() {
  const { token, setToken } = useUser();
  const router = useRouter();

  const handleBlock = async (userId: number): Promise<boolean> => {
    if (!userId || !token) return false;
    try {
      const response = await axios.put(
        apiConfig.blockUsers,
        { _id: userId },
        { headers: { token } }
      );
      //console.log(response);
      toast.success(response.data.responseMessage || "User is Block/Unblock Successfully!");
      return true;
    } catch (error: unknown) {
      let errorMessage = "Failed to Block/Unblock user";
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

  return { handleBlock };
}
