"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApproveRequestStatus = exports.lessonMode = exports.mediaType = exports.language = void 0;
var language;
(function (language) {
    language["EN"] = "en";
    language["VI"] = "vi";
})(language = exports.language || (exports.language = {}));
var mediaType;
(function (mediaType) {
    mediaType["IMAGE"] = "IMAGE";
    mediaType["VIDEO"] = "VIDEO";
    mediaType["FILE"] = "FILE";
})(mediaType = exports.mediaType || (exports.mediaType = {}));
var lessonMode;
(function (lessonMode) {
    lessonMode["ANYONE"] = "ANYONE";
    lessonMode["STUDENTS"] = "STUDENTS";
    lessonMode["ONLY_OWNER"] = "ONLY_OWNER";
})(lessonMode = exports.lessonMode || (exports.lessonMode = {}));
var ApproveRequestStatus;
(function (ApproveRequestStatus) {
    ApproveRequestStatus["PENDING"] = "PENDING";
    ApproveRequestStatus["APPROVED"] = "APPROVED";
    ApproveRequestStatus["REJECTED"] = "REJECTED";
})(ApproveRequestStatus = exports.ApproveRequestStatus || (exports.ApproveRequestStatus = {}));
//# sourceMappingURL=enum.js.map