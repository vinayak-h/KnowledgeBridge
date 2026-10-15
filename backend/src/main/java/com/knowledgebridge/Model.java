package com.knowledgebridge;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.*;
import java.util.*;

@Entity
@Table(name = "handovers")
class Handover {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(nullable = false)
    public String title;

    public String type = "PROJECT_TRANSITION";

    @Column(nullable = false)
    public String creator;

    public String recipient;
    public LocalDate startDate, endDate;

    @Column(length = 4000)
    public String summary;

    public String status = "DRAFT";
    public LocalDateTime createdAt, updatedAt;

    @OneToMany(mappedBy = "handover", cascade = CascadeType.ALL, orphanRemoval = true)
    public List<WorkItem> workItems = new ArrayList<>();

    @OneToMany(mappedBy = "handover", cascade = CascadeType.ALL, orphanRemoval = true)
    public List<KnowledgeEntry> knowledgeEntries = new ArrayList<>();

    @OneToMany(mappedBy = "handover", cascade = CascadeType.ALL, orphanRemoval = true)
    public List<ReferenceLink> referenceLinks = new ArrayList<>();

    @PrePersist
    void create() {
        createdAt = updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    void update() {
        updatedAt = LocalDateTime.now();
    }

    void children(Handover x) {
        workItems.clear();
        knowledgeEntries.clear();
        referenceLinks.clear();
        if (x.workItems != null) x.workItems.forEach(w -> {
            w.id = null;
            w.handover = this;
            workItems.add(w);
        });
        if (x.knowledgeEntries != null) x.knowledgeEntries.forEach(k -> {
            k.id = null;
            k.handover = this;
            knowledgeEntries.add(k);
        });
        if (x.referenceLinks != null) x.referenceLinks.forEach(l -> {
            l.id = null;
            l.handover = this;
            referenceLinks.add(l);
        });
    }
}

@Entity
@Table(name = "work_items")
class WorkItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(nullable = false)
    public String title;

    @Column(length = 3000)
    public String description;

    public String status = "NOT_STARTED",
        owner;
    public LocalDate dueDate;

    @Column(length = 2000)
    public String blocker, completedWork, nextAction;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "handover_id", nullable = false)
    public Handover handover;
}

@Entity
@Table(name = "knowledge_entries")
class KnowledgeEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    public String type = "GENERAL",
        title;

    @Column(length = 5000)
    public String content;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "handover_id", nullable = false)
    public Handover handover;
}

@Entity
@Table(name = "reference_links")
class ReferenceLink {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    public String label;

    @Column(length = 1500)
    public String url;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "handover_id", nullable = false)
    public Handover handover;
}
