import { useQuery } from "@tanstack/react-query";
import { ApiResponse, ApiResponseSchema , ApiResponseBackend } from "./schemas";
import { ZodError } from "zod";

export const useHotelInfo = ({ url }: { url: string }) => {
  return useQuery<ApiResponseBackend, Error>({
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
        if (error instanceof ZodError) {
          throw error;
        }
        throw new Error("Invalid data received from API");
      }
    },
    retry: false,
    enabled: false,
  });
};
