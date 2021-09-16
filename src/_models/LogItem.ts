export interface LogItem {
    datetime: string;
    log: string;
    type: "error" | "warn" | "info" | "http" | "verbose" | "debug" | "silly";
}