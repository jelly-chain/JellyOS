// API barrel exports
export type { Static, TObject, TSchema } from "@sinclair/typebox";
export {
  Type,
  type ExtensionAPI,
  type ExtensionModule,
  type CommandDef,
  type CommandContext,
  type UIContext,
  type ToolDef,
  type ToolContent,
  type SkillDef,
  type SessionEvent,
  type SessionContext,
  text,
} from "./ExtensionAPI";
export { Registry } from "./Registry";