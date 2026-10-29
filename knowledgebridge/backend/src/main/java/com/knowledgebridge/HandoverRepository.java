package com.knowledgebridge;

import java.util.Locale;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface HandoverRepository extends JpaRepository<Handover, Long> {

    @Query("""
                SELECT h FROM Handover h
                WHERE (COALESCE(:search, '') = '' OR
                       LOWER(h.title) LIKE LOWER(CONCAT('%', :search, '%')) OR
                       LOWER(h.creator) LIKE LOWER(CONCAT('%', :search, '%')) OR
                       LOWER(h.recipient) LIKE LOWER(CONCAT('%', :search, '%')) OR
                       LOWER(h.summary) LIKE LOWER(CONCAT('%', :search, '%')))
                AND (COALESCE(:status, '') = '' OR UPPER(:status) = 'ALL' OR UPPER(h.status) = UPPER(:status))
                AND (COALESCE(:type, '') = '' OR UPPER(:type) = 'ALL' OR UPPER(h.type) = UPPER(:type))
            """)
    Page<Handover> findWithFilters(
            @Param("search") String search,
            @Param("status") String status,
            @Param("type") String type,
            Pageable pageable);
}
