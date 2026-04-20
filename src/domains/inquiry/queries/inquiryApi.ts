import { apiClient } from "@/shared/api/client";
import type {
  InquiryCreateRequest,
  InquiryCreateResponse,
} from "@/shared/api/client";

export const createInquiry = async (body: InquiryCreateRequest) => {
  const { data } = await apiClient.post<{ data: InquiryCreateResponse }>(
    "/api/inquiries",
    body,
  );
  return data.data;
};
