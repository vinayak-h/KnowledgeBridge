package com.knowledgebridge;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import java.io.*;
import java.util.*;
import java.util.stream.*;
import org.apache.poi.xwpf.usermodel.*;
import org.hibernate.Hibernate;
import org.springframework.http.*;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

record HandoverInput(
    @NotBlank String title,
    String type,
    @NotBlank String creator,
    String recipient,
    java.time.LocalDate startDate,
    java.time.LocalDate endDate,
    String summary,
    String status,
    List<WorkInput> workItems,
    List<KnowledgeInput> knowledgeEntries,
    List<LinkInput> referenceLinks
) {}

record WorkInput(
    String title,
    String description,
    String status,
    String owner,
    java.time.LocalDate dueDate,
    String blocker,
    String completedWork,
    String nextAction
) {}

record KnowledgeInput(String type, String title, String content) {}

record LinkInput(String label, String url) {}

@RestController
@RequestMapping("/api/handovers")
@CrossOrigin(origins = "http://localhost:5173")
public class HandoverController {

    private final HandoverRepository repo;

    public HandoverController(HandoverRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    @Transactional(readOnly = true)
    public List<Handover> all() {
        List<Handover> items = repo.findAll(
            org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "updatedAt")
        );
        items.forEach(this::initializeCollections);
        return items;
    }

    @GetMapping("/{id}")
    @Transactional(readOnly = true)
    public Handover get(@PathVariable Long id) {
        Handover h = find(id);
        initializeCollections(h);
        return h;
    }

    @PostMapping
    @Transactional
    public ResponseEntity<Handover> create(@Valid @RequestBody HandoverInput in) {
        Handover h = new Handover();
        apply(h, in);
        Handover saved = repo.save(h);
        initializeCollections(saved);
        return ResponseEntity.status(201).body(saved);
    }

    @PutMapping("/{id}")
    @Transactional
    public Handover update(@PathVariable Long id, @Valid @RequestBody HandoverInput in) {
        Handover h = find(id);
        apply(h, in);
        Handover saved = repo.save(h);
        initializeCollections(saved);
        return saved;
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        repo.delete(find(id));
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/completeness")
    @Transactional(readOnly = true)
    public Map<String, Object> completeness(@PathVariable Long id) {
        Handover h = find(id);
        List<Map<String, String>> f = new ArrayList<>();
        if (blank(h.recipient)) add(f, "WARNING", "Add a recipient.");
        if (blank(h.summary)) add(f, "INFO", "Add a short summary.");
        if (h.workItems.isEmpty()) add(f, "WARNING", "Add work items or confirm that none are pending.");
        for (WorkItem w : h.workItems) {
            if (blank(w.owner)) add(f, "WARNING", w.title + ": owner is missing.");
            if (!"COMPLETED".equals(w.status) && blank(w.nextAction)) add(
                f,
                "WARNING",
                w.title + ": next action is missing."
            );
            if ("BLOCKED".equals(w.status) && blank(w.blocker)) add(
                f,
                "WARNING",
                w.title + ": blocker details are missing."
            );
            if (!"COMPLETED".equals(w.status) && w.dueDate == null) add(f, "INFO", w.title + ": due date is missing.");
        }
        long warnings = f
            .stream()
            .filter(x -> "WARNING".equals(x.get("severity")))
            .count();
        return Map.of("ready", warnings == 0, "warningCount", warnings, "findings", f);
    }

    @GetMapping("/{id}/export")
    @Transactional(readOnly = true)
    public ResponseEntity<byte[]> export(@PathVariable Long id) throws IOException {
        Handover h = find(id);
        try (XWPFDocument d = new XWPFDocument(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            para(d, h.title, "Title");
            para(d, "Creator: " + s(h.creator) + " | Recipient: " + s(h.recipient), null);
            para(d, "Period: " + s(h.startDate) + " to " + s(h.endDate), null);
            para(d, "Overview", "Heading1");
            para(d, s(h.summary), null);
            para(d, "Work items", "Heading1");
            for (WorkItem w : h.workItems) {
                para(d, w.title, "Heading2");
                para(d, "Status: " + s(w.status) + " | Owner: " + s(w.owner) + " | Due: " + s(w.dueDate), null);
                para(d, "Description: " + s(w.description), null);
                para(d, "Completed: " + s(w.completedWork), null);
                para(d, "Blocker: " + s(w.blocker), null);
                para(d, "Next action: " + s(w.nextAction), null);
            }
            para(d, "Knowledge entries", "Heading1");
            for (KnowledgeEntry k : h.knowledgeEntries) {
                para(d, s(k.type) + ": " + s(k.title), "Heading2");
                para(d, s(k.content), null);
            }
            para(d, "References", "Heading1");
            for (ReferenceLink l : h.referenceLinks) para(d, s(l.label) + ": " + s(l.url), null);
            d.write(out);
            return ResponseEntity.ok()
                .contentType(
                    MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.wordprocessingml.document")
                )
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=handover-" + id + ".docx")
                .body(out.toByteArray());
        }
    }

    // The generated document has no styles part, so heading styles are applied directly to the run.
    private void para(XWPFDocument d, String text, String style) {
        XWPFRun run = d.createParagraph().createRun();
        run.setText(text == null ? "" : text);
        if (style != null) {
            run.setBold(true);
            run.setFontSize(
                switch (style) {
                    case "Title" -> 20;
                    case "Heading1" -> 16;
                    default -> 13;
                }
            );
        }
    }

    private Handover find(Long id) {
        return repo.findById(id).orElseThrow(() -> new EntityNotFoundException("Handover " + id + " not found"));
    }

    private void initializeCollections(Handover h) {
        Hibernate.initialize(h.workItems);
        Hibernate.initialize(h.knowledgeEntries);
        Hibernate.initialize(h.referenceLinks);
    }

    private void apply(Handover h, HandoverInput x) {
        h.title = x.title().trim();
        h.type = or(x.type(), "PROJECT_TRANSITION");
        h.creator = x.creator().trim();
        h.recipient = x.recipient();
        h.startDate = x.startDate();
        h.endDate = x.endDate();
        h.summary = x.summary();
        h.status = or(x.status(), "DRAFT");
        Handover c = new Handover();
        c.workItems =
            x.workItems() == null
                ? new ArrayList<>()
                : x
                      .workItems()
                      .stream()
                      .map(a -> {
                          WorkItem w = new WorkItem();
                          w.title = or(a.title(), "Untitled work item");
                          w.description = a.description();
                          w.status = or(a.status(), "NOT_STARTED");
                          w.owner = a.owner();
                          w.dueDate = a.dueDate();
                          w.blocker = a.blocker();
                          w.completedWork = a.completedWork();
                          w.nextAction = a.nextAction();
                          return w;
                      })
                      .collect(Collectors.toCollection(ArrayList::new));
        c.knowledgeEntries =
            x.knowledgeEntries() == null
                ? new ArrayList<>()
                : x
                      .knowledgeEntries()
                      .stream()
                      .map(a -> {
                          KnowledgeEntry k = new KnowledgeEntry();
                          k.type = or(a.type(), "GENERAL");
                          k.title = or(a.title(), "Untitled entry");
                          k.content = a.content();
                          return k;
                      })
                      .collect(Collectors.toCollection(ArrayList::new));
        c.referenceLinks =
            x.referenceLinks() == null
                ? new ArrayList<>()
                : x
                      .referenceLinks()
                      .stream()
                      .map(a -> {
                          ReferenceLink l = new ReferenceLink();
                          l.label = or(a.label(), "Reference");
                          l.url = or(a.url(), "");
                          return l;
                      })
                      .collect(Collectors.toCollection(ArrayList::new));
        h.children(c);
    }

    private boolean blank(String s) {
        return s == null || s.isBlank();
    }

    private String or(String a, String b) {
        return blank(a) ? b : a;
    }

    private String s(Object x) {
        return x == null ? "Not provided" : x.toString();
    }

    private void add(List<Map<String, String>> f, String severity, String message) {
        f.add(Map.of("severity", severity, "message", message));
    }
}
