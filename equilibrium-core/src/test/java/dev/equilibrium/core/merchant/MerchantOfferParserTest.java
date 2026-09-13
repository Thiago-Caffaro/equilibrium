package dev.equilibrium.core.merchant;

import com.google.gson.JsonParser;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertThrows;

class MerchantOfferParserTest {
    @Test
    void rejectsFailureRuleThatWouldNotConsumeInputs() {
        String offer = """
                {
                  "schema_version": 1,
                  "id": "equilibrium:test_offer",
                  "input": { "item": "minecraft:bread", "count": 1 },
                  "output": { "item": "minecraft:emerald", "count": 1 },
                  "chance": 0.5,
                  "failure": { "consume_inputs": false }
                }
                """;

        assertThrows(IllegalArgumentException.class,
                () -> MerchantOfferParser.parse(JsonParser.parseString(offer)));
    }

    @Test
    void rejectsMasteryLevelTheTemporaryRuntimeCannotAuthorize() {
        String offer = """
                {
                  "schema_version": 1,
                  "id": "equilibrium:test_offer",
                  "input": { "item": "minecraft:bread", "count": 1 },
                  "output": { "item": "minecraft:emerald", "count": 1 },
                  "chance": 0.5,
                  "required_mastery": 2,
                  "failure": { "consume_inputs": true }
                }
                """;

        assertThrows(IllegalArgumentException.class,
                () -> MerchantOfferParser.parse(JsonParser.parseString(offer)));
    }
}
