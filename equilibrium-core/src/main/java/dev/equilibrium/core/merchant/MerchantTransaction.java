package dev.equilibrium.core.merchant;

/** Computes the safe quantities for one Merchant transaction before inventory mutation. */
public final class MerchantTransaction {
    public static final int MAX_BATCH = 64;

    private MerchantTransaction() { }

    public static Plan preflight(MerchantOffer offer, int amount) {
        if (amount < 1 || amount > MAX_BATCH) {
            return Plan.rejected("INVALID_AMOUNT");
        }
        if (offer.inputCount() > Integer.MAX_VALUE / amount || offer.outputCount() > Integer.MAX_VALUE / amount) {
            return Plan.rejected("OVERFLOW");
        }
        return Plan.accepted(offer.inputCount() * amount, offer.outputCount() * amount);
    }

    public record Plan(String rejection, int inputToConsume, int outputToDeliver) {
        private static Plan accepted(int inputToConsume, int outputToDeliver) {
            return new Plan(null, inputToConsume, outputToDeliver);
        }

        private static Plan rejected(String rejection) {
            return new Plan(rejection, 0, 0);
        }

        public boolean accepted() {
            return rejection == null;
        }
    }
}
