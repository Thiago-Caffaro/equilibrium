package dev.equilibrium.core.future;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class VersionedStateTest {
    @Test
    void retainsAValidSchemaVersionAndPayload() {
        VersionedState<String> state = new VersionedState<>(1, "state");

        assertEquals(1, state.schemaVersion());
        assertEquals("state", state.value());
    }

    @Test
    void rejectsSchemaVersionZeroBeforeAnyPersistentStateExists() {
        assertThrows(IllegalArgumentException.class, () -> new VersionedState<>(0, "state"));
    }
}
