import { useQuery } from "@tanstack/react-query";
import { ZodError } from "zod";
import { ApiResponseBackend, ApiResponseSchema } from "./schemas";

const getHotelInfo = async ({
  url,
}: {
  url: string;
}): Promise<ApiResponseBackend> => {
  const res = await fetch(`/api/interceptor?url=${encodeURIComponent(url)}`, {
    method: "GET",
  });
  const raw = await res.json();
  return ApiResponseSchema.parse(raw);
};

export const useHotelInfo = ({ url }: { url: string }) => {
  return useQuery({
    queryKey: ["hotelInfo", url],
    queryFn: () => getHotelInfo({ url }),
    retry: false,
    enabled: false,
  });
};
