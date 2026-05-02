export type AxonHoverEntry = {
  label: string;
  detail: string;
  example?: string;
};

export const AXON_HOVERS: Record<string, AxonHoverEntry> = {
  debugType: {
    label: "debugType",
    detail: "Runtime type string. Use this for Axon type checks instead of JavaScript-style typeof.",
    example: 'val.debugType == "sys::Date"',
  },
  readAll: {
    label: "readAll(filter[, opts])",
    detail: "Reads matching records into a grid. Use opts such as {limit: 1000}; stream-only methods like limit() belong on readAllStream().",
    example: 'readAll(point and his and kind == "Number", {limit: 1000})',
  },
  readAllStream: {
    label: "readAllStream(filter)",
    detail: "Streams matching records. Use stream methods like limit(...).collect() here, not on readAll(...).",
    example: 'readAllStream(point and his).limit(10).collect()',
  },
  parseFilter: {
    label: "parseFilter(str)",
    detail: "Parses a filter string into a filter expression for programmatic filtering.",
    example: 'parseFilter("point and his")',
  },
  filterToFunc: {
    label: "filterToFunc(filter)",
    detail: "Converts a filter expression into a predicate function. Useful when applying Haystack filters in code.",
  },
  fold: {
    label: "fold",
    detail: "Reduction/aggregation pattern for collections. Prefer it when accumulating a value across a list or grid-derived list.",
  },
  na: {
    label: "na()",
    detail: "Represents not-available. It is distinct from null, so do not treat na() and null as interchangeable.",
  },
  toSpan: {
    label: "toSpan(...) —— named span or explicit dates",
    detail: 'Known named strings include "today", "yesterday", "thisWeek", "lastWeek", "thisMonth", "lastMonth", "thisQuarter", "lastQuarter", "thisYear", and "lastYear". Rolling strings like "last7days" are not valid.',
    example: "toSpan(today() - 90day, today())",
  },
};
