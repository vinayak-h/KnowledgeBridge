package com.knowledgebridge;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(HandoverController.class)
class KnowledgeBridgeApplicationTests {

    @Autowired
    private MockMvc mvc;

    @MockitoBean
    private HandoverRepository repo;

    @Test
    void unknownHandoverReturnsNotFound() throws Exception {
        when(repo.findById(any())).thenReturn(Optional.empty());
        mvc.perform(get("/api/handovers/99"))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.error").value("Handover 99 not found"));
    }

    @Test
    void unknownRouteReturnsNotFound() throws Exception {
        mvc.perform(get("/api/nope")).andExpect(status().isNotFound());
    }

    @Test
    void unsupportedMethodReturnsMethodNotAllowed() throws Exception {
        mvc.perform(patch("/api/handovers/1")).andExpect(status().isMethodNotAllowed());
    }

    @Test
    void blankTitleIsRejectedWithFieldMessage() throws Exception {
        mvc.perform(
            post("/api/handovers").contentType("application/json").content("{\"title\":\" \",\"creator\":\"Alice\"}")
        )
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.error").value("title must not be blank"));
    }

    @Test
    void deleteUnknownHandoverReturnsNotFound() throws Exception {
        when(repo.findById(any())).thenReturn(Optional.empty());
        mvc.perform(delete("/api/handovers/7")).andExpect(status().isNotFound());
    }
}
