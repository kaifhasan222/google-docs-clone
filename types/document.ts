export type JsonPrimitive = string | number | boolean | null
export type JsonValue = JsonPrimitive | JsonObject | JsonValue[]
export interface JsonObject {
  [key: string]: JsonValue
}

export interface Document {
  id: string
  title: string
  content: JsonValue[]
  user_id: string
  created_at: string
  updated_at: string
}

export interface DocumentCreate {
  title: string
  content?: JsonValue[]
  user_id: string
}

export interface DocumentUpdate {
  title?: string
  content?: JsonValue[]
  updated_at?: string
}
