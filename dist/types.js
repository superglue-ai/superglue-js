"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationType = exports.DecompressionMethod = exports.AuthType = exports.FileType = exports.CacheMode = exports.HttpMethod = void 0;
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
var CacheMode;
(function (CacheMode) {
    CacheMode["ENABLED"] = "ENABLED";
    CacheMode["READONLY"] = "READONLY";
    CacheMode["WRITEONLY"] = "WRITEONLY";
    CacheMode["DISABLED"] = "DISABLED";
})(CacheMode || (exports.CacheMode = CacheMode = {}));
var FileType;
(function (FileType) {
    FileType["CSV"] = "CSV";
    FileType["JSON"] = "JSON";
    FileType["XML"] = "XML";
    FileType["AUTO"] = "AUTO";
})(FileType || (exports.FileType = FileType = {}));
var AuthType;
(function (AuthType) {
    AuthType["NONE"] = "NONE";
    AuthType["OAUTH2"] = "OAUTH2";
    AuthType["HEADER"] = "HEADER";
    AuthType["QUERY_PARAM"] = "QUERY_PARAM";
})(AuthType || (exports.AuthType = AuthType = {}));
var DecompressionMethod;
(function (DecompressionMethod) {
    DecompressionMethod["GZIP"] = "GZIP";
    DecompressionMethod["DEFLATE"] = "DEFLATE";
    DecompressionMethod["NONE"] = "NONE";
    DecompressionMethod["AUTO"] = "AUTO";
    DecompressionMethod["ZIP"] = "ZIP";
})(DecompressionMethod || (exports.DecompressionMethod = DecompressionMethod = {}));
var PaginationType;
(function (PaginationType) {
    PaginationType["OFFSET_BASED"] = "OFFSET_BASED";
    PaginationType["PAGE_BASED"] = "PAGE_BASED";
    PaginationType["DISABLED"] = "DISABLED";
})(PaginationType || (exports.PaginationType = PaginationType = {}));
//# sourceMappingURL=types.js.map