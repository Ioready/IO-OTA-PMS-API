export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  DECEASED = "deceased",
  TERMINATED = "terminated"
}
export enum CommonStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}
export enum UserType {
  ADMIN = "admin",
  USER = "user",
  HOUSEKEEPING = "housekeeping"
}

export enum LoginType {
  GOOGLE = "google",
  NORMAL = "normal"
}

export enum ModuleName {
  USER = "user",
  PROPERTY = "property",
  ROLE = "role",
  FLOOR = "floor",
  ROOM_TYPE = "roomType",
  RATE_PLAN = "ratePlan",
  ROOM = "room",
  RECENT_SEARCH = "recentSearch",
  LOST_FOUND = "lostAndFound"
}

export enum CheckPropertyUrl {
  DASHBOARD = "dashboard",
  PROPERTY = "property"
}

export enum LostAndFoundStatus {
  FOUND = "found",
  RETURNED = "returned",
  UNCLAIMED = "unclaimed"
}

export enum RoomStatus {
  DIRTY = "dirty",
  DEEP_CLEAN = "deep-clean",
  ACTIVE = "active",
  INACTIVE = "inactive",
  COMPLETED = "completed",
}
