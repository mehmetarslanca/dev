package com.arslanca.dev.business.dto.responses;

import java.util.List;

public record GithubContributionsResponse(int totalContributions, List<ContributionDay> days) {
}