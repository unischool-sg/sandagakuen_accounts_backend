import { describe, it, expect, vi, beforeEach } from "vitest"
import { Google } from "google-oauth-lib"
import { CallbackService } from "./service"
import { verifyToken } from "../../../libs/jwt"

// Mock google-oauth-lib
vi.mock("google-oauth-lib", () => {
  const tokenMock = vi.fn()
  const profileMock = vi.fn()
  const MockGoogle = {
    OAuth: vi.fn().mockImplementation(() => {
      return {
        oauth: {
          token: tokenMock,
        },
        user: {
          profile: profileMock,
        },
        accessToken: "",
      }
    })
  }
  return { Google: MockGoogle }
})

describe("CallbackService", () => {
  let mockDb: any
  let client: any
  const jwtSecret = "test-jwt-secret"

  beforeEach(() => {
    vi.clearAllMocks()

    // Mock Drizzle DB chain
    const mockExecute = vi.fn()
    const mockWhere = vi.fn().mockReturnValue({ execute: mockExecute })
    const mockFrom = vi.fn().mockReturnValue({ where: mockWhere })
    const mockSelect = vi.fn().mockReturnValue({ from: mockFrom })
    const mockValues = vi.fn().mockReturnValue({ execute: vi.fn() })
    const mockInsert = vi.fn().mockReturnValue({ values: mockValues })

    mockDb = {
      select: mockSelect,
      insert: mockInsert,
    } as any

    client = Google.OAuth({ clientId: "test", clientSecret: "test" })
  })

  it("registers a new user and generates JWT when email does not exist", async () => {
    // Setup google client mock values
    client.oauth.token.mockResolvedValue({ id_token: "mock-id-token" })
    client.user.profile.mockResolvedValue({ email: "new@example.com", name: "New User", avatar: "http://avatar" })

    // Setup db mock values:
    // First query (findUser) returns empty array (user doesn't exist)
    // Second query (findUser after insert) returns the inserted user
    const mockUserRecord = {
      id: "uuid-123",
      username: "new@example.com",
      email: "new@example.com",
      name: "New User",
      emailVerified: false,
      avatarUrl: "http://avatar",
      role: "user",
      status: "suspended",
      isBanned: false,
      permissionBitfield: "0",
      createdAt: new Date(),
      updatedAt: new Date()
    }
    const executeMock = mockDb.select().from().where().execute as any
    executeMock
      .mockResolvedValueOnce([]) // First select (findUser) -> not found
      .mockResolvedValueOnce([mockUserRecord]) // Second select (findUser after insert) -> returns created user

    const [result, code] = await CallbackService.show({ code: "google-auth-code", state: "test-state" }, mockDb, client, jwtSecret)

    expect(code).toBe(200)
    expect(result.error).toBe(false)
    if (!result.error) {
      expect(result.data.user.email).toBe("new@example.com")
      expect(result.data.token).toBeDefined()

      // Verify JWT token payload
      const payload = await verifyToken(result.data.token, jwtSecret)
      expect(payload.id).toBe("uuid-123")
      expect(payload.email).toBe("new@example.com")
      expect(payload.role).toBe("user")
    }
  })

  it("authenticates and generates JWT when email already exists", async () => {
    // Setup google client mock values
    client.oauth.token.mockResolvedValue({ id_token: "mock-id-token" })
    client.user.profile.mockResolvedValue({ email: "existing@example.com", name: "Existing User", avatar: "http://avatar" })

    // Setup db mock values:
    // First query returns the existing user (length > 0)
    const mockUserRecord = {
      id: "existing-uuid",
      username: "existing@example.com",
      email: "existing@example.com",
      name: "Existing User",
      emailVerified: true,
      avatarUrl: "http://avatar",
      role: "admin",
      status: "enrolled",
      isBanned: false,
      permissionBitfield: "1",
      createdAt: new Date(),
      updatedAt: new Date()
    }
    const executeMock = mockDb.select().from().where().execute as any
    executeMock.mockResolvedValueOnce([mockUserRecord])

    const [result, code] = await CallbackService.show({ code: "google-auth-code", state: "test-state" }, mockDb, client, jwtSecret)

    expect(code).toBe(200)
    expect(result.error).toBe(false)
    if (!result.error) {
      expect(result.data.user.id).toBe("existing-uuid")
      expect(result.data.user.role).toBe("admin")
      expect(result.data.token).toBeDefined()

      // Verify JWT token payload
      const payload = await verifyToken(result.data.token, jwtSecret)
      expect(payload.id).toBe("existing-uuid")
      expect(payload.email).toBe("existing@example.com")
      expect(payload.role).toBe("admin")
    }

    // Verify insert was NOT called (since user existed)
    expect(mockDb.insert).not.toHaveBeenCalled()
  })
})
