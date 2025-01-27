"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationType = exports.DecompressionMethod = exports.AuthType = exports.FileType = exports.CacheMode = exports.HttpMethod = void 0;
// HTTP methods supported by superglue
var HttpMethod;
(function (HttpMethod) {
    HttpMethod["GET"] = "GET";
    HttpMethod["POST"] = "POST";
    HttpMethod["PUT"] = "PUT";
    HttpMethod["DELETE"] = "DELETE";
    HttpMethod["PATCH"] = "PATCH";
    HttpMethod["HEAD"] = "HEAD";
    HttpMethod["OPTIONS"] = "OPTIONS";
})(HttpMethod || (exports.HttpMethod = HttpMethod = {}));
// Cache behavior configuration options
var CacheMode;
(function (CacheMode) {
    CacheMode["ENABLED"] = "ENABLED";
    CacheMode["READONLY"] = "READONLY";
    CacheMode["WRITEONLY"] = "WRITEONLY";
    CacheMode["DISABLED"] = "DISABLED"; // No caching
})(CacheMode || (exports.CacheMode = CacheMode = {}));
// Supported file formats for data extraction
var FileType;
(function (FileType) {
    FileType["CSV"] = "CSV";
    FileType["JSON"] = "JSON";
    FileType["XML"] = "XML";
    FileType["AUTO"] = "AUTO"; // Automatically detect file type
})(FileType || (exports.FileType = FileType = {}));
// Authentication methods for API requests
var AuthType;
(function (AuthType) {
    AuthType["NONE"] = "NONE";
    AuthType["OAUTH2"] = "OAUTH2";
    AuthType["HEADER"] = "HEADER";
    AuthType["QUERY_PARAM"] = "QUERY_PARAM"; // Authentication via query parameters
})(AuthType || (exports.AuthType = AuthType = {}));
// Supported decompression methods for compressed data
var DecompressionMethod;
(function (DecompressionMethod) {
    DecompressionMethod["GZIP"] = "GZIP";
    DecompressionMethod["DEFLATE"] = "DEFLATE";
    DecompressionMethod["NONE"] = "NONE";
    DecompressionMethod["AUTO"] = "AUTO";
    DecompressionMethod["ZIP"] = "ZIP";
})(DecompressionMethod || (exports.DecompressionMethod = DecompressionMethod = {}));
// Pagination strategies
var PaginationType;
(function (PaginationType) {
    PaginationType["OFFSET_BASED"] = "OFFSET_BASED";
    PaginationType["PAGE_BASED"] = "PAGE_BASED";
    PaginationType["DISABLED"] = "DISABLED"; // No pagination
})(PaginationType || (exports.PaginationType = PaginationType = {}));
//# sourceMappingURL=types.js.map