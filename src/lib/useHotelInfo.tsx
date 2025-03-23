import { useQuery } from "@tanstack/react-query";
import { ApiResponse, ApiResponseSchema } from "./schemas";

export const useHotelInfo = ({ url }: { url: string }) => {
  return useQuery<ApiResponse, Error>({
    queryKey: ["hotelInfo", url],
    queryFn: async () => {
      const res = await fetch(
        `/api/interceptor?url=${encodeURIComponent(url)}`,
        {
          method: "GET",
        }
      );
      const raw = await res.json();
      try {
        const validatedData = ApiResponseSchema.parse(raw);
        return validatedData;
      } catch (error) {
        console.error("Data validation failed:", error);
        throw new Error("Invalid data received from API");
      }
    },
    enabled: false,
  });
};
