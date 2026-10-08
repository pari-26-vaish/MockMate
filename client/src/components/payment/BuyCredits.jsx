import { useState } from "react";
import { CreditCard, Zap } from "lucide-react";
import { createMockPayment } from "../../services/paymentService";

const BuyCredits = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleBuyCredits = async () => {
    try {
      setLoading(true);
      setMessage("");

      const data = await createMockPayment(99, 5);

      setMessage(
        `Payment successful! ${data.creditsAdded} credits added.`
      );
    } catch (error) {
      console.error("Payment error:", error);

      setMessage("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-lg">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-xl bg-cyan-500/10 p-3">
          <CreditCard className="h-6 w-6 text-cyan-400" />
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white">
            Get More Credits
          </h2>

          <p className="text-sm text-slate-400">
            Continue your AI interview practice
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">Starter Pack</p>

            <h3 className="mt-1 text-2xl font-bold text-white">
              5 Credits
            </h3>
          </div>

          <Zap className="h-7 w-7 text-yellow-400" />
        </div>

        <p className="mb-5 text-sm text-slate-400">
          Practice 5 more AI-powered interviews.
        </p>

        <button
          onClick={handleBuyCredits}
          disabled={loading}
          className="w-full rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Processing..." : "Buy for ₹99"}
        </button>

        {message && (
          <p className="mt-4 text-center text-sm text-cyan-400">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default BuyCredits;