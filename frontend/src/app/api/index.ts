import axios from 'axios';

const client = axios.create({
  baseURL: '/api',
});

// Response Types matches Backend DTOs
export interface SendMailRequest {
  senderEmail: string;
  subject: string;
  message: string;
}

export interface GithubRepoResponse {
  name: string;
  description: string;
  html_url: string; // mapped from url in backend
  stargazers_count: string; // mapped from stars
  language: string;
}

export interface StatsResponse {
  isCodingNow: boolean;
  ideName: string;
  projectName: string;
  currentlyEditingFile: string;
  lastActiveTime: string;
  totalSpentOnCurrentProject: string;
  totalSpentOnAllProjects: string;
}

export interface BlogPost {
  id: number;
  title: string;
  content: string;
  createdDate: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface SimulationScenarioResponse {
  id: string;
  title: string;
  description: string;
  systemState: {
    cpuLoad: number;
    latency: number;
    memoryUsage: number;
  };
  options: {
    id: string;
    title: string;
    description: string;
  }[];
}

export interface VerifySimulationRequest {
  scenarioId: string;
  selectedOptionId: string;
}

export interface VerificationResultResponse {
  success: boolean;
  userLevel: string; // SENIOR, MID, JUNIOR
  message: string;
  redirectPath: string;
}

export interface PinnedProject {
  id: number;
  title: string;
  description: string;
  tags: string[];
  githubUrl?: string;
}

export interface CreatePinnedProjectRequest {
  title: string;
  description: string;
  tags: string[];
  githubUrl?: string;
}

export const api = {
  contact: {
    sendMessage: (data: SendMailRequest) => client.post('/contact', data),
  },
  projects: {
    getAll: (pageNo = 1, pageSize = 10) => client.get<GithubRepoResponse[]>(`/projects?pageNo=${pageNo}&pageSize=${pageSize}`).then((res) => res.data),
  },
    pinnedProjects: {
    getAll: () => client.get<PinnedProject[]>('/pinned-projects').then((res) => res.data),
    add: (data: CreatePinnedProjectRequest, authHeader: string) =>
      client.post('/pinned-projects/admin/add', data, { headers: { 'Authorization': authHeader } }),
    update: (id: number, data: CreatePinnedProjectRequest, authHeader: string) =>
      client.put(`/pinned-projects/admin/update/${id}`, data, { headers: { 'Authorization': authHeader } }),
    delete: (id: number, authHeader: string) =>
      client.delete(`/pinned-projects/admin/delete/${id}`, { headers: { 'Authorization': authHeader } }),
  },
  stats: {
    getCurrent: () => client.get<StatsResponse>('/stats/current').then((res) => res.data),
  },
  blogs: {
    getAll: (pageNo = 1, pageSize = 10) =>
      client.get<PaginatedResponse<BlogPost>>(`/blogs?pageNo=${pageNo}&pageSize=${pageSize}`).then((res) => res.data),
    add: (data: { title: string; content: string }, authHeader: string) =>
      client.post('/blogs', data, { headers: { 'Authorization': authHeader } }),
    update: (id: number, data: { title: string; content: string }, authHeader: string) =>
      client.put(`/blogs/${id}`, data, { headers: { 'Authorization': authHeader } }),
    delete: (id: number, authHeader: string) =>
      client.delete(`/blogs/${id}`, { headers: { 'Authorization': authHeader } }),
  },
  simulation: {
    getRandom: () => client.get<SimulationScenarioResponse>('/simulation/random').then(res => res.data),
    verify: (data: VerifySimulationRequest) => client.post<VerificationResultResponse>('/simulation/verify', data).then(res => res.data)
  },
  admin: {
    verify: (authHeader: string) =>
      client.get('/admin/verify', { headers: { 'Authorization': authHeader } }),
  }
};
