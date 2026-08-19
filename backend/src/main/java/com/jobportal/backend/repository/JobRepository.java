package com.jobportal.backend.repository;

import com.jobportal.backend.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByEmployerId(Long employerId);

    @Query("SELECT j FROM Job j WHERE " +
           "(:keyword IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(j.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:jobType IS NULL OR LOWER(j.jobType) = LOWER(:jobType)) AND " +
           "(:experienceLevel IS NULL OR LOWER(j.experienceLevel) = LOWER(:experienceLevel)) AND " +
           "(:minSalary IS NULL OR j.salary >= :minSalary)")
    List<Job> searchJobs(
        @Param("keyword") String keyword,
        @Param("location") String location,
        @Param("jobType") String jobType,
        @Param("experienceLevel") String experienceLevel,
        @Param("minSalary") Double minSalary
    );
}
