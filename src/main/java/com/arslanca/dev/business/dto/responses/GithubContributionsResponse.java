package com.arslanca.dev.business.dto.responses;

import com.arslanca.dev.business.dto.responses.ContributionDay;

import java.util.List;

public record GithubContributionsResponse(int totalContributions, List<ContributionDay> days) {
}