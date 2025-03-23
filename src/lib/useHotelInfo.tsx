import { useQuery } from "@tanstack/react-query";

export const useHotelInfo = ({ url }: { url: string }) => {
  return useQuery({
    queryKey: ["hotelInfo", url],
    queryFn: async () => {
      const res = await fetch(
        `/api/interceptor?url=${encodeURIComponent(url)}`,
        {
          method: "GET",
        }
      );
      const data = await res.json();
      return data;
    },
    enabled: false,
  });
};
