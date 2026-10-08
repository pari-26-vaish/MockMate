import api from "./api";

export const createMockPayment = async (amount, credits) => {
  const response = await api.post(
    "/payment/create-checkout-session",
    {
      amount,
      credits,
    }
  );

  return response.data;
};