import { useQuery } from "@tanstack/react-query";
import { getDocumentTypes } from "../api/client.api";
import { useEffect } from "react";
import { useDocTypeStore } from "../store/docType.store";

export const useDocTypes = () => {
  const setItems = useDocTypeStore((state) => state.setItems);

  const query = useQuery({
    queryKey: ["docTypes"],
    queryFn: getDocumentTypes,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useEffect(() => {
    if (query.data) {
      setItems(query.data);
    }
  }, [query.data, setItems]);

  return query;
};
