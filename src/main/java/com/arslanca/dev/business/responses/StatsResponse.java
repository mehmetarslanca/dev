package com.arslanca.dev.business.responses;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StatsResponse {

    private Boolean isCodingNow;


    private String ideName;
    private String projectName;
    private String currentlyEditingFile;
    private String lastActiveTime;

    private String totalSpentOnCurrentProject;
    private String totalSpentOnAllProjects;
}
