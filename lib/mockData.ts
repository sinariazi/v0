export const mockSurveys = [
  {
    id: "1",
    userId: "user1",
    organizationId: "org1",
    question1Score: 8,
    question2Score: 7,
    question3Score: 9,
    engagementScore: 8,
    createdAt: new Date("2023-01-01T00:00:00Z"),
  },
  {
    id: "2",
    userId: "user2",
    organizationId: "org1",
    question1Score: 6,
    question2Score: 8,
    question3Score: 7,
    engagementScore: 7,
    createdAt: new Date("2023-01-02T00:00:00Z"),
  },
  {
    id: "3",
    userId: "user3",
    organizationId: "org2",
    question1Score: 9,
    question2Score: 9,
    question3Score: 8,
    engagementScore: 8.67,
    createdAt: new Date("2023-01-03T00:00:00Z"),
  },
];

export const mockUsers = [
  {
    id: "user1",
    email: "user1@example.com",
    organizationId: "org1",
  },
  {
    id: "user2",
    email: "user2@example.com",
    organizationId: "org1",
  },
  {
    id: "user3",
    email: "user3@example.com",
    organizationId: "org2",
  },
];

export const mockOrganizations = [
  {
    id: "org1",
    name: "TechCorp",
  },
  {
    id: "org2",
    name: "InnovateCo",
  },
];
